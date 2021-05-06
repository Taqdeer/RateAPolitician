const path = require('path');
const fs = require('fs');
const express = require('express');
const Database = require('./Database.js');
const { addPolitician } = require('./Database.js');

function logRequest(req, res, next){
	console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
	next();
}

const host = 'localhost';
const port = 3000;
const clientApp = path.join(__dirname, 'client');

// express app
let app = express();

app.use(express.json()) 						// to parse application/json
app.use(express.urlencoded({ extended: true })) // to parse application/x-www-form-urlencoded
app.use(logRequest);							// logging for debug

// route the pages to each respective folder
app.use('/', express.static(clientApp + `/index`, { extensions: ['html'] }));
app.use('/search', express.static(clientApp + `/search`, { extensions: ['html'] }));
app.use('/searchPartyPoliticians', express.static(clientApp + `/searchPartyPoliticians`, { extensions: ['html'] }));
app.use('/searchRatingGroupBy', express.static(clientApp + `/searchRatingGroupBy`, { extensions: ['html'] }));
app.use('/searchPolHighRating', express.static(clientApp + `/searchPolHighRating`, { extensions: ['html'] }));
app.use('/addPol', express.static(clientApp +'/addPol', { extensions: ['html'] }));
app.use('/pol/:politicianID', express.static(clientApp+'/pol', { extensions: ['html'] }));
app.use('/login', express.static(clientApp+'/login',{ extensions: ['html'] } ));
app.use('/articleDelete',express.static(clientApp+'/articleDelete',{ extensions: ['html'] } ));
app.use('/articleDivision',express.static(clientApp+'/articleDivision',{ extensions: ['html'] } ));
app.use('/deletePol',express.static(clientApp+'/deletePol',{ extensions: ['html'] } ));
app.use('/updatePoliticalLeaning',express.static(clientApp+'/updatePoliticalLeaning',{ extensions: ['html'] } ));
app.use('/bestPols',express.static(clientApp+'/bestPols',{ extensions: ['html'] } ));

app.listen(port, () => {
	console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});

/*
Add poltician page endpoints
*/
app.post('/addPol/submit-form',async (req, res) =>{
		try{
			var formData = req.body;
			//try to add a Party first since there is constraint on poltician where party must exist
			try{
				await Database.addParty(formData['party'], formData['foundedYear'], formData['politicalLeaningScore']);
			}catch(err){
				console.log(err);
			}
			//add politician
			await Database.addPolitician(formData['pid'], formData['party'], formData['fname'], formData['lname']);
		}catch(err){
			console.log(err);
		}finally{
			let politicians = await Database.getPoliticians();
			console.log(politicians);
			res.redirect('/addPol');
		}
	});

/*
Politician page Endpoints
*/

app.get('/pol/:polID/info', async (req, res)=>{
	let polID = req.params['polID'];
	Database.getPoliticians(polID).then((result)=>{
		res.json(result.rows[0]);
	})
	.catch((err) =>{throw new Error(`Can't get politician with polID:` + polID + `. ${err}`)});
});

app.get('/search/:fNameandlName/info', async (req, res)=>{

	let name = req.params['fNameandlName'];
	
	let indexToSplit = name.split("and");
	let fName = indexToSplit[0];
	let lName = indexToSplit[1];
	
	Database.getPoliticiansByName(fName,lName).then((result)=>{
		
		res.json(result.rows[0]);
		console.log(result.rows[0] + "in server")
	})
	.catch((err) =>{throw new Error(`Can't get politician from Database` )});
});

app.get('/searchPartyPoliticians/:partyName/info', async (req, res)=>{
	
	let partyName = req.params['partyName'];
	console.log(partyName);
	Database.getPoliticiansByParty(partyName).then((result)=>{
		
		res.json(result.rows);
		console.log(result.rows + "in server")
	})
	.catch((err) =>{throw new Error(`Can't get politician from Database` )});
});

app.get('/searchRatingGroupBy/:rating/info', async (req, res)=>{
	
	let rating = req.params['rating'];
	console.log(rating);
	Database.getPoliticiansByRating(rating).then((result)=>{
		
		res.json(result.rows);
		console.log(result.rows + "in server")
	})
	.catch((err) =>{throw new Error(`Can't get politician from Database` )});
});

app.get('/searchPolHighRating/:highRating/info', async (req, res)=>{
	
	let highRating = req.params['highRating'];
	console.log(highRating);
	Database.getPoliticiansByHighRating(highRating).then((result)=>{
		
		res.json(result.rows);
		console.log(result.rows + "in server")
	})
	.catch((err) =>{throw new Error(`Can't get politician from Database` )});
});

app.get('/login/:username/info', async (req, res)=>{

	let username = req.params['username'];
	Database.login(username).then((result)=>{
		res.json(result.rows);
		console.log(result.rows + "in server")
	})
		.catch((err) =>{throw new Error(`Can't login from Database` )});
});


app.get('/articleDelete/:url/info', async (req, res)=>{

	let url = req.params['url'];
	Database.removeURL(url).then((result)=>{
		res.json(result.rows[0]);
		console.log(result.rows + "in server")
	})
		.catch((err) =>{throw new Error(`Can't get url from database` )});
});

app.get('/articleDivision/info', async (req, res)=>{

	Database.findArticle().then((result)=>{
		res.json(result.rows[0]);
		console.log(result.rows + "in server")
	}).catch((err) =>{throw new Error(`Can't find Article from database` )});
});


app.get('/deletePol/:id/info', async (req, res)=>{

	let id = req.params['id'];
	Database.removeID(id).then((result)=>{
		res.json(result.rows[0]);
		console.log(result.rows + "in server")
	})
		.catch((err) =>{throw new Error(`Can't get politician id from database` )});
});

app.get('/updatePoliticalLeaning/:scoreanddescription/info', async (req, res)=>{

	let name = req.params['scoreanddescription'];
	let indexToSplit = name.split("and");
	let score = indexToSplit[0];
	let description = indexToSplit[1];

	Database.updatePartyLeaning(score,description).then((result)=>{
		console.log(result);

		res.json(result.rowsAffected);
		console.log(result.rowsAffected);
	})
		.catch((err) =>{throw new Error(`Can't get score from Database` + `. ${err}`)});
});

// app.get('/updatePoliticalLeaning/:pName/display', async (req, res)=>{
//
// 	let pName = req.params['pName'];
//
// 	Database.getPartyByName(pName).then((result)=>{
// 		console.log(result);
//
// 		res.json(result.rows);
// 		console.log(result.rows + "in server")
// 	})
// 		.catch((err) =>{throw new Error(`Can't get party from Database` + `. ${err}`)});
// });

app.get(`/pol/:polID/articles`, async (req, res)=>{
	let polID = req.params['polID'];
	Database.getArticles(polID).then((result)=>{
		res.json(result.rows);
	})
	.catch((err) => {throw(err)});
});

app.get(`/bestPols/all`, async (req, res) =>{
	Database.getPoliticians().then((result)=>{
		res.json(result.rows);
	})
	.catch((err)=>{throw (err)});
});

app.get(`/bestPols/filter`, async (req, res) =>{
	Database.getBestPoliticians().then((result)=>{
		res.json(result.rows);
	})
	.catch((err)=>{throw (err)});
});