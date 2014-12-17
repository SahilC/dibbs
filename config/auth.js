module.exports = {
    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_CLIENTID || '', // your App ID
        'clientSecret'  : process.env.FACEBOOK_SECRET || '', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    }
};