const express = require('express');
const port = 8000;
const app = express();

//use express router
app.use('/', require('./routes/index'));

app.listen(port, () => console.log(`Server is up and running on port ${port}`));

// app.use((req, res, next) => {
//     // console.log('Time:', Date.now())
//     next();
// });
