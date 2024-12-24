import { styled } from "uebersicht";
import { getIcalBuddyCommand, parseEvent } from "./lib/icalBuddyUtil";

// ------------------------------
// settings
// ------------------------------

// icalBuddy install path
// ($ which icalBuddy)
const icalBuddyPath = "/opt/homebrew/bin/icalBuddy";

// Show only specific calendars
// ($ icalBuddy calendars | grep '• ')
// ex:
//     const calendarList = [
//         "calendar1",
//         "calendar2",
//         "calendar3",
//     ];
const calendarList = [];

const dateFormat = "%d(%a)"; // 01(Mon)
const timeFormat = "%H:%M"; // 13:00

const eventNum = 5;
const reverseOrder = true;

const refreshFrequencyHour = 1;

const fontColor = "#dddddd";
const bgColor =
    "linear-gradient(to top, rgba(25, 25, 25, 0.9) 0%, rgba(25, 25, 25, 0.5) 80%, rgba(25, 25, 25, 0) 100%)";

const eventColorToday = "#ff871f";
const eventColorTomorrow = "#fae35f";
const eventColorDayAfterTomorrow = "#4be34f";
const eventColorFuture = "#80d9fa";

// ------------------------------
// main
// ------------------------------

export const refreshFrequency = 3600000 * refreshFrequencyHour;
export const command = getIcalBuddyCommand(icalBuddyPath, calendarList, dateFormat, timeFormat);

// root style
export const className = `
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    font-family: "Hiragino Sans", -apple-system, BlinkMacSystemFont;

    * {
        box-sizing: border-box;
        padding: 0;
        border: 0;
        margin: 0;
    }
    `;

const Wrapper = styled("div")`
    color: ${fontColor};
    position: absolute;
    overflow: hidden;
    background: ${bgColor};
    bottom: 0.2rem;
    right: 0.2rem;
    font-size: 0.6rem;
    padding: 1rem;
    margin: -1rem;
`;

const Table = styled("table")`
    width: 18rem;
    table-layout: fixed;

    td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 0.7rem;
        font-weight: 500;
    }
    td.date {
        width: 3.2rem;
        font-weight: 700;
    }
    td.time {
        width: 4.8rem;
        font-weight: 700;
    }

    tr.today td.date,
    tr.today td.time {
        color: ${eventColorToday};
    }
    tr.tomorrow td.date,
    tr.tomorrow td.time {
        color: ${eventColorTomorrow};
    }
    tr.dayAfterTomorrow td.date,
    tr.dayAfterTomorrow td.time {
        color: ${eventColorDayAfterTomorrow};
    }
    tr.future td.date,
    tr.future td.time {
        color: ${eventColorFuture};
    }
`;

export const render = (res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let main_content = [];
    const lines = res.output.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (main_content.length >= eventNum) break;

        const [eventDate, date, time, title] = parseEvent(lines[i]);
        if (!eventDate) continue;

        const diff = (eventDate - today) / 86400000;
        let tr_class = "";
        switch (Math.floor(diff)) {
            case 0:
                tr_class = "today";
                break;
            case 1:
                tr_class = "tomorrow";
                break;
            case 2:
                tr_class = "dayAfterTomorrow";
                break;
            default:
                tr_class = "future";
                break;
        }

        const resultTr = (
            <tr className={tr_class}>
                <td className="date">{date}</td>
                <td className="time">{time}</td>
                <td>{title}</td>
            </tr>
        );
        if (reverseOrder) {
            main_content.unshift(resultTr);
        } else {
            main_content.push(resultTr);
        }
    }

    return (
        <Wrapper>
            <Table>
                <tbody>{main_content}</tbody>
            </Table>
        </Wrapper>
    );
};
