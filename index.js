const express = require('express');
const port = 8000;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');

//require passport local strategy for authentication using session cookies
const passportLocal = require('./config/passport-local-strategy');

//require passport jwt strategy for authentication using JWT
const passportJWT = require('./config/passport-jwt-strategy');


//require passport google oauth2 stragegy for setting up google oauth login
const passportGoogleOAuth2 = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');


//connect flash for flash messages. Sending flash message when the user signs in in the locals with the session cookie, only for the first time and then clear it on subsequent requests
const flash = require('connect-flash');
const customFlashMWare = require('./config/flash_middleware');


//cookie parser
app.use(cookieParser());


//putting the sass middleware before the server server starts, to convert the scss to css and make that css available to the views
app.use(sassMiddleware({
    //where to pick up the scss files to convert to css
    src: './assets/scss',
    //where to put the compiled css files
    dest: './assets/css',
    debug: false,
    outputStyle: 'exptended',
    //where to look out for the css files
    prefix: '/css'
}));

//body parser
app.use(bodyParser.urlencoded({ extended: true }));



// use static files middlleware and tell express where to look out for the static files
app.use(express.static('./assets'));


// make the /uploads route available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//use ejs layouts before rendering views to detect that layout is being used at the front end
app.use(expressLayouts);

// use ejs layout to apply styles to specific pages on top of layout styles by telling ejs that whenever it encounters a <link> tag place it in head and <script> tag at the last of body 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



// app.get('/', (req, res) => res.send('<h1>Upppp</h1>'))

//set up the view engine and set the views
app.set('view engine', 'ejs');
app.set('views', './views');


//use the session middleware
app.use(session({
    name: 'codial',
    //change the secret key to be a complex one when going prod mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,

    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/codial_development',
        autoRemove: 'disabled' // Default
    }),
    cookie: {
        maxAge: (1000 * 60 * 100),
    },

}));


app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use connect-flash MW after using session MW so that the session has already been estalibshed and cookies have been defined by the time we're sending out the flash message(s)
// this is because connect-flash uses session cookie to store the flash message(s)
app.use(flash());

app.use(customFlashMWare.setFlash);



//use express router
app.use('/', require('./routes/index'));





app.listen(port, () => console.log(`Server is up and running on port ${port}`));


