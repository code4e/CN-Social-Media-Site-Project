const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({

    //user who sent the friend request
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //user who received the friend request
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //represents if the requests sent by the 'from_user' has been accepted or rejected by the 'to_user'
    is_pending: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;