import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import StarshipsDataService from "../../services/starships";

const PopUpEvents = ({
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

  const initialStarshipState = {
    _id: null,
    ship_id: null,
    name: null,
    registry: null,
    class: null,
    launch_date: null,
    launch_stardate: null,
    launch_note: null,
    commission_date: null,
    commission_stardate: null,
    commission_note: null,
    decommission_date: null,
    decommission_stardate: null,
    decommission_note: null,
    destruction_date: null,
    destruction_stardate: null,
    destruction_note: null,
    events: [],
  };

  const [starshipInfo, setStarshipInfo] = useState({});

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeStarshipInfo = (e) => {
    setStarshipInfo({ ...starshipInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getStarship = async (id) => {
      try {
        let response = await StarshipsDataService.get(id);
        setStarshipInfo(response.data);
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
  }, [edit, starshipId]);

  const saveStarshipInfo = () => {
    let data = starshipInfo;
    delete data["events"];
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
          setRefresh();
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
      setRefresh();
    } else {
      delete data["_id"];
      StarshipsDataService.createStarship(data)
        .then((response) => {
          toast.success(response.data);
          setStarshipInfo(initialStarshipState);
          setRefresh();
          hide();
        })
        .catch((err) => {
          console.error(err);
          toast.warning(err.message);
        });
    }
  };

  useEffect(() => {
    const retrieveClasses = () => {
      StarshipsDataService.getStarshipClasses()
        .then((response) => {
          setClasses(["Unknown"].concat(response.data));
        })
        .catch((e) => {
          console.error(e);
          toast.error(e.message);
        });
    };
    retrieveClasses();
  }, []);

  const closeModal = () => {
    setStarshipInfo(initialStarshipState);
    hide();
  };

  return isShowing && isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className={modalClass}>
              <div className="events-modal modal-content-wrapper">
                <div className="events-modal-container align-content-center">
                  <h3>
                    {btnLabel} Entry{subjectName && <>- U.S.S. {subjectName}</>}
                  </h3>
                  <div className="d-flex row my-1 mx-2 form-group">
                    <div className="col"></div>
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      autoFocus
                      name="ship_id"
                      placeholder="Construction ID"
                      value={starshipInfo.ship_id || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <div className="col"></div>
                    <div className="w-100"></div>
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={starshipInfo.name || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="registry"
                      placeholder="Registry #"
                      value={starshipInfo.registry || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      name="class"
                      value={starshipInfo.class || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                      className="col form-control form-control-lg my-1 text-center"
                    >
                      {classes.map((shipClass) => {
                        return (
                          <option value={shipClass} key={uuidv4()}>
                            {`   `}
                            {shipClass.substring(0, 20)}
                            {" Class"}
                          </option>
                        );
                      })}
                    </select>
                    <div className="w-100"></div>
                    <label
                      className="col-auto my-1 text-right form-control-lg"
                      htmlFor="launch_date"
                    >
                      Launch:
                    </label>
                    <input
                      className="col form-control form-control-md my-1"
                      type="date"
                      name="launch_date"
                      value={starshipInfo.launch_date ? starshipInfo.launch_date.slice(0, 10) : ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="launch_stardate"
                      placeholder="Stardate"
                      value={starshipInfo.launch_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      className="col form-control my-1 text-center"
                      name="launch_note"
                      value={starshipInfo.launch_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <div className="w-100"></div>
                    <label className="col-auto my-1 form-control-lg" htmlFor="commission_date">
                      Commissioned:
                    </label>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="commission_date"
                      value={
                        starshipInfo.commission_date
                          ? starshipInfo.commission_date.slice(0, 10)
                          : ""
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="commission_stardate"
                      placeholder="Stardate"
                      value={starshipInfo.commission_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      className="col form-control my-1 text-center"
                      name="commission_note"
                      value={starshipInfo.commission_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <div className="w-100"></div>
                    <label className="col-auto my-1 form-control-lg" htmlFor="decommission_date">
                      De-Commissioned:
                    </label>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="decommission_date"
                      value={
                        starshipInfo.decommission_date
                          ? starshipInfo.decommission_date.slice(0, 10)
                          : ""
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="decommission_stardate"
                      placeholder="Stardate"
                      value={starshipInfo.decommission_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      className="col form-control my-1 text-center"
                      name="decommission_note"
                      value={starshipInfo.decommission_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <div className="w-100"></div>
                    <label className="col-auto my-1 form-control-lg" htmlFor="destruction_date">
                      Destruction:
                    </label>
                    <input
                      className="col form-control form-control-sm my-1"
                      type="date"
                      name="destruction_date"
                      value={
                        starshipInfo.destruction_date
                          ? starshipInfo.destruction_date.slice(0, 10)
                          : "null"
                      }
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="destruction_stardate"
                      placeholder="Stardate"
                      value={starshipInfo.destruction_stardate || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    />
                    <select
                      className="col form-control my-1 text-center"
                      name="destruction_note"
                      value={starshipInfo.destruction_note || ""}
                      onChange={(e) => onChangeStarshipInfo(e)}
                    >
                      <option>Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
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
