import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import DataService from "../../services/DBAccess";
import PhotoCarousel from "../hooks/PhotoCarousel";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

import ma_logo from "../../assets/MemoryAlphaLogo.png";
import { ButtonFormatter, EditCreateMenu, EventAdder } from "../hooks/HooksAndFunctions";

const Systems = (props) => {
  const { id } = useParams();
  const category = props.listCategory;
  const isAuth = props.isAuth;

  const [systemName, setSystemName] = useState("");
  const [refreshOption, setRefreshOption] = useState(false);

  useEffect(() => setRefreshOption(false), []);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  const buttonOptions = {
    modalType: "list",
    isAuth: isAuth,
    SystemId: id,
    subjectName: systemName,
    refreshOption: refreshOption,
    setRefresh: toggleRefresh,
  };

  const initialState = {
    _id: null,
    name: null,
    starTypes: null,
    sectorName: null,
    sectorNum: null,
    quadrant: null,
    numOfPlanets: null,
    government: null,
    notes: null,
    memoryAlphaURL: null,
  };

  const [system, setSystem] = useState(initialState);

  useEffect(() => {
    let isMounted = true;

    const getSystem = (category, subjectId) => {
      DataService.getOne(category, subjectId)
        .then((response) => {
          if (isMounted) {
            setSystem(response.data);
            let systemName = response.data.name;
            setSystemName(systemName);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getSystem(category, id);
    return () => {
      isMounted = false;
    };
  }, [id, refreshOption, category]);

  return (
    <>
      {
        <EditCreateMenu
          entryType={category}
          systemId={id}
          isAuth={props.isAuth}
          refreshOption={refreshOption}
          setRefresh={toggleRefresh}
          subjectName={systemName}
        />
      }
      {system ? (
        <div>
          <div className="d-flex flex-wrap justify-content-around">
            <PhotoCarousel
              subjectId={id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={category}
              className="flex-grow-1 col"
            />
            <div className="m-1 mobile-center">
            <h1>{system.name && system.name}</h1>
              {system.memoryAlphaURL && (
                <a
                  href={`https://memory-alpha.fandom.com/wiki/${system.memoryAlphaURL}`}
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
              {/* <p className="text-start">
                {system.shipyard && (
                  <>
                    <strong>Shipyard: </strong>
                    {system.shipyard}
                    <br />
                  </>
                )}
                {system.launch_date && (
                  <>
                    <strong>Launch: </strong>
                    {system.launch_note === "before" && "pre "}
                    {system.launch_note === "after" && "post "}
                    {system.launch_note === "approx" && "circa "}
                    {system.launch_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {system.commission_date && (
                  <>
                    <strong>Commission: </strong>
                    {system.commission_note === "before" && "Before "}
                    {system.commission_note === "after" && "After "}
                    {system.commission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {system.decommission_date && (
                  <>
                    <strong>Decommission: </strong>
                    {system.decommission_note === "before" && "Before "}
                    {system.decommission_note === "after" && "After "}
                    {system.decommission_date.slice(0, 4)}
                    <br />
                  </>
                )}
                {system.destruction_date && (
                  <>
                    <strong>Destruction: </strong>
                    {system.destruction_note === "before" && "Before "}
                    {system.destruction_note === "after" && "After "}
                    {system.destruction_date.slice(0, 4)}
                    <br />
                  </>
                )}
                </p> */}
                </div>
          </div>

          <div className="m-4 small-hide"></div>

          <div className="list-container">
            <div className="lcars-end-cap left-round rose-btn"> </div>
            {system.personnelCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="rose"
                eventType="Assign-Pro-De"
                categoryLabel="Assigned Personnel"
                count={system.personnelCount}
              />
            ) : (
              <ButtonFormatter active={false} colour="rose" />
            )}
            {system.maintenanceCount || system.missionCount || system.firstContactCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="pink"
                eventType="Chronology"
                categoryLabel="Chronology"
                count={EventAdder(system.maintenanceCount, system.missionCount, system.firstContactCount)}
              />
            ) : (
              <ButtonFormatter active={false} colour="pink" />
            )}
            <div className="lcars-end-cap right-round pink-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {system.firstContactCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="orange"
                eventType="First Contact"
                categoryLabel="First Contact Debriefs"
                count={system.firstContactCount}
              />
            ) : (
              <ButtonFormatter active={false} colour="orange" />
            )}
            <div className="lcars-end-cap right-round orange-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {system.missionCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="blue"
                eventType="Mission"
                categoryLabel="Mission Debriefs"
                count={system.missionCount}
              />
            ) : (
              <ButtonFormatter active={false} colour="blue" />
            )}
            <div className="lcars-end-cap right-round blue-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {system.maintenanceCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="beige"
                eventType="Maintenance"
                categoryLabel="Maintenance Logs"
                count={system.maintenanceCount}
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
          <p>No System Selected</p>
        </div>
      )}
      <div className="m-4 small-hide"></div>
      <ModalLauncher
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={isAuth}
        systemId={id}
        subjectName={systemName}
        eventType={category}
        refreshOption={refreshOption}
        setRefresh={toggleRefresh}
      />
    </>
  );
};

export default Systems;
