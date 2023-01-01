
module.exports.home = (req, res) => {
    console.log('Home Controller called');
    console.log(req.cookies);

    res.cookie('user_id', 25);
    // return res.send('Home Controller loaded from express')
    res.render('home', {
        title: 'Social Media Home'
    });
}