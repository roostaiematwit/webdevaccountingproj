const CalendarManager = (() => {

  // A function to intialize the calendar
  function initialize() {
    document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById('calendar');
    
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          center: 'addEventButton'
        },
        customButtons: {
          addEventButton: {
            // Custom button that allows user to add an event
            text: 'add event...',
            click: function() {
              var title = prompt('Event Title:');
              var dateStr = prompt('Enter a date in YYYY-MM-DD format');
              var date = new Date(dateStr + 'T00:00:00'); // will be in local time
    
              if (!isNaN(date.valueOf())) { // valid?
                calendar.addEvent({
                  title: title,
                  start: date,
                  allDay: true
                });
                alert('Great. Your event has been added...');
              } else {
                alert('Invalid date.');
              }
            }
          }
        },
        events: [
          {
            title: "Web Dev Proj",
            start: "2023-03-15",
            end: "2023-03-17",
          },
          // more events here
        ],
      });

      calendar.render();
    });
  }


  return {
    initialize,
  };
})();
