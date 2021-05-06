var Service = {
    origin: "http://localhost:3000/updatePoliticalLeaning",
    //returns an array of the politician data for politician with politicianID: polID
    getLeaningData: function(score,description){

        return fetch(this.origin + '/' + score +'and'+ description + '/' + 'info').then(
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
    // ,
    // displayPartyData: function(pName){
    //
    //     return fetch(this.origin + '/' + pName + '/' + 'display').then(
    //         (response) => {
    //             console.log("this.origin" +this.origin);
    //             console.log(response);
    //             if(response.status === 200)
    //                 return Promise.resolve(response.json());
    //             else{
    //                 return response.text().then((text) => {throw new Error(text);});
    //             }
    //         }
    //     ).catch(
    //         (err) => {
    //             console.log(err);
    //             return Promise.reject(err);
    //         }
    //     );
    // }
}

/*
Change the display info of the politician page
*/


function updateLeaning(){
    let score = document.getElementById("score").value;
    let description = document.getElementById("leaning").value;

    Service.getLeaningData(score,description).then((result) => {
        if (result === 1) {
            document.getElementById('results').innerHTML = 'update complete'
        } else {
            document.getElementById('results').innerHTML = 'unable to update'
        }
    }).catch((err) => {
        document.getElementById('results').innerHTML = `Can't get update `;
    });
}

// function displayParty(){
//     let pName = document.getElementById("name").value;
//
//     Service.displayPartyData(pName).then((result) => {
//         document.getElementById('partyName').innerHTML = result[0];
//         document.getElementById('foundedYear').innerHTML = result[1];
//         document.getElementById('PoliticalLeaningScore').innerHTML = result[2];
//     }).catch((err) => {
//         document.getElementById('results').innerHTML = `Can't display `;
//     });
// }

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

//document.getElementById("searchPoliticians").addEventListener("click", loadPolitician);

