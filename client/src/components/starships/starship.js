import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import StarshipsDataService from "../../services/starships";
import PhotoCarousel from "../hooks/PhotoCarousel";
import StarshipsSame from "./StarshipsSame";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

import ma_logo from "../../assets/MemoryAlphaLogo.png";
import { EventAdder, LCARSCode, ButtonFormatter } from "../hooks/HooksAndFunctions";

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
          let starshipName = response.data.name.replace(
            /-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g,
            ""
          );
          if (response.data.registry) starshipName += " " + response.data.registry;
          setStarshipName(starshipName);
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

  console.log(props.isAuth);

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        {starship.memoryAlphaURL && (
          <div style={{ width: "100%" }} className="text-center">
            <a
              href={`https://memory-alpha.fandom.com/wiki/${starship.memoryAlphaURL}`}
              className="mf-1 list-link"
              target="_blank"
            >
              <img src={ma_logo} alt="Memory Alpha" />
              <strong className="mx-2">Memory Alpha Link</strong>
              <i className="fa-solid fa-up-right-from-square" style={{ color: "gray" }}></i>
            </a>
          </div>
        )}
        <Link to={"/starships"} className="a-button lcars_btn orange_btn left_round py-auto">
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
              shipId={starship.ship_id}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={"starship"}
              className="flex-grow-1 col"
            />
            <div className="m-1 mobile-center">
              {starship.name && (
                <h1>
                  USS{" "}
                  {starship.name.replace(
                    /-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g,
                    ""
                  )}
                </h1>
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
                    {starship.launch_note === "before" && "pre "}
                    {starship.launch_note === "after" && "post "}
                    {starship.launch_note === "approx" && "circa "}
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
            {starship.name && (
              <StarshipsSame starshipName={starship.name} starshipId={starship._id} />
            )}
            {starship.class && (
              <StarshipsSame starshipClass={starship.class} starshipId={starship._id} />
            )}
          </div>

          <div className="m-4 small-hide"></div>

          <div className="list-container">
            <div className="lcars_end_cap left_round rose_btn"> </div>
            {starship.personnelCount ? (
              <button
                className="lcars_btn all_square rose_btn"
                onClick={() => {
                  OpenModal("list", null, "Personnel", "Assign-Pro-De");
                }}
              >
                Personnel ({starship.personnelCount})
              </button>
            ) : (
              <div className="lcars_btn all_square rose_btn">&nbsp;</div>
            )}
            {starship.firstContactCount ? (
              <button
                className="lcars_btn all_square pink_btn"
                onClick={() => {
                  OpenModal("list", null, "First Contact Missions", "First Contact");
                }}
              >
                First Contact ({starship.firstContactCount})
              </button>
            ) : (
              <div className="lcars_btn all_square pink_btn">&nbsp;</div>
            )}
            <div className="lcars_end_cap right_round pink_btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {starship.missionCount ? (
              <button
                className="lcars_btn all_square orange_btn"
                onClick={() => {
                  OpenModal("list", null, "General Missions", "Mission");
                }}
              >
                Missions ({starship.missionCount})
              </button>
            ) : (
              <div className="lcars_btn all_square orange_btn">&nbsp;</div>
            )}
            <div className="lcars_end_cap right_round orange_btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {starship.maintenanceCount ? (
              <button
                className="lcars_btn all_square blue_btn"
                onClick={() => {
                  OpenModal("list", null, "Repairs/Upgrades", "Repair Upgrade");
                }}
              >
                Maintenance ({starship.maintenanceCount})
              </button>
            ) : (
              <div className="lcars_btn all_square blue_btn">&nbsp;</div>
            )}
            <div className="lcars_end_cap right_round blue_btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {/* <div className="lcars_btn all_square beige_btn d-flex flex-column px-1">
              <div className="text-start" style={{ fontSize: "1rem", paddingLeft: "8px" }}>
                {starship.firstContactCount ||
                starship.missionCount ||
                starship.maintenanceCount ? (
                  <button
                    style={{ border: "none", backgroundColor: "#ffffff00" }}
                    onClick={() => {
                      OpenModal("list", null, "Complete Chronology", "Chronology");
                    }}
                  >
                    Complete Chronology
                  </button>
                ) : (
                  "\u00A0"
                )}
              </div>
              <div className="text-end" style={{ fontSize: "10px" }}>
                {LCARSCode(3, 6)}
              </div>
            </div> */}
            {starship.maintenanceCount || starship.missionCount || starship.firstContactCount
              ? ButtonFormatter(
                  true,
                  "beige",
                  "list",
                  "Complete Chronology",
                  "Chronology",
                  props.isAuth
                )
              : ButtonFormatter(false, "beige")}
            <div className="lcars_end_cap right_round beige_btn"> </div>
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
        starshipId={starshipId}
        eventId={eventId}
        subjectName={starshipName}
        type={type}
        refreshOption={refreshOption}
        setRefresh={toggleRefresh}
        category={category}
      />
    </>
  );
};

export default Starships;
