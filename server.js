const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//for allowing sue of partial hbs content
hbs.registerPartials(__dirname+'/views/partials');
//custom middlewares
app.use((request, response, next)=>{
  //logger as a middle ware to log the timing of server requests
  var currentTime = new Date().toString()
  var log = `${currentTime}:${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile('serverlog.txt',log+'\n',(err)=>{
    if(err){
      console.log('Server error in writing log');
    }
  });
  //sends the control to next handlers and continues the process of setting up and starting the server
  next();
});
app.use((request, response, next)=>{
  response.render('maintenance.hbs');
  //NO next() called to halt process here
});
//to allow some static content to user
app.use(express.static(__dirname+'/public'));

//hbs template helpers
hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});
hbs.registerHelper('bigtext',(text)=>{
  return text.toUpperCase();
});


//viewing engine for dynamic websites
app.set('view engine','hbs');
//rendering tempate
app.get('/about',(request, response)=>{
  response.render('about.hbs',{
    titleText: 'About page',
  });
});


//http listener/handler for root route
app.get('/',(request, response)=>{
  //brute reply
  //response.send('<h1>Welcome</h1>');
  response.render('home.hbs',{
    titleText:'Home Page',
    welcomeMessage: 'Welcome to my website.'
  });
});
//http listener/handler for /json route
app.get('/json',(request, response)=>{
  response.send({
    name:'rishabh',
    age:25,
    job:'programmer'
  });
});


//start listening by binding on port 3000
app.listen(3000,()=>{
  console.log('server is up on port 3000');
});
