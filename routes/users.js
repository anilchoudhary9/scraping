var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
router.post('/scrap',function(req,res){
  console.log(req.body);
  var xo = req.body.tag;
const URL_TO_START = 'https://medium.com/topic/' +xo;
const MAX_PAGES_TO_CRAWL = 15;
const MAX_REQUEST_THROTTLE = 5;
const OUTPUT_CSV_FILE = 'result.csv';

const crawler = new Crawler(MAX_PAGES_TO_CRAWL, MAX_REQUEST_THROTTLE);
crawler.crawl(URL_TO_START)
  .then((/* {foundUrls: Array<{link, text}>, crawledUrls} */ result) => {
    const newResult = { crawledUrls: result.crawledUrls };
    newResult.foundUrls = _array.uniqBy(result.foundUrls, 'link');
    return newResult;
  })
  .then(result => CsvConverter.writeToFile(OUTPUT_CSV_FILE, result.foundUrls));
});

router.get('/scrap', function(req, res) {
    // url = "https://medium.com/chris-messina/amazon-echo-show-354b93b448b5"
    url = "http://www.imdb.com/title/tt1229340/";
    request(url, function(error, response, html) {

        
// res.json(html);
        if (!error) {
        //     
            var $ = cheerio.load(html);
            console.log($['xml']);  
            // res.json(html);
             

            // var title, release, rating;
            // var json = { title: "", release: "", rating: "" };
            $['xml'].filter(function() {
                var data = $(this);
                // yoy(data);
                // console.log("here i am");
                console.log(data);
                // title = data.children().first().text();
                // console.log(title);
// title = data

                // release = data.children().last().children().text();

                // json.title = title;

            })
        }
        // console.log(data);
    //     fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

})
    // });
});
module.exports = router;
 