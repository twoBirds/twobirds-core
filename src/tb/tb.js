/*! twobirds-core - v7.0.48 - 2016-07-09 */

/**
 twoBirds V7 core functionality

 @author          frank.thuerigen <frank_thuerigen@yahoo.de>
 @copyright       copyright (c) 2006- Frank Thürigen
 @license         http://www.gnu.org/copyleft/gpl.html GNU GPL v3

 */

// POLYFILLS

// matches polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function(selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
}(Element.prototype);

// closest polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
        function(selector) {
            var el = this;
            while (el.matches && !el.matches(selector)) el = el.parentNode;
            return el.matches ? el : null;
        }
}(Element.prototype);

// twoBirds

tb = (function(){

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

        if ( !pSelector ) return that;

        switch (typeof pSelector) {

            // selection by dom selector string
            case 'string':
                // HINT: must be a tb element for every selector of a css selector string
                var selector = pSelector.split(' '),
                    selector = selector.map(function(s){
                        if (1 < s.length){
                            return s+':not([data-tb=""])';
                        }
                        return s;
                    }),
                    selector = selector.join(' ');

                tb.dom( selector )
                    .forEach(
                        function ( pDomNode ) {
                            pDomNode.tb
                                .forEach(
                                    function( pTbElement ){
                                        [].push.call( that, pTbElement ); // push dom object to tb selector content
                                    }
                                )
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
                                pDomNode.tb
                                    .forEach(
                                        function( pTbElement ){
                                            if ( pTbElement instanceof tb
                                                && !!pTbElement['namespace']
                                                && !!pTbElement.namespace.match(pSelector)
                                            ){
                                                [].push.call( that, pTbElement );
                                            }
                                        }
                                    )
                            }
                        );

                } else if ( !!pSelector['nodeType'] && !!pSelector['tb'] ){ // it is a dom node containing tb elements
                        pSelector.tb
                            .forEach(
                                function( pTbElement ){
                                    [].push.call( that, pTbElement );
                                }
                            )

                } else if ( pSelector.constructor === Array || !!pSelector['length'] && !!pSelector['0'] && !(pSelector instanceof Array) ){
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
                            pDomNode.tb
                                .forEach(
                                    function( pTbElement ){
                                        if ( pTbElement instanceof tb
                                            && pTbElement instanceof pSelector
                                        ){
                                            [].push.call( that, pTbElement );
                                        }
                                    }
                                )
                        }
                    );

                break;
        }

        return that;

    }

    // empty class def for temporary handler storage, needed for on(), one(), off() and trigger()
    function Nop(){};
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
             anotherTbInstance           // any other object you want to put the tb instance in
         );

         // if a namespace STRING is given, requirement loading is done in case the class isnt present yet
             new tb(
             'app.myConstructor',          // namespace string for the constructor you want to have an instance of
             { ... },                      // the config object you hand over to the constructor
             anotherTbInstance          // any other object you want to put the tb instance in
         );

     */
    function tb() {
        var that = this;

        function makePrototype( pPrototype ){

            // make custom class constructor
            var f = function ( pPrototype ){

                var that = this;

                for ( var i in pPrototype ) if ( pPrototype.hasOwnProperty(i) ){
                    that[i] = pPrototype[i];
                }

            };

            f.prototype = tb.prototype;

            return new f( pPrototype );
        }

        // merge handlers from temp instance into target object
        function mergeHandlers( pSourceTb , pTargetTb ){
            for ( var i in pSourceTb.handlers ) if ( pSourceTb.handlers.hasOwnProperty(i) ){
                if ( !pTargetTb.handlers[i] ){
                    pTargetTb.handlers[i] = [];
                }
                for ( var j = 0, l = pSourceTb.handlers[i].length; j < l; j++ ){
                    pTargetTb.handlers[i].push( pSourceTb.handlers[i][j] ); // copy handler
                }
            }
        }

        if ( that instanceof tb ) {    // called as constructor, create and return tb object instance
            var isNamespace = typeof arguments[0] === 'string',
                tbClass =  isNamespace ? tb.namespace( arguments[0] ) : arguments[0],
                tbInstance,
                fileName,
                tempInstance; // empty tb object, used as handler store

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
                                for ( var i in tempInstance ) if (
                                    (['handlers', 'target']).indexOf(i) === -1
                                    && tempInstance.hasOwnProperty(i)
                                ){
                                    thisTb[i] = tempInstance[i];
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
                    tbClass.prototype.__tb__ = 'V7';
                    tbClass.prototype = makePrototype( tbClass.prototype, tbClass );
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
                        arguments[2] = arguments[2][0]; // get first element of an array-like selector return object
                    }

                    tbInstance.target = arguments[2];
                } else {
                    tbInstance.target = null;
                }

                // if target is a DOM element
                // - add class to DOM data
                // - if not already there add namespace to target data-tb attribute
                if ( tbInstance.target && tbInstance.target.nodeType && !( tbInstance instanceof Nop ) ){

                    // put tb instance in dom node
                    tbInstance.target.tb = !!tbInstance.target['tb'] ? tbInstance.target.tb : [];
                    tbInstance.target.tb.push(tbInstance);

                    // if element does not reside in the DOM <head> add class
                    var dom = tb.dom( tbInstance.target );

                    // add class
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
                            tbInstance.target.setAttribute( 'data-tb', tbInstance.namespace )
                        }
                    }
                }

                // create handlers array if necessary
                if ( !tbInstance[ 'handlers' ] ){
                    tbInstance.handlers = {};
                } else {
                    // if there are single named event handler functions,
                    // convert them to array of functions
                    for ( var i in tbInstance.handlers ) if ( tbInstance.handlers.hasOwnProperty(i) ){
                        if ( typeof tbInstance.handlers[i] === 'function' ){
                            tbInstance.handlers[i] = [ tbInstance.handlers[i] ];
                        } else if ( !( tbInstance.handlers[i] instanceof Array ) ){
                            delete tbInstance.handlers[i];
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

            //console.log( 'tbSelector not constructor' );
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

    tb.prototype = (function(){
        // private static

        function _toArray( pTbSelector ){
            if ( pTbSelector && pTbSelector instanceof tb ){
                return [].map.call(
                    pTbSelector,
                    function ( pElement ){
                        return pElement;
                    }
                );
            }
            return [];
        }

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

                        that.handlers[tbEvent.name] = temp;

                    }

                    // if event __stopped__ , handling is cancelled
                    if ( !!tbEvent.__stopped__  ) {
                        return that;
                    }

                    setTimeout(
                        function(){

                            // bubble up
                            if ( tbEvent.bubble.indexOf('u') > -1 ){
                                tbEvent.bubble += tbEvent.bubble.indexOf('l') === -1 ? 'l' : '';
                                var done = false,
                                    tbObject = that;

                                while ( !done && !!tbObject ){
                                    var tbObject = tbObject.parent()[0] || false;

                                    if ( !!tbObject['handlers']
                                        && !tbEvent.__stopped__
                                        && tbObject.handlers[ tbEvent.name ]
                                    ){
                                        tbObject.trigger( tbEvent );
                                    }
                                }
                            }

                            // bubble down
                            if ( tbEvent.bubble.indexOf('d') > -1 ){
                                tbEvent.bubble += tbEvent.bubble.indexOf('l') === -1 ? 'l' : '';
                                [].map.call(
                                    that.children(),
                                    function( tbObject ){
                                        if ( tbObject.handlers[ tbEvent.name ] ){
                                            tbObject.trigger(
                                                new tb.Event(
                                                    tbEvent.name,
                                                    tbEvent.data,
                                                    tbEvent.bubble
                                                )
                                            );
                                        }
                                    }
                                );
                            }

                        },
                        10
                    )

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

                if ( -1 < pEventName.indexOf(' ') ){
                    eventNames = pEventName.split(' ');
                } else {
                    eventNames = [ pEventName ];
                }
                pHandler.once = !!pHandler.once || !!pOnce;

                eventNames.forEach(function(pEventName){
                    if ( that instanceof TbSelector ) {

                        walkSelector( that, 'on', arguments );

                    } else if ( that instanceof tb) {

                        if ( !that.handlers ){
                            that.handlers = {};
                        }

                        if ( !that.handlers[ pEventName ] ){
                            that.handlers[ pEventName ] = [];
                        }

                        that.handlers[ pEventName ].push( pHandler );
                    }
                });

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

                that.on( pEventName, pHandler, true ); // add event that is only being triggered once

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

                if ( -1 < pEventName.indexOf(' ') ){
                    eventNames = pEventName.split(' ');
                } else {
                    eventNames = [ pEventName ];
                }
                pHandler.once = !!pHandler.once || !!pOnce;

                eventNames.forEach(function(pEventName){
                    if ( that instanceof TbSelector ) {

                        walkSelector( that, 'off', arguments );

                    } else if ( that instanceof tb ) { // either a toplevel or an internal tb object

                        if ( !that.handlers[ pEventName ] ){
                            return;
                        }

                        index = that.handlers[ pEventName].indexOf( pHandler );

                        if ( index > -1 ){
                            that.handlers[ pEventName ].splice( index, 1 );
                        }

                    }
                });

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
                                    pElement.tb
                                        .forEach(
                                            function( pTbElement ){
                                                [].push.call( ret, pTbElement ); // push dom object to tb selector content
                                            }
                                        )
                                }
                            );

                    } else if ( that.target instanceof tb ){
                        // it a tb object embedded in another tb object

                        [].push.call( ret, that.target ); // push parent object to tb selector content

                        if ( !!that.target.parent()['0'] ){
                            [].push.call( ret, that.target.parent()['0'] )
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

                        if ( !tbParent ) return ret; // no parent -> empty result set

                        tbParent.target.tb
                            .forEach(function( tbElement ){
                                [].push.call( ret, tbElement ); // push dom object to tb selector content
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
                            function( pDomElement ) {
                                pDomElement.tb
                                    .forEach(function( tbElement ){
                                        [].push.call( ret, tbElement ); // push dom object to tb selector content
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

                if ( that instanceof TbSelector ) {

                    ret = walkSelector( that, 'children', arguments );

                } else if ( that instanceof tb && !!that.target['nodeType'] && !pLocalOnly ) { // it must be a native tb object
                    //console.log( 'children of ', that.target, tb.dom( '[data-tb]', that.target ) );
                    tb.dom( '[data-tb]', that.target )
                        .forEach(
                            function( pDomNode ) {
                                //console.log( pDomNode, tb.dom( pDomNode ).parents('[data-tb]')[0] === that.target );

                                if ( tb.dom( pDomNode ).parents('[data-tb]')[0] === that.target ){
                                    pDomNode.tb
                                        .forEach(function( tbElement ){
                                            [].push.call( ret, tbElement ); // push dom object to tb selector content
                                        });
                                }
                            }
                        );

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
                var that = this,
                    result = [].filter.call( that, function(){ return true; } );

                return result;
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
                    ret,
                    index;

                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    [].push.call( ret, that );
                }

                that.each(
                    check,
                    function( key, tbObject ) {

                        index = [].indexOf.call( ret, tbObject );
                        if (  index > -1 ){
                            [].splice.apply( ret, [ index, 1 ] );
                        }

                    }
                );

                return ret;
            },

            /**
             @method is
             @chainable

             @param [pParam] - any kind of TbSelector parameter

             @return {object} - tb.Selector instance (maybe empty) - for chaining

             is() method

             for each this[0...n] or this as tb() instance,
             - check them against tbSelector( pParam ) and remove all that DO NOT match
             - return TbSelector result set (unique)
             */
            is: function( pSelector ){

                var that = this,
                    check = tb( pSelector ).toArray(), // object array to check against
                    ret,
                    index;

                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb();
                    [].push.call( ret, that );
                }

                check.forEach(
                    function( tbObject ) {

                        index = [].indexOf.call( ret, tbObject );
                        if (  index === -1 ){
                            [].splice.apply( ret, [ index, 1 ] );
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
                    check = tb( pSelector ).toArray(), // object array to check against
                    ret,
                    index;


                if ( that instanceof TbSelector ) {
                    ret = that;
                } else {
                    ret = tb( '' );
                    [].push.call( ret, that );
                }

                check.forEach(
                    function( tbObject ) {

                        index = [].indexOf.call( ret, tbObject );

                        if (  index === -1 ){ // unique result set...
                            [].push.call( ret, tbObject );
                        }

                    }
                );

                return ret;
            }

        };

    })();

    TbSelector.prototype = {};
    for ( var i in tb.prototype ) if ( tb.prototype.hasOwnProperty(i)){
        TbSelector.prototype[i] = tb.prototype[i];
    }

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
}

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

/**
 * document.ready bootstrap
 */
(function(){

    function domReady () {
        tb.bind( 'body' ); // find all tb dom nodes and add tb objects if not yet done
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

;
/**
 tb.dom() function
 jquery like selector engine

 @function dom
 @namespace tb
 @static

 @param {string|domNode|array} a selector string, a dom node or an array of dom nodes
 @return {string} - result string
 */
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
        function _addEvent( pDomNode, pEventName, pHandler ) {
            if (pDomNode.attachEvent) {
                pDomNode.attachEvent('on' + pEventName, pHandler);
            } else {
                pDomNode.addEventListener(pEventName, pHandler);
            }
        }

        function _removeEvent( pDomNode, pEventName, pHandler ) {
            if (pDomNode.detachEvent){
                pDomNode.detachEvent('on'+pEventName, pHandler);
            } else {
                pDomNode.removeEventListener(pEventName, pHandler);
            }
        }

        function _htmlToElements(html) {
            var template = document.createElement('template');
            template.innerHTML = html;
            return template.content.childNodes;
        }

        function _mapArrayMethod( pMethodName ){
            var method = [][pMethodName];

            return function(){
                var arr = this.toArray(),
                    ret = method.apply( arr, arguments );

                return (new tb.dom( ret )).unique();
            };
        }

        // dom constructor
        dom = function tbDom(pSelector, pDomNode) {

            var that = this,
                domNode,
                nodeList;

            if (!pSelector) { // no selector given, or not a string
                return;
            } else if (!!pSelector['nodeType']) { // selector is a dom node
                [].push.call(that, pSelector);
                return;
            } else if (!!pSelector[0] && pSelector[0] instanceof TbSelector) { // a twobirds selector result set
                [].forEach.call(
                    pSelector,
                    function (pElement) {   // copy only DOM nodes
                        if (!!pElement['target']
                            && !!pElement['target']['nodeType']
                        ) {
                            [].push.call(that, pElement);
                        }
                    }
                );
                return;
            } else if (pSelector instanceof Array
                || pSelector instanceof HTMLCollection
                || pSelector instanceof NodeList ) {
                [].forEach.call(
                    pSelector,
                    function (pElement) {   // copy only DOM nodes
                        if (!!pElement && !!pElement['nodeType']) {
                            [].push.call(that, tb.dom( pElement )[0] );
                        }
                    }
                );
                return;
            } else if (typeof pSelector !== 'string') { // wrong selector type
                return;
            } else { // pSelector is a string

                var DOM = _htmlToElements( pSelector );

                if ( DOM.length === 1 && DOM[0].nodeType === 3 ){ // it is not an HTML string

                    domNode = pDomNode && !!pDomNode['nodeType'] ? pDomNode : document;

                    pSelector
                        .split( ',' )
                        .forEach(
                            function forEachTbDomSelector( pThisSelector ){
                                nodeList = domNode.querySelectorAll(pSelector);

                                if (!!nodeList.length) {
                                    [].forEach.call(
                                        nodeList,
                                        function (domElement) {
                                            that[that.length] = domElement;
                                            that.length++;
                                        }
                                    );
                                }

                            }
                        );

                } else { // it is an HTML string

                    return new tb.dom( DOM );

                }
            }

        };

        // dom prototype, public functions
        dom.prototype = {

            length: 0,

            // from Array prototype
            concat: _mapArrayMethod( 'concat' ),
            every: _mapArrayMethod( 'every' ),
            forEach: _mapArrayMethod( 'forEach' ),
            indexOf: _mapArrayMethod( 'indexOf' ),
            keys: _mapArrayMethod( 'keys' ),
            lastIndexOf: _mapArrayMethod( 'lastIndexOf' ),
            map: _mapArrayMethod( 'map' ),
            pop: _mapArrayMethod( 'pop' ),
            reduce: _mapArrayMethod( 'reduce' ),
            reduceRight: _mapArrayMethod( 'reduceRight' ),
            reverse: _mapArrayMethod( 'reverse' ),
            shift: _mapArrayMethod( 'shift' ),
            slice: _mapArrayMethod( 'slice' ),
            some: _mapArrayMethod( 'some' ),
            splice: _mapArrayMethod( 'splice' ),
            unshift: _mapArrayMethod( 'unshift' ),

            //own functions
            add: add,
            addClass: addClass,
            append: append,
            appendTo: appendTo,
            attr: attr,
            children: children,
            descendants: descendants,
            empty: empty,
            hide: hide,
            html: html,
            insertBefore: insertBefore,
            insertAfter: insertAfter,
            removeClass: removeClass,
            filter: filter,
            not: not,
            off: off,
            on: on,
            one: one,
            parent: parent,
            parents: parents,
            push: push,
            removeAttr: removeAttr,
            show: show,
            toArray: toArray,
            trigger: trigger,
            unique: unique,
            val: val
        };

        return new dom( pSelector, pDomNode );

        // Private Functions, exposed
        function appendTo( pElement ){
            var that = this;

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType ){
                        if ( !pElement.length ){
                            pElement= [ pElement ];
                        }

                        [].forEach.call(
                            pElement,
                            function( pThisElement ){
                                if ( !!pThisElement['nodeType'] ){
                                    pThisElement.appendChild( pDomNode );
                                }
                            }
                        );
                    }
                }
            );

            return that;
        }

        function append( pElement ){
            var that = this;

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType ){
                        if ( !pElement.length ){
                            pElement= [ pElement ];
                        }

                        [].forEach.call(
                            pElement,
                            function( pThisElement ){
                                if ( !!pThisElement['nodeType'] ){
                                    pDomNode.appendChild( pThisElement );
                                }
                            }
                        );
                    } else if ( typeof pElement === 'string' && regExHtml.match(pElement) ){
                        tb.dom( pDomNode ).append( tb.dom( pElement ) );
                    }
                }
            );

            return that;
        }

        function insertBefore( pTarget ){
            var that = this;

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType && !!pTarget.nodeType ){

                        pTarget.parentElement
                            .insertBefore(
                                pDomNode.cloneNode( true ),
                                pTarget
                            );

                    }
                }
            );

            return that;
        }

        function insertAfter( pTarget ){
            var that = this,
                nextDomNode = pTarget.nextSibling || false;

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType ){

                        if ( nextDomNode ){
                            pTarget
                                .parentElement
                                .insertBefore(
                                    pDomNode.cloneNode( true ),
                                    nextDomNode
                                );
                        } else {
                            pTarget
                                .parentElement
                                .appendChild(
                                    pDomNode.cloneNode( true )
                                );
                        }

                    }
                }
            );

            return that;
        }

        function trigger( pEventName, pData ){
            var that = this,
                eventNames = pEventName.split(' ');

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType ){
                        eventNames.forEach(
                            function( pThisEventName ){
                                if ('createEvent' in document) {
                                    var e = document.createEvent('HTMLEvents');
                                    e.data = pData;
                                    e.initEvent(pThisEventName, false, true);
                                    pDomNode.dispatchEvent(e);
                                } else {
                                    var e = document.createEventObject();
                                    e.data = pData;
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

        function on( pEventName, pHandler ){
            var that = this,
                eventNames = pEventName.indexOf(' ') > -1 ? pEventName.split(' ') : [ pEventName ],
                onceHandler;

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType ){
                        eventNames.forEach(
                            function( pThisEventName ){

                                if ( !!pHandler['once'] ){
                                    onceHandler = (function(pDomNode, pThisEventName, pHandler) {
                                        return function(){
                                            _removeEvent( pDomNode, pThisEventName, onceHandler );
                                            pHandler.apply( pDomNode, arguments );
                                        }
                                    })(pDomNode, pThisEventName, pHandler);
                                }

                                _addEvent( pDomNode, pThisEventName, onceHandler || pHandler );
                            }
                        );
                    }
                }
            );

            return that;
        }

        function one( pEventName, pHandler ){
            var that = this;

            pHandler.once = true;

            that.on( pEventName, pHandler );

            return that;
        }

        function off( pEventName, pHandler ){
            var that = this,
                eventNames = pEventName.indexOf(' ') > -1 ? pEventName.split(' ') : [ pEventName ];

            that.forEach(
                function( pDomNode ){
                    if ( !!pDomNode.nodeType ){
                        if ( !!pHandler ){
                            eventNames.forEach(
                                function( pThisEventName ){
                                    _removeEvent( pDomNode, pThisEventName, pHandler );
                                }
                            );
                        } else {
                            // @todo: remove all event handlers
                        }
                    }
                }
            );

            return that;
        }

        function empty() {
            var that = this;

            that.forEach(
                function( pNode ){
                    pNode.innerHTML = '';
                }
            );

            return that;
        }

        function html( pHtml ) {
            var that = this;

            if ( !!pHtml ){
                if ( typeof pHtml === 'string' ) {
                    that.forEach(
                        function (pNode) {
                            pNode.innerHTML = pHtml;
                        }
                    )
                }
            } else {
                return !!that[0] ? that[0].innerHTML : '';
            }

            return that;
        }

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

        function show() {
            var that = this;

            that.forEach(
                function( pNode ){
                    pNode.style.display = pNode.style.prevDisplay;
                }
            );

            return that;
        }

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

            return new tb.dom( result );
        }

        function not(pSelector) {
            var that = this,
                result = new tb.dom(),
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

        function add(pElements) {
            var that = this,
                result;

            if (pElements instanceof Array) { // if array given add each of its elements
                pElements.forEach(
                    function (pElement) {
                        that.add(pElement);
                    }
                );
            } else if (!!pElements['nodeType']) { // if DOM node given add it
                that.push(pElements);
            } else if (typeof pElements === 'string') { // DOM selector given add its results
                that.add(new tb.dom(pElements).toArray());
            }

            result = that.unique();

            return result;
        }

        function parents(pSelector) {

            var that = this,
                result = new tb.dom(),
                check = pSelector !== undefined ? document.querySelectorAll( pSelector ) : false,
                nextNode;

            that.forEach(
                function (pDomNode) {
                    var domNode = pDomNode.parentNode;

                    while (!!domNode
                    && !!domNode['tagName']
                    && domNode['tagName'] !== 'html'
                        ){
                        nextNode = domNode.parentNode;
                        if ([].indexOf.call(result, domNode) === -1
                            && ( !check || -1 < [].indexOf.call( check, domNode ) )
                        ) {
                            result.push(domNode);
                        }
                        domNode = nextNode;
                    }
                }
            );

            return result;
        }

        function parent(pSelector){
            var that = this,
                result = new tb.dom(),
                check = pSelector !== undefined ? document.querySelectorAll( pSelector ) : false;

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

        function children(pSelector) {

            var that = this,
                result = new tb.dom();

            that.forEach(
                function (pDomNode) {
                    var check = pSelector !== undefined ? pDomNode.querySelectorAll( pSelector ) : false;

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

        function descendants(pSelector) {

            var that = this,
                result = new tb.dom();

            that.forEach(
                function (pDomNode) {
                    var check = pSelector !== undefined ? pDomNode.querySelectorAll( pSelector ) : false;

                    [].forEach.call(
                        pDomNode.querySelectorAll( pSelector || '*' ),
                        function( pDescendantNode ){
                            if ( -1 === [].indexOf.call( result, pDescendantNode )
                                && ( !check || -1 < [].indexOf.call( check, pDescendantNode ) )
                                ){
                                result.push( pDescendantNode );
                            }
                        }
                    );
                }
            );

            return result;
        }

        function addClass(pClassName) {

            var that = this;

            that.forEach(
                function (pDomNode) {
                    var classes = pDomNode.getAttribute('class') || '',
                        classes = !!classes.length ? classes.split(' ') : [],
                        index = classes.indexOf(pClassName);

                    if (index === -1) {
                        classes.push( pClassName );
                        pDomNode.setAttribute('class', classes.join(' ') );
                    }
                }
            );

            return that;
        }

        function removeClass(pClassName) {

            var that = this;

            that.forEach(
                function (pDomNode) {
                    var classes = pDomNode.getAttribute('class') || '';

                    if ( classes ){
                        if ( !!(classes.indexOf(' ') + 1) ){
                            classes = classes.split(' ')
                        } else {
                            classes = [ classes ];
                        }

                        pClassName.split(' ')
                            .forEach(
                                function( pRemoveClass ){
                                    while ( classes.indexOf(pRemoveClass) > -1 ){
                                        classes.splice(classes.indexOf(pRemoveClass), 1)
                                    }
                                }
                            );

                        if ( !!classes.length ){
                            tb.dom( pDomNode ).attr('class', classes.join(' ') )
                        } else {
                            tb.dom( pDomNode ).removeAttr('class');
                        }
                    }

                }
            );

            return that;
        }

        function attr(pKey, pValue) {

            var that = this,
                rootNodes;

            if ( pKey.constructor === Object ){ // hash given

                Object
                    .keys( pKey )
                    .forEach(
                        function( thisKey ){
                            that.attr( thisKey, pKey[thisKey] );
                        }
                    );

            } else { // key/value pair expected

                // if no value is given and there are elements, return attribute value of first in list
                if (!pValue && that.length > 0) {
                    return that[0].getAttribute(pKey);
                }

                // if a value to set is given, apply to all nodes in list
                rootNodes = that.toArray();
                rootNodes.forEach(
                    function (pNode) {
                        if ( pKey.constructor === Object ){
                            Object
                                .keys( pKey )
                                .forEach(
                                    function( thisKey ){
                                        pNode.setAttribute( thisKey, pKey[thisKey] );
                                    }
                                );
                            return;
                        } else {
                            pNode.setAttribute(pKey, pValue);
                        }
                    }
                );

            }

            return that;
        }

        function removeAttr(pKeys) {

            var that = this,
                attrNames = pKeys && pKeys.match(regExWord),
                name,
                i;

            that.forEach(
                function (pDomNode) {
                    if (attrNames && !!pDomNode['nodeType'] && pDomNode.nodeType === 1) {
                        while ((name = attrNames[i++])) {
                            pDomNode.removeAttribute(name);
                        }
                    }
                }
            );

            return that;
        }

        function toArray() {

            var that = this,
                result = [];

            if (!!that.length) {
                [].map.call(
                    that,
                    function (pElement) {
                        result.push(pElement);
                    }
                );
            }

            return result;

        }

        function filter( pSelector ) {

            var that = this,
                compare = new tb.dom( pSelector ),// functions and undefined will be ignored, so empty result then
                result;

            if ( pSelector === 'undefined' ) return that;    // unchanged

            if ( typeof pSelector === 'string' ) { // DOM selector given
                result = [].filter.call(
                    that,
                    function (pElement) {
                        return -1 < compare.indexOf(pElement);
                    }
                );
            } else if ( typeof pSelector === 'function' ) { // function given
                result = [].filter.call(
                    that,
                    pSelector
                );
                return result;
            }

            return new tb.dom(result);

        }

        function push(pSelector) {

            var that = this,
                result = [];

            if (typeof pSelector === 'undefined') return that;    // unchanged

            if (pSelector instanceof Array) { // if array given add each of its elements
                pSelector.forEach(
                    function (pElement) {
                        that.push(pElement);
                    }
                );
            } else if (!!pSelector['nodeType']) { // if DOM node given add it
                [].push.call(that, pSelector);
            } else if (typeof pSelector === 'string') { // DOM selector given add its results
                that.push(new tb.dom(pSelector).toArray());
            }

            result = that.unique();

            return result;
        }

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

                        tb.dom( 'option:selected', that)
                            .forEach(
                                function( pThisSelectedOption ){
                                    if ( !option.disabled
                                        && ( !option.parentNode.disabled
                                        || option.parentNode.nodeName !== "optgroup" )
                                    ){
                                        var value = pThisSelectedOption.value;

                                        if ( !multiSelect ) {
                                            return value;
                                        }

                                        ret.push( value );
                                    }                                    }
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

                    if ( ([ 'radio', 'checkbox' ]).indexOf( that.type ) > -1 ){ // input radio or checkbox

                        if ( !!arguments.length ){ // setter
                            that.checked = !!pValue;
                        }

                        return that.checked; // getter

                    } else {

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

                        var inputTags = [ 'input', 'select', 'option', 'textarea'];

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

                        var inputTags = [ 'input', 'select', 'option', 'textarea'];

                        if ( pElement.nodeType !== 1
                            || ( inputTags ).indexOf( pElement.tagName.toLowerCase() ) === -1
                        ){
                            return false; // not an input element
                        }

                        ret = !!valHandlers[ pElement.tagName.toLowerCase() ]
                            ? valHandlers[ pElement.tagName.toLowerCase() ].call( pElement )
                            : valHandlers[ 'default' ].call( pElement );

                        return true; // not an input element

                    }
                );

                return ret;

            }

        }

    };
})();

;
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

     o = tb.observable( {} );

     o(
        { newData: 'newData' }
     ); // change observable value

     o.observe( function(){ ... }, true ); // will be triggered when observable value changes, true indicates only once

 */
tb.observable = function( pStartValue ){

    var observedValue = pStartValue;

    // make observable function to return in the end
    var observableFunction = function( pValue ){

        if ( pValue !== undefined ){ // value has changed
            observedValue = pValue;
            observableFunction.notify();
        }
        return observedValue;
    };

    // list of all callbacks to trigger on observedValue change
    observableFunction.list = [];

    // function used to execute all callbacks
    observableFunction.notify = function(){

        // execute all callbacks
        observableFunction.list.forEach(
            function( func, key ){
                if ( typeof func === 'function' ){
                    func( observedValue );
                    if ( func.once ){
                        observableFunction.list.splice(key,1);
                    }
                } else {
                    observableFunction.list.splice(key,1);
                }
            }
        );

    };

    // function used to add a callbacks
    observableFunction.observe = function( pFunction, pOnce ){
        pFunction.once = pOnce || false;
        observableFunction.list.push( pFunction );
    };

    return observableFunction;
};


/**
 @method  tb.namespace

 @param {string} pNamespace
 @param {boolean} [pForceCreation] - true => force creation of namespace object if it didnt exist before
 @param {object} [pObject] - object to scan

 @return {Object}        namespaceObject

 tb.namespace() function

 @example

     // lookup [window] namespace:
     tb.namespace( 'app.Dashboard' ); // gets the constructor for dashboard

     // in a constructor force namespace creation:
     tb.namespace( 'app', true )     // force creation of 'app' if it is not there yet
     .Dashboard = function(){ ... }

     // lookup namespace in any object and return value:
     tb.namespace( 'x.y', null, { x: { y: 42 } } );     // 42
 
 */
tb.namespace = function( pNamespace, pForceCreation, pObject ){

    if ( typeof pNamespace !== 'string' ){
        return false;
    }

    var namespaceArray = pNamespace.split('.');

    var walk = function( o, namespaceArray ) {

        if ( !o[ namespaceArray[0] ] && !!pForceCreation ) {
            o[ namespaceArray[0] ] = {};
        }

        if ( namespaceArray.length < 2 ){

            return o.hasOwnProperty( namespaceArray[0] ) ? o[ namespaceArray[0] ] : false;

        } else {

            if ( o.hasOwnProperty( namespaceArray[0] ) ) {
                o = o[ namespaceArray[0] ];
                namespaceArray.shift();
                return walk( o, namespaceArray );
            } else {
                return false;
            }

        }
    };

    return walk( !pObject ? window : pObject, namespaceArray );

};


/**
 @method tb.bind

 @param   {object} pSelector - DOM node to start binding in

 @return {void}

 tb.bind() function

 @example

     tb.bind( document.body );
     // scans the given element and all of its descendants
     // in the DOM and looks for attributes "data-tb" in the nodes.
     // resulting list will be scanned for those nodes that do not already
     // have an tb object inside.
     // creates a new tb object based on the class namespace given
     // in the "data-tb" attribute
     // stores it in the DOM element
    
     tb.bind( document.body, 'n1.n2.<className>' [ , <config data> ] )
     //creates a new tb object based on the 2nd parameter, giving 3rd as constructor parameter
     //stores it in the DOM element
     //THIS VARIANT WILL overwrite ANY MATCHING INSTANCE THAT ALREADY RESIDES IN THE DOM NODE(S)!

 */
tb.bind = function( pSelector, pTarget ){

    var rootNode,
        selected = [],
        foundElements;

    // get root node
    if ( !!pTarget && !!pTarget['nodeName'] ) {
        rootNode = pTarget;
    } else if ( !pTarget && !!pSelector['nodeName'] ){
        rootNode = pSelector;
    } else {
        rootNode = document.body;
    }

    foundElements = rootNode.querySelectorAll( '[data-tb]' );

    // add self if data-tb attribute present
    if ( rootNode && rootNode.getAttribute('data-tb') ){
        selected.push( rootNode );
    }

    // add other elements
    if ( !!foundElements['length'] ){
        [].map.call(
            foundElements,
            function( element ){
                selected.push( element );
            }
        );
    }

    // instanciate tb instances for given elements
    selected.forEach(
        function( selectedElement ){
            var namespaces = selectedElement.getAttribute('data-tb').split(' ');

            namespaces.forEach(
                function( namespace ){
                    if ( !selectedElement[namespace] ){
                        selectedElement[namespace] = new tb(
                            namespace,
                            null,
                            selectedElement
                        );        // create tb object
                    }
                }
            );
        }
    );

};



// twoBirds system status
tb.status = {
    loadCount: tb.observable(0)
};

/*
 // debugging...
 tb.status.loadCount.observe(function(){
 console.log( 'loadCount:', tb.status.loadCount() );
 });
 */

tb.idle = function( pCallback ){

    var f = function(){
        if ( tb.status.loadCount() === 0 ){
            pCallback();
        } else {
            // if idle not yet reached, re-atttach function for ONE execution
            tb.status.loadCount.observe( f, true );
        }
    };

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
 @param {object} pSrc - other object

 @return {object} - other object

 tb.extend() function
 extend an object by another objects properties, always a deep copy

 */
tb.extend = function( pObj ){ // any number of arguments may be given
    var cp;

    while ( arguments[1] ){
        cp = arguments[1];
        Object
            .keys(cp)
            .forEach(
                function(key) {
                    if ( cp[key] !== null
                        && !!cp[key][constructor]
                        && (cp[key]).constructor === Object
                    ){
                        pObj[key] = tb.extend( pObj[key] || {}, cp[key] );
                    } else {
                        pObj[key] = cp[key];
                    }
                }
            );
        [].splice.call( arguments, 1, 1 ); // remove object that is done
    }

    return pObj;
};



/**
 @method tb.parse
  
 @param {string} pText - the text to parse
 @param {object} pParse - hash object containing replacement key/<value>
  //@todo: missing parm description
 @return {string} - result string

 tb.parse() function
 for each key/value in pObject, check string for {key}
 replace occurence with <value>
 */
tb.parse = function( pWhat, pParse ){

    if ( typeof pWhat === 'string' ){
        var vars = pWhat.match( /\{[^\{\}]*\}/g );

        if ( !!vars ) {
            vars
                .forEach(
                    function (pPropname) {
                        var propname = pPropname.substr(1, pPropname.length - 2),
                            propValue = tb.namespace(propname, false, pParse) || propname + ' not found!';

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
 @param {number} [pOptions.timeout] - structure sample: { cb: myFunction, ms:10000 }<br>
 cb: callback to run when timeout occurs
 ms: number of milliseconds the request will run before being terminated
 @param {boolean} [pOptions.cachable] - defaults to true, indicates whether or not to include a unique id in URL
 @param {boolean} [pOptions.async] - whether or not to make an asynchronous request

 @returns a twoBirds request object

 */
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
        var obj = {},
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

                    getConnection = (function (pType) {
                        return function (pId) {
                            var http = new ActiveXObject(pType);
                            obj = {
                                connection: xhr,
                                identifier: pId
                            };
                            return obj;
                        };
                    })(msoft[i]);
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

        try {
            var httpStatus = pReq.connection.status;
        }
        catch (e) {
            var httpStatus = 13030;
        }
        if (httpStatus >= 200 && httpStatus < 300) {
            var responseObject = createResponseObject(pReq, pOptions);
            try {
                pCallback.call(pCallback, responseObject);
            }
            catch (e) {
                if (tb.debug) debugger;
            }
        }
        else {
            var responseObject = createResponseObject(pReq, tb.extend( {}, pOptions ) );
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
        return obj;
    }

    /** @private */
    function release(pReq) {
        dec( pReq );
        if (pReq.connection){
            pReq.connection = null;
        }
        delete pReq.connection;
        pReq = null;
        delete pReq;
    }

    function inc( pReq ) {
        loadlist.push( pReq );
        count++;
        readyState = 'loading';
    }

    function dec( pReq ) {
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
            xmlreq = false,
            method = (pOptions.method ? pOptions.method.toUpperCase() : false) || 'GET',
            url = pOptions.url,
            params = '',
            successHandler = pOptions.success || tb.nop,
            errorHandler = pOptions.error || tb.nop,
            stateHandler = pOptions.statechange || tb.nop,
            isCachable = pOptions.cachable || false,
            timeout = pOptions.timeout || false,
            isAsync = (typeof pOptions.async !== 'undefined' && pOptions.async === false) ? false : true;

        if (typeof pOptions.params != 'undefined') {
            var ct = ( pOptions.headers && pOptions.headers['Content-Type']
                ? pOptions.headers['Content-Type']
                : 'application/x-www-form-urlencoded' );

            switch ( ct ){
                case 'application/json':
                    params = JSON.stringify( pOptions.params );
                    break;
                default:
                    for (var i in pOptions.params) { // concat parameter string
                        params += ((params.length > 0 ? '&' : '') + i + '=' + pOptions.params[i]);
                    }
                    break;
            }
        }

        inc();

        /*
         if (isCachable === false) { // proxy disable - cache busting
         url += (url.indexOf('?') < 0 ? '?' : '&') + 'tbUid=' + uid;
         }
         */

        xmlreq = getConnection(uid);
        if (xmlreq) {
            if ( ( method === 'GET' || method === 'DELETE' ) && params !== '') {
                url = url + (url.indexOf('?') < 0 ? '?' : '&') + params;
            }
            xmlreq.src=url;

            xmlreq.connection.open(method, url, isAsync);

            if (isAsync === true) {
                xmlreq.poll = handleReadyState(xmlreq, successHandler, stateHandler, errorHandler, pOptions);
            }

            // set request headers
            if (pOptions.headers) {
                for (var i in pOptions.headers) {
                    if (i !== 'Content-Type') {
                        xmlreq.connection.setRequestHeader(i, pOptions.headers[i]);
                    }
                }
            }

            // abort functionality
            if (timeout) {
                xmlreq.timeoutTimer = window.setTimeout(

                    function (pT, pR) {
                        var f = typeof pT.cb === 'function' ? pT.cb : false;
                        return function () {
                            //if ( !myR && myR.connection.status == 4 ) return;
                            if (typeof f == 'function') {
                                f( /*createResponseObject(myR)*/ );
                            }
                            pR.connection.abort();
                            window.clearInterval(pR.poll);
                        };
                    }(timeout, xmlreq), timeout.ms);
            }

            xmlreq.abort = ( function(xmlreq) {
                return function () {
                    window.clearInterval(xmlreq.poll);
                    if (xmlreq.connection) xmlreq.connection.abort();
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



;
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

;
/**
 @class tb.Require
 @constructor

 @param   {array} pRequiredFiles - array containing required files

 @return {void}

 tb.require class

 - add into prototype of your constructor
 - instance will get an 'init' event when all files have loaded.

 @example

     tb.namespace( 'app', true ).GrandParent = (function(){

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

    })();
 
 */
tb.Require = function( pConfig ){

    var that = this;

    if ( !pConfig ) return;

    that.requirements = pConfig;

    // add requirement loading
    tb.loader.load(
        that.requirements,
        function(){
            that.target.trigger('init');
        }
    );

};

tb.Require.prototype = {
    ready: function(){
        // do we need this???
    }
};

/**
 * requirement handling
 */
(function(){
    // private

    function getTypeFromSrc( pSrc ){
        return pSrc.split('?')[0].split('.').pop();
    }

    // requirement constructor
    function _Requirement( pConfig ){

        var that = this,
            type = getTypeFromSrc( pConfig.src ), // filename extension
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
            isTyped = !!typeConfigs[type];

        if ( !!tb.loader.requirementGroups[type][pConfig.src.split('?')[0]]
            &&  !!tb.loader.requirementGroups[type][pConfig.src.split('?')[0]].done ){ // already loaded

            that.trigger( 'requirementLoaded', src.split('?')[0], 'u' );

            return;
        }

        pConfig.type = type; // add type

        that.config = pConfig;

        // cache busting
        if ( !!that.config.src ){
            that.config.src = that.config.src + ( that.config.src.indexOf( '?' ) > -1 ? '&' : '?' ) + tb.getId();
        }

        //that.target = pConfig.target;
        that.src = pConfig.src;
        that.type = that.config.type = type;
        that.done = false;
        that.cb = that.config.cb || function(){};
        that.data = tb.observable( {} );

        // element 'load' callback
        function onLoad( e ){

            if ( !!e && e.data ){
                that.data( e.data );
            }

            that.done = true;

            if ( that.type === 'js' ) {
                setTimeout(
                    function(){
                        // that.element.parent.removeChild( that.element );     // remove js script tag from head
                    }
                    ,200
                );
            }

            that.trigger( 'requirementLoaded', that.src, 'u' );

        }

        // execute onLoad only once
        onLoad.once = true;

        // handlers
        that.handlers = {
            'onLoad': onLoad
        };


        if ( isTyped ) { // either *.css or *.js file

            // get default config for type
            typeConfig = typeConfigs[type];

            // create DOM element
            element = document.createElement( typeConfig.tag );
            element.async = true;
            element.onreadystatechange = element.onload = function() {
                var state = element.readyState;
                if (!that.done && (!state || /loaded|complete/.test(state))) {
                    tb.status.loadCount( tb.status.loadCount() - 1 ); // decrease loadCount
                    that.trigger( 'onLoad', element );
                }
            };

            // add attributes to DOM element
            for ( var i in typeConfig.attributes ) if ( typeConfig.attributes.hasOwnProperty(i) ){
                element.setAttribute( i, tb.parse( typeConfig.attributes[i], that.config ) );
            }

            tb.status.loadCount( tb.status.loadCount() + 1 ); // increase loadCount

            // append node to head
            document.getElementsByTagName('head')[0].appendChild( element );

            that.element = element;

        } else { // load via request if unknown type, trigger callback with text or JSON

            var f = function( data ){

                if ( that.type === 'json' && !!data['text'] ){
                    try {
                        data = JSON.parse( data.text );
                    } catch( e ){
                        console.log( 'error parsing, JSON expected in:', data );
                    }
                } else {
                    data = data.text;
                }

                that.trigger( 'onLoad', data );
            };

            var options = {
                url: that.src,
                success: f,
                error: f
            };

            tb.request( options );

        }

    }

    _Requirement.prototype = {
        namespace: '_Requirement'
    };




    // requirement group constructor
    function _RequirementGroup( pConfig ){

        var that = this;

        that.type = pConfig.type;
        that.target = pConfig.target;

        that.requirements = {};

    };

    _RequirementGroup.prototype = {

        namespace: '_RequirementGroup',

        load: function( pSrc ){

            var that = this,
                rq = !!that.requirements[ pSrc ];

            if ( !rq ){ // not loading or loaded: add a new requirement

                rq = that.requirements[ pSrc ] = new tb(
                    _Requirement,
                    {
                        src: pSrc,
                        target: that.target
                    },
                    that.requirements
                );

                that.requirements[ pSrc ].target = tb.loader; // needed for event bubbling

            } else { // already loading or loaded

                rq = that.requirements[ pSrc ];

            }

            if ( !!rq.done ){ // already loaded
                rq.trigger( 'onLoad' );

            }

        }

    };




    function Loader( pConfig ){
        var that = this;

        that.config = pConfig;
        that.requirementGroups = {}; // will later contain requirement groups ( grouped by file extension )
        that.rqSets = []; // requirement sets, may contain various file types

        that.handlers = {
            requirementLoaded: requirementLoaded
        }
    };

    Loader.prototype = {

        namespace: '_Head',

        load: function( pSrc, pCallback ){

            var that = this,
                pCallback = pCallback || function( e ){ console.log( 'onLoad dummy handler on', e ); },
                type,
                rg,
                groupCallback,
                pSrc = typeof pSrc === 'string' ? [ pSrc ] : pSrc, // convert to array if string
                pSrc = ([]).concat( pSrc ); // make an array copy


            // will trigger loading if necessary ( async callback even if already loaded )
            pSrc
                .forEach(
                    function( filename ){
                        type = getTypeFromSrc( filename );
                        rg = !!that.requirementGroups[type];

                        if ( !rg ){ // add a new requirement group

                            that.requirementGroups[ type ] = new tb(
                                _RequirementGroup,
                                {
                                    type: type
                                },
                                that.requirementGroups
                            );

                            that.requirementGroups[ type ].target = tb.loader; // needed for event bubbling
                        }

                        rg = that.requirementGroups[ type ];

                        rg.load( filename );
                    }

                );

            pSrc.callback = pCallback;

            pSrc.done = function( pFilename ){ // will be called when each file 'requirementLoaded' was triggered
                if ( pSrc.indexOf( pFilename ) > -1 ){
                    pSrc.splice( pSrc.indexOf( pFilename ), 1 );
                }
            };

            that.rqSets.push( pSrc );

        },

        get: function( pFileName ){

            var that = this,
                type = getTypeFromSrc( pFileName),
                rg = that.requirementGroups[type] ? that.requirementGroups[type] : false,
                rq = rg ? ( rg.requirements[pFileName] ? rg.requirements[pFileName] : false ) : false;

            return rq ? rq.data() : 'data missing for: ' + pFileName;
        }

    };

    // bind _Head instance
    tb.loader = new tb( Loader );

    function requirementLoaded( e ){

        var that = this,
            filename  = e.data.split('?')[0];

        that
            .rqSets
            .forEach(
                function( pRqSet ){
                    pRqSet.done( filename );
                    if ( pRqSet.length === 0 ){ // every file loaded
                        pRqSet.callback();
                    }
                }
            );

        that.rqSets = that
            .rqSets
            .filter(
                function( pElement ){
                    return pElement.length > 0;
                }
            );

        e.stopPropagation();
    }

})();
