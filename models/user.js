const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    friendships: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friendship'
    } ]
}, {
    timestamps: true
});

//define storage for the avatar file through multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

//statics -> properties that are available on the model itself and not on individual documents (statics --> OOPS)
userSchema.statics.uploadedAvatar = multer({ storage: storage })
//only allow storage of a single avatar file for a user
.single('avatar');


userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;