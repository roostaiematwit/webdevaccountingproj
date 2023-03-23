function checkCreds() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if (username == "koshn" & password == "1234")
        location = 'home.html';
    else{
        alert("Wrong Username or Password");
        location = 'login.html';
    }
    return false;
}