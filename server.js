var express = require('express');
var app = express();
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
require('./passport')(passport);
var path = require('path');

// app.get('/', function(req, res) {
//     res.send(path.join(__dirname, 'public'));
// });

/*__dirname gives use the current directory. path.join lets us concatanate
path name and folder name in an operating system independant way */
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.get('/api/people', function (req, res) {
    res.send({this : 'is_shit'});
});

app.post('/signup', function (req, res) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err) {
            res.send({
                status: 1,
                message: err
            });
        } else if (info) {
            res.send({
                status: 1,
                message: info
            });
        } else {
            res.send({
                status: 0,
                message: 'registration successful'
            })
        }
    })(req, res);
});

app.post('/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err) {
            res.send({
                status: 1,
                message: err
            });
        }
        else if (info) {
            res.send({
                status: 1,
                message: info
            });
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    res.send({
                        status: 1,
                        message: err
                    });
                }
                res.send({
                    status: 0,
                    message: 'login successful'
                });
            });

        }
    })(req, res, next);
});

app.get('/logout', function (req, res) {
    req.logout();
    res.status(200).send('success');
});

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//app.get('port') can be used to get port dynamically
var server = app.listen(3000, function() {
    console.log('Application is running at http://localhost:' +
        server.address().port);
});
