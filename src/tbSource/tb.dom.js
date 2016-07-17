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
                return !template['content']['childNodes'] ? template.childNodes : template.content.childNodes;
            }

            function _mapArrayMethod( pMethodName ){
                var method = [][pMethodName];

                return function(){
                    var arr = this.toArray(),
                        ret = method.apply( arr, arguments );

                    return tb.dom( ret ).unique();
                };
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
                                function forEachTbDomSelector( pSelector ){
                                    nodeList = domNode.querySelectorAll(pSelector);
                                    if (!!nodeList.length) {
                                        [].forEach.call(
                                            nodeList,
                                            function (domElement) {
                                                if ( [].indexOf.call( that, domElement ) === -1 ){
                                                    [].push.call( that, domElement );
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
                 @method lastIndexOf

                 @return {object} - tb.dom() result set, may be empty

                 inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf">lastIndexOf</a>
                 */
                lastIndexOf: _mapArrayMethod( 'lastIndexOf' ),

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
                 @method reduce

                 @return {object} - tb.dom() result set, may be empty

                 inherited from Array, see <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce">reduce</a>
                 */
                reduce: _mapArrayMethod( 'reduce' ),

                /**
                 @method reduce

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
                 @method some

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
                removeClass: removeClass,
                filter: filter,
                not: not,
                off: off,
                on: on,
                one: one,
                parent: parent,
                parents: parents,
                push: push,
                remove: remove,
                removeAttr: removeAttr,
                show: show,
                toArray: toArray,
                trigger: trigger,
                unique: unique,
                val: val
            };

            return new dom( pSelector, pDomNode );

            // Private Functions, exposed

            /**
             @method appendTo

             @param [pElement] a .querySelectorAll() selector string, a dom node or an array of dom nodes

             appends all elements in tb.dom() result set to given DOM nodes
             */
            function appendTo( pElement ){
                var that = this;

                that.forEach(
                    function( pDomNode ){
                        if ( !!pDomNode['nodeType'] ){
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

            /**
             @method append
             @chainable

             @param [pElement] an array like set of DOM nodes, or a single DOM node

             @return {object} - tb.dom() result set, may be empty

             appends given DOM nodes to every node in tb.dom() result set
             */
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

            /**
             @method insertBefore

             @param [pElement] - a single DOM node

             prepends all elements in tb.dom() result set to given DOM node
             */
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

            /**
             @method insertAfter

             @param [pElement] - a single DOM node

             inserts all elements in tb.dom() result set after given DOM node
             */
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
             @method trigger
             @chainable

             @param {string} pEventName - name of the event
             @param [pData] - optional data

             @return {object} - tb.dom() result set, may be empty

             creates a DOM event for each element in tb.dom() result set
             */
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

            /**
             @method on
             @chainable

             @param {string} pEventName(s) - name(s) of the event separated by ' '
             @param {function} pHandler - callback far event

             @return {object} - tb.dom() result set, may be empty

             creates a DOM event handler for each element in tb.dom() result set
             */
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

            /**
             @method one
             @chainable

             @param {string} pEventName(s) - name(s) of the event separated by ' '
             @param {function} pHandler - callback far event

             @return {object} - tb.dom() result set, may be empty

             creates a DOM event handler for each element in tb.dom() result set (to be called only once)
             */
            function one( pEventName, pHandler ){
                var that = this;

                pHandler.once = true;

                that.on( pEventName, pHandler );

                return that;
            }

            /**
             @method off
             @chainable

             @param {string} pEventName(s) - name(s) of the event separated by ' '
             @param {function} pHandler - callback far event

             @return {object} - tb.dom() result set, may be empty

             removes one or all DOM event handlers from each element in tb.dom() result set
             */
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
                                // todo: remove all event handlers
                            }
                        }
                    }
                );

                return that;
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
             @method html
             @chainable

             @param {string} pHtml - html string or empty string

             @return {object} - tb.dom() result set, may be empty

             replace all nodes .innerHTML with pHtml
             */
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
             @method add
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             add all nodes in tb.dom( pSelector ) result set to tb.dom() result set
             */
            function add(pElements) {
                var that = this;

                if ( !!pElements.length ) { // if array given add each of its elements
                    [].forEach.call(
                        pElements,
                        function (pElement) {
                            if ( !!pElement.nodeType ){
                                [].push.call(
                                    that,
                                    pElement
                                );
                            }
                        }
                    );
                } else if (!!pElements['nodeType']) { // if DOM node given add it
                    [].push.call(
                        that,
                        pElements
                    );
                } else if (typeof pElements === 'string') { // DOM selector given add its results
                    tb.dom(pElements)
                        .forEach(
                            function( pElement ){
                                [].push.call(
                                    that,
                                    pElement
                                );
                            }
                        );
                }

                return that.unique();
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

            /**
             @method descendants
             @chainable

             @param  pSelector - any valid tb.dom() constructor parameter

             @return {object} - tb.dom() result set, may be empty

             return all descendant nodes of tb.dom() result set, that match nodes in tb.dom( pSelector ) result set
             */
            function descendants(pSelector) {

                var that = this,
                    result = tb.dom();

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
             @method removeClass
             @chainable

             @param  {string} pClassName - class name(s) to remove, separated by ' '

             @return {object} - tb.dom() result set, may be empty

             remove class name from each of tb.dom() result set
             */
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
             @method toArray
             @chainable

             @return {array} - tb.dom() result set converted to a plain array of DOM nodes

             convert tb.dom() result set converted to a plain array of DOM nodes
             */
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
                } else if ( typeof pSelector === 'function' ) { // function given
                    result = [].filter.call(
                        that,
                        pSelector
                    );
                    return result;
                }

                return tb.dom(result);

            }

            /**
             @method push
             @chainable

             @param pSelector - tb.dom() selector or DOM node

             @return {object} - tb.dom() result set

             add given pSelector result set to tb.dom() result set
             */
            function push(pSelector) {

                var that = this;

                if (typeof pSelector === 'undefined') return that;    // unchanged

                if ( !!pSelector.length ) { // if array or like given add each of its elements
                    [].forEach.call(
                        pSelector,
                        function (pElement) {
                            if ( !!pElement['nodeType'] ){
                                that.push(pElement);
                            }
                        }
                    );
                } else if (!!pSelector['nodeType']) { // if DOM node given add it
                    [].push.call(that, pSelector);
                } else if (typeof pSelector === 'string') { // DOM selector given add its results
                    that.push( tb.dom(pSelector).toArray() );
                }

                return that.unique();
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
}
