var request = require('request')
var zlib = require('zlib')
require('dnscache')({ enable: true });

// testing princexml

var _ = require('lodash')
saveHtml = (url, filename) => {
  return new Promise((resolve, reject) => {
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
      width: '827px',
      height: '1169px',
      viewportSize: {
        width: 827,
        height: 1169
      },
      zoomFactor: 10,
      base: process.env.BASE_URL || 'http://localhost:8080',
      // HTTP Headers that are used for requests
      httpHeaders: {
        // e.g.
        "Authorization": "Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B",
        'User-Agent': "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"
      } ,
      "border": {
        "top": "2in",            // default is 0, units: mm, cm, in, px 
        "right": "1in",
        "left": "1in"
      },
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

  app.get('/experiments/drugbank/products', function(req, res) {
    request({
      url: 'https://api.drugbankplus.com/v1/us/drug_names?q=' + req.query.q,
      headers: {
        'Authorization': 'f7a181c6a67483753dec1308fbe5a0c1'
      }
    }, (err, response, body) => {
      // console.log(body)
      res.json(JSON.parse(body).products)
    })
  })

  var startTime = new Date().getTime()
  app.get('/experiments/1mg/products', function(req, res) {
    var ts = Math.round((new Date().getTime() - startTime)/1000)
    var headers = {
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Accept-Language': 'en-US,en;q=0.8,en-GB;q=0.6',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://www.1mg.com/',
        'X-Requested-With': 'XMLHttpRequest',
        'Connection': 'keep-alive',
        'Cookie': 'VISITOR-ID=00f852a3-7bcb-436f-c357-7e7e99268863_acce55_1498552587; city=New%20Delhi; session=qpkejpeTRxzg-pYfaY1KVg.nqNBwCsos-NuWuKbcQkPiX20AKGFrZ2kjWRnQwZUKSrlchYu_HBSrjV1WcR5EiaOC_L4VMjgneeeSch8bR60_mdnRGDVGTFjZRXGn2rZBJCc7L0fYSMr0NKP-B-hNnLp.1498897149119.2592000000.EiBqLKNC-urBNLW-67Jipmu8PWKsRJHK-mV6JCkXkJw; nv_push_error=201; ldo_q=dg; _csrf=LctShJYaDT2vlNMRbGPNXXmH; _ga=GA1.1.1562643785.1498552590; _gid=GA1.1.747211440.1499103590; pv=1; shw_7087=1; nv_li_9433=1; shw_9433=1; _ga=GA1.2.1562643785.1498552590; _gid=GA1.2.747211440.1499103590; shw_x_9433=1; WZRK_G=2f9c2294754f446595c8d316273c9b3c; geolocation=false; ts=' + ts
    };

    var options = {
        url: 'https://www.1mg.com/api/v1/search/autocomplete?city=New%20Delhi&pageSize=20&name=' + req.query.q,
        headers: headers,
        gzip: true,
        time: true,
        forever: true,
    };
    request.get(options, (err, response, body) => {
      console.log(response.timingPhases)
      result = JSON.parse(body).result
      res.json(_.filter(result, elm => elm.pName))
    })
  })

  // testing phantomjs directly
  app.get('/experiments/1mg', function(req, res) {
    request.get("https://www.1mg.com/", (err, response, body) => {
      console.log(response.headers['set-cookie'].join(' '));
      res.send(response.headers)
    })
  })


  app.get('/experiments/healthos/medicines', function(req, res) {
    var headers = {
      'Authorization' : 'Bearer 55ad7d70367adad2c453aa02de5814898735f8addaa1b11b5e6c18f7c084f573'
    }
    var options = {
      headers: headers,
      url: 'https://www.healthos.co/api/v1/autocomplete/medicines/brands/' + req.query.q,
      time: true,
      forever: true,
    }
    request.get(options, (err, response, body) => {
      // console.log(body)
      console.log(response.timingPhases)
      // console.log(body)
      // console.log(response)
      res.json(JSON.parse(body))
    })
  })

  app.use('/experiments', function(req, res) {
    res.render('experiments' + req.path, {})
  })
}