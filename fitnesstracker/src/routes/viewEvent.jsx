import React from 'react';

const ViewEvent = ({ event, onClose, onDelete }) => {
  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  const date = new Date(event.start).toLocaleDateString(undefined, dateOptions);
  const startTime = new Date(event.start).toLocaleTimeString(undefined, timeOptions);
  const endTime = new Date(event.end).toLocaleTimeString(undefined, timeOptions);
  const formattedTime = `${startTime} - ${endTime}`;

  return (
    <div className="event-details-popup">
      <h1 className="event-title">{event.title}</h1>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {formattedTime}</p>

      {event.extendedProps.notes && (
        <div>
          <p><strong>Notes:</strong></p>
          <div className='notes-text'>{event.extendedProps.notes}</div>
        </div>
      )}

      {event.extendedProps.types && event.extendedProps.types.some(type => type.type) && (
        <div>
          <p><strong>Exercise(s):</strong></p>
          <ul>
            {event.extendedProps.types.map((type, index) => (
              type.type && (
                <li key={index}>
                  {type.type} 
                  {type.sets && `, ${type.sets} sets`}
                  {type.reps && `, ${type.reps} reps`}
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      <div className='view-buttons'>
        <button className="delete-event-button" onClick={() => onDelete(event)}>Delete Workout</button>
        <button className="close-event-details" onClick={onClose}>Close Details</button>
      </div>
    </div>
  );
};

export default ViewEvent;

