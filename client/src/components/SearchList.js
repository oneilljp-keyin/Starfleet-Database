import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";

import gray from "../assets/insignia_gray.png";
import graySun from "../assets/sun.png";

import DataService from "../services/DBAccess";
import UseModal from "./modals/UseModal";
import ModalLauncher from "./modals/ModalLauncher";
import loadingGIF from "../assets/loading.gif";

import { defaultImage, defaultShipImage } from "./hooks/HooksAndFunctions";

function SearchList(props) {
  const listCategory = props.listCategory;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [listRefresh, setListRefresh] = useState(false);

  const [categoryCount, setCategoryCount] = useState();
  const [searchCount, setSearchCount] = useState();
  const [resultsList, setResultsList] = useState([]);
  const [classes, setClasses] = useState(["All", "Unknown"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchClass, setSearchClass] = useState(sessionStorage.getItem(listCategory + "Class") || "All");
  const [searchTimeFrame, setSearchTimeFrame] = useState(sessionStorage.timeFrame || "All");

  const timeFrameOptions = [
    { label: "2101-2200", value: "22nd" },
    { label: "2201-2300", value: "23rd" },
    { label: "2301-3000", value: "24th" },
    { label: "3001-3200", value: "32nd" },
  ];

  useEffect(() => {
    let isMounted = true;
    if (isMounted) setSearchQuery(sessionStorage.getItem(listCategory + "Query") || "");
    return () => (isMounted = false);
  }, [listCategory])

  const [pageNumber, setPageNumber] = useState(0);
  const observer = useRef();
  const lastRef = useCallback(
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

  const onChangeSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    setPageNumber(0);
  };

  const onChangeSearchClass = (e) => {
    setSearchClass(e.target.value);
    setPageNumber(0);
  };

  const onChangeSearchTimeFrame = (e) => {
    setSearchTimeFrame(e.target.value);
    setPageNumber(0);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setResultsList([]);
    }
    return () => (isMounted = false);
  }, [searchQuery, searchClass, listCategory, searchTimeFrame]);

  useEffect(() => {
    let isMounted = true;
    const categoryCounts = (category) => {
      DataService.getCategoryCount(category)
        .then((response) => {
          if (isMounted) {
            setCategoryCount(response.data.count)
          }
        }).catch((e) => {
          console.error(e);
          toast.error(e.message);
        });
    };
    if (isMounted) {
      categoryCounts(listCategory);
    }
    return () => (isMounted = false);
  }, [listCategory])

  useEffect(() => {
    let isMounted = true;

    const retrieveClasses = () => {
      DataService.getStarshipClasses()
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
    if (listCategory === "starships" && isMounted) retrieveClasses();
    return () => (isMounted = false);
  }, [listCategory]);

  const debounceQuery = useMemo(
    () =>
      debounce((searchValue, searchClass) => {
        const ourRequest = axios.CancelToken.source();
        DataService.find(
          listCategory,
          searchValue,
          searchClass,
          searchTimeFrame,
          pageNumber,
          ourRequest.token
        )
          .then((response) => {
            setResultsList((prevResultsList) => {
              return [
                ...new Set([
                  ...prevResultsList,
                  ...response.data[listCategory].map((result) => result),
                ]),
              ];
            });
            setHasMore(
              (parseInt(response.data.page) + parseInt(1)) * response.data.entries_per_page <
              response.data.total_results
            );
            setLoading(false);
            setSearchCount(response.data.total_results);
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
            toast.warning(e.message);
          });
        return () => ourRequest.cancel();
      }, 1000),
    [listCategory, searchTimeFrame, pageNumber]
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (searchQuery.length > 0 || searchClass !== "All") {
        setLoading(true);
        debounceQuery(searchQuery, searchClass);
        sessionStorage.setItem(`${listCategory}Query`, searchQuery);
        if (listCategory === "starships") { sessionStorage.setItem("starshipsClass", searchClass); }
        setLoading(false);
        setListRefresh(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [searchQuery, searchClass, searchTimeFrame, pageNumber, debounceQuery, listCategory, listRefresh]);

  const setDefaultImage = useMemo(() => defaultImage(), []);

  return (
    <>
      <div className="rows d-flex align-content-center">
        {listCategory !== "starships" && (<div className="col-2"></div>)}
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder={"Search " + listCategory[0].toUpperCase() + listCategory.substring(1) + " By Name"}
            value={searchQuery}
            onChange={onChangeSearchQuery}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSearchClass("All");
              setSearchCount(0);
              setSearchTimeFrame("");
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          {listCategory === "starships" && (
            <>
              <select
                name="searchClass"
                value={searchClass}
                onChange={onChangeSearchClass}
                className="col-3 select-center"
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
              <select
                name="searchTimeFrame"
                value={searchTimeFrame}
                onChange={onChangeSearchTimeFrame}
                className="col-3 select-center"
              >
                <option value="all" key={uuidv4()}>
                  Time Frame
                </option>
                {timeFrameOptions.map(({ label, value }) => {
                  return (
                    <option value={value} key={uuidv4()}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </>
          )}

        </div>
        {listCategory !== "starships" && (<div className="col-2"></div>)}
      </div>
      <div className="menu-btn-wrapper d-flex">
        {props.isAuth && (
          <>
            <button className="lcars-btn orange-btn all-round" onClick={toggleModal}>
              New {listCategory[0].toUpperCase() + listCategory.substring(1)} Record
            </button>
          </>
        )}
      </div>
      <div className="row d-flex p-1">
        <div className="m-auto text-center">
          {resultsList.length > 0 && <h2>Search Complete ... {searchCount} Record{resultsList.length !== 1 && "s"} Found</h2>}
        </div>
        {resultsList.length === 0 ? (
          <div className="m-auto text-center">
            {searchQuery.length > 0 ? <h2>NO RESULTS</h2> : <h2>STANDBY ... {categoryCount} Records Available</h2>}
            {setDefaultImage}
          </div>
        ) : (
          resultsList.map((result, index) => {
            let subjectName;
            let subjectId = result._id;
            if (listCategory === "personnel") {
              // subjectId = result.personnel_id ? result.personnel_id : result._id;
              if (result.surname !== "undefined") subjectName = result.surname;
              if (result.first && result.first !== " ") {
                if (result.species_id !== "51") subjectName += ",";
                subjectName += " " + result.first;
              }
              if (result.middle) {
                let middleI = result.middle.slice(0, 1);
                subjectName += " " + middleI + ".";
              }
            } else if (listCategory === "starships") {
              subjectName = result.name ? result.name.replace(/-[A-Z]$/g, "") : null;
              // subjectId = result.starship_id ? result.starship_id : result._id;
            } else {
              subjectName = result.name;
              // subjectId = result.system_id ? result.starship_id : result._id;
            }
            return (
              <Link
                to={`/${listCategory}/` + subjectId}
                className="col-sm-3 search-cards"
                key={uuidv4()}
                ref={resultsList.length === index + 1 ? lastRef : null}
              >
                <div className="card card-radius text-center bg-dark">
                  <div className="card-body">
                    <img
                      className={`search-list ${listCategory}-search`}
                      src={result.picUrl[0] ? result.picUrl[0] : listCategory === "starships" ? defaultShipImage(result.ship_id) : listCategory === "systems" ? graySun : gray}
                      alt={subjectName}
                    />
                    <h5 className="card-title">{subjectName}</h5>
                    {listCategory === "starships" && (<h6 className="card-title">{result.registry ? result.registry : "\u00A0"}</h6>)}
                  </div>
                </div>
              </Link>
            );
          })
        )}
        <div className="w-100 text-center" style={{ height: "75px" }}>
          {loading ? (
            <img src={loadingGIF} className="loading" alt="loading..." />
          ) : null}
        </div>

      </div>
      <ModalLauncher
        modal={listCategory}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
        setRefresh={setListRefresh}
      />
    </>
  );
}

export default SearchList;
