import React from "react";
import ReactDOM from "react-dom";

import PersonnelList from "./modalList/PersonnelList";
import VesselsServed from "./modalList/VesselsServed";
import Missions from "./modalList/Missions";

const PopUpList = (props) => {
  const closeModal = () => {
    props.hide();
  };

  return props.isShowing
    ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className={props.modalClass}>
            <div className="modal-bg list-modal list-modal-content-wrapper">
              <div className="list-modal-content-container align-content-center">
                {/* header */}
                <div className="d-flex justify-content-center">
                  <div className="lcars-end-cap left-round orange-btn"> </div>
                  <div className="d-flex align-items-center ms-2">
                    <span className="h3cell align-self-center">
                      {props.subjectName} {props.category}
                    </span>
                  </div>
                  <div className="lcars-btn all-square beige-btn lcars-stripe flex-grow-1"> </div>
                  <div className="lcars-end-cap right-round blue-btn"> </div>
                </div>

                {/* main body */}
                {
                  {
                    "Assigned Personnel": <PersonnelList {...props} />,
                    "First Contact Debriefs": <Missions {...props} />,
                    "Complete Chronology": <Missions {...props} />,
                    "Life Events": <Missions {...props} />,
                    "Starship Assignments": <VesselsServed {...props} />,
                    "Mission Debriefs": <Missions {...props} />,
                    "Maintenance Logs": <Missions {...props} />,
                    "Service Record": <Missions {...props} />,
                  }[props.category]
                }

                {/* footer */}
                <div className="d-flex justify-content-center list-footer">
                  <div className="lcars-end-cap left-round purple-btn"> </div>
                  <div className="lcars-btn all-square beige-btn lcars-stripe flex-grow-1"> </div>
                  <button
                    className="lcars-btn red-btn all-square small-btn me-2 footer-btn"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <div className="lcars-end-cap right-round rose-btn"> </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>,
      document.body
    )
    : null;
};
export default PopUpList;
