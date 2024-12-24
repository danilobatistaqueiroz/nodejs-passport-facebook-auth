var passport = require('passport');
var FacebookStrategy = require('passport-facebook');

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET'],
    callbackURL: 'https://www.renderer.com/danilo/oauth2/redirect/facebook'
  },
  function(accessToken, refreshToken, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      'https://www.facebook.com',
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      if (!cred) {
        // The Facebook account has not logged in to this app before.  Create a
        // new user record and link it to the Facebook account.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }
      
          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            'https://www.facebook.com',
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id.toString(),
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The Facebook account has previously logged in to the app.  Get the
        // user record linked to the Facebook account and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
    };
  }
));


function verify(username, password, done) {
  warning(username,password);
  if(!username && !password) done("Username and password must be provided")
  if(!username || username.length === 0) done('Username not provided')
  if(username.length < 3) done('Username minimum length must be at least 3 characters')
  if(!password || password.length === 0) done('Password not provided')
  if(password.length < 8) done('Password minimum length must be at least 8 characters')
  if (!(username=="joke" && password=="joke123456")) {
    return done(null, false, { message: 'Incorrect username or password.' });
  }
  return done(null, {username:"joke",id:"1"});
}

let count = 1
printData = (req, res, next) => {
  console.log("\n===========PRINT=DATA===================")
  console.log(`count -------->  ${count++}`)
  console.log(`req.headers.authorization -------> ${req.headers.authorization}`) 
  console.log("=============PRINT=DATA==================\n")

  next()
}

module.exports = {verify,printData};