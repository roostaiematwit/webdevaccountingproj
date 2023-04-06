
function getUsername (){
    const username = sessionStorage.getItem("username");
    console.log(username);
    return username;
}



function loadInfo(){
    const username = sessionStorage.getItem("username");
    const name = sessionStorage.getItem("name");
    const address = sessionStorage.getItem("address");

    if (username) {
    document.getElementById("username-display").textContent = name;
    document.getElementById("address").textContent = address;
    } else {
    window.location.href = "/login.html";
    }
}
async function getRent() {
    const username = sessionStorage.getItem("username");

    try {
    const response = await fetch(`/getRent?username=${username}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();

        if (data.monthrent) {
            sessionStorage.setItem("monthrent", data.monthrent.toFixed(2));
            document.getElementById("balance-due").textContent = "$" + data.monthrent.toFixed(2);
        } 
        else if (data.monthrent == 0) {
            sessionStorage.setItem("monthrent", 0);
            document.getElementById("balance-due").textContent = "$" + data.monthrent.toFixed(2);
        }
        else{
            document.getElementById("balance-due").textContent = "ERROR";
        }
    } else {
        alert("No payment found");
    }
    } catch (error) {
    alert("An error occurred while retrieving rent information. Please try again later.");
    }
}
function redirectToMakePayment() {
    const monthrent = parseFloat(sessionStorage.getItem("monthrent"));
  
    if (monthrent > 0) {
      window.location.href = "./makepayment.html";
    } else {
      alert("Your rent balance is already zero. No payment is required.");
    }
  }
async function fetchMaintenanceTickets() {
    const username = sessionStorage.getItem("username");
    const response = await fetch(`/maintenance?username=${username}`);
    const data = await response.json();
    const maintenanceTable = document.getElementById('maintenance-table').getElementsByTagName('tbody')[0];
    maintenanceTable.innerHTML = '';

    data.forEach(ticket => {
    const newRow = maintenanceTable.insertRow();
    newRow.innerHTML = `
        <td>${ticket.ticID}</td>
        <td>${ticket.date}</td>
        <td>${ticket.description}</td>
        <td>${ticket.emergency == null? "No":"Yes"}</td>
    `;
    });
}
async function fetchPayments() {
    const username = sessionStorage.getItem("username");
    const response = await fetch(`/payments?username=${username}`);
    const data = await response.json();
    const paymentsTable = document
      .getElementById("payments-table")
      .getElementsByTagName("tbody")[0];
    paymentsTable.innerHTML = "";

    data.forEach((payment) => {
      const newRow = paymentsTable.insertRow();
      newRow.innerHTML = `
      <td>$${payment.amount}</td>
      <td>${payment.date}</td>
    `;
    });
  }
  