import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import StarshipsDataService from "../../services/starships";
import EventsAndPhotosDataService from "../../services/eventsAndPhotos";

const PopUpEvents = ({
  isShowing,
  hide,
  isAuth,
  officerId,
  starshipId,
  eventId,
  subjectName,
  setRefresh,
  eventType,
  modalClass,
}) => {
  const [rankLabels, setRankLabels] = useState([]);
  const [shipSearchResults, setShipSearchResults] = useState([]);
  const [btnLabel, setBtnLabel] = useState("Enter");
  const [searchOption, setSearchOption] = useState(false);

  const initialEventState = {
    type: "Other",
    officerId: officerId,
    starshipId: starshipId,
    starshipName: null,
    starshipRegistry: null,
    location: null,
    rankLabel: null,
    position: null,
    date: null,
    dateNote: "exact",
    stardate: null,
    endDate: null,
    endDateNote: "exact",
    endStardate: null,
    notes: null,
  };

  const [eventInfo, setEventInfo] = useState(initialEventState);

  useEffect(() => {
    const getEvent = async (id) => {
      try {
        let response = await EventsAndPhotosDataService.getEvent(id);
        setEventInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (eventId) {
      getEvent(eventId);
      setBtnLabel("Update");
    }
  }, [eventId]);

  const onChangeEventInfo = (e) => {
    setEventInfo({ ...eventInfo, [e.target.name]: e.target.value });
    if (e.target.name === "starshipName") setSearchOption(true);
  };

  const onClickStarship = (id, name, registry) => {
    setEventInfo({
      ...eventInfo,
      starshipId: id,
      starshipName: name,
      starshipRegistry: registry,
    });
    setShipSearchResults([]);
  };

  useEffect(() => {
    const retrieveRankLabels = () => {
      PersonnelDataService.getRankLabels()
        .then((response) => {
          setRankLabels(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    };

    retrieveRankLabels();
  }, []);

  useEffect(() => {
    const retrieveStarship = () => {
      StarshipsDataService.find(eventInfo.starshipName)
        .then((response) => {
          setShipSearchResults(response.data.starships);
          setSearchOption(false);
        })
        .catch((err) => {
          console.error(err.message);
        });
    };
    if (eventInfo.starshipName && eventInfo.starshipName.length > 2 && searchOption) {
      retrieveStarship();
    }
  }, [eventInfo.starshipName, searchOption]);

  const saveEvent = () => {
    let data = eventInfo;
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === "" || data[key] === undefined) {
        delete data[key];
      }
    });
    delete data["starshipName"];
    delete data["starshipRegistry"];
    if (btnLabel === "Update") {
      data._id = eventId;
      EventsAndPhotosDataService.updateEvent(data)
        .then((response) => {
          // setRefresh();
          setEventInfo(initialEventState);
          hide();
          setBtnLabel("Enter");
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    } else {
      if (officerId === "starship") {
        delete data["officerId"];
        delete data["rankLabel"];
        delete data["position"];
      }
      EventsAndPhotosDataService.insertEvent(data)
        .then((response) => {
          toast.success(response.data.message);
          hide();
          // setRefresh();
          setEventInfo(initialEventState);
          setBtnLabel("Enter");
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    }
  };

  const closeModal = () => {
    setEventInfo(initialEventState);
    setBtnLabel("Enter");
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
                    {btnLabel} Event for {subjectName}
                  </h3>
                  <div className="d-flex row my-1 mx-2 form-group">
                    <div className="form-floating col-sm-4">
                      <input
                        className="form-control form-control-md my-1"
                        type="date"
                        name="date"
                        id="eventDate"
                        value={eventInfo.date ? eventInfo.date.slice(0, 10) : ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      />
                      <label htmlFor="eventDate">Date</label>
                    </div>
                    {/* Stardate */}
                    <div className="form-floating col-sm-4">
                      <input
                        className="form-control form-control-lg my-1"
                        type="text"
                        name="stardate"
                        id="eventStardate"
                        placeholder="Stardate"
                        value={eventInfo.stardate || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      />
                      <label htmlFor="eventStardate">Stardate</label>
                    </div>

                    {/* Note about event date (exact, approx, before or after) */}
                    <div className="form-floating col-sm-4">
                      <select
                        className="form-control my-1"
                        name="dateNote"
                        id="dateNote"
                        value={eventInfo.dateNote || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      >
                        <option value="exact">Exact Date</option>
                        <option value="approx">Approximate Date</option>
                        <option value="before">Before This Date</option>
                        <option value="after">After This Date</option>
                      </select>
                      <label htmlFor="dateNote">Date Note</label>
                    </div>
                    {/* End Date of Event */}
                    <div className="form-floating col-sm-4">
                      <input
                        className="form-control form-control-md my-1"
                        type="date"
                        name="endDate"
                        id="eventEndDate"
                        value={eventInfo.endDate ? eventInfo.endDate.slice(0, 10) : ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      />
                      <label htmlFor="eventEndDate">End Date</label>
                    </div>
                    {/* End Stardate */}
                    <div className="form-floating col-sm-4">
                      <input
                        className="form-control form-control-lg my-1"
                        type="text"
                        name="endStardate"
                        id="eventEndStardate"
                        placeholder="End Stardate"
                        value={eventInfo.endStardate || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      />
                      <label htmlFor="eventEndStardate">End Stardate</label>
                    </div>

                    {/* Note about event date (exact, approx, before or after) */}
                    <div className="form-floating col-sm-4">
                      <select
                        className="form-control my-1"
                        name="endDateNote"
                        id="endDateNote"
                        value={eventInfo.endDateNote || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      >
                        <option value="exact">Exact Date</option>
                        <option value="approx">Approximate Date</option>
                        <option value="before">Before This Date</option>
                        <option value="after">After This Date</option>
                      </select>
                      <label htmlFor="endDateNote">End Date Note</label>
                    </div>
                    {/* <div className="w-100"></div> */}
                    <div className="form-floating col-sm-4">
                      <select
                        className="form-control my-1"
                        name="type"
                        id="eventType"
                        value={eventInfo.type || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      >
                        <option value="Other">Other</option>
                        <option value="Assignment">Assignment</option>
                        <option value="First Contact">First Contact</option>
                        {officerId && <option value="Life Event">Life Event</option>}
                        <option value="Mission">Mission</option>
                        <option value="Repair Upgrade">Repairs/Upgrades</option>
                        {officerId && <option value="Promotion">Promotion</option>}
                        {officerId && <option value="Demotion">Demotion</option>}
                      </select>
                      <label htmlFor="eventType">Event Type</label>
                    </div>
                    {officerId && (
                      <>
                        {" "}
                        <div className="col-sm-4 form-floating searchContainer my-1 p-0">
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="starshipName"
                            id="starshipName"
                            placeholder="Starship"
                            value={eventInfo.starshipName || ""}
                            onChange={(e) => onChangeEventInfo(e)}
                            autoComplete="off"
                          />
                          <label htmlFor="starshipName">Starship</label>
                          <div id="searchResults" className="results">
                            {shipSearchResults.length > 0 &&
                              shipSearchResults.map((ship) => {
                                let shipId = ship._id;
                                let shipName = ship.name;
                                let shipRegistry = ship.registry ? ship.registry : null;
                                return (
                                  <div
                                    key={shipId}
                                    className="suggestion"
                                    onClick={() => {
                                      onClickStarship(shipId, shipName, shipRegistry);
                                    }}
                                  >
                                    {shipName} {shipRegistry}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </>
                    )}
                    <div
                      className={officerId ? "form-floating col-sm-4" : "form-floating col-sm-8"}
                    >
                      <input
                        className="form-control form-control-lg my-1"
                        type="text"
                        name="location"
                        id="eventLocation"
                        placeholder="Galatic Location"
                        value={eventInfo.location || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      />
                      <label htmlFor="eventLocation">Galatic Location</label>
                    </div>

                    {officerId && (
                      <>
                        {/* <div className="w-100"></div> */}
                        <div className="form-floating col-sm-6">
                          <select
                            className="form-control my-1"
                            name="rankLabel"
                            id="rankLabel"
                            value={eventInfo.rankLabel || ""}
                            onChange={(e) => onChangeEventInfo(e)}
                          >
                            <option value="">Unknown Rank / N/A</option>
                            {rankLabels.length > 0 &&
                              rankLabels.map((rank) => (
                                <option key={rank.rank_id} value={rank.label + "-" + rank.abbrev}>
                                  {rank.label}
                                </option>
                              ))}
                          </select>
                          <label htmlFor="rankLabel">Rank</label>
                        </div>
                        <div className="form-floating col-sm-6">
                          <input
                            className="form-control form-control-lg my-1"
                            type="text"
                            name="position"
                            id="officerPosition"
                            placeholder="Current Position"
                            value={eventInfo.position || ""}
                            onChange={(e) => onChangeEventInfo(e)}
                          />{" "}
                          <label htmlFor="officerPosition">Postition</label>
                        </div>
                      </>
                    )}
                    {/* <div className="w-100"></div> */}
                    <div className="form-floating col-sm-12">
                      <textarea
                        className="col form-control form-control-lg my-1"
                        style={{ height: "100%" }}
                        type="text"
                        name="notes"
                        id="eventNotes"
                        placeholder="Brief Description"
                        value={eventInfo.notes || ""}
                        onChange={(e) => onChangeEventInfo(e)}
                      />
                      <label htmlFor="eventNotes">Brief Description</label>
                    </div>
                  </div>

                  <button className="lcars_btn orange_btn left_round small_btn" onClick={saveEvent}>
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
