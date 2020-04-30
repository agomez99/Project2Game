const LocalStrategy = require('passport-local').Strategy;

module.exports = (app, passport) => {


    app.get('/dashboard', isLoggedIn, (req, res) => {
        res.render('dashboard');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');

    });

    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/dashboard'
    }));

    passport.use(new LocalStrategy(
        (username, password, done) => {
            
            if(username === 'austinegomez99@gmail.com' && password === '1234') {
                return done(null, {username: 'test@gmail.com'});
            }
            else if (username === 'marim.monzon@gmail.com' && password === '1234') {
                return done(null, {username: 'test@gmail.com'}); 
            }
            else if (username === 'jiovaniemartinez@gmail.com' && password === '1234') {
                return done(null, {username: 'test@gmail.com'}); 
            }
            else if (username === 'sierraalbright91@gmail.com' && password === '1234') {
                return done(null, {username: 'test@gmail.com'}); 
            }
            else {
                return done(null, false);
            }
        }
        
        
    ));

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        done(null, {username: username});
    }); 

    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/login');
        }
    }

};

