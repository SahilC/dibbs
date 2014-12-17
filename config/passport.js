var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
	profileFields: ['id','significant_other','education','devices','third_party_id','about','work','bio','birthday','cover','email','gender','is_verified','name','name_format','website','political', 'displayName','quotes','religion','timezone', 'photos'],
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
		    newUser.facebook.significant_other=
		    newUser.facebook.education=
		newUser.facebook.devices=profile.devices
		newUser.facebook.third_party_id=profile.third_party_id
		newUser.facebook.about=profile.about
		newUser.facebook.work=profile.work
		newUser.facebook.bio=profile.bio
		newUser.facebook.birthday=profile.birthday
		newUser.facebook.cover=profile.cover
		newUser.facebook.gender=profile.gender
		newUser.facebook.is_verified=profile.is_verified
		newUser.facebook.name_format=profile.name_format
		newUser.facebook.website=profile.website
		newUser.facebook.political=profile.political
		newUser.facebook.displayName=profile.displayName
		newUser.facebook.quotes=profile.quotes
		newUser.facebook.religion=profile.religion
		newUser.facebook.timezone=profile.timezone
		newUser.facebook.photos=profile.photos
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};
