const notFoundHandler = (req, res, next) => {
  res.status(404).render('404', {
    title: '404 Not Found',
    message: 'The page you are looking for does not exist.'
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);

  const statusCode = err.status || 500;
  res.status(statusCode).render('error', {
    title: 'Server Error',
    message: statusCode === 500 
      ? 'An unexpected error occurred on the server. Please try again later.'
      : err.message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
