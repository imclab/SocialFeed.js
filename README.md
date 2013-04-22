SocialFeed.js
===

Easily create a feed with your latest interactions on different social media. 
SocialFeed.js was inspired by the compiled feed on http://gnab.org/, and was designed to be very modular and plugable.

![SocialFeed.js](https://github.com/mikaelbr/SocialFeed.js/raw/master/screenshot.png "Screenshot of SocialFeed.js")

At this moment the following social sites are supported:

* Github
* Disqus
* Delicious

However, expading SocialFeed.js is a simple task. See [Expading SocialFeed.js](#expanding-socialfeedjs) for more information.


## Installation & Usage

### Requirements

* [jQuery](http://jquery.com/) 
* [Underscore](http://underscorejs.org/)

### Install

Installing SocialFeed.js is simple. Just download the raw [JavaScript file](https://raw.github.com/mikaelbr/SocialFeed.js/master/build/socialfeed.min.js) and
optionally the [CSS file](https://raw.github.com/mikaelbr/SocialFeed.js/master/build/socialfeed.min.css).

Import all dependancies and the SocialFeed.js code.

```
<html>
  <head>
    <title>SocialFeed.js</title>
    <link rel="stylesheet" type="text/css" href="build/socialfeed.min.css">
  </head>
  <body>
    <div id="socialfeed"></div>
    <!-- Import Scripts -->
    <script src="components/jquery/jquery.js"></script>
    <script src="components/underscore/underscore.js"></script>
    <script src="build/socialfeed.min.js"></script>
  </body>
</html>
```

### Usage

SocialFeed.js is very modular, and every different social site is implemented as it's own module. By default, no social site is added, 
you have to explicitly add every social function. This to be as customizable as possible. 

Let's see how we can add Github and Delicious as a part of the feed (using the template as defined above.):

```javascript
var sfeed = new SocialFeed($("#socialfeed"))
                  .addModule(new SocialFeed.Modules.Github('mikaelbr')) // argument: username
                  .addModule(new SocialFeed.Modules.Delicious('mikaelbr')) // argument: username
                  .start();
```

This will populate the ```#socialfeed``` element when data from both of the social sites are loaded. 

Note, if you omit the ```start()```. Nothing will happen. ```SocialFeed()``` waits until explicitly told to initiate. 

Disqus requires a public API key to access data, so we have an extra argument when adding the module:
```javascript
var sfeed = new SocialFeed($("#socialfeed"))
                  .addModule(new SocialFeed.Modules.Disqus('mikaelbr', 'OEMdBc63xd0MZGKiVV5JgExTqdO7OSYkjgv613LJ8Py89y44pcoSKeBrelZjepVS'))
                  .start();
```

## API

```SocialFeed``` exposes several functions and events. 


### Methods

| Method        | Description           |
| ------------- | ----------------------|
| .start()      | Initiate SocialFeed.js. |
| .reload()     | Reload content. Fetch new data from social channels. |
| .addModule(Module) | Add a new module to the feed. |
| .on(eventType, callback) | Listen for an event on the feed. See [Events](#events)|

### Events

To listen for a event use:

```javascript
var sfeed = new SocialFeed($("#socialfeed"));
sfeed.on('eventName', function() { /* body */ });
```

or for Modules:

```javascript
var mod = new SocialFeed.Modules.Github('mikaelbr');
mod.on('eventName', function() { /* body */ });
```

#### Events for a feed

| Event Type    |  Passed arguments     | Description           |
| ------------- | ----------------------| ----------------------|
| start         | None | Triggered when ```.start()``` is called |
| reload        | None | Triggered when ```.reload()``` is called |
| moduleAdded   | AddedModule | Triggered when module is added |
| preFetch      | None | Triggered before fetching data from modules. |
| postFetch     | AllModels[] | Triggered when all modules are fetched |
| rendered      | SortedHTMLList | Triggered after done rendering |
| error         | Module, jqXHR, AjaxOptions | Triggered when error fetching some module data. |


#### Events for a module

| Event Type    |  Passed arguments     | Description           |
| ------------- | ----------------------| ----------------------|
| error         |  Module, jqXHR, AjaxOptions | Triggered on error fetching module data. |
| fetched       |  Module, jqXHR, AjaxOptions | Triggered when data for module is fetched. |


## Expanding SocialFeed.js

### Adding new Social sites. 

You can easily add new modules to SocialFeed.js. See code for example:

```javascript
var NewModule = SocialFeed.Modules.extend({
  init: function(ident, count) {
    // Constructor. Omit to use default one with only "ident".
    this.ident = ident;
    this.count = count;
  }

  , url: function () {
    // URL can also be a string, but having it as a function
    // allows us to pass the ident value. ident is the first argument
    // to the module constructor.
    return 'http://path.to.some/document.json?user=' + this.ident + '&count=' + this.count;
  }

  , parse: function (resp) {
    // resp is the response from the AJAX call. Return a list of entities.
    return resp.result;
  }

  , orderBy: function (item) {
    // orderBy must be implemented. Return a numeric value to sort by.
    // item is an entity from the results.
    return -(new Date(item.created_at)).getTime();
  }

  , render: function (item) {
    // Return HTML representation of an entity.
    return '<p>' + item.message + '</p>';
  }
});

var sfeed = new SocialFeed($("#socialfeed"))
                  .addModule(new NewModule('mikaelbr', 10))
                  .start();

```

### Extend/Alter behaviour of existing module

You can change original behaviour of the pre-defined modules by extending them and overwriting their methods.

Example:

```javascript
var Disqus2 = SocialFeed.Modules.Disqus.extend({
  render: function (item) {
    return '<p>Allways show this message!</p>';
  }
});

var sfeed = new SocialFeed($("#socialfeed"))
                  .addModule(new Disqus2('mikaelbr', 'OEMdBc63xd0MZGKiVV5JgExTqdO7OSYkjgv613LJ8Py89y44pcoSKeBrelZjepVS'))
                  .start();
```


## Contribute

SocialFeed.js is very open for contributions. If you have built a module you think should be built in or find a bug, please send a pull request.

Also feel free to post issues at https://github.com/mikaelbr/SocialFeed.js/issues. 

### Contribution guide

To set-up SocialFeed.js to run locally, do the following:
```
$ git clone git://github.com/mikaelbr/SocialFeed.js.git
$ cd SocialFeed.js/
```

Install dependencies
```
$ npm install && bower install
```

This will install both the client side deps and browser side.

#### Build

After making your changes, build a new version of SocialFeed.js.

From root, run

```
node make
```

This will build the JavaScript, compile LESS files and minify both. You can find the dist files in the ```dist``` directory.
