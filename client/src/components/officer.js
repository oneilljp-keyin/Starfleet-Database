import { useState, useEffect } from "react";
import PersonnelDataService from "../services/personnel";
// import { Link } from "react-router-dom";

const Personnel = (props) => {
  // console.log("isAuth [officer.js]: " + props.isAuth);
  // console.log("database: " + props.database);

  const initialPersonnelState = {
    id: null,
    surname: null,
    first: null,
    middle: null,
    dob: null,
    dod: null,
    serial: null,
    assignments: [],
    promotions: [],
    events: [],
  };

  const [personnel, setPersonnel] = useState(initialPersonnelState);
  console.log(personnel);

  const getPersonnel = (id) => {
    PersonnelDataService.get(id, props.database)
      .then((response) => {
        setPersonnel(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getPersonnel(props.match.params.id);
  }, [props.match.params.id]);

  return (
    <>
      {personnel ? (
        <div>
          {personnel.surname && <h5>{personnel.surname}</h5>}
          {personnel.first && <h6>{personnel.first}</h6>}
          {personnel.middle && <h6>{personnel.middle}</h6>}
          <h6>{personnel.serial}</h6>
          <p>
            {personnel.dob && (
              <>
                <strong>Date of Birth: </strong>
                {personnel.dob.slice(0, 10)}
                <br />
              </>
            )}
            {personnel.dod && (
              <>
                <strong>Date of Death: </strong>
                {personnel.dod.slice(0, 10)}
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
