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
    var final_obj = []
    console.log(file)
    jsonfile.readFile(file, function(err, obj) {
      if(err){
        console.log(err)
      }
      for (var i = 0; i < obj.length; i++) {
        if(obj[i]["topic"] != "INTRODUCTION" && obj[i]["topic"] != "APPENDIX" ){
          if(i == 6){final_obj.push({"topic":obj[i]["topic"],"topic_image":"contents/images/croped_images/"+obj[i]["topic"]+"/"+obj[i]["page"]+"_1.png".replace(" ","\ "),"page":obj[i]["page"]})} else
            final_obj.push({"topic":obj[i]["topic"],"topic_image":"contents/images/croped_images/"+obj[i]["topic"]+"/"+obj[i]["page"]+"_0.png".replace(" ","\ "),"page":obj[i]["page"]})
        }
      }
      return res.json(final_obj)
    })
  })

  app.get('/api/sub_topics/:topic/:image_dir',function(req,res){
    var topic = req.params.topic;
    var image_dir = req.params.image_dir;
    console.log("topic : "+topic+" image_dir : "+image_dir)
    var subtopics = []
    var file = JSON_PATH+"topics_description.json"
    file = file.replace("routes","public")
    jsonfile.readFile(file, function(err, obj) {
      if(err){
        console.log(err)
      }
      var obj_json = obj
      for (var i = 0; i < obj_json.length; i++) {
        if(obj_json[i]["topic"].replace(/\s/g, '') == topic)
          subtopics.push({"subtopic":obj_json[i]["subtopic"],"description":obj_json[i]["description"],"page":obj_json[i]["page"],"image":"contents/images/croped_images/"+image_dir+"/"+obj_json[i]["page"]+"_0.png"})
      }
      return res.json(subtopics)
    })
  })

  app.get('/api/subtopic_details/:subtopic',function(req,res){
    var subtopic = req.params.subtopic;
    console.log(subtopic)
    var subtopics_description = []
    var file = JSON_PATH+"topics_description.json"
    file = file.replace("routes","public")
    jsonfile.readFile(file, function(err, obj) {
      if(err){
        console.log(err)
      }
      var obj_json = obj
      for (var i = 0; i < obj_json.length; i++) {
        if(obj_json[i]["subtopic"].replace(/\s/g, '').toLowerCase() == subtopic.toLowerCase())
          subtopics_description.push({"subtopic":obj_json[i]["subtopic"],"topic":obj_json[i]["topic"],"description":obj_json[i]["description"],"page":obj_json[i]["page"],"image":"contents/images/croped_images/"+obj_json[i]["topic"].toUpperCase()+"/"+obj_json[i]["page"]+"_0.png"})
      }
      return res.json(subtopics_description)
    })
  })

  app.get('/api/subtopic_images/:subtopic_page/:limit',function(req,res){
    var page = req.params.subtopic_page;
    page = parseInt(page)
    var limit = req.params.limit;

    var subtopics_images = []
    var file = JSON_PATH+"splited_images_legend.json"
    file = file.replace("routes","public")
    jsonfile.readFile(file, function(err,obj){
      if(err){
        console.log(err)
      }
      var obj_json = obj;
      for (var i = 0; i < obj_json.length; i++) {
        var json_page = obj_json[i].image.split("_")[0]
        json_page = parseInt(json_page)
        if (json_page >= page && json_page < page+2){
          subtopics_images.push(obj_json[i])
        }
      }
      return res.json(subtopics_images)
    })
  })

  app.get('/api/subtopic_images/:image',function(req,res){
    var image = req.params.image;

    var subtopics_images = []
    var file = JSON_PATH+"splited_images_legend.json"
    file = file.replace("routes","public")
    jsonfile.readFile(file, function(err,obj){
      if(err){
        console.log(err)
      }
      var obj_json = obj;
      for (var i = 0; i < obj_json.length; i++) {
        if (obj_json[i].image == image+".png"){
          subtopics_images.push(obj_json[i])
        }
      }
      return res.json(subtopics_images)
    })
  })

  // // Middleware to use for all requests
/*
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

*/

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
