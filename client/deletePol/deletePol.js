var Service = {
    origin: "http://localhost:3000/deletePol",
    deleteID: function(id){

        return fetch(this.origin + '/' + id + '/' + 'info').then(
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
    let id = document.getElementById("id").value;
    Service.deleteID(id).then((result) => {
        document.getElementById('results').innerHTML = 'Delete successful'
    }).catch((err)=>{
        document.getElementById('results').innerHTML = `Can't get politician with ID: ` + id;
    });
}

//helper functions for manipulating DOM
// Removes the contents of the given DOM element (equivalent to elem.innerHTML = '' but faster)
function emptyDOM (elem){
    while (elem.firstChild) elem.removeChild(elem.firstChild);
}

// Creates a DOM element from the given HTML string
//e.g var contentDiv = createDOM(`<div class="content"> </div>`); document.getElementById('contentHolderDiv').appendChild(contentDiv);
function createDOM (htmlString){
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}