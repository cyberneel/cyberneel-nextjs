import { useRouter } from 'next/router';

const Pagination = ({ currentPage, totalPosts, postsPerPage, searchTerm }) => {
  const router = useRouter();
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (newPage) => {
    const searchQuery = searchTerm ? `&search=${searchTerm}` : '';
    router.push(`/posts/?page=${newPage}${searchQuery}`, undefined, { shallow: true });
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
      )}
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      )}
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
        button {
          padding: 10px;
          font-size: 16px;
          margin: 0 10px;
        }
        span {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default Pagination;
