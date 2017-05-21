"use strict";
const Promise = require('bluebird');
const _array = require('lodash/array');
const debug = require('debug')('crawler');
const Scraper = require('./scraper');

/**
 * A crawler that crawls the given site with the given number of pages
 */
class Crawler {

  constructor(/* number */ maxPages, /* number */ requestThrottle) {
    this.foundUrls = [];
    this.crawledUrls = {};
    this.crawledSize = 0;
    this.chunkIndex = 0;
    this.maxPages = maxPages;
    this.requestThrottle = requestThrottle;
  }

  /**
   * Starts crawling   
   */
  crawl(/* string */ url) {
    return this._crawl(url)
      .then(() => this._crawlChunkWise())
      .then(() => ({ foundUrls: this.foundUrls, crawledUrls: this.crawledUrls }));
  }

  _crawl(url) {
    const isMediumLink = url.startsWith('https://medium.com');
    if (this.crawledUrls[url] || this.crawledSize >= this.maxPages || !isMediumLink) {
      return Promise.resolve([]);
    }

    debug(`start crawling : ${url}`);

    return Scraper.findAllLinks(url)
      .tap(() => this.crawledUrls[url] = true)
      .tap(() => this.crawledSize++)
      .then(urlObjects => this.foundUrls = this.foundUrls.concat(urlObjects))
      .then(() => debug(`finished crawling : ${url}`));
  }
 _crawlChunkWise() {
    const chunks = _array.chunk(this.foundUrls, this.requestThrottle);
    if (this.chunkIndex >= chunks.length) return Promise.resolve();
    return Promise.map(chunks[this.chunkIndex++], item => this._crawl(item.link))
      .then(() => this._crawlChunkWise());
  }

}

module.exports = Crawler;
