import { useState, useEffect } from "react";
import PersonnelDataService from "../../services/personnel";
import { Link } from "react-router-dom";

const Personnel = (props) => {
  const database = props.database;

  // console.log(props.isAuth);

  const initialPersonnelState = {
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

  const [personnel, setPersonnel] = useState(initialPersonnelState);

  useEffect(() => {
    const getPersonnel = (id) => {
      PersonnelDataService.get(id, database)
        .then((response) => {
          setPersonnel(response.data);
          console.log(response);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getPersonnel(props.match.params.id);
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
              to={"/personnel/" + personnel._id + "/edit"}
              id="edit_btn"
              className="lcars_btn orange_btn right_round"
            >
              Edit Officer Profile
            </Link>
            <Link
              to={"/personnel/" + personnel._id + "/edit"}
              id="edit_btn"
              className="lcars_btn orange_btn right_round"
            >
              Edit Officer Profile
            </Link>
          </>
        )}
      </div>
      {personnel ? (
        <div>
          <h1>
            {personnel.surname && <>{personnel.surname}</>}
            {personnel.first && <>, {personnel.first}</>}
            {personnel.middle && <> {personnel.middle}</>}
            {personnel.postNom && <>, {personnel.postNom}</>}
          </h1>
          <h2>{personnel.serial}</h2>
          <p>
            {personnel.birthDate && (
              <>
                <strong>Date of Birth: </strong>
                {personnel.birthDate.slice(0, 10)}
                <br />
              </>
            )}
            {personnel.birthPlace && (
              <>
                <strong>Place of Birth: </strong>
                {personnel.birthPlace}
                <br />
              </>
            )}
            {personnel.deathDate && (
              <>
                <strong>Date of Death: </strong>
                {personnel.deathDate.slice(0, 10)}
                {personnel.deathStardate && <> &#40;SD: {personnel.deathStardate}&#41;</>}
                <br />
              </>
            )}
            {personnel.deathPlace && (
              <>
                <strong>Place of Death: </strong>
                {personnel.deathPlace}
                <br />
              </>
            )}
          </p>
        </div>
      ) : (
        <div>
          <br />
          <p>No Personnel Selected</p>
        </div>
      )}
    </>
  );
};

export default Personnel;
