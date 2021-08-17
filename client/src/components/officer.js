import { useState, useEffect } from "react";
import PersonnelDataService from "../services/personnel";
// import { Link } from "react-router-dom";

const Personnel = (props) => {
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

  const getPersonnel = (id) => {
    PersonnelDataService.get(id)
      .then((response) => {
        setPersonnel(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getPersonnel(props.match.params.id);
  }, [props.match.params.id]);

  return (
    <>
      {personnel ? (
        <div>
          <h5>{personnel.surname}</h5>
          <h6>
            {personnel.first} {personnel.middle}
          </h6>
          <h6>{personnel.serial}</h6>
          <p>
            <strong>Date of Birth: </strong>
            {personnel.dob}
            <strong>Date of Death: </strong>
            {personnel.dod}
            <br />
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
