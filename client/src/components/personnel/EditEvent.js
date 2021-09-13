import { useState, useEffect } from "react";
import PersonnelDataService from "../../services/personnel";
// import { Link } from "react-router-dom";

const EditEvent = (props) => {
  const [edit, setEdit] = useState(false);
  const [officerId, setOfficerId] = useState(props.match.params.id);
  const [eventId, setEventId] = useState(props.match.params.event);
  const [rankLabels, setRankLabels] = useState([]);
  const [searchParam, setSearchParam] = "";

  console.log(eventId);

  const [eventInfo, setEventInfo] = useState({
    eventType: "",
    rankLabel: "",
    starshipName: "",
    location: "",
    position: "",
    eventDate: "",
    eventDateNote: "",
    eventStardate: "",
    stardate: "",
    notes: "",
  });

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeEventInfo = (e) => {
    setEventInfo({ ...eventInfo, [e.target.name]: e.target.value });
  };

  const retrieveRankLabels = () => {
    PersonnelDataService.getRankLabels()
      .then((response) => {
        setRankLabels(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    retrieveRankLabels();
  }, []);

  const saveOfficerEvent = (e) => {
    e.preventDefault();

    let data = eventInfo;

    if (edit) {
      data._id = props.match.params.id;
      PersonnelDataService.updateEvent(data)
        .then((response) => {
          // setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      PersonnelDataService.createEvent(data)
        .then((response) => {
          // setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <>
      {/* // Form to insert events in officer's life */}
      <form className="d-flex row my-1 mx-2 form-group" onSubmit={saveOfficerEvent}>
        <h3 className="col text-center">{btnLabel} Officer Events</h3>
        <div class="w-100"></div>
        <label className="col-auto my-1 text-right form-control-lg" htmlFor="eventDate">
          Date Of Event:
        </label>
        <input
          className="col form-control form-control-lg my-1"
          type="date"
          name="eventDate"
          value={eventInfo.eventDate ? eventInfo.eventDate.slice(0, 10) : ""}
          onChange={(e) => onChangeEventInfo(e)}
        />
        {/* Note about event date (exact, approx, before or after) */}
        <select
          className="col form-control my-1"
          name="birthNote"
          value={eventInfo.eventDateNote}
          onChange={(e) => onChangeEventInfo(e)}
        >
          <option value="">Exact Date</option>
          <option value="approx">Approximate Date</option>
          <option value="before">Before This Date</option>
          <option value="after">After This Date</option>
        </select>
        {/* Stardate */}
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="eventStardate"
          placeholder="Stardate"
          value={eventInfo.eventStardate}
          onChange={(e) => onChangeEventInfo(e)}
        />
        <div className="w-100"></div>
        <select
          className="col form-control my-1"
          name="eventType"
          value={eventInfo.eventType}
          onChange={(e) => onChangeEventInfo(e)}
        >
          <option value="">Other Event</option>
          <option value="promotion">Promotion</option>
          <option value="assignment">Assignment</option>
        </select>
        {/* ID of starship if applicable */}
        <div className="col searchContainer my-1 p-0">
          <input
            className="form-control form-control-lg"
            type="text"
            name="starshipName"
            placeholder="Starship"
            value={eventInfo.starshipName}
            onChange={(e) => onChangeEventInfo(e)}
          />
          <div id="searchResults" className="results">
            <div className="suggestion">{eventInfo.starshipName}</div>
            <div className="suggestion">{eventInfo.starshipName}</div>
            <div className="suggestion">{eventInfo.starshipName}</div>
          </div>
        </div>
        {/* <select
          className="col form-control my-1"
          name="starshipId"
          value={eventInfo.starshipId}
          onChange={(e) => onChangeEventInfo(e)}
        >
          <option>Unknown Vessel / N/A</option>
        </select> */}
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="location"
          placeholder="Galatic Location"
          value={eventInfo.location}
          onChange={(e) => onChangeEventInfo(e)}
        />
        {/* ID of rank */}
        {/* <div className="col container">
          <input
            className="form-control form-control-lg my-1"
            type="text"
            name="rankId"
            placeholder="Current Rank"
            value={eventInfo.rankLabel}
            onChange={(e) => onChangeEventInfo(e)}
          />
          <div id="searchResults" class="results"></div>
        </div> */}
        <select
          className="col form-control my-1"
          name="rankLabel"
          value={eventInfo.rankLabel}
          onChange={(e) => onChangeEventInfo(e)}
        >
          <option value="">Unknown Rank / N/A</option>
          {rankLabels.length > 0 &&
            rankLabels.map((rank) => <option value={rank.label}>{rank.label}</option>)}
        </select>
        <div className="w-100"></div>
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="position"
          placeholder="Current Position"
          value={eventInfo.position}
          onChange={(e) => onChangeEventInfo(e)}
        />
        {/* <label className="col-auto my-1 text-right form-control-lg" htmlFor="eventDate">
          Brief Description:
        </label> */}
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="notes"
          placeholder="Brief Description"
          value={eventInfo.notes}
          onChange={(e) => onChangeEventInfo(e)}
        />
        <div className="text-center">
          <button className="lcars_btn red_btn all_round">Add Event</button>
        </div>
      </form>
    </>
  );
};

export default EditEvent;
