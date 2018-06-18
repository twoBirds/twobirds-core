if (typeof module === 'undefined' ){
    tb.dom = (function () {

        // Variables
        var regExReturn = /\r/g,
            regExSpaces = /[\x20\t\r\n\f]+/g,
            regExWord = /\S+/g,
            regExHtml = /^<>$/g,
            TbSelector = tb.Selector,
            dom,
            f;

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

            if (!pSelector) { // no selector given, or a falsy value
                return that;
            } 

            // ... implicit else do:
            if (!!pSelector['nodeType'] ) { // selector is a dom node
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

                var DOM = _htmlToElements( pSelector.trim() ); // uses 'template' element to retrieve DOM nodes

                if ( DOM.length === 1 
                    && !!DOM[0].nodeType
                    && DOM[0].nodeType === 3 // nodeType 3 indicates text node
                ){ // it is not a HTML string, but a simple string --> it is regarded a CSS selector
                    domNode = !!pDomNode && !!pDomNode['nodeType'] ? pDomNode : document;
                    pSelector
                        .split( ',' )
                        .forEach(
                            function forEachTbDomSelector( pThisSelector ){
                                nodeList = domNode.querySelectorAll(pThisSelector.trim());
                                if (!!nodeList[0]) {
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
                    return tb.dom( DOM ).clean();
                }
            }

        };

        // dom prototype, public functions
        dom.arrayMethods = {

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
        };

        // functions
        dom.methods = (function(){

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
            function addClass(pClassNames) {

                var that = this;

                if ( !pClassNames || typeof pClassNames !== 'string' ){
                    console.warn( 'method addClass: missing or wrong pClassNames' );
                    return that;
                }

                var givenClassNames = pClassNames
                    .split(' ')
                    .filter(function(pElement){ 
                        return !!pElement; 
                    });

                that.forEach(
                    function( pDomNode ){
                        var existingClasses = ( pDomNode.getAttribute('class') || '' )
                                .split(' ')
                                .filter(function(pElement){ 
                                    return !!pElement; 
                                });

                        givenClassNames.forEach(function(pGivenClassName){

                            if ( existingClasses.indexOf( pGivenClassName ) === -1) {
                                existingClasses.push( pGivenClassName );
                            }

                        });

                        pDomNode.setAttribute('class', existingClasses.join(' ') );

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
                                    tb.assumeTb( pDomNode );
                                    tb.dom(pDomNode).clean();
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

                tb.assumeTb( pElement );
                that.clean();

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
                    rootNodes,
                    attributes = {};

                if ( typeof pKey === 'object' ){ // it is a hash object
                    
                    Object
                        .keys( pKey )
                        .forEach(function( pPropName ){
                            that.forEach( function( pDomNode ){
                                tb.dom( pDomNode ).attr( pPropName, pKey[pPropName] );
                            });
                        });

                    return that;
                }

                // if no arguments, return attribute object of first in list
                if (!arguments.length) {
                    [].forEach.call(
                        that[0].attributes,
                        function( pAttribute ){
                            attributes[ pAttribute.name ] = pAttribute.value;
                        }
                    );
                    return attributes;
                }

                // if no value is given and there are elements, return attribute value of first in list
                if ( pValue === undefined && that.length > 0 ) {
                    return that[0].getAttribute(pKey);
                }

                // if a value to set is given, apply to all nodes in list
                rootNodes = that.toArray();
                rootNodes.forEach(
                    function (pNode) {
                        pNode.setAttribute(pKey, pValue);
                    }
                );

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
             @method clean
             @chainable

             @return {object} - tb.dom() result set, may be empty

             - normalizes text nodes
             - removes comment nodes
             */
            var clean = (function(doClean){ return function clean(pParam){

                var that = this;

                if (pParam !== undefined){
                    doClean = !pParam ? false : true;
                } else if (doClean){
                    that.forEach(
                        function( pElement ){
                            var treeWalker = document.createTreeWalker(
                                    pElement,
                                    128     // comment nodes
                                );

                            pElement.normalize(); // no empty text nodes recursively

                            while(treeWalker.nextNode()){
                                // we need to IIFE so the node pointer is copied, 
                                // otherwise it will only remove the last comment node of that while loop
                                setTimeout((function(pNode){ return function(){
                                    pNode.remove();
                                }; })( treeWalker.currentNode ), 0);
                            }
                        }
                    );
                }
                return that;
            };})(true);

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
             @method first
             @chainable

             @return {object} - tb.dom() result set, may be empty

             return tb.dom() result set, that contains only the first element in tb.dom( pSelector ) result set
             */
            function first() {

                var that = this,
                    result = tb.dom();

                if ( !!tb.dom.length ){
                    result.push( that[0] );
                }

                return result;
            }

            /**
             @method hasClass
             @param pClass {string} - class name

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
                        var prev = window.getComputedStyle(pNode).getPropertyValue('display');
                        pNode.style.prevDisplay = !! prev && prev !== 'none'
                            ? prev
                            : 'inline';
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

                tb.dom( pTarget ).clean();
                tb.assumeTb( pTarget );

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

                tb.dom( pTarget ).clean();
                tb.assumeTb( pTarget );

                return that;
            }

            /**
             @method last
             @chainable

             @return {object} - tb.dom() result set, may be empty

             return tb.dom() result set, that contains only the last element in tb.dom( pSelector ) result set
             */
            function last() {

                var that = this,
                    result = tb.dom();

                if ( !!tb.dom.length ){
                    result.push( that.pop() );
                }

                return result;
            }

            /**
             @method next
             @chainable

             @return {object} - tb.dom() result set, may be empty

             return tb.dom() result set, that contains only the next element 
             of the first element in tb.dom( pSelector ) result set
             */
            function next() {

                var that = this,
                    result = tb.dom();

                if ( !!tb.dom.length ){
                    if ( !!that[0].nextSibling ){
                        result.push( that[0].nextSibling );
                    }
                }

                return result;
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
                    check = pSelector !== undefined ? document.querySelectorAll( pSelector ) : false;

                if ( !check ){
                    return that;
                }

                check.forEach(function (pElement) {
                    var i = [].indexOf.call( that, pElement);
                    if (  i > -1 ) {
                        [].splice.apply( that, [ i, 1 ] );
                    }
                });

                return that;
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

                // if to be called only once
                if ( !!pHandler.once ){

                    onceHandler = (function(pHandler, pCapture) {
                        return function myOnceHandler(ev){
                            
                            // remove handlers
                            that.forEach(
                                function( pDomNode ){
                                    if ( !!pDomNode.nodeType ){
                                        eventNames.forEach(
                                            function( pThisEventName ){
                                                _removeEvent( pDomNode, pThisEventName, onceHandler, capture );
                                            }
                                        );
                                    }
                                }
                            );

                            pHandler.apply( ev, arguments );
                        };
                    })(pHandler, pCapture);

                    // needed to remove handlers from ALL dom elements
                    onceHandler.that = that;

                    // needed for .off()
                    onceHandler.remove = function removeOnceHandlers(){

                        // remove handlers
                        that.forEach(
                            function( pDomNode ){
                                if ( !!pDomNode.nodeType ){
                                    eventNames.forEach(
                                        function( pThisEventName ){
                                            _removeEvent( pDomNode, pThisEventName, onceHandler, capture );
                                        }
                                    );
                                }
                            }
                        );

                    };

                }

                // attach handler
                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode.nodeType ){
                            eventNames.forEach(
                                function( pThisEventName ){
                                    _addEvent( pDomNode, pThisEventName, onceHandler || pHandler, capture );
                                }
                            );
                        }
                    }
                );

                return !!onceHandler ? onceHandler : that;
            }

            /**
            @method one
            
            @param {string} pEventName(s) - name(s) of the event separated by ' '
            @param {function} pHandler - callback far event
            @param {boolean} pCapture - indicates running in capture phase, that is top down

            @return {function} - the onceHandler function

            creates a DOM event handler for each element in tb.dom() result set (to be called only once)

            - after the first call ALL event handlers that were attached to the dom elements are deleted automatically.
            - to remove all these onceHandlers manually, use the returned onceHandler and its .that property.
            - use 

            @example

                // create a handler
                var f=function(){ 
                    console.log('a'); 
                }

                // attach handler to multiple divs
                var oh = tb.dom( 'div' ) // each of the divs will respond with handlers, but afterwards all attached handlers are deleted
                    .one(
                        'click',
                        f
                    );

                // use this if you want to remove certain onceHandlers manually ( not ALL of them which is next )
                console.log( oh );   // the onceHandler function created
                console.log( oh.that );   // the original tb.dom selection, used to delete some oh handlers manually if needed
                console.log( oh.remove );  // the function that deletes ALL once handlers

                // remove all handlers created by .one()
                tb.dom( '.myBotton' )   // a click on a certain button will remove ALL onceHandlers
                    .one(
                        'click',
                        f.remove
                    );

            */
            function one( pEventName, pHandler, pCapture ){
                var that = this;

                pHandler.once = true;

                return that.on( pEventName, pHandler, pCapture );
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
             @method previous
             @chainable

             @return {object} - tb.dom() result set, may be empty

             return tb.dom() result set, that contains only the previous element 
             of the first element in tb.dom( pSelector ) result set
             */
            function previous() {

                var that = this,
                    result = tb.dom();

                if ( !!tb.dom.length ){
                    if ( !!that[0].previousSibling ){
                        result.push( that[0].previousSibling );
                    }
                }

                return result;
            }

            /**
             @method remove
             @chainable

             @param [pDomElements] - a tb.dom() selector result set
             @return {object} - tb.dom() result set containing removed DOM nodes

             removes all elements in tb.dom() result set from DOM
             */
            function remove( pDomNodes ){
                var that = this;

                that.forEach(
                    function( pDomNode, pIndex ){
                        that[ pIndex ] = pDomNode.parentNode.removeChild( pDomNode );
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
            function removeClass(pRemoveClasses) {

                var that = this,
                    removeClasses = pRemoveClasses
                        .split(' ')
                        .filter(function(pElement){ 
                            return !!pElement; 
                        });

                that.forEach(
                    function ( pDomNode ) {

                        var existingClasses = ( pDomNode.getAttribute('class') || '' )
                                .split(' ')
                                .filter(function(pElement){ 
                                    return !!pElement; 
                                });

                        removeClasses.forEach(
                            function( pRemoveClass ){

                                while ( existingClasses.indexOf(pRemoveClass) > -1 ){
                                    existingClasses.splice(existingClasses.indexOf(pRemoveClass), 1);
                                }

                                if ( !!existingClasses.length ){
                                    tb.dom( pDomNode ).attr('class', existingClasses.join(' ') );
                                } else {
                                    tb.dom( pDomNode ).removeAttr('class');
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
                    function( pDomNode ){
                        pDomNode.style.display = !!pDomNode.style.prevDisplay
                            ? pDomNode.style.prevDisplay
                            : 'block';
                    }
                );

                return that;
            }

            /**
             @method toArray
             @chainable

             @return {object} - tb.dom() result set converted to a plain array of DOM nodes

             convert tb.dom() result set converted to a plain array of DOM nodes
             */
            function toArray(){
                var that = this;

                return Array.from(that);
            }

            /**
             @method toggleClass
             @param pClassName {string} - class name
             @chainable

             @return {object} - tb.dom() result set

             if className is set in class attribute, it is deleted, otherwise it is set.
             */
            function toggleClass( pClassName ) {
                var that = this,
                    $pNode;

                that.forEach(
                    function( pNode ){

                        $pNode = tb.dom( pNode );

                        $pNode[ $pNode.hasClass(pClassName) ? 'removeClass' : 'addClass' ]( pClassName );

                    }
                );

                return that;
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
                    inputTags = ('input select textarea').split( ' ' ),
                    excludeTypes = ('button file image reset submit').split( ' ' ),
                    ret;

                function isInput( pElement ){
                    return pElement.nodeType === 1
                        && ( inputTags ).indexOf( pElement.tagName.toLowerCase() ) > -1
                        && ( excludeTypes ).indexOf( pElement.type ) === -1;
                }

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

                            // if multiselect return array if single return value or empty string for not selected
                            return multiSelect ? ret : !!ret[0] ? ret[0] : '';

                        } else { // setter

                            // if single value given convert to array
                            pValue = pValue.constructor !== Array ? [ pValue ] : pValue;

                            // if not multiSelect but array given set array to first value
                            pValue = !multiSelect && pValue.constructor === Array ? [ pValue[0] ] : pValue;

                            // set options
                            [].forEach.call(
                                that.options,
                                function( pOption ){
                                    var valIndex = pValue.indexOf( pOption.value ),
                                        val;

                                    if ( valIndex + 1 ){
                                        val = pValue[ valIndex ];
                                        pOption.selected = !!val;
                                    } else {
                                        pOption.selected = false;
                                    }

                                }
                            );

                            // set given 'selected' attributes
                            pValue
                                .forEach(
                                    function( pOption ){
                                        tb.dom( 'option[value="' + pOption + '"]', that )
                                            .selected = true;
                                    }
                                );

                        }
                        
                        return;
                    },

                    'default': function defaultVal( pValue ){

                        var that = this,
                            ret;

                        if ( that.type === 'radio' ){ // input radio or checkbox
                            var name = that.name,
                                selector = '[type="radio"][name="' + name + '"]',
                                radios = tb.dom( that ).parents( 'form' ).descendants( selector );

                            ret = '';

                            radios
                                .forEach(
                                    function( pRadio ){
                                        var isElement;

                                        if ( typeof pValue !== 'undefined' ){ // setter
                                            isElement = pRadio.value === pValue;

                                            pRadio.checked = isElement ? true : false;

                                            ret = pRadio.checked ? pRadio.value : ret;
                                        } else { // getter
                                            if ( pRadio.checked === true ){
                                                ret = pRadio.value;
                                            }
                                        }

                                    }
                                );

                            return ret;

                        }

                        if ( that.type === 'checkbox' ){ // input radio or checkbox

                            if ( typeof pValue !== 'undefined' ){ // setter
                                that.checked = pValue ? true : false;
                                ret = that.checked;
                            } else { // getter
                                ret = false;
                                if ( that.checked === true ){
                                    ret = true;
                                }
                            }

                            return ret;

                        } else { // not a radio or checkbox

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

                            if ( !isInput( pElement ) ){
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

                            if ( !isInput( pElement ) ){
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
            function values(pData) {

                var that = this,
                    node = that[0] || undefined,
                    values,
                    observable;

                if ( !node ) { // nothing found
                    return that;
                }

                // it is a hash object -> treat as setter
                if ( typeof pData === 'object' && !!node ){ 
                    var v = tb.dom( node ).values();

                    Object
                        .keys( pData )
                        .forEach(function( pKey ){
                            if ( v.hasOwnProperty( pKey ) ){
                                v[pKey] = pData[ pKey ];
                            }
                        });

                    return;
                }

                // not processed yet
                if ( !node['getValues'] ){
                    // form changed observable
                    node['getValues'] = tb.observable({});

                    // create form change binding
                    tb.dom('input,select,textarea', node)
                        .on(
                            'keyup change select',
                            tb.debounce( function onFormChange(){
                                //console.log('keyup change select');
                                node['getValues']( tb.extend( {}, tb.dom(node).values() ) );
                            }, 5 )
                        );
                }

                // form setter observable
                node['values'] = !!node['values'] ? node['values'] : tb.observable({});

                // value hash constructor
                function Values(){
                }

                // value hash prototype
                Values.prototype = {
                    bind: function( pObject, pOnce ){
                        //console.log('bind', pObject, pOnce, node['getValues']() );
                        
                        node['getValues'].observe(function changeTarget(){
                            //console.log('formvalues changed -> set object', pObject, node['getValues']() );
                            tb.extend( pObject, node['getValues']() );
                            setTimeout(function(){
                                if(!!Object.getOwnPropertySymbols(pObject)[1]){
                                    pObject[Object.getOwnPropertySymbols(pObject)[1]](); // onChange debounced function
                                }
                            }, 0);
                        }, pOnce);
                        
                        node['getValues'].notify(); // push initial setting
                    },

                    observe: function( pCallback, pOnce ){
                        node['values'].observe( pCallback, pOnce );
                    }
                };

                // make value hash
                values = new Values();

                Object.defineProperty(
                    that,
                    'values',
                    {
                        enumerable: true,

                        configurable: true,

                        set: function( pObject ){

                            // disable notifications for bulk change
                            node['values']
                                .enableNotify( false );

                            Object
                                .keys( pObject )
                                .forEach(
                                    function( pKey ){
                                        that.values[ pKey ] = pObject[ pKey ];
                                    }
                                );

                            // now notify
                            node['values']
                                .enableNotify()
                                .notify();

                        },

                        get: (function(node, observable){ return function(){
                            var fields = tb.dom('input[name],select[name],textarea[name]', node );

                            fields
                                .forEach(
                                    function( pField ){
                                        var key = tb.dom( pField ).attr('name');

                                        if ( values.hasOwnProperty( key ) ){
                                            return;
                                        }

                                        Object.defineProperty(
                                            values,
                                            key,
                                            {
                                                enumerable: true,

                                                get: function(){
                                                    return tb.dom( pField ).val();
                                                },
                                                set: function( pValue ){
                                                    var ret = tb.dom( pField ).val( pValue );

                                                    observable( values );

                                                    return ret;
                                                }
                                            }
                                        );

                                    }
                                );

                            // set observable w/ values
                            node['values']( values );

                            return values;

                        };})( node, node['values'] )
                    }
                );

                return that.values;
            }


            return {
                add: add,
                addClass: addClass,
                append: append,
                appendTo: appendTo,
                attr: attr,
                children: children,
                clean: clean,
                descendants: descendants,
                empty: empty,
                filter: filter,
                first: first,
                hasClass: hasClass,
                hide: hide,
                html: html,
                insertBefore: insertBefore,
                insertAfter: insertAfter,
                last: last,
                next: next,
                not: not,
                off: off,
                on: on,
                one: one,
                parent: parent,
                parents: parents,
                previous: previous,
                remove: remove,
                removeAttr: removeAttr,
                removeClass: removeClass,
                show: show,
                toArray: toArray,
                toggleClass: toggleClass,
                trigger: trigger,
                unique: unique,
                val: val,
                values: values
            };
        })();

        dom.prototype = tb.extend( dom.methods, dom.arrayMethods );

        f = function (pSelector, pDomNode) {

            return new dom( pSelector, pDomNode );
        };

        f.innerProto = dom.prototype;

        return f;
    })();

    tb.dom.plugin = function( pMethodName, pFunction ){
        var p = tb.dom.innerProto;

        if ( !p[ pMethodName ] ){
            p[ pMethodName ] = pFunction;
        } else {
            console.warn( 'tb.dom.plugin(): Cannot overload existing tb method (', pMethodName, ')' );
        }

    };

}
