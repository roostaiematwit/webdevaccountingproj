async function validateCredentials() {
            
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
        });

        if (response.ok) {
        const data = await response.json();
        
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('name', data.name);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('address', data.address);
        // sessionStorage.setItem('monthrent', data.monthrent.toFixed(2));

        window.location.href = "/home.html";
        } else {
        alert("Login Failed");
        }
    } catch (error) {
        alert("An error occurred while logging in. Please try again later.");
    }
}