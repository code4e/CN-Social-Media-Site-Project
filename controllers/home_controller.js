module.exports.home = (req, res) => {
    console.log('Home Controller called');
    return res.send('Home Controller loaded from express');
}