
exports.error=(req, res, next) => {
    res.status('404');
  //  res.sendFile(path.join(__dirname, 'view', 'notfound.html'))
   res.render('notfound')
}