
import 'dotenv/config';
import config from 'config';
import session from 'express-session';
import passport from 'passport';
import express from 'express';

const TwitterStrategy = require('passport-twitter').Strategy;

const app = express()

// セッションへの保存と読み出し
passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((obj, callback) => {
    callback(null, obj);
});

// 認証の設定
passport.use(new TwitterStrategy({
    consumerKey: config.get('twitter.consumerKey'),
    consumerSecret: config.get('twitter.consumerSecret'),
    callbackURL: "http://127.0.0.1:8000/auth/twitter/callback"
},
// 認証後のアクション
function(accessToken, refreshToken, profile, callback) {
    process.nextTick(() => {
        console.log(profile); //必要に応じて変更
        return callback(null, profile);
    });
}));

// セッションの設定
app.use(session({
    secret: 'reply-analyzer',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// 指定のpathで認証
app.get('/auth/twitter', passport.authenticate('twitter'));

// callback後の設定
app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/login' }), function(req, res) {
    res.redirect('/'); 
});

app.listen(8000)