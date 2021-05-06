//keep all the fetchs in service for organization
var Service = {
  origin: "http://localhost:3000/bestPols",
  getAllPols: function(){
    return fetch(this.origin + `/all`).then((response)=>{
      if(response.status === 200)
        return Promise.resolve(response.json());
      else{
        return response.text().then((text)=>{throw new Error(text)});
      }
    }).catch((err)=>{console.log(err); return Promise.reject(err)});
  },
  getBestPols: function(){
    return fetch(this.origin + `/filter`).then((response)=>{
      if(response.status === 200)
        return Promise.resolve(response.json());
      else{
        return response.text().then((text)=>{throw new Error(text)});
      }
    }).catch((err)=>{console.log(err); return Promise.reject(err)});
  }
};

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

function createPolDiv(FName, LName, PartyName, Rating){
  let htmlString = `<div class='polDiv'><p><b>`
  htmlString += FName + ` ` + LName + `</b></p>`;
  htmlString += `<p><b>Party:</b> ` + PartyName + `</p>`;
  htmlString += `<p><b>Rating:</b> ` + Rating + `</p>`;
  htmlString += `</div>`;
  
  return createDOM(htmlString);
}

function fillAllPols(){
  let div = document.getElementById('pols');
  Service.getAllPols().then((result)=>{
    for(const pol of result){
      div.appendChild(createPolDiv(pol[2], pol[3], pol[1], pol[4]));
    }
  }).catch((err)=>{console.log(err);});
}

function filterPols(){
  let div = document.getElementById('pols');
  emptyDOM(div);
  Service.getBestPols().then((result)=>{
    for(const pol of result){
      div.appendChild(createPolDiv(pol[0], pol[1], pol[2], pol[3]));
    }
  }).catch((err)=>{console.log(err);});
}

var main = function(){
  //get all poltiicans and fill the div
  fillAllPols();
  //set onclick listener for filter
  document.getElementById('filter').addEventListener('click', filterPols);
}

//run main function after page loads
window.addEventListener('load', main);