import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import axios from "axios";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";
import UseModalStarship from "../modals/UseModalStarship";
import ModalStarship from "../modals/ModalStarship";

function StarshipList({ isAuth, userId, admin, setDatabase, database }) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [starships, setStarships] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [classes, setClasses] = useState(["Unknown Class"]);

  const [pageNumber, setPageNumber] = useState(0);
  const observer = useRef();
  const lastStarshipsRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const { isShowingModalStarship, toggleModalStarship } = UseModalStarship();

  useEffect(() => {
    retrieveClasses();
  }, []);

  const onChangeSearchName = (e) => {
    setSearchName(e.target.value);
    setPageNumber(0);
  };

  const onChangeSearchClass = (e) => {
    setSearchClass(e.target.value);
    setPageNumber(0);
  };

  useEffect(() => {
    setStarships([]);
  }, [searchName]);

  useEffect(() => {
    if (searchName.length > 0 && searchClass !== "Unknown Class") {
      setLoading(true);
      const ourRequest = axios.CancelToken.source();
      StarshipsDataService.find(searchName, searchClass, ourRequest.token)
        .then((response) => {
          setStarships((prevStarships) => {
            return [
              ...new Set([
                ...prevStarships,
                ...response.data.starships.map((starship) => starship),
              ]),
            ];
          });
          setHasMore(
            (parseInt(response.data.page) + parseInt(1)) * response.data.entries_per_page <
              response.data.total_results
          );
          setLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          toast.warning(e.message);
        });
      return () => ourRequest.cancel();
    }
  }, [searchName, searchClass, pageNumber]);

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
      <div className="d-flex row form-group">
        <div className="col-3"></div>
        <input
          type="text"
          className="col-4"
          placeholder="Search By Name"
          value={searchName}
          onChange={onChangeSearchName}
        />
        {/* <button
          className="col-2 btn search_btn btn-outline-secondary"
          type="button"
          onClick={findByName}
        >
          Search
        </button> */}
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
                {shipClass.substring(0, 20)}{" "}
              </option>
            );
          })}
        </select>
        {/* <button
          className="col-2 btn search_btn btn-outline-secondary"
          type="button"
          onClick={findByClass}
        >
          Search
        </button> */}
        <div className="col-3"></div>
      </div>
      <div className="row">
        {starships.map((starship, index) => {
          let starshipId = starship.starship_id ? starship.starship_id : starship._id;
          return (
            <div
              className="col-md-4 p-1"
              key={uuidv4()}
              ref={starships.length === index + 1 ? lastStarshipsRef : null}
            >
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
      <ModalStarship
        isShowing={isShowingModalStarship}
        hide={toggleModalStarship}
        isAuth={isAuth}
        starshipId={null}
        subjectName={null}
        setProfileRefresh={null}
      />
    </>
  );
}

export default StarshipList;
