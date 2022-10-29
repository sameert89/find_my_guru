var express = require('express');
var app = express();
var path = require('path');
var port = 3000;
var cookie="ok";
var f=0;
app.use('/public' , express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/contact',(req,res)=>{
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
    
    res.render('expertise' ,{cookie:cookie});
    if(f==0){
        f=1;
        cookie="";
    }

});
app.get('/expertise', (req,res)=>{
    res.render('expertise');
});
app.get('*', (req,res)=>{
    res.render('home');
});
app.get('/register', (req,res)=>{
    res.render('mentor');
});
app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
});