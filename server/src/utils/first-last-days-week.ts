import moment from "moment";

const getDate = (day: String) => {
  const currentDate = new Date(moment().toISOString());
  const currentDay = currentDate.getDay();
  const diff =
    day === "first"
      ? currentDate.getDate() - currentDay + (currentDay == 0 ? -6 : 1)
      : currentDate.getDate() - currentDay + (currentDay == 0 ? -6 : 1) + 6;

  const dateWithDiff = new Date(currentDate.setDate(diff));

  const date =
    day === "first"
      ? new Date(
          `${dateWithDiff.getFullYear()}/${dateWithDiff.getMonth() +
            1}/${dateWithDiff.getDate()}`
        )
      : new Date(
          `${dateWithDiff.getFullYear()}/${dateWithDiff.getMonth() +
            1}/${dateWithDiff.getDate()}  23:59:59`
        );

  return date;
};

export const getFirstDay = () => getDate("first");

export const getLastDay = () => getDate("last");
