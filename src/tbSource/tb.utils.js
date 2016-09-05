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


