import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";
import PhotoCarousel from "../PhotoCarousel";

import ModalStarship from "../modals/ModalStarship";
import UseModalStarship from "../modals/UseModalStarship";
import UseModalUpload from "../modals/UseModalUpload";
import ModalUpload from "../modals/ModalUpload";
import UseModalEvent from "../modals/UseModalEvent";
import ModalEvent from "../modals/ModalEvent";

const Starships = (props) => {
  const database = props.database;
  const imageType = "starship";

  const [photoRefresh, setPhotoRefresh] = useState(false);
  const [profileRefresh, setProfileRefresh] = useState(false);
  const [starshipName, setStarshipName] = useState("");
  const { isShowingModalStarship, toggleModalStarship } = UseModalStarship();
  const { isShowingModalUpload, toggleModalUpload } = UseModalUpload();
  const { isShowingModalEvent, toggleModalEvent } = UseModalEvent();

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
      StarshipsDataService.get(id, database)
        .then((response) => {
          setStarship(response.data);
          console.log(response.data);
          setProfileRefresh(false);
          setStarshipName(response.data.name + " " + response.data.registry);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getStarship(props.match.params.id);
  }, [props.match.params.id, database, profileRefresh]);

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        <Link to={"/starships"} className="lcars_btn orange_btn left_round">
          Search
        </Link>
        {props.isAuth && (
          <>
            <button className="lcars_btn orange_btn all_square" onClick={toggleModalStarship}>
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
      {starship ? (
        <div>
          <div className="rows d-flex flex-wrap">
            <PhotoCarousel
              subjectId={props.match.params.id}
              isAuth={props.isAuth}
              photoRefresh={photoRefresh}
              setPhotoRefresh={setPhotoRefresh}
              imageType={imageType}
              className="flex-grow-1"
            />
            <div className="m-1">
              {starship.name && <h1>U.S.S. {starship.name}</h1>}
              {starship.registry && <h2>{starship.registry}</h2>}
              {starship.class && <h3>{starship.class} Class</h3>}
            </div>
            <div className="m-3">
              <p>
                {starship.launch_date && (
                  <>
                    <strong>Launch: </strong>
                    {starship.launch_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.commission_date && (
                  <>
                    <strong>Commission: </strong>
                    {starship.decommission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.decommission_date && (
                  <>
                    <strong>Decommission: </strong>
                    {starship.decommission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.destruction_date && (
                  <>
                    <strong>Destruction: </strong>
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
                }
                let officerName = "";
                if (event.officerInfo.length > 0) {
                  if (event.rankLabel) {
                    officerName = event.rankLabel;
                  }
                  if (event.officerInfo[0].first) {
                    officerName += " " + event.officerInfo[0].first;
                  }
                  if (event.officerInfo[0].middle) {
                    let middleI = event.officerInfo[0].middle.slice(0, 1);
                    officerName += " " + middleI + ".";
                  }
                  if (event.officerInfo[0].surname) {
                    officerName += " " + event.officerInfo[0].surname;
                  }
                }

                return (
                  <div key={index} className="d-flex flex-column align-items-baseline">
                    <div className="rows d-flex flex-row">
                      <h3 className="row mx-1 my-0">
                        {event.date && <>{eventDate}</>}
                        {event.date && event.stardate && <>{" - "}</>}
                        {event.stardate && <>{event.stardate}</>}
                        {/* {event.starshipName && event.location && <> - </>}{" "} */}
                      </h3>
                      <h4 className="row mx-1 my-0">
                        {event.location && <>at/near {event.location}</>}
                      </h4>
                    </div>
                    <div className="rows d-flex flex-row">
                      {officerName !== undefined && (
                        <h5 className="mx-1 col-auto">{officerName} - </h5>
                      )}
                      {event.position !== undefined && (
                        <h5 className="mx-1 col-auto">{event.position} - </h5>
                      )}
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
          <p>No Starship Selected</p>
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
      <ModalStarship
        isShowing={isShowingModalStarship}
        hide={toggleModalStarship}
        isAuth={props.isAuth}
        starshipId={props.match.params.id}
        subjectName={starshipName}
        setPhotoRefresh={setProfileRefresh}
      />
      <ModalEvent
        isShowing={isShowingModalEvent}
        hide={toggleModalEvent}
        isAuth={props.isAuth}
        officerId=""
        starshipId={props.match.params.id}
        subjectName={starshipName}
        setProfileRefresh={setProfileRefresh}
      />
    </>
  );
};

export default Starships;
