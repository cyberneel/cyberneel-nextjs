import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ posts, onResults, placeholder = 'Search…' }) {
  const [query, setQuery] = useState('');

  const run = (value) => {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (!q) return onResults(posts);
    onResults(
      posts.filter((p) => {
        const haystack = [p.title, p.excerpt, ...(p.tags || [])].join(' ').toLowerCase();
        return haystack.includes(q);
      })
    );
  };

  return (
    <div className="glass group flex items-center gap-3 rounded-full px-5 py-3">
      <Search size={18} className="shrink-0 text-faint transition-colors group-focus-within:text-accent" />
      <input
        value={query}
        onChange={(e) => run(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-faint"
      />
      {query && (
        <button onClick={() => run('')} aria-label="Clear search" className="text-faint hover:text-fg">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
