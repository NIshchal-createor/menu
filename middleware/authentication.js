const JWT = require("jsonwebtoken");
const AuthModel = require("./../auth/model");
const authorize = function (req, res, next) {
  let token;
  if (req.headers["authorization"]) token = req.headers["authorization"];
  if (req.headers["x-access-token"]) token = req.headers["x-access-token"];
  if (req.query["token"]) token = req.query["token"];
  if (!token) {
    console.log("token is", token);
    return next({
      msg: "Authentication Failed, Token Not Provided",
      status: 401,
    });
  }

  // token available now validate
  token = token.split(" ")[1];

  JWT.verify(token, "fsajhfdaosfh", function (err, done) {
    if (err) {
      return next(err);
    }
    // console.log('token verfication successfull', done);
    // add client information in request when passing control

    AuthModel.findOne(
      {
        _id: done._id,
      },
      function (err, user) {
        // console.log("inside fsajbfj")
        if (err) {
          return next({
            msg: "user already removed",
            status: 400,
          });
        }
        if (!user) {
          return next({
            msg: "action denied, user removed",
          });
        }
        // console.log("user is",user)
        req.user = done;
        next();
      }
    );
  });
};
module.exports = authorize;
