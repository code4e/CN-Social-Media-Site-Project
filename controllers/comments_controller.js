const { post } = require('jquery');
const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.create = async (req, res) => {
    //convert to async code
    try {
        //save comment made by the signed in user to the db, but first check if the post that we're commenting on exists in the db or not
        let post = await Post.findById(req.body.post);
        //save the comment only if the post exists
        if (post) {
            //post exists, so add the comment to the db
            let comment = await Comment.create({
                ...req.body,
                user: req.user.id
            });
            console.log(`Comment - ${comment} has been saved to the db sucessfully`);
            // now that the comment has been saved to Comment model, push the comment id to the post document's comments array for the post on which the comment has been made
            post.comments.push(comment);
            post.save();
            req.flash('success', 'Comment posted sucessfully');
        } else {
            req.flash('warning', 'Oops! post not found');
            console.log('Oops! post not found');
        }
        return res.redirect('back');

    } catch (error) {
        console.log(`Error occured with ${error}`);
        req.flash('error', 'Oops! Something went wrong! Please try again');
        return res.redirect('back');
    }

    //callback code
    //save comment made by the signed in user to the db, but first check if the post that we're commenting on exists in the db or not
    // Post.findById(req.body.post, function (err, post) {
    //     if (err) {
    //         console.log('Error in retrieving the post from db');
    //         return res.redirect('back');
    //     }
    //     if (!post) {
    //         console.log('Oops! post not found');
    //         return res.redirect('back');
    //     }

    //     //post exists, so add the comment to the db
    //     Comment.create({
    //         ...req.body,
    //         user: req.user.id
    //     }, function (err, comment) {
    //         if (err) {
    //             console.log('Error posting comment to db for this user');
    //             return res.redirect('/');
    //         }

    //         console.log('Comment saved to db sucessfully');
    //         // console.log(comment);

    //         // push the comment id to the post document's comments array
    //         post.comments.push(comment);
    //         post.save();

    //         return res.redirect('/');
    //     });
    // });
}

//destroy comments
module.exports.destroy = async (req, res) => {
    //convert to async
    try {
        //check if the comment exists, then delete the comment from db, but also remove it from the array of comments in the post
        let comment = await Comment.findById(req.query.commentID);

        //check if comment exists and the user who made the comment is the same user who signed in, then only he can delete the comment or the current user who is signed in is 
        // the owner of the post where the comment has been made, then he can delete it as well
        if (comment && (comment.user == req.user.id || req.user.id == req.query.postUserID)) {
            //first remove the comment from Comment model in db, before deleting the comment itself, save the postID to reference to the Post model to remove
            // the comment id from the comments array as well
            let postId = comment.post;
            comment.remove();

            //remove the comment id from the comments array in the post as well.
            let post = await Post.findByIdAndUpdate(postId, 
                //pull ou the comment id from the comments array of that post
                {$pull: { comments: req.query.commentID }});

            console.log(`Comment - ${comment} has been deleted from the Post - ${post}`);
            req.flash('success', 'Comment deleted successfully!');

        } else {
            console.log('Comment not found or unauthorzied access');
            req.flash('warning', 'Comment not found or unauthorzied access');
        }
        return res.redirect('back');


    } catch (error) {
        console.log(`Error occured with ${error}`);
        req.flash('error', 'Oops! Something went wrong! Please try again');
        return res.redirect('back');
    }

    //callback code
    // //delete the comment from db, but also remove it from the array of comments in the post
    // Comment.findById(req.query.commentID, function (err, comment) {
    //     if (err) {
    //         console.log('error in retrieving comment from db');
    //         return res.redirect('back');
    //     }
    //     //check if comment exists and the user who made the comment is the same user who signed in, then only he can delete the comment
    //     if (comment && (comment.user == req.user.id || req.user.id == req.query.postUserID)) {
    //         //first remove the comment from Comment model in db
    //         let postId = comment.post;
    //         comment.remove();

    //         //remove the comment id from the comments array in the post as well.
    //         Post.findByIdAndUpdate(postId, {
    //             $pull: { comments: req.query.commentID }
    //         }, function (err, post) {
    //             if (err) {
    //                 console.log('error in fetching the post');
    //                 return res.redirect('back');
    //             }
    //             console.log(post);
    //             return res.redirect('/');
    //         });

    //     } else {
    //         return res.redirect('back');
    //     }
    // });
}

//update the comment
module.exports.update = async (req, res) => {
    //TODO
}