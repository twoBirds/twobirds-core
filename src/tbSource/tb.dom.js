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
                                    nodeList = domNode.querySelectorAll(pThisSelector);
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

                if ( pSelector === 'undefined' ) return that;    // unchanged

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
                        )
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

                if ( !target ) return;

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

                if ( !target ) return;

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
                                            }
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

                        pClasses.forEach(
                            function( pClass ){
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

            }

            /**
             @method values

             @param {object} [pValues] - field values

             @return {object} - an object containing all values of a forms input fields

             get or set all form input values
             */
            function values( pValues ) {
                var that = this,
                    node,
                    values = pValues || {},
                    ret = {};

                if ( !that['0'] ) return that;

                node = that['0'];

                tb.dom( 'input, select, textarea', node )
                    .forEach(
                        function( pInput ){
                            var name = tb.dom( pInput ).attr( 'name' ),
                                value;

                            if ( !!values && !!values[name] ){
                                value = values[name];
                                tb.dom( pInput ).val( value );
                            }
                            ret[name] = tb.dom( pInput ).val();
                        }
                    );

                return ret;
            }

        };
    })();
}
