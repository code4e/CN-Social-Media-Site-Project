const express = require('express');
const port = 8000;
const app = express();

//use express router
app.use('/', require('./routes/index'));

//set up the view engine and set the views
app.set('view engine', 'ejs');
app.set('views', './views')

app.listen(port, () => console.log(`Server is up and running on port ${port}`));

// app.use((req, res, next) => {
//     // console.log('Time:', Date.now())
//     next();
// });
