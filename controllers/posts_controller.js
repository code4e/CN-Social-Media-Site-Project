const Post = require("../models/post");

module.exports.create = (req, res) => {
        Post.create({
            content: req.body.content,
            user: req.user.id
        }, function(err, post){
            if(err){
                console.log('Error in creating post in db');
                return res.redirect('/');
            }

            console.log('post saved to db sucessfully');
            console.log(post);
            return res.redirect('/');
        });
}