import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { marked } from 'marked';
import { FileText, Image as ImageIcon, ImagePlus, Heading, Bold, Link2, Code2, Plus, Save, Trash2, RefreshCw, Eye, Pencil, LogIn, LogOut, ExternalLink, Lock } from 'lucide-react';

// Pull an attribute value out of a JSX-ish tag's attribute string.
function getAttr(attrs, name) {
  const m = attrs.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`));
  return m ? m[1] : '';
}

// Make the MDX body renderable by `marked` for the live preview: turn the
// custom components into plain HTML the preview pane can show.
function mdxToPreviewHtml(src) {
  let out = src || '';
  // <ImageMDX/> and <Image/> -> <figure><img/><figcaption/></figure>.
  // Tolerates JSX-expression braces ({ … }) and stray spaces (< ImageMDX …).
  out = out.replace(
    /\{?\s*<\s*(?:ImageMDX|Image)\b([^>]*?)\/?>\s*\}?/g,
    (_m, attrs) => {
      const s = getAttr(attrs, 'src');
      if (!s) return '';
      const alt = getAttr(attrs, 'alt');
      const cap = getAttr(attrs, 'caption');
      const width = getAttr(attrs, 'width');
      const style = width ? ` style="max-width:${width};margin-inline:auto"` : '';
      return `\n<figure${style}><img src="${s}" alt="${alt}" />${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>\n`;
    }
  );
  // <TurntableViewer/> -> placeholder block
  out = out.replace(
    /\{?\s*<\s*TurntableViewer\b[^>]*\/?>(?:\s*<\s*\/\s*TurntableViewer\s*>)?\s*\}?/g,
    '<div style="padding:1rem;border:1px dashed currentColor;border-radius:.5rem;opacity:.55;font-size:.85rem">▷ Turntable video</div>'
  );
  // <Font>…</Font> -> keep the inner content
  out = out.replace(/<\s*Font\b[^>]*>/g, '').replace(/<\s*\/\s*Font\s*>/g, '');
  return out;
}

const EMPTY = {
  type: 'blogs',
  slug: '',
  title: '',
  publishedAt: '',
  excerpt: '',
  cover_image_link: '',
  tags: '',
  draft: false,
  content: '',
};

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Admin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY, publishedAt: '' });
  const [editingExisting, setEditingExisting] = useState(false);
  const [editingPage, setEditingPage] = useState(null); // null | 'about'
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState(null); // { kind: 'ok'|'err', msg, url }
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [mode, setMode] = useState('disk'); // 'disk' | 'github'

  // Auth gate (only meaningful in production).
  const [authState, setAuthState] = useState('checking'); // 'checking' | 'in' | 'out'
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const bodyRef = useRef(null);

  const insertAtCursor = (text) => {
    const ta = bodyRef.current;
    const value = form.content;
    const start = ta ? ta.selectionStart : value.length;
    const end = ta ? ta.selectionEnd : value.length;
    set({ content: value.slice(0, start) + text + value.slice(end) });
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + text.length;
    });
  };

  const wrapSelection = (before, after, placeholder) => {
    const ta = bodyRef.current;
    const value = form.content;
    const start = ta ? ta.selectionStart : value.length;
    const end = ta ? ta.selectionEnd : value.length;
    const selected = value.slice(start, end) || placeholder;
    set({ content: value.slice(0, start) + before + selected + after + value.slice(end) });
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    });
  };

  const addImage = () => {
    const url = window.prompt('Image URL (https://…)');
    if (!url) return;
    const alt = (window.prompt('Alt text — describe the image (recommended)') || '').trim();
    const caption = (window.prompt('Caption (optional — leave blank for none)') || '').trim();
    insertAtCursor(
      `\n<ImageMDX src="${url.trim()}" alt="${alt}"${caption ? ` caption="${caption}"` : ''} />\n`
    );
  };

  const loadList = async () => {
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load list');
      setItems(data.items || []);
      if (data.mode) setMode(data.mode);
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    }
  };

  // Check the session on mount; load content once we're authed.
  useEffect(() => {
    setForm((f) => ({ ...f, publishedAt: todayISO() }));
    (async () => {
      try {
        const res = await fetch('/api/admin/login');
        const data = await res.json();
        if (data.authed) {
          setAuthState('in');
          loadList();
        } else {
          setAuthState('out');
        }
      } catch {
        setAuthState('out');
      }
    })();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setAuthState('in');
      setPassword('');
      loadList();
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthState('out');
    setItems([]);
  };

  // Auto-derive slug from the title until the user edits it directly.
  useEffect(() => {
    if (!editingExisting && !slugTouched) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, editingExisting, slugTouched]);

  const newDraft = () => {
    setForm({ ...EMPTY, publishedAt: todayISO() });
    setEditingExisting(false);
    setEditingPage(null);
    setSlugTouched(false);
    setStatus(null);
  };

  const loadItem = async (type, slug) => {
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/posts?type=${type}&slug=${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      const fm = data.frontmatter || {};
      setForm({
        type,
        slug,
        title: fm.title || '',
        publishedAt: fm.publishedAt || '',
        excerpt: fm.excerpt || '',
        cover_image_link: fm.cover_image_link || '',
        tags: Array.isArray(fm.tags) ? fm.tags.join(', ') : fm.tags || '',
        draft: Boolean(fm.draft),
        content: data.content || '',
      });
      setEditingExisting(true);
      setEditingPage(null);
      setSlugTouched(true);
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    }
  };

  const loadPage = async (slug) => {
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/posts?type=page&slug=${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setForm({ ...EMPTY, content: data.content || '' });
      setEditingExisting(false);
      setEditingPage(slug);
      setStatus(null);
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    }
  };

  const save = async ({ overwrite = false } = {}) => {
    setBusy(true);
    setStatus(null);
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const body = editingPage
      ? { type: 'page', slug: editingPage, content: form.content }
      : {
          type: form.type,
          slug: form.slug,
          overwrite: overwrite || editingExisting,
          frontmatter: {
            title: form.title,
            publishedAt: form.publishedAt,
            excerpt: form.excerpt,
            cover_image_link: form.cover_image_link,
            tags,
            ...(form.draft ? { draft: true } : {}),
          },
          content: form.content,
        };
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.status === 409 && data.exists) {
        if (window.confirm(`${form.slug}.mdx already exists. Overwrite it?`)) {
          setBusy(false);
          return save({ overwrite: true });
        }
        setStatus({ kind: 'err', msg: 'Save cancelled — slug already exists.' });
      } else if (!res.ok) {
        throw new Error(data.error || 'Save failed');
      } else if (data.mode === 'github') {
        setStatus({ kind: 'ok', msg: `Committed to branch ${data.branch} · PR #${data.prNumber} opened`, url: data.prUrl });
        setEditingExisting(true);
        setSlugTouched(true);
      } else {
        setStatus({ kind: 'ok', msg: `Saved ${data.path}` });
        setEditingExisting(true);
        setSlugTouched(true);
        loadList();
      }
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (type, slug) => {
    if (!window.confirm(`Delete ${type}/${slug}.mdx? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/posts?type=${type}&slug=${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      if (data.mode === 'github') {
        setStatus({ kind: 'ok', msg: `Deletion committed · PR #${data.prNumber} opened`, url: data.prUrl });
      } else {
        if (form.slug === slug && form.type === type) newDraft();
        loadList();
        setStatus({ kind: 'ok', msg: `Deleted ${type}/${slug}.mdx` });
      }
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    }
  };

  const previewHtml = useMemo(() => {
    try {
      return marked.parse(mdxToPreviewHtml(form.content) || '*Nothing to preview yet.*');
    } catch {
      return '<p>Preview error</p>';
    }
  }, [form.content]);

  const canSave = editingPage
    ? form.content.trim().length > 0
    : form.title.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug);

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm outline-none focus:border-[#D53E3B] focus:ring-2 focus:ring-[#D53E3B]/15 transition-colors placeholder:text-slate-400';
  const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500 mb-1.5';

  if (authState === 'checking') {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <Head>
          <title>Studio | CyberNeel Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <RefreshCw className="animate-spin text-[#D53E3B]" size={24} />
      </div>
    );
  }

  if (authState === 'out') {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
        <Head>
          <title>Studio | CyberNeel Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <form onSubmit={login} className="glass-card !rounded-3xl p-8 w-full max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#D53E3B]/10 text-[#D53E3B] flex items-center justify-center mb-5">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-1">
            Content <span className="text-[#D53E3B]">Studio</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-500 mb-6">Enter the admin password to continue.</p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputCls}
          />
          {authError && <p className="text-xs text-red-500 font-semibold mt-2">{authError}</p>}
          <button
            type="submit"
            disabled={!password}
            className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D53E3B] hover:bg-[#B37174] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogIn size={16} /> Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      <Head>
        <title>Studio | CyberNeel Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container mx-auto px-4 md:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Content <span className="text-[#D53E3B]">Studio</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium mt-1">
              Local authoring · writes straight to <code className="text-[#D53E3B]">data/&lt;type&gt;/&lt;slug&gt;.mdx</code>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                mode === 'github'
                  ? 'bg-[#D53E3B]/10 text-[#D53E3B]'
                  : 'bg-slate-500/10 text-slate-500 dark:text-zinc-400'
              }`}
              title={mode === 'github' ? 'Saves commit to GitHub and open a PR' : 'Saves write to local disk'}
            >
              {mode === 'github' ? 'GitHub · PR' : 'Local disk'}
            </span>
            {authState === 'in' && (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-[#D53E3B] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <LogOut size={15} /> Logout
              </button>
            )}
            <button
              onClick={newDraft}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D53E3B] hover:bg-[#B37174] text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <Plus size={16} /> New
            </button>
          </div>
        </header>

        {status && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl text-sm font-semibold border flex items-center justify-between gap-4 ${
              status.kind === 'ok'
                ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
            }`}
          >
            <span>{status.msg}</span>
            {status.url && (
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 underline hover:no-underline"
              >
                View PR <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar: existing content */}
          <aside className="glass-card !rounded-2xl p-4 h-fit lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500">
                Existing ({items.length})
              </span>
              <button onClick={loadList} className="text-slate-400 hover:text-[#D53E3B] transition-colors" aria-label="Refresh">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
              {items.map((it) => {
                const active = form.type === it.type && form.slug === it.slug && editingExisting;
                return (
                  <div
                    key={`${it.type}/${it.slug}`}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      active ? 'bg-[#D53E3B]/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    onClick={() => loadItem(it.type, it.slug)}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        it.type === 'blogs'
                          ? 'bg-[#D53E3B]/15 text-[#D53E3B]'
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {it.type === 'blogs' ? 'B' : 'P'}
                    </span>
                    <span className="flex-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {it.title}
                      {it.draft && <span className="text-yellow-600 dark:text-yellow-500"> ·draft</span>}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(it.type, it.slug);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
              {items.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-zinc-600 py-4 text-center">No content yet.</p>
              )}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3 dark:border-white/10">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500">
                Pages
              </p>
              {['about', 'now', 'uses'].map((slug) => (
                <div
                  key={slug}
                  onClick={() => loadPage(slug)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    editingPage === slug ? 'bg-[#D53E3B]/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {slug[0].toUpperCase()}
                  </span>
                  <span className="flex-1 truncate text-xs font-semibold capitalize text-slate-700 dark:text-slate-300">
                    {slug} page
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* Editor */}
          <main className="space-y-6">
            {editingPage && (
              <div className="glass-card !rounded-2xl flex items-center gap-2 p-5 text-sm">
                <Pencil size={15} className="text-[#D53E3B]" />
                <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                  Editing the <span className="text-[#D53E3B]">{editingPage}</span> page — raw MDX, no frontmatter.
                </span>
              </div>
            )}
            {!editingPage && (
            <div className="glass-card !rounded-2xl p-6 space-y-5">
              {/* Type + draft */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/5 p-1">
                  {['blogs', 'posts'].map((t) => (
                    <button
                      key={t}
                      disabled={editingExisting}
                      onClick={() => set({ type: t })}
                      className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                        form.type === t ? 'bg-[#D53E3B] text-white' : 'text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      {t === 'blogs' ? 'Blog' : 'Post'}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.draft}
                    onChange={(e) => set({ draft: e.target.checked })}
                    className="w-4 h-4 accent-[#D53E3B]"
                  />
                  Draft
                </label>
                {editingExisting && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                    <Pencil size={12} /> Editing {form.slug}
                  </span>
                )}
              </div>

              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="My Awesome Project" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Slug {editingExisting && '(locked)'}</label>
                  <input
                    className={`${inputCls} font-mono ${editingExisting ? 'opacity-60' : ''}`}
                    value={form.slug}
                    disabled={editingExisting}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set({ slug: slugify(e.target.value) });
                    }}
                    placeholder="my-awesome-project"
                  />
                </div>
                <div>
                  <label className={labelCls}>Published</label>
                  <input type="date" className={inputCls} value={form.publishedAt} onChange={(e) => set({ publishedAt: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Excerpt</label>
                <textarea className={`${inputCls} resize-none`} rows={2} value={form.excerpt} onChange={(e) => set({ excerpt: e.target.value })} placeholder="A short summary shown on cards…" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Cover image URL</label>
                  <div className="relative">
                    <ImageIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className={`${inputCls} pl-9`} value={form.cover_image_link} onChange={(e) => set({ cover_image_link: e.target.value })} placeholder="https://…" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Tags (comma separated)</label>
                  <input className={inputCls} value={form.tags} onChange={(e) => set({ tags: e.target.value })} placeholder="react, 3d, art" />
                </div>
              </div>
            </div>
            )}

            {/* Body + preview */}
            <div className="glass-card !rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500">
                  <FileText size={14} /> Body (MDX / Markdown)
                </span>
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 hover:text-[#D53E3B] transition-colors"
                >
                  <Eye size={14} /> {showPreview ? 'Hide' : 'Show'} preview
                </button>
              </div>
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center gap-1.5 rounded-lg bg-[#D53E3B] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#B37174]"
                >
                  <ImagePlus size={14} /> Image
                </button>
                <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/10" />
                {[
                  { icon: <Heading size={14} />, title: 'Heading', fn: () => insertAtCursor('\n## Heading\n') },
                  { icon: <Bold size={14} />, title: 'Bold', fn: () => wrapSelection('**', '**', 'bold text') },
                  { icon: <Link2 size={14} />, title: 'Link', fn: () => wrapSelection('[', '](https://)', 'link text') },
                  { icon: <Code2 size={14} />, title: 'Code', fn: () => wrapSelection('`', '`', 'code') },
                ].map((b) => (
                  <button
                    key={b.title}
                    type="button"
                    title={b.title}
                    onClick={b.fn}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#D53E3B] hover:text-[#D53E3B] dark:border-white/10 dark:text-zinc-400"
                  >
                    {b.icon}
                  </button>
                ))}
              </div>
              <div className={`grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                <textarea
                  ref={bodyRef}
                  className={`${inputCls} font-mono leading-relaxed min-h-[420px]`}
                  value={form.content}
                  onChange={(e) => set({ content: e.target.value })}
                  placeholder={'## Heading\n\nWrite your content here. Markdown and MDX components both work.'}
                />
                {showPreview && (
                  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden min-h-[420px]">
                    {form.cover_image_link && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.cover_image_link} alt="" className="w-full aspect-video object-cover" />
                    )}
                    <div className="p-6">
                      {form.title && <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-4">{form.title}</h1>}
                      <div
                        className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-a:text-[#D53E3B]"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {!canSave && (
                <span className="text-xs text-slate-400">
                  {editingPage ? 'Add some content first' : 'Title + valid kebab-case slug required'}
                </span>
              )}
              <button
                onClick={() => save()}
                disabled={!canSave || busy}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#D53E3B] hover:bg-[#B37174] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <Save size={16} /> {busy ? 'Saving…' : editingPage ? 'Save page' : editingExisting ? 'Update' : 'Create'}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
