import React, { useState, useEffect } from "react";

interface PageFooterProps {
  currentPage: number;
  totalPageLength: number;
  onPageChange: (page: number) => void;
}

const PageFooter: React.FC<PageFooterProps> = ({
  currentPage,
  totalPageLength,
  onPageChange,
}) => {
  const [page, setPage] = useState<number>(currentPage);

  const handlePageChange = (pageNumber: number) => {
    if (onPageChange && pageNumber >= 0 && pageNumber < totalPageLength) {
      setPage(pageNumber);
      onPageChange(pageNumber);
    }
  };

  const getPageRange = (): number[] => {
    const pageGroupSize = 5;
    const displayPage = page + 1; // 표시용 페이지 (1부터 시작)
    const currentGroup = Math.ceil(displayPage / pageGroupSize);
    const startDisplayPage = (currentGroup - 1) * pageGroupSize + 1;
    const endDisplayPage = Math.min(
      startDisplayPage + pageGroupSize - 1,
      totalPageLength
    );

    return Array.from(
      { length: endDisplayPage - startDisplayPage + 1 },
      (_, i) => startDisplayPage + i - 1
    );
  };

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const pageRange = getPageRange();

  return (
    <div className="flex flex-row gap-1 md:gap-2">
      <button
        className="bg-white text-gray-500 w-8 h-8 md:w-12 md:h-12 py-1 md:py-2 rounded-md border border-gray-300 hover:bg-gray-200 text-xs md:text-base"
        onClick={() => handlePageChange(Math.max(0, page - 5))}
      >
        {"<<"}
      </button>
      <button
        className="bg-white text-gray-500 w-8 h-8 md:w-12 md:h-12 py-1 md:py-2 rounded-md border border-gray-300 hover:bg-gray-200 text-xs md:text-base"
        onClick={() => handlePageChange(Math.max(0, page - 1))}
      >
        {"<"}
      </button>
      <div className="flex flex-row gap-1 md:gap-2">
        {pageRange.map((pageNumber) =>
          page === pageNumber ? (
            <button
              className="bg-brand text-white w-8 h-8 md:w-12 md:h-12 py-1 md:py-2 rounded-md text-xs md:text-base"
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber + 1}
            </button>
          ) : (
            <button
              className="bg-white text-gray-500 w-8 h-8 md:w-12 md:h-12 py-1 md:py-2 rounded-md border border-gray-300 hover:bg-gray-200 text-xs md:text-base"
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber + 1}
            </button>
          )
        )}
      </div>
      <button
        className="bg-white text-gray-500 w-8 h-8 md:w-12 md:h-12 py-1 md:py-2 rounded-md border border-gray-300 hover:bg-gray-200 text-xs md:text-base"
        onClick={() =>
          handlePageChange(Math.min(totalPageLength - 1, page + 1))
        }
      >
        {">"}
      </button>
      <button
        className="bg-white text-gray-500 w-8 h-8 md:w-12 md:h-12 py-1 md:py-2 rounded-md border border-gray-300 hover:bg-gray-200 text-xs md:text-base"
        onClick={() =>
          handlePageChange(Math.min(totalPageLength - 1, page + 5))
        }
      >
        {">>"}
      </button>
    </div>
  );
};

export default PageFooter;
