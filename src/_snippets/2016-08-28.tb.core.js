/**
 twoBirds V7 core functionality

 @author          frank.thuerigen <frank_thuerigen@yahoo.de>
 @copyright       copyright (c) 2006- Frank Thürigen
 @license         http://www.gnu.org/copyleft/gpl.html GNU GPL v3

 */

// POLYFILLS

/* jshint ignore:start */

// matches polyfill
this.Element && (function(ElementPrototype){
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };})(Element.prototype);

// closest polyfill
this.Element && (function(ElementPrototype){
    ElementPrototype.closest = ElementPrototype.closest ||
        function(selector) {
            var el = this;
            while (el.matches && !el.matches(selector)){
                el = el.parentNode;
            }
            return el.matches ? el : null;
        };
})(Element.prototype);

/* jshint ignore:end */

// twoBirds

var tb = (function(){

    /**
     @class tb.Selector
     @constructor
     @extends tb

     @param {function|string|object|array} pSelector

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
    function TbSelector( pSelector ){
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
                // HINT: must be a tb element for every selector of a css selector string
                var selector = (pSelector + '[data-tb]');

                console.log('selector', selector);

                tb.dom( selector )
                    .forEach(
                        function ( pDomNode ) {
                            if ( !!pDomNode['tb'] ){
                                Object
                                    .keys( pDomNode.tb )
                                    .forEach(
                                        function( pKey ){
                                            [].push.call( that, pDomNode.tb[ pKey ] ); // push dom object to tb selector content
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
                    tb.dom( '[data-tb]' )
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
                        .keys( pSelector['tb'] )
                        .forEach(
                            function( pKey ){
                                [].push.call( that, pSelector['tb'][ pKey ] );
                            }
                        );

                } else if (
                    pSelector.constructor === Array // a true array
                    || !!pSelector['length']        // an array-like object
                    && !!pSelector['0']
                    && !(pSelector instanceof Array)
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

                tb.dom( '[data-tb]' )
                    .map(
                        function ( pDomNode ) {
                            Object
                                .keys( pDomNode.tb )
                                .forEach(
                                    function( pKey ){
                                        var tbElement = pDomNode.tb[ pKey ];

                                        if ( tbElement instanceof tb
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
    function Nop(){

    }

    Nop.prototype = {
        namespace: 'Nop'
    };

    // HINT: TbSelector (class) prototype definition after Tb prototype definition

    /**
     @class tb
     @constructor

     @param {object} pOptions
     @param pOptions.pClass - class Namespace as string or class
     @param [pOptions.pConfig] - optional configuration, any type, preferrably object
     @param [pOptions.pTarget] - target to put object in, DOM node or any other object

     @returns {object} - the twoBirds instance you just created

     1.) twoBirds CONSTRUCTOR

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

     2.) twoBirds SELECTOR

     @example

         // tb() selector always returns a jQuery-like result set
         tb( document.body )                // all tb instances residing in this DOM node
         tb('body')                         // invokes .querySelectorAll(), but returns tB object(s) contained therein.
         tb( app.Body )                     // get all instances of this class residing in DOM elements
         tb( /pp.Bod/ )                     // e.g. returns the app.Body instances, if the class 'namespace' property is 'app.Body'

         // both of the following return all toplevel objects in the current DOM, as expected.
         tb( /./ )                          // any namespace matches
         tb( '*' )                          // invoking document.querySelectorAll()

     You can call chained methods both on single tB instances as well as on a selector result set ( all of them, then ).
     */

    function tb() {

        var that = this;

        // setup prototype chain of twoBirds instance
        function makePrototype( pPrototype, pClass ){

            function f(){}
            f.prototype = tb.prototype;

            //console.log( 'f', f.prototype, 'c', pPrototype );

            var o = new f( pPrototype );

            Object.defineProperties(
                o,
                {
                    constructor: {
                        value: pClass,
                        enumerable: true,
                        writable: true
                    },
                    __tbVersion: {
                        value: 'V7',
                        enumerable: true
                    }
                }
            );

            tb.extend(
                o,
                pPrototype
            );
            //console.log( 'o', o );

            return o;
        }

        // merge handlers from temp instance into target object
        function mergeHandlers( pSourceTb , pTargetTb ){
            Object
                .keys( pSourceTb.handlers )
                .forEach(
                    function( pHandler ){
                        if ( !pTargetTb.handlers[pHandler] ){
                            pTargetTb.handlers[pHandler] = [];
                        }
                        for ( var j = 0, l = pSourceTb.handlers[pHandler].length; j < l; j++ ){
                            pTargetTb.handlers[pHandler].push( pSourceTb.handlers[pHandler][j] ); // copy handler
                        }
                    }
                );
        }

        // instanciate tb instance OR return tb.Selector result set
        if ( that instanceof tb ) {    // called as constructor, create and return tb object instance
            var isNamespace = typeof arguments[0] === 'string',
                tbClass =  isNamespace ? tb.namespace( arguments[0] ).get() : arguments[0],
                tbInstance,
                fileName,
                tempInstance; // empty tb object, used as handler store

            if ( arguments[0] === undefined ){
                console.log('empty arg[0]');
                return that;
            }

            // namespace is a string and corresponding class doesnt exist in repo
            // -> do requirement loading
            // -> return temporary instance ( = instanceof Nop )
            if ( isNamespace && !tbClass ){
                fileName = arguments[0].replace( /\./g, '/' ) + '.js';
                tempInstance = new tb( Nop, arguments[1] || {}, arguments[2] || false ); // construct temp tb instance from empty constructor -> temp handler store

                console.log('loader:', tb);

                tb.loader.load(
                    fileName,
                    (function( args ){
                        return function(){

                            var thisTb = new tb(
                                args[0],
                                args[1] || {},
                                args[2] || false
                            );

                            if ( !!tempInstance ){

                                // copy properties from tempInstance, always shallow copy
                                Object
                                    .keys( tempInstance )
                                    .forEach(
                                        function( pKey ){
                                            if ( (['handlers', 'target']).indexOf(pKey) === -1 ){
                                                thisTb[pKey] = tempInstance[pKey];
                                            }
                                        }
                                    );

                                mergeHandlers( tempInstance, thisTb );

                            }

                        };
                    })( [].slice.call( arguments ) )
                );

                return tempInstance; // return temp instance so handlers can be attached
            }

            // it is a constructor call, like "new tb(...)"
            if ( typeof tbClass === 'function' ){

                // prepare
                if ( !(tbClass.prototype.__tbVersion) ){
                    tbClass.prototype = makePrototype( tbClass.prototype, tbClass );
                }

                // create instance and apply constructor
                tbInstance = new tbClass( arguments[1] || {}, arguments[2] );
                //tbInstance = Object.create( tbClass.prototype );
                //tbClass.apply( tbInstance, [ arguments[1] || {}, arguments[2] ] );

                // prepare .namespace property of tb object
                if ( !tbInstance.namespace
                    && !( tbInstance instanceof Nop )
                ){
                    tbInstance.namespace = typeof arguments[0] === 'string'
                        ? arguments[0]
                        : arguments[0].namespace || tb.getId(); // if nothing helps, a unique id
                }

                // prepare .target property of tb object
                tbInstance.target = arguments[2] || false; // preset
                if ( !!arguments[2] ){
                    var target = arguments[2];

                    if ( !arguments[2]['nodeType']
                        && !!arguments[2][0]
                        && !!arguments[2][0]['nodeType']
                    ){
                        target = arguments[2][0]; // get first element of an array-like selector return object
                    }

                    tbInstance.target = target;
                } else {
                    tbInstance.target = null;
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
                        && !!tbInstance['namespace']
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
                if ( !tbInstance[ 'handlers' ] ){
                    tbInstance.handlers = {};
                } else {
                    // if there are single named event handler functions,
                    // convert them to array of functions
                    Object
                        .keys(tbInstance.handlers)
                        .forEach(
                            function( pKey ){
                                if ( typeof tbInstance.handlers[pKey] === 'function' ){
                                    tbInstance.handlers[pKey] = [ tbInstance.handlers[pKey] ];
                                } else if ( !( tbInstance.handlers[pKey] instanceof Array ) ){
                                    delete tbInstance.handlers[pKey];
                                }
                            }
                        );
                }

                if ( !( tbInstance instanceof Nop ) ){
                    
                    // trigger init directly if no requirement array
                    if ( !tbInstance['tb.Require'] ) {
                        console.log( tbInstance );
                        //debugger;
                        tbInstance.trigger( 'init' );
                    } // otherwise tb.require will trigger 'init'

                    // add property declared classes (prop contains ".") as tb objects
                    for ( var key in tbInstance ) {
                        if ( typeof key === 'string'
                            && key.indexOf( '.' ) > -1
                        ){ // prop name contains ".", treat as tb class
                            tbInstance[key] = new tb( key, tbInstance[key], tbInstance );
                        }
                    }

                }

                return tbInstance;

            }

        } else { // arguments[0] is string or regex, return selector result

            return new TbSelector( !!arguments[0] ? arguments[0] : undefined );

        }

    }

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
            result,
            ret = tb( '' ); // empty tb selector object

        if ( pSelectorObject instanceof TbSelector ) {
            [].forEach.call(
                [].map.call( pSelectorObject, function( pElement, pKey ){
                    if ( pSelectorObject.hasOwnProperty( pKey ) ){
                        return pSelectorObject[ pKey ];
                    }
                }),
                function walkSelectorEach( pTbObject, pKey ) {
                    result = pTbObject[pMethodName].apply( pTbObject, [].slice.call( pArguments ) );

                    [].forEach.call(
                        result,
                        function( pResultObject ){
                            if ( [].indexOf.call( ret, pResultObject ) === -1 ){
                                [].push.call( ret, pResultObject );
                            }
                        }
                    );
                }
            );
        }
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

    // tb.prototype operations
    tb.prototype = {
        // public methods and properties

        /**
         @method setProp
         @chainable

         @param {string} [pKey] - name of the property
         @param [pValue] - any kind of value associated with the key

         @return {object} - tb.Selector instance or tB instance - for chaining

         set() method

         sets an instance property

         @example

         var a = new tb(...); // create a tB instance
         a.set( 'x': 42 );

         */
        setProp: function( pKey, pValue ){
            var that = this;

            if ( that instanceof TbSelector ) {

                [].forEach.call(
                    that,
                    function( pTbInstance ){
                        pTbInstance[ pKey ] = pValue;
                    }
                );

                return that;

            } else if ( that instanceof tb ){

                that[pKey] = pValue;

            }

            return that;
        },

        /**
         @method getProp

         @param {string} [pKey] - name of the property

         @return any value stored in property, or undefined

         get() method

         get an instance property

         @example

         var a = new tb(...); // create a tB instance
         a.get( 'x' );

         */
        getProp: function( pKey ){
            var that = this;

            if ( that instanceof TbSelector ) {

                return that[0][ pKey ];

            } else if ( that instanceof tb ){

                return that[ pKey ];

            }

            return undefined;
        },

        /**
         @method extend

         @param {function}[pArg] - any number of JS constructors

         @return {object} - tb.Selector instance or tB instance - for chaining

         extend a tb object with other constructors

         @example

         */
        extend: function(){    // any number of constructors
            var that = this;
            return that;
        },

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
            if ( tbEvent.__stopped__  ) {
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
                if ( !!that.handlers[tbEvent.name] && tbEvent.bubble.indexOf( 'l' ) > -1 ) {

                    var temp = [];

                    that.handlers[tbEvent.name].map(
                        function (handler) {

                            if ( tbEvent.bubble.indexOf('l') > -1
                                && !tbEvent.__immediateStopped__
                                && !!handler
                            ){
                                setTimeout(
                                    function(){
                                        try{
                                            handler.apply(that, [tbEvent]);
                                        } catch (e){
                                            console.error(e);
                                        }
                                    }
                                    ,0
                                );

                                if ( !handler.once ) {
                                    temp.push( handler );
                                }
                            }

                        }
                    );

                    if ( !!temp.length ){
                        that.handlers[ tbEvent.name ] = temp;
                    } else {
                        that.handlers[ tbEvent.name ] = null;
                        delete that.handlers[ tbEvent.name ];
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
                    10
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

            if ( that instanceof TbSelector ) {

                walkSelector( that, 'on', arguments );

            } else if ( that instanceof tb ) { // either a toplevel or an internal tb object

                if ( -1 < pEventName.indexOf(' ') ){
                    eventNames = pEventName.split(' ');
                } else {
                    eventNames = [ pEventName ];
                }
                pHandler.once = !!pHandler.once || !!pOnce;

                eventNames.forEach(
                    function(pThisEventName){

                        if ( !that.handlers ){
                            that.handlers = {};
                        }

                        if ( !that.handlers[ pThisEventName ] ){
                            that.handlers[ pThisEventName ] = [];
                        }

                        that.handlers[ pThisEventName ].push( pHandler );
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
                        .toArray()
                        .forEach(
                            function( pElement ){
                                Object
                                    .keys( pElement.tb )
                                    .forEach(
                                        function( pKey ){
                                            // push dom object to tb selector content
                                            [].push.call( ret, pElement.tb[pKey] );
                                        }
                                    );
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
                        return ret;  // no parent -> empty result set
                    }

                    Object
                        .keys(tbParent.target.tb)
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
                ret = tb();

            pLocalOnly = typeof module !== 'undefined' ? true : pLocalOnly; // if node or forced -> only local

            if ( that instanceof TbSelector ) {

                ret = walkSelector( that, 'children', arguments );

            } else if ( that instanceof tb && !!that.target['nodeType'] && !pLocalOnly ) { // it must be a native tb object
                var id = tb.getId(),
                    selector = tb.dom('[data-tb]', that.target),
                    notSelector = '['+'data-tempid="'+id+'"] [data-tb] *';

                // set temporary id for tb.dom/.querySelectorAll()
                tb.dom( that.target )
                    .attr( 'data-tempid', id );

                selector // all descendants
                    .not( notSelector ) // but not those that are below level 1
                    .forEach(
                        function( pDomNode ) {
                            Object
                                .keys( pDomNode.tb )
                                .forEach(function( pKey ){
                                    [].push.call( ret, pDomNode.tb[ pKey ] ); // push dom object to tb selector content
                                });
                        }
                    );

                // remove temporary id
                tb.dom( that.target )
                    .removeAttr( 'data-tempid' );

            } else if ( !!pLocalOnly ){

                Object
                    .keys( that )
                    .forEach(
                        function( pKey ){
                            if ( that[pKey] instanceof tb ){
                                [].push.call( ret, that[pKey] ); // push tb object to tb selector content
                            }
                        }
                    );

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
                ret = tb( '' ), // empty tb selector object
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
                ret = tb( '' ), // empty tb selector object
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
                ret = tb( '' ),
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
                ret = tb(''),
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
            return [].filter.call( this, function(){ return true; } );
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
        not: function( pSelector ){

            var that = this,
                compare = tb( pSelector ).toArray(), // object array to check against
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
                add = tb( pSelector ).toArray(),
                element;

            while ( add.length > 0 ){
                element = add.shift();
                if ( [].indexOf.call( that, element ) === -1 ){
                    that.push( element );
                }
            }

            return that;
        },

        /**
         @method flush
         @chainable

         @return {object} - emptied tb.Selector instance

         flush() method

         remove all elements from tb result set
         */
        flush: function(){
            var that = this,
                pop = [].pop;

            while( that.length > 0 ){
                pop.call( that );
            }

            return that;
        }

    };

    /*

    console.log('proxy handler');

    // handler for proxy
    var handler = {

        get: function( pObject, pKey ){
            var that = this;

            //console.log( 'proxy get:', pKey, that );
            if ( pKey.substr(0,1) !== '_' ) { // it is not a private var but has made it down to here
                return undefined;
            } else if ( that.__.hasOwnProperty( pKey ) ){
                return that.__.pKey;
            } else if ( pKey === '__' ){
                return that.__;
            }
            return undefined;
        },

        set: function( pObject, pKey, pValue ){
            var that = this;

            that.__ = that.__ || {};

            //console.log( 'proxy set:', pKey, that );
            if ( pKey.substr(0,1) === '_' ){
                that.__[pKey] = pValue;
            } else {
                pObject[pKey] = pValue;
            }
            return true;
        }

    };

    console.log('PropCheck proxy');

    // proxy for property access
    function PropCheck(){
    }
    PropCheck.prototype = new Proxy(
        {},
        handler
    );

    Object.setPrototypeOf ( tb.prototype, new PropCheck() );

    console.log('tb.prototype', tb.prototype);

    // tbSelector prototype operations
    Object
        .keys( tb.prototype )
        .forEach(
            function( pMethodOrStaticProperty ){
                TbSelector.prototype[ pMethodOrStaticProperty ] = tb.prototype[ pMethodOrStaticProperty ];
            }
        );

    console.log('tb READY.');

    setTimeout( // we need to wait for the rest to execute
        function(){
            console.log('proxy handler');

            // handler for proxy
            var handler = {

                get: function( pObject, pKey ){
                    var that = this;

                    //console.log( 'proxy get:', pKey, that );
                    if ( pKey.substr(0,1) !== '_' && pObject.hasOwnProperty( pKey ) ) {
                        return pObject['pKey'];
                    } else if ( that.__.hasOwnProperty( pKey ) ){
                        return that.__['pKey'];
                    } else if ( pKey === '__' ){
                        return that.__;
                    }
                    return undefined;
                },

                set: function( pObject, pKey, pValue ){
                    var that = this;

                    that.__ = that.__ || {};

                    //console.log( 'proxy set:', pKey, that );
                    if ( pKey.substr(0,1) === '_' && that.__.hasOwnProperty( pKey )){
                        that.__[pKey] = pValue;
                    } else {
                        pObject[pKey] = pValue;
                    }
                    return true;
                }

            };

            console.log('PropCheck');

            // proxy for property access
            function PropCheck(){}
            PropCheck.prototype = new Proxy(
                {},
                handler
            );

            console.log('TbPrototype');

            // constructor for prototype
            function TbPrototype(){
                var that = this;

                tb.extend(
                    that,
                    tb.prototype
                );
            }
            TbPrototype.prototype = new PropCheck();

            tb.prototype = new TbPrototype();

            console.log('tb.prototype', tb.prototype);

            // tbSelector prototype operations
            Object
                .keys( tb.prototype )
                .forEach(
                    function( pMethodOrStaticProperty ){
                        TbSelector.prototype[ pMethodOrStaticProperty ] = tb.prototype[ pMethodOrStaticProperty ];
                    }
                );

            console.log('tb READY.');
        },
        0
    );
 */

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
        unshift: _mapArrayMethod( 'unshift' )

    };

    /**
     @method unique
     @chainable

     @return {object} - tb.dom() result set, may be empty

     force this tb() result set to be unique

     ( being called after using methods inherited from array, force uniqueness )
     */
    TbSelector.prototype['unique'] = function() {
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

    return tb;

})();

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
        this.stopPropagation(); // also stop normal propagation
        this.__immediateStopped__ = true;
        return this;
    }

};

// make it a node module
if (typeof module !== 'undefined' && !!module['exports']) {
    module.exports.tb = tb;
} else {
    /**
     * document.ready bootstrap
     */
    (function(){

        function domReady () {
            tb.bind( document.body ); // find all tb dom nodes and add tb objects if not yet done
        }

        var f = function(){
            if ( document.addEventListener ) {          // Mozilla, Opera, Webkit
                document.removeEventListener( "DOMContentLoaded", f, false);
            } else if ( document.attachEvent ) {        // IE
                document.detachEvent( "onreadystatechange", f );
            }
            domReady();
        };

        if ( document.addEventListener ) {          // Mozilla, Opera, Webkit
            document.addEventListener( "DOMContentLoaded", f, false );
        } else if ( document.attachEvent ) {        // IE
            document.attachEvent("onreadystatechange", f);
        }

    })();
}
