import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";

const PopUpEvents = ({ isShowing, hide, isAuth, starshipId, subjectName, setProfileRefresh }) => {
  const [edit, setEdit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initialStarshipState = {
    _id: "",
    ship_id: "",
    name: "",
    registry: "",
    class: "",
    launch_date: "",
    launch_stardate: "",
    launch_note: "",
    commission_date: "",
    commission_stardate: "",
    commission_note: "",
    decommission_date: "",
    decommission_stardate: "",
    decommission_note: "",
    destruction_date: "",
    destruction_stardate: "",
    destruction_note: "",
    events: [],
  };

  const [starshipInfo, setStarshipInfo] = useState(initialStarshipState);

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeStarshipInfo = (e) => {
    setStarshipInfo({ ...starshipInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getPersonnel = async (id) => {
      try {
        let response = await StarshipsDataService.get(id);
        setStarshipInfo(response.data);
        // console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getPersonnel(starshipId);
    setEdit(true);
    setSubmitted(false);
    setBtnLabel("Update");
  }, [edit, submitted, starshipId]);

  const saveStarshipInfo = () => {
    let data = starshipInfo;
    delete data["events"];

    if (edit) {
      data._id = starshipId;
      StarshipsDataService.updateOfficer(data)
        .then((response) => {
          setSubmitted(true);
          toast.success(response.data);
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    } else {
      StarshipsDataService.createOfficer(data)
        .then((response) => {
          toast.success(response.data);
          setStarshipInfo(initialStarshipState);
          setProfileRefresh(true);
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    }
  };

  const closeModal = () => {
    setStarshipInfo(initialStarshipState);
    hide();
  };

  return isShowing && isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal-main-body">
              <div className="events-modal modal-content-wrapper">
                <div className="events-modal-container align-content-center">
                  <h3>
                    {btnLabel} Profile - {subjectName}
                  </h3>
                  <div className="d-flex row my-1 mx-2 form-group">
                    <div className="col"></div>
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="serial"
                      placeholder="Starfleet Serial Number"
                      value={starshipInfo.serial}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <div className="col"></div>
                    <div className="w-100"></div>{" "}
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      autoFocus
                      name="surname"
                      placeholder="Surname"
                      value={starshipInfo.surname}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="first"
                      placeholder="First Name"
                      value={starshipInfo.first}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="middle"
                      placeholder="Middle Name"
                      value={starshipInfo.middle}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="postNom"
                      placeholder="Post Nominals"
                      value={starshipInfo.postNom}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <div className="w-100"></div>{" "}
                    <label className="col-auto my-1 text-right form-control-lg" htmlFor="birthDate">
                      Date Of Birth:
                    </label>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="birthDate"
                      value={starshipInfo.birthDate ? starshipInfo.birthDate.slice(0, 10) : ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      className="col form-control my-1"
                      name="birthDateNote"
                      value={starshipInfo.birthDateNote}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <label className="col-auto my-1 form-control-lg" htmlFor="deathDate">
                      Date Of Death:
                    </label>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="deathDate"
                      value={starshipInfo.deathDate ? starshipInfo.deathDate.slice(0, 10) : ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      className="col form-control my-1"
                      name="deathDateNote"
                      value={starshipInfo.deathDateNote}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <div className="w-100"></div>{" "}
                    <label
                      className="col-auto my-1 text-right form-control-lg"
                      htmlFor="birthPlace"
                    >
                      Place Of Birth:
                    </label>
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="birthPlace"
                      placeholder="Place Of Birth"
                      value={starshipInfo.birthPlace}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    {/* <div className="col"></div> */}
                    <label className="col-auto my-1 form-control-lg" htmlFor="deathPlace">
                      Place Of Death:
                    </label>
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="deathPlace"
                      placeholder="Place Of Death"
                      value={starshipInfo.deathPlace}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                  </div>

                  <button
                    className="lcars_btn orange_btn left_round small_btn"
                    onClick={saveStarshipInfo}
                  >
                    {btnLabel}
                  </button>
                  <button className="lcars_btn red_btn right_round small_btn" onClick={closeModal}>
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
export default PopUpEvents;
