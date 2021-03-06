import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarshipsDataService from "../../services/starships";

function StarshipsSame({ starshipName = "", starshipClass = "All", starshipId }) {
  const [starshipsSame, setStarshipsSame] = useState([]);

  useEffect(() => {
    let isMounted = true;

    let queryName = "";
    if (starshipName) {
      queryName = starshipName.replace(/-[A-Z]$/g, "");
    }
    StarshipsDataService.findSame(queryName, starshipClass, 50)
      .then((response) => {
        if (isMounted) {
          setStarshipsSame(response.data);
        }
      })
      .catch((e) => {
        console.error(e.message);
      });
    return () => (isMounted = false);
  }, [starshipName, starshipClass]);

  return (
    <>
      {parseInt(starshipsSame.total_results) > 1 && starshipName && (
        <div className="text-white bg-121212 same-ships mb-1">
          <div className="card-header text-center" style={{ borderBottom: "1px solid #F9F9F9" }}>
            <span className="h5cell" style={{ textTransform: "capitalize" }}>
              Starships named{" "}
              <em style={{ textTransform: "uppercase" }}>{starshipName.replace(/-[A-Z]$/g, "")}</em>
            </span>
          </div>
          <div className="d-flex flex-wrap justify-content-evenly">
            {starshipsSame.starships
              .filter((ship) => ship._id !== starshipId)
              .map((starship, index) => {
                return (
                  <Link to={`/starships/${starship._id}`} className="list-link-same" key={index}>
                    {starship.registry ? starship.registry : starship.name}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
      {parseInt(starshipsSame.total_results) > 1 &&
        starshipClass !== "All" &&
        starshipClass !== "Unknown" && (
          <div className="text-white bg-121212 same-ships mb-1">
            <div className="card-header text-center" style={{ borderBottom: "1px solid #F9F9F9" }}>
              <span className="h5cell" style={{ textTransform: "capitalize" }}>
                <em style={{ textTransform: "uppercase" }}>{starshipClass}</em>-class starships
              </span>
            </div>
            <div className="d-flex flex-wrap justify-content-evenly">
              {starshipsSame.starships
                .filter((ship) => ship._id !== starshipId)
                .map((starship, index) => {
                  return (
                    <Link to={`/starships/${starship._id}`} className="list-link-same" key={index}>
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
