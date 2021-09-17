import { useState, useEffect } from "react";
import PersonnelDataService from "../../services/personnel";
import { Link } from "react-router-dom";

const Officer = (props) => {
  const database = props.database;

  // console.log(props.isAuth);

  const initialOfficerState = {
    _id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
    birthDate: null,
    birthStardate: null,
    birthPlace: null,
    deathDate: null,
    deathStardate: null,
    deathPlace: null,
    serial: null,
    events: [],
  };

  const [officer, setOfficer] = useState(initialOfficerState);

  useEffect(() => {
    const getOfficer = (id) => {
      PersonnelDataService.get(id, database)
        .then((response) => {
          setOfficer(response.data);
          // console.log(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getOfficer(props.match.params.id);
  }, [props.match.params.id, database]);

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        <Link to={"/personnel"} id="edit_btn" className="lcars_btn orange_btn left_round">
          Back To Search
        </Link>
        {props.isAuth && (
          <>
            <Link
              to={"/personnel/" + officer._id + "/edit"}
              id="edit_btn"
              className="lcars_btn orange_btn all_square"
            >
              Edit Officer Profile
            </Link>
            <Link
              to={"/personnel/" + officer._id + "/event"}
              id="edit_btn"
              className="lcars_btn orange_btn right_round"
            >
              Add Life Event
            </Link>
          </>
        )}
      </div>
      {officer ? (
        <div>
          <h1>
            {officer.surname && <>{officer.surname}</>}
            {officer.first && <>, {officer.first}</>}
            {officer.middle && <> {officer.middle}</>}
            {officer.postNom && <>, {officer.postNom}</>}
          </h1>
          <h2>{officer.serial}</h2>
          <p>
            {officer.birthDate && (
              <>
                <strong>Date of Birth: </strong>
                {officer.birthDate.slice(0, 10)}
                <br />
              </>
            )}
            {officer.birthPlace && (
              <>
                <strong>Place of Birth: </strong>
                {officer.birthPlace}
                <br />
              </>
            )}
            {officer.deathDate && (
              <>
                <strong>Date of Death: </strong>
                {officer.deathDate.slice(0, 10)}
                {officer.deathStardate && <> &#40;SD: {officer.deathStardate}&#41;</>}
                <br />
              </>
            )}
            {officer.deathPlace && (
              <>
                <strong>Place of Death: </strong>
                {officer.deathPlace}
                <br />
              </>
            )}
          </p>
          <div className="list-group">
            {officer.events.length > 0 ? (
              officer.events.map((event, index) => {
                return (
                  <div key={index} className="d-flex flex-column align-items-baseline">
                    <h5 className="row mx-1 my-0">
                      {event.stardate && <>{event.stardate}</>}{" "}
                      {event.date && <>({event.date.slice(0, 10)})</>}{" "}
                      {event.starshipName && event.location && <> - </>}{" "}
                      {event.starshipName && <>Onboard U.S.S. {event.starshipName}</>}{" "}
                      {event.starshipRegistry && <> - {event.starshipRegistry}</>}{" "}
                      {event.location && <>at/near {event.location}</>}
                    </h5>
                    <div className="rows d-flex flex-row">
                      <h4 className="mx-1 col-auto">
                        {event.rankLabel && <>Rank of {event.rankLabel} - </>}
                      </h4>
                      <h4 className="mx-1 col">{event.notes}</h4>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-sm-4">
                <p>No Events Yet</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No Officer Selected</p>
        </div>
      )}
    </>
  );
};

export default Officer;
