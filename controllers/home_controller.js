const Post = require("../models/post");
const User = require('../models/user');
const Friendship = require('../models/friendship');
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

        //find established friends
        let established_friends = await Friendship.find({
            $or: [{ 'from_user': req.user }, { 'to_user': req.user }],
            $and: [
                { is_pending: false },
            ]
        });

        // the users who I've sent friend request to
        let sent_requests = await Friendship.find({
            $or: [{ 'from_user': req.user }],
            $and: [
                { is_pending: true },
            ]
        }).populate('from_user').populate('to_user');

        // console.log(sent_requests);


        // the users who I've sent me the friend request
        let pending_friends = await Friendship.find({
            $or: [{ 'to_user': req.user }],
            $and: [
                { is_pending: true },
            ]
        }).populate('from_user').populate('to_user');



        let users = await User.find({});

        return res.render('home', {
            title: 'Social Media Home',
            posts_list: posts,
            all_users: users,
            established_friends: established_friends,
            pending_friends: pending_friends,
            sent_requests: sent_requests
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