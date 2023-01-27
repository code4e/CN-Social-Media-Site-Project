const nodeMailer = require('../config/nodemailer');

//send the mail to the user who just commented on someone's post -> that yes "you have commented sucessfully"
exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/comments_mailer.ejs');
    // send mail with defined transport object
    nodeMailer.transporter.sendMail({
        from: 'uuffss007@gmail.com', // sender address
        to: comment.user.email, // list of receivers (sending the mail to the person who has commented)
        subject: "New Comment Published!", // Subject line
        html: htmlString, // html body
    }, (err, info) => {
        if(err){
            console.log('Error in sedning the mail', err);
            return;
        }
        console.log(info);
        return;
    });
}