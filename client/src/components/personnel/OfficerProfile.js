import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import PersonnelDataService from "../../services/personnel";
import PhotoCarousel from "../hooks/PhotoCarousel";

import UseModal from "../modals/UseModal";
import ModalLauncher from "../modals/ModalLauncher";

import ma_logo from "../../assets/MemoryAlphaLogo.png";
import { ButtonFormatter, EditCreateMenu } from "../hooks/HooksAndFunctions";

const Officer = (props) => {
  const [imageType, setImageType] = useState("officer");
  const [category, setCategory] = useState(null);

  const [officerName, setOfficerName] = useState("");
  const [eventId, setEventId] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshOption, setRefreshOption] = useState(false);
  const [buttonOptions, setButtonOptions] = useState({});

  useEffect(() => setRefreshOption(false), []);

  function toggleRefresh() {
    setRefreshOption(!refreshOption);
  }

  const { isShowingModal, toggleModal } = UseModal();

  const initialOfficerState = {
    _id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
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
    memoryAlphaURL: null,
  };

  const [officer, setOfficer] = useState(initialOfficerState);

  useEffect(() => {
    let isMounted = true;

    const getOfficer = (id) => {
      PersonnelDataService.get(id)
        .then((response) => {
          if (isMounted) {
            setOfficer(response.data);
            let officerName = response.data.first
              ? response.data.first + " " + response.data.surname
              : response.data.surname;
            setOfficerName(officerName);
            setButtonOptions({
              modalType: "list",
              isAuth: props.isAuth,
              officerId: id,
              subjectName: officerName,
              refreshOption: refreshOption,
              setRefresh: toggleRefresh,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    };

    getOfficer(props.match.params.id);
    return () => {
      isMounted = false;
    };
  }, [props.match.params.id, refreshOption]);

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
          officerId={props.match.params.id}
          isAuth={props.isAuth}
          photoRefresh={refreshOption}
          setPhotoRefresh={setRefreshOption}
          setRefresh={toggleRefresh}
          subjectName={officerName}
        />
      }

      {officer ? (
        <div>
          <div className="rows d-flex flex-wrap">
            <PhotoCarousel
              subjectId={props.match.params.id}
              isAuth={props.isAuth}
              photoRefresh={refreshOption}
              setPhotoRefresh={setRefreshOption}
              imageType={"officer"}
              OpenModal={OpenModal}
              className="col"
            />
            <div className="profile-summary col">
              <h1>
                {officer.surname && <>{officer.surname}</>}
                {officer.first && (
                  <>
                    {officer.species_id !== "51" && <>,</>} {officer.first}
                  </>
                )}
                {officer.middle && <> {officer.middle}</>}
                {officer.postNom && <>, {officer.postNom}</>}
                {officer.date && (
                  <span style={{ fontSize: "1.18rem" }}>
                    {" "}
                    (As of{" "}
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
                  <span style={{ color: "#FFDD22E6" }}>{!officer.active && <>Last </>}Rank: </span>
                  {officer.rankLabel.split("-").map((label, index) => {
                    let rankLabel;
                    if (index === 0) rankLabel = label;
                    return rankLabel;
                  })}
                </h3>
              )}
              {officer.position && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>
                    {!officer.active && <>Last </>}Position:{" "}
                  </span>
                  {officer.position}
                </h3>
              )}
              {officer.name && (
                <h3 style={{ textTransform: "capitalize" }}>
                  <span style={{ color: "#FFDD22E6" }}>
                    {!officer.active && <>Last </>}Vessel:{" "}
                  </span>
                  USS{" "}
                  {officer.name.replace(/-A$|-B$|-C$|-D$|-E$|-F$|-G$|-H$|-I$|-J$|-K$|-L$|-M$/g, "")}{" "}
                  {officer.registry}
                </h3>
              )}
              {officer.location &&
                (!officer.name || officer.surname.includes("Sisko")) &&
                (!officer.position || !officer.position.includes("etired")) && (
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
          </div>

          <div className="m-4 small-hide"></div>

          <div className="list-container">
            <div className="lcars_end_cap left_round rose_btn"> </div>
            {officer.starshipCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="rose"
                eventType="Assign-Pro-De"
                categoryLabel="Starship Assignments"
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
                categoryLabel="Complete Chronology"
              />
            ) : (
              <ButtonFormatter active={false} colour="pink" />
            )}
            <div className="lcars_end_cap right_round pink_btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {officer.assignCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="orange"
                eventType="Assign-Pro-De"
                categoryLabel="Service Record"
              />
            ) : (
              <ButtonFormatter active={false} colour="orange" />
            )}
            <div className="lcars_end_cap right_round orange_btn"> </div>

            <div className=""> </div>
            <div className=""> </div>
            {officer.missionCount ? (
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
            <div className="lcars_end_cap right_round blue_btn"> </div>
            <div className=""> </div>
            <div className=""> </div>
            {officer.lifeEventCount ? (
              <ButtonFormatter
                {...buttonOptions}
                active={true}
                colour="beige"
                eventType="Life Event"
                categoryLabel="Life Events"
              />
            ) : (
              <ButtonFormatter active={false} colour="beige" />
            )}
            <div className="lcars_end_cap right_round beige_btn"> </div>
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
        officerId={props.match.params.id}
        eventId={eventId}
        subjectName={officerName}
        type={imageType}
        setRefresh={toggleRefresh}
        category={category}
      />
    </>
  );
};

export default Officer;
