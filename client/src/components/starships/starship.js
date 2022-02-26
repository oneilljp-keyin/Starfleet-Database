import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";
import PhotoCarousel from "../PhotoCarousel";
import StarshipsSame from "./StarshipsSame";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

const Starships = (props) => {
  const [type, setType] = useState("starship");
  const [category, setCategory] = useState(null);

  const [starshipName, setStarshipName] = useState("");
  const [starshipId, setStarshipId] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  const initialStarshipsState = {
    _id: null,
    ship_id: null,
    name: null,
    registry: null,
    class: null,
    shipyard: null,
    launch_date: null,
    launch_stardate: null,
    launch_note: null,
    commission_date: null,
    commission_stardate: null,
    commission_note: null,
    decommission_date: null,
    decommission_stardate: null,
    decommission_note: null,
    destruction_date: null,
    destruction_stardate: null,
    destruction_note: null,
    events: [],
  };

  const [starship, setStarship] = useState(initialStarshipsState);

  useEffect(() => {
    const getStarship = (id) => {
      StarshipsDataService.get(id)
        .then((response) => {
          setStarship(response.data);
          setStarshipName(
            response.data.name.replace(/-A|-B|-C|-D|-E|-F|-G|-H|-I|-J|-K|-L|-M/g, "") +
              " " +
              response.data.registry
          );
          setStarshipId(response.data._id);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getStarship(props.match.params.id);
  }, [props.match.params.id, refreshOption]);

  function OpenModal(modalType, id, option = type, category = "") {
    setModal(modalType);
    setEventId(id);
    setType(option);
    setCategory(category);
    toggleModal();
  }

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        <Link to={"/starships"} className="lcars_btn orange_btn left_round">
          Search
        </Link>
        {props.isAuth && (
          <>
            <button
              className="lcars_btn orange_btn all_square"
              onClick={() => {
                OpenModal("starship", starship._id);
              }}
            >
              Edit
            </button>
            <button
              className="lcars_btn orange_btn all_square"
              onClick={() => {
                OpenModal("photo", starship._id);
              }}
            >
              Upload
            </button>
            <button
              className="lcars_btn orange_btn right_round"
              onClick={() => {
                OpenModal("event", null);
              }}
            >
              Event
            </button>
          </>
        )}
      </div>
      {starship ? (
        <div>
          <div className="d-flex flex-wrap justify-content-around">
            <PhotoCarousel
              subjectId={props.match.params.id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={"starship"}
              className="flex-grow-1 col"
            />
            <div className="m-1 mobile-center">
              {starship.name && (
                <h1>USS {starship.name.replace(/-A|-B|-C|-D|-E|-F|-G|-H|-I|-J|-K|-L|-M/g, "")}</h1>
              )}
              {starship.registry && <h2>{starship.registry}</h2>}
              {starship.class && <h3>{starship.class} Class</h3>}
            </div>
            <div className="m-1 mobile-center">
              <p className="text-start">
                {starship.shipyard && (
                  <>
                    <strong>Shipyard: </strong>
                    {starship.shipyard}
                    <br />
                  </>
                )}
                {starship.launch_date && (
                  <>
                    <strong>Launch: </strong>
                    {starship.launch_note === "before" && "Before "}
                    {starship.launch_note === "after" && "After "}
                    {starship.launch_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.commission_date && (
                  <>
                    <strong>Commission: </strong>
                    {starship.commission_note === "before" && "Before "}
                    {starship.commission_note === "after" && "After "}
                    {starship.commission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.decommission_date && (
                  <>
                    <strong>Decommission: </strong>
                    {starship.decommission_note === "before" && "Before "}
                    {starship.decommission_note === "after" && "After "}
                    {starship.decommission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {starship.destruction_date && (
                  <>
                    <strong>Destruction: </strong>
                    {starship.destruction_note === "before" && "Before "}
                    {starship.destruction_note === "after" && "After "}
                    {starship.destruction_date.slice(0, 4)}
                    <br />
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-around flex-wrap">
            <StarshipsSame starshipName={starship.name} starshipId={starship._id} />
            <StarshipsSame starshipClass={starship.class} starshipId={starship._id} />
          </div>

          <div className="m-4 small-hide"></div>

          <div className="d-flex justify-content-center flex-wrap">
            <div className="lcars_end_cap left_round rose_btn my-0"> </div>
            <button
              className="lcars_btn all_square rose_btn my-0 flex-fill"
              onClick={() => {
                OpenModal("list", null, "Personnel", "Assignment");
              }}
            >
              Personnel
            </button>
            <button
              className="lcars_btn all_square rose_btn my-0 flex-fill"
              onClick={() => {
                OpenModal("list", null, "First Contact Missions", "First Contact");
              }}
            >
              First Contact
            </button>
            <div className="small_hide lcars_end_cap right_round rose_btn my-0"> </div>
            <div className="w-100 small_hide m-1"></div>
            <div className="small_hide lcars_end_cap left_round rose_btn my-0"> </div>
            <button
              className="lcars_btn all_square rose_btn my-0 flex-fill"
              onClick={() => {
                OpenModal("list", null, "General Missions", "Mission");
              }}
            >
              Missions
            </button>
            <button
              className="lcars_btn all_square rose_btn my-0 flex-fill"
              onClick={() => {
                OpenModal("list", null, "Repairs/Upgrades", "Repair Upgrade");
              }}
            >
              Repairs/Upgrades
            </button>
            <div className="lcars_end_cap right_round rose_btn my-0"> </div>
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No Starship Selected</p>
        </div>
      )}
      <div className="m-4 small-hide"></div>
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
        officerId={null}
        starshipId={starshipId}
        eventId={eventId}
        subjectName={starshipName}
        type={type}
        setRefreshOption={toggleRefresh}
        category={category}
      />
    </>
  );
};

export default Starships;
