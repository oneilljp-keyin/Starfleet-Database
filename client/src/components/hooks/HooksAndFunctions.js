import { useState } from "react";

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

  // year 1 will be 2364-41 = 2323
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

function EventAdder(first, secound, third) {
  let total = 0;
  if (first) total += parseInt(first);
  if (secound) total += parseInt(secound);
  if (third) total += parseInt(third);
  return total;
}

function LCARSCode(firstPart, secondPart) {
  let first = randomString({ length: firstPart, letters: false });
  let second = randomString({ length: secondPart, letters: false });
  return first + "-" + second;
}

function ButtonFormatter(buttonActive, colour, modalType, btnLabel, btnCategory, isAuth) {
  console.log(buttonActive, colour, modalType, btnLabel, btnCategory, isAuth);
  const { isShowingModal, toggleModal } = UseModal();

  const type = btnLabel;
  const category = btnCategory;
  const modal = modalType;

  let buttonClass = "lcars_btn all_square " + colour + "_btn d-flex flex-column px-1";
  return (
    <>
      <button
        className={buttonClass}
        disabled={buttonActive}
        onClick={() => {
          toggleModal();
        }}
      >
        <div className="text-start" style={{ fontSize: "1rem", paddingLeft: "8px" }}>
          {buttonActive ? { category } : "\u00A0"}
        </div>
        <div className="text-end" style={{ fontSize: "10px" }}>
          {LCARSCode(3, 6)}
        </div>
      </button>
      <ModalLauncher
        modal={modal}
        isShowing={isShowingModal}
        hide={toggleModal}
        isAuth={isAuth}
        type={type}
        category={category}
      />
    </>
  );

  // {starship.maintenanceCount || starship.missionCount || starship.firstContactCount
  //   ? ButtonFormatter(true, "beige", "list", "Complete Chronology", "Chronology")
  //   : ButtonFormatter(false, "beige")}
}

export { StardateConverter, EventAdder, LCARSCode, ButtonFormatter };
