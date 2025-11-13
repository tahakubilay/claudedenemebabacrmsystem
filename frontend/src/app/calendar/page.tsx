'use client';

import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { CalendarEvent } from '@/types';
import ClientOnly from '@/components/ui/client-only';

// ... (imports and component definition remain the same)

const CalendarPageContent = () => {
  const { onOpen } = useModal();
  const { data: events, loading: isLoading, error, refetch } = useApi<CalendarEvent[]>('/document-management/calendar-events/');

  const handleDateClick = (arg: any) => {
    onOpen('createCalendarEvent');
  };

  const formattedEvents: EventInput[] =
    events?.map((event: any) => ({
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: !event.start.includes('T'),
    })) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Takvim</h1>
        <Button onClick={() => onOpen('createCalendarEvent')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Etkinlik Ekle
        </Button>
      </div>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="bg-white p-4 rounded-lg">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={formattedEvents}
            dateClick={handleDateClick}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
          />
        </div>
      )}
    </div>
  );
};

const CalendarPage = () => {
  return (
    <ClientOnly>
      <CalendarPageContent />
    </ClientOnly>
  );
};

export default CalendarPage;

