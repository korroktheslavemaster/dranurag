
// testing princexml

saveHtml = (url, filename) => {
  return new Promise((resolve, reject) => {
    var request = require('request');
    var fs = require('fs');
    if (!url) {
      resolve("<html><body>TEST!</body></html>")
    } else {
      console.log("sending get request")
      request.get(url, function(err, response, body) {
        console.log("got reesponse")
        // console.log(body)
        fs.writeFileSync(filename, body)
        resolve(body)
      });
    }
  })
}

module.exports = (app) => {
  app.get('/prince', function(req, res) {
    var bin = process.env.PRINCE_BIN || "node_modules/prince/prince/lib/prince/bin/prince"
    const fs = require('fs');
    var exec = require('child_process').exec;
    saveHtml(req.query.url, "test.html").then(()=> {
      var cmd = bin + " test.html -o test2.pdf"
      exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        console.log(stdout)
        console.log(error)
        console.log(stderr)
        if (error) {
          req.flash('error', error)
          res.send("NOTOK")
        }
        fs.readFile('test2.pdf', function (err,data){
          res.contentType("application/pdf");
          res.send(data);
        });
      });
    })
  })
 
  // testing docraptor

  app.get('/docraptor', function(req, res) {
    var request = require('request');
    var fs = require('fs');
    config = {
      url: 'https://docraptor.com/docs',
      encoding: null, //IMPORTANT! This produces a binary body response instead of text
      headers: {
        'Content-Type': 'application/json'
      },
      json: {
        user_credentials: "Vuh4JHZczTgYYFbECgw",
        doc: {
          // document_content: content,
          document_url: req.query.url,
          type: "pdf",
          test: true,
          // prince_options: {
          //   media:   "screen",          // use screen styles instead of print styles
          //   baseurl: "http://hello.com" // URL to use for generating absolute URLs for assets from relative URLs
          // }
        }
      }
    };

    request.post(config, function(err, response, body) {
        fs.writeFile('doc_raptor_sample.pdf', body, "binary", function(writeErr) {
          res.contentType("application/pdf");
          res.send(body);
          // fs.readFile('doc_raptor_sample.pdf', function (err,data){
            
          // });
          console.log('Saved!');
      });
    });
  })

  // testing prescription
  app.get('/prescription', function(req, res) {
    res.render('partials/prescription', {})
  })

  // testing html-pdf
  app.get('/html-pdf', function(req, res) {
    var pdf = require('html-pdf');
    var fs = require('fs');
    var options = { 
      format: 'A4',
      viewportSize: {
        width: 827,
        height: 1169
      },
      base: process.env.BASE_URL || 'http://localhost:8080',
      // HTTP Headers that are used for requests
      httpHeaders: {
        // e.g.
        "Authorization": "Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B",
        'User-Agent': "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"
      } 
    };
    saveHtml(req.query.url, "test.html")
      .then(() => {
        var html = fs.readFileSync('test.html', 'utf8');
        pdf.create(html, options).toBuffer(function(err, buffer) {
          if (err) return console.log(err);
          res.contentType('application/pdf')
          res.send(buffer)
          // console.log(res); // { filename: '/app/businesscard.pdf' }
        });
      })
  })


  // testing phantomjs directly
  

}