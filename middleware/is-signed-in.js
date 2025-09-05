// middleware/is-signed-in.js

const isSignedIn = (req, res, next) => {
    console.log('issignedin')
  if (req.session.user) return next();
  res.redirect('/auth/sign-in');
};

module.exports = isSignedIn;
