var pg = require('pg')
var config = require('../config/config')
var jwt = require('jsonwebtoken') // create, sign and verify tokens
var jsonfile = require('jsonfile')
var JSON_PATH = __dirname+"/contents/json/"

module.exports = function(app, passport) {

  //Authetification (POST username,password) and return the token
  app.post('/api/authenticate',function(req,res){
    username = req.body.username;
    password = req.body.password;
    console.log(username);
    console.log(password);
    pg.connect(config.database,function(err,client,done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({success:false,data:err});
      }
      var query = client.query("SELECT * FROM Users WHERE username = '"+username+"' AND password = '"+password+"'",function(err,result){
        if(err) throw err;
        // console.log(result.rows[0].id);
        console.log(result.rowCount);

        //TODO : Verify the password and username
        if(result.rowCount == 0){
          res.json({success:false, message:'Authetification failed. Wrong credentials ! '})
        } else {
            // If the user is find with the correst password
            // Construct the token
            var token = jwt.sign({"user":username},app.get('superSecret'),{
              expiresIn : 20*60
            });
            res.json({
              success : true,
              message : 'Enjoy WebAnalysis app token ! ',
              token : token
            })
        }
      });
    });
  });


  app.get('/api/global_summary',function(req,res){
    var file = JSON_PATH+"global_summary.json"
    file = file.replace("routes","public")
    console.log(file)
    jsonfile.readFile(file, function(err, obj) {
      if(err){
        console.log(err)
      }
      return res.json(obj)
    })
  })

  app.get('/api/sub_topics/:topic',function(req,res){
    var topic = req.params.topic;
    var file = JSON_PATH+"topics_description.json"
    jsonfile.readFile(file, function(err, obj) {
      if(err){
        console.log(err)
      }
      return res.json(obj)
      console.log(obj)
    })
  })

  // // Middleware to use for all requests
  app.use('/api/*',function(req,res,next){
    console.log("Middlweware !! ");
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token){
      //Verify secret and checks exp
      jwt.verify(token,app.get('superSecret'),function(err,decoded){
        if(err){
          return res.json({success:false,message:'Failed to authenticate token !'});
        } else {
          // If everything is OK, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      })
    } else {
      return res.status(403).send({
        success:false,
        message:'No Token provided ! '
      })
    }
  })

  // Test route to make sure that everything is working
  app.get('/api',function(req,res) {
    res.json({message : 'Welcom in my API'});
  });


  // Get the list of users
  app.get('/api/users',function(req,res){
    var results = [];
    pg.connect(config.database,function(err,client,done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({success:false,data:err});
      }
      var query = client.query('SELECT username FROM Users ORDER BY username;');
      query.on('row',function(row){
        results.push(row);
      })
      query.on('end',function(){
        done();
        return res.json(results);
      })
    })
  })
}
