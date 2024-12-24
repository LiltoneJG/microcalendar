export const getIcalBuddyCommand = (icalBuddyPath, calendarList, dateFormat, timeFormat) => {
    let icalBuddyOptions = `-n -nc -npn -nrd -ea -iep 'datetime,title' -po 'datetime,title' -ps '/ $$ /' -b ' ' -df '%Y/%m/%d ## ${dateFormat}' -tf '${timeFormat}'`;
    if (calendarList.length > 0) {
        icalBuddyOptions += ` -ic '${calendarList.join(",")}' ${icalBuddyOptions}`;
    }

    return `${icalBuddyPath} ${icalBuddyOptions} eventsToday+7`;
};

export const parseEvent = (line) => {
    const split_line = line.trim().split(/ \$\$ | - /g);

    // skip all-day events
    if (!split_line[2]) {
        return [null, null, null, null];
    }

    const split_start_meta = split_line[0].split(/ ## | at /g);
    const eventDate = new Date(split_start_meta[0]);
    const date = split_start_meta[1];
    const time = split_start_meta[2] + "-" + split_line[1].replace(/\d{4}\/\d{2}\/\d{2} |## |at /g, "");
    const title = split_line[2];

    return [eventDate, date, time, title];
};
