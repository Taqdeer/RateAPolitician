var Service = {
    origin: "http://localhost:3000/articleDelete",
    getURL: function(url){

        return fetch(this.origin + '/' + url + 'info').then(
            (response) => {
                console.log("this.origin" +this.origin);
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

function performDelete(){
    let url = document.getElementById("url").value;
    document.getElementById("results").innerHTML = Service.getURL(url).value; //?
}