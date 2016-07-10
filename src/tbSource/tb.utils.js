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
        foundElements = rootNode.querySelectorAll( '[data-tb]' );

    // add self if data-tb attribute present
    if ( rootNode.getAttribute('data-tb') ){
        foundElements = [].concat.call( [ rootNode ], tb.dom().toArray.call( foundElements ) );
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
 @param {object} [pObj] - other object

 @return {object} - other object

 tb.extend() function

 takes any number of objects as parameters
 merges content into the first parameter object
 always a deep copy
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
  
 @param pWhat - text, object or array to parse
 @param {object} pParse - hash object containing replacement key/value pairs

 @return result, = pWhat parsed

 tb.parse() function

 will replace all matching {namespace1.namespace2.etc} occurrences with values from pParse object
 if typeof pWhat is object or array, it will be done with all strings contained therein and the original pWhat returned
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


