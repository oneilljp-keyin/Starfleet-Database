import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import StarshipsDataService from "../../services/starships";
import PhotoCarousel from "../hooks/PhotoCarousel";
import StarshipsSame from "./StarshipsSame";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

import ma_logo from "../../assets/MemoryAlphaLogo.png";
import { ButtonFormatter, EditCreateMenu } from "../hooks/HooksAndFunctions";

const Starships = (props) => {
  const { id } = useParams();
  const type = "starship";
  const isAuth = props.isAuth;

  const [starshipName, setStarshipName] = useState("");
  const [refreshOption, setRefreshOption] = useState(false);

  useEffect(() => setRefreshOption(false), []);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  const buttonOptions = {
    modalType: "list",
    isAuth: isAuth,
    starshipId: id,
    subjectName: starshipName,
    refreshOption: refreshOption,
    setRefresh: toggleRefresh,
  };

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
  };

  const [starship, setStarship] = useState(initialStarshipsState);

  useEffect(() => {
    let isMounted = true;

    const getStarship = (starshipId) => {
      StarshipsDataService.get(starshipId)
        .then((response) => {
          if (isMounted) {
            setStarship(response.data);
            let starshipName = response.data.name.replace(/-[ABC]$/g, "");
            if (response.data.registry) starshipName += " " + response.data.registry;
            setStarshipName(starshipName);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getStarship(id);
    return () => {
      isMounted = false;
    };
  }, [id, refreshOption]);

  return (
    <>
      {
        <EditCreateMenu
          entryType={type}
          starshipId={id}
          isAuth={props.isAuth}
          photoRefresh={refreshOption}
          setPhotoRefresh={setRefreshOption}
          setRefresh={toggleRefresh}
          subjectName={starshipName}
        />
      }
      {starship ? (
        <div>
          <div className="d-flex flex-wrap justify-content-around">
            <PhotoCarousel
              subjectId={id}
              isAuth={props.isAuth}
              shipId={starship.ship_id}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType="starship"
              className="flex-grow-1 col"
            />
            <div className="m-1 mobile-center">
              {starship.name && <h1>USS {starship.name.replace(/-[A-Z]$/g, "")}</h1>}
              {starship.registry && <h2>{starship.registry}</h2>}
              {starship.class && <h3>{starship.class} Class</h3>}
              {starship.memoryAlphaURL && (
                <a
                  href={`https://memory-alpha.fandom.com/wiki/${starship.memoryAlphaURL}`}
                  className="mf-1 list-link"
                  target="_blank" rel="noreferrer"
                >
                  <img src={ma_logo} alt="Memory Alpha" />
                  <strong className="mx-1">Memory Alpha</strong>
                  <i className="fa-solid fa-up-right-from-square" style={{ color: "gray" }}></i>
                </a>
              )}
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
            <div className="lcars-end-cap left-round rose-btn"> </div>
            {starship.personnelCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="rose"
                eventType="Assign-Pro-De"
                categoryLabel="Assigned Personnel"
              />
            ) : (
              <ButtonFormatter active={false} colour="rose" />
            )}
            {starship.maintenanceCount || starship.missionCount || starship.firstContactCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="pink"
                eventType="Chronology"
                categoryLabel="Complete Chronology"
              />
            ) : (
              <ButtonFormatter active={false} colour="pink" />
            )}
            <div className="lcars-end-cap right-round pink-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {starship.firstContactCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="orange"
                eventType="First Contact"
                categoryLabel="First Contact Debriefs"
              />
            ) : (
              <ButtonFormatter active={false} colour="orange" />
            )}
            <div className="lcars-end-cap right-round orange-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {starship.missionCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="blue"
                eventType="Mission"
                categoryLabel="Mission Debriefs"
              />
            ) : (
              <ButtonFormatter active={false} colour="blue" />
            )}
            <div className="lcars-end-cap right-round blue-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {starship.maintenanceCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="beige"
                eventType="Maintenance"
                categoryLabel="Maintenance Logs"
              />
            ) : (
              <ButtonFormatter active={false} colour="beige" />
            )}
            <div className="lcars-end-cap right-round beige-btn"> </div>
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
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={isAuth}
        starshipId={id}
        subjectName={starshipName}
        eventType={type}
        refreshOption={refreshOption}
        setRefresh={toggleRefresh}
      />
    </>
  );
};

export default Starships;
