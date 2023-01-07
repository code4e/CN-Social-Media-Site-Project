const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.create = (req, res) => {
    // console.log({
    //     ...req.body,
    //     user: req.user.id
    // });

    //save comment made by the signed in user to the db, but first check if the post that we're commenting on exists in the db or not
    Post.findById(req.body.post, function (err, post) {
        if (err) {
            console.log('Error in retrieving the post from db');
            return res.redirect('back');
        }
        if (!post) {
            console.log('Oops! post not found');
            return res.redirect('back');
        }

        //post exists, so add the comment to the db
        Comment.create({
            ...req.body,
            user: req.user.id
        }, function (err, comment) {
            if (err) {
                console.log('Error posting comment to db for this user');
                return res.redirect('/');
            }

            console.log('Comment saved to db sucessfully');
            // console.log(comment);

            // push the comment id to the post document's comments array
            post.comments.push(comment);
            post.save();

            return res.redirect('/');

            // Post.findByIdAndUpdate(comment.post, { $push: { comments: comment.id } },
            //     function (err, post) {
            //         if (err) {
            //             console.log('Error in updating post in db');
            //             return res.redirect('/');
            //         }
            //         return res.redirect('/');
            //     });
        });
    });


}