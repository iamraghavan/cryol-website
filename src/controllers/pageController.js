exports.home = (req, res) => {
  res.render('pages/home', { title: 'Home - Business Website' });
};

exports.about = (req, res) => {
  res.render('pages/about', { title: 'About Us - Business Website' });
}


exports.applicationDevelopment = (req, res) => {
  res.render('pages/application-development', { title: 'Application Development - Business Website' });
}

exports.cloudServices = (req, res) => {
  res.render('pages/cloud-services', { title: 'Cloud Services - Business Website' });
} 

exports.cybersecurityServices = (req, res) => {
  res.render('pages/cybersecurity', { title: 'Cybersecurity Services - Business Website' });
}


exports.cyberForensicsServices = (req, res) => {
  res.render('pages/cyber-forensics', { title: 'Cyber Forensics Services - Business Website' });
}

exports.digitalMarketingServices = (req, res) => {
  res.render('pages/digital-marketing', { title: 'Digital Marketing Services - Business Website' });
}