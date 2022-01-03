//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

const path = require('path');
app.set('views',path.join(__dirname,'/dist'));
app.get('/', function (req, res) {
    res.render('index.html', { pageCountMessage : null});
});
app.get('/password', function (req, res) {
    res.render('index.html', { pageCountMessage : null});
});
app.get('/edit_profile', function (req, res) {
    res.render('index.html', { pageCountMessage : null});
});
app.get('/manage_accounts', function (req, res) {
    res.render('index.html', { pageCountMessage : null});
});
app.get('/invitations', function (req, res) {
    res.render('index.html', { pageCountMessage : null});
});
app.use(express.static('dist'));


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
