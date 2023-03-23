function checkCreds() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if (username == "koshn" & password == "1234")
        location = '/sidebar/home.html';
    else{
        alert("Wrong Password");
        location = '/login.html';
    }
    return false;
}