import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id

import StarshipsDataService from "../../services/starships";
// import Pagination from "../../utils/pagination";

function StarshipList({ isAuth, userId, admin, setDatabase, database }) {
  const [starships, setStarships] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [classes, setClasses] = useState(["Search By Class"]);

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

  // const onChangeDatabase = (e) => {
  //   const searchDatabase = e.target.value;
  //   setDatabase(searchDatabase);
  // };

  const find = (query, by, db, userId) => {
    StarshipsDataService.find(query, by, db, userId)
      .then((response) => {
        setStarships(response.data.starships);
        // setCurrentPage(response.data.page);
        // setTotalResults(response.data.total_results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    // setQueryBy("name");
    find(searchName, "name", database, userId);
    setSearchClass("");
  };

  const findByClass = () => {
    // setQueryBy("class");
    find(searchClass, "class");
    setSearchName("");
  };

  const retrieveClasses = () => {
    StarshipsDataService.getStarshipClasses()
      .then((response) => {
        // console.log(response.data);
        setClasses(["Search By Class"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="d-flex row form-group">
        <div className="col-3"></div>
        <input
          type="text"
          className="col-4"
          placeholder="Search By Name"
          value={searchName}
          onChange={onChangeSearchName}
        />
        <button
          className="col-2 btn search_btn btn-outline-secondary"
          type="button"
          onClick={findByName}
        >
          Search
        </button>
        <div className="col-3"></div>
        <div className="w-100"></div>
        <div className="col-3"></div>
        <select
          name="searchClass"
          value={searchClass}
          onChange={onChangeSearchClass}
          className="col-4"
        >
          {classes.map((shipClass) => {
            return (
              <option value={shipClass} key={uuidv4()}>
                {" "}
                {shipClass.substr(0, 20)}{" "}
              </option>
            );
          })}
        </select>
        <button
          className="col-2 btn search_btn btn-outline-secondary"
          type="button"
          onClick={findByClass}
        >
          Search
        </button>
        <div className="col-3"></div>
      </div>
      <div className="row">
        {starships.map((starship) => {
          let starshipId = starship.starship_id ? starship.starship_id : starship._id;
          return (
            <div className="col-md-4 p-1" key={uuidv4()}>
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
