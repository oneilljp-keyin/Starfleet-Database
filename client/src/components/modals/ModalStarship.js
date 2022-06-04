import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import StarshipsDataService from "../../services/starships";
import { StardateConverter } from "../hooks/HooksAndFunctions";

const PopUpStarship = ({
  isShowing,
  hide,
  isAuth,
  starshipId,
  subjectName,
  setRefresh,
  modalClass,
}) => {
  const [edit, setEdit] = useState(false);
  const [classes, setClasses] = useState(["Unknown"]);

  const dateOptions = [
    { label: "Exact", value: "exact" },
    { label: "Approximate", value: "approx" },
    { label: "Before", value: "before" },
    { label: "After", value: "after" },
  ];

  // const initialStarshipState = {
  //   _id: null,
  //   ship_id: null,
  //   shipyard: null,
  //   name: null,
  //   registry: null,
  //   class: null,
  //   launch_date: null,
  //   launch_stardate: null,
  //   launch_note: null,
  //   commission_date: null,
  //   commission_stardate: null,
  //   commission_note: null,
  //   decommission_date: null,
  //   decommission_stardate: null,
  //   decommission_note: null,
  //   destruction_date: null,
  //   destruction_stardate: null,
  //   destruction_note: null,
  //   events: [],
  // };

  const [starshipInfo, setStarshipInfo] = useState({});

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeStarshipInfo = (e) => {
    setStarshipInfo({ ...starshipInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let isMounted = true;

    const getStarship = async (id) => {
      try {
        let response = await StarshipsDataService.get(id);
        if (isMounted) {
          setStarshipInfo(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    if (starshipId) {
      getStarship(starshipId);
      setEdit(true);
      setBtnLabel("Update");
    }
    return () => {
      isMounted = false;
    };
  }, [edit, starshipId]);

  const saveStarshipInfo = () => {
    let data = starshipInfo;
    delete data["events"];
    delete data["personnelCount"];
    delete data["firstContactCount"];
    delete data["missionCount"];
    delete data["maintenanceCount"];
    if (data["class"] === "Unknown") {
      delete data["class"];
    }
    // convert stardates to calendar dates
    if (
      data.launch_stardate &&
      (data.launch_stardate.charAt(5) === "." || data.launch_stardate.charAt(6) === ".")
    ) {
      let newDate = StardateConverter(data.launch_stardate);
      data.launch_date = newDate;
    }
    if (
      data.commission_stardate &&
      (data.commission_stardate.charAt(5) === "." || data.commission_stardate.charAt(6) === ".")
    ) {
      let newDate = StardateConverter(data.commission_stardate);
      data.commission_date = newDate;
    }
    if (
      data.decommission_stardate &&
      (data.decommission_stardate.charAt(5) === "." || data.decommission_stardate.charAt(6) === ".")
    ) {
      let newDate = StardateConverter(data.decommission_stardate);
      data.decommission_date = newDate;
    }
    if (
      data.destruction_stardate &&
      (data.destruction_stardate.charAt(5) === "." || data.destruction_stardate.charAt(6) === ".")
    ) {
      let newDate = StardateConverter(data.destruction_stardate);
      data.destruction_date = newDate;
    }

    // removes empty fields
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === "" || data[key] === undefined) {
        delete data[key];
      }
    });

    if (edit) {
      data._id = starshipId;
      StarshipsDataService.updateStarship(data)
        .then((response) => {
          toast.success(response.data);
          setRefresh(true);
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
      setRefresh(true);
    } else {
      delete data["_id"];
      StarshipsDataService.createStarship(data)
        .then((response) => {
          toast.success(response.data);
          setRefresh(true);
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const retrieveClasses = () => {
      StarshipsDataService.getStarshipClasses()
        .then((response) => {
          if (isMounted) {
            setClasses(["Unknown"].concat(response.data));
          }
        })
        .catch((e) => {
          console.error(e);
          toast.error(e.message);
        });
    };
    retrieveClasses();
    return () => {
      isMounted = false;
    };
  }, []);

  const closeModal = () => {
    hide();
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
                  {btnLabel} Entry{subjectName && <> - U.S.S. {subjectName}</>}
                </h3>
                <div className="d-flex row my-1 mx-2 form-group">
                  <div className="form-floating col-sm-6">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      autoFocus
                      name="ship_id"
                      id="shipId"
                      placeholder="Construction ID"
                      value={starshipInfo.ship_id || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="shipId">Construction ID</label>
                  </div>
                  <div className="form-floating col-sm-6">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="shipyard"
                      id="shipyard"
                      placeholder="Shipyard"
                      value={starshipInfo.shipyard || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="shipyard">Shipyard</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="name"
                      id="starshipName"
                      placeholder="Name"
                      value={starshipInfo.name || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="starshipName">Starship Name</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="col-sm-4 form-control form-control-lg my-1"
                      type="text"
                      name="registry"
                      id="starshipRegistry"
                      placeholder="Registry #"
                      value={starshipInfo.registry || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="starshipRegistry">Registry</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <select
                      name="class"
                      id="starshipClass"
                      value={starshipInfo.class || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                      className="col-sm-4 form-control form-control-lg my-1 text-center"
                    >
                      {classes.map((shipClass, index) => {
                        return (
                          <option value={shipClass} key={index}>
                            {`   `}
                            {shipClass.substring(0, 20)}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="starshipClass">Class</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-md my-1"
                      type="date"
                      name="launch_date"
                      id="launchDate"
                      value={
                        starshipInfo.launch_date ? starshipInfo.launch_date.slice(0, 10) : ""
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="launchDate">Launch Date</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="launch_stardate"
                      id="launchStardate"
                      placeholder="Stardate"
                      value={starshipInfo.launch_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="launchStardate">Stardate</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <select
                      className="form-control my-1 text-center"
                      name="launch_note"
                      id="launchNote"
                      value={starshipInfo.launch_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      {dateOptions.map(({ label, value }) => (
                        <option key={uuidv4()} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="launchNote">Date Note</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-md my-1"
                      type="date"
                      name="commission_date"
                      id="commissionDate"
                      value={
                        starshipInfo.commission_date
                          ? starshipInfo.commission_date.slice(0, 10)
                          : ""
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="commissionDate">Commission Date</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="commission_stardate"
                      id="commissionStardate"
                      placeholder="Stardate"
                      value={starshipInfo.commission_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="commissionStardate">Stardate</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <select
                      className="form-control my-1 text-center"
                      name="commission_note"
                      id="commissionNote"
                      value={starshipInfo.commission_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      {dateOptions.map(({ label, value }) => (
                        <option key={uuidv4()} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="commissionNote">Date Note</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-md my-1"
                      type="date"
                      name="decommission_date"
                      id="decommissionDate"
                      value={
                        starshipInfo.decommission_date
                          ? starshipInfo.decommission_date.slice(0, 10)
                          : ""
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="decommissionDate">Decommission Date</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="decommission_stardate"
                      id="decommissionStardate"
                      placeholder="Stardate"
                      value={starshipInfo.decommission_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="decommissionStardate">Stardate</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <select
                      className="col form-control my-1 text-center"
                      name="decommission_note"
                      id="decommissionNote"
                      value={starshipInfo.decommission_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      {dateOptions.map(({ label, value }) => (
                        <option key={uuidv4()} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="decommissionNote">Date Note</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-md my-1"
                      type="date"
                      name="destruction_date"
                      id="destructionDate"
                      value={
                        starshipInfo.destruction_date
                          ? starshipInfo.destruction_date.slice(0, 10)
                          : "null"
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="destructionDate">Scuttled/Destruction Date</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <input
                      className="form-control form-control-lg my-1"
                      type="text"
                      name="destruction_stardate"
                      id="destructionStardate"
                      placeholder="Stardate"
                      value={starshipInfo.destruction_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="destructionStardate">Stardate</label>
                  </div>
                  <div className="form-floating col-sm-4">
                    <select
                      className="form-control my-1 text-center"
                      name="destruction_note"
                      id="destructionNote"
                      value={starshipInfo.destruction_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      {dateOptions.map(({ label, value }) => (
                        <option key={uuidv4()} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="destructionNote">Date Note</label>
                  </div>
                  <div className="form-floating col-sm-12">
                    <input
                      className="form-control form-control-md my-1"
                      type="text"
                      name="memoryAlphaURL"
                      id="memoryAlphaURL"
                      placeholder="Memory Alpha Link"
                      autoComplete="off"
                      value={starshipInfo.memoryAlphaURL || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <label htmlFor="memoryAlphaURL">Memory Alpha Link</label>
                  </div>
                </div>

                <button
                  className="lcars-btn orange-btn left-round small-btn"
                  onClick={saveStarshipInfo}
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
export default PopUpStarship;
