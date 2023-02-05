const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    //defines objectId of the liked object (could be Post and Comment, dynamic reference)
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,

        //the dynamic reference can only be these two fields and not any other
        enum: ['Post', 'Comment']
    }

}, {
    timestamps: true
});


const Like = mongoose.model('Like', likeSchema);

module.exports = Like;