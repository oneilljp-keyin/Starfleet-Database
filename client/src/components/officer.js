import { useState, useEffect } from "react";
import PersonnelDataService from "../services/personnel";

const Personnel = (props) => {
  const database = props.database;

  const initialPersonnelState = {
    id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
    dob: null,
    dod: null,
    serial: null,
    events: [],
  };

  const [personnel, setPersonnel] = useState(initialPersonnelState);
  console.log(personnel);

  useEffect(() => {
    const getPersonnel = (id) => {
      PersonnelDataService.get(id, database)
        .then((response) => {
          setPersonnel(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getPersonnel(props.match.params.id);
  }, [props.match.params.id, database]);

  return (
    <>
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
