import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import orange from "../../../assets/insignia_orange.png";

import { toast } from "react-toastify";

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

const StarshipsList = ({ listType, officerId, category }) => {
  const [starships, setStarships] = useState({});

  useEffect(() => {
    const getEvents = (oid = "", sid = "", cat = "", sort = 1) => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, cat, sort)
        .then((response) => {
          let sortedStarships = response.data.filter((ship) => ship.starshipId);
          setStarships(
            sortedStarships.filter(
              (element1, index) =>
                index ===
                sortedStarships.findIndex((element2) => element2.starshipId === element1.starshipId)
            )
          );
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents(officerId, "", category);
  }, [officerId, category]);

  return (
    <div className="d-flex flex-wrap row overflow-auto" style={{ height: "calc(100% - 96px)" }}>
      {starships.length > 0 ? (
        starships
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((starship) => {
            return (
              <div className="col-sm-3 list-cards" key={uuidv4()}>
                <div className="card text-center bg-dark">
                  <div className="card-body">
                    {/* {officer.position && <span className="h6cell">{officer.position}</span>}
                    <br />
                    <span className="h3cell">{rankAbbrev}</span>
                    <br /> */}
                    <img
                      className="search-list"
                      src={starship.starshipPicUrl[0] ? starship.starshipPicUrl[0] : orange}
                      alt={starship.name}
                    />
                    <br />
                    <span className="h5cell">{starship.name}</span>
                    <div className="row">
                      <Link to={"/starships/" + starship.starshipId} className="btn btn-primary">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        <h2 className="mx-auto my-auto">No {listType} Found</h2>
      )}
    </div>
  );
};
export default StarshipsList;
