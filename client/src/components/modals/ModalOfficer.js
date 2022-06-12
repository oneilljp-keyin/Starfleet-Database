import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";

import { StardateConverter } from "../hooks/HooksAndFunctions";

const PopUpOfficer = (props) => {
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
    active: true,
    memoryAlphaURL: "",
  };

  const [officerInfo, setOfficerInfo] = useState(initialOfficerState);

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeOfficerInfo = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  const handleChangeChk = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.checked });
  };

  useEffect(() => {
    let isMounted = true;

    const getPersonnel = async (id) => {
      try {
        let response = await PersonnelDataService.get(id);
        if (isMounted) {
          setOfficerInfo(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    if (props.officerId) {
      getPersonnel(props.officerId);
      setEdit(true);
      setSubmitted(false);
      setBtnLabel("Update");
    }
    return () => {
      isMounted = false;
    };
  }, [edit, submitted, props.officerId]);

  const saveOfficerInfo = () => {
    let data = officerInfo;
    delete data["name"];
    delete data["registry"];
    delete data["starshipId"];
    delete data["location"];
    delete data["rankLabel"];
    delete data["provisional"];
    delete data["position"];
    delete data["date"];
    delete data["starshipCount"];
    delete data["assignCount"];
    delete data["missionCount"];
    delete data["lifeEventCount"];
    delete data["endDate"];
    Object.keys(data).forEach((key) => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });
    if (
      data.birthStardate &&
      (data.birthStardate.charAt(5) === "." || data.birthStardate.charAt(6) === ".")
    ) {
      let newDate = StardateConverter(data.birthStardate);
      data.birthDate = newDate;
    }
    if (
      data.deathStardate &&
      (data.deathStardate.charAt(5) === "." || data.deathStardate.charAt(6) === ".")
    ) {
      let newDate = StardateConverter(data.deathStardate);
      data.deathDate = newDate;
    }
    if (edit) {
      data._id = props.officerId;
      PersonnelDataService.updateOfficer(data)
        .then((response) => {
          setSubmitted(true);
          props.setRefresh();
          toast.dark(response.data.message);
          props.hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    } else {
      delete data["_id"];
      PersonnelDataService.createOfficer(data)
        .then((response) => {
          toast.dark(response.data);
          setOfficerInfo(initialOfficerState);
          props.hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    }
  };

  const closeModal = () => {
    setOfficerInfo(initialOfficerState);
    props.hide();
  };

  return props.isShowing && props.isAuth
    ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div id="main-modal-body" className={props.modalClass}>
            <div className="modal-bg events-modal modal-content-wrapper">
              <div className="events-modal-container align-content-center">
                <h3>
                  {btnLabel} Profile {props.subjectName ? ` - ${props.subjectName}` : null}
                </h3>
                <div className="d-flex row my-1 mx-2 form-group">
                  <div className="form-floating col-sm-6">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="serial"
                      id="serial"
                      placeholder="Starfleet Serial Number"
                      value={officerInfo.serial || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="serial">Starfleet Serial #</label>
                  </div>
                  <div className="col-sm-6 form-check align-items-center m-auto">
                    <input
                      className="form-check-input ms-1"
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={officerInfo.active || ""}
                      onChange={(e) => handleChangeChk(e)}
                      style={{ transform: "scale(1.8)" }}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Active in Starfleet
                    </label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      autoFocus
                      name="surname"
                      id="surname"
                      placeholder="Surname"
                      value={officerInfo.surname || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="surname">Surname</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="first"
                      id="first"
                      placeholder="First Name"
                      value={officerInfo.first || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="first">First Name</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="middle"
                      id="middle"
                      placeholder="Middle Name"
                      value={officerInfo.middle || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="middle">Middle Name</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="postNom"
                      id="postNom"
                      placeholder="Post Nominals"
                      value={officerInfo.postNom || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="postNom">Post Nominals</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-sm my-1"
                      type="date"
                      name="birthDate"
                      id="birthDate"
                      value={officerInfo.birthDate ? officerInfo.birthDate.slice(0, 10) : ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="birthDate">Date of Birth</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="birthStardate"
                      id="birthStardate"
                      placeholder="Stardate of Birth"
                      value={officerInfo.birthStardate || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="deathStardate">Stardate</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <select
                      className="form-control form-control-sm my-1"
                      name="birthDateNote"
                      id="birthDateNote"
                      value={officerInfo.birthDateNote || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <label htmlFor="birthDateNote">Date Note</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="birthPlace"
                      id="birthPlace"
                      placeholder="Place Of Birth"
                      value={officerInfo.birthPlace || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="birthPlace">Place of Birth</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-sm my-1"
                      type="date"
                      name="deathDate"
                      id="deathDate"
                      value={officerInfo.deathDate ? officerInfo.deathDate.slice(0, 10) : ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="deathDate">Date of Death</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="deathStardate"
                      id="deathStardate"
                      placeholder="Stardate of Death"
                      value={officerInfo.deathStardate || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="deathStardate">Stardate of Death</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <select
                      className="form-control form-control-sm my-1"
                      name="deathDateNote"
                      id="deathDateNote"
                      value={officerInfo.deathDateNote || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <label htmlFor="deathDateNote">Date Note</label>
                  </div>
                  <div className="form-floating col-sm-3">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="deathPlace"
                      id="deathPlace"
                      placeholder="Place Of Death"
                      value={officerInfo.deathPlace || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="deathPlace">Place of Death</label>
                  </div>
                  <div className="form-floating col-sm-12">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="memoryAlphaURL"
                      id="memoryAlphaURL"
                      placeholder="Memory Alpha Link"
                      value={officerInfo.memoryAlphaURL || ""}
                      onChange={(e) => onChangeOfficerInfo(e)}
                    />
                    <label htmlFor="deathPlace">Memory Alpha Link</label>
                  </div>
                </div>

                <button
                  className="lcars-btn orange-btn left-round small-btn"
                  onClick={saveOfficerInfo}
                >
                  {btnLabel}
                </button>
                <button className="lcars-btn red-btn right-round small-btn" onClick={closeModal}>
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
export default PopUpOfficer;
