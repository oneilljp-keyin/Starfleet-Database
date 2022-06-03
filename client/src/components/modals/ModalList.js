import React from "react";
import ReactDOM from "react-dom";

import PersonnelList from "./modalList/PersonnelList";
import VesselsServed from "./modalList/VesselsServed";
import Missions from "./modalList/Missions";

const PopUpList = ({
  isShowing,
  isAuth,
  hide,
  modalClass,
  subjectName,
  officerId,
  starshipId,
  listType,
  category, // Label for display
}) => {
  const closeModal = () => {
    hide();
  };

  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className={modalClass}>
              <div className="modal-bg list-modal list-modal-content-wrapper">
                <div className="list-modal-content-container align-content-center">
                  {/* header */}
                  <div className="d-flex justify-content-center">
                    <div className="lcars-end-cap left-round orange-btn"> </div>
                    <div className="d-flex align-items-center ms-2">
                      <span className="h3cell align-self-center">
                        {subjectName} {category}
                      </span>
                    </div>
                    <div className="lcars-btn all_sqaure beige-btn flex-grow-1 m-2 p-3"> </div>
                    <div className="lcars-end-cap right-round blue-btn"> </div>
                  </div>

                  {/* main body */}
                  {
                    {
                      "Assigned Personnel": (
                        <PersonnelList
                          listType={listType}
                          starshipId={starshipId}
                          category={category}
                        />
                      ),
                      "First Contact Debriefs": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          starshipId={starshipId}
                          category={category}
                        />
                      ),
                      "Complete Chronology": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          starshipId={starshipId}
                          officerId={officerId}
                          category={category}
                          subjectName={subjectName}
                        />
                      ),
                      "Life Events": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          officerId={officerId}
                          category={category}
                          subjectName={subjectName}
                        />
                      ),
                      "Starship Assignments": (
                        <VesselsServed
                          listType={listType}
                          officerId={officerId}
                          category={category}
                        />
                      ),
                      "Mission Debriefs": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          officerId={officerId}
                          starshipId={starshipId}
                          category={category}
                          subjectName={subjectName}
                        />
                      ),
                      "Maintenance Logs": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          starshipId={starshipId}
                          category={category}
                          subjectName={subjectName}
                        />
                      ),
                      "Service Record": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          officerId={officerId}
                          category={category}
                          subjectName={subjectName}
                        />
                      ),
                    }[category]
                  }

                  {/* footer */}
                  <div className="d-flex justify-content-center list-footer">
                    <div className="lcars-end-cap left-round purple-btn"> </div>
                    <div className="lcars-btn all_sqaure beige-btn flex-grow-1 m-2 p-3"> </div>
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
