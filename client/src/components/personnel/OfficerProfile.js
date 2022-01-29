import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import PhotoCarousel from "../PhotoCarousel";

import UseModalOfficer from "../modals/UseModalOfficer";
import ModalOfficer from "../modals/ModalOfficer";

import UseModalUploadEazyCrop from "../modals/UseModalUploadEazyCrop";
import ModalUploadEazyCrop from "../modals/ModalUploadEazyCrop";

import UseModalEvent from "../modals/UseModalEvent";
import ModalEvent from "../modals/ModalEvent";

const Officer = (props) => {
  // { isAuth, admin, modalClass, setModalClass }
  const imageType = "officer";
  let dateCheck;
  let dateBoolean = false;

  const [photoRefresh, setPhotoRefresh] = useState(false);
  const [profileRefresh, setProfileRefresh] = useState(false);
  const [officerName, setOfficerName] = useState("");

  const { isShowingModalOfficer, toggleModalOfficer } = UseModalOfficer();
  const { isShowingModalUploadEazyCrop, toggleModalUploadEazyCrop } = UseModalUploadEazyCrop();
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
      PersonnelDataService.get(id)
        .then((response) => {
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
  }, [props.match.params.id, profileRefresh]);

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
            <button className="lcars_btn orange_btn all_square" onClick={toggleModalUploadEazyCrop}>
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
                      {dateBoolean && (
                        <h3 className="mx-1 my-0">
                          {event.date && <>{eventDate}</>}
                          {/* {event.date && event.stardate && <>{" - "}</>} */}
                          {event.stardate && (
                            <span className="small_hide"> [{event.stardate}]</span>
                          )}
                        </h3>
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
                      {/* </div>
                    <div className="rows d-flex flex-row"> */}
                    </div>
                    <div className="rows d-flex flex-row">
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
      <ModalUploadEazyCrop
        isShowing={isShowingModalUploadEazyCrop}
        hide={toggleModalUploadEazyCrop}
        isAuth={props.isAuth}
        subjectId={props.match.params.id}
        setPhotoRefresh={setPhotoRefresh}
        imageType={imageType}
        modalClass={props.modalClass}
        setModalClass={props.setModalClass}
      />
      <ModalOfficer
        isShowing={isShowingModalOfficer}
        hide={toggleModalOfficer}
        isAuth={props.isAuth}
        officerId={props.match.params.id}
        subjectName={officerName}
        setProfileRefresh={setProfileRefresh}
        modalClass={props.modalClass}
        setModalClass={props.setModalClass}
      />
      <ModalEvent
        isShowing={isShowingModalEvent}
        hide={toggleModalEvent}
        isAuth={props.isAuth}
        officerId={props.match.params.id}
        subjectName={officerName}
        setProfileRefresh={setProfileRefresh}
        modalClass={props.modalClass}
        setModalClass={props.setModalClass}
      />
    </>
  );
};

export default Officer;
