import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import EventsAndPhotosDataService from "../../services/eventsAndPhotos";

const PopUpList = ({
  isShowing,
  hide,
  modalClass,
  starshipName,
  officerId,
  starshipId,
  listType,
  category,
}) => {
  const [personnel, setPersonnel] = useState({});

  useEffect(() => {
    const getEvents = (oid = "", sid = "", cat = "") => {
      EventsAndPhotosDataService.getEventsByCategory(oid, sid, cat)
        .then((response) => {
          setPersonnel(
            response.data.filter(
              (element1, index) =>
                index ===
                response.data.findIndex((element2) => element2.officerId === element1.officerId)
            )
          );
          // let pp = arr.filter( (ele, ind) => ind === arr.findIndex( elem => elem.jobid === ele.jobid && elem.id === ele.id))
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getEvents(officerId, starshipId, category);
  }, [officerId, starshipId, category]);

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
                        {starshipName} {listType}
                      </span>
                    </div>
                    <div className="lcars_btn all_sqaure beige_btn flex-grow-1 m-2 p-3"> </div>
                    <div className="lcars_end_cap right_round blue_btn"> </div>
                  </div>

                  {/* main body */}
                  <div className="d-flex flex-wrap" style={{ minHeight: "calc(100% - 96px)" }}>
                    {personnel.length > 0 ? (
                      personnel
                        .sort((a, b) => a.surname.localeCompare(b.surname))
                        .map((officer) => {
                          return (
                            <div key={uuidv4()} className="p-2 bd-highlight">
                              {officer.surname}
                            </div>
                          );
                        })
                    ) : (
                      <h2 className="mx-auto my-auto">No {listType} Found</h2>
                    )}
                  </div>

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
