const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async (req, res) => {
    // console.log(req.query.id);
    try {
        let alreadyLiked = false;
        let likeable;
        //find the like from the onModel i.e. from Post/Comment
        if (req.query.likeType == "Post") {
            likeable = await Post.findById(req.query.id).populate("likes");
        } else {
            likeable = await Comment.findById(req.query.id).populate("likes");
        }

        //check if the like already exists
        let existingLike = await Like.findOne({
            user: req.user,
            likeable: req.query.id,
            onModel: req.query.likeType
        });

        //if like aready exists, then delete it
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            console.log('like deleted');
        }
        //else create it
        else {
            let newLike = await Like.create({
                user: req.user,
                likeable: req.query.id,
                onModel: req.query.likeType
            });

            likeable.likes.push(newLike._id);
            likeable.save();

            alreadyLiked = true;
            console.log('like created');
        }

        return res.status(200).json({
            message: "Like toggled",
            data: {
                alreadyLiked: alreadyLiked
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}