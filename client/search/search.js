var Service = {
  origin: "http://localhost:3000/search",
   //returns an array of the politician data for politician with politicianID: polID
   getPoliticianData: function(fName, lName){
	   
    return fetch(this.origin + '/' + fName +"and"+ lName + '/' + 'info').then(
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

/*
Change the display info of the politician page
*/


function loadPolitician(){
	console.log("works")
	let search = document.getElementById("searchInput").value;
	search.trim();
	let nameArray = search.split(" ");
	let firstName = nameArray[0];
	let lastName = nameArray[1];
	Service.getPoliticianData(firstName, lastName).then((result) => {
		document.getElementById('rating').innerHTML = result[4];
		document.getElementById('partyName').innerHTML = result[1];
		document.getElementById('firstName').innerHTML = result[2];
		document.getElementById('lastName').innerHTML = result[3];
	}).catch((err) => {
		document.getElementById('searchResults').innerHTML = `Can't get politician info: `;
    	console.log(err);
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

//document.getElementById("searchPoliticians").addEventListener("click", loadPolitician);

