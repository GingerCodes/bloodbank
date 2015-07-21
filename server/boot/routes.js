module.exports = function (app) {
    var router = app.loopback.Router();
    router.get('/ping', function (req, res) {
        res.send('pong');
    });
    router.get('/*', function (req, res) {
        res.sendFile('index.html', {root: 'client'});
    });
    app.use(router);
}