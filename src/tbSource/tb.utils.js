/**
 @class tb.Util

 @description
     placeholder class, everything contained herein is a curry property of the tb() constructor
 */

tb.nop = function(){};

/**
 - creates a function to set/get the inner value
 - initializes the inner value with the parameter given
 - returns this function

 @memberof tb
 @static
 @method tb.observable
 @chainable

 @param {*} [pStartValue] initial content of observable

 @return {function} - observableFunction

 @example

     // observable data IS NOT an object
     var o = tb.observable( 0 );                // numeric

     o.observe(
         function( pValue ){                    // callback will be triggered when observable value changes
             console.log( pValue );
         },
         true                                   // true indicates callback will be called only once
     );

     o( 5 );                                    // change observable value

 @example

     // observable data IS an object
     var o = tb.observable( { a: 5 } );         // object

     o.observe(
         function( pValue ){                    // callback will be triggered when observable value changes
                     console.log( pValue );
                 },
         false                                  // false or no parameter indicates callback will always be called
                                                // when the data changes, true will trigger it only once
     );

     // get data:
     o( 'a' );       // => 5
     o();            // => { a: 5 }

     // each of these will trigger the callback since the data changed
     o( 'a', 6 );               // => { a: 6 }
     o( { c: 42 } );            // => { c: 42 }
     o( 'b', { c: 42 } );       // => { a: 6, b: { c: 42 } }


 */
tb.observable = function( pStartValue ){

    var observedValue = pStartValue,
        enableNotify = true;

    // make observable function to return in the end
    var observableFunction = function( p1, p2 ){

        function notify(){
            if ( !enableNotify ) {
                return;
            }
            observableFunction.lastChanged = (new Date()).getTime(); // needed for tb.idle()
            observableFunction.notify();
        }

        if ( typeof p1 !== 'undefined' ){
            if( observedValue.constructor === Object ) {
                if ( typeof p1 === 'string' ) {
                    if (typeof p2 !== 'undefined') {
                        // value has changed, p1 must be key or namespace ( key1.key2 etc ) for object property
                        if ( p1.indexOf('.') > -1 ){ // its a namespace
                            tb.namespace( p1, observedValue ).set( p2 );
                        } else { // it is a simple property
                            observedValue[p1] = p2;
                        }
                        notify();
                    } else {
                        return tb.namespace( p1, observedValue ).get();
                    }
                } else if ( typeof p1 === 'object' && typeof p2 === 'undefined' ){
                    observedValue = p1;
                    notify();
                } else {
                    console.warn('tb.observable() set value: parameter 1 should be a string or object if observed data is an object!');
                }
                return observedValue;
            } else {
                if ( typeof p1 !== 'undefined' ){
                    // value has changed
                    observedValue = p1;
                    notify();
                }
                return observedValue;
            }
        }

        return observedValue;
    };

    observableFunction.lastChanged = (new Date()).getTime(); // needed for tb.idle()

    // list of all callbacks to trigger on observedValue change
    observableFunction.notifiers = [];

    // function used to execute all callbacks
    observableFunction.notify = function(){

        // execute all callbacks
        observableFunction.notifiers.forEach(
            function( func, key ){
                if ( typeof func === 'function' ){
                    func( observedValue );
                    if ( func.once ){
                        observableFunction.notifiers.splice(key,1);
                    }
                } else {
                    observableFunction.notifiers.splice(key,1);
                }
            }
        );

    };

    // enable/disable notifications
    observableFunction.enableNotify = function( pEnableNotify ){
        enableNotify = pEnableNotify === false ? false : true;
    };

    // function used to add a callbacks
    observableFunction.observe = function( pFunction, pOnce ){
        pFunction.once = pOnce || false;
        observableFunction.notifiers.push( pFunction );
    };

    return observableFunction;
};


/**
 @memberof tb
 @method tb.namespace
 @static
 @chainable

 @param {string} pNamespace
 @param {object} [pObject] object to scan

 @return {object} containing set() / get() functions for property in pNamespace

 @example

     // lookup [window] namespace:
     tb.namespace( 'test.GrandParent' ); // gets the constructor for the GrandParent from DOM

     // in a constructor force namespace creation:
     tb.namespace( 'app.prop' ).set( 'testVal' );     // force creation of 'app.prop' if it doesnt exist, set value to 'testVal'

 @example

     // lookup namespace in any object and return value:
     tb.namespace( 'x.y', { x: { y: 42 } } ).get();     // 42

 @example

     // create content in any object as denominated by namespace:
     var obj = { x: { y: 42 } }
     tb.namespace( 'x.z', obj ).set( 43 );     // obj => { x: { y: 42, z: 43 } }

 */
tb.namespace = (function(){

    // constructor
    function Namespace( pNamespace, pObject){
        var that = this;

        that.namespace = pNamespace;
        that.target = pObject;
        that.namespaceArray =  pNamespace.indexOf( '.' ) ? pNamespace.split('.') : pNamespace;
        that.forceCreation = false;
    }

    // prototype
    Namespace.prototype = {
        get: get,
        set: set,
        _walk: _walk
    };

    return function ( pNamespace, pObject ){
        return new Namespace( pNamespace, pObject );
    };

    // methods
    function _walk( o, namespaceArray ) {
        var that = this;

        if ( !o[ namespaceArray[0] ] && !!this.forceCreation ) {
            o[ namespaceArray[0] ] = {};
        }

        if ( namespaceArray.length < 2 ){

            if( that.forceCreation && typeof that.value !== 'undefined' ){ // if value is present it is called with set()
                o[ namespaceArray[0] ] = that.value;
            }
            return o.hasOwnProperty( namespaceArray[0] ) ? o[ namespaceArray[0] ] : undefined;

        } else {

            if ( o.hasOwnProperty( namespaceArray[0] ) ) {
                o = o[ namespaceArray[0] ];
                namespaceArray.shift();
                return that._walk( o, namespaceArray );
            } else {
                return;
            }

        }
    }

    function get(){
        var that = this;

        that.forceCreation = false;
        return that._walk( !that.target ? window : that.target, that.namespaceArray );
    }

    function set( pValue ){
        var that = this;

        that.value = pValue;
        that.forceCreation = true;
        return that._walk( !that.target ? window : that.target, that.namespaceArray );
    }

})();

/**
 @memberof tb
 @static
 @method tb.attach

 @param  {object} [pRootNode] DOM node to start binding in
 
 @example

     tb.attach( document.body );
     // scans the given element and all of its descendants
     // in the DOM and looks for attributes "data-tb" in the nodes.

     // Resulting list will be scanned for those nodes that do not already
     // have a tb object inside which is given as a namespace in the data-tb attribute.

     // Creates missing tb object based on the class namespace given
     // in the "data-tb" attribute and stores it in the DOM element
    
 */
tb.attach = function( pRootNode ){

    var rootNode = pRootNode || document.body,
        foundElements = tb.dom( rootNode.querySelectorAll( '[data-tb]' ) ).toArray();

    // add self if data-tb attribute present
    if ( rootNode.getAttribute('data-tb') ){
        foundElements = [rootNode].concat( foundElements );
    }

    // instanciate tb instances for given elements
    foundElements.forEach(
        function( pElement ){
            var namespaces = pElement.getAttribute('data-tb').split(' ');

            namespaces.forEach(
                function( pNamespace ){
                    pElement['tb'] = pElement['tb'] || {};
                    if ( !pElement['tb'][pNamespace] ){
                        new tb(        // create tb object
                            pNamespace,
                            null,
                            pElement
                        );
                    }
                }
            );

        }
    );

};



/**
 @memberof tb
 @static
 @property tb.status
 @type Object

 container for twoBirds status observables
 */
tb.status = {
    /**
     @property tb.status.loadCount
     @type Function

     observable containing the number of ( script load operations + xHr requests ) currently pending
     */
    loadCount: tb.observable(0)         // contains the number of ( file loads + xHr requests ) pending
};



/**
 @memberof tb
 @static
 @method tb.idle

 @param {function} pCallback function to execute when all loading is finished

 @example

    // in code...
    tb.idle(
        function(){
            // do whatever you like
        }
    );
 */
tb.idle = function( pCallback ){

    var f = function(){

        //console.log( 'idle call f()' );

        if ( tb.status.loadCount() === 0 ){

            //console.log( 'idle create tf()' );

            var tf = function(){

                //console.log( 'idle call tf()' );

                if ( tb.status.loadCount() === 0 ){ // loadCount is (still) 0
                    if (
                        tb.status.loadCount.lastChanged === tf.lastChanged // it is still the previous '0' loadcount
                    ){
                        // system is still idle
                        if ( typeof pCallback === 'function'){
                            //console.log('idle', tf.lastChanged, tb.status.loadCount.lastChanged );
                            pCallback();
                        }
                    } else {
                        // probably not idle -> retry in 50 ms
                        //console.log('not yet idle', tf.lastChanged, tb.status.loadCount.lastChanged );
                        tf.lastChanged = tb.status.loadCount.lastChanged;
                        setTimeout(
                            tf,
                            100
                        );
                    }
                } else { // loadCount is not 0 -> reattach function
                    tb.status.loadCount.observe( f, true );
                }
            };

            tf.lastChanged = 0;

            setTimeout(
                tf,
                100
            );
        } else {
            // if idle not yet reached, re-attach function for ONE execution
            tb.status.loadCount.observe( f, true );
        }

    };

    // attach function for ONE execution
    tb.status.loadCount.observe( f, true );

};


/**
 returns a unique id

 @memberof tb
 @static
 @method tb.getId

 @return {string} - unique id

 */
tb.getId = function(){
    return 'id-' + (new Date()).getTime() + '-' + Math.random().toString().replace(/\./, '');
};



/**
 - takes any number of objects as parameters
 - merges content into the first parameter object
 - always a deep copy

 @memberof tb
 @static
 @method tb.extend

 @param {object} pObj - object to extend
 @param {...object} [pObj] any number of other objects to merge in

 @return {object} - extended object

 */
tb.extend = function( pObj ){ // any number of arguments may be given
    var cp;

    function walk(pKey) {
        if ( cp[pKey] !== null
            && !!cp[pKey]['constructor']
            && (cp[pKey]).constructor === Object
        ){
            pObj[pKey] = tb.extend( pObj[pKey] || {}, cp[pKey] );
        } else {
            pObj[pKey] = cp[pKey];
        }
    }

    while ( arguments[1] ){
        cp = arguments[1];

        Object
            .keys(cp)
            .forEach(
                walk
            );

        [].splice.call( arguments, 1, 1 ); // remove object that is done
    }

    return pObj;
};



/**

 - will replace all matching {namespace1.namespace2.etc} occurrences with values from pParse object
 - if typeof pWhat is object or array, it will be done with all strings contained therein and the original pWhat returned

 @memberof tb
 @static
 @method tb.parse
  
 @param {(string|object|array)} pWhat string, object or array to parse recursively
 @param {...object} pParse any number of hash objects containing replacement key/value pairs

 @return {(string|object|array)} pWhat parsed

 @example

     tb.parse( "{a} test test", { a: 'done' } )
     // "done test test"

 @example

     tb.parse( [ "{a} test test" ], { a: 'done' } )
     // ["done test test"]

 @example

     tb.parse( [ "{a} test test", "{b} test test" ], { a: 'done', b: 'processed' } )
     // ["done test test", "processed test test"]

 @example

     tb.parse( [ "{a} test test", "{b} test test", { g: "another {silly} test" } ], { a: 'done', b: 'processed', silly: 'not so silly' } )
     // ["done test test", "processed test test", Object { g="another not so silly test"}]

 @example

     tb.parse( { a: "{a} test test", b: "{b} test test", c: [ "another {silly} test" ] }, { a: 'done', b: 'processed', silly: 'not so silly' } )
     // Object { a="done test test",  b="processed test test",  c=[ "another not so silly test" ] }

 @example

     // multiple hash objects:
     tb.parse(
        "{a} {b}",
        { a: 'done1' },
        { b: 'done2' }
     );
     // "done1 done2"

 */
tb.parse = function( pWhat, pParse ){
    var args = Array.prototype.slice.call(arguments);

    if (!args.length){
        console.error('no arguments give to parse');
        return;
    }

    if (args.length === 1){
        return args[1];
    } else if (args.length > 2) {
        while (args.length > 1){
            args[0] = tb.parse( args[0], args[1]);
            args.splice(1, 1);
        }
        return args[0];
    }

    // implicit else: exactly 2 arguments
    if ( typeof pWhat === 'string' ){
        var vars = pWhat.match( /\{[^\{\}]*\}/g );

        if ( !!vars ) {
            vars
                .forEach(
                    function (pPropname) {
                        var propname = pPropname.substr(1, pPropname.length - 2),
                            value = tb.namespace( propname, pParse ).get();

                        if ( typeof value !== 'undefined' ){
                            pWhat = pWhat.replace( pPropname, value );
                        }
                    }
                );
        }
    } else if ( !!pWhat.constructor ){
        switch ( pWhat.constructor ){
            case Object:
                Object
                    .keys( pWhat )
                    .forEach(
                        function( pKey ){
                            if ( pWhat.hasOwnProperty( pKey ) ){
                                pWhat[ pKey ] = tb.parse( pWhat[ pKey ], pParse );
                            }
                        }
                    );
                break;
            case Array:
                pWhat
                    .forEach(
                        function( pValue, pKey ){
                            pWhat[ pKey ] = tb.parse( pWhat[ pKey ], pParse );
                        }
                    );
                break;
        }
    }

    return pWhat;
};

/**
 - Promise/A+ compliant promise functionality

 @memberof tb
 @static
 @class tb.Promise
 @constructor

 @param {function} pFunction function to execute
 
 @return {object} Promise/A+ compliant promise object

 @example

        var p = new tb.Promise(function(resolve, reject){

            setTimeout(function(){
                resolve('it worked.');
            },1000)

            setTimeout(function(){
                reject('something went wrong.');
            },500)

        }).then(function(pValue){

            console.log('Yippie! ', pValue);

        }).catch(function(pValue){

            console.log('Oops? ', pValue);

        }).finally(function(pValue){

            console.log('Cleaning up ', pValue);

        });

 */
tb.Promise = (function(){

    'use strict';

    var LAST_ERROR = null;
    var IS_ERROR = {};

    // Promise constructor
    function Promise(fn) {
        fn = fn || tb.nop;
        if (typeof this !== 'object') {
            throw new TypeError('Promises must be constructed via new');
        }
        this._deferredState = 0;
        this._state = 0;
        this._value = null;
        this._deferreds = null;
        if (fn === tb.nop) {
            return;
        }
        doResolve(fn, this);
    }
    Promise._onHandle = null;
    Promise._onReject = null;

    // Promise prototype
    Promise.prototype = {
        /**
         @method then
         @chainable

         @param {function} pFunction - function to execute when promise is resolved

         @return {object} - a new Promise instance (chaining)


         @example

                new tb.Promise(function(resolve, reject){
                    setTimeout( resolve('ok.') );
                }).then(function(pValue){
                    console.log( pValue );  // >ok.
                });

         */
        then: _then,

        /**
         @method catch
         @chainable

         @param {function} pFunction - function to execute when promise is rejected

         @return {object} - a new Promise instance (chaining)


         @example

                new tb.Promise(function(resolve, reject){
                    setTimeout( reject('oops.') );
                }).catch(function(pValue){
                    console.log( pValue );  // >oops.
                });

         */
        'catch': _catch,

        /**
         @method finally
         @chainable

         @param {function} pFunction - function to execute at the end in any case

         @return {object} - a new Promise instance (chaining)


         @example

                new tb.Promise(function(resolve, reject){
                    setTimeout( reject('whatever.') ); // could also be resolve, finally will always be executed
                }).finally(function(pValue){
                    console.log( pValue );  // >whatever.
                });

         */
        'finally': _finally,

        done: _done
    };

    // static methods

    /**
     @method tb.Promise.resolve
     @chainable
     @static

     @param {any} pValue - the value the returned promise will resolve with

     @return {object} - a new resolved Promise instance (chaining)


     @example

            var p = tb.Promise.resolve('resolved');

     */
    Promise.resolve = function( pValue ){
        var ret = new tb.Promise(function( resolve, reject ){
        });

        resolve( ret, pValue );

        return ret;
    };

    /**
     @method tb.Promise.reject
     @chainable
     @static

     @param {any} pValue - the value the returned promise will reject with

     @return {object} - a new rejected Promise instance (chaining)


     @example

            var p = tb.Promise.reject('rejected');

     */
    Promise.reject = function( pValue ){
        var ret = new tb.Promise(function( resolve, reject ){
        });

        reject( ret, pValue );

        return ret;
    };

    /**
     @method tb.Promise.all
     @chainable
     @static

     @param {array} pIterable - an array containing values and/or promises

     @return {object} - a new rejected Promise instance (chaining)

     @example

            // "then" function will be executed when ALL promises have been resolved
            // "catch" function will be executed if one of the promises rejects
            // values in the parameter array will be converted to Promise.resolve(value)

             var p = tb.Promise.all([
                 true,
                 tb.Promise.resolve('new value')
             ]).finally(function(pValue){
                console.log(pValue); // >[ true, 'new value' ]
             });

             var p = tb.Promise.all([
                 true,
                 tb.Promise.reject('oops.')
             ]).finally(function(pValue){
                console.log(pValue); // >oops.
             });
     */
    Promise.all = function( pIterable ){

        var count = pIterable.length,
            observable = tb.observable(count),
            promise = new Promise(),
            result = new Array(count);

        // convert to promises if necessary and add callbacks
        pIterable
            .forEach( function( pValue, pIndex ){

                if ( !pValue.then || typeof pValue.then !== 'function' ){
                    pValue = tb.Promise.resolve( pValue );
                }
                  
                pValue
                    .then(function(pValue){
                        result[ pIndex ] = pValue;
                    })
                    .catch(function(pValue){
                        if ( promise._state === 0 ){
                            reject( promise, pValue._value );
                        }
                    })
                    .finally(function(pValue){
                        observable( observable() - 1 );
                    });

            });

        observable.observe(function(pValue){
            if ( pValue === 0 ){
                observable = null;
                if ( promise._state === 0 ){
                    resolve( promise, result );
                }
            }
        });

        return promise;
    };

    /**
     @method tb.Promise.race
     @chainable
     @static

     @param {array} an array containing values and/or promises

     @return {object} a new rejected Promise instance (chaining)

     @example

            // "then" function will be executed when the fastest promise resolves
            // "catch" function will be executed when the fastest promise rejects
            // values in the parameter array will be converted to Promise.resolve(value)

            var p1 = new tb.Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve('ok.');
                },1000);
            });

            var p2 = new tb.Promise(function(resolve,reject){
                setTimeout(function(){
                    reject('oops.');
                },2000);
            });

            var p = tb.Promise.race([
                p1,
                p2
            ]).then(function(pValue){
                console.log(pValue); // >ok.
            }).catch(function(pValue){
                console.log(pValue); // (will never be reached, p1 resolves first)
            });
     */
    Promise.race = function( pIterable ){
        var promise = new tb.Promise();

        // convert to promises if necessary and add callbacks
        pIterable
            .forEach( function( pValue, pIndex, pOriginalIterable ){
                if ( pValue.constructor !== Promise ){
                    pOriginalIterable[ pIndex ] = Promise.resolve( pValue );
                }
                
                pOriginalIterable[ pIndex ]
                    .then(function(pValue){
                        if ( promise._state === 0 ){
                            resolve( promise, pValue );
                        }
                    })
                    .catch(function(pValue){
                        if ( promise._state === 0 ){
                            reject( promise, pValue );
                        }
                    });
            });

        return promise;
    };

    return Promise;

    // private functions

    // HINT: ignore:lines are needed because jslint regards these functions as being standalone,
    // which they are not - they are the implementation of Promise.prototype methods.

    function _then(onFulfilled, onRejected) {
        if ( !( this instanceof Promise) ) { // jshint ignore:line
            return safeThen(this, onFulfilled, onRejected); // jshint ignore:line
        }
        var res = new Promise(tb.nop);
        handle(this, new Handler(onFulfilled, onRejected, res)); // jshint ignore:line
        return res;
    }

    function _catch( pFunction ){
        return this.then( null, pFunction ); // jshint ignore:line
    }

    function _done(onFulfilled, onRejected) {
        var that = arguments.length ? this.then.apply(this, arguments) : this; // jshint ignore:line
        that.then(null, function (err) {
            setTimeout(function () {
                throw err;
            }, 0);
        });
    }

    function _finally(f) {
        return this.then(function (value) { // jshint ignore:line
            return tb.Promise.resolve(f()).then(function () {
                return value;
            });
        }, function (err) {
            return Promise.resolve(f()).then(function () {
                throw err;
            });
        });
    }

    function getThen(obj) {
        try {
            return obj.then;
        } catch (e) {
            LAST_ERROR = e;
            return IS_ERROR;
        }
    }

    function tryCallOne(fn, a) {
        try {
            return fn(a);
        } catch (e) {
            LAST_ERROR = e;
            return IS_ERROR;
        }
    }
    function tryCallTwo(fn, a, b) {
        try {
            fn(a, b);
        } catch (e) {
            LAST_ERROR = e;
            return IS_ERROR;
        }
    }

    function safeThen(that, onFulfilled, onRejected) {
        return new that.constructor(function (resolve, reject) {
            var res = new tb.Promise(tb.nop);
            res.then(resolve, reject);
            handle(that, new Handler(onFulfilled, onRejected, res));
        });
    }

    function handle(that, deferred) {
        while (that._state === 3) {
            that = that._value;
        }
        if (Promise._onHandle) {
            Promise._onHandle(that);
        }
        if (that._state === 0) {
            if (that._deferredState === 0) {
                that._deferredState = 1;
                that._deferreds = deferred;
                return;
            }
            if (that._deferredState === 1) {
                that._deferredState = 2;
                that._deferreds = [that._deferreds, deferred];
                return;
            }
            that._deferreds.push(deferred);
            return;
        }
        handleResolved(that, deferred);
    }

    function handleResolved(that, deferred) {
        setTimeout( function() {
            var cb = that._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                if (that._state === 1) {
                    resolve(deferred.promise, that._value);
                } else {
                    reject(deferred.promise, that._value);
                }
                return;
            }
            var ret = tryCallOne(cb, that._value);
            if (ret === IS_ERROR) {
                reject(deferred.promise, LAST_ERROR);
            } else {
                resolve(deferred.promise, ret);
            }
        }, 0);
    }

    function resolve(that, newValue) {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === that) {
            return reject(
                that,
                new TypeError('A promise cannot be resolved with itself.')
            );
        }
        if (
            newValue &&
            (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
            var then = getThen(newValue);
            if (then === IS_ERROR) {
                return reject(that, LAST_ERROR);
            }
            if (
                then === that.then &&
                newValue instanceof Promise
            ) {
                that._state = 3;
                that._value = newValue;
                finale(that);
                return;
            } else if (typeof then === 'function') {
                doResolve(then.bind(newValue), that);
                return;
            }
        }
        that._state = 1;
        that._value = newValue;
        finale(that);
    }

    function reject(that, newValue) {
        that._state = 2;
        that._value = newValue;
        if (Promise._onReject) {
            Promise._onReject(that, newValue);
        }
        finale(that);
    }
    function finale(that) {
        if (that._deferredState === 1) {
            handle(that, that._deferreds);
            that._deferreds = null;
        }
        if (that._deferredState === 2) {
            for (var i = 0; i < that._deferreds.length; i++) {
                handle(that, that._deferreds[i]);
            }
            that._deferreds = null;
        }
    }

    function Handler(onFulfilled, onRejected, promise){
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }

    /**
     * execute promise function
     */
    function doResolve(fn, promise) {
        var done = false;
        var res = tryCallTwo(fn, function (value) {
            if (done) {
                return;
            }
            done = true;
            resolve(promise, value);
        }, function (reason) {
            if (done) {
                return;
            }
            done = true;
            reject(promise, reason);
        });
        if (!done && res === IS_ERROR) {
            done = true;
            reject(promise, LAST_ERROR);
        }
    }

})();

/**
 @memberof tb
 @static
 @class tb.Require
 @constructor

 @param {(string|string[])} pRequiredFiles string or string array containing required files

 @return {object} Promise/A+ compliant promise object

 tb.Require class ( uses tb.require function and returns the promise returned by it )

 - add into prototype of your constructor
 - instance will get an 'init' event when all files have loaded.

 @example

     tb.namespace( 'app.GrandParent' ).set( 
         (function(){

              // Constructor
              function GrandParent(){
                  var that = this;
    
                  that.handlers = {
                      init
                  };
    
              }
    
              // Prototype
              GrandParent.prototype = {
    
                  namespace: 'app.GrandParent',
    
                  'tb.Require': [
                       '/app/GrandParent.css'
                  ]
    
              };
    
              return GrandParent;
    
              // Private Methods
    
              function init(){
                   // will be called when requirement loading is finished ( both success and error )
              }
    
         })()
     );
 */
if ( typeof module === 'undefined' ) {

    // mapping to tb.require
    tb.Require = function ( pConfig ) {
        return tb.require( pConfig );
    };

    tb.Require.prototype = {};

} else {
    // todo: local loading in nodeJS
}


/**
 @memberof tb
 @static
 @method tb.require

 @param {(string|string[])} pFiles array of filenames
 @param {function} [pCallback] optional callback after all loading is done
 
 @return {object} - Promise/A+ compliant promise object

 @example

        // in your code ...
        tb.require([
            '/app/styles.css',                  // .css will be inserted into head <link>
            '/app/someJavascript.js',           // .js will be inserted into head <script>
            '/app/someData.json',               // .json data will be parsed to JS object
            '/app/templates/someTemplate.html'  // all other file contents will be saved into repo
        ], function( pValue ){
            // do something when all loading activity has finished
            console.log(pValue); // >[ 'done', 'done', <someObject>, '<someHtmlString>' ]
        });
 
 */
tb.require = function( pFiles, pCallback ){

    var promiseArray = [], // used for Promise.all()
        ret;

    //console.log( 'tb.require()', pFiles);

    if ( !pFiles ){
        var warn = 'tb.require: no files given.';

        console.warn(warn);

        return tb.Promise.reject(warn);
    }

    // convert to array anyway
    if ( typeof pFiles === 'string' ){
        pFiles = [ pFiles ];
    }

    // make parameter array for tb.Promise.all
    pFiles
        .forEach(function( pFile ){
            var type = _getTypeFromSrc( pFile );

            if ( pFile.split('/').pop().indexOf('.') === -1 ){ // file type extension
                var warn = 'tb.require: no file type given for ';

                console.warn( warn, pFile );

                return tb.Promise.reject( warn + pFile );
            }

            // file type container does not exist
            if ( !tb.require.repo[type] ){
                tb.require.repo[type] = {};
            }

            // file promise does not exist in container
            if ( !tb.require.repo[type][pFile] ){
                tb.require.repo[type][pFile] = _load( pFile );
            }

            // finally push promise
            promiseArray.push( tb.require.repo[type][pFile] );

        });


    ret = tb.Promise.all(promiseArray);

    // attach callback if given
    if ( !!pCallback ){
        ret.finally( function(pValueArray){
            pCallback.call( pValueArray );
        });
    }

    return ret;

    // private functions

    function _load(pFile){
        
        var typeConfigs = { // standard configuration types
                'css': {
                    tag: 'link',
                    attributes: {
                        type: 'text/css',
                        rel: 'stylesheet',
                        href: '{src}'
                    }
                },
                'js': {
                    tag: 'script',
                    attributes: {
                        type: 'text/javascript',
                        src: '{src}'
                    }
                }
            },
            typeConfig,
            type = _getTypeFromSrc(pFile),
            file = pFile,
            promise;

        // cache busting
        if ( !!tb.require.cacheBust ){
            file = pFile + ( pFile.indexOf('?') > -1 ? '&' : '?' ) + tb.getId();
        }

        //console.log('load', type, typeConfigs);

        // do loading
        if ( !!typeConfigs[type] ) { // either *.css or *.js file

            // increase loadcount ( tb.idle() related )
            tb.status.loadCount(tb.status.loadCount() + 1); // increase loadCount

            promise = new tb.Promise(function(resolve, reject){
                var element;

                //console.log('special load', type, typeConfigs);

                // get default config for type
                typeConfig = typeConfigs[type];

                // create DOM element
                element = document.createElement(typeConfig.tag);
                element.async = true;
                element.onreadystatechange = element.onload = function () {
                    var state = element.readyState;
                    if ( !state || /loaded|complete/.test(state) ) {
                        resolve('1');
                    }
                };

                // add attributes to DOM element
                Object
                    .keys( typeConfig.attributes )
                    .forEach(
                        function( pKey ){
                            element.setAttribute(pKey, tb.parse(typeConfig.attributes[pKey], { src: pFile }));
                        }
                    );

                // append node to head
                document.getElementsByTagName('head')[0].appendChild(element);

            }).finally(function(){

                // decrease loadcount ( tb.idle() related )
                tb.status.loadCount(tb.status.loadCount() - 1); // increase loadCount

                tb.require.repo[type][pFile] = 'done';
            
            });

            return promise;

        } else { // load via request if unknown type, trigger callback with text or JSON

            var f = function (data) {

                // convert if .json
                if ( type === 'json' && !!data['text']) {
                    try {
                        tb.require.repo[type][pFile] = JSON.parse(data.text);
                    } catch (e) {
                        console.error('result parsing, valid JSON expected in:', data);
                    }
                } else {
                    tb.require.repo[type][pFile] = data.text;
                }

            };

            var options = {
                url: file
            };

            return tb.request(options).finally(f);

        }

    }

    function _getTypeFromSrc(pSrc) {
        return pSrc.split('?')[0].split('.').pop();
    }

};

tb.require.repo = {};
tb.require.cacheBust = true;
tb.require.loadcount = 0;

tb.require.get = function(pFile){
    return tb.require.repo[pFile.split('?')[0].split('.').pop()][pFile] || undefined;
};

/**
 @memberof tb
 @static
 @method tb.request

 @param pOptions { object } a hash object containing these options:<br><br><br>

 @param pOptions.url: (string, omitted) the URL to call
 @param {object} [pOptions.params] - a hash object containing the parameters to post
 @param {string} [pOptions.method] - (string, optional, defaults to 'POST') the XHR method
 @param {object} [pOptions.headers] - a hash object containing additional XHR headers
 @param {function} [pOptions.success] - the function to call with the request result
 @param {function} [pOptions.error] - the function to call if request status not in 200...299
 @param {function} [pOptions.statechange] - the function to call when readyState changes
 @param {number} [pOptions.timeout] - structure sample: { cb: myFunction, ms:10000 }
    cb: callback to run when timeout occurs
    ms: number of milliseconds the request will run before being terminated
 @param {boolean} [pOptions.cachable] - defaults to true, indicates whether or not to include a unique id in URL
 @param {boolean} [pOptions.async] - whether or not to make an asynchronous request

 @return {object} - a Promise/A+ compliant promise object

 */
if (typeof module === 'undefined' ){
    tb.request = (function () {
        /** @private */
        var loadlist = [],
            readyState = 'complete',
            cachable = false,
            log = false,
            count = 0,
            interval = 30,
            msoft = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];

        function getConnection(pId) {
            var obj,
                xhr,
                getConnection;

            if (typeof ActiveXObject !== 'undefined'){
                for (var i = 0; i < msoft.length; ++i) {
                    try {
                        xhr = new ActiveXObject(msoft[i]);

                        obj = {
                            connection: xhr,
                            identifier: pId
                        };

                        /* jshint ignore:start */
                        getConnection = (function (pType) {
                            return function (pId) {
                                var xhr = new ActiveXObject(pType);
                                obj = {
                                    connection: xhr,
                                    identifier: pId
                                };
                                return obj;
                            };
                        })(msoft[i]);
                        /* jshint ignore:end */

                    } catch (e) {
                    }
                }
            }

            try {
                xhr = new XMLHttpRequest();
                obj = {
                    connection: xhr,
                    identifier: pId
                };
                /** @ignore */
                getConnection = function (pId) {
                    var xhr = new XMLHttpRequest();
                    obj = {
                        connection: xhr,
                        identifier: pId
                    };
                    return obj;
                };
            }
            catch (e) {
            }
            finally {
                return obj;
            }
        }

        /** @private */
        function handleReadyState(pReq, pResolve, pStateChange, pReject, pOptions) {
            var connection = this;
            var poll = window.setInterval((function (pReadyState) {
                return function () {
                    if (pReq.connection.readyState !== pReadyState) {
                        pReadyState = pReq.connection.readyState;
                        //pStateChange();
                    }
                    if (pReadyState === 4) {
                        if (pReq.aborttimer) {
                            window.clearTimeout(pReq.aborttimer);
                        }
                        window.clearInterval(poll);
                        handleTransactionResponse(pReq, pResolve, pReject, pOptions);
                    }
                };
            })(0), interval);

            return poll;
        }

        /** @private */
        function handleTransactionResponse(pReq, pResolve, pReject, pOptions) {
            var httpStatus,
                responseObject;

            try {
                httpStatus = pReq.connection.status;
            }
            catch (e) {
                httpStatus = 13030;
            }

            if (httpStatus >= 200 && httpStatus < 400) {
                responseObject = createResponseObject(pReq, pOptions);
                try {
                    pResolve( responseObject );
                }
                catch (e) {
                    if (tb.debug){
                        debugger;
                    }
                }
            }
            else {
                responseObject = createResponseObject(pReq, tb.extend( {}, pOptions ) );
                pReject( responseObject );
            }
            release(pReq);
        }

        /** @private */
        function createResponseObject(pObj, pOptions) {
            var obj = {
                tId: pObj.identifier,
                status: pObj.connection.status,
                statusText: pObj.connection.statusText,
                responseHeaders: {},
                requestHeaders: pOptions.headers,
                text: pObj.connection.responseText,
                xml: pObj.connection.responseXML,
                options: pOptions
            };

            pObj
                .connection
                .getAllResponseHeaders()
                .split('\r\n')
                .forEach(function(pSubString){
                    var key = pSubString.split(':')[0],
                        value = pSubString.substr( pSubString.indexOf(':')+1 );
                    if ( !!pSubString ) {
                        obj.responseHeaders[key] = value;
                    }
                });

            // attempt to convert text to JSON object
            if ( !!pOptions['dataType'] && pOptions['dataType'].toLowerCase() === 'json' ){
                try{
                    obj.data = JSON.parse( pObj.connection.responseText );
                } catch(e) {
                    console.warn( 'expected JSON, could not parse: ' + pObj.connection.responseText );
                }
            }

            return obj;
        }

        /** @private */
        function release(pReq) {
            dec( pReq );
            if (pReq.connection){
                pReq.connection = null;
            }
            pReq = null;
        }

        function inc( pReq ) {
            tb.status.loadCount( tb.status.loadCount() + 1 );
            loadlist.push( pReq );
            count++;
            readyState = 'loading';
        }

        function dec( pReq ) {
            tb.status.loadCount( tb.status.loadCount() - 1 );
            if ( loadlist.indexOf( pReq ) ){
                count--;
                loadlist.splice( loadlist.indexOf( pReq ) );
                if ( count === 0 ){
                    readyState = 'complete';
                }
            }
        }


        /**
         @name tb.request
         @function
         */
        return function (pOptions) {
            var uid = 'tb' + tb.getId(),
                xmlreq = getConnection(uid),
                method = (pOptions.method ? pOptions.method.toUpperCase() : false) || 'GET',
                url = pOptions.url,
                params = '',
                successHandler = pOptions.success || tb.nop,
                errorHandler = pOptions.error || tb.nop,
                finalHandler = pOptions.finally || tb.nop,
                stateHandler = pOptions.statechange || tb.nop,
                isCachable = pOptions.cachable || false,
                headers = pOptions.headers = pOptions.headers || {},
                timeout = pOptions.timeout || false,
                isAsync = (typeof pOptions.async !== 'undefined' && pOptions.async === false) ? false : true,
                ct;

            inc();

            // adjust for JSON data
            if ( !!pOptions['type'] && pOptions['type'].toLowerCase() === 'json'  ){
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            if (typeof pOptions.params !== 'undefined') {
                ct = ( headers && headers['Content-Type']
                    ? headers['Content-Type']
                    : 'application/x-www-form-urlencoded' );

                // parameter handling
                switch ( ct ){
                    case 'application/json;charset=UTF-8':

                        params = JSON.stringify( pOptions.params );
                        break;

                    default:

                        Object
                            .keys( pOptions.params )
                            .forEach(
                                function( pParam ){
                                    params += ((params.length > 0 ? '&' : '') + pParam + '=' + pOptions.params[pParam]);
                                }
                            );

                        break;
                }

            }

            // proxy disable - cache busting
            if (isCachable === false) {
                url += (url.indexOf('?') < 0 ? '?' : '&') + 'tbUid=' + uid;
            }

            if (xmlreq) {
                var promise = new tb.Promise(function( resolve, reject ){
                    if ( ( method === 'GET' || method === 'DELETE' ) && params !== '') {
                        url = url + (url.indexOf('?') < 0 ? '?' : '&') + params;
                    }
                    xmlreq.src = url;

                    xmlreq.connection.open(method, url, isAsync);

                    if (isAsync === true) {
                        xmlreq.poll = handleReadyState(xmlreq, resolve, stateHandler, reject, pOptions);
                    }

                    // set request headers
                    Object
                        .keys( headers )
                        .forEach(
                            function( pHeaderVar ){
                                if (pHeaderVar !== 'Content-Type') {
                                    xmlreq.connection.setRequestHeader(pHeaderVar, headers[pHeaderVar]);
                                }
                            }
                        );

                    // abort functionality
                    if (timeout) {
                        xmlreq.timeoutTimer = window.setTimeout(

                            (function (pT, pR) {
                                var f = typeof pT.cb === 'function' ? pT.cb : false;
                                return function () {
                                    //if ( !myR && myR.connection.status == 4 ) { return; }
                                    if (typeof f === 'function') {
                                        f( /*createResponseObject(myR)*/ );
                                    }
                                    pR.connection.abort();
                                    window.clearInterval(pR.poll);
                                };
                            })(timeout, xmlreq), timeout.ms);
                    }

                    xmlreq.abort = ( function(xmlreq) {
                        return function () {
                            window.clearInterval(xmlreq.poll);
                            if (xmlreq.connection){
                                xmlreq.connection.abort();
                            }
                            release(xmlreq);
                        };
                    })( xmlreq );

                    // send
                    if (method === 'POST' || method === 'PUT') {
                        if (params !== '') {
                            xmlreq.connection.setRequestHeader('Content-Type', ct);
                            xmlreq.connection.send(params);
                        }
                        else {
                            xmlreq.connection.send(null);
                        }
                    }
                    else {
                        xmlreq.connection.send(null);
                    }
                    // if sync request direct handler call
                    if (isAsync === false) {
                        tb.request.dec();
                        if (xmlreq.connection.status >= 200 && xmlreq.connection.status < 300) {
                            resolve( createResponseObject( xmlreq, tb.extend( {}, pOptions ) ) );
                        }
                        else {
                            reject( createResponseObject( xmlreq, tb.extend( {}, pOptions ) ) );
                        }
                    }
                });

                promise
                    .then(function(pResult){
                        successHandler( pResult );
                    })
                    .catch(function(pResult){
                        errorHandler( pResult );
                    })
                    .finally(function(pResult){
                        finalHandler( pResult );
                    });

                return promise;
            }
            else {
                return false;
            }
        };

    })();
} else {
    // todo: implement module foreign request
}


/**
 @method tb.stop

 @param {boolean} pStopit - indicating whether to stop event handling

 @return {boolean} - true if event handling stopped, else false

 stops event handling

 */
tb.stop = (function(pStopIt){
    var stopIt = pStopIt;
    return function( pStopIt ){
        return (stopIt = ( !!pStopIt ? pStopIt : stopIt ) );
    };
})( false );


