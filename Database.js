/*
Database library, used for function calls to db
*/

const { outFormat } = require('oracledb');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const dbConfig = {
  user: 'ora_neroyu',
  password: 'a13530332',
  connectString: 'localhost:1522/stu',
}
/*
If politicianID not specified, return all politicians
*/
async function getPoliticians(politicianID) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(politicianID == undefined){
      result = await connection.execute(`SELECT * FROM Politician`);
    }
    else{
      result = await connection.execute(`SELECT * FROM Politician WHERE PoliticianID = :politicianID`, [politicianID]);
    }
    //console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
async function getPoliticiansByName(firstName, lastName) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(firstName == undefined || lastName == undefined){
      result = await connection.execute(`SELECT * FROM Politician`);
    }
    else{
      console.log(firstName + " " + lastName);
      result = await connection.execute(`SELECT * FROM Politician WHERE FirstName = :firstName AND LastName = :lastName `, [firstName, lastName]);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}

async function getPoliticiansByParty(partyName) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(partyName == undefined){
      result = await connection.execute(`SELECT * FROM Politician`);
    }
    else{
      console.log("partyName=" + partyName);
      //result = await connection.execute(`SELECT * FROM Politician WHERE FirstName = :firstName AND LastName = :lastName `, [firstName, lastName]);
      result = await connection.execute(`SELECT * FROM Politician WHERE PartyName= :partyName`, [partyName]);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}

async function getPoliticiansByRating(rating) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(rating == undefined){
      result = await connection.execute(`SELECT * FROM Politician`);
    }
    else{
      console.log("rating=" + rating);
      //result = await connection.execute(`SELECT * FROM Politician WHERE FirstName = :firstName AND LastName = :lastName `, [firstName, lastName]);
      result = await connection.execute(`SELECT COUNT(PoliticianID), PartyName FROM Politician WHERE Rating= :rating GROUP BY PartyName`, [rating]);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
async function getPoliticiansByHighRating(highRating) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(highRating == undefined){
      result = await connection.execute(`SELECT * FROM Politician`);
    }
    else{
     
      //result = await connection.execute(`SELECT * FROM Politician WHERE FirstName = :firstName AND LastName = :lastName `, [firstName, lastName]);
      result = await connection.execute(`SELECT COUNT(PoliticianID), PartyName FROM Politician WHERE Rating>= :highRating GROUP BY PartyName HAVING COUNT(PoliticianID) >= 2`, [highRating]);

    }
    console.log("results=" + result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
/*
get all articles that mention politian with politicianID polID
*/
async function getArticles(polID){
  let connection
  try{
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT a.ArticleURL, a.Author, a.Headline FROM Articles a INNER JOIN Mentions m ON a.ArticleURL = m.ArticleURL where m.PoliticianID = :polID`,
    [polID] , {});
    return result;
  } catch (err){
    throw (err);
  } finally {
    if(connection){
      try{
        await connection.close();
      } catch (err){
        throw (err);
      }
    }
  }
}

/*
Add politician, rating is set to 0 by default
*/
async function addPolitician(politicianid,party, fname, lname) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`INSERT INTO Politician VALUES (:id, :party, :fname, :lname, :rating)`,
      [politicianid, party,fname, lname, '0']
    );
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}

/*
Add a Party
*/
async function addParty(partyName, foundedYear, politicalLeaningScore){
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`INSERT INTO Party VALUES ( :partyName, :foundedYear, :politicalLeaningScore)`,
      [partyName, foundedYear, politicalLeaningScore]
    );
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}

async function login(username) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(username == undefined){
      result = '';
    }
    else{
      result = await connection.execute(`SELECT Password FROM Accounts WHERE UserID =:username`, [username]);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
async function removeURL(url) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(url == undefined){
      throw (err);
    }
    else{
      result = await connection.execute(`DELETE FROM Articles WHERE ArticleURL =:url`, [url]);
      // result = await connection.execute(`DELETE FROM Articles WHERE ArticleURL ='https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney'`);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
async function findArticle() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    result = await connection.execute(`SELECT * FROM Articles A WHERE NOT EXISTS((SELECT P.PoliticianID FROM Politician P) MINUS (SELECT M.PoliticianID FROM Mentions M WHERE M.ArticleURL = A.ArticleURL))`);
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
async function removeID(id) {
  let connection;
  
  try {
    console.log("in databse=" + connection);
    connection = await oracledb.getConnection(dbConfig);
   
    let result;
    if(id == undefined){
      throw new Error(`undefined` );
    }
    else{
      result = await connection.execute(`DELETE FROM Politician WHERE PoliticianID =:id`, [id]);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
async function updatePartyLeaning(score, description) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    if(description == undefined || score == undefined){
      throw new Error(`undefined` );
    }
    else{
      result = await connection.execute(`UPDATE Leaning SET PoliticalLeaning = :description WHERE PoliticalLeaningScore = :score`,[description, score]);
    }
    console.log(result);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}
// async function getPartyByName(pName) {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     let result;
//     if(pName == undefined){
//       result = await connection.execute(`SELECT * FROM Party`);
//     }
//     else{
//       result = await connection.execute(`SELECT * FROM Party WHERE PartyName=:pName`,[pName]);
//     }
//     console.log(result);
//     return result;
//   } catch (err) {
//     throw (err);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         throw (err);
//       }
//     }
//   }
// }
/*
Make sure to export all functions you want visible to other files
*/

//get all politicans who have a better rating than the average rating of the politicians in their respective party
//for Nested Aggregation with Group By
async function getBestPoliticians() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let result = await connection.execute(`SELECT Pol.FirstName, Pol.LastName, Pol.PartyName, Pol.Rating FROM (SELECT P.PartyName, AVG (P.Rating) AS avgrating FROM Politician P GROUP BY P.PartyName) Temp, Politician Pol WHERE Temp.PartyName = Pol.PartyName AND Pol.Rating >= Temp.avgrating
    `);
    return result;
  } catch (err) {
    throw (err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        throw (err);
      }
    }
  }
}

module.exports = {
  getPoliticians: getPoliticians,
  addPolitician: addPolitician,
  addParty: addParty,
  getPoliticiansByName: getPoliticiansByName,
  getPoliticiansByParty: getPoliticiansByParty,
  getPoliticiansByRating: getPoliticiansByRating,
  login: login,
  removeURL: removeURL,
  findArticle:findArticle,
  removeID:removeID,
  updatePartyLeaning:updatePartyLeaning,
  // getPartyByName: getPartyByName,
  getArticles:getArticles,
  getBestPoliticians:getBestPoliticians,
  getPoliticiansByHighRating : getPoliticiansByHighRating
}
