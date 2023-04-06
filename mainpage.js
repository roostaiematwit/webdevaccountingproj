function addToTable() {
    var date = document.getElementById("date").value;
    var desc = document.getElementById("description").value;
    var emer = document.getElementById("emergency");

    var table = document.getElementById("table");
    var row = table.insertRow(-1);

    var dateCell = row.insertCell(0);
    var descCell = row.insertCell(1);
    var emerCell = row.insertCell(2);

    

    dateCell.innerHTML = date;
    descCell.innerHTML = desc;
    if(emer.checked) {
      emerCell.innerHTML = 'Yes';
    }
    else {
      emerCell.innerHTML = 'No';
    }
    
  }
  // async function fetchTickets() {
  //   const username = sessionStorage.getItem("username");
  //   const response = await fetch(`/maintenance?username=${username}`);
  //   const data = await response.json();
  //   const maintenanceTable = document.getElementById('maintenance-table').getElementsByTagName('tbody')[0];
  //   maintenanceTable.innerHTML = '';

  //   data.forEach(ticket => {
  //     const newRow = maintenanceTable.insertRow();
  //     newRow.innerHTML = `
  //       <td>${ticket.ticID}</td>
  //       <td>${ticket.date}</td>
  //       <td>${ticket.description}</td>
  //       <td>${ticket.emergency == null? "No":"Yes"}</td>
  //     `;
  //   });
  // }
  //  fetchTickets();
