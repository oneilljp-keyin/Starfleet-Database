import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import EventsAndPhotosDataService from "../../../services/eventsAndPhotos";

import UseModal from "../UseModal";
import ModalLauncher from "../ModalLauncher";

function FirstContacts({ listType, starshipId, category, isAuth }) {
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

    getEvents("", starshipId, category);
  }, [starshipId, category]);

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
        className="d-flex flex-wrap row overflow-auto px-2"
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
                return (
                  <Fragment key={uuidv4()}>
                    <tr style={{ borderBottom: "1px solid white" }}>
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
                            <br />
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
                      <td className="h4cell align-top">
                        {event.location && <>{event.location}</>}
                      </td>
                      {/* <td className="h5cell align-top">
                        {officerName !== undefined && (
                          <Link to={`/personnel/${event.officerId}`} className="list-link">
                            {officerName}
                          </Link>
                        )}
                        {officerName !== undefined && event.position !== undefined && <br />}
                        {event.position !== undefined && <>{event.position}</>}
                      </td>
                      <td className="h6cell align-top">
                        {event.type !== "Other" && <>{event.type}</>}
                      </td> */}
                      {/* </tr> */}
                      {event.notes &&
                        event.notes !== "Assignment" &&
                        event.notes !== "Promotion" &&
                        event.notes !== "Demotion" && (
                          // <tr>
                          <td className="h6cell" colSpan={7}>
                            {event.notes}
                          </td>
                        )}
                    </tr>
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
        officerId={null}
        starshipId={starshipId}
        eventId={eventId}
        subjectName={null}
        type={type}
        setRefreshOption={toggleRefresh}
        category={eventCategory}
      />
    </>
  );
}

export default FirstContacts;
