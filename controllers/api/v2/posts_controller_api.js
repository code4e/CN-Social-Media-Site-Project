const Post = require("../../../models/post");

//reading all posts. index is used as an action name when we want to read something
module.exports.index = (req, res) => {
    console.log("users api");
    
    return res.status(200).json({
        message: "sucessfuly hit v2/users api"
    });
}