/**
 twoBirds V8 core functionality

 @author          frank.thuerigen <frank_thuerigen@yahoo.de>
 @copyright       copyright (c) 2006- Frank Thürigen
 @license         GNU LGPL v3 - read LICENSE.txt

 */

// temporary vars

// POLYFILLS

// matches polyfill
this.Element && (function(ElementPrototype){
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function(selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
            while (nodes[++i] && nodes[i] !== node){}
            return !!nodes[i];
        };
})(Element.prototype); // jshint ignore:line

// closest polyfill
this.Element && (function(ElementPrototype){
    ElementPrototype.closest = ElementPrototype.closest ||
        function(selector) {
            var el = this;
            while (el.matches && !el.matches(selector)) {
                el = el.parentNode;
            }
            return el.matches ? el : null;
        };
})(Element.prototype); // jshint ignore:line

// twoBirds

tb = (function(){

    var internaltb;

    /**
     @class tb.Selector
     @constructor
     @extends tb

     @param {function|string|object|array} pSelector
     @param {domNode} [pDomNode] - optional, the DOM node in which to search 

     @returns {object} - the twoBirds instance you just created

     twoBirds selector constructor

     CAUTION: you may use this class directly if you know what you are doing,
     but the correct syntax for call is simply:

     @example

         tb( pSelector )
            .whateverChainedMethod(); // etc.

     HINT: tb() works as a selector, new tb() instanciates a twoBirds instance from a class.

     @example

         // get tB instances from DOM by css query selector
         tb( 'div' )            // any tbInstance that sits in a div dom node

         // get tB instances from DOM by constructor
         tb( app.sampleConstructor )     // any tbInstance in DOM that is instanceof sampleConstructor

         // get tB instances from DOM by regEx
         tb( /myRegEx/ )    // any tbInstance in DOM that has a namespace property that fits the regEx

         // get tB instances from DOM by array of selectors
         tb( [ 'body', /myRegEx/ ] )     // any combination of selectors in an array, result is additive, flat and unique

     */
    function TbSelector( pSelector, pDomNode ){
        var that = this;

        that.length = 0;

        if ( !pSelector || pSelector instanceof tb.Selector ){
            return that;
        } else if( pSelector instanceof tb ){
            [].push.call( that, pSelector );
            return that;
        }

        switch (typeof pSelector) {

            // selection by dom selector string
            case 'string':
                
                tb.dom( pSelector+'[data-tb]', pDomNode || document )
                    .forEach(
                        function ( pThisNode ) {
                            if ( !!pThisNode.tb ){
                                Object
                                    .keys( pThisNode.tb )
                                    .forEach(
                                        function( pKey ){
                                            [].push.call( that, pThisNode.tb[ pKey ] ); // push dom object to tb selector content
                                        }
                                    );
                            }
                        }
                    );
                break;

            case 'object':  // either regEx or nodeType

                if ( pSelector instanceof tb ){ // it is a twoBirds object

                    [].push.call( that, pSelector );
                    return that;

                }

                if ( pSelector instanceof RegExp ){ // it is a regular expression
                    tb.dom( '[data-tb]', pDomNode || document )
                        .forEach(
                            function ( pDomNode ) {
                                Object
                                    .keys( pDomNode.tb )
                                    .forEach(
                                        function( pKey ){
                                            var tbElement = pDomNode.tb[ pKey ];

                                            if ( tbElement instanceof tb
                                                && !!tbElement['namespace']
                                                && !!tbElement.namespace.match( pSelector )
                                            ){
                                                [].push.call( that, tbElement );
                                            }
                                        }
                                    );
                            }
                        );

                } else if ( !!pSelector['nodeType'] && !!pSelector['tb'] ){ // it is a dom node containing tb elements
                    Object
                        .keys( pSelector.tb )
                        .forEach(
                            function( pKey ){
                                [].push.call( that, pSelector.tb[ pKey ] );
                            }
                        );

                } else if ( pSelector.constructor === Array || !!pSelector['length']
                    && !!pSelector['0'] && !(pSelector instanceof Array)
                ){
                    // it is an array || array like object
                    [].forEach.call(
                        pSelector,
                        function( pThisSelector ){
                            var thisResult = tb( pThisSelector );
                            [].forEach.call(
                                thisResult,
                                function( pTbElement ){
                                    if ( -1 === [].indexOf.call( that, pTbElement ) ){
                                        [].push.call( that, pTbElement );
                                    }
                                }
                            );
                        }
                    );
                }

                break;

            // selection by constructor: get all tb instances from DOM,
            // check whether their prototype matches constructor prototype
            case 'function':

                tb.dom( '[data-tb]', pDomNode || document )
                    .map(
                        function ( pDomNode ) {
                            Object
                                .keys( pDomNode.tb )
                                .forEach(
                                    function( pKey ){
                                        var tbElement = pDomNode.tb[ pKey ];

                                        if ( !!tbElement
                                            && tbElement instanceof tb
                                            && tbElement instanceof pSelector
                                        ){
                                            [].push.call( that, tbElement );
                                        }
                                    }
                                );
                        }
                    );

                break;
        }

        return that;

    }

    // empty class def for temporary handler storage, needed for on(), one(), off() and trigger()
    function Nop(){}
    Nop.prototype = { namespace: 'Nop' };

    // HINT: TbSelector (class) prototype definition after Tb prototype definition

    /**
     @class tb
     @constructor

     @param {object} pOptions
     @param pOptions.pClass - class Namespace as string or class
     @param [pOptions.pConfig] - optional configuration, any type, preferrably object
     @param [pOptions.pTarget] - target to put object in, DOM node or any other object

     @returns {object} - the twoBirds instance you just created

     twoBirds constructor

     @example

         // put Instance into DOM node
         new tb(
             app.myConstructor,                                     // any constructor you want to have an instance of
             { ... },                                               // the config object you hand over to the constructor
             target.appendChild( document.createElement( 'span' ) ) // DOM node to insert the object item
         );

         // put Instance anywhere
         new tb(
             app.myConstructor,            // any constructor you want to have an instance of
             { ... },                      // the config object you hand over to the constructor
             anotherTbInstance             // any other object you want to put the tb instance in
         );

         // if a namespace STRING is given, requirement loading is done in case the class isnt present yet
         new tb(
             'app.myConstructor',          // namespace string for the constructor you want to have an instance of
             { ... },                      // the config object you hand over to the constructor
             anotherTbInstance             // any other object you want to put the tb instance in
         );

     */
    function tb() {
        var that = this;

        // merge handlers from temp instance into target object
        function mergeHandlers( pSourceTb , pTargetTb ){
            for ( var i in pSourceTb.handlers ) {
                if ( !pTargetTb.handlers[i] ){
                    pTargetTb.handlers[i] = [];
                }
                for ( var j = 0, l = pSourceTb.handlers[i].length; j < l; j++ ){
                    pTargetTb.handlers[i].push( pSourceTb.handlers[i][j] ); // copy handler
                }
            }
        }

        // instanciate tb instance OR return tb.Selector result set
        if ( that instanceof tb ) {    // called as constructor, create and return tb object instance
            var args = Array.from(arguments),
                isNamespace = typeof args[0] === 'string',
                isRootedNamespace = isNamespace && args[0].substr(0,1) === "/",
                fileName = isNamespace ? '/' + args[0].replace( /\./g, '/' ).replace( /^\//, '') + '.js' : '',
                tbClass =  isNamespace ? tb.namespace( args[0].replace( /^\//), '' ).get() : args[0],
                tbInstance,
                tempInstance; // empty tb object, used as handler store

            // namespace is a string and corresponding class doesnt exist in repo
            // -> do requirement loading
            // -> return temporary instance ( = instanceof Nop )
            if ( isNamespace && !tbClass ){
                tempInstance = new tb( Nop, args[1] || {}, args[2] || false ); // construct temp tb instance from empty constructor -> temp handler store

                tb.require(
                    fileName
                ).then(
                    (function( args ){          
                        return function(){

                            var thisTb = new tb(
                                args[0],
                                args[1] || {},
                                args[2] || false
                            );

                            if ( !!tempInstance ){

                                // copy properties from tempInstance, always shallow copy
                                for ( var i in tempInstance ) {
                                    if (
                                        (['handlers', 'target']).indexOf(i) === -1
                                        && tempInstance.hasOwnProperty(i)
                                    ){
                                        thisTb[i] = tempInstance[i];
                                    }
                                }

                                mergeHandlers( tempInstance, thisTb );

                            }

                        };
                    })( args )
                );

                return tempInstance; // return temp instance so handlers can be attached
            }

            // it is a constructor call, like "new tb(...)"
            if ( typeof tbClass === 'function' ){

                // prepare
                if ( !tbClass.__tb__ ){
                    Object.setPrototypeOf( tbClass.prototype, tb.prototype );
                    tbClass.__tb__ = 'V8';
                }

                // make a new instance of given constructor
                tbInstance = new tbClass( args[1] || {}, args[2] ); // hidden parameter target
                
                // prepare .namespace property of tb object
                if ( !tbInstance.namespace
                    && !( tbInstance instanceof Nop )
                ){
                    tbInstance.namespace = typeof args[0] === 'string'
                        ? args[0]
                        : args[0].namespace || tb.getId(); // if nothing helps, a unique id
                }

                // prepare .target property of tb object
                tbInstance.target = tbInstance['target'] || args[2] || false; // preset
                
                // if target was not set in constructor, try third parameter
                if ( !tbInstance.target ){

                    if ( !!args[2] ){

                        // get first element of an array-like selector return object
                        if ( !args[2]['nodeType']
                            && !!args[2][0]
                            && !!args[2][0]['nodeType']
                        ){
                            args[2] = args[2][0]; // jshint ignore:line
                        }

                        tbInstance.target = args[2];
                    }

                }
                
                // if target is a DOM element
                // - add class to DOM data
                // - if not already there add namespace to target data-tb attribute
                if ( !!tbInstance.target
                    && !!tbInstance.target['nodeType']
                    && !( tbInstance instanceof Nop )
                ){

                    // put tb instance in dom node
                    tbInstance.target.tb = tbInstance.target['tb'] || {};
                    tbInstance.target.tb[tbInstance.namespace] = tbInstance;

                    // if element does not reside in the DOM <head> add class
                    var dom = tb.dom( tbInstance.target );
                    if ( tbInstance.target.nodeName !== 'head'
                        && dom.parents().toArray().indexOf( document.head ) === -1
                        && tbInstance.target.tagName.split('').indexOf('-') === -1
                        && !!tbInstance['namespace']
                        && tbInstance.namespace.replace(/\./g, '-').toUpperCase() !== tbInstance.target.tagName
                    ){
                        dom.addClass( tbInstance.namespace.replace( /\./g, '-').toLowerCase() );
                    }

                    // add namespace to DOM "data-tb" attribute
                    if ( !!tbInstance.target && !!tbInstance.target['nodeType'] ){
                        var dataTb = tbInstance.target.getAttribute( 'data-tb' );
                        if ( !!dataTb && !!dataTb.length && -1 === dataTb.split(' ').indexOf( tbInstance.namespace ) ){
                            tbInstance.target.setAttribute( 'data-tb', dataTb + ' ' + tbInstance.namespace );
                        } else {
                            tbInstance.target.setAttribute( 'data-tb', tbInstance.namespace );
                        }
                    }
                }

                // create handlers array if necessary
                if ( !tbInstance.handlers ){
                    tbInstance.handlers = [];
                } else {
                    // if there are single named event handler functions,
                    // convert them to array of functions
                    for ( var i in tbInstance.handlers ) {
                        if ( typeof tbInstance.handlers[i] === 'function' ){
                            tbInstance.handlers[i] = [ tbInstance.handlers[i] ];
                        } else if ( !( tbInstance.handlers[i] instanceof Array ) ){
                            delete tbInstance.handlers[i];
                        }
                    }
                }

                if ( !( tbInstance instanceof Nop ) ){

                    var parentReadyHandler = function(ev){
                        tbInstance
                            .parent()
                            .trigger('ready');
                    };

                    tbInstance.on( 
                        'ready',
                        parentReadyHandler,
                        true
                    );

                    var parent = !!tbInstance.parent()[0] ? tbInstance.parent()[0] : false,
                        childReady = function(ev){
                            ev.stopImmediatePropagation();
                        };

                    childReady.once = true; 
                    
                    if ( parent ){
                        if ( !parent.handlers ){
                            parent.handlers = { ready: [] };
                        } else if ( !parent.handlers.ready ){
                            parent.handlers.ready = [];
                        }
                        parent.handlers.ready.unshift(childReady);
                    }

                    tbInstance.trigger( 'init' );
                    tbInstance.trigger( 'ready' );

                }

                return tbInstance;

            }

        } else { // arguments[0] is string or regex, return selector result

            return new TbSelector( 
                !!arguments[0] ? arguments[0] : undefined, 
                !!arguments[1] ? arguments[1] : undefined 
            );

        }

    }

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
            if ( cp.hasOwnProperty(pKey) && 
                cp[pKey] instanceof Object && 
                (cp[pKey]).constructor === Object 
            ){ // native Object
                pObj[pKey] = tb.extend( pObj[pKey] instanceof Object ? pObj[pKey] : {}, cp[pKey] ); // deep copy
            } else if ( cp.hasOwnProperty(pKey) && 
                cp[pKey] instanceof Object && 
                (cp[pKey]).constructor === Array 
            ){ // native Array
                pObj[pKey] = Array.from(cp[pKey]); // flat copy
            } else { // copy primitive or reference
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
     debounce function wrapper

     @memberof tb
     @static
     @method tb.debounce

     @param {function} pFunction - callback function to execute
     @param {number} pMilliseconds - milliseconds to wait before callback is executed

     @example
         // expect that to be this tb instance
         // append a debounced handler to the 'myEvent' event
         that.on(
            'myEvent', 
            tb.debounce(
                function(){
                    // that = tb instance
                    console.log('debounced "myEvent" handler inside', that);
                },
                500 // milliseconds
            )
         );
     */
    tb.debounce = function( pFunction, pMilliseconds ){
        var timeout;
        return function(){
            
            var that = this,
                args = arguments;

            clearTimeout( timeout );

            timeout = setTimeout(
                function(){
                    pFunction.apply( that, args );
                },
                pMilliseconds 
            );
        };
    };

    /**
     store function

     @memberof tb
     @static
     @method tb.store

     @param {object} pObj - object to put the store in
     @param {string} pName - property name of store
     @param {string} pConfig - the initial set of properties in a hash object

     @return {object} - the store instance

     the returned store has one method, .observe( myCallbackFunction )

     you can use this method to react on changes in the store

     CAVEAT: the store .observe is debounced to accomodate for bulk changes!

     @example
         
         //
         // EXAMPLE 1: using late binding
         //

         tb.store(
         
             that,   // the instance
             'store',    // the property name -> that.store
             $( 'form', that.target ).values()   // initial values
         
         ).bind( // assuming there are some {placeholder}s in that DOM node descendants attributes or text nodes

             that.target

         );

         // any change in the store from now on will update the {placeholder}s     

         // change complete store:
         that.store = { 
            somePlaceHolder: 'someStringValue' 
         };

         // or a property within the store:
         that.store.somePlaceholder = 'someOtherStringValue';




         //
         // EXAMPLE 2: using the observe function
         // expect that to be a tbInstance containing a form
         //


         tb.store(
         
             that,   // the instance
             'store',    // the property name -> that.store
             $( 'form', that.target ).values()   // initial values
         
         ).observe(
             
             // 1 way data flow
             function( pStoreValues ){
                 
                 // do something with the store values
                 // e.g. update some part of the DOM

                 console.log( Object.assign( {}, pStoreValues ) );  // convert to plain object

                 // other than that you can extract properties like so:

                 var a = pStoreValues.myProperty;

             }
         
         );

         // update the store whenever the form values change
         // 2 way data binding
         
         $( 'form', that.target )
            on(
                'change select',
                function(ev){
                    tb.extend( 
                        that.store, 
                        $( 'form', that.target ).values() 
                    ); 
                    ev.stopPropagation();
                }
            );

     */
    tb.store = (function(){

        function Store( pConfig ){

            var that = this,
                observable = Symbol('observable'),
                onChange = Symbol('onChange'),
                config = pConfig || {};

            // make anonymous property
            that[observable] = tb.observable(false);

            // must be debounced for looped property changes like
            // ... tb.extend( store, $('form').values() );
            that[onChange] = tb.debounce(
                function(){
                    that[observable]( tb.extend( {}, that ) );
                },
                0
            );

            tb.extend( that, config );

        }

        // these are prototypal methods, since the prototype is a Proxy instance
        Store.methods = {

            observe: function( pCallback, pOnce ){

                var that = this;

                that[Object.getOwnPropertySymbols(that)[0]].observe( pCallback, pOnce );

            },

            bind: function( pDomNode ){
                var that = this;
                
                function walk( pDomNode ){

                    if ( !!pDomNode['nodeType'] && pDomNode.nodeType === 3 ){ // text node
                        var placeholders = pDomNode.nodeValue.match( /\{[^\{\}]*\}/g );

                        if (!!placeholders){
                            
                            var f=(function( pTemplate ){
                                return function( pValues ){
                                    var t,
                                        changed = false;
                                    placeholders.forEach(function(pKey){
                                        if ( f.values[pKey] !== pValues[pKey] ){
                                            f.values[pKey] = pValues[pKey];
                                            changed = true;
                                        }
                                    });
                                    if (changed){ // only reflow if changed
                                        t = pTemplate;
                                        pDomNode.nodeValue = tb.parse(
                                            t,
                                            f.values
                                        );
                                    }
                                };
                            })( pDomNode.nodeValue );

                            f.values = {};
                            placeholders = Array.from( placeholders ).map((pKey) => pKey.substr(1,pKey.length-2)); 
                            placeholders.forEach(function(pKey){
                                f.values[pKey] = "";
                            });
                            
                            that[Object.getOwnPropertySymbols(that)[0]].observe(f);

                        }
                    }

                    if ( !!pDomNode['nodeType'] && pDomNode.nodeType === 1 ){ // HTML element

                        Array.from( pDomNode.attributes )
                            .forEach(
                                function( pAttributeNode ){

                                    var placeholders = pAttributeNode.value.match( /\{[^\{\}]*\}/g );

                                    if (!!placeholders){

                                        var f=(function( pTemplate ){
                                            return function( pValues ){
                                                var t,
                                                    changed = false;
                                                placeholders.forEach(function(pKey){
                                                    if ( f.values[pKey] !== pValues[pKey] ){
                                                        f.values[pKey] = pValues[pKey];
                                                        changed = true;
                                                    }
                                                });
                                                if (changed){ // only reflow if changed
                                                    t = pTemplate;
                                                    tb.dom(pDomNode).attr(
                                                        pAttributeNode.nodeName,
                                                        tb.parse(
                                                            t,
                                                            f.values
                                                        )
                                                    );
                                                }
                                            };
                                        })( pAttributeNode.value );

                                        f.values = {};
                                        placeholders = Array.from( placeholders ).map((pKey) => pKey.substr(1,pKey.length-2)); 
                                        placeholders.forEach(function(pKey){
                                            f.values[pKey] = "";
                                        });

                                        that[Object.getOwnPropertySymbols(that)[0]].observe(f);

                                    }
                                }
                            );

                        Array.from( pDomNode.childNodes )
                            .forEach(function( pChildNode ){
                                walk( pChildNode );
                            });

                        that[Object.getOwnPropertySymbols(that)[0]].notify();

                    }
                }

                walk( pDomNode );

            }

        };

        // prototype is a proxy
        Store.prototype = new Proxy(
            Store.methods, 
            {

                get: function(pObj, pProp, pReceiver) {
                    
                    if (Store.methods[pProp]){
                        return Store.methods[pProp];
                    }

                    if ( pProp in pReceiver === false && pProp in pObj === false ){
                        
                        var value = new tb.Store();  // internal value

                        Object.defineProperty(
                            pReceiver,
                            pProp,
                            {
                                enumerable: true,
                                get: function(){
                                    return value;
                                },
                                set: function( pValue ){
                                    if ( !!pValue 
                                        && typeof pValue === 'object' 
                                        && !!pValue.constructor 
                                        && pValue.constructor === Object 
                                    ){
                                        if ( value instanceof Store ){
                                            for ( var key in value ){
                                                delete value[ key ];
                                            } 
                                            tb.extend( value, pValue );
                                        } else {
                                            value = new Store( pValue );
                                        }
                                    } else {
                                        value = pValue;
                                    }

                                    setTimeout(function(){
                                        if(!!Object.getOwnPropertySymbols(pReceiver)[1]){
                                            pReceiver[Object.getOwnPropertySymbols(pReceiver)[1]](); // onChange debounced function
                                        }
                                    }, 0);

                                    return value;
                                }
                            }
                        );                

                    }

                    return pReceiver[pProp];
                },

                set: function(pObj, pProp, pValue, pReceiver){

                    var ret,
                        args = Array.from(arguments);

                    if ( typeof pValue === 'object' 
                        && pValue.constructor === Object 
                        && pValue.constructor.prototype === Object.prototype 
                    ){

                        if ( pReceiver[pProp] instanceof Store ){
                            for ( var key in pReceiver[pProp] ){
                                delete pReceiver[pProp][ key ];
                            } 
                            tb.extend( Store, pValue );
                        } else {
                            args[0] = pReceiver;
                            args[2] = new Store( pValue );
                        }
                        
                    }

                    setTimeout(function(){
                        if(!!Object.getOwnPropertySymbols(pReceiver)[1]){
                            pReceiver[Object.getOwnPropertySymbols(pReceiver)[1]](); // onChange debounced function
                        }
                    }, 0);

                    ret = Reflect.set(...args);

                    return ret;
                }

            }
        );

        tb.Store = Store;
        
        function makeStore( pObj, pName, pConfig ){

            var value = new Store( pConfig );

            // insert store into target object
            Object.defineProperty(
                pObj,
                pName,
                {
                    enumerable: true,
                    writeable: true,
                    get: function(){
                        return value;
                    },
                    set: function( pValue ){
                        for ( var key in value ){
                            delete value[ key ];
                        } 
                        tb.extend( value, pValue );
                        return value;
                    }
                }
            );

            return pObj[pName];
        }

        makeStore.Store = Store;

        return makeStore;

    })();

    /**
     tb.observable()) function
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
         // also they return the observable itself for chaining purposes, NOT THE VALUE
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
                return observableFunction.notify();
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
                        } else {    // it is a getter
                            return tb.namespace( p1, observedValue ).get();
                        }
                    } else if ( typeof p1 === 'object' && typeof p2 === 'undefined' ){
                        observedValue = p1;
                        notify();
                    } else {
                        console.warn('tb.observable() set value: parameter 1 should be a string or object if observed data is an object!');
                    }
                } else {
                    if ( typeof p1 !== 'undefined' ){
                        // value has changed
                        observedValue = p1;
                        notify();
                    } else {    // it is a getter
                        return observedValue;
                    }
                }
            } else {
                return observedValue;
            }

            // it was a setter functionality, so return the observable itself for chaining
            // getters return the value directly (see above)
            return observableFunction;
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

            return observableFunction; // chaining
        };

        // enable/disable notifications
        observableFunction.enableNotify = function( pEnableNotify ){
            enableNotify = pEnableNotify === false ? false : true;

            return observableFunction; // chaining
        };

        // function used to add a callbacks
        observableFunction.observe = function( pFunction, pOnce ){

            if ( typeof pFunction === 'function' ){
                pFunction.once = pOnce || false;
                observableFunction.notifiers.push( pFunction );
            }

            return observableFunction; // chaining
        };

        return observableFunction;
    };

    internaltb = tb;

    tb.Selector = TbSelector; // make official, e.g. for events

    /**
      walk all pSelector tb objects, call pMethodName on them
      return a UNIQUE TbSelector result set containing all single results

      @function walkSelector
      @private

      @param {object} pSelectorObject - instanceOf TbSelector
      @param {string} pMethodName - name of method to call
      @param {*} [pArguments] - arguments

      @return {object} instance of TbSelector
     */
    function walkSelector( pSelectorObject, pMethodName, pArguments ){
        var that = this,
            instances = Array.from( pSelectorObject ),
            args = Array.from( pArguments ),
            ret = tb(); // empty tb selector object

        //console.log('pSelectorObject', pSelectorObject);
        if ( pSelectorObject instanceof TbSelector ) {
            //console.log('-> Array', Array.from(pSelectorObject) );
            instances
                .forEach( function walkSelectorEach( pInstance ) {
                    var result = pInstance[pMethodName]( ...args );
                    if ( result instanceof TbSelector ) {
                        Array
                            .from(result)
                            .forEach(function(pResultInstance){
                                if ( [].indexOf.call( ret, pResultInstance ) === -1 ){
                                    [].push.call( ret, pResultInstance );
                                }
                            });
                    }
                });

        }
        //console.log('<- result', Array.from(ret) );
        return ret;
    }

    function _mapArrayMethod( pMethodName ){
        var method = [][pMethodName];

        if ( -1 < ([ 'pop', 'push', 'unshift', 'shift', 'splice' ]).indexOf( pMethodName ) ){ // self-muting methods
            return function(){
                var that = this,
                    ret = method.apply( that, arguments );

                return !!ret ? ( ret instanceof Array ? tb( ret ) : ret ) : that;
            };
        } else {
            return function(){
                var that = this,
                    ret = method.apply( that.toArray(), arguments );

                if ( ret instanceof Array ){
                    return that.flush().add( ret );
                }

                return ret;
            };
        }

    }

    tb.methods = (function(){
        // private static

        return {
            // public methods and properties

            /**
              @method trigger
              @chainable

              @param {string} pEvent - name of event OR tb.Event instance (in this case the only parameter)
              @param [pEventData] - event data, usally an object
              @param {string} [pBubble=l] - bubbling indicator : 'l' = local, 'u' = up, 'd' = down - or any combination

              @return {object} - tb.Selector instance or tB instance - for chaining

              trigger method

              triggers an asynchronous twoBirds event, optionally with data and bubble indicator

             */
            trigger: function( pEvent, pEventData, pBubble ){
                var that = this,
                    tbEvent;

                if( tb.stop() ){ // @todo rethink this
                    return;
                }

                // construct event if necessary
                tbEvent = pEvent instanceof tb.Event ? pEvent : new tb.Event( pEvent, pEventData, pBubble );

                // if event __stopped__ , handling is cancelled
                if ( tbEvent.__stopped__ || tbEvent.__immediateStopped__ ) {
                    return that;
                }

                // execute local handlers
                if ( that instanceof TbSelector && !!that['length'] ) {

                    [].forEach.call(
                        that,
                        function( tbInstance ){
                            if ( !!tbInstance
                                && tbInstance instanceof tb
                                && !tbEvent.__immediateStopped__
                            ){
                                tbInstance.trigger( tbEvent );
                            }
                        }
                    );

                } else if ( that instanceof tb ) { // it must be a native tb object

                    if ( that instanceof Nop
                        && tbEvent.name !== 'init'
                    ){
                        // its an object that was not loaded yet
                        that.one(
                            'init',
                            function lazyHandler(){
                                var that = this;

                                that.trigger( tbEvent );
                            }
                        );
                        return that;
                    }

                    // local handlers
                    if ( that instanceof tb 
                        && !!that.handlers 
                        && !!that.handlers[tbEvent.name] 
                        && tbEvent.bubble.indexOf( 'l' ) > -1 
                    ){

                        that.handlers[tbEvent.name] = that.handlers[tbEvent.name]
                            .reduce(function( pHandlers, pHandler ){
                                if ( tbEvent.bubble.indexOf('l') > -1
                                    && !!pHandler
                                ){
                                    try{
                                        if (!tbEvent.__immediateStopped__){
                                            pHandler.apply(that, [tbEvent]);
                                        } else {
                                            pHandlers.push( pHandler );
                                        }
                                    } catch (e){
                                        console.error(e);
                                    }

                                    if ( !pHandler.once && !tbEvent.__immediateStopped__ ) {
                                        pHandlers.push( pHandler );
                                    }                                }
                                return pHandlers;
                            }, []);

                            if (!that.handlers[tbEvent.name].length){
                                delete that.handlers[tbEvent.name];
                            }
                    }

                    // if event __stopped__ , handling is cancelled
                    if ( !!tbEvent.__stopped__  ) {
                        return that;
                    }

                    setTimeout(
                        function(){

                            // bubble up
                            if ( tbEvent.bubble.indexOf('u') > -1 ){
                                that
                                    .parent()
                                    .trigger(
                                        new tb.Event(
                                            tbEvent.name,
                                            tbEvent.data,
                                            'lu'
                                        ));
                            }

                            // bubble down
                            if ( tbEvent.bubble.indexOf('d') > -1 ){
                                [].forEach.call(
                                    that.children(),
                                    function( tbObject ){
                                        tbObject.trigger(
                                            new tb.Event(
                                                tbEvent.name,
                                                tbEvent.data,
                                                'ld'
                                            )
                                        );
                                    }
                                );
                            }

                        },
                        0
                    );

                }

                return that;

            },

            /**
             @method on
             @chainable

             @param {string} pEventName - name of the handler function
             @param {function} pHandler - the function to be added to the handler array
             @param {boolean} [pOnce=false] - true = remove handler after first call, false = keep handler

             @return {object} - tb.Selector instance or tB instance - for chaining

             .on() method

             adds a handler to a twoBirds instance or a tb.Selector result set
             */
            on: function( pEventName, pHandler, pOnce ){

                var that = this,
                    eventNames;

                //console.log( 'on', pEventName, pHandler, pOnce );

                if ( that instanceof TbSelector ) {

                    walkSelector( that, 'on', Array.from(arguments) );

                } else if ( that instanceof tb ) { // either a toplevel or an internal tb object

                    if ( -1 < pEventName.indexOf(' ') ){
                        eventNames = pEventName.split(' ');
                    } else {
                        eventNames = [ pEventName ];
                    }
                    pHandler.once = !!pHandler.once || !!pOnce;

                    eventNames.forEach(
                        function(pThisEventName){

                            if ( !Reflect.get( that, 'handlers' ) ){
                                that.handlers = {};
                            }

                            if ( !Reflect.get( that.handlers, pThisEventName ) ){
                                that.handlers[ pThisEventName ] = [ pHandler ];
                            } else {
                                that.handlers[ pThisEventName ].push( pHandler );
                            }

                        }
                    );

                }

                return that;

            },

            /**
             @method one
             @chainable

             @param {string} pEventName - name of the handler function
             @param {function} pHandler - the function to be added to the handler array

             @return {object} - tb.Selector instance or tB instance - for chaining

             .one() method

             adds a handler to a twoBirds instance or a tb.Selector result set,
             to be called only once when the event fires
             afterwards the handler is deleted from the event handler list
             */
            one: function( pEventName, pHandler ){

                var that = this;

                that.on( pEventName, pHandler, true ); // add event handler that will be deleted after first execution

                return that;

            },

            /**
             @method off
             @chainable

             @param {string} pEventName - name of the handler function
             @param {function} pHandler - the function to be added to the handler array

             @return {object} - tb.Selector instance or tB instance - for chaining

             .off() method

             removes a handler from a twoBirds instance or a tb.Selector result set
             afterwards the handler is deleted from the event handler list
             */
            off: function( pEventName, pHandler ){

                var that = this,
                    index,
                    eventNames;

                if ( typeof pEventName === 'undefined' ){
                    return that;
                }

                if ( that instanceof TbSelector ) {

                    walkSelector( that, 'off', arguments );

                } else if ( that instanceof tb ) { // either a toplevel or an internal tb object

                    if ( -1 < pEventName.indexOf(' ') ){
                        eventNames = pEventName.split(' ');
                    } else {
                        eventNames = [ pEventName ];
                    }

                    //console.log( 'off', that instanceof tb, that, eventNames, pHandler );

                    eventNames
                        .forEach(

                            function(pThisEventName){

                                if ( !!that.handlers[ pThisEventName ] ){
                                    if ( typeof pHandler !== 'undefined' ){
                                        index = that.handlers[ pThisEventName ].indexOf( pHandler );

                                        while ( index > -1 ){
                                            that.handlers[ pThisEventName ].splice( index, 1 );

                                            index = that.handlers[ pThisEventName ].indexOf( pHandler );

                                            if ( that.handlers[ pThisEventName ].length === 0 ){ // remove array if empty
                                                that.handlers[ pThisEventName ] = null;
                                                delete that.handlers[ pThisEventName ];
                                            }

                                        }
                                    } else { // remove all handlers
                                        that.handlers[ pThisEventName ] = null;
                                        delete that.handlers[ pThisEventName ];
                                    }
                                }
                            }
                        );

                }

                return that;

            },

            /**
             @method parents
             @chainable

             @param [pSelector] - any type of tb.Selector parameter

             @return {object} - tb.Selector instance - for chaining

             .parents() method

             for each this[0...n] or this as tb() instance,
             - get all parent tb objects
             - check them against the filter param pSelector
             - return them as a TbSelector result set (unique)
             */
            parents: function( pSelector ){
                var that = this,
                    ret = tb();

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'parents', arguments );

                } else if ( that instanceof tb
                    && !!that.target
                ){ // it is a tb object

                    if ( !!that.target['nodeType'] ){
                        // it must be a native toplevel tb object residing in the DOM
                        tb.dom( that.target )
                            .parents( '[data-tb]' )
                            .not( 'html' )
                            .forEach(
                                function( pElement ){
                                    if ( !!pElement && !!pElement['tb'] ){
                                        Object
                                            .keys( pElement.tb )
                                            .forEach(
                                                function( pKey ){
                                                    // push dom object to tb selector content
                                                    [].push.call( ret, pElement.tb[pKey] );
                                                }
                                            );
                                    }
                                }
                            );

                    } else if ( that.target instanceof tb ){
                        // it a tb object embedded in another tb object

                        [].push.call( ret, that.target ); // push parent object to tb selector content

                        if ( !!that.target.parent()['0'] ){
                            [].push.call( ret, that.target.parent()['0'] );
                        }

                    }


                }

                return pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             @method parent
             @chainable

             @param [pSelector] - any type of tb.Selector parameter

             @return {object} - tb.Selector instance - for chaining

             .parent() method

             for each this[0...n] or this as tb() instance,
             - get closest parent tb object
             - check all of them against the filter param pSelector
             - return TbSelector result set (unique)
             */
            parent: function( pSelector ){

                var that = this,
                    ret = tb();

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'parent', arguments );

                } else if ( that instanceof tb
                    && !!that.target
                ){

                    if ( !!that.target['nodeType'] ) { // tb object resides in DOM

                        var tbParents = that.parents().toArray(),
                            tbParent = !!tbParents['0'] ? tbParents[0] : false;

                        if ( !tbParent ) {
                            return ret;
                        } // no parent -> empty result set

                        Object
                            .keys(tbParent.target.tb || {})
                            .forEach(function( pKey ){
                                [].push.call( ret, tbParent.target.tb[pKey] ); // push dom object to tb selector content
                            });

                    } else if ( that.target instanceof tb ){ // it is an embedded object, local target is another (parent) tb object

                        [].push.call( ret, that.target ); // push parent object to tb selector content

                    }

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

            /**
             @method descendants
             @chainable

             @param [pSelector] - any type of tb.Selector parameter

             @return {object} - tb.Selector instance - for chaining

             .descendants() method

             for each this[0...n] or this as tb() instance,
             - get all descendants of tb object
             - check them against the filter param pSelector
             - return TbSelector result set (unique)
             */
            descendants: function( pSelector, pLocalOnly ){

                var that = this,
                    ret = tb();

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'descendants', arguments );

                } else if ( that instanceof tb && !!that.target['nodeType'] && !pLocalOnly ) { // it must be a native tb object

                    tb.dom( '[data-tb]', that.target )
                        .forEach(
                            function( pDomNode ) {
                                Object
                                    .keys( pDomNode.tb )
                                    .forEach(function( pKey ){
                                        [].push.call( ret, pDomNode.tb[ pKey ] ); // push dom object to tb selector content
                                    });
                            }
                        );

                } else if ( that instanceof tb && !!pLocalOnly ){ // walk descendants
                    // HINT: if tbInstances are stacked inside each other, only props in "this" will be copied
                    //       ...not those defined in the constructor.prototype ( like 'tb.Require' )
                    Object
                        .keys( that )
                        .forEach(function( pKey ){
                            if ( pKey !== 'target' && that[pKey] instanceof tb ) {
                                [].push.call( ret, that[pKey]); // push tb object to tb selector content

                                var desc = tb.dom().toArray.call( that[pKey].descendants( '', true ) );

                                for ( var j=0, l=desc.length; j<l; j++ ){
                                    [].push.call( ret, desc[j]); // push tb object to tb selector content
                                }
                            }
                        });
                }

                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             @method children
             @chainable

             @param [pSelector] - any type of tb.Selector parameter
             @param {boolean} [pLocalOnly] - only local children of given tb instance(s)

             @return {object} - tb.Selector instance - for chaining

             .children() method

             for each this[0...n] or this as tb() instance,
             - get all direct children of tb object
             - check them against the filter param pSelector
             - return TbSelector result set (unique)
             */
            children: function( pSelector, pLocalOnly ){

                var that = this,
                    ret = tb(),
                    args =  Array.from(arguments),
                    pLocalOnly = typeof module !== 'undefined' ? true : pLocalOnly; // jshint ignore:line

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'children', args );

                } else if ( that instanceof tb 
                    && !!that.target['nodeType'] 
                    && !pLocalOnly 
                ){ // it must be a native tb object
                    var id = tb.getId(),
                        selector = tb.dom('[data-tb]', that.target),
                        notSelector = '[data-tempid="'+id+'"] [data-tb] [data-tb]';

                    // set temporary id for tb.dom/.querySelectorAll()
                    tb.dom( that.target )
                        .attr( 'data-tempid', id );

                    selector // all descendants
                        .not( notSelector ) // but not those that are below level 1
                        .forEach(
                            function( pDomNode, pIndex, pList ) {
                                if ( !!pDomNode['tb'] ){
                                    Object
                                        .keys( pDomNode.tb )
                                        .forEach(function( pKey ){
                                            [].push.call( ret, pDomNode.tb[ pKey ] ); // push dom object to tb selector content
                                        });
                                }
                            }
                        );

                    // remove temporary id
                    tb.dom( that.target )
                        .removeAttr( 'data-tempid' );

                } else if ( !!pLocalOnly ){

                    for ( var i in that ){
                        if ( that.hasOwnProperty(i) && that[i] instanceof tb ){
                            [].push.call( ret, that[i] ); // push tb object to tb selector content
                        }
                    }

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             @method next
             @chainable

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             next() method

             for each this[0...n] or this as tb() instance,
             - get the direct following sibling of tb instance
             - check it against the filter param pSelector
             - return TbSelector result set (unique)
             */
            next: function( pSelector ){

                var that = this,
                    ret = tb(), // empty tb selector object
                    result,
                    index;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'next', arguments );

                } else { // it must be a native tb object

                    result = that.parent().children();
                    index = [].indexOf.call( result, that );

                    if ( result.length > index + 1 ) {
                        [].push.call( ret, result[ index + 1 ] ); // push dom object to tb selector content
                    }

                }
                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             @method prev
             @chainable

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             prev() method

             for each this[0...n] or this as tb() instance,
             - get the direct previous sibling of tb instance
             - check it against the filter param pSelector
             - return TbSelector result set (unique)
             */
            prev: function( pSelector ){

                var that = this,
                    ret = tb(), // empty tb selector object
                    result,
                    index;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'prev', arguments );

                } else { // it must be a native tb object

                    result = this.parent().children();
                    index = [].indexOf.call( result, this );

                    if ( index ) {
                        [].push.call( ret, result[ index - 1 ] ); // push dom object to tb selector content
                    }

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

            /**
             @method first
             @chainable

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             first() method

             for each this[0...n] or this as tb() instance,
             - get the first child of the tb object parent
             - check it against the filter param pSelector
             - return TbSelector result set (unique)
             */
            first: function( pSelector ){

                var that = this,
                    ret = tb(),
                    result;

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( this, 'first', arguments );

                } else { // it must be a native tb object

                    result = this.parent().children();
                    [].push.call( ret, result[ 0 ] ); // push dom object to tb selector content

                }

                return !!pSelector ? ret.filter( pSelector ) : ret;

            },

            /**
             @method last
             @chainable

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             last() method

             for each this[0...n] or this as tb() instance,
             - get the last child of the tb object parent
             - check it against the filter param pSelector
             - return TbSelector result set (unique)
             */
            last: function( pSelector ){
                var that = this,
                    ret = tb(),
                    result;

                if ( that instanceof TbSelector ) {
                    ret = walkSelector( this, 'last', arguments );
                } else {
                    result = this.parent().children();
                    [].push.call( ret, result[ result.length - 1 ] ); // push dom object to tb selector content
                }
                return !!pSelector ? ret.filter( pSelector ) : ret;
            },

            /**
             @method toArray

             @return {array} - TbSelector elements in a plain array

             toArray() method
             */
            toArray: function(){
                var that = this;

                return Array.from( that );
            },

            /**
             @method filter
             @chainable

             @param [pParam] - any kind of TbSelector parameter

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             filter() method

             for each this[0...n] or this as tb() instance,
             - check them against the filter param pParam
             - return TbSelector result set (unique)
             */
            filter: function( pSelector ){

                var that = this,
                    compare = tb( pSelector ), // object array to check against
                    ret = tb();

                if ( !pSelector ) {
                    return that;
                }

                if ( that instanceof TbSelector ) {
                    [].forEach.call(
                        that,
                        function( tbObject ) {
                            if ( -1 < [].indexOf.call( compare, tbObject ) ){
                                [].push.call( ret, tbObject );
                            }
                        }
                    );
                } else if ( that instanceof tb ){
                    if ( -1 < [].indexOf.call( compare, that ) ){
                        [].push.call( ret, that );
                    }
                }

                return ret;
            },

            /**
             @method not
             @chainable

             @param [pParam] - any kind of TbSelector parameter

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             not() method

             for each this[0...n] or this as tb() instance,
             - check them against pSelector and remove all that match
             - return TbSelector result set (unique)
             */
            'not': function( pSelector ){

                var that = this,
                    compare = Array.from( tb( pSelector ) ), // object array to check against
                    ret = tb();

                [].forEach.call(
                    that,
                    function( pTbInstance ) {
                        if ( compare.indexOf( pTbInstance ) === -1 ){
                            [].push.call( ret, pTbInstance );
                        }

                    }
                );

                return ret;
            },

            /**
             @method add
             @chainable

             @param [pParam] - any kind of TbSelector parameter

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             add() method

             add elements to current result set
             - return TbSelector result set (unique)
             */
            add: function( pSelector ){

                var that = this,
                    add = tb( pSelector ).toArray(), // object array to check against
                    ret = that.toArray();

                return tb( ret.concat( add ) );
            },

            /**
             @method flush
             @chainable

             @return {object} - mpty tb.Selector instance - for chaining

             flush() method

             empty current result set
             - return empty TbSelector result set
             */
            flush: function(){

                var that = this;

                if ( that instanceof TbSelector ){
                    while ( that.length ){
                        that.pop();
                    }
                }
                return that;
            }

        };

    })();

    var proxy = new Proxy(
        tb.Store.methods, 
        {

            get: function(pObj, pProp, pReceiver) {
                
                var args = Array.from(arguments);

                //console.log( 'tb.get', ...args );

                if ( !Reflect.get( ...args ) ){
                    
                    var value = new tb.Store();  // internal value
                    
                    Object.defineProperty(
                        pReceiver,
                        pProp,
                        {
                            enumerable: true,
                            get: function(){
                                return value;
                            },
                            set: function( pValue ){
                                if ( typeof pValue === 'object' && pValue.__proto__ === Object.prototype ){ // jshint ignore:line
                                    if ( value instanceof tb.Store ){
                                        for ( var key in value ){
                                            delete value[ key ];
                                        } 
                                        tb.extend( value, pValue );
                                    } else {
                                        value = new tb.Store( pValue );
                                    }
                                } else {
                                    value = pValue;
                                }

                                setTimeout(function(){
                                    if(!!Object.getOwnPropertySymbols(pReceiver)[1]){
                                        pReceiver[Object.getOwnPropertySymbols(pReceiver)[1]](); // onChange debounced function
                                    }
                                }, 0);

                                return value;
                            }
                        }
                    );                

                }

                return Reflect.get( ...args );
            },

            set: function(pObj, pProp, pValue, pReceiver){

                var ret,
                    args = Array.from(arguments);

                //console.log( 'tb.set', ...args );

                if ( pProp !== 'handlers' && typeof pValue === 'object' ){

                    if ( pReceiver[pProp] instanceof tb.Store && pValue.__proto__ === Object.prototype ){ // jshint ignore:line
                        for ( var key in pReceiver[pProp] ){
                            delete pReceiver[pProp][ key ];
                        } 
                        tb.extend( pReceiver[pProp], pValue );
                    } else {
                        args[0] = pReceiver;
                        //args[2] = new tb.Store( pValue );
                    }
                    
                }

                ret = Reflect.set(...args);

                setTimeout(function(){
                    if(!!Object.getOwnPropertySymbols(pReceiver)[1]){
                        pReceiver[Object.getOwnPropertySymbols(pReceiver)[1]](); // onChange debounced function
                    }
                },0);

                return ret;
            }

        }
    );

    Object.setPrototypeOf( tb.methods, proxy );
                    
    //console.log('methods', methods);
    //console.log('proxy', proxy);
    tb.prototype = tb.methods;
    //console.log('tb.prototype', tb.prototype);

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

            if ( tb.status.loadCount() === 0 ){

                var tf = function(){

                    if ( tb.status.loadCount() === 0 ){ // loadCount is (still) 0
                        if (
                            tb.status.loadCount.lastChanged === tf.lastChanged // it is still the previous '0' loadcount
                        ){
                            // system is still idle
                            if ( typeof pCallback === 'function'){
                                pCallback();
                            }
                        } else {
                            // probably not idle -> retry in 50 ms
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

    TbSelector.prototype = {
        /**
         @method concat
         @chainable

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/concat">concat</a>
         */
        concat: _mapArrayMethod( 'concat' ),

        /**
         @method every
         @chainable

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/every">every</a>
         */
        every: _mapArrayMethod( 'every' ),

        /**
         @method forEach
         @chainable

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach">forEach</a>
         */
        forEach: _mapArrayMethod( 'forEach' ),

        /**
         @method indexOf

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf">indexOf</a>
         */
        indexOf: _mapArrayMethod( 'indexOf' ),

        /**
         @method map

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/map">map</a>
         */
        map: _mapArrayMethod( 'map' ),

        /**
         @method pop

         @return {object} - tb instance

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/pop">pop</a>
         */
        pop: _mapArrayMethod( 'pop' ),

        /**
         @method push

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/push">push</a>
         */
        push: _mapArrayMethod( 'push' ),

        /**
         @method reduce

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce">reduce</a>
         */
        reduce: _mapArrayMethod( 'reduce' ),

        /**
         @method reduceRight

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight">reduceRight</a>
         */
        reduceRight: _mapArrayMethod( 'reduceRight' ),

        /**
         @method reverse

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse">reverse</a>
         */
        reverse: _mapArrayMethod( 'reverse' ),

        /**
         @method shift

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/shift">shift</a>
         */
        shift: _mapArrayMethod( 'shift' ),

        /**
         @method slice

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice">slice</a>
         */
        slice: _mapArrayMethod( 'slice' ),

        /**
         @method some

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some">some</a>
         */
        some: _mapArrayMethod( 'some' ),

        /**
         @method splice

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">splice</a>
         */
        splice: _mapArrayMethod( 'splice' ),

        /**
         @method unshift

         @return {object} - tb.dom() result set, may be empty

         inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift">unshift</a>
         */
        unshift: _mapArrayMethod( 'unshift' ),

    };

    //console.log( 'methods', Object.keys(methods), methods );
    tb.extend( TbSelector.prototype, tb.methods );
    //console.log( 'TbSelector.prototype', Object.keys(TbSelector.prototype), TbSelector.prototype );

    /**
     @method unique
     @chainable

     @return {object} - tb.dom() result set, may be empty

     force this tb() result set to be unique

     ( being called after using methods inherited from array, force uniqueness )
     */
    TbSelector.prototype.unique = function() {
        var that = this,
            result = [];

        [].forEach.call(
            that,
            function ( pElement ) {
                if ( result.indexOf( pElement ) === -1 ){
                    result.push( pElement );
                }
            }
        );

        return tb.dom( result );
    };

    tb.plugin = (function( internalProto ) {
        return function (pMethodName, pFunction) {
            var p = internalProto;

            if (!p[pMethodName]) {
                p[pMethodName] = pFunction;
            } else {
                console.warn('tb.plugin(): Cannot overload existing tb method (', pMethodName, ')');
            }

        };
    })( internaltb.prototype );

    return tb;

})();

// make it a node module
if (typeof module !== 'undefined') {
    module.exports = tb;
} else {
    /**
     * document.ready bootstrap
     */
    (function(){

        function domReady () {
            // find all tb head & body nodes and add tb objects if not yet done
            tb.attach( document.head );
            tb.attach( document.body );
        }

        // Mozilla, Opera, Webkit
        if ( document.addEventListener ) {
            document.addEventListener( "DOMContentLoaded", function(){
                document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
                domReady();
            }, false );

            // If IE event model is used
        } else if ( document.attachEvent ) {
            // ensure firing before onload
            document.attachEvent("onreadystatechange", function(){
                if ( document.readyState === "complete" ) {
                    document.detachEvent( "onreadystatechange", arguments.callee );
                    domReady();
                }
            });
        }

    })();
}

/**
 @class tb.Event
 @constructor

 @param {string} pEventName - name of event
 @param [pEventData] - data to be appended to this event
 @param {string} [pBubble=l] - bubbling indicator, 'l' = local, 'u' = up, 'd' = down or any combination

 @return {object} tb.Event instance
 */
tb.Event = function( pEventName, pEventData, pBubble ){
    var that = this;
    that.bubble = pBubble || 'l';
    that.data = pEventData || {};
    that.name = pEventName || '';
    that.__stopped__ = that.__immediateStopped__ = false;
};

tb.Event.prototype = {

    /**
     @method stopPropagation
     
     @return {object} tb.Event object

     stop propagation after all handlers on this object have run
     */
    stopPropagation: function(){
        this.__stopped__ = true;
        return this;
    },

    /**
      @method stopImmediatePropagation
     
      @return {object} tb.Event object

      stop propagation immediately after this handler has run
     */
    stopImmediatePropagation: function(){
        this.__stopped__ = true; // also stop normal propagation
        this.__immediateStopped__ = true;
        return this;
    }

};

tb.debug = false; // todo: rethink / implement

tb.assumeTb = (function(pSetter){ 
    var isTb = pSetter;
    return function(pParam){
        if ( 
            typeof pParam === 'object'
            && !!pParam.nodeType
            && pParam.nodeType === 1
            && tb.assumeTb()
        ){
            // scan for AACEs and load + re-insert
            //console.log('scan for ACEs: ', pParam);
            
            var selection = tb.dom(pParam)
                .children()
                .filter(function(pElement){
                    var isUndefinedACE = 
                            pElement.nodeType === 1
                            && pElement.tagName.indexOf('-') !== -1
                            && !window.customElements.get(pElement.tagName.toLowerCase()),
                        element = pElement,
                        outerHTML = element.outerHTML,
                        parent = element.parentNode;

                        if (isUndefinedACE){
                            window
                                .customElements
                                .whenDefined(element.tagName.toLowerCase())
                                .then(function(){
                                    // force recreation
                                    parent.replaceChild( 
                                        element, 
                                        tb.dom(outerHTML)[0] 
                                    );
                                });
                        }
 
                    return isUndefinedACE;
                })
                .forEach(function(pElement){    // pElement is an undefined ACE
                    var fileName = pElement.tagName.toLowerCase().split('-'),
                        lastIndex = fileName.length - 1;
 
                    // normalize filename ->
                    fileName[lastIndex] = 
                        fileName[lastIndex].substr(0,1).toUpperCase() +
                        fileName[lastIndex].substr(1).toLowerCase();
 
                    fileName = '/'+fileName.join('/') + '.js';     

                    if ( !tb.require.get( fileName ) ){
                        console.log('load file: ', fileName );
                        tb.require( fileName );
                    }
 
                });
 
                // only recurse on those that are no ACEs
                tb.dom(pParam)
                    .children()
                    .filter(function(pElement){
                        var isNoACE = 
                            !!pElement.nodeType
                            && pElement.nodeType === 1
                            && pElement.tagName.indexOf('-') === -1;
 
                        return isNoACE;
                    })
                    .forEach(function(pElement){
                        tb.assumeTb(pElement);
                    });
 
            return selection;
        } else if ( typeof pParam === 'boolean'){
            isTb = pParam;
        }
        return isTb;
    };
})(false); // dont assume custom tags to resolve to tB classes
