"use strict";
const Promise = require('bluebird');
const scraperjs = require('scraperjs');
const _array = require('lodash/array');
const _string = require('lodash/string');

/**
 * A Scraper that scrapes a single page and gets all the links out of that page
 */
class Scraper {

  static findAllLinks(/* string */ url) {
    return Promise.resolve(
      scraperjs.StaticScraper
        .create(url)
        .scrape(Scraper._jqueryLinkExtract)
    )
      .then(data => _array.uniqBy(data, 'link'));
  }

  static _jqueryLinkExtract($) {
    return $('a').map(function extractLink() {
      const link = Scraper._cleanUrl($(this).attr('href'));
      return { link, text: $(this).text() };
    }).get();
  }

  static _cleanUrl(/* string */ url) {
    const prefixed = url.startsWith('//') ? `https:${url}` : url;
    const noHash = prefixed.split('#')[0];
    return _string.trimEnd(noHash, '/');
  }

}

module.exports = Scraper;
