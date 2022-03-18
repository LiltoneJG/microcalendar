##############################
# Settings start

# icalBuddy install path
#     to confirm, hit this command in terminal:
#     which icalBuddy
# path = '/usr/local/bin/icalBuddy'  # Intel
path = '/opt/homebrew/bin/icalBuddy'  # M1

# Show only specific calendars
#     to show list, hit this command in terminal:
#     /usr/local/bin/icalBuddy calendars  # Intel
#     /opt/homebrew/bin/icalBuddy calendars  # M1
# calendarlist = [
#     'calendar1'
#     'calendar2'
#     'calendar3'
# ]

# Date and time format
# see: https://hasseg.org/icalBuddy/man.html
DATE_FORMAT = '%d(%a)'  # 01(Mon)
TIME_FORMAT = '%H:%M'   # 13:00

# Widget layout
POSITION = 'right'
SIDE_MARGIN = 5
BOTTOM_MARGIN = 5
HEIGHT = 65
WIDTH_SUM = 245
WIDTH_DAY = 45
WIDTH_TIME = 70
PADDING = 4
LINES = 5
REVERSE_ORDER = false

# Fonts
FONT_FAMILY = 'Helvetica'
FONT_WEIGHT = 500
FONTSIZE = 10
LINE_HEIGHT = 10

# Settings end
##############################

options = " -n -nc -npn -nrd -ea -iep 'datetime,title' -po 'datetime,title' -ps '/ $$ /' -b ' ' -df '%Y/%m/%d ## " + DATE_FORMAT + "' -tf '" + TIME_FORMAT + "' "
if calendarlist? and calendarlist.length > 0
    options = " -ic '" + calendarlist.join(',') + "' " + options

command: path + options + ' eventsToday+5'

refreshFrequency: 60 * 60 * 1000

style: """
    #{POSITION}: #{SIDE_MARGIN}px
    bottom: #{BOTTOM_MARGIN}px
    height: #{HEIGHT}px
    width: #{WIDTH_SUM}px
    font-size: #{FONTSIZE}px
    font-family: #{FONT_FAMILY}
    font-weight: #{FONT_WEIGHT}
    line-height: #{LINE_HEIGHT}px
    color: #ccc
    background: rgba(25, 25, 25, 0.5)
    #frame
        width: #{WIDTH_SUM-2*PADDING}px
        padding: #{PADDING}px
        table-layout: fixed
        position: absolute
        bottom: 0
    #content
        td
            padding: 0
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
        td.date
            width: #{WIDTH_DAY}px
        td.time
            width: #{WIDTH_TIME}px
        td.title
            width: #{WIDTH_SUM-WIDTH_DAY-WIDTH_TIME-2*PADDING-0.5*FONTSIZE}px
        .today
            td.date, td.time
                color: #ff871f
        .tomorrow
            td.date, td.time
                color: #fae35f
        .dayaftertomorrow
            td.date, td.time
                color: #4be34f
        .future
            td.date, td.time
                color: #80d9fa
"""

render: -> """
     <div>
         <table id='frame'>
            <tbody id='content'>
            </tbody>
        </table>
    </div>
"""

update: (output, domEl) ->

    today = new Date()
    today.setHours(0, 0, 0, 0)

    content = $(domEl).find('#content')
    content.empty()
    tdclass = ['date', 'time', 'title']

    lines = output.split('\n')
    for line, index in lines

        if index > LINES - 1
            break
        split_line = line.trim().split(/ \$\$ | - /g)
        if !split_line[2]?
            continue
        split_start_meta = split_line[0].split(/ ## | at /g)
        date = split_start_meta[1]
        time = split_start_meta[2] + '-' + split_line[1].replace(/\d{4}\/\d{2}\/\d{2} |## |at /g, "")
        title = split_line[2]
        display_str = [date, time, title]

        diff = (new Date(split_start_meta[0]) - today) / 86400000
        switch Math.floor(diff)
            when 0
                trclass = 'today'
            when 1
                trclass = 'tomorrow'
            when 2
                trclass = 'dayaftertomorrow'
            else
                trclass = 'future'

        tr = $('<tr>').addClass(trclass)
        if !REVERSE_ORDER
            content.append(tr)
        else
            content.prepend(tr)
        for i in [0..2]
            tr.append($('<td>').addClass(tdclass[i]).append(display_str[i]))
