import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";

import ufp from "../../assets/ufp.png";
import gray from "../../assets/insignia_gray.png";

import PersonnelDataService from "../../services/personnel";
import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

function PersonnelList(props) {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const [personnel, setPersonnel] = useState([]);
  const [searchQuery, setSearchQuery] = useState(sessionStorage.officerQuery || "");

  const [pageNumber, setPageNumber] = useState(0);
  const observer = useRef();
  const lastOfficerRef = useCallback(
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

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setPersonnel([]);
    }
    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  const debounceQuery = useMemo(() =>
    debounce((searchValue) => {
      const ourRequest = axios.CancelToken.source();
      PersonnelDataService.find(searchValue, pageNumber, ourRequest.token)
        .then((response) => {
          setPersonnel((prevPersonnel) => {
            return [
              ...new Set([...prevPersonnel, ...response.data.personnel.map((officer) => officer)]),
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
    }, 500),
    [pageNumber]
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (searchQuery.length > 0) {
        setLoading(true);
        debounceQuery(searchQuery);
        sessionStorage.setItem("officerQuery", searchQuery);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [searchQuery, pageNumber, debounceQuery]);

  return (
    <>
      <div className="rows d-flex align-content-center">
        <div className="col-2"></div>
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Name"
            value={searchQuery}
            onChange={onChangeSearchQuery}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setSearchQuery("");
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="col-2"></div>
      </div>
      <div className="menu-btn-wrapper d-flex">
        {props.isAuth && (
          <>
            <button className="lcars-btn orange-btn all-round" onClick={toggleModal}>
              New Officer Record
            </button>
          </>
        )}
      </div>
      <div className="row d-flex p-1">
        {personnel.length === 0 ? (
          <div className="m-auto text-center">
            {searchQuery.length > 0 ? <h2>NO RESULTS</h2> : <h2>STANDBY</h2>}
            <img className="load-img d-block mx-auto" src={ufp} alt="Loading..." />
          </div>
        ) : (
          personnel.map((officer, index) => {
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
              <Link
                to={"/personnel/" + officerId}
                className="col-sm-3 search-cards"
                key={uuidv4()}
                ref={personnel.length === index + 1 ? lastOfficerRef : null}
              >
                <div className="card text-center bg-dark">
                  <div className="card-body">
                    <img
                      className="search-list"
                      src={officer.officerPicUrl[0] ? officer.officerPicUrl[0] : gray}
                      alt={officerName}
                    />
                    <h5 className="card-title">{officerName}</h5>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <ModalLauncher
        modal="officer"
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
      />
    </>
  );
}

export default PersonnelList;
