import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import orange from "../../../assets/insignia_orange_wide.png";

import { toast } from "react-toastify";

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

const StarshipsList = ({ listType, officerId, category }) => {
  const [starships, setStarships] = useState({});

  useEffect(() => {
    let isMounted = true;

    const getEvents = (oid = "", sid = "", cat = "", sort = 1) => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, cat, sort)
        .then((response) => {
          if (isMounted) {
            let sortedStarships = response.data.filter((ship) => ship.starshipId);
            setStarships(
              sortedStarships.filter(
                (element1, index) =>
                  index ===
                  sortedStarships.findIndex(
                    (element2) => element2.starshipId === element1.starshipId
                  )
              )
            );
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents(officerId, "", listType);
    return () => {
      isMounted = false;
    };
  }, [officerId, listType]);

  return (
    <div
      className="d-flex flex-wrap row overflow-y justify-content-evenly"
      style={{ maxHeight: "calc(100% - 104px)" }}
    >
      {starships.length > 0 ? (
        starships
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((starship) => {
            return (
              // <div className="col-sm-3 list-cards" key={uuidv4()}>
              <Link
                key={uuidv4()}
                to={"/starships/" + starship.starshipId}
                className="list-link col-sm-5 bg-dark list-cards p-0"
              >
                <div className="row d-flex">
                  <div className="col-sm-5 p-0 my-auto">
                    <img
                      className="service-list"
                      src={starship.starshipPicUrl[0] ? starship.starshipPicUrl[0] : orange}
                      alt={starship.name}
                    />
                  </div>
                  <div className="col-sm-7 my-auto">
                    <span className="h5cell">
                      USS{" "}
                      {starship.name.replace(
                        /-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g,
                        ""
                      )}
                    </span>
                    {starship.class && (
                      <>
                        <br />
                        <span className="h3cell">{starship.class} Class</span>
                      </>
                    )}
                    {starship.registry && (
                      <>
                        <br />
                        <span className="h6cell">{starship.registry}</span>
                      </>
                    )}{" "}
                  </div>
                </div>
              </Link>
              // </div>
            );
          })
      ) : (
        <h2 className="mx-auto my-auto">No {listType} Found</h2>
      )}
    </div>
  );
};
export default StarshipsList;
