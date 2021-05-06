drop table Accounts CASCADE CONSTRAINTS;
drop table NormalUser CASCADE CONSTRAINTS;
drop table FactChecker CASCADE CONSTRAINTS;
drop table Comments CASCADE CONSTRAINTS;
drop table Party CASCADE CONSTRAINTS;
drop table Politician CASCADE CONSTRAINTS;
drop table Verify CASCADE CONSTRAINTS;
drop table Articles CASCADE CONSTRAINTS;
drop table Mentions CASCADE CONSTRAINTS;
drop table PresetTags CASCADE CONSTRAINTS;
drop table CommentsHasPresetTags CASCADE CONSTRAINTS;
drop table CountryOfBirth CASCADE CONSTRAINTS;
drop table Leaning CASCADE CONSTRAINTS;
drop table Mayor CASCADE CONSTRAINTS;
drop table Premier CASCADE CONSTRAINTS;
drop table Video CASCADE CONSTRAINTS;
drop table Appearance CASCADE CONSTRAINTS;

create table Party(
  PartyName VARCHAR2(50),
  FoundedYear INTEGER,
  PoliticalLeaningScore INTEGER NOT NULL,
  PRIMARY KEY (PartyName),
  UNIQUE (PoliticalLeaningScore)
);
GRANT SELECT ON Party TO PUBLIC;
INSERT INTO Party VALUES ('United Conservative Party', '2017', '4');
INSERT INTO Party VALUES ('New Democratic', '1961', '1');
INSERT INTO Party VALUES ('Saskatchewan Party', '2007', '5');
INSERT INTO Party VALUES ('Progressive Conservative', '1942', '3');
INSERT INTO Party VALUES ('Liberal', '1867', '2');

create table Politician(
  PoliticianID INTEGER,
  PartyName VARCHAR2(50) NOT NULL,
  FirstName VARCHAR2(50) NOT NULL,
  LastName  VARCHAR2(50) NOT NULL,
  Rating  INTEGER,
  PRIMARY KEY(PoliticianID),
  UNIQUE (FirstName,LastName),
  FOREIGN KEY(PartyName) REFERENCES Party
);
GRANT SELECT ON Politician TO PUBLIC;
INSERT INTO Politician VALUES ('1', 'United Conservative Party', 'A', 'A', '7');
INSERT INTO Politician VALUES ('2', 'United Conservative Party', 'B', 'B', '6');
INSERT INTO Politician VALUES ('3', 'United Conservative Party', 'C', 'C', '4');
INSERT INTO Politician VALUES ('4', 'United Conservative Party', 'D', 'D', '6');
INSERT INTO Politician VALUES ('5', 'United Conservative Party', 'E', 'E', '6');
INSERT INTO Politician VALUES ('6', 'United Conservative Party', 'Jason', 'Kenny', '7');
INSERT INTO Politician VALUES ('7', 'New Democratic', 'John', 'Horgan', '6');
INSERT INTO Politician VALUES ('8', 'Saskatchewan Party', 'Scott', 'Moe', '4');
INSERT INTO Politician VALUES ('9', 'Progressive Conservative', 'Doug', 'Ford', '6');
INSERT INTO Politician VALUES ('10', 'Liberal', 'Iain', 'Rankin', '9');
INSERT INTO Politician VALUES ('11', 'Progressive Conservative', 'Someone', 'Someone', '6');



create table Accounts(
  UserID INTEGER,
  Password  VARCHAR2(50) NOT NULL,
  PRIMARY KEY(UserID)
);

GRANT SELECT ON Accounts TO PUBLIC;
INSERT INTO Accounts VALUES ('1', 'abc');
INSERT INTO Accounts VALUES ('2', '123');
INSERT INTO Accounts VALUES ('3', '4567');
INSERT INTO Accounts VALUES ('4', 'asd');
INSERT INTO Accounts VALUES ('5', 'fff');
INSERT INTO Accounts VALUES ('7', 'abc');
INSERT INTO Accounts VALUES ('8', '123');
INSERT INTO Accounts VALUES ('9', '4567');
INSERT INTO Accounts VALUES ('10', 'asd');
INSERT INTO Accounts VALUES ('11', 'fff');

CREATE TABLE NormalUser (
    UserID  INTEGER,
    PRIMARY KEY (UserID),
    FOREIGN KEY (UserID) REFERENCES Accounts ON DELETE CASCADE
);

GRANT SELECT ON NormalUser TO PUBLIC;
INSERT INTO NormalUser VALUES ('1');
INSERT INTO NormalUser VALUES ('2');
INSERT INTO NormalUser VALUES ('3');
INSERT INTO NormalUser VALUES ('4');
INSERT INTO NormalUser VALUES ('5');

CREATE TABLE FactChecker (
    UserID  INTEGER,
    Qualification   VARCHAR2(40),
    PRIMARY KEY (UserID),
    FOREIGN KEY (UserID) REFERENCES Accounts ON DELETE CASCADE
);

GRANT SELECT ON FactChecker TO PUBLIC;
INSERT INTO FactChecker VALUES ('7', 'professional checker A');
INSERT INTO FactChecker VALUES ('8', 'professional checker B');
INSERT INTO FactChecker VALUES ('9', 'professional checker C');
INSERT INTO FactChecker VALUES ('10',  'professional checker D');
INSERT INTO FactChecker VALUES ('11', 'professional checker E');

CREATE TABLE Comments(
    NormalUserID   INTEGER ,
    CommentsTimeStamp TIMESTAMP,
    Text  VARCHAR2(280),
    CommentsRating  INTEGER NOT NULL,
    PRIMARY KEY (NormalUserId, CommentsTimeStamp),
    FOREIGN KEY  (NormalUserId) REFERENCES NormalUser(UserID) ON DELETE CASCADE
);

GRANT SELECT ON Comments TO PUBLIC;
INSERT INTO Comments VALUES ('1',to_date('20200725123722','YYYYMMDDHH24MISS'), 'John Horgan may have done great things for BC but did not do enough to stop COVID19!!!! ', '3');
INSERT INTO Comments VALUES ('2', to_date('20200725123722','YYYYMMDDHH24MISS'), 'Jason Kenny is a racist! ', '1');
INSERT INTO Comments VALUES ('3', to_date('20200725123722','YYYYMMDDHH24MISS'), 'Ford is truly a good Politician he helps us to build the pool in the community! ', '7');
INSERT INTO Comments VALUES ('4', to_date('20200725123722','YYYYMMDDHH24MISS'), 'Scott Moe wants is one of few politicians who really wants to solve global warming. ', '7');
INSERT INTO Comments VALUES ('5', to_date('20200725123722','YYYYMMDDHH24MISS'), 'Iain Rankin has been wasting tax payer''s dollars on useless initiatives. ', '2');

CREATE TABLE Verify (
    FactCheckerUserID    INTEGER,
    NormalUserID   INTEGER,
    CommentsTimeStamp  TIMESTAMP,
    Reliability  INTEGER NOT NULL,
PRIMARY KEY (FactCheckerUserId, NormalUserId, CommentsTimeStamp),
FOREIGN KEY(FactCheckerUserID) REFERENCES FactChecker (UserID) ON DELETE CASCADE,
-- FOREIGN KEY(NormalUserId) REFERENCES NormalUser (UserID) ON DELETE CASCADE,
FOREIGN KEY(CommentsTimeStamp,NormalUserId) REFERENCES Comments(CommentsTimeStamp, NormalUserID) ON DELETE CASCADE
);
GRANT SELECT ON Verify TO PUBLIC;
INSERT INTO Verify VALUES ('7','1',to_date('20200725123722','YYYYMMDDHH24MISS'), '1');
INSERT INTO Verify VALUES ('8','2', to_date('20200725123722','YYYYMMDDHH24MISS'), '1');
INSERT INTO Verify VALUES ('9', '3', to_date('20200725123722','YYYYMMDDHH24MISS'), '0');
INSERT INTO Verify VALUES ('10', '4', to_date('20200725123722','YYYYMMDDHH24MISS'), '1');
INSERT INTO Verify VALUES ('11', '5', to_date('20200725123722','YYYYMMDDHH24MISS'), '0');

create table Articles(
  ArticleURL  VARCHAR2(200) NOT NULL,
  Author  VARCHAR2(50) NOT NULL,
  Headline   VARCHAR2(200) NOT NULL,
  PRIMARY KEY(ArticleURL)
);
GRANT SELECT ON Articles TO PUBLIC;
INSERT INTO Articles VALUES ('https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney', 'Bruce Livesey', 'The Fall of Jason Kenny');
INSERT INTO Articles VALUES ('https://www.thecanadianencyclopedia.ca/en/article/john-horgan', 'Rob Shaw', 'John Horgan');
INSERT INTO Articles VALUES ('https://regina.ctvnews.ca/four-moe-years-scott-moe-and-saskatchewan-party-defeat-ndp-for-4th-straight-majority-1.5162438', 'Stephanie Taylor', 'Four Moe Years: Scott Moe and Saskatchewan Party defeat NDP for 4thstraight majority');
INSERT INTO Articles VALUES ('https://www.macleans.ca/politics/what-happened-to-the-old-doug-ford/', 'Nick Taylor-Vaisey', 'What happened to the old Doug Ford?');
INSERT INTO Articles VALUES ('https://globalnews.ca/news/7723513/doug-ford-slams-federal-procurement-covid-19-vaccines/', 'Ryan Rocca', 'Its a joke: Doug Ford slams feds COVID-19 vaccine procurement process');
INSERT INTO Articles VALUES ('https://globalnews.ca/news/7656966/iain-rankin-premier-ns/', 'Alexander Quon', 'Iain Rankin sworn-in as 29th premier of Nova');

create table Mentions(
  PoliticianID INTEGER,
  ArticleURL  VARCHAR2(200),
  PRIMARY KEY (ArticleURL, PoliticianID),
  FOREIGN KEY (ArticleURL) REFERENCES Articles ON DELETE CASCADE,
  FOREIGN KEY (PoliticianID) REFERENCES Politician ON DELETE CASCADE
);
GRANT SELECT ON Mentions TO PUBLIC;
INSERT INTO Mentions VALUES ('1', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('2', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('3', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('4', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('5', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('6', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('7', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('8', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('9', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('10', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('11', 'https://www.nationalobserver.com/2021/02/08/opinion/fall-of-jason-kenney');
INSERT INTO Mentions VALUES ('7', 'https://www.thecanadianencyclopedia.ca/en/article/john-horgan');
INSERT INTO Mentions VALUES ('8','https://regina.ctvnews.ca/four-moe-years-scott-moe-and-saskatchewan-party-defeat-ndp-for-4th-straight-majority-1.5162438');
INSERT INTO Mentions VALUES ('9','https://www.macleans.ca/politics/what-happened-to-the-old-doug-ford/');
INSERT INTO Mentions VALUES ('9', 'https://globalnews.ca/news/7723513/doug-ford-slams-federal-procurement-covid-19-vaccines/');
INSERT INTO Mentions VALUES ('10','https://globalnews.ca/news/7656966/iain-rankin-premier-ns/');

CREATE TABLE PresetTags(
    Text   VARCHAR2(30),
    NegativeOrPositive INTEGER,
    PRIMARY KEY (Text)
);
GRANT SELECT ON PresetTags TO PUBLIC;
INSERT INTO PresetTags VALUES ('Cares about the environment ','1');
INSERT INTO PresetTags VALUES ('Community Leader  ', '1');
INSERT INTO PresetTags VALUES ('Has been in scandals ', '0');
INSERT INTO PresetTags VALUES ('Made racist comments  ', '0');
INSERT INTO PresetTags VALUES ('Went back on word  ', '0');

CREATE TABLE CommentsHasPresetTags(
    PresetTagText   VARCHAR2(30),
    CommentsTimeStamp TIMESTAMP,
    NormalUserId   INTEGER,
    PRIMARY KEY (PresetTagText, CommentsTimeStamp, NormalUserId),
    FOREIGN KEY (PresetTagText) REFERENCES PresetTags(Text) ON DELETE CASCADE,
    FOREIGN KEY (CommentsTimeStamp,NormalUserID) REFERENCES Comments(CommentsTimeStamp, NormalUserID) ON DELETE CASCADE
--     FOREIGN KEY (NormalUserID)  REFERENCES NormalUser(UserID) ON DELETE CASCADE
);
GRANT SELECT ON CommentsHasPresetTags TO PUBLIC;
INSERT INTO CommentsHasPresetTags VALUES ( 'Cares about the environment ', to_date('20200725123722','YYYYMMDDHH24MISS'),'1');
INSERT INTO CommentsHasPresetTags VALUES ('Community Leader  ', to_date('20200725123722','YYYYMMDDHH24MISS'),'2');
INSERT INTO CommentsHasPresetTags VALUES ('Has been in scandals ',to_date('20200725123722','YYYYMMDDHH24MISS'), '3');
INSERT INTO CommentsHasPresetTags VALUES ('Made racist comments  ',to_date('20200725123722','YYYYMMDDHH24MISS'), '4');
INSERT INTO CommentsHasPresetTags VALUES ( 'Went back on word  ',to_date('20200725123722','YYYYMMDDHH24MISS'), '5');

-- TODO: Rating???

CREATE TABLE CountryOfBirth(
    FirstName	VARCHAR2(20),
    LastName	VARCHAR2(20),
    CountryOfBirth VARCHAR2(30),
    PRIMARY KEY (FirstName, LastName),
    FOREIGN KEY (FirstName, LastName) REFERENCES Politician(FirstName, LastName) ON DELETE CASCADE
);
GRANT SELECT ON CountryOfBirth TO PUBLIC;
INSERT INTO CountryOfBirth VALUES ('Jason', 'Kenny', 'Canada');
INSERT INTO CountryOfBirth VALUES ('John', 'Horgan', 'Canada');
INSERT INTO CountryOfBirth VALUES ('Scott', 'Moe', 'Canada');
INSERT INTO CountryOfBirth VALUES ('Doug', 'Ford', 'Canada');
INSERT INTO CountryOfBirth VALUES ('Someone', 'Someone', 'Canada');
INSERT INTO CountryOfBirth VALUES ('Iain', 'Rankin', 'Canada');

CREATE TABLE Leaning(
    PoliticalLeaningScore INTEGER,
    PoliticalLeaning    VARCHAR2(50),
    PRIMARY KEY(PoliticalLeaningScore),
    FOREIGN KEY(PoliticalLeaningScore) REFERENCES Party(PoliticalLeaningScore) ON DELETE CASCADE
--         ON UPDATE CASCADE
);
GRANT SELECT ON Leaning TO PUBLIC;
INSERT INTO Leaning VALUES ('4', 'Right-Wing ');
INSERT INTO Leaning VALUES ('1', 'Left-Wing');
INSERT INTO Leaning VALUES ('2', 'Center-left  ');
INSERT INTO Leaning VALUES ('3','Center-right ');
INSERT INTO Leaning VALUES ('5 ','Far-right');

CREATE TABLE Mayor(
    PoliticianId  INTEGER,
    City  VARCHAR2(30),
    PRIMARY KEY (PoliticianId),
    FOREIGN KEY (PoliticianId) REFERENCES Politician ON DELETE CASCADE
);
GRANT SELECT ON Mayor TO PUBLIC;
INSERT INTO Mayor VALUES ('1', 'Vancouver ');
INSERT INTO Mayor VALUES ('2', 'Toronto');
INSERT INTO Mayor VALUES ('3', 'Winnipeg  ');
INSERT INTO Mayor VALUES ('4 ','Calgary ');
INSERT INTO Mayor VALUES ('5 ','Saskatoon ');

CREATE TABLE Premier(
    PoliticianId INTEGER,
    Province VARCHAR2(30),
    PRIMARY KEY (PoliticianId),
    FOREIGN KEY (PoliticianId) REFERENCES Politician ON DELETE CASCADE
);
GRANT SELECT ON Premier TO PUBLIC;
INSERT INTO Premier VALUES ('6', 'Alberta');
INSERT INTO Premier VALUES ('7', 'British Columbia');
INSERT INTO Premier VALUES ('8', 'Saskatchewan');
INSERT INTO Premier VALUES ('9 ','Ontario');
INSERT INTO Premier VALUES ('10 ','Nova Scotia');

CREATE TABLE Video(
    VideoType VARCHAR2(20),
    VideoTitle VARCHAR2(100) UNIQUE,
    VideoURL VARCHAR2(400),
    PRIMARY KEY (VideoURL)
);
GRANT SELECT ON Video TO PUBLIC;
INSERT INTO Video VALUES ('News report ', 'Jason Kenney and the politics of Albertas COVID-19 response | At Issue ', 'https://www.youtube.com/watch?v=dHRQUlbzoHc ');
INSERT INTO Video VALUES ('News Conference ', 'British Columbia Premier John Horgan speaks with reporters in Victoria – December 2, 2020 ', 'https://www.youtube.com/watch?v=5KTXAeVfz0Q ');
INSERT INTO Video VALUES ('Speech', 'Watch Saskatchewan Premier Scott Moe’s victory speech ',  'https://www.youtube.com/watch?v=3aUNAGfq458');
INSERT INTO Video VALUES ('News report  ','Doug Ford moves key ministers in major cabinet shuffle ','https://www.youtube.com/watch?v=C9tRkoCD1Ws');
INSERT INTO Video VALUES ('escriptive video  ','Iain Rankin (Politician)', 'https://www.youtube.com/watch?v=Rb3qh2kdbT8 ');

CREATE TABLE Appearance(
    PoliticianId INTEGER,
    VideoURL   VARCHAR2(400),
    PRIMARY KEY (PoliticianId, VideoURL),
    FOREIGN KEY (PoliticianId) REFERENCES Politician ON DELETE CASCADE,
    FOREIGN KEY (VideoURL) REFERENCES Video ON DELETE CASCADE
);
GRANT SELECT ON Appearance TO PUBLIC;
INSERT INTO Appearance VALUES ('6', 'https://www.youtube.com/watch?v=dHRQUlbzoHc ');
INSERT INTO Appearance VALUES ('7', 'https://www.youtube.com/watch?v=5KTXAeVfz0Q ');
INSERT INTO Appearance VALUES ('8',  'https://www.youtube.com/watch?v=3aUNAGfq458');
INSERT INTO Appearance VALUES ('9','https://www.youtube.com/watch?v=C9tRkoCD1Ws');
INSERT INTO Appearance VALUES ('10', 'https://www.youtube.com/watch?v=Rb3qh2kdbT8 ');