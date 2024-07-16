import Link from 'next/link';

const Pagination = ({ currentPage, totalPosts, postsPerPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="pagination">
      <Link href={`/posts/?page=${currentPage - 1}`}>
        <a className={currentPage <= 1 ? 'disabled' : ''}>Previous</a>
      </Link>
      <span>Page {currentPage} of {totalPages}</span>
      <Link href={`/posts/?page=${currentPage + 1}`}>
        <a className={currentPage >= totalPages ? 'disabled' : ''}>Next</a>
      </Link>
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        a {
          margin: 0 10px;
          text-decoration: none;
          color: #0070f3;
        }
        .disabled {
          pointer-events: none;
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default Pagination;
