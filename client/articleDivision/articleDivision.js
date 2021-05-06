var Service = {
    origin: "http://localhost:3000/articleDivision",
    getArticleData: function(){
        console.log("this.origin" +this.origin);
        return fetch(this.origin + '/'  + 'info').then(
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

function loadArticles(){
    Service.getArticleData().then((result) => {
        // let str= '';
        console.log(result);
        // for(let i=0; i <result.length; i++){
            // str+= '<p class="panel-heading"> headline: ' + result[i][2]+' </p>';
            // str+='<p id="author" class ="panel-body">'+ "Author: "+ result[i][1]+"<br>"+ "URL: "+ result[i][0] +'</p>';
            // str+='</div>';
            // str = '';
            //get all articles and insert articles into the article div
            let articlesDiv = document.getElementById('findResults');
            let div = createArticleDivs(result[0], result[1], result[2]);
            articlesDiv.appendChild(div);

        //
        // }
    }).catch((err) => {
        document.getElementById('findResults').innerHTML = `From JS file:Can't get article info: `;
        console.log(err);
    });
}
function createArticleDivs(articleURL, author, headline){
    let htmlString = `<a href="` + articleURL + `" target="_blank"><div class='articleDiv'>`;
    htmlString += `<p><b>` + headline + `</b><br />` + author + `</p>`;
    htmlString += `</div></a>`;
    return createDOM(htmlString);
}