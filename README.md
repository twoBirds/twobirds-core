# twoBirds

Welcome Birdies ;-)

[Tutorials](https://gitlab.com/twoBirds/twobirds-core/wikis/twoBirds-Tutorials) (work in progress)

[I want to support this:&nbsp;&nbsp;&nbsp;![Flattr this](//button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?fid=royvyd&url=https%3A%2F%2Fgitlab.com%2FtwoBirds%2Ftwobirds-core) 

You can also [contact me](mailTo:fthuerigen@googlemail.com?subject=regarding%20twoBirds%20...") if you need a specific twoBirds plugin tailored for your needs or if a question arises.

INFO: This readme only contains a short description - the repository contains a documentation web page in /src/tbDocs/index.html - simply click on it after cloning.

#### twoBirds is a ...

- lightweight, 
- component-based, 
- event-driven / loosely coupled, 
- native

#### ... JavaScript library that maps objects to DOM nodes or into other objects.

twoBirds is like jQuery on application level.

#### twoBirds supports all targets and web programming use cases

**using twoBirds alone you can...**

- build a plain old website using serverside rendering from ground up ( NodeJS based )

- add JS functionality to an existing serverside rendered webpage in a simple way, no matter which framework is used on the server side.

- build a [single page application](single page application) from ground up ( client side rendering )

- mix all of the above to optimize for search engines, or migrate an existing serverside rendered webpage to a SPA on the fly.

- build mobile apps using phonegap/cordova

- build native apps using electron

tB can completely replace your stack from the data source to the display - including microservice architecture. [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_Web_Apps) programming is supported as well, but doesn't require special tB functionality anyway.

All of this is archived using the same coding style. twoBirds classes can render on the server side and on the client side with minimal changes.

#### Principles

twoBirds strictly follows the [KISS](http://principles-wiki.net/principles:keep_it_simple_stupid) and [DRY](http://principles-wiki.net/principles:don_t_repeat_yourself) doctrines.

The tB core can be seen as an intermediate step between a simple wrapper/helper library like jQuery and a fully fledged JS framework. 

Like the first, it has selectors for the DOM and reasonable modification methods. 

Like the latter, it incorporates a higher level abstraction scheme for application objects.

tB is JS-linted, Jasmine tested and this package contains the complete API documentation. Technically it is the minimum possible toolkit to create an application or reusable JS library.
