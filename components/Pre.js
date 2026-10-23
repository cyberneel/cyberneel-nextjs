import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Drop-in replacement for <pre> in MDX that adds a copy button while keeping
// the rehype-highlight markup intact.
export default function Pre(props) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const text = ref.current?.innerText || '';
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-0 top-0 z-10 grid h-9 w-9 place-items-center border-b border-l border-[#333] bg-black text-[#a3a3a3] opacity-0 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
      <pre ref={ref} {...props} />
    </div>
  );
}
