import React from "react";

function Pagination({ total, currentPage, resultsPerPage, findByName, findByClass, searchType }) {
  let totalPages = Math.cell(total / resultsPerPage);

  let pageList = [];

  for (let i = 0; i < totalPages; i++) {
    pageList.push(
      <li key={i}>
        <button className="btn btn-outline-secondary" type="button" onClick={findByName}>
          Search
        </button>
      </li>
    );
  }

  return (
    <>
      <ul className="pagination pagination-sm justify-content-center"></ul>
    </>
  );
}

export default Pagination;
