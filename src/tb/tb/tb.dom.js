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
                check = !!pSelector ? document.querySelectorAll( pSelector ) : false;

            if ( !check ){
                return that;
            }

            that.forEach(function (pElement) {
                if ( check && -1 === check.indexOf(pElement) ) {
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
                check = !!pSelector ? document.querySelectorAll( pSelector ) : false,
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
                            && ( !!check && -1 < [].indexOf.call( check, domNode ) )
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
                check = !!pSelector ? document.querySelectorAll( pSelector ) : false;

            that.forEach(
                function (pDomNode) {
                    var domNode = pDomNode.parentNode;

                    if ( -1 === [].indexOf.call( result, domNode )
                        && ( !!check && -1 < [].indexOf.call( check, domNode ) )
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
                    var check = !!pSelector ? pDomNode.querySelectorAll( pSelector ) : false;

                    [].forEach.call(
                        pDomNode.children,
                        function( pChildNode ){
                            if ( -1 === [].indexOf.call( result, pChildNode )
                                && ( !!check && -1 < [].indexOf.call( check, pChildNode ) )
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
                result = new tb.dom(),
                check = !!pSelector ? pDomNode.querySelectorAll( pSelector ) : false;

            that.forEach(
                function (pDomNode) {
                    var check = !!pSelector ? pDomNode.querySelectorAll( pSelector ) : false;

                    [].forEach.call(
                        pDomNode.querySelectorAll( pSelector || '*' ),
                        function( pDescendantNode ){
                            if ( -1 === [].indexOf.call( result, pDescendantNode )
                                && ( !!check && -1 < [].indexOf.call( check, pDescendantNode ) )
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
