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
  category,
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
                    <div className="lcars_end_cap left_round orange_btn"> </div>
                    <div className="d-flex align-items-center ms-2">
                      <span className="h3cell align-self-center">
                        {subjectName} {listType}
                      </span>
                    </div>
                    <div className="lcars_btn all_sqaure beige_btn flex-grow-1 m-2 p-3"> </div>
                    <div className="lcars_end_cap right_round blue_btn"> </div>
                  </div>

                  {/* main body */}
                  {
                    {
                      Personnel: (
                        <PersonnelList
                          listType={listType}
                          starshipId={starshipId}
                          category={category}
                        />
                      ),
                      "First Contact Missions": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          starshipId={starshipId}
                          category={category}
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
                      "Vessels Assigned": (
                        <VesselsServed
                          listType={listType}
                          officerId={officerId}
                          category={category}
                        />
                      ),
                      "General Missions": (
                        <Missions
                          isAuth={isAuth}
                          listType={listType}
                          officerId={officerId}
                          starshipId={starshipId}
                          category={category}
                          subjectName={subjectName}
                        />
                      ),
                      "Repairs/Upgrades": (
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
                    }[listType]
                  }

                  {/* footer */}
                  <div className="d-flex justify-content-center list-footer">
                    <div className="lcars_end_cap left_round purple_btn"> </div>
                    <div className="lcars_btn all_sqaure beige_btn flex-grow-1 m-2 p-3"> </div>
                    <button
                      className="lcars_btn red_btn all_square small_btn me-2 footer-btn"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <div className="lcars_end_cap right_round rose_btn"> </div>
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
