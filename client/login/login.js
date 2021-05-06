var Service = {
    origin: "http://localhost:3000/login",
    getLoginPage: function(username){
        return fetch(this.origin + '/' + username + '/' + 'info').then(
            (response) => {
                console.log("this.origin" +this.origin);
                console.log(username);
                console.log(response);
                if(response.status === 200)
                    return Promise.resolve(response.json());
                else{
                    return response.text().then((text) => {throw new Error(text);});
                }
            }
        ).catch(
            (err) => {
                console.log(err);
                return Promise.reject(err);
            }
        );
    }
}

function check() {
    let password = document.getElementById("password").value;
    let username = document.getElementById("username").value;
    if (Service.getLoginPage(username)[0] === password) {
        document.getElementById("results").innerHTML = "All good you can login"
    } else {
        document.getElementById("results").innerHTML = "wrong password"
    }
}