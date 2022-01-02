import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // then use uuidv4() to insert id
import axios from "axios";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import UseModalOfficer from "../modals/UseModalOfficer";
import ModalOfficer from "../modals/ModalOfficer";

function PersonnelList({ isAuth, userId, admin, setDatabase, database }) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [personnel, setPersonnel] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const { isShowingModalOfficer, toggleModalOfficer } = UseModalOfficer();

  const onChangeSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    setPageNumber(0);
  };

  useEffect(() => {
    setPersonnel([]);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setLoading(true);
      const ourRequest = axios.CancelToken.source();
      PersonnelDataService.find(searchQuery, pageNumber, ourRequest.token)
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
    }
  }, [searchQuery, pageNumber]);

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
          {/* <div className="input-group-append input-group-lg">
            <button className="btn btn-outline-secondary" type="button">
              Search
            </button>
          </div> */}
        </div>
        <div className="col-2"></div>
      </div>
      <div className="menu-btn_wrapper d-flex">
        {isAuth && (
          <>
            <button className="lcars_btn orange_btn all_round" onClick={toggleModalOfficer}>
              New Officer Record
            </button>
          </>
        )}
      </div>
      <div className="row">
        {personnel.map((officer, index) => {
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
            <div
              className="col-md-4 p-1"
              key={uuidv4()}
              ref={personnel.length === index + 1 ? lastOfficerRef : null}
            >
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
      <ModalOfficer
        isShowing={isShowingModalOfficer}
        hide={toggleModalOfficer}
        isAuth={isAuth}
        officerId={null}
        subjectName={null}
        setProfileRefresh={null}
      />
    </>
  );
}

export default PersonnelList;
