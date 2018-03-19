const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async')
const fs = require('fs');

var obj = 'http://sports.sina.com.cn/nba/1.shtml';
var urls = [];
var pages = [];
var b = 0;
superagent.get(obj, function (err, res) {
  if (err) {
    console.error(err)
  }
  var $ = cheerio.load(res.text);
  $('#right a').each(function () {
    var url = $(this).attr('href');
    urls.push(url);
  })

  async.mapLimit(urls, 5, function (href, callback) {
    superagent.get(href, function (err, res) {
      if (err) {
        cnsole.log(err)
      }
      var $ = cheerio.load(res.text);
      var page = $('.img_wrapper img').attr('src');
      pages.push(page);
      callback(null)
      console.log(pages.length)
    })
  }, function () {
    async.mapLimit(pages, 5, function (pass, callback) {
      var a = /http:/;
      if (!(a.test(pass))) {
        pass = 'http:' + pass;
      }
      b += 1;
      var ge = pass.substr(-4, 4)
      var request = superagent.get(pass);
      var po = fs.createWriteStream('./imagas/' + b + ge);
      request.pipe(po);
      console.log(b + ge + '下载中')
      callback(null)
    })
  })

})