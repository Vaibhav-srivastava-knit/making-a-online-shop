exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404',isAuthenticated: false});
};
<<<<<<< HEAD
exports.get500 = (req, res, next) => {
  res.status(500).render('500', { pageTitle: 'Page Not Found', path: '/500',isAuthenticated: false});
};
=======
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
