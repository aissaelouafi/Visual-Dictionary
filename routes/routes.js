module.exports = function(app, passport) {
  // Route test
  app.get('/',function(req,res){
    res.render('index.ejs');
  })

  app.get('/topic',function(req,res){
    res.render('topic_details.ejs');
  })

  app.get('/login',function(req,res){
    res.render('login.ejs',{message : req.flash('login Message')});
  })

  app.get('/profile',isLoggedIn,function(req,res){
    res.render('profile.ejs',{
      user : req.user
    })
  })

  app.get('/live',isLoggedIn,function(req,res){
    res.render('/views/live/live.ejs',{
      user : req.user
    })
  })

  app.get('/topic',function(req,res){
    res.render('topic.ejs');
  })


  app.post('/login',passport.authenticate('local-login',{
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }))

  app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
  })

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
      return next();
    res.redirect('/login');
  }
}
