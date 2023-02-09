const Post = require("../models/post");
const User = require('../models/user');
module.exports.home = async (req, res) => {

    //convert home controller action to async await

    try {
        let posts = await Post.find({}).populate('likes').populate('user').populate({
            //populate the comments inside the post, and inside each comment, populate the user as well (nested populate)
            path: 'comments',
            populate: {
                path: 'user',
                path: 'likes'
            },
        }).sort({ createdAt: -1 });

        let users = await User.find({});

        return res.render('home', {
            title: 'Social Media Home',
            posts_list: posts,
            all_users: users
        });
    } catch (error) {
        console.log(`Error occured with ${error}`);
        return res.redirect('back');
    }




    // Post.find({})
    //     .populate('user')
    //     .populate({
    //         //populate the comments inside the post, and inside each comment, populate the user as well (nested populate)
    //         path: 'comments',
    //         populate: {
    //             path: 'user'
    //         }
    //     }).exec(function (err, posts) {
    //         if (err) {
    //             console.log(`Error in fetching posts from the db for user`);
    //             return res.redirect('back');
    //         }

    //         User.find({}, function (err, users) {
    //             if (err) {
    //                 console.log('Err in finding users');
    //                 return res.redirect('back');
    //             }
    //             return res.render('home', {
    //                 title: 'Social Media Home',
    //                 posts_list: posts,
    //                 all_users: users
    //             });

    //         });


    //     });

}