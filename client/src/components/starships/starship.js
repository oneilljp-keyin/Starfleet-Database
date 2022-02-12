import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";
import PhotoCarousel from "../PhotoCarousel";
import StarshipsSame from "./StarshipsSame";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

const Starships = (props) => {
  const [imageType, setImageType] = useState("starship");
  // let dateCheck;
  // let dateBoolean = false;

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

  function OpenModal(modalType, id, option = imageType) {
    setModal(modalType);
    setEventId(id);
    setImageType(option);
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
                    {starship.launch_note === "before" && "Before "}
                    {starship.launch_note === "after" && "After "}
                    {starship.launch_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.commission_date && (
                  <>
                    <strong>Commission: </strong>
                    {starship.commission_note === "before" && "Before "}
                    {starship.commission_note === "after" && "After "}
                    {starship.commission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.decommission_date && (
                  <>
                    <strong>Decommission: </strong>
                    {starship.decommission_note === "before" && "Before "}
                    {starship.decommission_note === "after" && "After "}
                    {starship.decommission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.destruction_date && (
                  <>
                    <strong>Destruction: </strong>
                    {starship.destruction_note === "before" && "Before "}
                    {starship.destruction_note === "after" && "After "}
                    {starship.destruction_date.slice(0, 4)}
                    <br />
                  </>
                )}
              </p>
            </div>
          </div>

          <StarshipsSame starshipName={starship.name} starshipId={starship._id} />

          <table className="table event-list table-borderless w-100">
            <tbody>
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
                    // if (eventDate === dateCheck) {
                    //   dateBoolean = false;
                    // } else {
                    //   dateBoolean = true;
                    // }
                    // dateCheck = eventDate;
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
                    <>
                      <tr key={index} style={{ borderTop: "1px solid white" }}>
                        <td>
                          {props.isAuth ? (
                            <button
                              className="edit"
                              onClick={() => {
                                let eventOption = event.officerId ? "officer" : "starship";
                                OpenModal("event", event._id, eventOption);
                              }}
                            >
                              <i className="far fa-edit" style={{ color: "gray" }}></i>
                            </button>
                          ) : null}
                        </td>
                        <td className="h3cell align-top">
                          {event.date && `${eventDate}`}
                          {event.date && event.stardate && <br />}
                          {event.stardate && `SD ${event.stardate}`}
                        </td>
                        <td className="h4cell align-top">
                          {event.location && <>{event.location}</>}
                        </td>
                        <td className="h5cell align-top">
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
                        </td>
                      </tr>
                      {event.notes &&
                        event.notes !== "Assignment" &&
                        event.notes !== "Promotion" &&
                        event.notes !== "Demotion" && (
                          <tr>
                            <td className="align-top">
                              {/* <i className="fas fa-square fa-xs" style={{ color: "#f9f9f9" }}></i> */}
                            </td>
                            <td className="h6cell" colSpan={7}>
                              {event.notes}
                            </td>
                          </tr>
                        )}
                    </>
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
          <p>No Starship Selected</p>
        </div>
      )}
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
