import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import StarshipsDataService from "../../services/starships";
import EventsAndPhotosDataService from "../../services/eventsAndPhotos";

const PopUpDelete = ({
  isShowing,
  hide,
  isAuth,
  officerId,
  starshipId,
  eventId,
  setRefresh,
  recordType,
  modalClass,
}) => {
  const deleteRecord = () => {
    if (recordType === "officer") {
      PersonnelDataService.deleteOfficer(officerId)
        .then((response) => {
          setRefresh();
          hide();
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    } else if (recordType === "starship") {
      StarshipsDataService.deleteStarship(starshipId)
        .then((response) => {
          setRefresh();
          hide();
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    } else if (recordType === "event") {
      EventsAndPhotosDataService.deleteEvent(eventId)
        .then((response) => {
          setRefresh();
          hide();
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    }
  };

  return isShowing && isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className={modalClass}>
              <div className="modal-bg events-modal modal-content-wrapper">
                <div className="events-modal-container align-content-center">
                  <h3>
                    Confirm Deletion of {recordType[0].toUpperCase() + recordType.slice(1)} Record
                  </h3>
                  <button
                    className="lcars-btn orange-btn left-round small-btn"
                    onClick={deleteRecord}
                  >
                    Confirm
                  </button>
                  <button className="lcars-btn red-btn right-round small-btn" onClick={hide}>
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
