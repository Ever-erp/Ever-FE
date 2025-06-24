import React, { useState, useEffect } from "react";

const PageFooter = ({ currentPage, totalPageLength, onPageChange }) => {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (pageNumber) => {
    if (onPageChange && pageNumber > 0 && pageNumber <= totalPageLength) {
      setPage(pageNumber);
      onPageChange(pageNumber);
    }
  };

  const getPageRange = () => {
    const pageGroupSize = 5;
    const currentGroup = Math.ceil(page / pageGroupSize);
    const startPage = (currentGroup - 1) * pageGroupSize + 1;
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPageLength);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const pageRange = getPageRange();

  return (
    <div className="flex flex-row gap-2">
      <button
        className="bg-white text-gray-500 w-12 h-12 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
        onClick={() => handlePageChange(page - 5 > 0 ? page - 5 : 1)}
      >
        {"<<"}
      </button>
      <button
        className="bg-white text-gray-500 w-12 h-12 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
        onClick={() => handlePageChange(page - 1)}
      >
        {"<"}
      </button>
      <div className="flex flex-row gap-2">
        {pageRange.map((pageNumber) =>
          page === pageNumber ? (
            <button
              className="bg-brand text-white w-12 h-12 py-2 rounded-md"
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ) : (
            <button
              className="bg-white text-gray-500 w-12 h-12 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
      <button
        className="bg-white text-gray-500 w-12 h-12 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
        onClick={() => handlePageChange(page + 1)}
      >
        {">"}
      </button>
      <button
        className="bg-white text-gray-500 w-12 h-12 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
        onClick={() =>
          handlePageChange(
            page + 5 <= totalPageLength ? page + 5 : totalPageLength
          )
        }
      >
        {">>"}
      </button>
    </div>
  );
};

export default PageFooter;
