import React from "react";

function Assignments({ listType, starshipId, category }) {
  return (
    <div className="d-flex flex-wrap row overflow-auto" style={{ height: "calc(100% - 96px)" }}>
      <h2 className="mx-auto my-auto">No {listType} Found</h2>
    </div>
  );
}

export default Assignments;
