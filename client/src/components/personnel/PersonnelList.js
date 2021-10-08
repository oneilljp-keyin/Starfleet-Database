import { useState } from "react";
import PersonnelDataService from "../../services/personnel";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

function PersonnelList({ isAuth, userId, admin, setDatabase, database }) {
  const [personnel, setPersonnel] = useState([]);
  const [searchName, setSearchName] = useState("");

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  // const onChangeDatabase = (e) => {
  //   const searchDatabase = e.target.value;
  //   setDatabase(searchDatabase);
  // };

  const find = (query, by, db, userId) => {
    PersonnelDataService.find(query, by, db, userId)
      .then((response) => {
        console.log(response.data);
        setPersonnel(response.data.personnel);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name", database, userId);
  };

  return (
    <>
      {/* <div>{database}</div> */}
      {/* {isAuth && ( */}
      <div className="rows d-flex align-content-center">
        <div className="col-4"></div>
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append input-group-lg">
            <button className="btn btn-outline-secondary" type="button" onClick={findByName}>
              Search
            </button>
          </div>
        </div>
        <div className="col-4"></div>
        {/* <select
          className="form-control"
          name="database"
          value={database}
          onChange={(e) => onChangeDatabase(e)}
        >
          <option>Database</option>
          <option value="mongo">MongoDB</option>
          <option value="post">PostGreSQL</option>
        </select> */}
      </div>
      {/* )} */}
      <div className="row">
        {personnel.map((officer) => {
          let officerName;
          let officerId = officer.personnel_id ? officer.personnel_id : officer._id;
          if (officer.surname !== "undefined") {
            officerName = officer.surname;
          }
          if (officer.first) {
            officerName += ", " + officer.first;
          }
          if (officer.middle) {
            let middleI = officer.middle.slice(0, 1);
            officerName += " " + middleI + ".";
          }
          return (
            <div className="col-lg-4 p-1" key={uuidv4()}>
              <div className="card text-center bg-dark">
                <div className="card-body m-1">
                  <h5 className="card-title">{officerName}</h5>
                  <div className="row">
                    <Link to={"/personnel/" + officerId} className="btn btn-primary m-1">
                      View Officer Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PersonnelList;
