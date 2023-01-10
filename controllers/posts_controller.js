const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async (req, res) => {

    //converting to async
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user.id
        });
        console.log(`Post ${post} created sucessfully!`);
        req.flash('success', 'Post created successfully');
        return res.redirect('/');
    } catch (error) {
        console.log(`Error occured with ${error}`);
        req.flash('error', 'Oops! Something went wrong! Please try again');
        return res.redirect('back');
    }

    //callback code
    // Post.create({
    //     content: req.body.content,
    //     user: req.user.id
    // }, function (err, post) {
    //     if (err) {
    //         console.log('Error in creating post in db');
    //         return res.redirect('/');
    //     }
    //     return res.redirect('/');
    // });
}

module.exports.destroy = async (req, res) => {


    //convert to async code
    try {
        //first, check if post to be deleted even exists in db or not
        let post = await Post.findById(req.params.id);
        if (post && post.user == req.user.id) {
            //if the post exists, then check if the user whose is deleting the post is the one who made the post(authorisation), if this is true, then delete that post 
            // along with the associated comments made on that post
            post.remove();

            //delete the comments on that post by finding out those comments that have been made on this post using post id, and then deleting them from db
            let comments = await Comment.deleteMany({ post: post._id });
            console.log(`Comments on this post - ${post} have all been deleted - ${comments} `);
            req.flash('success', 'Post and associated comments have been deleted successfully!');

        } else {
            req.flash('warning', 'Post does not exist, so cannot be deleted!');
            console.log('Post does not exist, so cannot be deleted!');
        }
        res.redirect('/');
    } catch (error) {
        console.log(`Error occured with ${error}`);
        req.flash('error', 'Oops! Something went wrong! Please try again');
        return res.redirect('back');
    }



    //callback code
    // //first, check if post to be deleted even exists in db or not
    // Post.findById(req.params.id, function (err, post) {
    //     if (err) {
    //         console.log('Error in fetching post from db');
    //         return res.redirect('back');
    //     }
    //     //if the post exists, then check if the user whose is deleting the post is the one who made the post(authorisation), if this is true, then delete that post 
    //     // along with the associated comments made on that post
    //     if (post && post.user == req.user.id) {
    //         //delete the post
    //         post.remove();

    //         //delete the comments on that post by finding out those comments that have been made on this post using post id, and then deleting them from db
    //         Comment.deleteMany({
    //             post: post._id
    //         }, function (err, comments) {
    //             if (err) {
    //                 console.log('Error in deleting the comments');
    //                 return res.redirect('back');
    //             }
    //             console.log(comments);
    //             return res.redirect('/');
    //         });
    //     } else {
    //         return res.redirect('/');
    //     }
    // });
}

//update the post
module.exports.update = async (req, res) => {
    //TODO
}