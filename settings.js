// icalBuddy install path
// ($ which icalBuddy)
export const icalBuddyPath = "/opt/homebrew/bin/icalBuddy";

// Show only specific calendars
// ($ icalBuddy calendars | grep '• ')
// ex:
//     export const calendarList = [
//         "calendar1",
//         "calendar2",
//         "calendar3",
//     ];
export const calendarList = [];

export const dateFormat = "%d(%a)"; // 01(Mon)
export const timeFormat = "%H:%M"; // 13:00

export const eventNum = 5;
export const reverseOrder = true;

export const refreshFrequencyHour = 1;

export const fontColor = "#dddddd";
export const bgColor =
    "linear-gradient(to top, rgba(25, 25, 25, 0.9) 0%, rgba(25, 25, 25, 0.5) 80%, rgba(25, 25, 25, 0) 100%)";

export const eventColorToday = "#ff871f";
export const eventColorTomorrow = "#fae35f";
export const eventColorDayAfterTomorrow = "#4be34f";
export const eventColorFuture = "#80d9fa";
