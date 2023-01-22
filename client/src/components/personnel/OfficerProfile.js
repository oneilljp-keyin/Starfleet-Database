import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import DataService from "../../services/DBAccess";
import PhotoCarousel from "../hooks/PhotoCarousel";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

import ma_logo from "../../assets/MemoryAlphaLogo.png";
import { ButtonFormatter, EditCreateMenu, EventAdder } from "../hooks/HooksAndFunctions";

const Officer = (props) => {
  const { id } = useParams();
  const [imageType, setImageType] = useState();
  const [category, setCategory] = useState(null);

  const [officerName, setOfficerName] = useState("");
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);
  useEffect(() => {setRefreshOption(false); setImageType("personnel")}, []);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }
  const { isShowingModal, toggleModal } = UseModal();
  const buttonOptions = {
    modalType: "list",
    isAuth: props.isAuth,
    subjectName: officerName,
    refreshOption: refreshOption,
    setRefresh: toggleRefresh,
    officerId: id,
  };

  const initialOfficerState = {
    _id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
    species_id: null,
    birthDate: null,
    birthStardate: null,
    birthPlace: null,
    birthDateNote: null,
    deathDate: null,
    deathStardate: null,
    deathPlace: null,
    deathDateNote: null,
    serial: null,
    active: null,
    status: null,
    memoryAlphaURL: null,
  };

  const [officer, setOfficer] = useState(initialOfficerState);

  useEffect(() => {
    let isMounted = true;

    const getOfficer = (cat, subjectId) => {
      DataService.getOne(cat, subjectId)
        .then((response) => {
          if (isMounted) {
            setOfficer(response.data);
            let officerName = !response.data.first
              ? response.data.surname
              : response.data.species_id === "51"
              ? response.data.surname + " " + response.data.first
              : response.data.first + " " + response.data.surname;
            setOfficerName(officerName);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getOfficer(props.listCategory, id);
    return () => {
      isMounted = false;
    };
  }, [id, refreshOption, props.listCategory]);

  function OpenModal(modalType, eventId = null, type = "officer", category = "") {
    setModal(modalType);
    setEventId(eventId);
    setImageType(type);
    setCategory(category);
    toggleModal();
  }

  return (
    <>
      {
        <EditCreateMenu
          entryType={imageType}
          officerId={id}
          isAuth={props.isAuth}
          photoRefresh={refreshOption}
          setPhotoRefresh={setRefreshOption}
          setRefresh={toggleRefresh}
          subjectName={officerName}
        />
      }

      {officer ? (
        <div>
          <div className="d-flex flex-wrap justify-content-around">
            <PhotoCarousel
              subjectId={id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType="officer"
              OpenModal={OpenModal}
              className="col-md-4"
            />
            <div className="m-1 profile-summary col-md-5">
              <h1 style={{ lineHeight: "0.75" }}>
                {officer.surname && <>{officer.surname}</>}
                {officer.first && officer.first !== " " && (
                  <>
                    {officer.species_id !== "51" && <>,</>} {officer.first}
                  </>
                )}
                {officer.middle && <> {officer.middle}</>}
                {officer.postNom && <>, {officer.postNom}</>}
                {officer.date && (
                  <span style={{ fontSize: "0.5em" }}>
                    <br />({officer.status} as of{" "}
                    {officer.deathDate
                      ? officer.deathDate.slice(0, 4)
                      : officer.endDate
                      ? officer.endDate.slice(0, 4)
                      : officer.date.slice(0, 4)}
                    )
                  </span>
                )}
              </h1>
              {officer.serial && <h2>{officer.serial}</h2>}
              {officer.rankLabel && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>
                    {((officer.active && officer.active === false) ||
                      (officer.status && officer.status !== "active")) && <>Last </>}
                    Rank:{" "}
                  </span>
                  {officer.rankLabel.split("-").map((label, index) => {
                    let rankLabel;
                    if (index === 0) rankLabel = label;
                    return rankLabel;
                  })}
                  {officer.provisional && (
                    <>
                      {" "}
                      <span style={{ fontSize: "0.75em", color: "#FFFFFFDE" }}>[Provisional]</span>
                    </>
                  )}
                </h3>
              )}
              {officer.position && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>
                    {((officer.active && officer.active === false) ||
                      (officer.status && officer.status !== "active")) && <>Last </>}
                    Position:{" "}
                  </span>
                  {officer.position}
                </h3>
              )}
              {officer.name && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>
                    {((officer.active && officer.active === false) ||
                      (officer.status && officer.status !== "active")) && <>Last </>}
                    Vessel:{" "}
                  </span>
                  {!officer.name.includes("NCC-") && (
                    <>USS {officer.name.replace(/-[A-Z]$/g, "")} </>
                  )}
                  {officer.registry}
                </h3>
              )}
              {officer.location && (
                // (!officer.name || officer.surname.includes("Sisko")) &&
                // (!officer.position || !officer.position.includes("etired")) &&
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}> Location: </span>
                  {officer.location}
                </h3>
              )}
              {officer.birthDate && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Birth: </span>
                  {officer.birthDateNote ? (
                    <>
                      {officer.birthDateNote} {officer.birthDate.slice(0, 4)}
                    </>
                  ) : (
                    <>{officer.birthDate.slice(0, 10)}</>
                  )}
                </h3>
              )}
              {officer.birthPlace && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>From: </span>
                  {officer.birthPlace}
                </h3>
              )}
              {officer.deathDate && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Death: </span>
                  {officer.deathDateNote && officer.deathDateNote !== "Exact Date" ? (
                    <>
                      {officer.deathDateNote} {officer.deathDate.slice(0, 4)}
                    </>
                  ) : (
                    <>{officer.deathDate.slice(0, 10)}</>
                  )}
                </h3>
              )}
              {officer.deathPlace && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>Place: </span>
                  {officer.deathPlace}
                </h3>
              )}
            </div>
            {officer.memoryAlphaURL && (
              <div className="m-1 mobile-center col-md-3">
                <a
                  href={`https://memory-alpha.fandom.com/wiki/${officer.memoryAlphaURL}`}
                  className="mf-1 list-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={ma_logo} alt="Memory Alpha" />
                  <strong className="mx-1">Memory Alpha</strong>
                  <i className="fa-solid fa-up-right-from-square" style={{ color: "gray" }}></i>
                </a>
              </div>
            )}
          </div>

          <div className="m-4 small-hide"></div>

          <div className="list-container">
            <div className="lcars-end-cap left-round rose-btn"> </div>
            {officer.starshipCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="rose"
                eventType="Assign-Pro-De"
                categoryLabel="Starship Assignments"
                count={officer.starshipCount}
              />
            ) : (
              <ButtonFormatter active={false} colour="rose" />
            )}
            {officer.assignCount || officer.missionCount || officer.lifeEventCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="pink"
                eventType="Chronology"
                categoryLabel="Chronology"
                count={EventAdder(
                  officer.assignCount,
                  officer.missionCount,
                  officer.lifeEventCount
                )}
              />
            ) : (
              <ButtonFormatter active={false} colour="pink" />
            )}
            <div className="lcars-end-cap right-round pink-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {officer.assignCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="orange"
                eventType="Assign-Pro-De"
                categoryLabel="Service Record"
                count={officer.assignCount}
              />
            ) : (
              <ButtonFormatter active={false} colour="orange" />
            )}
            <div className="lcars-end-cap right-round orange-btn"> </div>

            <div className=""> </div>
            <div className=""> </div>
            {officer.missionCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="blue"
                eventType="Mission"
                categoryLabel="Mission Debriefs"
                count={officer.missionCount}
              />
            ) : (
              <ButtonFormatter active={false} colour="blue" />
            )}
            <div className="lcars-end-cap right-round blue-btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {officer.lifeEventCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="beige"
                eventType="Life Event"
                categoryLabel="Life Events"
                count={officer.lifeEventCount}
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
          <p>No Officer Selected</p>
        </div>
      )}
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={props.isAuth}
        officerId={id}
        eventId={eventId}
        subjectName={officerName}
        eventType={imageType}
        setRefresh={toggleRefresh}
        category={category}
      />
    </>
  );
};

export default Officer;
