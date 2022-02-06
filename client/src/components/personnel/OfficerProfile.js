import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import PhotoCarousel from "../PhotoCarousel";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

const Officer = (props) => {
  // { isAuth, admin, modalClass, setModalClass }
  const imageType = "officer";
  let dateCheck;
  let dateBoolean = false;

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

  function OpenModal(modalType, id) {
    setModal(modalType);
    setEventId(id);
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
                OpenModal("event", null);
              }}
            >
              Event
            </button>
          </>
        )}
      </div>
      {officer ? (
        <div>
          <div className="rows d-flex">
            <PhotoCarousel
              subjectId={props.match.params.id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={imageType}
            />
            <div className="profile-summary">
              <h1>
                {officer.surname && <>{officer.surname}</>}
                {officer.first && <>, {officer.first}</>}
                {officer.middle && <> {officer.middle}</>}
                {officer.postNom && <>, {officer.postNom}</>}
                {officer.date && (
                  <span style={{ fontSize: "1.18rem" }}> (As of {officer.date.slice(0, 4)})</span>
                )}
              </h1>
              {officer.serial && <h2>{officer.serial}</h2>}
              {officer.rankLabel && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Rank: </span>
                  {officer.rankLabel}
                </h3>
              )}
              {officer.position && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Assignment: </span>
                  {officer.position}
                </h3>
              )}
              {(officer.position && !officer.position.includes("etired")) ||
                ((officer.starshipName || officer.location) && (
                  <h3 style={{ textTransform: "capitalize" }}>
                    {officer.starshipName ? (
                      <>
                        <span style={{ color: "#FFDD22E6" }}>Vessel: </span>
                        {officer.starshipName} {officer.starshipRegistry}
                      </>
                    ) : (
                      <>
                        <span style={{ color: "#FFDD22E6" }}>Location: </span>
                        {officer.location}
                      </>
                    )}
                  </h3>
                ))}
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
          <div className="list-group">
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
                  if (eventDate === dateCheck) {
                    dateBoolean = false;
                  } else {
                    dateBoolean = true;
                  }
                  dateCheck = eventDate;
                }
                return (
                  <div key={index} className="d-flex flex-column event-list">
                    <div className="rows d-flex flex-row align-items-baseline">
                      {props.isAuth && (
                        <button
                          className="edit"
                          onClick={() => {
                            OpenModal("event", event._id);
                          }}
                        >
                          <i className="far fa-edit" style={{ color: "gray" }}></i>
                        </button>
                      )}

                      {dateBoolean && (
                        <>
                          <h3 className="mx-1 my-0">{event.date && <>{eventDate}</>}</h3>
                          {event.stardate && (
                            <h3 className="mx-1 my-0 small_hide">[{event.stardate}]</h3>
                          )}
                        </>
                      )}
                      <h4 className="mx-1 my-0">
                        {event.starshipName && <>{event.starshipName}</>}{" "}
                        {event.starshipRegistry && <> - {event.starshipRegistry}</>}{" "}
                        {event.location && <>at/near {event.location}</>}
                      </h4>
                      <h5 className="mx-1 my-0">
                        {event.rankLabel && <>{event.rankLabel}</>}
                        {event.rankLabel && event.position && <>{" - "}</>}
                        {event.position && <>{event.position}</>}
                      </h5>
                      {event.notes === "Assignment" && (
                        <>
                          <h6 className="mx-1 my-0">&nbsp;Assignment</h6>{" "}
                        </>
                      )}
                      {event.type === "Promotion" && (
                        <>
                          <h6 className="mx-1 my-0">&nbsp;Promotion</h6>{" "}
                        </>
                      )}
                      {event.notes === "Demotion" && (
                        <>
                          <h6 className="mx-1 my-0">&nbsp;Demotion</h6>{" "}
                        </>
                      )}
                    </div>
                    <div className="rows d-flex flex-row">
                      {event.notes && event.notes !== "Assignment" && event.notes !== "Demotion" && (
                        <>
                          <h6 className="mx-1 col justify-text">{event.notes}</h6>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-sm-4">
                <p>No Events Yet</p>
              </div>
            )}
          </div>
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
        imageType={imageType}
        setRefreshOption={toggleRefresh}
      />
    </>
  );
};

export default Officer;
