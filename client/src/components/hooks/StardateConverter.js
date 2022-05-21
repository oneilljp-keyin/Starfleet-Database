import moment from "moment";

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

export default StardateConverter;
