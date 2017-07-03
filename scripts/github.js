var page = require('webpage').create();
// page.settings.userAgent = 'sfsdfsdfs'

page.open('http://localhost:8080/prescription', function() {
  // page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0'
  page.render('github.png');
  phantom.exit();
});