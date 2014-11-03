# Did You Mean ...

Fuzzy match a word from your list of commands or keywords in Node.js to provide
a friendly typo-safe human prompt.

You can use it in:

  * your CLI
  * a web application
  * URLs
  * etc.

## Installation

```
npm install did-you-mean
```

## Usage

```
var Matcher = require('did-you-mean');

// Create a matcher with a list of values
var m = new Matcher('init install update upgrade');

// Get the closest match
m.get('udpate');   // 'update'

// Set the threshold (the maximum Levenshtein distance)
m.setThreshold(3);

// List all matches
m.list('udpate');    // [ { value: 'update', distance: 2 }, { value: 'upgrade', distance: 3 } ]

// Set ignore case
m.ignoreCase();

// Set match case
m.matchCase();

// Add more values
m.add('merge', 'checkout', 'commit');
```