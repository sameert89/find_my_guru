//jshint esversion: 9

//Node Module Configurations

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const lodash = require('lodash');
const cookieParser = require('cookie-parser');
const {
  MongoClient
} = require('mongodb');
app.use(cookieParser());
app.use('/public', express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


// Server Start

app.listen(5000, () => {
  console.log("server started at port 5000");
});

//Additional Function Definitions

// MongoDB initializer function

const uri = "mongodb+srv://nitraipur:SyntaxTerror@mentorfinder.zy2aosa.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const db = client.db("Mentors");

async function run() {
  try {
    await client.connect();
    await client.db("Mentors").command({
      ping: 1
    });
    console.log("Connected successfully to server");

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// GET paths

// General GET paths

// HOMEPAGE
app.get('/', (req, res) => {
  res.render('home');
});

// Error Page
// app.use(function(req, res, next) {
//   res.status(404).render('error');
// });

// Mentor Specific GET Paths

// Create Mentor Account
app.get("/mentor", (req, res) => {
  res.render('mentor');
});

//Finish Mentor Profile i.e. Adding more details
app.get("/expertise", (req, res) => {
  res.render('expertise', {
    allskills: []
  });
});

// Mentor Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Mentee Specific GET paths

app.get("/search", (req, res) => {
  res.render('search');
});

// Post Functions

//Mentor Specific POST Functions

//Create New Mentor Account

app.post("/mentor", async function(req, res) {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    validated: false
  };
  // Duplicate Check
  var lookup = await db.collection("Mentor").countDocuments({
    email: req.body.email
  }, limit = 1);

  if (lookup == 0) {
    const result = await db.collection("Mentor").insertOne(data);
    console.log("Hi");
    res.cookie('id', req.body.email);
    console.log("Create Account Successful");
    return res.redirect('/expertise');
  } else {
    console.log("failed");
    return setTimeout(() => {
      res.redirect("/mentor");
    }, 1000);
  }
});

// Finish Mentor Profile i.e. add details POST function

app.post('/submitSkills', async (req, res) => {
  let query = req.cookies['id'];

  let skillArray = Object.values(req.body);
  for(var i = 0 ; i < 3 ; i++){
    skillArray.pop();
  }
  skillArray.forEach((element, index, array)=>{
    array[index] = (lodash.camelCase(element)).toLowerCase();
  });
  let project1 = req.body.project1;
  let project2 = req.body.project2;
  let project3 = req.body.project3;
  let cursor = await db.collection("Mentor").updateOne({
    email: query
  }, {
    $set: {
      skills: skillArray,
      project1: project1,
      project2: project2,
      project3: project3
    }
  });
  //On success
  res.render('alertRegistered', {url: "mentor", myMessage: "You have been registered successfully, wait for your verification!"});
});

//Mentor Login POST function
app.post('/login', async function(req, res){
  var lookup = await db.collection("Mentor").countDocuments({
    email: req.body.email,
    password: req.body.password
  }, limit = 1);
  if(lookup == 0){
    res.render('alertRegistered', {url: "login", myMessage: "Invalid email/password please try again!"});
  }
  else{
    res.redirect('/dashboard');
  }
});

// Mentee Specific post functions

// Search Mentor by Name or skills

app.post("/search", async function(req, res) {
  let searchItem = lodash.startCase(req.body.search);
  //Search the name of the mentor or search for skills
  let sch = await db.collection("Mentor").countDocuments({
    name: searchItem
  }, limit = 1);
  if (sch != 0) {
    //The user searched for name
    let srch = await db.collection("Mentor").find({
      name: searchItem
    }).toArray();
    console.log("This is not supporsed to happen" + srch);
    res.render('searchResult', srch);
  } else {
    //The user searched for skills
    //find the the matching mentors and add them into the array;
    srch = await db.collection("Mentor").find().toArray();
    console.log(srch);
    var display = [];
    srch.forEach((mentor) => {
      if (mentor.skills != undefined) {
        for (var i = 0; i < mentor.skills.length; i++) {
          if (mentor.skills[i] == searchItem) {
            display.push(mentor);
          }
        }
      }
    });
    console.log(display);
    res.render('searchResult', display);
  }
});

app.post('/search',(req,res)=>{
    var search=req.body;
    console.log(search);
    var mentors={
        "m1" : {
        "name":"Palash",
        "email":"palash9914",
        "skills":"gfg asd asdf wrgv sdih asdgils asdgilhsdl iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
        "project1" : "projecta",
        "project2" : "projectb",
        "project3" : "projectc",
        },
        "m2" : {
            "name":"Sameer",
            "email":"sam123",
        "skills":"lc asd asdf wrgv sdih asdgils asdgilhsdl",
        "project1" : "projectx",
        "project2" : "projecty",
        "project3" : "projectz", 
            }  
    }
    console.log(mentors);
    console.log("234234324");
    res.render('display',{mentors:mentors});
});
//I dont know what this is
// app.post('/registered', async function(req, res) {
//   let query = req.cookies['id'];
//   res.clearCookie('id');
//   let skills = (req.body.skills).toLowerCase();
//   //converting string to array for easy lookup
//
//   res.render('success');
// });
// app.get("/route/:variable", (req, res)=>{
//   let recieved_name = req.params.variable;
// });
