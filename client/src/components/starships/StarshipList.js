import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import axios from "axios";
import { toast } from "react-toastify";

import d2150 from "../../assets/insignia_2150s_wide.png";
import d2250 from "../../assets/insignia_2250s_wide.png";
import d2260 from "../../assets/insignia_2260s_wide.png";
import d2280 from "../../assets/insignia_2280s_wide.png";
import d2340 from "../../assets/insignia_2340s_wide.png";
import d2370 from "../../assets/insignia_2370s_wide.png";
import d2390 from "../../assets/insignia_2390s_wide.png";
import d3100 from "../../assets/insignia_3100s_wide.png";

import StarshipsDataService from "../../services/starships";
import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";
import loadingGIF from "../../assets/loading.gif";

function StarshipList(props) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [listRefresh, setListRefresh] = useState(false);

  const [starships, setStarships] = useState([]);
  const [searchName, setSearchName] = useState(sessionStorage.starshipName || "");
  const [searchClass, setSearchClass] = useState(sessionStorage.starshipClass || "");
  const [classes, setClasses] = useState(["All", "Unknown"]);

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

  const { isShowingModal, toggleModal } = UseModal();

  useEffect(() => {
    let isMounted = true;

    const retrieveClasses = () => {
      StarshipsDataService.getStarshipClasses()
        .then((response) => {
          if (isMounted) {
            setClasses(["All", "Unknown"].concat(response.data));
          }
        })
        .catch((e) => {
          console.error(e);
          toast.error(e.message);
        });
    };
    retrieveClasses();
    return () => (isMounted = false);
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
    let isMounted = true;
    if (isMounted) {
      setStarships([]);
    }
    return () => (isMounted = false);
  }, [searchName, searchClass]);

  function defaultImage(ship_id) {
    if (ship_id < 500) {
      return d2150;
    } else if (ship_id < 1500) {
      return d2250;
    } else if (ship_id < 2000) {
      return d2260;
    } else if (ship_id < 40000) {
      return d2280;
    } else if (ship_id < 74000) {
      return d2340;
    } else if (ship_id < 82000) {
      return d2370;
    } else if (ship_id < 200000) {
      return d2390;
    } else {
      return d3100;
    }
  }

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    const ourRequest = axios.CancelToken.source();
    StarshipsDataService.find(searchName, searchClass, pageNumber, ourRequest.token)
      .then((response) => {
        if (isMounted) {
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
          sessionStorage.setItem("starshipName", searchName);
          sessionStorage.setItem("starshipClass", searchClass);
          setLoading(false);
          setListRefresh(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        console.error(e.message);
        toast.warning(e.message);
      });
    return () => {
      ourRequest.cancel();
      isMounted = false;
    };
  }, [searchName, searchClass, pageNumber, listRefresh]);

  return (
    <>
      <div className="rows d-flex align-content-center">
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setSearchName("");
              setSearchClass("");
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <select
            name="searchClass"
            value={searchClass}
            onChange={onChangeSearchClass}
            className="col-4 select-center"
          >
            {classes.map((shipClass) => {
              return (
                <option value={shipClass} key={uuidv4()}>
                  {`   `}
                  {shipClass.substring(0, 20)}
                  {" Class"}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="menu-btn-wrapper d-flex">
        {props.isAuth && (
          <>
            <button className="lcars-btn orange-btn all-round" onClick={toggleModal}>
              New Starship Record
            </button>
          </>
        )}
      </div>
      <div className="row">
        {starships.map((starship, index) => {
          let starshipId = starship.starship_id ? starship.starship_id : starship._id;
          let dateString = "";
          if (starship.launch_note === "before" || starship.commission_note === "before")
            dateString += ">";
          else if (starship.launch_note === "after" || starship.commission_note === "after")
            dateString += "<";
          else if (starship.launch_note === "approx" || starship.commission_note === "approx")
            dateString += "~";
          if (starship.launch_date || starship.commission_date) {
            dateString += starship.launch_date
              ? starship.launch_date.slice(0, 4)
              : starship.commission_date.slice(0, 4);
          } else {
            dateString += "????";
          }
          if (dateString.length > 0) {
            dateString += "-";
          }
          if (starship.decommission_note === "before" || starship.destruction_note === "before")
            dateString += ">";
          else if (starship.decommission_note === "after" || starship.destruction_note === "after")
            dateString += "<";
          else if (
            starship.decommission_note === "approx" ||
            starship.destruction_note === "approx"
          )
            dateString += "~";
          if (starship.destruction_date || starship.decommission_date) {
            dateString += starship.destruction_date
              ? starship.destruction_date.slice(0, 4)
              : starship.decommission_date.slice(0, 4);
          } else {
            dateString += "????";
          }
          return (
            <Link
              to={"/starships/" + starshipId}
              className="col-md-3 search-cards"
              key={uuidv4()}
              ref={starships.length === index + 1 ? lastStarshipsRef : null}
            >
              <div className="card card-radius text-center bg-dark">
                <div className="card-body">
                  {" "}
                  <strong style={{ margin: "0", color: "#8066af" }}>{dateString}</strong>
                  <br />
                  <img
                    className="search-list"
                    src={
                      starship.starshipPicUrl[0]
                        ? starship.starshipPicUrl[0]
                        : defaultImage(starship.ship_id)
                    }
                    alt={starship.name}
                  />
                  <h5 className="card-title" style={{ textTransform: "capitalize" }}>
                    {starship.name.replace(
                      /-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g,
                      ""
                    )}
                  </h5>
                  <h6 className="card-title">{starship.registry ? starship.registry : "\u00A0"}</h6>
                </div>
              </div>
            </Link>
          );
        })}
        {loading ? (
          <div className="w-100 text-center">
            <img src={loadingGIF} className="loading" alt="loading..." />
          </div>
        ) : null}
      </div>

      <ModalLauncher
        modal="starship"
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
        setRefresh={setListRefresh}
      />
    </>
  );
}

export default StarshipList;
