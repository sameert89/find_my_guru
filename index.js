//jshint esversion: 9
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const lodash = require('lodash');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.listen(5000, () => {
  console.log("server started at port 5000");
});
//MongoDB initialize, connect and verify
const {
  MongoClient
} = require('mongodb');
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
// Validator
async function validate(mailID) {
  var lookup = await db.collection("Mentor").countDocuments({
    email: mailID
  }, limit = 1);
  console.log(lookup);
  if (lookup != 0) {
    return false;
  }
  return true;
}
// Create Mentor Account
app.get("/apply", (req, res) => {
  res.sendFile(__dirname + "/apply.html");
});
app.post("/apply", async function(req, res) {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    validated: false
  };
  if (validate(req.body.email)) {
    const result = await db.collection("Mentor").insertOne(data);
    console.log("Hi");
    res.cookie('id', req.body.email);
    console.log("Create Account Successful");
    return res.redirect('/details');
  } else {
    console.log("failed");
    return setTimeout(() => {
      res.redirect("/apply");
    }, 1000);
  }
});

//Finish Mentor Profile
app.get("/details", (req, res) => {
  res.render('moreDetails');
});
app.post('/details', async function(req, res) {
  console.log("hi");
  let query = req.cookies['id'];
  res.clearCookie('id');
  let skills = (req.body.skills).toLowerCase();
  //converting string to array for easy lookup
  let skillArray = [];
  let temp = "";
  for (var i = 0; i < skills.length; i++) {
    if (skills[i] != " ")
      temp += skills[i];
    else {
      skillArray.push(temp);
      temp = "";
    }
  }
  let cursor = await db.collection("Mentor").updateOne({
    email: query
  }, {
    $set: {
      skills: skills,
      project1: req.body.link1,
      project2: req.body.project2
    }
  });
  res.render('success');
});
//Search Part for the user
app.get("/search", (req, res) => {
  res.render('search');
});
app.post("/search", async function(req, res) {
  let searchItem = req.body.search;
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
