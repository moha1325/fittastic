import React from 'react';

const AddEvent = ({
  showError,
  errorMessage,
  newEventTitle,
  setNewEventTitle,
  popupDate,
  setPopupDate,
  startPopupTime,
  setStartPopupTime,
  endPopupTime,
  setEndPopupTime,
  showTypeField,
  eventTypes,
  handleTypeChange,
  handleDeleteType,
  handleAddType,
  newEventNotes,
  setNewEventNotes,
  handleAddEvent,
  onClose,
}) => {
  return (
    <div className="popup">
       <button className="close-add" onClick={onClose}>Close Tab</button> 
       <h2 className='add-header'>Add New Workout</h2>
      {showError && (
        <div className="error-popup">
          {errorMessage}
        </div>
      )}
      <input
        className="title-field"
        type="text"
        value={newEventTitle}
        placeholder="Enter Workout Title..."
        onChange={(e) => setNewEventTitle(e.target.value)}
        required
      />
        <hr className="divider" />
      <label>Date:</label>
      <input
        type="date"
        value={popupDate}
        onChange={(e) => setPopupDate(e.target.value)}
        required
      />
      <div className="time-container">
        <label>Start Time:</label>
        <input
          type="time"
          value={startPopupTime}
          onChange={(e) => setStartPopupTime(e.target.value)}
          required
        />
        <label>End Time:</label>
        <input
          type="time"
          value={endPopupTime}
          onChange={(e) => setEndPopupTime(e.target.value)}
          required
        />
      </div>
      <label>Notes:</label>
      <textarea
        value={newEventNotes}
        placeholder="Type Here..."
        onChange={(e) => setNewEventNotes(e.target.value)}
      />

  
      <hr className="divider" />
      
      {showTypeField && (

          <div className="addExerciseTypes">
          {eventTypes.map(({ type, reps, sets}, index) => (
  
            <div key={index}>
              <input
                type="text"
                value={type}
                placeholder="Exercise Name"
                onChange={(e) => handleTypeChange(index, 'type', e.target.value)}
              />
              <div className="repsAndSets">
                <input
                  type="number"
                  min="1"
                  value={sets}
                  placeholder="Sets"
                  onChange={(e) => handleTypeChange(index, 'sets', e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={reps}
                  placeholder="Reps"
                  onChange={(e) => handleTypeChange(index, 'reps', e.target.value)}
                />
              </div>
              <button className='delete-type-button' onClick={() => handleDeleteType(index)}>Delete Exercise</button>
              <hr className="divider" />
            </div>
          ))}
          <button className="add-type-button" onClick={handleAddType}>Add Exercise</button>
          </div>

        
      )}
      {!showTypeField && (
        <button className="add-type-button" onClick={handleAddType}>Add Exercise</button>
      )}
           <hr className="divider" />

        <button className="addToCalendar" onClick={handleAddEvent}>Add to Calendar</button>
    </div>
  );
};

export default AddEvent;

