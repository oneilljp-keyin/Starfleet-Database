import moment from "moment";

function StardateConverter(stardate) {
  const TNGStardate = stardate;
  const TNGYear = parseInt(TNGStardate.slice(0, 2));
  const TNGDayIndex = parseFloat(TNGStardate.slice(2)) / 1000;

  let TNGDay;

  // year 1 will be 2364-41 = 2323
  const newYear = 2323 + TNGYear;
  if (newYear % 4 === 0) {
    TNGDay = 366 * TNGDayIndex;
  } else {
    TNGDay = 365 * TNGDayIndex;
  }

  const startDate = newYear + "-01-01";
  const newDate = moment(startDate, "YYYY-MM-DD")
    .add(parseInt(TNGDay), "days")
    .format("YYYY-MM-DD");

  return newDate;
}

export default StardateConverter;
