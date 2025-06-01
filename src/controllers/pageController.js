exports.home = (req, res) => {
  res.render('pages/home', { title: 'Home - Business Website' });
};

exports.about = (req, res) => {
  res.render('pages/about', { title: 'About Us - Business Website' });
}

// exports.notFound = (req, res) => {
//   res.status(404).render('pages/404', { title: '404 - Page Not Found' });
// };

exports.applicationDevelopment = (req, res) => {
  res.render('pages/application-development', { title: 'Application Development - Business Website' });
}

exports.cloudServices = (req, res) => {
  res.render('pages/cloud-services', { title: 'Cloud Services - Business Website' });
} 