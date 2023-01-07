const Post = require("../models/post");

module.exports.home = (req, res) => {
    // console.log('Home Controller called');
    // console.log(req.cookies);

    // res.cookie('user_id', 25);
    // if (!req.user) {

    //     res.render('home', {
    //         title: 'Social Media Home'
    //     });
    // }

    //fetch all posts of the current user and send them to the home page, only if the user is signed in
    // Post.find({ user: req.user.id }, function (err, posts) {
    //     if (err) {
    //         console.log(`Error in fetching posts from the db for user`);
    //         return res.redirect('back');
    //     }
    //     return res.render('home', {
    //         title: 'Social Media Home',
    //         posts_list: posts
    //     });

    // });

    Post.find({})
    .populate('user')
    .populate({
        //populate the comments inside the post, and inside each comment, populate the user as well (nested populate)
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).exec(function (err, posts) {
        if (err) {
            console.log(`Error in fetching posts from the db for user`);
            return res.redirect('back');
        }

        return res.render('home', {
            title: 'Social Media Home',
            posts_list: posts
        });
    });

}