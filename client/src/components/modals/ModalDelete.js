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
    // if (e.target.name === "starshipName") setEdit(false);
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
        })
        .catch((err) => {
          console.error(err.message);
        });
    };
    if (eventInfo.starshipName && eventInfo.starshipName.length > 2) {
      retrieveStarship();
    }
  }, [eventInfo.starshipName]);

  const saveEvent = () => {
    let data = eventInfo;
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === "" || data[key] === undefined) {
        delete data[key];
      }
    });
    if (btnLabel === "Update") {
      data._id = eventId;
      EventsAndPhotosDataService.updateEvent(data)
        .then((response) => {
          setRefresh();
          setEventInfo(initialEventState);
          hide();
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    } else {
      if (officerId === null) {
        delete data["officerId"];
        delete data["rankLabel"];
        delete data["position"];
      }
      EventsAndPhotosDataService.insertEvent(data)
        .then((response) => {
          setRefresh();
          setEventInfo(initialEventState);
          hide();
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.warning(err.message);
          console.error(err);
        });
    }
  };

  const closeModal = () => {
    setEventInfo(initialEventState);
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
                    {btnLabel} Event for {subjectName}
                  </h3>
                  <div className="d-flex row my-1 mx-2 form-group">
                    {/* <label className="col-auto my-1 text-right form-control-lg" htmlFor="eventDate">
                      Date:
                    </label> */}
                    <input
                      className="col form-control form-control-md my-1"
                      type="date"
                      name="date"
                      value={eventInfo.date ? eventInfo.date.slice(0, 10) : ""}
                      onChange={(e) => onChangeEventInfo(e)}
                    />
                    {/* Stardate */}
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="stardate"
                      placeholder="Stardate"
                      value={eventInfo.stardate || ""}
                      onChange={(e) => onChangeEventInfo(e)}
                    />
                    {/* Note about event date (exact, approx, before or after) */}
                    <select
                      className="col form-control my-1"
                      name="dateNote"
                      value={eventInfo.dateNote || ""}
                      onChange={(e) => onChangeEventInfo(e)}
                    >
                      <option value="exact">Exact Date</option>
                      <option value="approx">Approximate Date</option>
                      <option value="before">Before This Date</option>
                      <option value="after">After This Date</option>
                    </select>
                    <div className="w-100"></div>
                    {eventType !== "starship" && (
                      <>
                        {" "}
                        <select
                          className="col form-control my-1"
                          name="type"
                          value={eventInfo.type || ""}
                          onChange={(e) => onChangeEventInfo(e)}
                        >
                          <option value="Other">Other</option>
                          <option value="Assignment">Assignment</option>
                          <option value="First Contact">First Contact</option>
                          <option value="Life Event">Life Event</option>
                          <option value="Mission">Mission</option>
                          <option value="Promotion">Promotion</option>
                          <option value="Demotion">Demotion</option>
                        </select>
                        <div className="col searchContainer my-1 p-0">
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="starshipName"
                            placeholder="Starship"
                            value={eventInfo.starshipName || ""}
                            onChange={(e) => onChangeEventInfo(e)}
                            autoComplete="off"
                          />
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
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="location"
                      placeholder="Galatic Location"
                      value={eventInfo.location || ""}
                      onChange={(e) => onChangeEventInfo(e)}
                    />
                    {eventType !== "starship" && (
                      <>
                        <div className="w-100"></div>
                        <select
                          className="col form-control my-1"
                          name="rankLabel"
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
                        <input
                          className="col form-control form-control-lg my-1"
                          type="text"
                          name="position"
                          placeholder="Current Position"
                          value={eventInfo.position || ""}
                          onChange={(e) => onChangeEventInfo(e)}
                        />
                      </>
                    )}
                    <div className="w-100"></div>
                    <input
                      className="col form-control form-control-lg my-1"
                      type="text"
                      name="notes"
                      placeholder="Brief Description"
                      value={eventInfo.notes || ""}
                      onChange={(e) => onChangeEventInfo(e)}
                    />
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
