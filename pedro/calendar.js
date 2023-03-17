
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      editable: true,
				eventLimit: true, // allow "more" link when too many events
				events: [
					{
						title: 'Web Dev Proj',
						start: '2023-03-15',
                        end: '2023-03-17'
					},
					// more events here
				]

    });
    
    calendar.render();
  });