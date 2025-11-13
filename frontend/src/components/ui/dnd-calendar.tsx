
'use client'

import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const DndCalendarComponent = (props: any) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DnDCalendar
        {...props}
        localizer={localizer}
        views={Object.keys(Views).map((k) => Views[k as keyof typeof Views])}
      />
    </DndProvider>
  );
};

export default DndCalendarComponent;
