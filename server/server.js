var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

app.use(loopback.static(path.resolve(__dirname, '../client/')));
app.use(loopback.context());
app.use(loopback.token({model: app.models.accessToken}));

app.use(function setCurrentUser(req, res, next) {
    if (!req.accessToken) {
        return next();
    }
    app.models.User.findById(req.accessToken.userId, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('No user with this access token was found.'));
        }

        var loopbackContext = loopback.getCurrentContext();
        if (loopbackContext) {
            loopbackContext.set('currentUser', user);
        }
        next();
    });
});

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        console.log('Web server listening at: %s', app.get('url'));
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err)
        throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});