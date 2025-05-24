exports.home = (req, res) => {
  res.render('pages/home', { title: 'Home - Business Website' });
};

exports.about = (req, res) => {
  res.render('pages/about', { title: 'About Us - Business Website' });
}