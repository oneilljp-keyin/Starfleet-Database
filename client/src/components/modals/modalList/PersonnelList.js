import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import orange from "../../../assets/insignia_orange.png";

import { toast } from "react-toastify";

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

const PersonnelList = ({ listType, starshipId, category }) => {
  const [personnel, setPersonnel] = useState({});

  useEffect(() => {
    const getEvents = (oid = "", sid = "", cat = "", sort = -1) => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, cat, sort)
        .then((response) => {
          setPersonnel(
            response.data.filter(
              (element1, index) =>
                index ===
                response.data.findIndex((element2) => element2.officerId === element1.officerId)
            )
          );
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents("", starshipId, category);
  }, [starshipId, category]);

  return (
    <div className="d-flex flex-wrap row overflow-auto" style={{ height: "calc(100% - 96px)" }}>
      {personnel.length > 0 ? (
        personnel
          .sort((a, b) => a.surname.localeCompare(b.surname))
          .map((officer) => {
            let officerName;
            let rankAbbrev;
            if (officer.surname !== "undefined") {
              officerName = officer.surname;
            }
            if (officer.first) {
              officerName += ", " + officer.first;
            }
            if (officer.middle) {
              let middleI = officer.middle.slice(0, 1);
              officerName += " " + middleI + ".";
            }
            if (officer.rankLabel) {
              const [, abbrev] = officer.rankLabel.split("-");
              rankAbbrev = abbrev;
            }

            return (
              <div className="col-sm-3 list-cards" key={uuidv4()}>
                <div className="card text-center bg-dark">
                  <div className="card-body">
                    {officer.position && <span className="h6cell">{officer.position}</span>}
                    <br />
                    <span className="h3cell">{rankAbbrev}</span>
                    <br />
                    <img
                      className="search-list"
                      src={officer.officerPicUrl[0] ? officer.officerPicUrl[0] : orange}
                      alt={officerName}
                    />
                    <br />
                    <span className="h5cell">{officerName}</span>
                    <div className="row">
                      <Link to={"/personnel/" + officer.officerId} className="btn btn-primary">
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
export default PersonnelList;
