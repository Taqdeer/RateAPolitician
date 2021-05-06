var Service = {
    origin: "http://localhost:3000/searchRatingGroupBy",
     //returns an array of the politician data for politician with politicianID: polID
     getPolRating: function(rating){
         
      return fetch(this.origin + '/' + rating + '/' + 'info').then(
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
  
  
  function loadPolRating(){
      console.log("works")
      let search = document.getElementById("searchInput").value;
      search.trim();
      let str = '';
      Service.getPolRating(search).then((result) => {
         
          for (let i =0; i<result.length; i++){
            str += '<div class="panel panel-info">';
            str += ' <div class="panel-heading"> ' + result[i][1] + '</div>';
            str += ' <div class="panel-body"> ' + result[i][0] + '</div>';
            str+= '</div>';
          }
          document.getElementById('ratingInput').innerHTML = search;
          document.getElementById('searchResults').innerHTML += str;
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
  
  