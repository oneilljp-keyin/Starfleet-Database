import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import orange from "../../../assets/insignia_orange.png";

import { toast } from "react-toastify";

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

const PersonnelList = ({ listType, starshipId, category }) => {
  const [personnel, setPersonnel] = useState({});

  useEffect(() => {
    let isMounted = true;
    const getEvents = (oid = "", sid = "", cat = "", sort = -1) => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, cat, sort)
        .then((response) => {
          if (isMounted) {
            setPersonnel(
              response.data.filter(
                (element1, index) =>
                  index ===
                  response.data.findIndex((element2) => element2.officerId === element1.officerId)
              )
            );
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents("", starshipId, listType);
    return () => {
      isMounted = false;
    };
  }, [starshipId, listType]);

  return (
    <div
      className="d-flex flex-wrap row overflow-auto justify-content-evenly"
      style={{ maxHeight: "calc(100% - 104px)" }}
    >
      {personnel.length > 0 ? (
        personnel
          .sort((a, b) => a.surname.localeCompare(b.surname))
          .map((officer) => {
            let officerName;
            let rankLabel;
            if (officer.surname !== "undefined") {
              officerName = officer.surname;
            }
            if (officer.first) {
              officerName += ", " + officer.first;
            }
            if (officer.rankLabel) {
              const [label,] = officer.rankLabel.split("-");
              rankLabel = label;
            }

            return (
              // <div className="col-sm-4 bg-dark list-cards p-0" key={uuidv4()}>
              <Link
                key={uuidv4()}
                to={"/personnel/" + officer.officerId}
                className="list-link col-sm-5 bg-dark list-cards p-0"
              >
                <div className="row d-flex">
                  <div className="col-sm-3 p-0 my-auto">
                    <img
                      className="service-list"
                      src={officer.officerPicUrl[0] ? officer.officerPicUrl[0] : orange}
                      alt={officerName}
                    />
                  </div>
                  <div className="col-sm-9 my-auto">
                    <span className="h5cell">{officerName}</span>
                    {rankLabel && (
                      <>
                        <br />
                        <span className="h3cell">{rankLabel}</span>
                      </>
                    )}
                    <br />
                    {officer.position && <span className="h6cell">{officer.position}</span>}
                  </div>
                </div>
              </Link>
              // </div>
            );
          })
      ) : (
        <h2 className="mx-auto my-auto">No {category} Found</h2>
      )}
    </div>
  );
};
export default PersonnelList;
