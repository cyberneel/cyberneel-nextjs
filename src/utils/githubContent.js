// Writes .mdx content to the repo via the GitHub REST API. Used for
// production saves (Vercel's filesystem is read-only), where each change is
// committed onto a dedicated branch and surfaced as a pull request.
//
// Required env: GITHUB_TOKEN (contents + pull_requests write).
// Optional env: GITHUB_REPO (default "cyberneel/cyberneel-nextjs"),
//               GITHUB_DEFAULT_BRANCH (else the repo's actual default branch).

const API = 'https://api.github.com';

function repo() {
  return process.env.GITHUB_REPO || 'cyberneel/cyberneel-nextjs';
}

let _defaultBranch;
// Branch that PRs target. Honor the env override; otherwise ask GitHub for the
// repo's real default branch (works whether that's "master" or "main").
async function baseBranch() {
  if (process.env.GITHUB_DEFAULT_BRANCH) return process.env.GITHUB_DEFAULT_BRANCH;
  if (_defaultBranch) return _defaultBranch;
  try {
    const data = await gh(`/repos/${repo()}`);
    _defaultBranch = data.default_branch || 'master';
  } catch {
    _defaultBranch = 'master';
  }
  return _defaultBranch;
}

export function githubConfigured() {
  return Boolean(process.env.GITHUB_TOKEN);
}

async function gh(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(data.message || `GitHub API ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const branchFor = (type, slug) => `studio/${type}-${slug}`;
const pathFor = (type, slug) => `data/${type}/${slug}.mdx`;

async function refSha(branch) {
  try {
    const data = await gh(`/repos/${repo()}/git/ref/heads/${encodeURIComponent(branch)}`);
    return data.object.sha;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function ensureBranch(branch) {
  if (await refSha(branch)) return;
  const base = await baseBranch();
  const baseSha = await refSha(base);
  if (!baseSha) throw new Error(`Base branch "${base}" not found.`);
  await gh(`/repos/${repo()}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
  });
}

async function fileShaOnBranch(path, branch) {
  try {
    const data = await gh(`/repos/${repo()}/contents/${path}?ref=${encodeURIComponent(branch)}`);
    return data.sha;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function ensurePr(branch, title) {
  const owner = repo().split('/')[0];
  const open = await gh(
    `/repos/${repo()}/pulls?head=${owner}:${encodeURIComponent(branch)}&state=open`
  );
  if (open.length) return open[0];
  return gh(`/repos/${repo()}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      head: branch,
      base: await baseBranch(),
      body: 'Created via the Content Studio admin.',
    }),
  });
}

export async function commitFileViaPR({ type, slug, fileContent, message, path: pathOverride, branch: branchOverride, prTitle }) {
  const branch = branchOverride || branchFor(type, slug);
  const path = pathOverride || pathFor(type, slug);

  await ensureBranch(branch);
  const sha = await fileShaOnBranch(path, branch);

  await gh(`/repos/${repo()}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: message || `studio: update ${path}`,
      content: Buffer.from(fileContent, 'utf-8').toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  const pr = await ensurePr(branch, prTitle || `Studio: ${type}/${slug}`);
  return { prUrl: pr.html_url, prNumber: pr.number, branch };
}

export async function deleteFileViaPR({ type, slug, message }) {
  const branch = branchFor(type, slug);
  const path = pathFor(type, slug);

  await ensureBranch(branch);
  const sha = await fileShaOnBranch(path, branch);
  if (!sha) {
    const err = new Error('File not found on the target branch.');
    err.status = 404;
    throw err;
  }

  await gh(`/repos/${repo()}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({ message: message || `studio: delete ${path}`, sha, branch }),
  });

  const pr = await ensurePr(branch, `Studio: delete ${type}/${slug}`);
  return { prUrl: pr.html_url, prNumber: pr.number, branch };
}
