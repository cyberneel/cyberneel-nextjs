import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { rejectUnauthed } from '../../../src/utils/adminAuth';
import { commitFileViaPR, deleteFileViaPR, githubConfigured } from '../../../src/utils/githubContent';

// Authoring API for the .mdx files under data/blogs and data/posts.
//
// Reads always come from the filesystem (the committed files are present and
// readable in every environment). Writes go to local disk in dev, and to
// GitHub (branch + PR) in production, where the filesystem is read-only.
const VALID_TYPES = ['blogs', 'posts'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Single-file MDX pages that have no frontmatter — edited as raw bodies.
const PAGES = { about: 'data/about.mdx', now: 'data/now.mdx', uses: 'data/uses.mdx' };

// In production, commit through GitHub. STUDIO_FORCE_GITHUB=1 lets you exercise
// the same path locally.
const useGitHub = process.env.NODE_ENV === 'production' || process.env.STUDIO_FORCE_GITHUB === '1';

function dirFor(type) {
  return path.join(process.cwd(), 'data', type);
}

function isValid(type, slug) {
  return VALID_TYPES.includes(type) && SLUG_RE.test(slug || '');
}

function listType(type) {
  const dir = dirFor(type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const source = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data } = matter(source);
      return {
        type,
        slug: file.replace(/\.mdx$/, ''),
        title: data.title || file.replace(/\.mdx$/, ''),
        publishedAt: data.publishedAt || '',
        draft: Boolean(data.draft),
        readingTime: readingTime(source).text,
      };
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function buildFile(frontmatter, content) {
  const clean = {};
  for (const [k, v] of Object.entries(frontmatter)) {
    if (v === '' || v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    clean[k] = v;
  }
  return matter.stringify(`\n${(content || '').trim()}\n`, clean);
}

export default async function handler(req, res) {
  if (rejectUnauthed(req, res)) return;

  // GET ?type=&slug= -> single file; GET -> list everything
  if (req.method === 'GET') {
    const { type, slug } = req.query;
    if (type === 'page' && slug) {
      if (!PAGES[slug]) return res.status(400).json({ error: 'Unknown page.' });
      const filePath = path.join(process.cwd(), PAGES[slug]);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found.' });
      return res.status(200).json({ type: 'page', slug, frontmatter: {}, content: fs.readFileSync(filePath, 'utf-8') });
    }
    if (type && slug) {
      if (!isValid(type, slug)) return res.status(400).json({ error: 'Invalid type or slug.' });
      const filePath = path.join(dirFor(type), `${slug}.mdx`);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found.' });
      const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'));
      return res.status(200).json({ type, slug, frontmatter: data, content });
    }
    return res.status(200).json({ items: [...listType('blogs'), ...listType('posts')], mode: useGitHub ? 'github' : 'disk' });
  }

  // POST -> create or update
  if (req.method === 'POST') {
    const { type, slug, frontmatter = {}, content = '', overwrite = false } = req.body || {};

    // Frontmatter-less single-file pages (e.g. about) — write the raw body.
    if (type === 'page') {
      if (!PAGES[slug]) return res.status(400).json({ error: 'Unknown page.' });
      const rel = PAGES[slug];
      const raw = `${(content || '').trim()}\n`;

      if (useGitHub) {
        if (!githubConfigured()) {
          return res.status(500).json({ error: 'GITHUB_TOKEN is not configured on the server.' });
        }
        try {
          const result = await commitFileViaPR({
            path: rel,
            branch: `studio/page-${slug}`,
            prTitle: `Studio: ${slug} page`,
            fileContent: raw,
            message: `studio: ${slug} page`,
          });
          return res.status(200).json({ ok: true, type: 'page', slug, mode: 'github', ...result });
        } catch (e) {
          return res.status(502).json({ error: `GitHub commit failed: ${e.message}` });
        }
      }

      fs.writeFileSync(path.join(process.cwd(), rel), raw);
      return res.status(200).json({ ok: true, type: 'page', slug, mode: 'disk', path: rel });
    }

    if (!isValid(type, slug)) {
      return res.status(400).json({ error: 'Invalid type or slug (slug must be kebab-case).' });
    }
    if (!frontmatter.title) {
      return res.status(400).json({ error: 'A title is required.' });
    }

    const file = buildFile(frontmatter, content);

    if (useGitHub) {
      if (!githubConfigured()) {
        return res.status(500).json({ error: 'GITHUB_TOKEN is not configured on the server.' });
      }
      try {
        const result = await commitFileViaPR({
          type,
          slug,
          fileContent: file,
          message: `studio: ${type}/${slug}`,
        });
        return res.status(200).json({ ok: true, type, slug, mode: 'github', ...result });
      } catch (e) {
        return res.status(502).json({ error: `GitHub commit failed: ${e.message}` });
      }
    }

    // Local disk
    const dir = dirFor(type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${slug}.mdx`);
    if (fs.existsSync(filePath) && !overwrite) {
      return res.status(409).json({ error: `"${slug}.mdx" already exists in ${type}.`, exists: true });
    }
    fs.writeFileSync(filePath, file);
    return res.status(200).json({ ok: true, type, slug, mode: 'disk', path: `data/${type}/${slug}.mdx` });
  }

  // DELETE ?type=&slug=
  if (req.method === 'DELETE') {
    const { type, slug } = req.query;
    if (!isValid(type, slug)) return res.status(400).json({ error: 'Invalid type or slug.' });

    if (useGitHub) {
      if (!githubConfigured()) {
        return res.status(500).json({ error: 'GITHUB_TOKEN is not configured on the server.' });
      }
      try {
        const result = await deleteFileViaPR({ type, slug, message: `studio: delete ${type}/${slug}` });
        return res.status(200).json({ ok: true, mode: 'github', ...result });
      } catch (e) {
        const code = e.status === 404 ? 404 : 502;
        return res.status(code).json({ error: `GitHub delete failed: ${e.message}` });
      }
    }

    const filePath = path.join(dirFor(type), `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found.' });
    fs.unlinkSync(filePath);
    return res.status(200).json({ ok: true, mode: 'disk' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed.' });
}
