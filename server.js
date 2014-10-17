var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var port = 8989;

var app = express();

app.use(session({secret: "sh-its-a-secret!"}));

app.use(passport.initialize());

app.use(passport.session())

passport.use(new FacebookStrategy({
  clientID: '868998239801026',
  clientSecret: '3946e6c4a3f662597fd679210305b5c8',
  callbackURL: 'http://localhost:8989/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

var requireAuth = function(req, res, next){
	console.log("auth ", req.isAuthenticated());
	if(req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/")
}


app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
	failureRedirect: "/login", 
}),
	function (req, res) {
	console.log(req.session);
	return res.redirect("/me")
});

passport.serializeUser(function(user, done){
	done(null, user)
});

passport.deserializeUser(function(obj, done){
	done(null, obj)
})

app.get("/me", function(req, res){
	console.log(req.user)
	return req.user
})


app.listen(port, function(){
	console.log("somewhere over the rainbow is port ", port)
})