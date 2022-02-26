import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import PersonnelDataService from "../../services/personnel";
import PhotoCarousel from "../PhotoCarousel";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

const Officer = (props) => {
  const [imageType, setImageType] = useState("officer");

  const [officerName, setOfficerName] = useState("");
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  const initialOfficerState = {
    _id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
    birthDate: null,
    birthStardate: null,
    birthPlace: null,
    birthDateNote: null,
    deathDate: null,
    deathStardate: null,
    deathPlace: null,
    deathDateNote: null,
    serial: null,
    events: [],
  };

  const [officer, setOfficer] = useState(initialOfficerState);

  useEffect(() => {
    const getOfficer = (id) => {
      PersonnelDataService.get(id)
        .then((response) => {
          setOfficer(response.data);
          if (response.data.first) {
            setOfficerName(response.data.first + " " + response.data.surname);
          } else {
            setOfficerName(response.data.surname);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getOfficer(props.match.params.id);
  }, [props.match.params.id, refreshOption]);

  function OpenModal(modalType, id = null, type = "officer") {
    setModal(modalType);
    setEventId(id);
    setImageType(type);
    toggleModal();
  }

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        <Link to={"/personnel"} className="lcars_btn orange_btn left_round">
          Search
        </Link>
        {props.isAuth && (
          <>
            <button
              className="lcars_btn orange_btn all_square"
              onClick={() => {
                OpenModal("officer", officer._id);
              }}
            >
              Edit
            </button>
            <button
              className="lcars_btn orange_btn all_square"
              onClick={() => {
                OpenModal("photo", officer._id);
              }}
            >
              Upload
            </button>
            <button
              className="lcars_btn orange_btn right_round"
              onClick={() => {
                OpenModal("event");
              }}
            >
              Event
            </button>
          </>
        )}
      </div>

      {officer ? (
        <div>
          <div className="rows d-flex flex-wrap">
            <PhotoCarousel
              subjectId={props.match.params.id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={"officer"}
              OpenModal={OpenModal}
              className="col"
            />
            <div className="profile-summary col">
              <h1>
                {officer.surname && <>{officer.surname}</>}
                {officer.first && <>, {officer.first}</>}
                {officer.middle && <> {officer.middle}</>}
                {officer.postNom && <>, {officer.postNom}</>}
                {officer.date && (
                  <span style={{ fontSize: "1.18rem" }}>
                    {" "}
                    (As of{" "}
                    {officer.deathDate ? officer.deathDate.slice(0, 4) : officer.date.slice(0, 4)})
                  </span>
                )}
              </h1>
              {officer.serial && <h2>{officer.serial}</h2>}
              {officer.rankLabel && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>{!officer.active && <>Last </>}Rank: </span>
                  {officer.rankLabel.split("-").map((label, index) => {
                    let rankLabel;
                    if (index === 0) rankLabel = label;
                    return rankLabel;
                  })}
                </h3>
              )}
              {officer.position && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>
                    {!officer.active && <>Last </>}Position:{" "}
                  </span>
                  {officer.position}
                </h3>
              )}
              <h3 style={{ textTransform: "capitalize" }}>
                {officer.name && (
                  <>
                    <span style={{ color: "#FFDD22E6" }}>
                      {!officer.active && <>Last </>}Vessel:{" "}
                    </span>
                    USS {officer.name.replace(/-A|-B|-C|-D|-E|-F|-G|-H|-I|-J|-K|-L|-M/g, "")}{" "}
                    {officer.registry}
                  </>
                )}
                {officer.location &&
                  !officer.name &&
                  (!officer.position || !officer.position.includes("etired")) && (
                    <>
                      <span style={{ color: "#FFDD22E6" }}> Location: </span>
                      {officer.location}
                    </>
                  )}
              </h3>
              {/* ))} */}
              {officer.birthDate && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Birth: </span>
                  {officer.birthDateNote ? (
                    <>
                      {officer.birthDateNote} {officer.birthDate.slice(0, 4)}
                    </>
                  ) : (
                    <>{officer.birthDate.slice(0, 10)}</>
                  )}
                </h3>
              )}
              {officer.birthPlace && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>From: </span>
                  {officer.birthPlace}
                </h3>
              )}
              {officer.deathDate && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Death: </span>
                  {officer.deathDateNote ? (
                    <>
                      {officer.deathDateNote} {officer.deathDate.slice(0, 4)}
                    </>
                  ) : (
                    <>{officer.deathDate.slice(0, 10)}</>
                  )}
                </h3>
              )}
              {officer.deathPlace && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Place: </span>
                  {officer.deathPlace}
                </h3>
              )}
            </div>
          </div>
          <table className="table event-list table-borderless w-100">
            <tbody>
              {officer.events.length && officer.events.length > 0 ? (
                officer.events.map((event, index) => {
                  let eventDate;
                  if (event.date) {
                    if (event.dateNote) {
                      eventDate = event.date.slice(0, 4).toString();
                      if (event.dateNote === "before") {
                        eventDate = "Bef. " + eventDate;
                      } else if (event.dateNote === "after") {
                        eventDate = "Aft. " + eventDate;
                      }
                    } else {
                      eventDate = event.date.slice(0, 10);
                    }
                  }
                  return (
                    <Fragment key={uuidv4()}>
                      <tr style={{ borderTop: "1px solid white" }}>
                        <td
                          rowSpan={
                            event.notes &&
                            event.notes !== "Assignment" &&
                            event.notes !== "Promotion" &&
                            event.notes !== "Demotion"
                              ? 2
                              : 1
                          }
                        >
                          {props.isAuth ? (
                            <>
                              <button
                                className="edit"
                                onClick={() => {
                                  OpenModal("event", event._id);
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
                                <i
                                  className="fa-solid fa-remove fa-xl"
                                  style={{ color: "gray" }}
                                ></i>
                              </button>
                            </>
                          ) : null}
                        </td>
                        <td className="h3cell align-top">
                          {event.date && `${eventDate}`}
                          {event.date && event.stardate && eventDate.length > 4 && <br />}
                          {event.stardate && ` SD ${event.stardate}`}
                        </td>
                        <td className="h4cell align-top">
                          {event.name && (
                            <Link to={`/starships/${event.starshipId}`} className="list-link">
                              USS{" "}
                              {event.name.replace(/-A|-B|-C|-D|-E|-F|-G|-H|-I|-J|-K|-L|-M/g, "")}{" "}
                              {event.registry}
                            </Link>
                          )}
                          {event.name && event.location && <br />}
                          {event.location && <>{event.location}</>}
                        </td>
                        <td className="h5cell align-top">
                          {event.rankLabel && (
                            <>
                              {" "}
                              {event.rankLabel.split("-").map((label, index) => {
                                let rankLabel;
                                if (index === 0) rankLabel = label;
                                return rankLabel;
                              })}
                            </>
                          )}
                          {event.rankLabel && event.position && <br />}
                          {event.position && <>{event.position}</>}
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
                  <td colSpan={7} className="h6cell">
                    No Events Yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <br />
          <p>No Officer Selected</p>
        </div>
      )}
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
        officerId={officer._id}
        starshipId={null}
        eventId={eventId}
        subjectName={officerName}
        type={imageType}
        setRefreshOption={toggleRefresh}
      />
    </>
  );
};

export default Officer;
