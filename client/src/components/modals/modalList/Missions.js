import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import { Link } from "react-router-dom";

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

import UseModal from "../UseModal";
import ModalLauncher from "../ModalLauncher";

function Missions({ eventType, officerId, starshipId, category, isAuth, subjectName }) {
  const [starship, setStarship] = useState({});

  const [eventType2, setEventType2] = useState(eventType);

  const [categoryLabel, setCategoryLabel] = useState("");
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  useEffect(() => {
    let isMounted = true;

    const getEvents = (oid = "", sid = "", type = "", sort = 1) => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, type, sort)
        .then((response) => {
          if (isMounted) {
            setStarship(response.data);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents(officerId, starshipId, eventType);
    return () => {
      isMounted = false;
    };
  }, [officerId, starshipId, category, refreshOption, eventType]);

  function OpenModal(modalType, id, option = eventType, category = "") {
    setModal(modalType);
    setEventId(id);
    setEventType2(option);
    setCategoryLabel(category);
    toggleModal();
    setEventType2(eventType);
  }

  return (
    <>
      <div
        className="d-flex flex-wrap row overflow-auto px-2 align-items-start"
        style={{ height: "calc(100% - 104px)" }}
      >
        <table className="table table-borderless w-100">
          <tbody>
            {starship.length > 0 ? (
              starship.map((event, index) => {
                let eventDate;
                if (event.date) {
                  if (event.dateNote !== "exact") {
                    eventDate = event.date.slice(0, 4).toString();
                    if (event.dateNote === "before") {
                      eventDate = "pre " + eventDate;
                    } else if (event.dateNote === "after") {
                      eventDate = "post " + eventDate;
                    }
                  } else {
                    eventDate = event.date.slice(0, 10);
                  }
                }
                let currentRank;
                if (event.rankLabel) {
                  const [rank] = event.rankLabel.split("-");
                  currentRank = rank;
                }

                return (
                  <Fragment key={uuidv4()}>
                    <tr style={{ borderTop: "1px solid white", marginBottom: "auto" }}>
                      <td
                        rowSpan={
                          event.notes &&
                          event.notes !== "Assignment" &&
                          event.notes !== "Promotion" &&
                          event.notes !== "Demotion"
                            ? 1
                            : 1
                        }
                      >
                        {isAuth ? (
                          <>
                            <button
                              className="edit"
                              onClick={() => {
                                let eventOption = event.officerId ? "officer" : "starship";
                                OpenModal("event", event._id, eventOption);
                              }}
                            >
                              <i className="far fa-edit" style={{ color: "gray" }}></i>
                            </button>
                            {/* <br /> */}{" "}
                            <button
                              className="edit"
                              onClick={() => {
                                OpenModal("delete", event._id, "event");
                              }}
                            >
                              <i className="fa-solid fa-remove fa-xl" style={{ color: "gray" }}></i>
                            </button>
                          </>
                        ) : null}
                      </td>
                      <td className="h3cell align-top">
                        {event.date && `${eventDate}`}
                        {/* {event.date && event.stardate && eventDate.length > 4 && <br />} */}
                        {event.stardate && event.stardate !== "0" && ` SD ${event.stardate}`}
                      </td>
                      <td className="h5cell align-top" style={{ textTransform: "capitalize" }}>
                        {event.name && (
                          <Link to={`/starships/${event.starshipId}`} className="list-link">
                            USS {event.name.replace(/-[A-Z]$/g, "")} {event.registry}
                          </Link>
                        )}
                        {event.name && currentRank !== undefined && <br />}
                        {currentRank !== undefined && <>{currentRank}</>}
                        {((event.name && event.position) ||
                          (currentRank !== undefined && event.position)) && <br />}
                        {event.position && <>{event.position}</>}
                      </td>
                      <td className="h4cell align-top">
                        {event.location && <>{event.location}</>}
                      </td>
                      {eventType === "Chronology" && (
                        <td className="h6cell align-top">
                          {event.type !== "Other" && <>{event.type}</>}
                        </td>
                      )}
                    </tr>
                    {event.notes &&
                      event.notes !== "Assignment" &&
                      event.notes !== "Promotion" &&
                      event.notes !== "Demotion" && (
                        <tr>
                          <td className="h6cell" colSpan={7}>
                            {event.notes}
                          </td>
                        </tr>
                      )}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center align-middle">
                  <h2 className="mx-auto my-auto">No {category} Found</h2>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={isAuth}
        officerId={officerId}
        starshipId={starshipId}
        eventId={eventId}
        subjectName={subjectName}
        eventType={eventType2}
        setRefresh={toggleRefresh}
        category={categoryLabel}
      />
    </>
  );
}

export default Missions;
