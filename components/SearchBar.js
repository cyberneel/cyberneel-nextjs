import { Search } from 'lucide-react';

export default function SearchBar({ posts, onResults, placeholder = 'Search' }) {
  const run = (value) => {
    const q = value.trim().toLowerCase();
    onResults(
      q
        ? posts.filter((p) => [p.title, p.excerpt, ...(p.tags || [])].join(' ').toLowerCase().includes(q))
        : posts
    );
  };

  return (
    <label className="relative block">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input type="search" onChange={(e) => run(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="input pl-11" />
    </label>
  );
}
