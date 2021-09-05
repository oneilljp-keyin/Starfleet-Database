import { useState, useEffect } from "react";
import StarshipsDataService from "../services/starships";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

function StarshipList({ isAuth, userId, admin, setDatabase, database }) {
  const [starships, setStarships] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [classes, setClasses] = useState(["Unknown Class"]);

  useEffect(() => {
    retrieveClasses();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchClass = (e) => {
    const searchClass = e.target.value;
    setSearchClass(searchClass);
  };

  const onChangeDatabase = (e) => {
    const searchDatabase = e.target.value;
    setDatabase(searchDatabase);
  };

  const find = (query, by, db, userId) => {
    StarshipsDataService.find(query, by, db, userId)
      .then((response) => {
        console.log(response.data);
        setStarships(response.data.starships);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name", database, userId);
  };

  const findByClass = () => {
    if (searchClass === "Unknown Class") {
    } else {
      find(searchClass, "class");
    }
  };

  const retrieveClasses = () => {
    StarshipsDataService.getStarshipClasses()
      .then((response) => {
        // console.log(response.data);
        setClasses(["Unknown Class"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {/* {isAuth && ( */}
      <>
        <div className="d-flex flex-row">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search By Name"
              value={searchName}
              onChange={onChangeSearchName}
            />
          </div>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={findByName}>
              Search
            </button>
          </div>
          {/* </div>
          <div className="rows d-flex justify-content-center"> */}
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
          {/* <div className="input-group"> */}
          <select name="searchClass" value={searchClass} onChange={onChangeSearchClass}>
            {classes.map((shipClass) => {
              return (
                <option value={shipClass} key={uuidv4()}>
                  {" "}
                  {shipClass.substr(0, 20)}{" "}
                </option>
              );
            })}
          </select>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={findByClass}>
              Search
            </button>
          </div>
          {/* </div> */}
        </div>
      </>
      {/* )} */}
      <div className="row">
        {starships.map((starship) => {
          let starshipId = starship.starship_id ? starship.starship_id : starship._id;
          return (
            <div className="col-lg-4 p-1" key={uuidv4()}>
              <div className="card text-center bg-dark">
                <div className="card-body m-1">
                  <h5 className="card-title">{starship.name}</h5>
                  <h6 className="card-title">{starship.registry ? starship.registry : "\u00A0"}</h6>
                  <div className="row">
                    <Link to={"/starships/" + starshipId} className="btn btn-primary m-1">
                      View Starship Profile
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

export default StarshipList;
