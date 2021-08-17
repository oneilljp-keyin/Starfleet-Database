import { useState, useEffect } from "react";
import PersonnelDataService from "../services/personnel";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

const PersonnelList = (props) => {
  const [personnel, setPersonnel] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    retrievePersonnel();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const retrievePersonnel = () => {
    PersonnelDataService.getAll()
      .then((response) => {
        // console.log(response.data);
        setPersonnel(response.data.personnel);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const refreshList = () => {
  //   retrievePersonnel();
  // };

  const find = (query, by) => {
    PersonnelDataService.find(query, by)
      .then((response) => {
        // console.log(response.data);
        setPersonnel(response.data.personnel);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name");
  };

  return (
    <>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={findByName}>
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {personnel.map((officer) => {
          return (
            <div className="col-lg-4 pb-1" key={uuidv4()}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {officer.surname}, {officer.first} {officer.middle}
                  </h5>
                  <div className="row">
                    <Link
                      to={"/personnel/" + officer._id}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
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
};

export default PersonnelList;
