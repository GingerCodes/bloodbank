var loopback = require('loopback');
var ObjectId = require('mongodb').ObjectID;
module.exports = function (Request) {
    Request.observe('before save', function fillUserId(ctx, next) {
        console.log("Here");
        var context = loopback.getCurrentContext();
        var currentUser = context && context.get('currentUser');
        var userid = currentUser.id.toString()
        console.log(currentUser.id.toString());
        console.log(typeof userid);
        ctx.instance.user_id = new ObjectId(userid);
        console.log(ctx.instance);
        next();
    });
};
