const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

// using STATIC function of express to load  static files ex. IMAGES AND STYLE.CSS
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}))

app.get('/', function(req , res){
  res.sendFile(__dirname +'/signup.html')
})

// POST  REQUEST FOR HOME ROUTE

app.post('/' , function(req , res){

  const firstName = req.body.fname;
  const lastName  = req.body.lname;
  const email = req.body.email;

  const data = {
    members:[
      {
        email_address : email,
        status : 'subscribed',
        merge_fields: {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

// post data to EXTERNAL RESOURSE
  const url =  'https://us5.api.mailchimp.com/3.0/lists/6f2eca9365';
  const options = {
    method: 'POST',
    auth: 'intakhab:299e85902add26ee6668eeba6dc5adee-us5'
  }
  const request =  https.request(url , options , function(response){

// SENDING SUCCESS AND FAILURE PAGES

    if (response.statusCode === 200){
        res.sendFile(__dirname + '/success.html');
    } else{
      res.sendFile(__dirname + '/failure.html')
    }

    response.on('data' , function(data){
        console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

// POST REQUEST FOR FAILURE ROUTE TO REDIRECT TO SIGNUP PAGES

app.post('/failure' , function(req, res){
  res.redirect('/')
});



//connecting to server

// to connect to HEROKU remove 3000 AND ADD process.env.port or both(using ||3000)
app.listen(process.env.PORT || 3000, function(){
  console.log('server is running on port 3000')
});

// setting mailchimp api

// Api Key
// 299e85902add26ee6668eeba6dc5adee-us5

//Audience
// 6f2eca9365
