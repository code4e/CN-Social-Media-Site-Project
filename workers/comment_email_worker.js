//worker to handle worker for sending emails sent when someone drops a comment on mail
const queue = require('../config/kue');
//the call of the comments mailer needs to go inside the queue
const commentsMailer = require('../mailers/comments_mailer');

//whenever a new task is added to the queue, run the code inside the process fn
queue.process(
    //name of the queue
    'emails'
    , function(job, done){

        console.log('Email is in the queue ', job.data);

        commentsMailer.newComment(job.data);
        done();

});