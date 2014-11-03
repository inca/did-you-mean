'use strict';

var Levenshtein = require('levenshtein')
  , _ = require('underscore');

/**
 * Creates a fuzzy matcher.
 *
 * Usage:
 *
 * ```
 * var m = new Matcher({
 *   values: 'init install update upgrade',
 *   threshold: 4
 * });
 *
 * m.list('udpate')  // [ { value: 'update', distance: 2 }, { value: 'upgrade', distance: 4 } ]
 * m.get('udpate')   // { value: 'update', distance: 2 }
 * ```
 *
 * You can also initialize with an array or with a string directly:
 *
 * ```
 * new Matcher('init install update upgrade');
 * new Matcher(['init', 'install', 'update', 'upgrade']);
 * ```
 *
 * @param options {Object} may contain:
 *
 *   * `threshold` (number, default `2`) — maximum search distance, increase
 *     for more relaxed search
 *
 *   * `values` (array or string, default `[]`) — an array of words to match from;
 *     if a string is given, values can be separated with comma or whitespace
 *
 *   * `caseSensitive` (boolean, default `false`) — ignore case when matching
 */
var Matcher = module.exports = exports = function(options) {
  options = options || {};
  if (typeof options == 'string' || Array.isArray(options))
    options = { values: options };
  this.values = [];
  this.threshold = options.threshold || 2;

  // Try to initialize via `options.values`

  if (Array.isArray(options.values))
    this.values = options.values;
  else if (typeof options.values == 'string')
    this.values = options.values.split(/[, ]\s*/g);

  this.caseSensitive = options.caseSensitive || false;

};

/**
 * Adds values to the dictionary.
 *
 * Usage:
 *
 * ```
 * new Matcher().add('update', 'upgrade', 'delete').get('deete')
 * ```
 *
 * @returns {Matcher} this for chaining
 */
Matcher.prototype.add = function() {
  [].push.apply(this.values, arguments);
  return this;
};

/**
 * Chainable helper for settings `this.caseSensitive = false`.
 *
 * @returns {Matcher} this for chaining
 */
Matcher.prototype.ignoreCase = function() {
  this.caseSensitive = false;
  return this;
};

/**
 * Chainable helper for settings `this.caseSensitive = true`.
 *
 * @returns {Matcher} this for chaining
 */
Matcher.prototype.matchCase = function() {
  this.caseSensitive = true;
  return this;
};

/**
 * Chainable helper for settings `this.threshold`.
 *
 * @param num {Number} new threshold
 * @returns {Matcher} this for chaining
 */
Matcher.prototype.setThreshold = function(num) {
  this.threshold = num;
  return this;
};

/**
 * Calculate distance (how much difference) between two strings
 *
 * @param word1 {String} a string input
 * @param word2 {String} the other string input
 * @returns {Number} Levenshtein distance between word1 and word2
 */
Matcher.prototype.distance = function(word1, word2) {
  return new Levenshtein(word1, word2).distance;
};

/**
 * Lists all results from dictionary which are similar to `q`.
 *
 * ```
 * new Matcher({
 *   values: 'init install update upgrade',
 *   threshold: 4
 * }).list('udpdate');
 * // [ { value: 'update', distance: 2 }, { value: 'upgrade', distance: 4 } ]
 * ```
 *
 * The results are sorted by their distance (similarity). The distance of `0` means
 * a strict match.
 *
 * You can increase `threshold` for more relaxed search, or decrease it to shorten the results.
 *
 * @param q {String} — search string
 * @returns {Array} — an array of objects `{ value: String, distance: Number }`
 */
Matcher.prototype.list = function(q) {
  var m = this;
  q = q.trim();
  if (!m.caseSensitive)
    q = q.toLowerCase();
  var matches = this.values.reduce(function(results, word) {
    var d = m.distance(q, m.caseSensitive ? word : word.toLowerCase());
    if (d > m.threshold)
      return results;
    return results.concat({
      value: word,
      distance: d
    });
  }, []);
  return _(matches).sortBy('distance');
};

/**
 * Returns a single closest match (or `null` if no values from the dictionary
 * are similar to `q`).
 *
 * @param q {String} — search string
 * @returns {String} — closest match or `null`
 */
Matcher.prototype.get = function(q) {
  var closest = this.list(q)[0];
  return closest ? closest.value : null;
};
