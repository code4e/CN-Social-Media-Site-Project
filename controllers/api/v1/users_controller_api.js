const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

// fetch the data of signed in user, i.e. create a new session for the user
module.exports.createSession = async (req, res) => {
    //whenever create session request is received, we need to find if the user(email) exists in db and generate the corresponding json web token
    try {
        let user = await User.findOne({ email: req.body.email });
        // console.log("passwords are - ", req.body.password);
        if (!user || req.body.password != user.password) {
            //status code 422 means there is an invalid input by the user
            return res.status(422).json({
                message: "Invalid username/password"
            });
        }else{
            return res.status(200).json({
                message: "Signed in sucessfully! Here is your token, please keep it safe.",
                data: {
                    //generate jwt token and send it the user after encrypting it with our secret key
                    token: jwt.sign({
                        data: user.toJSON()
                      }, 'codial', { expiresIn: '1h' })
                }
            });
        }
    } catch (error) {
        console.log(`Error occured with ${error}`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }



}