import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import DataService from "../../services/DBAccess";

import { StardateConverter, Loading, dateOptions, statusTypes } from "../hooks/HooksAndFunctions";

const PopUpOfficer = (props) => {
  const category = props.category || props.entryType;

  const [edit, setEdit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Retired", value: "Retired" },
    { label: "Dishcarged", value: "Discarged" },
    { label: "Missing-In-Action", value: "Missing-In-Action" },
    { label: "Killed-In-Action", value: "Killed-In-Action" },
    { label: "Deceased", value: "Deceased" },
  ];

  const initialOfficerState = {
    _id: null,
    status: "active",
    active: true,
    status: null,
    birthDate: null,
    birthDateNote: null,
    birthPlace: null,
    birthStardate: null,
    deathDate: null,
    deathDateNote: null,
    deathPlace: null,
    deathStardate: null,
    first: null,
    memoryAlphaURL: null,
    middle: null,
    postNom: null,
    serial: null,
    surname: null,
  };

  const [officerInfo, setOfficerInfo] = useState(initialOfficerState);

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeOfficerInfo = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  // const handleChangeChk = (e) => {
  //   setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.checked });
  // };

  useEffect(() => {
    let isMounted = true;

    const getPersonnel = async (cat, id) => {
      try {
        let response = await DataService.getOne(cat, id);
        if (isMounted) {
          setOfficerInfo(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    if (props.officerId) {
      getPersonnel(category, props.officerId);
      setEdit(true);
      setSubmitted(false);
      setBtnLabel("Update");
    }
    return () => {
      isMounted = false;
    };
  }, [edit, submitted, props.officerId, category]);

  const saveOfficerInfo = () => {
    setIsLoading(true);
    let data = officerInfo;
    delete data["name"];
    delete data["active"];
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
      DataService.update(category, data)
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
      DataService.create(category, data)
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
    setIsLoading(false);
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
                  <div className="d-flex row form-group">
                    <div className="form-floating col-sm-6">
                      <input
                        className="form-control form-control-md"
                        type="text"
                        name="serial"
                        id="serial"
                        placeholder="Starfleet Serial Number"
                        value={officerInfo.serial || ""}
                        onChange={(e) => onChangeOfficerInfo(e)}
                      />
                      <label htmlFor="serial">Starfleet Serial #</label>
                    </div>
                    {/* <div className="col-sm-6 form-check align-items-center m-auto"> */}
                    <div className="form-floating col-sm-6">
                      {/* <input
                      className="form-check-input ms-1"
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={officerInfo.active || ""}
                      onChange={(e) => handleChangeChk(e)}
                      style={{ transform: "scale(1.8)" }}
                    /> */}
                      <select
                        className="form-control my-1 text-center"
                        name="status"
                        id="status"
                        value={officerInfo.status || "active"}
                        onChange={(e) => onChangeOfficerInfo(e)}
                      >
                        {statusOptions.map(({ label, value }) => (
                          <option key={uuidv4()} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {/* <label className="form-check-label" htmlFor="status"> */}
                      <label htmlFor="status">Status</label>
                    </div>
                    <div className="form-floating col-sm-3">
                      <input
                        className="form-control form-control-md"
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
                        className="form-control form-control-md"
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
                        className="form-control form-control-md"
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
                        className="form-control form-control-md"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-lg"
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
                        className="form-control form-control-sm"
                        name="birthDateNote"
                        id="birthDateNote"
                        value={officerInfo.birthDateNote || ""}
                        onChange={(e) => onChangeOfficerInfo(e)}
                      >
                        {dateOptions.map(({ label, value }) => (
                          <option key={uuidv4()} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="birthDateNote">Date Note</label>
                    </div>
                    <div className="form-floating col-sm-3">
                      <input
                        className="form-control form-control-md"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-lg"
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
                        className="form-control form-control-sm"
                        name="deathDateNote"
                        id="deathDateNote"
                        value={officerInfo.deathDateNote || ""}
                        onChange={(e) => onChangeOfficerInfo(e)}
                      >
                        {dateOptions.map(({ label, value }) => (
                          <option key={uuidv4()} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="deathDateNote">Date Note</label>
                    </div>
                    <div className="form-floating col-sm-3">
                      <input
                        className="form-control form-control-md"
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
                        className="form-control form-control-md"
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
                  {isLoading ? <Loading /> : null}
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
