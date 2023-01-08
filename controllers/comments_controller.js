const { post } = require('jquery');
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

//destroy comments
module.exports.destroy = (req, res) => {
    // {
    //     commentID: '63bb0b6ea936db4d28d3a432',
    //     postUserID: '63b325470fa8abb7924721d5'
    //   }
    // console.log(req.params.id);
    //delete the comment from db, but also remove it from the array of comments in the post
    Comment.findById(req.query.commentID, function(err, comment){
        if(err){
            console.log('error in retrieving comment from db');
            return res.redirect('back');
        }
        //check if comment exists and the user who made the comment is the same user who signed in, then only he can delete the comment
        if(comment && (comment.user == req.user.id || req.user.id == req.query.postUserID)){
            //first remove the comment from Comment model in db
            let postId = comment.post;
            comment.remove();

            //remove the comment id from the comments array in the post as well.
            Post.findByIdAndUpdate(postId, {
                $pull: { comments: req.query.commentID} 
            }, function(err, post){
                if(err){
                    console.log('error in fetching the post');
                    return res.redirect('back');
                }
                console.log(post);
                return res.redirect('/');
            });

        }else{
            return res.redirect('back');
        }
    });
}