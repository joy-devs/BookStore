

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onChangePage }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    range.push(totalPages);

    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button onClick={() => onChangePage(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {pageNumbers.map((pageNum, index) => (
        <button key={index} onClick={() => onChangePage(pageNum as number)}>
          {pageNum === '...' ? '...' : pageNum}
        </button>
      ))}
      <button onClick={() => onChangePage(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
