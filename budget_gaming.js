var cheerio = require('cheerio');
var request = require('request');
var Rss = require('rss');

var baseUrl = 'http://www.budgetgaming.nl';
var pricingInfoUrl = baseUrl + '/index.php?page=laatsteprijsreacties';

request(pricingInfoUrl, function(err, response, body) {
    // todo: needs error handling

    var feed = new Rss({
        title: 'Budgetgaming Wii U RSS Feed',
        feed_url: pricingInfoUrl, // todo: this is not correct!
        site_url: pricingInfoUrl,
        author: 'Casper Kuijjer'
    });

    var $ = cheerio.load(body);
    var wiiuRegex = new RegExp('\(Wiiu\)');

    $('#budgetnieuws ul li')
        .filter(function() {
            return wiiuRegex.test($(this).text());
        })
        .each(function() {
            var text = $(this).text();
            var link = $(this).find('a');

            feed.item({
                title: link.text(),
                url: link.attr('href'),
                description: text,
                guid: text,
            });
        });


    var xml = feed.xml();
    process.stdout.write(xml);
});
