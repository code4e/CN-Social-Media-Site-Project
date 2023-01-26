const Post = require("../../../models/post");
const User = require("../../../models/user");
const Comment = require('../../../models/comment');

//reading all posts. index is used as an action name when we want to read something
module.exports.index = async (req, res) => {
    try {
        let posts = await Post.find({}).populate('user').populate({
            //populate the comments inside the post, and inside each comment, populate the user as well (nested populate)
            path: 'comments',
            populate: {
                path: 'user',
                // select: { '_id': 1,'email':1, 'name': 1, 'avatar': 1}
            }
        }).sort({ createdAt: -1 });

        let users = await User.find({});

        //instead of sending rendered html files, we'll send an api to send all the posts
        // return res.render('home', {
        //     title: 'Social Media Home',
        //     posts_list: posts,
        //     all_users: users
        // });

        return res.status(200).json({
            message: "All posts",
            posts: posts
        });

    } catch (error) {
        console.log(`Error occured with ${error}`);
        return res.redirect('back');
    }
}


module.exports.destroy = async (req, res) => {


    //convert to async code
    try {
        //first, check if post to be deleted even exists in db or not
        let post = await Post.findById(req.query.id);
        if (post && post.user == req.user.id) {

            let postIdToBeDeleted = post.id;
            post.remove();

            //delete the comments on that post by finding out those comments that have been made on this post using post id, and then deleting them from db
            let comments = await Comment.deleteMany({ post: post._id });
            console.log(`Comments on this post - ${post} have all been deleted - ${comments} `);


            return res.status(200).json({
                message: 'Post and associated comments have been deleted successfully!'
            });


        } else {
            return res.
            // status(401).
            json({
                message: 'Post cannot be deleted!'
            });

        }



    } catch (error) {
        console.log(`Error occured with ${error}`);
        return res.json(500, {
            message: "Internal server error"
        });
    }
}