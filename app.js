var bodyParser = require('body-parser');
var scrap = require('cheerio');
var prettyjson = require('prettyjson');
var request = require('sync-request');
var colors = require('colors');
var fs = require('fs');

thaicharlist = ['ก', 'ข', 'ค', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ',
  'ฐ', 'ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ',
  'ภ', 'ม', 'ย', 'ร', 'ฤ', 'ล', 'ฦ', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ']

var dict = []
//
// function main() {
//   thaicharlist.forEach(function (ch) {
//     // console.log(element);
//     var req =  request('http://dict.longdo.com/page/showwordslist/' + encodeURIComponent(ch), function (err, resp, html) {
//       var parsedHTML = scrap.load(html)
//       len = parsedHTML('#contents-showup').find('p').find('a').length
//       taga = parsedHTML('#contents-showup').find('p').find('a')
//       words = []
//       for (i = 0; i < len - 1; i++) {
//         word = taga[i].children[0].data
//         words.push(word)
//         // console.log(`${taga[i].children[0].data}`)
//       }
//       dict[ch] = words
//       console.log(prettyjson.render(dict[ch]))
//     }) //request
//     console.log(req);
//
//   });
// }
// main()

function fetchWord(){
  thaicharlist.forEach(function (ch) {
    console.log(`Getting ${ch} `.red)
    var res = request('GET', 'http://dict.longdo.com/page/showwordslist/' + encodeURIComponent(ch));
    var parsedHTML = scrap.load(res.getBody('utf8'))
      len = parsedHTML('#contents-showup').find('p').find('a').length
      taga = parsedHTML('#contents-showup').find('p').find('a')

      for (i = 0; i < len - 1; i++) {

        word = taga[i].children[0].data
        if(word.indexOf('-')>0){
          console.log(`Skipping ${word}`);
          continue
        }
        if(dict.indexOf(word)<0){
          dict.push(word)
        }
        else{
          console.log(`Skipping duplicate ${word}`);
        }
      }

      console.log(`${ch} has ${len}`.blue)
  })

}
function writedic(){
  var path = 'longdo-th.txt'
  var buffer = new Buffer("some content\n");

  var stream = fs.createWriteStream(path);
  stream.once('open', function(fd) {
    dict.forEach(function (word){
      stream.write(`${word}\n`);
    })
    stream.end();
  });
}
fetchWord()
writedic()
console.log(`Dictionary is written #${dict.length} words`)
console.log("end".green);