/*! twobirds-core - v7.3.29 - 2016-09-06 */

/**
 twoBirds V7 core functionality

 @author          frank.thuerigen <frank_thuerigen@yahoo.de>
 @copyright       copyright (c) 2006- Frank Thürigen
 @license         http://www.gnu.org/copyleft/gpl.html GNU GPL v3

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
                var selector = pSelector.split(' '),
                    selector = selector.map(function(s){ // jshint ignore:line
                        if (1 < s.length){
                            return s+':not([data-tb=""])';
                        }
                        return s;
                    }),
                    selector = selector.join(' '); // jshint ignore:line

                //console.log( pSelector, selector );

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
                if ( pSourceTb.handlers.hasOwnProperty(i) ){
                    if ( !pTargetTb.handlers[i] ){
                        pTargetTb.handlers[i] = [];
                    }
                    for ( var j = 0, l = pSourceTb.handlers[i].length; j < l; j++ ){
                        pTargetTb.handlers[i].push( pSourceTb.handlers[i][j] ); // copy handler
                    }
                }
            }
        }

        // instanciate tb instance OR return tb.Selector result set
        if ( that instanceof tb ) {    // called as constructor, create and return tb object instance
            var isNamespace = typeof arguments[0] === 'string',
                tbClass =  isNamespace ? tb.namespace( arguments[0] ).get() : arguments[0],
                tbInstance,
                fileName,
                tempInstance; // empty tb object, used as handler store

            // namespace is a string and corresponding class doesnt exist in repo
            // -> do requirement loading
            // -> return temporary instance ( = instanceof Nop )
            if ( isNamespace && !tbClass ){
                fileName = arguments[0].replace( /\./g, '/' ) + '.js';
                tempInstance = new tb( Nop, arguments[1] || {}, arguments[2] || false ); // construct temp tb instance from empty constructor -> temp handler store

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
                    })( [].slice.call( arguments ) )
                );

                return tempInstance; // return temp instance so handlers can be attached
            }

            // it is a constructor call, like "new tb(...)"
            if ( typeof tbClass === 'function' ){

                // prepare
                if ( !tbClass.prototype.__tb__ ){
                    Object.defineProperty( tbClass.prototype, '__tb__', { value: 'V7', enumerable: true } );
                    Object.setPrototypeOf( tbClass.prototype, tb.prototype );
                }

                // make a new instance of given constructor
                tbInstance = new tbClass( arguments[1] || {}, arguments[2] ); // hidden parameter target

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
                    if ( !arguments[2]['nodeType']
                        && !!arguments[2][0]
                        && !!arguments[2][0]['nodeType']
                    ){
                        arguments[2] = arguments[2][0]; // jshint ignore:line
                        // get first element of an array-like selector return object
                    }

                    tbInstance.target = arguments[2];
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
                    for ( var i in tbInstance.handlers ) {
                        if ( tbInstance.handlers.hasOwnProperty(i) ){
                            if ( typeof tbInstance.handlers[i] === 'function' ){
                                tbInstance.handlers[i] = [ tbInstance.handlers[i] ];
                            } else if ( !( tbInstance.handlers[i] instanceof Array ) ){
                                delete tbInstance.handlers[i];
                            }
                        }
                    }
                }

                if ( !( tbInstance instanceof Nop ) ){

                    // trigger init directly if no requirement array
                    if ( !tbInstance['tb.Require'] ) {
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

    tb.prototype = (function(){
        // private static

        return {
            // public methods and properties

            /**
             @method set
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
            set: function( pKey, pValue ){

                var that = this;

                if ( that instanceof TbSelector ) {

                    [].forEach.call(
                        that,
                        function( pElement ){
                            pElement.set( pKey, pValue );
                        }
                    );

                    return that;

                } else if ( that instanceof tb ){

                    that[pKey] = pValue;

                }

                return that;
            },

            /**
             @method get

             @param {string} [pKey] - name of the property

             @return any value stored in property, or undefined

             get() method

             get an instance property

             @example

                 var a = new tb(...); // create a tB instance
                 a.get( 'x' );

             */
            get: function( pKey, undefined ){

                var that = this;

                if ( that instanceof TbSelector ) {

                    return that[0][ pKey ];

                } else if ( that instanceof tb ){

                    return that[ pKey ];

                }

                return undefined;
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
                            return ret;
                        } // no parent -> empty result set

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
                    ret = tb(),
                    pLocalOnly = typeof module !== 'undefined' ? true : pLocalOnly; // jshint ignore:line

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

    Object
        .keys( tb.prototype )
        .forEach(
            function( pMethodOrStaticProperty ){
                TbSelector.prototype[ pMethodOrStaticProperty ] = tb.prototype[ pMethodOrStaticProperty ];
            }
        );

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

    tb.plugin = function( pMethodName, pFunction ){
        var p = internaltb.prototype;

        if ( !p[ pMethodName ] ){
            p[ pMethodName ] = pFunction;
            //console.log( 'plugin:', pMethodName, p );
        } else {
            console.warn( 'Cannot overload existing tb method:', pMethodName );
        }

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
if (typeof module !== 'undefined' && module.exports) {
    module.exports.tb = tb;
} else {
    /**
     * document.ready bootstrap
     */
    (function(){

        function domReady () {
            tb.bind( document.body ); // find all tb dom nodes and add tb objects if not yet done
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


if (typeof module === 'undefined' ){
    tb.dom = (function () {

        // Variables
        var regExReturn = /\r/g,
            regExSpaces = /[\x20\t\r\n\f]+/g,
            regExWord = /\S+/g,
            regExHtml = /^<>$/g,
            TbSelector = tb.Selector;

        return function (pSelector, pDomNode) {

            var dom;

            // INTERNAL ONLY Private Functions
            function _addEvent( pDomNode, pEventName, pHandler, pCapture ) {
                if (pDomNode.attachEvent) {
                    pDomNode.attachEvent('on' + pEventName, pHandler, pCapture );
                } else {
                    pDomNode.addEventListener(pEventName, pHandler, pCapture );
                }
            }

            function _removeEvent( pDomNode, pEventName, pHandler, pCapture ) {
                if (pDomNode.detachEvent){
                    pDomNode.detachEvent('on'+pEventName, pHandler, pCapture );
                } else {
                    pDomNode.removeEventListener(pEventName, pHandler, pCapture );
                }
            }

            function _htmlToElements(html) {
                var template = document.createElement('template');
                template.innerHTML = html;
                return !template['content']['childNodes'] ? template.childNodes : template.content.childNodes;
            }

            function _mapArrayMethod( pMethodName ){
                var method = [][pMethodName];

                if ( -1 < ([ 'push', 'unshift' ]).indexOf( pMethodName ) ){ // make these array methods chainable
                    return function(){
                        method.apply( this, arguments );

                        return this.unique();
                    };
                } else {
                    return function(){
                        var ret = method.apply( this, arguments );

                        return ret instanceof Array && !!ret['0'] && !!ret['0']['nodeType'] ? tb.dom( ret ).unique() : ret;
                    };
                }
            }

            /**
             @class tb.dom
             @constructor

             @param [pSelector] a .querySelectorAll() selector string, a dom node or an array of dom nodes
             @param [pDomNode] - DOM node to start search in

             @return {object} - tb.dom() result set, may be empty

             tb.dom() function

             jquery like selector engine

             */

            dom = function tbDom(pSelector, pDomNode) {

                var that = this,
                    domNode,
                    nodeList;

                if (!pSelector) { // no selector given, or not a string
                    return;
                } else if (!!pSelector['nodeType'] ) { // selector is a dom node
                    if ( [].indexOf.call( that, pSelector ) === -1 ){
                        [].push.call(that, pSelector);
                    }
                    return;
                } else if ( !!pSelector['__tbSelector__'] ) { // selector is a tb.dom result set
                    return pSelector;
                } else if ( pSelector instanceof TbSelector && !!pSelector[0] ) { // a twobirds selector result set
                    [].forEach.call(
                        pSelector,
                        function (pElement) {   // copy only DOM nodes
                            if (
                                !!pElement['target']
                                && !!pElement['target']['nodeType']
                            ) {
                                if ( [].indexOf.call( that, pElement.target ) === -1 ){
                                    [].push.call(that, pElement.target);
                                }
                            }
                        }
                    );
                    return;
                } else if ( pSelector instanceof Array
                    || !!pSelector['__tbSelector__']
                    || pSelector instanceof HTMLCollection
                    || pSelector instanceof NodeList ) {
                    [].forEach.call(
                        pSelector,
                        function ( pElement ) {
                            tb.dom( pElement )
                                .forEach(
                                    function( pFoundDomNode ){
                                        if ( [].indexOf.call( that, pFoundDomNode ) === -1 ){
                                            [].push.call(
                                                that,
                                                pFoundDomNode
                                            );
                                        }
                                    }
                                );
                            }
                        );
                    return;
                } else if (typeof pSelector !== 'string') { // wrong selector type
                    return;
                } else { // pSelector is a string

                    var DOM = _htmlToElements( pSelector ); // uses 'template' element to retrieve DOM nodes

                    if ( DOM.length === 1 && DOM[0].nodeType === 3 ){
                        // it is not a HTML string, but a simple string
                        // nodeType 3 indicates text node
                        domNode = pDomNode && !!pDomNode['nodeType'] ? pDomNode : document;
                        pSelector
                            .split( ',' )
                            .forEach(
                                function forEachTbDomSelector( pThisSelector ){
                                    nodeList = domNode.querySelectorAll(pThisSelector.trim());
                                    if (!!nodeList['0']) {
                                        [].forEach.call(
                                            nodeList,
                                            function (pDomElement) {
                                                if ( [].indexOf.call( that, pDomElement ) === -1 ){
                                                    [].push.call( that, pDomElement );
                                                }
                                            }
                                        );
                                    }

                                }
                            );

                    } else { // it is a HTML string
                        // return html content as a set of nodes
                        return tb.dom( DOM );
                    }
                }

            };

            // dom prototype, public functions
            dom.prototype = {

                __tbSelector__: true,   // detection

                length: 0,

                // from Array prototype
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

                 @return {object} - tb.dom() result set, may be empty

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

                //own functions, documented in code below
                add: add,
                addClass: addClass,
                append: append,
                appendTo: appendTo,
                attr: attr,
                children: children,
                descendants: descendants,
                empty: empty,
                hasClass: hasClass,
                hide: hide,
                html: html,
                insertBefore: insertBefore,
                insertAfter: insertAfter,
                filter: filter,
                not: not,
                off: off,
                on: on,
                one: one,
                parent: parent,
                parents: parents,
                remove: remove,
                removeAttr: removeAttr,
                removeClass: removeClass,
                show: show,
                toArray: toArray,
                trigger: trigger,
                unique: unique,
                val: val,
                values: values
            };

            return new dom( pSelector, pDomNode );

            // Private Functions, exposed

            /**
             @method add
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             add all nodes in tb.dom( pSelector ) result set to tb.dom() result set
             */
            function add( pSelector ) {
                var that = this,
                    res;

                if ( typeof pSelector !== 'string' && !!pSelector['length'] ) { // if array given add each of its elements
                    [].forEach.call(
                        pSelector,
                        function ( pSelected ) {
                            res = tb.dom( pSelected ).toArray();
                            res.forEach(
                               function( pDomNode ){
                                   if ( [].indexOf.call( that, pDomNode ) === -1 ){
                                       [].push.call(
                                           that,
                                           pDomNode
                                       );
                                   }
                               }
                            );
                        }
                    );
                } else { // pSelector not an array
                    res = tb.dom( pSelector ).toArray();
                    res.forEach(
                        function( pDomNode ){
                            if ( [].indexOf.call( that, pDomNode ) === -1 ){
                                [].push.call(
                                    that,
                                    pDomNode
                                );
                            }
                        }
                    );
                }

                return that.unique();
            }

            /**
             @method addClass
             @chainable

             @param  {string} pClassName - class name(s) to add, separated by ' '

             @return {object} - tb.dom() result set, may be empty

             add class name to each of tb.dom() result set
             */
            function addClass(pClassName) {

                var that = this;

                that.forEach(
                    function (pDomNode) {
                        var classes = pDomNode.getAttribute('class') || '',
                            index;

                        classes = !!classes.length ? classes.split(' ') : [];
                        index = classes.indexOf(pClassName);

                        if (index === -1) {
                            classes.push( pClassName );
                            pDomNode.setAttribute('class', classes.join(' ') );
                        }
                    }
                );

                return that;
            }

            /**
             @method append
             @chainable

             @param pElement - an array like set of DOM nodes, or a single DOM node

             @return {object} - tb.dom() result set, may be empty

             appends given DOM nodes to every node in tb.dom() result set
             */
            function append( pElement ){
                var that = this,
                    nodes;

                that.forEach(
                    function( pDomNode ){
                        nodes = tb.dom( pElement );
                        [].forEach.call(
                            nodes,
                            function( pThisElement ){
                                if ( !!pThisElement['nodeType'] ){
                                    pDomNode.appendChild( pThisElement );
                                }
                            }
                        );
                    }
                );

                return that;
            }

            /**
             @method appendTo

             @param pElement - a dom node or tb.dom() result set

             appends all elements in this result set to DOM node or tb.dom(...)[0] first element of result set
             */
            function appendTo( pElement ){
                var that = this;

                pElement = tb.dom( pElement ); // all types of selectors, only first result

                if ( !!pElement['0'] ){
                    pElement = pElement[0];
                    that.forEach(
                        function( pDomNode ){
                            pElement.appendChild( pDomNode );
                        }
                    );
                }

                return that;
            }

            /**
             @method attr
             @chainable

             @param pKey - if string: DOM node attribute name; if object: hash of attributeName: attributeValue
             @param {string} [pValue] - value to set in DOM node(s)

             @return {object} - tb.dom() result set, may be empty

             set of get attribute values to each DOM node in give tb.dom() result set

             HINT:
             if pKey is a string and pValue is not given its a GET
             if pKey is an object or pKey(string) and pValue(string) are given, it is a SET. ONLY THEN this is CHAINABLE.
             */
            function attr(pKey, pValue) {

                var that = this,
                    rootNodes;

                if ( typeof pKey === 'object' && pKey.constructor === Object ){ // hash given

                    Object
                        .keys( pKey )
                        .forEach(
                            function( thisKey ){
                                that.attr( thisKey, pKey[thisKey] );
                            }
                        );

                } else { // key/value pair expected

                    // if no arguments, return attribute object
                    if (!arguments.length) {
                        return that[0].attributes;
                    }

                    // if no value is given and there are elements, return attribute value of first in list
                    if (!pValue && that.length > 0) {
                        return that[0].getAttribute(pKey);
                    }

                    // if a value to set is given, apply to all nodes in list
                    rootNodes = that.toArray();
                    rootNodes.forEach(
                        function (pNode) {
                            pNode.setAttribute(pKey, pValue);
                        }
                    );

                }

                return that;
            }

            /**
             @method children
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             return child nodes of tb.dom() result set, that match nodes in tb.dom( pSelector ) result set
             */
            function children(pSelector) {

                var that = this,
                    result = tb.dom();

                that.forEach(
                    function (pDomNode) {
                        var check = pSelector !== undefined ? tb.dom( pSelector ) : false;

                        [].forEach.call(
                            pDomNode.children,
                            function( pChildNode ){
                                if ( -1 === [].indexOf.call( result, pChildNode )
                                    && ( !check || -1 < [].indexOf.call( check, pChildNode ) )
                                ){
                                    result.push( pChildNode );
                                }
                            }
                        );
                    }
                );

                return result;
            }

            /**
             @method descendants
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             return all descendant nodes of tb.dom() result set, that match nodes in tb.dom( pSelector ) result set
             */
            function descendants( pSelector ) {

                var that = this,
                    result = [],
                    ret,
                    check = !!pSelector ? tb.dom( pSelector ) : false;

                that
                    .forEach(
                        function( pDomNode ){
                            result = result.concat( tb.dom( pDomNode.querySelectorAll( '*' ) ).toArray() );
                        }
                    );

                result = tb.dom( result ).unique().toArray();

                if ( check ){
                    ret = result
                        .filter(
                            function( pDomNode ){
                                return -1 < [].indexOf.call( check, pDomNode );
                            }
                        );
                }

                return tb.dom( check ? ret : result );
            }

            /**
             @method empty
             @chainable

             @return {object} - tb.dom() result set, may be empty

             removes one or all DOM event handlers from each element in tb.dom() result set
             */
            function empty() {
                var that = this;

                that.forEach(
                    function( pNode ){
                        pNode.innerHTML = '';
                    }
                );

                return that;
            }

            /**
             @method filter
             @chainable

             @param pSelector - tb.dom() selector to match against or [].filter.call( this, function(){ ... } )

             @return {object} - tb.dom() result set

             match tb.dom() result set against pSelector filter
             */
            function filter( pSelector ) {

                var that = this,
                    compare = tb.dom( pSelector ),// functions and undefined will be ignored, so empty result then
                    result;

                if ( pSelector === 'undefined' ) {
                    return that;
                }    // unchanged

                if ( typeof pSelector === 'string' ) { // DOM selector given
                    result = [].filter.call(
                        that,
                        function (pElement) {
                            return -1 < compare.indexOf(pElement);
                        }
                    );
                } else if ( pSelector instanceof Function ) { // function given
                    result = [].filter.call(
                        that,
                        pSelector
                    );
                }

                return tb.dom(result);

            }

            /**
             @method hasClass

             @return {boolean} - true if class in className
             */
            function hasClass( pClass ) {
                var that = this,
                    node = !!that[0] ? that[0] : false;

                if ( node ){
                     return node.className.split( ' ' ).indexOf( pClass ) > -1;
                }
                return;
            }

            /**
             @method hide
             @chainable

             @return {object} - tb.dom() result set, may be empty

             hide all nodes in tb.dom() result set
             */
            function hide() {
                var that = this;

                that.forEach(
                    function( pNode ){
                        pNode.style.prevDisplay = ([ '', 'none']).indexOf( pNode.style.display ) === -1
                            ? pNode.style.display
                            : '';
                        pNode.style.display = 'none';
                    }
                );

                return that;
            }

            /**
             @method html
             @chainable

             @param {string} pHtml - html string or empty string

             @return {object} - tb.dom() result set, may be empty

             replace all nodes .innerHTML with pHtml
             */
            function html( pHtml ) {
                var that = this;

                if ( typeof pHtml !== 'undefined' ){
                    if ( typeof pHtml === 'string' ) {
                        that.forEach(
                            function (pNode) {
                                pNode.innerHTML = pHtml;
                            }
                        );
                    }
                } else {
                    return !!that[0] ? that[0].innerHTML : '';
                }

                return that;
            }

            /**
             @method insertBefore

             @param pElement - a single DOM node or tb.dom() selector result set, [0] is taken

             prepends all elements in tb.dom() result set to given DOM node
             */
            function insertBefore( pTarget ){
                var that = this,
                    target = tb.dom( pTarget )['0'] ? tb.dom( pTarget )['0'] : false;

                if ( !target ) {
                    return;
                }

                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode.nodeType ){

                            target.parentElement
                                .insertBefore(
                                    pDomNode.cloneNode( true ),
                                    pTarget
                                );

                        }
                    }
                );

                return;
            }

            /**
             @method insertAfter

             @param pElement - a single DOM node or tb.dom() selector result set, [0] is taken

             inserts all elements in tb.dom() result set after given DOM node
             */
            function insertAfter( pTarget ){
                var that = this,
                    target = tb.dom( pTarget )['0'] ? tb.dom( pTarget )['0'] : false,
                    nextDomNode = target.nextSibling || false;

                if ( !target ) {
                    return;
                }

                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode.nodeType ){

                            if ( nextDomNode ){
                                target
                                    .parentElement
                                    .insertBefore(
                                        pDomNode.cloneNode( true ),
                                        nextDomNode
                                    );
                            } else {
                                target
                                    .parentElement
                                    .appendChild(
                                        pDomNode.cloneNode( true )
                                    );
                            }

                        }
                    }
                );

                return;
            }

            /**
             @method not
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             remove all nodes from this tb.dom() result set, that are in tb.dom( pSelector ) result set
             */
            function not(pSelector) {
                var that = this,
                    result = tb.dom(),
                    check = pSelector !== undefined ? document.querySelectorAll( pSelector ) : false;

                if ( !check ){
                    return that;
                }

                that.forEach(function (pElement) {
                    if ( -1 === [].indexOf.call( check, pElement) ) {
                        result.add(pElement);
                    }
                });

                return result;
            }

            /**
             @method off
             @chainable

             @param {string} pEventName(s) - name(s) of the event separated by ' '
             @param {function} pHandler - callback far event
             @param {boolean} [pCapture] - callback far event

             @return {object} - tb.dom() result set, may be empty

             removes one or all DOM event handlers from each element in tb.dom() result set
             */
            function off( pEventName, pHandler, pCapture ){
                var that = this,
                    eventNames = pEventName.indexOf(' ') > -1 ? pEventName.split(' ') : [ pEventName ],
                    capture = typeof pCapture === 'boolean' ? pCapture : false;

                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode.nodeType ){
                            if ( !!pHandler ){
                                eventNames.forEach(
                                    function( pThisEventName ){
                                        _removeEvent( pDomNode, pThisEventName, pHandler, capture );
                                    }
                                );
                            } else {
                                eventNames.forEach(
                                    function( pThisEventName ){
                                        // todo: refactor this, doesnt seem to work
                                        pDomNode['on' + pThisEventName] = null;
                                        pDomNode.removeAttribute( 'on' + pThisEventName );
                                    }
                                );
                            }
                        }
                    }
                );

                return that;
            }

            /**
             @method on
             @chainable

             @param {string} pEventName(s) - name(s) of the event separated by ' '
             @param {function} pHandler - callback for event
             @param {boolean} pCapture - indicates running in capture phase, that is top down

             @return {object} - tb.dom() result set, may be empty

             creates a DOM event handler for each element in tb.dom() result set
             */
            function on( pEventName, pHandler, pCapture ){
                var that = this,
                    eventNames = pEventName.indexOf(' ') > -1 ? pEventName.split(' ') : [ pEventName ],
                    onceHandler,
                    capture = typeof pCapture === 'boolean' ? pCapture : false;

                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode.nodeType ){
                            eventNames.forEach(
                                function( pThisEventName ){

                                    if ( !!pHandler['once'] ){
                                        onceHandler = (function(pDomNode, pThisEventName, pHandler, capture) {
                                            return function(){
                                                _removeEvent( pDomNode, pThisEventName, onceHandler, capture );
                                                pHandler.apply( pDomNode, arguments );
                                            };
                                        })(pDomNode, pThisEventName, pHandler);
                                    }

                                    _addEvent( pDomNode, pThisEventName, onceHandler || pHandler, capture );
                                }
                            );
                        }
                    }
                );

                return that;
            }

            /**
             @method one
             @chainable

             @param {string} pEventName(s) - name(s) of the event separated by ' '
             @param {function} pHandler - callback far event
             @param {boolean} pCapture - indicates running in capture phase, that is top down

             @return {object} - tb.dom() result set, may be empty

             creates a DOM event handler for each element in tb.dom() result set (to be called only once)
             */
            function one( pEventName, pHandler, pCapture ){
                var that = this;

                pHandler.once = true;

                that.on( pEventName, pHandler, pCapture );

                return that;
            }

            /**
             @method parents
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             return all parent nodes of tb.dom() result set, that match nodes in tb.dom( pSelector ) result set
             */
            function parents(pSelector) {

                var that = this,
                    result = tb.dom(),
                    check = pSelector !== undefined ? tb.dom( pSelector ) : false,
                    domNode;

                that.forEach(
                    function (pDomNode) {
                        domNode = pDomNode.parentNode;

                        while (!!domNode
                        && !!domNode['tagName']
                        && domNode['tagName'] !== 'HTML'
                            ){
                            if ([].indexOf.call(result, domNode) === -1
                                && ( !check || -1 < [].indexOf.call( check, domNode ) )
                            ) {
                                result.push(domNode);
                            }
                            domNode = domNode.parentNode;
                        }
                    }
                );

                return result;
            }

            /**
             @method parent
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             return closest parent nodes of tb.dom() result set, that match nodes in tb.dom( pSelector ) result set
             */
            function parent(pSelector){
                var that = this,
                    result = tb.dom(),
                    check = pSelector !== undefined ? tb.dom( pSelector ) : false;

                that.forEach(
                    function (pDomNode) {
                        var domNode = pDomNode.parentNode;

                        if ( -1 === [].indexOf.call( result, domNode )
                            && ( !check ||  -1 < [].indexOf.call( check, domNode ) )
                        ){
                            [].push.call( result, domNode);
                        }
                    }
                );

                return result;
            }

            /**
             @method remove
             @chainable

             @param [pDomElements] - a tb.dom() selector result set

             removes all elements in tb.dom() result set from DOM
             */
            function remove( pDomNodes ){
                var that = this;

                that.forEach(
                    function( pDomNode ){
                        pDomNode.parentNode.removeChild( pDomNode );
                    }
                );

                return that;
            }

            /**
             @method removeAttr
             @chainable

             @param {string} pKeys - attribute name(s) separated by ' '

             @return {object} - tb.dom() result set, may be empty

             remove attribute(s) completely from tb.dom() result set
             */
            function removeAttr(pKeys) {

                var that = this,
                    attrNames = pKeys && pKeys.match(regExWord),
                    name,
                    i;

                that.forEach(
                    function (pDomNode) {
                        i = 0;
                        if (attrNames && !!pDomNode['nodeType'] && pDomNode.nodeType === 1) {
                            while ((name = attrNames[i++])) {
                                pDomNode.removeAttribute(name);
                            }
                        }
                    }
                );

                return that;
            }

            /**
             @method removeClass
             @chainable

             @param  {string} pClassName - class name(s) to remove, separated by ' '

             @return {object} - tb.dom() result set, may be empty

             remove class name from each of tb.dom() result set
             */
            function removeClass(pClassName) {

                var that = this,
                    pClasses = pClassName.split(' ');

                that.forEach(
                    function (pDomNode) {
                        var classes = pDomNode.getAttribute('class') || '';

                        classes = classes.trim();

                        if ( classes.indexOf(' ') > -1 ){
                            classes = classes.split(' ');
                        } else {
                            classes = [ classes ];
                        }

                        pClasses.forEach(
                            function( pClass ){
                                if ( classes ){
                                    pClassName.split(' ')
                                        .forEach(
                                            function( pRemoveClass ){
                                                while ( classes.indexOf(pRemoveClass) > -1 ){
                                                    classes.splice(classes.indexOf(pRemoveClass), 1);
                                                }
                                            }
                                        );

                                    if ( !!classes.length ){
                                        tb.dom( pDomNode ).attr('class', classes.join(' ') );
                                    } else {
                                        tb.dom( pDomNode ).removeAttr('class');
                                    }
                                }
                            }
                        );

                    }
                );

                return that;
            }

            /**
             @method show
             @chainable

             @return {object} - tb.dom() result set, may be empty

             show all nodes in tb.dom() result set
             */
            function show() {
                var that = this;

                that.forEach(
                    function( pNode ){
                        pNode.style.display = pNode.style.prevDisplay;
                    }
                );

                return that;
            }

            /**
             @method toArray
             @chainable

             @return {array} - tb.dom() result set converted to a plain array of DOM nodes

             convert tb.dom() result set converted to a plain array of DOM nodes
             */
            function toArray(){
                return [].filter.call( this, function(){ return true; } );
            }

            /**
             @method trigger
             @chainable

             @param {string} pEventName - name of the event
             @param {object} [pData] - optional data
             @param {boolean} [pBubble] - bubble event, default = true
             @param {boolean} [pCancel] - cancelable event, default = true, if false e.preventDefault() in handler will have no effect

             @return {object} - tb.dom() result set, may be empty

             creates a DOM event for each element in tb.dom() result set
             */
            function trigger( pEventName, pData, pBubble, pCancel ){
                var bubble = typeof pBubble === 'boolean' ? pBubble : true,
                    cancel = typeof pCancel === 'boolean' ? pCancel : true,
                    that = this,
                    eventNames = pEventName.split(' '),
                    e;

                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode.nodeType ){
                            eventNames.forEach(
                                function( pThisEventName ){
                                    if ('createEvent' in document) {
                                        e = document.createEvent('HTMLEvents');
                                        tb.extend(
                                            e.data,
                                            pData
                                        );
                                        e.initEvent(pThisEventName, bubble, cancel );
                                        pDomNode.dispatchEvent(e);
                                    } else {
                                        e = document.createEventObject();
                                        tb.extend(
                                            e.data,
                                            pData
                                        );
                                        e.eventType = pThisEventName;
                                        pDomNode.fireEvent('on'+e.pThisEventName, e);
                                    }
                                }
                            );
                        }
                    }
                );

                return that;
            }

            /**
             @method unique
             @chainable

             @return {object} - tb.dom() result set, may be empty

             force this tb.dom() result set to be unique ( HINT: if this is necessary, there is an error in twoBirds,
             and we would like to hear about it... )

             method is called internally though to force result set uniqueness
             */
            function unique() {
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
            }

            /**
             @method val
             @chainable

             @param {string} [pValue] - value to set to DOM input type element

             @return [pValue] - value from input element [0] in tb.dom() result set

             if pValue given, it is a SET and the method is chainable
             if no pValue given, it is a GET and the method will return the value
             */
            function val( pValue ){

                var that = this,
                    ret;

                var valHandlers = {

                    'select': function selectVal( pValue ){

                        var that = this,
                            multiSelect = that.type === "select-multiple",
                            ret;

                        if ( !arguments.length ) { // getter

                            ret = [];

                            [].forEach.call(
                                that.selectedOptions,
                                function( pOption ){
                                    if ( pOption.selected ){
                                        if ( !pOption.disabled
                                            && ( !pOption.parentNode.disabled
                                            || pOption.parentNode.nodeName !== "optgroup" )
                                        ){
                                            var value = pOption.value;

                                            ret.push( value );
                                        }                                    }
                                    }
                                );

                            return ret;

                        } else { // setter

                            // if single value given convert to array
                            pValue = multiSelect && pValue.constructor !== Array ? [ pValue ] : pValue;

                            // if not multiSelect but array given set array to first value
                            pValue = !multiSelect && pValue.constructor === Array ? [ pValue[0] ] : pValue;

                            // remove all 'selected' attributes
                            tb.dom( 'option', that )
                                .removeAttr( 'selected' );

                            // set given 'selected' attributes
                            pValue
                                .forEach(
                                    function( pThisOptionValue ){
                                        tb.dom( 'option[value="' + pThisOptionValue + '"]', that )
                                            .attr( { 'selected': 'selected' } );
                                    }
                                );

                        }

                        return that;
                    },

                    'default':function defaultVal( pValue ){

                        var that = this,
                            ret;

                        if ( that.type === 'radio' ){ // input radio or checkbox
                            var name = that.name,
                                result,
                                selector = '[name="' + name + '"]',
                                radios = tb.dom( that ).parents( 'form' ).descendants( selector );

                            radios
                                .forEach(
                                    function( pRadio ){
                                        var isElement;

                                        if ( typeof pValue !== 'undefined' ){ // setter
                                            isElement = pRadio.value === pValue;
                                            if ( isElement ){
                                                that.checked = true;
                                                result = pValue;
                                            }
                                        } else { // getter
                                            if ( !!that.checked ){
                                                result = that.value;
                                            }
                                        }

                                    }
                                );

                            return result; 

                        } else { // not a radio

                            if ( !arguments.length ) { // getter

                                ret = that.value;

                                return typeof ret === "string" ?
                                    ret :
                                    ret == null ? "" : ret;

                            } else { // setter

                                // Treat null/undefined as ""; convert numbers to string
                                if (pValue == null) {
                                    pValue = "";
                                } else if (typeof val === "number") {
                                    pValue += "";
                                }

                                that.value = pValue;

                            }

                        }

                    }

                };

                if ( arguments.length ){

                    that.forEach(
                        function ( pElement ) {

                            var inputTags = [ 'input', 'select', 'textarea'];

                            if ( pElement.nodeType !== 1
                                || ( inputTags ).indexOf( pElement.tagName.toLowerCase() ) === -1
                            ){
                                return; // not an input element
                            }

                            ret = !!valHandlers[ pElement.tagName.toLowerCase() ]
                                ? valHandlers[ pElement.tagName.toLowerCase() ].call( pElement, pValue )
                                : valHandlers[ 'default' ].call( pElement, pValue );

                        }
                    );

                    return that;

                } else { // getter

                    that.some(
                        function ( pElement ) {

                            var inputTags = [ 'input', 'select', 'textarea'];

                            if ( pElement.nodeType !== 1
                                || ( inputTags ).indexOf( pElement.tagName.toLowerCase() ) === -1
                            ){
                                return false; // is not an input element
                            }

                            ret = !!valHandlers[ pElement.tagName.toLowerCase() ]
                                ? valHandlers[ pElement.tagName.toLowerCase() ].call( pElement )
                                : valHandlers[ 'default' ].call( pElement );

                            return true; // is an input element

                        }
                    );

                }

                return ret;

            }

            /**
             @method values

             @param {object} [pValues] - field values

             @return {object} - an object containing all values of a forms input fields

             get or set all form input values
             */
            function values( pValues ) {
                var that = this,
                    values = pValues || {},
                    formNode,
                    ret = {},
                    value;

                formNode = that[0] || undefined;

                if ( !formNode || formNode.tagName !== 'FORM' ) { // not a form or no inputs
                    return ret;
                }

                tb.dom( 'input,select,textarea', formNode )
                    .forEach(
                        function( pInput ){
                            var name = tb.dom( pInput ).attr( 'name' );

                            // console.log( 'tb.Dom.values() input:', pInput );
                            if ( !!pValues && typeof values[name] !== 'undefined' ){
                                value = !!values[name] ? values[name] : '';
                                tb.dom( pInput ).val( value );
                            }

                            ret[name] = tb.dom( pInput ).val();
                        }
                    );

                //console.log( 'tb.Dom.values() ret:', ret );

                return ret;
            }

        };
    })();
}


/*
YOU MUST KEEP THE ORDER IN THIS FILE!
-functions depend on sequence of appearence partly
*/

/**
 @class tb.Util
 @constructor
 
 @param {void}

 @return {void}

 THIS IS A PLACEHOLDER CLASS!

 - all methods and properties documented here are curry properties of the tb constructor.
 - Refer to specific documentation for usage.

 @example
    // see methods
 
 */

/**
 @method tb.observable

 @param pStartValue - initial content of observable

 @return {function} - observableFunction

 function tb.observable()

 - creates a function
 - initializes a value to observe
 - returns this function

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
         false                                  // false or no parameter indicates callback will be called
                                                // whenever the data changes
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

    var observedValue = pStartValue;

    // make observable function to return in the end
    var observableFunction = function( p1, p2 ){

        function notify(){
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

    // function used to add a callbacks
    observableFunction.observe = function( pFunction, pOnce ){
        pFunction.once = pOnce || false;
        observableFunction.notifiers.push( pFunction );
    };

    return observableFunction;
};


/**
 @method  tb.namespace

 @param {string} pNamespace
 @param {object} [pObject] - object to scan

 @return {Object} instance of internal Namespace class

 tb.namespace() function

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
 @method tb.bind

 @param   {object} pRootNode - DOM node to start binding in

 @return {void}

 tb.bind() function

 @example

     tb.bind( document.body );
     // scans the given element and all of its descendants
     // in the DOM and looks for attributes "data-tb" in the nodes.

     // Resulting list will be scanned for those nodes that do not already
     // have a tb object inside which is given as a namespace in the data-tb attribute.

     // Creates missing tb object based on the class namespace given
     // in the "data-tb" attribute and stores it in the DOM element
    
 */
tb.bind = function( pRootNode ){

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
 @method tb.idle

 @param   {function} pCallback - function to execute when all loading is finished

 @return {void}

 tb.idle() function

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
            f.lastChanged = tb.status.loadCount.lastChanged; // get timestamp for when loadcount has been changed

            var tf = function(){
                var x = tb.status.loadCount();

                if (
                    x === 0 // nothing loading currently
                    && tb.loader.idle() // system is idle
                    && tb.status.loadCount.lastChanged === f.lastChanged // and its still the previous '0' loadcount
                ){
                    // system is still idle
                    if ( typeof pCallback === 'function'){
                        pCallback();
                    }
                } else {
                    // probably not idle -> retry in 50 ms
                    f.lastChanged = tb.status.loadCount.lastChanged;
                    setTimeout(
                        tf,
                        50
                    );
                }
            };

            setTimeout(
                tf,
                50
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
 @method tb.getId

 @return {string} - unique id

 returns a unique id
 */
tb.getId = function(){
    return 'id-' + (new Date()).getTime() + '-' + Math.random().toString().replace(/\./, '');
};



/**
 @method tb.extend

 @param {object} pObj - object to extend
 @param {object} [pObj] - other object

 @return {object} - other object

 tb.extend() function

 takes any number of objects as parameters
 merges content into the first parameter object
 always a deep copy
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
 @method tb.parse
  
 @param pWhat - text, object or array to parse
 @param {object} pParse - hash object containing replacement key/value pairs

 @return result, = pWhat parsed

 tb.parse() function

 will replace all matching {namespace1.namespace2.etc} occurrences with values from pParse object
 if typeof pWhat is object or array, it will be done with all strings contained therein and the original pWhat returned

 @example

     tb.parse( "{a} test test", { a: 'done' } )
     // "done test test"

     tb.parse( [ "{a} test test" ], { a: 'done' } )
     // ["done test test"]

     tb.parse( [ "{a} test test", "{b} test test" ], { a: 'done', b: 'processed' } )
     // ["done test test", "processed test test"]

     tb.parse( [ "{a} test test", "{b} test test", { g: "another {silly} test" } ], { a: 'done', b: 'processed', silly: 'not so silly' } )
     // ["done test test", "processed test test", Object { g="another not so silly test"}]

     tb.parse( { a: "{a} test test", b: "{b} test test", c: [ "another {silly} test" ] }, { a: 'done', b: 'processed', silly: 'not so silly' } )
     // Object { a="done test test",  b="processed test test",  c=[ "another not so silly test" ] }

 */
tb.parse = function( pWhat, pParse ){

    if ( typeof pWhat === 'string' ){
        var vars = pWhat.match( /\{[^\{\}]*\}/g );

        if ( !!vars ) {
            vars
                .forEach(
                    function (pPropname) {
                        var propname = pPropname.substr(1, pPropname.length - 2),
                            value = tb.namespace( propname, pParse ).get(),
                            propValue = typeof value === 'undefined' ? propname + ' not found!' : value;

                        pWhat = pWhat.replace( pPropname, propValue );
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

 @returns a twoBirds request object

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
        function handleReadyState(pReq, pCallback, pStateChange, pFailure, pOptions) {
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
                        handleTransactionResponse(pReq, pCallback, pFailure, pOptions);
                    }
                };
            })(0), interval);

            return poll;
        }

        /** @private */
        function handleTransactionResponse(pReq, pCallback, pFailure, pOptions) {
            var httpStatus,
                responseObject;

            try {
                httpStatus = pReq.connection.status;
            }
            catch (e) {
                httpStatus = 13030;
            }

            if (httpStatus >= 200 && httpStatus < 300) {
                responseObject = createResponseObject(pReq, pOptions);
                try {
                    pCallback.call(pCallback, responseObject);
                }
                catch (e) {
                    if (tb.debug){
                        debugger;
                    }
                }
            }
            else {
                responseObject = createResponseObject(pReq, tb.extend( {}, pOptions ) );
                pFailure.call( pFailure, responseObject );
            }
            release(pReq);
        }

        /** @private */
        function createResponseObject(pObj, pOptions) {
            var obj = {
                tId: pObj.identifier,
                status: pObj.connection.status,
                statusText: pObj.connection.statusText,
                allResponseHeaders: pObj.connection.getAllResponseHeaders(),
                text: pObj.connection.responseText,
                xml: pObj.connection.responseXML,
                options: pOptions
            };

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
                stateHandler = pOptions.statechange || tb.nop,
                isCachable = pOptions.cachable || false,
                headers = pOptions.headers || {},
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
                if ( ( method === 'GET' || method === 'DELETE' ) && params !== '') {
                    url = url + (url.indexOf('?') < 0 ? '?' : '&') + params;
                }
                xmlreq.src = url;

                xmlreq.connection.open(method, url, isAsync);

                if (isAsync === true) {
                    xmlreq.poll = handleReadyState(xmlreq, successHandler, stateHandler, errorHandler, pOptions);
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
                                //if ( !myR && myR.connection.status == 4 ) return;
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
                        successHandler( xmlreq );
                    }
                    else {
                        errorHandler( xmlreq );
                    }
                }
                else {
                    return xmlreq;
                }
                return;
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




/**
 @class tb.Model
 @constructor

 @param {object} pConfig - config parameter, usually an object @todo param description

 @return {object} - the model instance

 tb.Model constructor
 - create and return a simple CRUD model a "data" observable

 @example

     // templates crud model
     that.templatesModel = new tb.Model({
                'read': {
                    url: 'demoapp/configuration/mock/demoapp-configuration-templates.json', // mock data
                    method: 'GET',
                    type: 'json',
                    params: {
                    },
                    success: function( pResult ){
                        that.templatesModel.data( JSON.parse( pResult.text ).data );
                    },
                    error: function( pResult ){
                        console.log( 'an error occured', pResult );
                    }
                }
            });

     // ... and later:

     // when template list data has been read, render
     that.templatesModel.data.observe( function templateModelDataChanged(){
                that.trigger( 'render' );
            });

     // read data
     that.templatesModel.read();

 @example

     // default config mixin -> result will be in that.config
     tb.extend(
     that.config,
     {   // default settings, reference only
         'create': {
             url: '',
             method: 'POST',
             success: function( pResult ){
                 that.data( pResult );
             }
         },
         'read': {
             url: '',
             method: 'GET',
             success: function( pResult ){
                 that.data( pResult );
             }
         },
         'update': {
             url: '',
             method: 'PUT',
             success: function( pResult ){
                 that.data( pResult );
             }
         },
         'delete': {
             url: '',
             method: 'DELETE',
             success: function( pResult ){
                 that.data( pResult );
             }
         }
     },
     pConfig
     );

 */
if (typeof module === 'undefined' ){ // will not work as a module

    tb.Model = function ( pConfig ) {
        var that = this;

        // result element
        that.data = tb.observable( {} );
        that.config = {};

        // default config mixin -> result will be in that.config
        tb.extend(
            that.config,
            {   // default settings, reference only
                'create': {
                    url: '',
                    method: 'POST',
                    success: function( pResult ){
                        that.data( pResult );
                    }
                },
                'read': {
                    url: '',
                    method: 'GET',
                    success: function( pResult ){
                        that.data( pResult );
                    }
                },
                'update': {
                    url: '',
                    method: 'PUT',
                    success: function( pResult ){
                        that.data( pResult );
                    }
                },
                'delete': {
                    url: '',
                    method: 'DELETE',
                    success: function( pResult ){
                        that.data( pResult );
                    }
                }
            },
            pConfig
        );

    };

    tb.Model.prototype = (function(){
        // private

        // create get parameter string
        function makeGetParameterString( pParameterObject ){

            var result='';

            Object
                .keys( pParameterObject )
                .forEach(
                    function( key ) {
                        result += ( !!result ? '&' : '' ) + key + '=' + pParameterObject[key];
                    }
                );

            return result;
        }

        return {

            /**
             @method create

             @param {object} [pParameters] - any combination of parameters

             .create() method

             */
            'create': function( pParams ){
                var o = tb.extend( {}, this.config.create );

                pParams = pParams || {};

                if ( !o.url ){
                    console.error( 'no create url given!');
                    return;
                }

                tb.request(
                    tb.extend(
                        o,
                        { // if params given, use microparse to fill them in url
                            url: pParams ? tb.parse( this.config.create.url, pParams ) : this.config.create.url
                        },
                        {
                            params: pParams
                        }
                    )
                );

            },

            /**
             @method read

             @param {object} [pParameters] - any combination of parameters

             .read() method

             */
            'read': function( pParams ){

                var o = tb.extend( {}, this.config.read );

                pParams = pParams || {};

                if ( !o.url ){
                    console.error( 'no read url given!');
                    return;
                }

                tb.request(
                    tb.extend(
                        o,
                        { // if params given, use microparse to fill them in url
                            url: pParams ? tb.parse( this.config.read.url, pParams ) : this.config.read.url
                        },
                        {
                            params: pParams
                        }
                    )
                );

            },

            /**
             @method update

             @param {object} [pParameters] - any combination of parameters

             .update() method

             */
            'update': function( pParams ){
                var o = tb.extend( {}, this.config.update );

                pParams = pParams || {};

                if ( !o.url ){
                    console.error( 'no update url given!');
                    return;
                }

                tb.request(
                    tb.extend(
                        o,
                        { // if params given, use microparse to fill them in url
                            url: pParams ? tb.parse( this.config.update.url, pParams ) : this.config.update.url
                        },
                        {
                            params: pParams
                        }
                    )
                );

            },

            /**
             @method delete

             @param {object} [pParameters] - any combination of parameters

             .delete() method

             */
            'delete': function( pParams ){
                var o = tb.extend( {}, this.config['delete'] );

                pParams = pParams || {};

                if ( !o.url ){
                    console.error( 'no delete url given!');
                    return;
                }

                tb.request(
                    tb.extend(
                        o,
                        { // if params given, use microparse to fill them in url
                            url: pParams ? tb.parse( this.config.delete.url, pParams ) : this.config.delete.url
                        },
                        {
                            params: pParams
                        }
                    )
                );

            }

        };

    })();
}


/**
 @class tb.Require
 @constructor

 @param   {array} pRequiredFiles - array containing required files

 @return {void}

 tb.require class

 - add into prototype of your constructor
 - instance will get an 'init' event when all files have loaded.

 @example

     tb.namespace( 'app.GrandParent' ).set( 
         (function(){

              // Constructor
              function GrandParent(){
                  var that = this;
    
                  that.handlers = {
                      init,
                      test
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
    
              // ...
    
         })()
     );
 */
if ( typeof module === 'undefined' ) {

    tb.Require = function (pConfig, pCallback ) {

        var that = this;

        pConfig = !!pConfig ? pConfig : [];

        that.requirements = pConfig;

        function requireCallback() {
            if ( !!that['target'] && typeof that['target']['tb.Require'] !== 'undefined' ){
                that.target.trigger('init');
            }
            if ( typeof pCallback === 'function'){
                pCallback();
            }
        }

        if ( that.requirements.length === 0 ){
            setTimeout(
                requireCallback,
                10
            );
            return;
        }

        // add requirement loading
        tb.loader.load(
            that.requirements,
            requireCallback
        );

    };

    tb.Require.prototype = {
        ready: function () {
            // do we need this???
        }
    };

    /**
     * requirement handling
     */
    (function () {
        // private

        function getTypeFromSrc(pSrc) {
            return pSrc.split('?')[0].split('.').pop();
        }

        // requirement constructor
        function _Requirement(pConfig) {

            var that = this,
                type = getTypeFromSrc(pConfig.src), // filename extension
                typeConfigs = { // standard configuration types
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
                typeConfig, // a single type configuration
                element,
                isTyped = !!typeConfigs[type],
                fileName = pConfig.src.split('?')[0];

            //console.log( '_Requirement:', fileName, type );

            tb.status.loadCount(tb.status.loadCount() + 1); // increase loadCount

            pConfig.type = type; // add type

            that.config = pConfig;

            // cache busting
            if (!!that.config.src) {
                that.config.src = that.config.src + ( that.config.src.indexOf('?') > -1 ? '&' : '?' ) + tb.getId();
            }

            //that.target = pConfig.target;
            that.src = pConfig.src;
            that.type = that.config.type = type;
            that.done = false;
            that.cb = that.config.cb || function () {};
            that.data = tb.observable('');

            // element 'load' callback
            function onLoad(e) {

                if (!!e && e.data) {
                    that.data(e.data);
                }

                that.done = true;

                tb.status.loadCount(tb.status.loadCount() - 1); // decrease loadCount

                tb.loader.trigger('requirementLoaded', fileName );

            }

            // execute onLoad only once
            onLoad.once = true;

            // handlers
            that.handlers = {
                'onLoad': onLoad
            };


            if (isTyped) { // either *.css or *.js file

                // get default config for type
                typeConfig = typeConfigs[type];

                // create DOM element
                element = document.createElement(typeConfig.tag);
                element.async = true;
                element.onreadystatechange = element.onload = function () {
                    var state = element.readyState;
                    if (!that.done && (!state || /loaded|complete/.test(state))) {
                        that.trigger('onLoad', element);
                    }
                };

                // add attributes to DOM element
                Object
                    .keys( typeConfig.attributes )
                    .forEach(
                        function( pKey ){
                            element.setAttribute(pKey, tb.parse(typeConfig.attributes[pKey], that.config));
                        }
                    );

                // append node to head
                document.getElementsByTagName('head')[0].appendChild(element);

                that.element = element;

            } else { // load via request if unknown type, trigger callback with text or JSON

                var f = function (data) {

                    if (that.type === 'json' && !!data['text']) {
                        try {
                            data = JSON.parse(data.text);
                        } catch (e) {
                            console.log('error parsing, JSON expected in:', data);
                        }
                    } else {
                        data = data.text;
                    }

                    that.trigger('onLoad', data);
                };

                var options = {
                    url: that.src,
                    success: f,
                    error: f
                };

                tb.request(options);

            }

        }

        _Requirement.prototype = {
            namespace: '_Requirement'
        };


        // requirement group constructor
        function _RequirementGroup(pConfig) {

            var that = this;

            that.type = pConfig.type;
            that.target = pConfig.target;

            that.requirements = {};

        }

        _RequirementGroup.prototype = {

            namespace: '_RequirementGroup',

            load: function (pSrc) {

                var that = this,
                    rq = !!that.requirements[pSrc];

                if (!rq) { // not loading or loaded: add a new requirement

                    rq = that.requirements[pSrc] = new tb(
                        _Requirement,
                        {
                            src: pSrc,
                            target: that.target
                        },
                        that.requirements
                    );

                    that.requirements[pSrc].target = tb.loader; // needed for event bubbling

                } else { // already loading or loaded

                    rq = that.requirements[pSrc];

                }

                if (!!rq.done) { // already loaded
                    rq.trigger('onLoad');
                }

            }

        };


        function Loader(pConfig) {
            var that = this;

            that.config = pConfig;
            that.requirementGroups = {}; // will later contain requirement groups ( grouped by file extension )
            that.rqSets = []; // requirement sets, may contain various file types

            that.handlers = {
                requirementLoaded: requirementLoaded
            };
        }


        Loader.prototype = {

            namespace: '_Head',

            load: function (pSrc, pCallback) {

                var that = this,
                    type,
                    rg;

                pSrc = typeof pSrc === 'string' ? [pSrc] : pSrc; // convert to array if string
                pSrc = [].concat.call( [], pSrc); // make an array copy

                pCallback = pCallback || function (e) { console.log('onLoad dummy handler on', e); };

                pSrc.callback = pCallback;

                pSrc.done = function (pFilename) { // will be called when each file 'requirementLoaded' was triggered
                    if (pSrc.indexOf(pFilename) > -1) {
                        pSrc.splice(pSrc.indexOf(pFilename), 1);
                    }
                };

                that.rqSets.push(pSrc);

                // will trigger loading if necessary ( async callback even if already loaded )
                pSrc
                    .forEach(
                        function (filename) {
                            type = getTypeFromSrc(filename);
                            rg = !!that.requirementGroups[type];

                            if (!rg) { // add a new requirement group

                                that.requirementGroups[type] = new tb(
                                    _RequirementGroup,
                                    {
                                        type: type
                                    },
                                    that.requirementGroups
                                );

                                that.requirementGroups[type].target = tb.loader; // needed for event bubbling
                            }

                            rg = that.requirementGroups[type];

                            // if already loaded
                            //console.log( 'test:', filename );
                            if (!!that.requirementGroups[type].requirements[filename]
                                && !!that.requirementGroups[type].requirements[filename].done) { // already loaded

                                //console.log( 'already loaded:', filename );

                                tb.loader.trigger('requirementLoaded', filename );

                                return;
                            }

                            rg.load(filename);
                        }
                    );

            },

            get: function (pFileName) {

                var that = this,
                    type = getTypeFromSrc(pFileName),
                    rg = that.requirementGroups[type] ? that.requirementGroups[type] : false,
                    rq = rg ? ( rg.requirements[pFileName] ? rg.requirements[pFileName] : false ) : false;

                return rq ? rq.data() : false;
            },

            idle: function() {
                var that = this;

                return !!that.rqSets; // false if everything loaded
            }

        };

        tb.loader = new tb(Loader);

        function requirementLoaded(e) {

            var that = this,
                filename = e.data;

            //console.log( 'requirementLoaded(', filename, ')' );

            that
                .rqSets
                .forEach(
                    function (pRqSet) {
                        pRqSet.done(filename);
                        if (pRqSet.length === 0) { // every file loaded
                            pRqSet.callback();
                        }
                    }
                );

            that.rqSets = that
                .rqSets
                .filter(
                    function (pElement) {
                        return pElement.length > 0;
                    }
                );

            e.stopPropagation();
        }

    })();

} else {
    // todo: in a node module
    console.log( 'tb.Require not implemented yet for node use!!!');
}