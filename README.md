
# twoBirds

Welcome Birdies ;-)


[I dont want to read a lot - give me a kick-start](#i-dont-want-to-read-a-lot-give-me-a-kick-start)

[I want to support this:&nbsp;&nbsp;&nbsp;![Flattr this](//button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?fid=royvyd&url=https%3A%2F%2Fgitlab.com%2FtwoBirds%2Ftwobirds-core) 

You can also [contact me](mailTo:fthuerigen@googlemail.com) if you need a specific twoBirds plugin tailored for your needs. Usually that doesnt take a lot.

INFO: This readme only contains a short description - the repository contains a documentation web page in /src/tbDocs/index.html - simply click on it after cloning.

## Intro

##### twoBirds is a ...

- lightweight, 
- component-based, 
- event-driven / loosely coupled, 
- native 

##### ... JavaScript framework library that maps objects to DOM nodes.

Even shorter: twoBirds is like jQuery on application level.

twoBirds strictly follows the [KISS](http://principles-wiki.net/principles:keep_it_simple_stupid) and [DRY](http://principles-wiki.net/principles:don_t_repeat_yourself) doctrines.

The tB core can be seen as an intermediate step between a simple wrapper/helper library like jQuery and a fully fledged JS framework. 

Like the first, it has selectors for the dom and reasonable modification methods. 

Like the latter, it incorporates a higher level abstraction scheme for application objects.

The core does not contain higher level DOM elements like datepickers or the like, but gives you a sufficient set of functionality to implement these as you like. 

As a result, a widget is just another application object (same type of code, easy understandable). 

tB is JS-linted, jasmine tested and this package contains the complete API documentation. 

tB is the minimum possible toolkit to create an application or reusable js framework.

It consists of 3 parts:

#### 1.) a simple client repository object structure + instanciation mechanism

##### demoapp/myClass.js (simplified here)
```js
MyClass = function(){};

MyClass.prototype = {
    namespace: 'MyClass'
}
```
...as you see, any plain old javascript constructor can be a tB class. 

The 'namespace' property is convention and allows for selection, see below.

##### index.html
```html
<body data-tb="MyClass">
```
this will make an instance of above mentioned class and put it in the dom on load automatically.



##### ...or, somewhere in your js code:
```js
new tb(
	MyClass,
	{ ... config data ... },
	document.body
);
```
same as above, but done at run-time in an event handler or instance method of another tB instance - hence: a page can be built top-down recursively!

#### 2.) a selector to adress instances of these objects on the page

##### in your code...
```
tb( document.body )    // will return any tb instances that are contained in document.body

tb( /MyClass/ )        // find all instances on page that match the given namespace 
                       // see namespace static property above, that is what it checks against
```

There are a lot of parameter options and chained methods to that selector.

###### You also have a document.querySelectorAll() based tb.dom() selector, also with the chained methods you expect. 

The difference between these selectors is: tb.dom() returns DOM nodes, tb() returns tb instances that are contained therein. 

If you map it to a var $ inside your class factory, you can use it like jQuery (it even is 90% compatible):

```js
var $ = tb.dom;
// more selector stuff below
```

Read the API documentation included in the package.

#### 3.) a trigger mechanism to communicate with the selected instance on the page

##### in your code...
```js
tb( MyClass ).on(
    'myEventName',
    function( e ){
        // e.data === myEventData ...
    }
);

tb( 'body' ).trigger( 'myEventName' [, <myEventData> [, <bubble> ] ] );
```

HINT: bubble = 'l' for local, 'd' for down, 'u' for up ('l' being default) or any combination of these chars in a string.

twoBirds allows building nested structures of tB instances of repository classes that all look the same codewise, but add up to complex functionality.

All instances of these classes are stored in DOM nodes or other tB instances / other objects and vars of course.

#### Is this it?

Yes. This and a few helper methods will allow for JS automation at any level of complexity, while ensuring QA requirements.

The learning curve is very shallow, since tB only requires JS/ES5 knowledge as a prerequisite and does not have a lot of declarative abstraction.

Everybody who knows some jQuery will feel at home immediately.

### Comparision

twoBirds can be compared to any web component framework.

Unlike most of these frameworks twoBirds ... 

- ... is a hands-on approach that allows for a quick start. 
- ... allows for complete separation of code and design. 
- ... has requirement loading as an inherent part of the system.
- ... RECURSIVELY nests application instances transparently.
- ... doesnt come with prebuilt widgets - every tB instance is a widget, and usually you will do it yourself.
- ... strictly follows the KISS and DRY principles.
- ... ensures reusability of your code - since everything is a widget, you will build your own repository from the very start.
- ... you can use it as simple helper library in an existing plain old website
- ... you can migrate a plain old website to a SPA bottom-up 
- ... you can of course create a new SPA top-down

## Description

### General

As seen from a twoBirds perspective, a website / webapp consists of the HTML DOM and twoBirds JS objects attached to DOM nodes. 

Not every DOM node necessarily has a tB object attached to it, usually the tB objects reflect the higher order elements of a site, like "header", "login", "footer".

Also, twoBirds objects can be nested into each other.

Each of the nested instances may or may not add additional HTML / DOM nodes to the element, but together they form a logical unit. 

As shown later in the examples, you can find and address all these objects on the current page displayed, and trigger events on each element.

### Repository

In twoBirds, on the client side you have a repository of plain JS classes. These are used to create instances. 

The instances usually are saved in a DOM node or in other tB instances.

### Instances

##### There are some property names in twoBirds instances that are reserved:

*target*: ... is the DOM node or another object ( e.g. a tB instance ) the tB instance is attached to.

*namespace*: ... is the namespace of the repo object, and should be set accordingly, since the regEx selector tb( /.../ ) checks against the "namespace" property.

*handlers*: ... is a plain object, where { key: value } is e.g. { eventName: function myHandler( pEvent ){ /\*...\*/ } }. 

If for some reasons you need more than one handler for an eventName, eventName also can be an array of callback functions.  Internally all callbacks are stored in an hash object containing arrays anyway like so:

{ eventName: [ function myHandler( pEvent ){ /\*...\*/ }, function myOtherHandler(){} ] }

##### As for handlers, there currently is 1 event name that is automatically used by the system:

*init*: function(){ /* all requirement for the instance is done, now construct the object as necessary */ }

*This event will be sent to every newly created instance*, whether there is requirement loading or not. 

The *init handler* defined in the constructor is the *boot method* of every tb instance.



#### ...special convention inside twoBirds instances:

* If a property name contains a dot ("."), it is treated as a namespace which should contain a JS object or function. 

twoBirds will check whether this namespace already exists, then ...


*IF NOT:* twoBirds will convert the property name to a subdir string like so

"app.Body" ==> "/app/Body.js"

...and starts loading the file.


*IF IT EXISTS OR WHEN ITS LOADED:*

twoBirds will check whether the namespace points to a function or a plain object.

If it is a function, it will be executed in the context of the current instance (this), and given the property value as a single parameter.

If it is a plain object, the property value will be replaced with it, and when "tb.init" fires the handler will receive the previous contents of the property as a single parameter.


#### Now lets see all of this in context:

app/Body.js 
```js
tb.namespace('app.Body').set( // create the repo namespace if necessary
    (function(){    // class factory

        // Constructor
        function Body(){
            
            var that = this;
    
            that.handlers = {
                init
            };
    
        }
    
        Body.prototype = {
    
            namespace: 'app.Body',
    
            'tb.Require': [
                '/app/body.css'
            ]
    
        };
    
        return Body;
    
        // Private Functions
        function init(){
            
            var that = this;
    
            // initialize the instance and trigger further actions ...
    
        }
    
    })();
);
```

Upon instanciation this class will create a tb instance, starting the requirement loading if necessary. Further execution is halted until all required files have loaded. The "init" event will fire then.

* HINT: Properties that contain a dot (.) are said to be misleading because they look like a namespace. In twoBirds, what looks like a namespace IS a namespace - and will be treated as such.

#### ON EVENT / AT RUNTIME:

You can also insert a twoBirds instance into an already existing instance at runtime, in this case inside some event handler or method you add this code:
```js
// somewhere in you class code...
this.tbElement = new tb(
	'app.SomeClass', // an instance of this class
	{},              // hand this to the constructor
	this             // the target of the resulting instance points to the current instance
);
```

## API / Examples

### ON BOOT:

```html
<html>
	<head>
		<script src="http://<yourPathTo>/tb.js"></script>
	</head>
    <body data-tb="app.Body">
    </body>
</html>
```
By default upon startup twoBirds will lookup DOM nodes containing a "data-tb" attribute, and treats them as a tB class. 

An instance of the class will be created and attached to the DOM node.
 
If the corresponding class doesnt exist in the repository, on-demand loading is performed.

So, if the 'app.Body' class does not exist (window.app.Body), the system will look it up under this URL: /app/Body.js

### tb() Selector and inner structure example

```js 
// tb() selector always returns a jQuery-like result set

// PARAMETER TYPES



// STRING: invokes .querySelectorAll(), but returns tB object(s) contained in the DOM nodes returned.

tb('body')



// OBJECT: instances of a repo class inside page structure

// find all demoapp.someElement instances
tb( app.someElement )



// REGEXP: as object, but matching to instance 'namespace' property 

// always returns the root object

tb( /app.Bod/ ) // e.g. returns the app.body object, for its 'namespace' property should match the regEx



// OTHER:

// both of the following return all toplevel objects in the current DOM, as expected.

tb( /./ ) // any namespace matches
tb( '*' ) // invoking document.querySelectorAll()



// THIS:

this // in handler code, this always points to the current instance



// CHAINING:

// currently these chained selectors exist,
// and can be used to get other page objects,
// positioned relatively to a selector result or 'this'

tb('body').children('div') // all children of body tB object that reside inside a div HTML element
tb('body').descendants() // all descendants of body tB object
tb( ... ).parent() // closest parent, in this case body tb object
tb( ... ).parents() // array of all parent tB objects, nearest first
tb( ... ).prev() // the previous tb instance in this.parent().children()
tb( ... ).next() // the next tb instance in this.parent().children()
tb( ... ).first() // the previous tb instance in this.parent().children()
tb( ... ).last() // the next tb instance in this.parent().children()

...for a complete list see the API documentation contained in the package.

// CHAINED SELECTOR RETURNS ARE ALWAYS UNIQUE!

```

### Adding or removing event handler functions
... roughly resembles jQuery: 

```js 
function myHandler( e ){
	// do whatever
};

// add handlers (one = only one execution, delete handler afterwards)
tb('body').on('myevent', myHandler);
or
tb('body').one('myevent', myHandler);

// remove handler
tb('body').off('myevent', myHandler);

```

### tb(selector).trigger(event, data, bubble)
- communication between object instances on the page

some trigger snippets:
```js 
// general
tb( pSelector ).trigger('eventName' [, data] [, bubble] );

// as in:
tb( app.Body ).trigger('eventName' , null, 'ld' ); // local on instance found & down	

// sample from code
this.trigger( 'scroll.update', null, 'u' ); // not in this instance but bubbling up			

```

## Installation

simple: copy tb.js from /dist and insert into your project, or, using npm, follow [instructions below](#i-dont-want-to-read-a-lot-give-me-a-kick-start). Have fun!

## Use case 

- easily adding JS functionality to server side rendered HTML
- migrating from an existing server side rendered website to a single page application
- any size from embedded small functionality to enterprise apps

## Features

- web-component programming
- easy distributed / offshore programming
- async on demand loading, recursive

## Status:

- core API stable
- Best Practices stable but not documented yet. FAQ and Tutorials coming soon.

## History

- twoBirds was created 2004 to be able to build a complex web application for an insurance company (similar to google calc, which came later).
- It was meant to be a Web Component Framework from the beginning.
- It was first made public as V2 in 2007 ( [Ajaxian](http://ajaxian.com/archives/twobirds-lib-20-released) - and sorry for the character mess there, the page is outdated obviously ).
- It was constantly under development, though I had to earn some money from time to time. 

## I dont want to read a lot - give me a kick-start

### On console do...

(git clone this repository)

(goto project directory)

```console

// if necessary install nodeJS
// see node docs on how to do it...

// if necessary install grunt-cli
> sudo npm install -g grunt-cli

// then goto twoBirds-core directory and...
> npm install
> grunt

// you can use whatever you like as a web server, just one fast option using php here...
> cd src
> php -S 0.0.0.0:3000 &

// in your browser goto
//
// localhost:3000/index.html
//
// -> select test page to see it at work
// -> select API docs to inspect the functionality

```

-> open dev tools, e.g. firebug

- inspect DOM to see how twoBirds instances reside in DOM structure, on HTML tab right-click on a div and select 'inspect in DOM' 
- right-click on an "app.child" div, select 'inspect in DOM' to see how twoBirds instances can also reside inside each other
- go to the 'network' tab and reload to see the sequence of requirement loading

-> in the file system

- view 'test.html' file to see the app code ( in this case, its lack of ;-) )
- view js files in /src/app/ to see the app code for those objects that are lazy loaded

[I want to support this ![Flattr this](//button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?fid=royvyd&url=https%3A%2F%2Fgitlab.com%2FtwoBirds%2Ftwobirds-core) 

In case of questions contact [me](mailTo:fthuerigen@googlemail.com).
