//be sure to add this file to .gitignore in order to not put your email and password on github
const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');


let testAccount = (async function () {
    return await nodemailer.createTestAccount();
})();

// let testAccount = nodemailer.createTestAccount();

//transport object is needed to define the config of how to send the email
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'daron.blanda@ethereal.email',
        pass: 'a7u4mvPBfhCKE4SzBU' 
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;

    //read the ejs file that has the email template defined and render the mail template html file given in the path
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) { console.log('error in rendering the template at path', path.join(__dirname, '../views/mailers', relativePath)); return; }

            mailHTML = template;
        }
    );

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
