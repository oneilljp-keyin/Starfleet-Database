import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarshipsDataService from "../../services/starships";

function StarshipsSame({ starshipName = "", starshipClass = "Unknown", starshipId }) {
  const [starshipsSame, setStarshipsSame] = useState([]);

  useEffect(() => {
    let queryName = "";
    if (starshipName) {
      queryName = starshipName.replace(/-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g, "");
    }
    StarshipsDataService.findSame(queryName, starshipClass, 50)
      .then((response) => {
        setStarshipsSame(response.data);
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, [starshipName, starshipClass]);

  return (
    <>
      {parseInt(starshipsSame.total_results) > 1 && starshipName && (
        <div className="text-white bg-121212 same-ships mb-1">
          <div className="card-header text-center" style={{ borderBottom: "1px solid #F9F9F9" }}>
            <span className="h5cell">
              Starships named{" "}
              <em>
                {starshipName.replace(/-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g, "")}
              </em>
            </span>
          </div>
          <div className="d-flex flex-wrap justify-content-evenly">
            {starshipsSame.starships
              .filter((ship) => ship._id !== starshipId)
              .map((starship, index) => {
                return (
                  <Link to={`/starships/${starship._id}`} className="px-1 list-link" key={index}>
                    {starship.registry ? starship.registry : starship.name}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
      {parseInt(starshipsSame.total_results) > 1 && starshipClass !== "Unknown" && (
        <div className="text-white bg-121212 same-ships mb-1">
          <div className="card-header text-center" style={{ borderBottom: "1px solid #F9F9F9" }}>
            <span className="h5cell">
              <em>{starshipClass}</em>-class starships
            </span>
          </div>
          <div className="d-flex flex-wrap justify-content-evenly">
            {starshipsSame.starships
              .filter((ship) => ship._id !== starshipId)
              .map((starship, index) => {
                return (
                  <Link to={`/starships/${starship._id}`} className="px-1 list-link" key={index}>
                    {starship.name}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default StarshipsSame;
