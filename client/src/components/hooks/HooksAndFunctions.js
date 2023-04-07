import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import randomString from "random-string";

import ModalLauncher from "../modals/ModalLauncher";
import UseModal from "../modals/UseModal";

import loading from "../../assets/loading.gif";
import sc2250 from "../../assets/sc-2250s.png";
import sc2360 from "../../assets/sc-2360s.png";
import sc2400 from "../../assets/sc-2400s.png";
import d2150 from "../../assets/insignia_2150s_wide.png";
import d2250 from "../../assets/insignia_2250s_wide.png";
import d2260 from "../../assets/insignia_2260s_wide.png";
import d2280 from "../../assets/insignia_2280s_wide.png";
import d2340 from "../../assets/insignia_2340s_wide.png";
import d2370 from "../../assets/insignia_2370s_wide.png";
import d2390 from "../../assets/insignia_2390s_wide.png";
import d2800 from "../../assets/insignia_2800s_wide.png";
import d3100 from "../../assets/insignia_3100s_wide.png";

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

  // year 1 will be 2323
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
  return colourArray.at(rand) + "_btn";
}

function buttonStack(label, count, first, second) {
  let newLabel = label;
  if (count) {
    newLabel += ` [${count}]`;
  }
  return (
    <>
      <div className="lcars-btn-top lcars-btn-link w-100">{newLabel}</div>
      <div className="text-end lcars-hidden w-100">{LCARSCode(first, second)}</div>
    </>
  );
}

const defaultImage = () => {
  const array = [sc2250, sc2360, sc2400];
  const random = Math.floor(Math.random() * 3);
  return <img className="load-img d-block mx-auto" src={array[random]} alt="Loading..." />;
};

const defaultShipImage = (ship_id) => {
  if (ship_id < 500) {
    return d2150;
  } else if (ship_id < 1500) {
    return d2250;
  } else if (ship_id < 2000) {
    return d2260;
  } else if (ship_id < 40000) {
    return d2280;
  } else if (ship_id < 74000) {
    return d2340;
  } else if (ship_id < 82000) {
    return d2370;
  } else if (ship_id < 150000) {
    return d2390;
  } else if (ship_id < 300000) {
    return d2800;
  } else {
    return d3100;
  }
}

const dateOptions = [
  { label: "Exact", value: "exact" },
  { label: "Approximate", value: "approx" },
  { label: "Before", value: "before" },
  { label: "After", value: "after" },
];

const quadrants = [
  { label: "Milky Way", value: "MW" },
  { label: "Alpha/Beta", value: "AB" },
  { label: "Alpha", value: "A" },
  { label: "Beta", value: "B" },
  { label: "Delta", value: "D" },
  { label: "Gamma", value: "G" },
];

const starTypes = [
  { label: "Unknown", value: null },
  { label: "O-Type", value: "O" },
  { label: "B-Type", value: "B" },
  { label: "A-Type", value: "A" },
  { label: "F-Type", value: "F" },
  { label: "G-Type", value: "G" },
  { label: "K-Type", value: "K" },
  { label: "M-Type", value: "M" },
]

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Extended Leave", value: "Extended Leave" },
  { label: "Active Reserve", value: "Active Reserve" },
  { label: "Retired", value: "Retired" },
  { label: "Dishcarged", value: "Discarged" },
  { label: "Missing-In-Action", value: "Missing-In-Action" },
  { label: "Killed-In-Action", value: "Killed-In-Action" },
  { label: "Deceased", value: "Deceased" },
];

const NumberDropDown = (props) => {
  const dropDown = [];
  for (let i = 0; i <= props.num; i++) {
    dropDown.push(<option key={i} value={i}>{i}</option>);
  }
  return dropDown;
}

function BackToTopFunction() {
  return (
    <button
      className="go-to-top orange-btn all-round lcars-btn"
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
    >
      Back to Search
    </button>
  );
}

function EditCreateMenu(props) {
  const { isShowingModal, toggleModal } = UseModal();
  const [modalType, setModalType] = useState(null);

  const editClass = "lcars-btn d-flex flex-column events-btn";

  function OpenModal(modalType) {
    setModalType(modalType);
    toggleModal();
  }

  return (
    <>
      <div className="menu-btn-wrapper flex-row d-flex">
        <Link to={`/${props.entryType}`} className={`${editClass} a-button left-round green-btn`}>
          {buttonStack("Search", null, 2, 3)}
        </Link>
        {props.isAuth && (
          <>
            <button
              className={editClass + " all-square yellow-btn"}
              onClick={() => {
                OpenModal(props.entryType);
              }}
            >
              {buttonStack("Edit", null, 2, 3)}
            </button>
            <button
              className={editClass + " all-square rose-btn"}
              onClick={() => {
                OpenModal("photo");
              }}
            >
              {buttonStack("Upload", null, 2, 3)}
            </button>
            <button
              className={editClass + " right-round pink-btn"}
              onClick={() => {
                OpenModal("event");
              }}
            >
              {buttonStack("Event", null, 2, 3)}
            </button>
          </>
        )}
      </div>
      <ModalLauncher
        modal={modalType}
        isShowing={isShowingModal}
        isAuth={props.isAuth}
        hide={toggleModal}
        starshipId={props.starshipId}
        officerId={props.officerId}
        systemId={props.systemId}
        refreshOption={props.refreshOption}
        setRefresh={props.setRefresh}
        subjectName={props.subjectName}
        entryType={props.entryType}
      />
    </>
  );
}

function ButtonFormatter(props) {
  const { isShowingModal, toggleModal } = UseModal();

  const eventType = props.eventType;
  let categoryLabel = props.categoryLabel;
  const modal = props.modalType;
  const newLabel = props.active ? categoryLabel : "\u00A0";

  let buttonClass = "all-square " + props.colour + "-btn d-flex flex-column events-btn";

  return (
    <>
      <button
        className={buttonClass}
        disabled={!props.active}
        onClick={() => {
          toggleModal();
        }}
      >
        {buttonStack(newLabel, props.count, 3, 6)}
      </button>
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        isAuth={props.isAuth}
        hide={toggleModal}
        eventType={eventType}
        category={categoryLabel}
        starshipId={props.starshipId}
        officerId={props.officerId}
        subjectName={props.subjectName}
        refreshOption={props.refreshOption}
        setRefresh={props.toggleRefresh}
      />
    </>
  );
}

function EventAdder(first, secound, third) {
  let total = 0;
  if (first) total += parseInt(first);
  if (secound) total += parseInt(secound);
  if (third) total += parseInt(third);
  return total;
}

function Loading() {
  return <img src={loading} className="loading" alt="loading..." />;
}

export {
  StardateConverter,
  LCARSCode,
  ButtonFormatter,
  EditCreateMenu,
  RandomButtonColour,
  buttonStack,
  EventAdder,
  Loading,
  defaultImage,
  BackToTopFunction,
  defaultShipImage,
  NumberDropDown,
  dateOptions,
  quadrants,
  starTypes,
  statusOptions,
};
