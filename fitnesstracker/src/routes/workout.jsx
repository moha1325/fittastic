import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import './static/workout.css';
import AddEvent from './addEvent';
import ViewEvent from './viewEvent';

export default function Workout() {
  const [popupDate, setPopupDate] = useState('');
  const [startPopupTime, setStartPopupTime] = useState('');
  const [endPopupTime, setEndPopupTime] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [eventTypes, setEventTypes] = useState([]);
  const [showTypeField, setShowTypeField] = useState(false);
  const [events, setEvents] = useState([]);
  const [showError, setShowError] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/getEvents');
        const eventData = await response.json();
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  
    fetchEvents();
  }, []);
  
  

  async function handleAddEvent() {
    const types = eventTypes.map(({ type, reps, sets }) => ({ type, reps, sets }));
    const startTimeString = `${popupDate}T${startPopupTime}:00`;
    const endTimeString = `${popupDate}T${endPopupTime}:00`;
    const newEvent = {
        title: newEventTitle,
        start: startTimeString,
        end: endTimeString,
        allDay: false,
        extendedProps: {
            notes: newEventNotes,
            types: types
        }
    };

    try {
        const response = await fetch('/api/addWorkoutEvent', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            const body = await response.json();
            setShowError(true);
            setErrorMessage(body.error);
        } else {
            const responseBody = await response.json();
            const insertedId = responseBody.id;
                console.log("Inserted ID:", insertedId);
                const updatedNewEvent = {
                    ...newEvent,
                    id: insertedId 
                };
                const eventsArray = events.concat(updatedNewEvent);
                setEvents(eventsArray);
                setNewEventTitle('');
                setPopupDate('');
                setStartPopupTime('');
                setEndPopupTime('');
                setNewEventNotes('');
                setEventTypes([]);
                setShowError(false);
                setShowTypeField(false);
       
        }
    } catch (error) {
        console.error('Error adding event:', error);
    }
}



  async function handleDeleteEvent(eventToDelete) {
    console.log(eventToDelete);

    let param = eventToDelete.extendedProps._id
    if (!param){
      param = eventToDelete.id
    }
    try {
      const response = await fetch(`/api/deleteEvent/${param}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  

      const updatedEvents = events.filter(event => event._id !== eventToDelete.extendedProps._id);
      console.log(events)
      setEvents(updatedEvents);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
  
  
  
  const closeAddEventPopup = () => {
    setShowAddEventPopup(false);
  };
  

  const handleTypeChange = (index, field, value) => {
    const updatedTypes = [...eventTypes];
    updatedTypes[index][field] = value;
    setEventTypes(updatedTypes);
  };

  const handleDeleteType = (index) => {
    const updatedTypes = [...eventTypes];
    updatedTypes.splice(index, 1);
    setEventTypes(updatedTypes);
  };

  const handleAddType = () => {
    if (!showTypeField) {
      setShowTypeField(true);
    }
    const updatedTypes = [...eventTypes];
    updatedTypes.push({ type: '', reps: '', sets: '', showRepsSets: false });
    setEventTypes(updatedTypes);
  };

  const renderEventContent = (eventInfo) => {
    const startTime = new Date(eventInfo.event.start).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    const endTime = new Date(eventInfo.event.end).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    return (
      <div className="event-render">
        <div><b>{startTime} - {endTime}</b></div>
        <div><i>{eventInfo.event.title}</i></div>
      </div>
    );
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  const handleDateClick = (arg) => {
    const calendarApi = arg.view.calendar;
    const currentView = calendarApi.view.type;
    if (currentView === 'dayGridMonth') {
      calendarApi.gotoDate(arg.date);
      calendarApi.changeView('timeGridWeek');
    } else if (currentView === 'timeGridWeek') {
      calendarApi.gotoDate(arg.date);
      calendarApi.changeView('timeGridDay');
    }
  };
  

  return (
    <div className="workout-container">
      <div className="workout-main">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
        />
      </div>

      <div className="sidebar">
        <div className='padding'></div>
        {showInstructions && (
          <div className="instructions">
            <p>Click on an event to see more details!</p>
            <p><button onClick={handleCloseInstructions}>Close Instructions</button></p>
          </div>
        )}
        {selectedEvent && (
          <ViewEvent
            event={selectedEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
        {!showAddEventPopup && (
          <button className="show-add-event" onClick={() => setShowAddEventPopup(true)}>Add Event</button>
        )}
        {showAddEventPopup && (
          <AddEvent
            showError={showError}
            errorMessage={errorMessage}
            newEventTitle={newEventTitle}
            setNewEventTitle={setNewEventTitle}
            popupDate={popupDate}
            setPopupDate={setPopupDate}
            startPopupTime={startPopupTime}
            setStartPopupTime={setStartPopupTime}
            endPopupTime={endPopupTime}
            setEndPopupTime={setEndPopupTime}
            showTypeField={showTypeField}
            eventTypes={eventTypes}
            handleTypeChange={handleTypeChange}
            handleDeleteType={handleDeleteType}
            handleAddType={handleAddType}
            newEventNotes={newEventNotes}
            setNewEventNotes={setNewEventNotes}
            handleAddEvent={handleAddEvent}
            onClose={closeAddEventPopup}
          />
        )}
      </div>
    </div>
  );
}
