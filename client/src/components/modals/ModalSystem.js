import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import MultiSelect from  'react-select';

import DataService from "../../services/DBAccess";

import { Loading, NumberDropDown, quadrants, starTypes } from "../hooks/HooksAndFunctions";

const PopUpSystems = (props) => {
  const category = props.entryType;
  const subjectId = props.systemId;

  const [edit, setEdit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    name: null,
    starTypes: null,
    sectorName: null,
    sectorNum: null,
    quadrant: null,
    numOfPlanets: null,
    government: null,
    notes: null,
    memoryAlphaURL: null,
  };

  const [subjectInfo, setSubjectInfo] = useState(initialState);

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeSubjectInfo = (e) => {
    setSubjectInfo({ ...subjectInfo, [e.target.name]: e.target.value });
  };

  const onChangeStarTypes = (e) => {
    setSubjectInfo({ ...subjectInfo, starTypes: e });
  };

  useEffect(() => {
    let isMounted = true;

    const getInfo = async (category, id) => {
      try {
        let response = await DataService.getOne(category, id);
        if (isMounted) {
          const updateStarTypes = response.data.starTypes.map(a => ({label: `${a}-Type`, value: a }));
          response.data.starTypes = updateStarTypes;
          setSubjectInfo(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    if (subjectId) {
      getInfo(category, subjectId);
      setEdit(true);
      setSubmitted(false);
      setBtnLabel("Update");
    }
    return () => {
      isMounted = false;
    };
  }, [edit, submitted, subjectId, category]);

  const savesubjectInfo = () => {
    setIsLoading(true);
    let data = subjectInfo;
    Object.keys(data).forEach((key) => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });
    if (edit) {
      data._id = props.subjectId;
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
          setSubjectInfo(initialState);
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
    props.hide();
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderStyle: "none"
    })
  }

  return props.isShowing && props.isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div id="main-modal-body" className={props.modalClass}>
              <div className="modal-bg events-modal modal-content-wrapper">
                <div className="events-modal-container align-content-center">
                  <h3>
                    {btnLabel} Star System {props.subjectName ? ` - ${props.subjectName}` : " Entry"}
                  </h3>
                  <div className="d-flex row form-group">
                    <div className="form-floating col-sm-5">
                      <input
                        className="form-control form-control-md text-center"
                        type="text"
                        autoFocus
                        name="name"
                        id="name"
                        placeholder="System Name"
                        value={subjectInfo.name || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      />
                      <label htmlFor="surname">System Name</label>
                    </div>
                    <div className="form-floating col-sm-5" name="starTypes">
                      <MultiSelect 
                        isMulti 
                        onChange={onChangeStarTypes} 
                        options={starTypes} 
                        value={subjectInfo.starTypes}
                        placeholder=""
                        isSearchable={true} 
                        className="form-control form-control-sm px-0"
                        styles={customStyles}
                      />
                      <label htmlFor="starTypes">Star Types</label>
                    </div>
                    <div className="form-floating col-sm-2">
                      <select
                        className="form-control form-control-sm text-center"
                        name="numOfPlanets"
                        id="numOfPlanets"
                        placeholder="# of Planets"
                        value={subjectInfo.numOfPlanets || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      >
                        <option key={1000} value={null}>Unknown</option>
                        <NumberDropDown num={20} />
                      </select>
                      <label htmlFor="numOfPlanets"># of Planets</label>
                    </div>
                    <div className="form-floating col-sm-2">
                      <input
                        className="form-control form-control-md text-center"
                        type="text"
                        name="sectorName"
                        id="sectorName"
                        placeholder="Sector Name"
                        value={subjectInfo.sectorName || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      />
                      <label htmlFor="sectorName">Sector Name</label>
                    </div>
                    <div className="form-floating col-sm-2">
                      <input
                        className="form-control form-control-md text-center"
                        type="text"
                        name="sectorNum"
                        id="sectorNum"
                        placeholder="Sector Number"
                        value={subjectInfo.sectorNum || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      />
                      <label htmlFor="sectorNum">Sector #</label>
                    </div>
                    <div className="form-floating col-sm-4">
                      <select
                        className="form-control form-control-sm text-center"
                        name="quadrant"
                        id="quadrant"
                        placeholder="Quadrant"
                        value={subjectInfo.quadrant || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      >
                        {quadrants.map(({ label, value }) => (
                          <option key={uuidv4()} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="quadrant">Locaton in Galaxy</label>
                    </div>
                    <div className="form-floating col-sm-4">
                      <input
                        className="form-control form-control-md text-center"
                        type="text"
                        name="government"
                        id="government"
                        placeholder="Government"
                        value={subjectInfo.government || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      />
                      <label htmlFor="government">Government</label>
                    </div>
                    <div className="form-floating col-sm-12">
                      <input
                        className="form-control form-control-md text-center"
                        type="text"
                        name="memoryAlphaURL"
                        id="memoryAlphaURL"
                        placeholder="Memory Alpha Link"
                        value={subjectInfo.memoryAlphaURL || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      />
                      <label htmlFor="memoryAlphaURL">Memory Alpha Link</label>
                    </div>
                    <div className="form-floating col-sm-12">
                      <textarea
                        className="col form-control form-control-lg"
                        style={{ height: "100%" }}
                        type="text"
                        name="notes"
                        id="notes"
                        placeholder="Notes"
                        value={subjectInfo.notes || ""}
                        onChange={(e) => onChangeSubjectInfo(e)}
                      />
                      <label htmlFor="notes">Notes</label>
                    </div>
                  </div>

                  <button
                    className="lcars-btn orange-btn left-round small-btn"
                    onClick={savesubjectInfo}
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
export default PopUpSystems;
