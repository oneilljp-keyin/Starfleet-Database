import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import { Link } from "react-router-dom";

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

import UseModal from "../UseModal";
import ModalLauncher from "../ModalLauncher";

function Missions({ listType, officerId, starshipId, category, isAuth, subjectName }) {
  const [starship, setStarship] = useState({});

  const [type, setType] = useState("");

  const [eventCategory, setEventCategory] = useState("");
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  useEffect(() => {
    const getEvents = (oid = "", sid = "", cat = "", sort = 1) => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, cat, sort)
        .then((response) => {
          setStarship(response.data);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents(officerId, starshipId, category);
  }, [officerId, starshipId, category]);

  function OpenModal(modalType, id, option = type, category = "") {
    setModal(modalType);
    setEventId(id);
    setType(option);
    setEventCategory(category);
    toggleModal();
  }

  return (
    <>
      <div
        className="d-flex flex-wrap row overflow-auto px-2 align-items-start"
        style={{ height: "calc(100% - 96px)" }}
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
                      eventDate = "Before " + eventDate;
                    } else if (event.dateNote === "after") {
                      eventDate = "After " + eventDate;
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
                        {event.stardate && ` SD ${event.stardate}`}
                      </td>
                      <td className="h5cell align-top">
                        {event.name && (
                          <Link to={`/starships/${event.starshipId}`} className="list-link">
                            {event.name.replace(/-A|-B|-C|-D|-E|-F|-G|-H|-I|-J|-K|-L|-M/g, "")}{" "}
                            {event.registry}
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
                      <td className="h6cell align-top">
                        {event.type !== "Other" && <>{event.type}</>}
                      </td>
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
                  <h2 className="mx-auto my-auto">No {listType} Found</h2>
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
        type={type}
        setRefreshOption={toggleRefresh}
        category={eventCategory}
      />
    </>
  );
}

export default Missions;
