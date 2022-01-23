import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";

const PopUpEvents = ({ isShowing, hide, isAuth, officerId, subjectName, setProfileRefresh }) => {
  const [edit, setEdit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initialOfficerState = {
    _id: "",
    surname: "",
    first: "",
    middle: "",
    postNom: "",
    birthDate: "",
    birthStardate: "",
    birthPlace: "",
    birthDateNote: "",
    deathDate: "",
    deathStardate: "",
    deathPlace: "",
    deathDateNote: "",
    serial: "",
    events: [],
  };

  const [officerInfo, setOfficerInfo] = useState(initialOfficerState);

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeOfficerInfo = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getPersonnel = async (id) => {
      try {
        let response = await PersonnelDataService.get(id);
        setOfficerInfo(response.data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    if (officerId) {
      getPersonnel(officerId);
      setEdit(true);
      setSubmitted(false);
      setBtnLabel("Update");
    }
  }, [edit, submitted, officerId]);

  const saveOfficerInfo = () => {
    let data = officerInfo;
    delete data["events"];
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });
    console.log(data);
    if (edit) {
      data._id = officerId;
      PersonnelDataService.updateOfficer(data)
        .then((response) => {
          setSubmitted(true);
          setProfileRefresh(true);
          console.log(response.data);
          toast.success(response.data.message);
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    } else {
      delete data["_id"];
      PersonnelDataService.createOfficer(data)
        .then((response) => {
          toast.success(response.data);
          setOfficerInfo(initialOfficerState);
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    }
  };

  const closeModal = () => {
    setOfficerInfo(initialOfficerState);
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
                      className="col form-control form-control-md my-1"
                      type="text"
                      name="serial"
                      placeholder="Starfleet Serial Number"
                      value={officerInfo.serial}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <div className="col"></div>
                    <div className="w-100"></div>
                    <input
                      className="col form-control form-control-md my-1"
                      type="text"
                      autoFocus
                      name="surname"
                      placeholder="Surname"
                      value={officerInfo.surname}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <input
                      className="col form-control form-control-md my-1"
                      type="text"
                      name="first"
                      placeholder="First Name"
                      value={officerInfo.first}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <input
                      className="col form-control form-control-md my-1"
                      type="text"
                      name="middle"
                      placeholder="Middle Name"
                      value={officerInfo.middle}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <input
                      className="col form-control form-control-md my-1"
                      type="text"
                      name="postNom"
                      placeholder="Post Nominals"
                      value={officerInfo.postNom}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <div className="w-100"></div>
                    <label className="col-6 my-0 form-control-md" htmlFor="birthDate">
                      Birth Details:
                    </label>
                    <label className="col-6 my-0 form-control-md" htmlFor="deathDate">
                      Death Details:
                    </label>
                    <div className="w-100"></div>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="birthDate"
                      value={officerInfo.birthDate ? officerInfo.birthDate.slice(0, 10) : ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <select
                      className="col form-control form-control-sm my-1"
                      name="birthDateNote"
                      value={officerInfo.birthDateNote}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="deathDate"
                      value={officerInfo.deathDate ? officerInfo.deathDate.slice(0, 10) : ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <select
                      className="col form-control form-control-sm my-1"
                      name="deathDateNote"
                      value={officerInfo.deathDateNote}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <div className="w-100"></div>{" "}
                    <input
                      className="col form-control form-control-md my-1"
                      type="text"
                      name="birthPlace"
                      placeholder="Place Of Birth"
                      value={officerInfo.birthPlace}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <input
                      className="col form-control form-control-md my-1"
                      type="text"
                      name="deathPlace"
                      placeholder="Place Of Death"
                      value={officerInfo.deathPlace}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                  </div>

                  <button
                    className="lcars_btn orange_btn left_round small_btn"
                    onClick={saveOfficerInfo}
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
