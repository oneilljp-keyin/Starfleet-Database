import { useState } from "react";
import { Link } from "react-router-dom";

import moment from "moment";
import randomString from "random-string";
import ModalLauncher from "../modals/ModalLauncher";
import UseModal from "../modals/UseModal";

function StardateConverter(stardate) {
  let year;
  let dayIndex;
  if (stardate.charAt(5) === ".") {
    year = parseInt(stardate.slice(0, 2));
    dayIndex = parseFloat(stardate.slice(2)) / 1000;
  } else {
    year = parseInt(stardate.slice(0, 3)) + 1;
    dayIndex = parseFloat(stardate.slice(3)) / 1000;
  }

  let day;

  // year 1 will be 2323 = (2364-41)
  const newYear = 2323 + year;
  if (newYear % 4 === 0) {
    day = 366 * dayIndex;
  } else {
    day = 365 * dayIndex;
  }

  const startDate = newYear + "-01-01";
  const newDate = moment(startDate, "YYYY-MM-DD").add(parseInt(day), "days").format("YYYY-MM-DD");

  return newDate;
}

function LCARSCode(firstPart, secondPart) {
  let first = randomString({ length: firstPart, letters: false });
  let second = randomString({ length: secondPart, letters: false });
  return first + "-" + second;
}

function RandomButtonColour() {
  const colourArray = ["orange", "red", "beige", "pink", "purple", "rose", "blue", "yellow"];
  const rand = Math.floor(Math.random() * colourArray.length);
  console.log(rand);
  console.log(colourArray.at(rand));
  return colourArray.at(rand) + "_btn";
}

function buttonStack(label, first, second) {
  return (
    <>
      <div className="lcars-btn-top lcars-btn-link w-100">{label}</div>
      <div className="text-end lcars-hidden w-100">{LCARSCode(first, second)}</div>
    </>
  );
}

function EditCreateMenu(props) {
  const { isShowingModal, toggleModal } = UseModal();
  const [modal, setModal] = useState(null);

  const linkDestination = "/" + props.entryType + "s";
  const editClass = "lcars-btn d-flex flex-column events-btn";

  function OpenModal(modalType) {
    setModal(modalType);
    toggleModal();
  }

  return (
    <>
      <div className="menu-btn_wrapper flex-row d-flex">
        {/* <div className="lcars_end_cap left_round orange_btn"> </div> */}
        <Link
          to={linkDestination}
          className={`${editClass} a-button left_round ` + RandomButtonColour()}
        >
          {buttonStack("Search", 2, 3)}
        </Link>
        {props.isAuth && (
          <>
            <button
              className={editClass + " all_square " + RandomButtonColour()}
              onClick={() => {
                OpenModal(props.entryType);
              }}
            >
              {buttonStack("Edit", 2, 3)}
            </button>
            <button
              className={editClass + " all_square " + RandomButtonColour()}
              onClick={() => {
                OpenModal("photo");
              }}
            >
              {buttonStack("Upload", 2, 3)}
            </button>
            <button
              className={editClass + " right_round " + RandomButtonColour()}
              onClick={() => {
                OpenModal("event");
              }}
            >
              {buttonStack("Event", 2, 3)}
            </button>
          </>
        )}
        {/* <div className="lcars_end_cap right_round orange_btn"> </div> */}
      </div>
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        isAuth={props.isAuth}
        hide={toggleModal}
        starshipId={props.starshipId || null}
        officerId={props.officerId || null}
        refreshOption={props.refreshOption}
        setRefresh={props.setRefresh}
        subjectName={props.subjectName}
      />
    </>
  );
}

function ButtonFormatter(props) {
  const { isShowingModal, toggleModal } = UseModal();

  const eventType = props.eventType;
  const categoryLabel = props.categoryLabel;
  const modal = props.modalType;
  const newLabel = props.active ? categoryLabel : "\u00A0";

  let buttonClass = "all_square " + props.colour + "_btn d-flex flex-column events-btn";

  return (
    <>
      <button
        className={buttonClass}
        disabled={!props.active}
        onClick={() => {
          toggleModal();
        }}
      >
        {buttonStack(newLabel, 3, 6)}
        {/* {props.active ? categoryLabel : "\u00A0"} */}
      </button>
      {/* <div className="text-end lcars-hidden w-100">{LCARSCode(3, 6)}</div> */}
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        isAuth={props.isAuth}
        hide={toggleModal}
        type={eventType}
        category={categoryLabel}
        starshipId={props.starshipId}
        subjectName={props.subjectName}
        refreshOption={props.refreshOption}
        setRefresh={props.toggleRefresh}
      />
    </>
  );
}

export {
  StardateConverter,
  LCARSCode,
  ButtonFormatter,
  EditCreateMenu,
  RandomButtonColour,
  buttonStack,
};