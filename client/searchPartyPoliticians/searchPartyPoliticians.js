var Service = {
  origin: "http://localhost:3000/searchPartyPoliticians",
   //returns an array of the politician data for politician with politicianID: polID
   getPartyPoliticianData: function(partyName){
	console.log("this.origin" +this.origin);
    return fetch(this.origin + '/' + partyName + '/' + 'info').then(
      (response) => {
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


function loadPartyPolitician(){
	console.log("works")
	let search = document.getElementById("searchInput").value;
	search.trim();
	Service.getPartyPoliticianData(search).then((result) => {
		let str= '';
		for(let i=0; i <result.length; i++){
			str+= '<div class="panel panel-info">';
			str+= '<div class="panel-heading"> Name: ' + result[i][2] + " " + result[i][3]+' </div>';
			str+='<div id="rating" class ="panel-body">'+ "Rating: "+ result[i][4]+"<br>"+ "Party Name: "+ result[i][1] +'</div>';
			str+='</div>';
			str+="</div>"
		}
		
		document.getElementById('searchResults').innerHTML = str;
	}).catch((err) => {
		document.getElementById('searchResults').innerHTML = `From JS file:Can't get politician info: `;
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

