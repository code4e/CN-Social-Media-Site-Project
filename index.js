const express = require('express');
const port = 8000;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//cookie parser
app.use(cookieParser());


//body parser
app.use(bodyParser.urlencoded({ extended: true }));

// use static files middlleware and tell express where to look out for the static files
app.use(express.static('./assets'));
//use ejs layouts before rendering views to detect that layout is being used at the front end
app.use(expressLayouts);

// use ejs layout to apply styles to specific pages on top of layout styles by telling ejs that whenever it encounters a <link> tag place it in head and <script> tag at the last of body 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router
app.use('/', require('./routes/index'));

// app.get('/', (req, res) => res.send('<h1>Upppp</h1>'))

//set up the view engine and set the views
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, () => console.log(`Server is up and running on port ${port}`));

// app.use((req, res, next) => {
//     // console.log('Time:', Date.now())
//     next();
// });
