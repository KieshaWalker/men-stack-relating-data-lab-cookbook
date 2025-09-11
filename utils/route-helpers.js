// utils/route-helpers.js
// Provides small helper(s) to DRY up repetitive try/catch in async Express routes.

// asyncRoute wraps an async route handler and redirects on error.
// fn: the actual async (req,res,next) => { ... } handler
// errorRedirect: path to redirect to if an exception occurs
const asyncRoute = (fn, errorRedirect = '/') => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next); // run the wrapped handler
    } catch (err) {
      console.log(err); // log the error for debugging
      return res.redirect(errorRedirect); // fail-safe redirect
    }
  };
};

module.exports = { asyncRoute };
