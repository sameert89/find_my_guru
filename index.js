
var express = require('express');
var app = express();
var path = require('path');
var port = 3000;
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: false
}));

var cookie="";
var f=0;
app.use('/public' , express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/contact',(req,res)=>{
    res.render('contact');
});
app.post('/contact',(req,res)=>{
    res.render('contact');
});
app.get('/about', (req,res)=>{
    res.render('home');
});
app.get('/search', (req,res)=>{
    res.render('search');
});
app.get('/mentor', (req,res)=>{
    res.render('mentor');
});
app.get('/register', (req,res)=>{
    res.render('register');
});

app.post('/registered', (req,res)=>{
    cookie="ok";
    res.render('alertRegistered');
    if(f==0){
        f=1;
        cookie="";
    }

});
app.post('/submitSkills', (req,res)=>{
    var allskills=req.body;
    //console.log(allskills);
    res.render('expertise',{allskills:allskills});
});
app.post('/submitProjects', (req,res)=>{
    var allProjects=req.body;
    console.log(allProjects);
    res.render('expertise',{cookie:""});
});

app.get('/expertise', (req,res)=>{
    res.render('expertise',{allskills:""});
});
app.post('/expertise', (req,res)=>{
    var allskills=req.allskills;
    console.log(allSkills);
    res.render('expertise',{allskills:allskills});
});
app.get('/register', (req,res)=>{
    res.render('mentor');
});
app.get('*', (req,res)=>{
    res.render('home');
});

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
});
