import { useState, useEffect } from "react";
import PersonnelDataService from "../services/personnel";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

function PersonnelList({ isAuth, setName, setAdmin, userId }) {
  const [personnel, setPersonnel] = useState([]);
  const [searchName, setSearchName] = useState("");

  let PORT = 8000;

  // ---- Get Name and Admin Privileges ---- \\
  async function getProfile() {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/users/${userId}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await response.json();

      setName(parseData.name);
      setAdmin(parseData.admin);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getProfile();
  }, [userId]);

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
    console.log("Sector find");
    PersonnelDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setPersonnel(response.data.personnel);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    console.log("Sector findByName");
    find(searchName, "name");
  };

  return (
    <>
      <div className="row pb-1">
        {isAuth && (
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
        )}
      </div>
      <div className="row">
        {personnel.map((officer) => {
          let officerName;
          if (officer.surname) {
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
            <div className="col-lg-4 pb-1" key={uuidv4()}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{officerName}</h5>
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
}

export default PersonnelList;
