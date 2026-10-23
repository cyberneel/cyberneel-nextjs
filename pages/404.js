import Link from 'next/link';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <div className="wrap pb-32">
        <header className="page-head">
          <h1>Page not found</h1>
          <p>There&apos;s nothing at this address. It may have moved, or the link has a typo.</p>
        </header>
        <Link href="/" className="btn primary">Go to the home page</Link>
      </div>
    </>
  );
}
