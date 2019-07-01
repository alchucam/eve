import React from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment, { calendarFormat } from "moment";

import '!style-loader!css-loader!./BoardCalendar.css';
import events from './events.json';

const localizer = momentLocalizer(moment);

const CalendarStyle = styled.div`
display: flex;
`;


function updateEvents(eventData){
  eventData = eventData.map(event => ({"title": event.subject, "start": event.start, "end": event.end}));
  for (var i = 0; i < eventData.length; i++){
    eventData[i].start = localizeTime(eventData[i].start.dateTime, eventData[i].start.timeZone);
    eventData[i].end = localizeTime(eventData[i].end.dateTime, eventData[i].end.timeZone);
    eventData[i].title = AddTimetoTitle(eventData[i].title, eventData[i].start);
  }
  console.log(eventData);
  return eventData;
}

function localizeTime(time, timezone){
  return new Date(time.split("T") + " " + timezone);
}

function AddTimetoTitle(title, time){
  var regexRule = /\d{2}:\d{2}/;
  return regexRule.exec(time) + " " + title;
}


//date: inclusive:exclusive. month needs to be -1
class BoardCalendar extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      events: updateEvents(events.value)
    };
  }

  render() {
    updateEvents(events.value);
    return (
      <div>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "55vh" }}
        />
      </div>
    );
  }
}

export default BoardCalendar;
