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