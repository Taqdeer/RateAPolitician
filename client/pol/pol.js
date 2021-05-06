//politcian for the page,
var politicianID = undefined;
//keep all the fetchs in service for organization
var Service = {
  origin: "http://localhost:3000/pol",
  //returns an array of the politician data for politician with politicianID: polID
  getPolData: function(polID){
    return fetch(this.origin + '/' + polID + '/' + 'info').then(
      (response) => {
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
  },
  getPolArticles: function(polID){
    return fetch(this.origin + '/' + polID + '/articles').then(
      (response) => {
        if(response.status === 200)
          return Promise.resolve(response.json());
        else{
          return response.text().then((text) => {throw new Error(text);});
        }
      }
    ).catch((err)=>{console.log(err);return Promise.reject(err)});
  }
};

/*
Change the display info of the politician page
*/
function displayPolInfo(polID){
  Service.getPolData(polID).then((result) => {
    let polParty = result[1];
    let polFName = result[2];
    let polLName = result[3];
    let polRating = result[4];
    document.getElementById('polName').innerHTML = polFName + ` ` + polLName;
    document.getElementById('polParty').innerHTML = polParty;
    document.getElementById('polRating').innerHTML = polRating;
  }).catch((err)=>{
    document.getElementById('polName').innerHTML = `Can't get politician with ID: ` + politicianID;
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

function createArticleDivs(articleURL, author, headline){
  let htmlString = `<a href="` + articleURL + `" target="_blank"><div class='articleDiv'>`;
  htmlString += `<p><b>` + headline + `</b><br />` + author + `</p>`;
  htmlString += `</div></a>`;
  return createDOM(htmlString);
}

function updateArticles(){
  let articlesDiv = document.getElementById('Articles');
  let newArticle;
  Service.getPolArticles(politicianID).then((result) =>{
    for(const art of result){
      newArticle = createArticleDivs(art[0], art[1], art[2]);
      articlesDiv.appendChild(newArticle);
    }
  }).catch((err)=>{
    console.log(err);
  });
}

var main = function(){
  //get politicianID from the url
  let loc = window.location.pathname;
  let urlArr = loc.split(/\//)
  politicianID = urlArr[2];

  //update display
  displayPolInfo(politicianID);

  //get all articles and insert articles into the article div
  updateArticles();
}

//run main function after page loads
window.addEventListener('load', main);