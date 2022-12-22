module.exports.profile = (req, res) => {
    console.log('Profile ');
    return res.send('<h1>Profile from express called</h1>');
}


module.exports.posts = (req, res) => {
    console.log('Posts');
    return res.send('<h1>Posts from express called</h1>');
}