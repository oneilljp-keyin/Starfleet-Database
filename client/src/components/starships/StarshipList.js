import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import axios from "axios";
import { toast } from "react-toastify";

import gray from "../../assets/insignia_gray.png";

import StarshipsDataService from "../../services/starships";
import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

function StarshipList({ isAuth, userId, admin, modalClass, setModalClass }) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [listRefresh, setListRefresh] = useState(false);

  const [starships, setStarships] = useState([]);
  const [searchName, setSearchName] = useState(sessionStorage.starshipName || "");
  const [searchClass, setSearchClass] = useState(sessionStorage.starshipClass || "");
  const [classes, setClasses] = useState(["Unknown"]);

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
    const retrieveClasses = () => {
      StarshipsDataService.getStarshipClasses()
        .then((response) => {
          setClasses(["Unknown"].concat(response.data));
        })
        .catch((e) => {
          console.error(e);
          toast.error(e.message);
        });
    };
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
  }, [searchName, searchClass]);

  useEffect(() => {
    setLoading(true);
    const ourRequest = axios.CancelToken.source();
    StarshipsDataService.find(searchName, searchClass, pageNumber, ourRequest.token)
      .then((response) => {
        setStarships((prevStarships) => {
          return [
            ...new Set([...prevStarships, ...response.data.starships.map((starship) => starship)]),
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
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        console.error(e.message);
        toast.warning(e.message);
      });
    return () => ourRequest.cancel();
    // }
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
      <div className="menu-btn_wrapper d-flex">
        {isAuth && (
          <>
            <button className="lcars_btn orange_btn all_round" onClick={toggleModal}>
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
            <div
              className="col-md-3 list-cards"
              key={uuidv4()}
              ref={starships.length === index + 1 ? lastStarshipsRef : null}
            >
              <div className="card text-center bg-dark">
                <div className="card-body">
                  {" "}
                  <strong style={{ margin: "0", color: "#8066af" }}>{dateString}</strong>
                  <br />
                  <img
                    className="search-list"
                    src={starship.starshipPicUrl[0] ? starship.starshipPicUrl[0] : gray}
                    alt={starship.name}
                  />
                  <h5 className="card-title">
                    {starship.name.replace(
                      /-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g,
                      ""
                    )}
                  </h5>
                  <h6 className="card-title">{starship.registry ? starship.registry : "\u00A0"}</h6>
                  <div className="row">
                    <Link to={"/starships/" + starshipId} className="btn btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ModalLauncher
        modal="starship"
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={isAuth}
        starshipId={null}
        subjectName={null}
        setRefresh={setListRefresh}
      />
    </>
  );
}

export default StarshipList;
