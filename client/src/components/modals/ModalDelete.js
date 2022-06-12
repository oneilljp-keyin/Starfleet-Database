import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import StarshipsDataService from "../../services/starships";
import EventsAndPhotosDataService from "../../services/eventsAndPhotos";

const PopUpDelete = (props) => {
  const deleteRecord = () => {
    if (props.recordType === "officer") {
      PersonnelDataService.deleteOfficer(props.officerId)
        .then((response) => {
          props.setRefresh();
          props.hide();
          toast.dark(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    } else if (props.recordType === "starship") {
      StarshipsDataService.deleteStarship(props.starshipId)
        .then((response) => {
          props.setRefresh();
          props.hide();
          toast.dark(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    } else if (props.recordType === "event") {
      EventsAndPhotosDataService.deleteEvent(props.eventId)
        .then((response) => {
          props.setRefresh();
          props.hide();
          toast.dark(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    }
  };

  return props.isShowing && props.isAuth
    ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className={props.modalClass}>
            <div className="modal-bg events-modal modal-content-wrapper">
              <div className="events-modal-container align-content-center">
                <h3>
                  Confirm Deletion of{" "}
                  {props.recordType[0].toUpperCase() + props.recordType.slice(1)} Record
                </h3>
                <button
                  className="lcars-btn orange-btn left-round small-btn"
                  onClick={deleteRecord}
                >
                  Confirm
                </button>
                <button className="lcars-btn red-btn right-round small-btn" onClick={props.hide}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>,
      document.body
    )
    : null;
};
export default PopUpDelete;
