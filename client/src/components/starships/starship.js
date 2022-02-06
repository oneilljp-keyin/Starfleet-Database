import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";
import PhotoCarousel from "../PhotoCarousel";

import UseModal from "../modals/UseModal";

// import ModalStarship from "../modals/ModalStarship";
// import ModalUploadEazyCrop from "../modals/ModalUploadEazyCrop";
// import ModalEvent from "../modals/ModalEvent";

import ModalLauncher from "../modals/ModalLauncher";

const Starships = (props) => {
  const imageType = "starship";
  let dateCheck;
  let dateBoolean = false;

  const [starshipName, setStarshipName] = useState("");
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  const initialStarshipsState = {
    _id: null,
    ship_id: null,
    name: null,
    registry: null,
    class: null,
    launch_date: null,
    launch_stardate: null,
    launch_note: null,
    commission_date: null,
    commission_stardate: null,
    commission_note: null,
    decommission_date: null,
    decommission_stardate: null,
    decommission_note: null,
    destruction_date: null,
    destruction_stardate: null,
    destruction_note: null,
    events: [],
  };

  const [starship, setStarship] = useState(initialStarshipsState);

  useEffect(() => {
    const getStarship = (id) => {
      StarshipsDataService.get(id)
        .then((response) => {
          setStarship(response.data);
          setStarshipName(response.data.name + " " + response.data.registry);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getStarship(props.match.params.id);
  }, [props.match.params.id, refreshOption]);

  function OpenModal(modalType, id) {
    setModal(modalType);
    setEventId(id);
    toggleModal();
  }

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        <Link to={"/starships"} className="lcars_btn orange_btn left_round">
          Search
        </Link>
        {props.isAuth && (
          <>
            <button
              className="lcars_btn orange_btn all_square"
              onClick={() => {
                OpenModal("starship", starship._id);
              }}
            >
              Edit
            </button>
            <button
              className="lcars_btn orange_btn all_square"
              onClick={() => {
                OpenModal("photo", starship._id);
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
      {starship ? (
        <div>
          <div className="rows d-flex flex-wrap">
            <PhotoCarousel
              subjectId={props.match.params.id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={imageType}
              className="flex-grow-1"
            />
            <div className="m-1 width-auto">
              {starship.name && <h1>U.S.S. {starship.name}</h1>}
              {starship.registry && <h2>{starship.registry}</h2>}
              {starship.class && <h3>{starship.class} Class</h3>}
            </div>
            <div className="m-1 width-auto">
              <p className="text-end">
                {starship.launch_date && (
                  <>
                    <strong>Launch: </strong>
                    {starship.launch_date_note === "before" && "Before "}
                    {starship.launch_date_note === "after" && "After "}
                    {starship.launch_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.commission_date && (
                  <>
                    <strong>Commission: </strong>
                    {starship.commission_date_note === "before" && "Before "}
                    {starship.commission_date_note === "after" && "After "}
                    {starship.commission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.decommission_date && (
                  <>
                    <strong>Decommission: </strong>
                    {starship.decommission_date_note === "before" && "Before "}
                    {starship.decommission_date_note === "after" && "After "}
                    {starship.decommission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.destruction_date && (
                  <>
                    <strong>Destruction: </strong>
                    {starship.destruction_date_note === "before" && "Before "}
                    {starship.destruction_date_note === "after" && "After "}
                    {starship.destruction_date.slice(0, 4)}
                    <br />
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="list-group">
            {starship.events.length > 0 ? (
              starship.events.map((event, index) => {
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
                  if (eventDate === dateCheck) {
                    dateBoolean = false;
                  } else {
                    dateBoolean = true;
                  }
                  dateCheck = eventDate;
                }
                let officerName = "";
                if (event.surname || event.first || event.last) {
                  if (event.rankLabel) {
                    officerName = event.rankLabel;
                  }
                  if (event.first) {
                    officerName += " " + event.first;
                  }
                  if (event.middle) {
                    let middleI = event.middle.slice(0, 1);
                    officerName += " " + middleI + ".";
                  }
                  if (event.surname) {
                    officerName += " " + event.surname;
                  }
                }

                return (
                  <div key={index} className="d-flex flex-column align-items-baseline event-list">
                    <div className="rows d-flex flex-row">
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
                        <h3 className="row mx-1 my-0">
                          {event.date && <>{eventDate}</>}
                          {event.date && event.stardate && <>{" - "}</>}
                          {event.stardate && <>{event.stardate}</>}
                        </h3>
                      )}
                      <h4 className="row mx-1 my-0">
                        {event.location && <>at/near {event.location}</>}
                      </h4>
                      <h5>
                        {officerName !== undefined && <>{officerName}</>}
                        {officerName !== undefined && event.position !== undefined && <>{" - "}</>}
                        {event.position !== undefined && <>{event.position}</>}
                      </h5>
                      {event.notes === "Assignment" && <h6>&nbsp;-&nbsp;Assignment</h6>}
                    </div>
                    {event.notes !== "Assignment" && (
                      <div className="rows d-flex flex-row">
                        <h6 className="mx-1 col justify-text">{event.notes}</h6>
                      </div>
                    )}
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
          <p>No Starship Selected</p>
        </div>
      )}
      {/* <ModalUploadEazyCrop
        isShowing={isShowingModalUploadEazyCrop}
        hide={toggleModalUploadEazyCrop}
        isAuth={props.isAuth}
        subjectId={props.match.params.id}
        setPhotoRefresh={setPhotoRefresh}
        imageType={imageType}
        modalClass={props.modalClass}
        setModalClass={props.setModalClass}
      />
      <ModalStarship
        isShowing={isShowingModalStarship}
        hide={toggleModalStarship}
        isAuth={props.isAuth}
        starshipId={props.match.params.id}
        subjectName={starship.name}
        subjectRegistry={starship.registry}
        setPhotoRefresh={setPhotoRefresh}
        setProfileRefresh={setProfileRefresh}
        modalClass={props.modalClass}
        setModalClass={props.setModalClass}
      />
      <ModalEvent
        isShowing={isShowingModalEvent}
        hide={toggleModalEvent}
        isAuth={props.isAuth}
        officerId=""
        starshipId={props.match.params.id}
        subjectName={starshipName}
        setProfileRefresh={setProfileRefresh}
        modalClass={props.modalClass}
        setModalClass={props.setModalClass}
      /> */}
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
        officerId={null}
        starshipId={starship._id}
        eventId={eventId}
        subjectName={starshipName}
        imageType={imageType}
        setRefreshOption={toggleRefresh}
      />
    </>
  );
};

export default Starships;
