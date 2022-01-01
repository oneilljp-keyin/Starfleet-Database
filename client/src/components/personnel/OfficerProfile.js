import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import PhotoCarousel from "../PhotoCarousel";

import UseModalOfficer from "../modals/UseModalOfficer";
import ModalOfficer from "../modals/ModalOfficer";
import UseModalUpload from "../modals/UseModalUpload";
import ModalUpload from "../modals/ModalUpload";
import UseModalEvent from "../modals/UseModalEvent";
import ModalEvent from "../modals/ModalEvent";

const Officer = (props) => {
  const database = props.database;
  const imageType = "officer";

  const [photoRefresh, setPhotoRefresh] = useState(false);
  const [profileRefresh, setProfileRefresh] = useState(false);
  const [officerName, setOfficerName] = useState("");

  const { isShowingModalOfficer, toggleModalOfficer } = UseModalOfficer();
  const { isShowingModalUpload, toggleModalUpload } = UseModalUpload();
  const { isShowingModalEvent, toggleModalEvent } = UseModalEvent();

  const initialOfficerState = {
    _id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
    birthDate: null,
    birthStardate: null,
    birthPlace: null,
    deathDate: null,
    deathStardate: null,
    deathPlace: null,
    serial: null,
    events: [],
  };

  const [officer, setOfficer] = useState(initialOfficerState);

  useEffect(() => {
    const getOfficer = (id) => {
      PersonnelDataService.get(id, database)
        .then((response) => {
          console.log(response.data);
          setOfficer(response.data);
          setProfileRefresh(false);
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
  }, [props.match.params.id, profileRefresh, database]);

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        <Link to={"/personnel"} className="lcars_btn orange_btn left_round">
          Search
        </Link>
        {props.isAuth && (
          <>
            <button className="lcars_btn orange_btn all_square" onClick={toggleModalOfficer}>
              Edit
            </button>
            <button className="lcars_btn orange_btn all_square" onClick={toggleModalUpload}>
              Upload
            </button>
            <button className="lcars_btn orange_btn right_round" onClick={toggleModalEvent}>
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
              photoRefresh={photoRefresh}
              setPhotoRefresh={setPhotoRefresh}
              imageType={imageType}
            />
            <div>
              <h1>
                {officer.surname && <>{officer.surname}</>}
                {officer.first && <>, {officer.first}</>}
                {officer.middle && <> {officer.middle}</>}
                {officer.postNom && <>, {officer.postNom}</>}
              </h1>
              <h2>{officer.serial}</h2>
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
                      eventDate = "Before " + eventDate;
                    } else if (event.dateNote === "after") {
                      eventDate = "After " + eventDate;
                    }
                  } else {
                    eventDate = event.date.slice(0, 10);
                  }
                }
                return (
                  <div key={index} className="d-flex flex-column align-items-baseline event-list">
                    <div className="rows d-flex flex-row">
                      <h3 className="row mx-1 my-0">
                        {event.date && <>{eventDate}</>}
                        {event.date && event.stardate && <>{" - "}</>}
                        {event.stardate && <>{event.stardate}</>}
                        {/* {event.starshipName && event.location && <> - </>}{" "} */}
                      </h3>
                      <h4 className="row mx-1 my-0">
                        {event.starshipName && <>{event.starshipName}</>}{" "}
                        {event.starshipRegistry && <> - {event.starshipRegistry}</>}{" "}
                        {event.location && <>at/near {event.location}</>}
                      </h4>
                    </div>
                    <div className="rows d-flex flex-row">
                      {event.rankLabel && <h5 className="mx-1 col-auto">{event.rankLabel} - </h5>}
                      {event.position && <h5 className="mx-1 col-auto">{event.position} - </h5>}
                      <h6 className="mx-1 col justify-text">{event.notes}</h6>
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
      <ModalUpload
        isShowing={isShowingModalUpload}
        hide={toggleModalUpload}
        isAuth={props.isAuth}
        subjectId={props.match.params.id}
        setPhotoRefresh={setPhotoRefresh}
        imageType={imageType}
      />
      <ModalOfficer
        isShowing={isShowingModalOfficer}
        hide={toggleModalOfficer}
        isAuth={props.isAuth}
        officerId={props.match.params.id}
        subjectName={officerName}
        setProfileRefresh={setProfileRefresh}
      />
      <ModalEvent
        isShowing={isShowingModalEvent}
        hide={toggleModalEvent}
        isAuth={props.isAuth}
        officerId={props.match.params.id}
        subjectName={officerName}
        setProfileRefresh={setProfileRefresh}
      />
    </>
  );
};

export default Officer;
