/*! twobirds-core - v8.1.72 - 2018-06-25 */

(function(){
'use strict';var h=new function(){};var aa=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function m(b){var a=aa.has(b);b=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);return!a&&b}function n(b){var a=b.isConnected;if(void 0!==a)return a;for(;b&&!(b.__CE_isImportDocument||b instanceof Document);)b=b.parentNode||(window.ShadowRoot&&b instanceof ShadowRoot?b.host:void 0);return!(!b||!(b.__CE_isImportDocument||b instanceof Document))}
function p(b,a){for(;a&&a!==b&&!a.nextSibling;)a=a.parentNode;return a&&a!==b?a.nextSibling:null}
function t(b,a,c){c=c?c:new Set;for(var d=b;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;a(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)t(d,a,c);d=p(b,e);continue}else if("template"===f){d=p(b,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)t(e,a,c)}d=d.firstChild?d.firstChild:p(b,d)}}function u(b,a,c){b[a]=c};function v(){this.a=new Map;this.s=new Map;this.f=[];this.b=!1}function ba(b,a,c){b.a.set(a,c);b.s.set(c.constructor,c)}function w(b,a){b.b=!0;b.f.push(a)}function x(b,a){b.b&&t(a,function(a){return y(b,a)})}function y(b,a){if(b.b&&!a.__CE_patched){a.__CE_patched=!0;for(var c=0;c<b.f.length;c++)b.f[c](a)}}function z(b,a){var c=[];t(a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state?b.connectedCallback(d):A(b,d)}}
function B(b,a){var c=[];t(a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state&&b.disconnectedCallback(d)}}
function C(b,a,c){c=c?c:{};var d=c.w||new Set,e=c.i||function(a){return A(b,a)},f=[];t(a,function(a){if("link"===a.localName&&"import"===a.getAttribute("rel")){var c=a.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:a.addEventListener("load",function(){var c=a.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);C(b,c,{w:f,i:e})}})}else f.push(a)},d);if(b.b)for(a=0;a<
f.length;a++)y(b,f[a]);for(a=0;a<f.length;a++)e(f[a])}
function A(b,a){if(void 0===a.__CE_state){var c=a.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=b.a.get(a.localName)){c.constructionStack.push(a);var d=c.constructor;try{try{if(new d!==a)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop()}}catch(r){throw a.__CE_state=2,r;}a.__CE_state=1;a.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=c[d],
f=a.getAttribute(e);null!==f&&b.attributeChangedCallback(a,e,null,f,null)}n(a)&&b.connectedCallback(a)}}}v.prototype.connectedCallback=function(b){var a=b.__CE_definition;a.connectedCallback&&a.connectedCallback.call(b)};v.prototype.disconnectedCallback=function(b){var a=b.__CE_definition;a.disconnectedCallback&&a.disconnectedCallback.call(b)};
v.prototype.attributeChangedCallback=function(b,a,c,d,e){var f=b.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(a)&&f.attributeChangedCallback.call(b,a,c,d,e)};function D(b,a){this.c=b;this.a=a;this.b=void 0;C(this.c,this.a);"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function E(b){b.b&&b.b.disconnect()}D.prototype.f=function(b){var a=this.a.readyState;"interactive"!==a&&"complete"!==a||E(this);for(a=0;a<b.length;a++)for(var c=b[a].addedNodes,d=0;d<c.length;d++)C(this.c,c[d])};function ca(){var b=this;this.b=this.a=void 0;this.f=new Promise(function(a){b.b=a;b.a&&a(b.a)})}function F(b){if(b.a)throw Error("Already resolved.");b.a=void 0;b.b&&b.b(void 0)};function G(b){this.j=!1;this.c=b;this.o=new Map;this.l=function(b){return b()};this.g=!1;this.m=[];this.u=new D(b,document)}
G.prototype.define=function(b,a){var c=this;if(!(a instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!m(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(this.c.a.get(b))throw Error("A custom element with name '"+b+"' has already been defined.");if(this.j)throw Error("A custom element is already being defined.");this.j=!0;var d,e,f,r,k;try{var g=function(b){var a=l[b];if(void 0!==a&&!(a instanceof Function))throw Error("The '"+b+"' callback must be a function.");
return a},l=a.prototype;if(!(l instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");d=g("connectedCallback");e=g("disconnectedCallback");f=g("adoptedCallback");r=g("attributeChangedCallback");k=a.observedAttributes||[]}catch(q){return}finally{this.j=!1}a={localName:b,constructor:a,connectedCallback:d,disconnectedCallback:e,adoptedCallback:f,attributeChangedCallback:r,observedAttributes:k,constructionStack:[]};ba(this.c,b,a);this.m.push(a);this.g||
(this.g=!0,this.l(function(){return da(c)}))};G.prototype.i=function(b){C(this.c,b)};function da(b){if(!1!==b.g){b.g=!1;for(var a=b.m,c=[],d=new Map,e=0;e<a.length;e++)d.set(a[e].localName,[]);C(b.c,document,{i:function(a){if(void 0===a.__CE_state){var e=a.localName,f=d.get(e);f?f.push(a):b.c.a.get(e)&&c.push(a)}}});for(e=0;e<c.length;e++)A(b.c,c[e]);for(;0<a.length;){for(var f=a.shift(),e=f.localName,f=d.get(f.localName),r=0;r<f.length;r++)A(b.c,f[r]);(e=b.o.get(e))&&F(e)}}}
G.prototype.get=function(b){if(b=this.c.a.get(b))return b.constructor};G.prototype.whenDefined=function(b){if(!m(b))return Promise.reject(new SyntaxError("'"+b+"' is not a valid custom element name."));var a=this.o.get(b);if(a)return a.f;a=new ca;this.o.set(b,a);this.c.a.get(b)&&!this.m.some(function(a){return a.localName===b})&&F(a);return a.f};G.prototype.v=function(b){E(this.u);var a=this.l;this.l=function(c){return b(function(){return a(c)})}};window.CustomElementRegistry=G;
G.prototype.define=G.prototype.define;G.prototype.upgrade=G.prototype.i;G.prototype.get=G.prototype.get;G.prototype.whenDefined=G.prototype.whenDefined;G.prototype.polyfillWrapFlushCallback=G.prototype.v;var H=window.Document.prototype.createElement,I=window.Document.prototype.createElementNS,ea=window.Document.prototype.importNode,fa=window.Document.prototype.prepend,ga=window.Document.prototype.append,ha=window.DocumentFragment.prototype.prepend,ia=window.DocumentFragment.prototype.append,J=window.Node.prototype.cloneNode,K=window.Node.prototype.appendChild,L=window.Node.prototype.insertBefore,M=window.Node.prototype.removeChild,N=window.Node.prototype.replaceChild,O=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),P=window.Element.prototype.attachShadow,Q=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),R=window.Element.prototype.getAttribute,S=window.Element.prototype.setAttribute,T=window.Element.prototype.removeAttribute,U=window.Element.prototype.getAttributeNS,ja=window.Element.prototype.setAttributeNS,ka=window.Element.prototype.removeAttributeNS,la=window.Element.prototype.insertAdjacentElement,ma=window.Element.prototype.insertAdjacentHTML,na=window.Element.prototype.prepend,
oa=window.Element.prototype.append,V=window.Element.prototype.before,pa=window.Element.prototype.after,qa=window.Element.prototype.replaceWith,ra=window.Element.prototype.remove,sa=window.HTMLElement,W=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),ta=window.HTMLElement.prototype.insertAdjacentElement,ua=window.HTMLElement.prototype.insertAdjacentHTML;function va(){var b=X;window.HTMLElement=function(){function a(){var a=this.constructor,d=b.s.get(a);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(!e.length)return e=H.call(document,d.localName),Object.setPrototypeOf(e,a.prototype),e.__CE_state=1,e.__CE_definition=d,y(b,e),e;var d=e.length-1,f=e[d];if(f===h)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[d]=h;Object.setPrototypeOf(f,a.prototype);y(b,f);return f}a.prototype=sa.prototype;Object.defineProperty(a.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:a});return a}()};function Y(b,a,c){function d(a){return function(c){for(var e=[],d=0;d<arguments.length;++d)e[d-0]=arguments[d];for(var d=[],f=[],l=0;l<e.length;l++){var q=e[l];q instanceof Element&&n(q)&&f.push(q);if(q instanceof DocumentFragment)for(q=q.firstChild;q;q=q.nextSibling)d.push(q);else d.push(q)}a.apply(this,e);for(e=0;e<f.length;e++)B(b,f[e]);if(n(this))for(e=0;e<d.length;e++)f=d[e],f instanceof Element&&z(b,f)}}c.h&&(a.prepend=d(c.h));c.append&&(a.append=d(c.append))};function wa(){var b=X;u(Document.prototype,"createElement",function(a){if(this.__CE_hasRegistry){var c=b.a.get(a);if(c)return new c.constructor}a=H.call(this,a);y(b,a);return a});u(Document.prototype,"importNode",function(a,c){a=ea.call(this,a,c);this.__CE_hasRegistry?C(b,a):x(b,a);return a});u(Document.prototype,"createElementNS",function(a,c){if(this.__CE_hasRegistry&&(null===a||"http://www.w3.org/1999/xhtml"===a)){var d=b.a.get(c);if(d)return new d.constructor}a=I.call(this,a,c);y(b,a);return a});
Y(b,Document.prototype,{h:fa,append:ga})};function xa(){var b=X;function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var e=void 0;if(this.firstChild){var c=this.childNodes,k=c.length;if(0<k&&n(this))for(var e=Array(k),g=0;g<k;g++)e[g]=c[g]}d.set.call(this,a);if(e)for(a=0;a<e.length;a++)B(b,e[a])}}})}u(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);
a=L.call(this,a,d);if(n(this))for(d=0;d<e.length;d++)z(b,e[d]);return a}e=n(a);d=L.call(this,a,d);e&&B(b,a);n(this)&&z(b,a);return d});u(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=K.call(this,a);if(n(this))for(var e=0;e<c.length;e++)z(b,c[e]);return a}c=n(a);e=K.call(this,a);c&&B(b,a);n(this)&&z(b,a);return e});u(Node.prototype,"cloneNode",function(a){a=J.call(this,a);this.ownerDocument.__CE_hasRegistry?C(b,a):x(b,a);
return a});u(Node.prototype,"removeChild",function(a){var c=n(a),e=M.call(this,a);c&&B(b,a);return e});u(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);a=N.call(this,a,d);if(n(this))for(B(b,d),d=0;d<e.length;d++)z(b,e[d]);return a}var e=n(a),f=N.call(this,a,d),c=n(this);c&&B(b,d);e&&B(b,a);c&&z(b,a);return f});O&&O.get?a(Node.prototype,O):w(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=[],b=
0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)M.call(this,this.firstChild);K.call(this,document.createTextNode(a))}})})};function ya(b){var a=Element.prototype;function c(a){return function(e){for(var c=[],d=0;d<arguments.length;++d)c[d-0]=arguments[d];for(var d=[],k=[],g=0;g<c.length;g++){var l=c[g];l instanceof Element&&n(l)&&k.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)d.push(l);else d.push(l)}a.apply(this,c);for(c=0;c<k.length;c++)B(b,k[c]);if(n(this))for(c=0;c<d.length;c++)k=d[c],k instanceof Element&&z(b,k)}}V&&(a.before=c(V));V&&(a.after=c(pa));qa&&u(a,"replaceWith",function(a){for(var e=
[],c=0;c<arguments.length;++c)e[c-0]=arguments[c];for(var c=[],d=[],k=0;k<e.length;k++){var g=e[k];g instanceof Element&&n(g)&&d.push(g);if(g instanceof DocumentFragment)for(g=g.firstChild;g;g=g.nextSibling)c.push(g);else c.push(g)}k=n(this);qa.apply(this,e);for(e=0;e<d.length;e++)B(b,d[e]);if(k)for(B(b,this),e=0;e<c.length;e++)d=c[e],d instanceof Element&&z(b,d)});ra&&u(a,"remove",function(){var a=n(this);ra.call(this);a&&B(b,this)})};function za(){var b=X;function a(a,c){Object.defineProperty(a,"innerHTML",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){var e=this,d=void 0;n(this)&&(d=[],t(this,function(a){a!==e&&d.push(a)}));c.set.call(this,a);if(d)for(var f=0;f<d.length;f++){var r=d[f];1===r.__CE_state&&b.disconnectedCallback(r)}this.ownerDocument.__CE_hasRegistry?C(b,this):x(b,this);return a}})}function c(a,c){u(a,"insertAdjacentElement",function(a,e){var d=n(e);a=c.call(this,a,e);d&&B(b,e);n(a)&&z(b,e);
return a})}function d(a,c){function e(a,e){for(var c=[];a!==e;a=a.nextSibling)c.push(a);for(e=0;e<c.length;e++)C(b,c[e])}u(a,"insertAdjacentHTML",function(a,b){a=a.toLowerCase();if("beforebegin"===a){var d=this.previousSibling;c.call(this,a,b);e(d||this.parentNode.firstChild,this)}else if("afterbegin"===a)d=this.firstChild,c.call(this,a,b),e(this.firstChild,d);else if("beforeend"===a)d=this.lastChild,c.call(this,a,b),e(d||this.firstChild,null);else if("afterend"===a)d=this.nextSibling,c.call(this,
a,b),e(this.nextSibling,d);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");})}P&&u(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=P.call(this,a)});Q&&Q.get?a(Element.prototype,Q):W&&W.get?a(HTMLElement.prototype,W):w(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return J.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName,e=b?this.content:this,
c=I.call(document,this.namespaceURI,this.localName);for(c.innerHTML=a;0<e.childNodes.length;)M.call(e,e.childNodes[0]);for(a=b?c.content:c;0<a.childNodes.length;)K.call(e,a.childNodes[0])}})});u(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return S.call(this,a,c);var e=R.call(this,a);S.call(this,a,c);c=R.call(this,a);b.attributeChangedCallback(this,a,e,c,null)});u(Element.prototype,"setAttributeNS",function(a,c,d){if(1!==this.__CE_state)return ja.call(this,a,c,d);var e=U.call(this,
a,c);ja.call(this,a,c,d);d=U.call(this,a,c);b.attributeChangedCallback(this,c,e,d,a)});u(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return T.call(this,a);var c=R.call(this,a);T.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});u(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return ka.call(this,a,c);var d=U.call(this,a,c);ka.call(this,a,c);var e=U.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});ta?c(HTMLElement.prototype,
ta):la?c(Element.prototype,la):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");ua?d(HTMLElement.prototype,ua):ma?d(Element.prototype,ma):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");Y(b,Element.prototype,{h:na,append:oa});ya(b)};/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var X=new v;va();wa();Y(X,DocumentFragment.prototype,{h:ha,append:ia});xa();za();document.__CE_hasRegistry=!0;var customElements=new G(X);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements})};
}).call(self);

//# sourceMappingURL=custom-elements.min.js.map


/*! twobirds-core - v8.1.72 - 2018-06-25 */

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
                        if ( that.handlers[tbEvent.name] instanceof Array ){
                            that.handlers[tbEvent.name] = that.handlers[tbEvent.name].reduce(
                                function( pHandlers, pHandler ){
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
                        }

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

                            if ( that.handlers[ pThisEventName ] instanceof Array === false ){
                                that.handlers[ pThisEventName ] = [];
                            }

                            [].push.call( that.handlers[ pThisEventName ], pHandler );

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
            && pParam.nodeType === 1    // html node
            && pParam !== document.head
            && pParam.parentNode !== document.head
            && tb.assumeTb()
        ){
            // scan for AACEs and load + re-insert
            //console.log('scan for ACEs: ', pParam);
            var fileName, 
                lastIndex, 
                nameSpace,
                tagName;

            var selection = tb.dom(pParam)
                .children()
                .forEach(function(pElement){
                    var tagName = pElement.tagName.toLowerCase(),
                        isUndefinedACE = 
                            tagName.indexOf('-') !== -1
                            && !window.customElements.get(tagName),
                        isLoading,
                        fileName,
                        hasTbClassCode;

                    fileName = tagName.split('-');
                    lastIndex = fileName.length - 1;

                    // normalize filename ->
                    fileName[lastIndex] = 
                        fileName[lastIndex].substr(0,1).toUpperCase() +
                        fileName[lastIndex].substr(1).toLowerCase();
                            
                    nameSpace = fileName.join('.');

                    fileName = '/'+fileName.join('/') + '.js';     

                    isLoading = !!tb.require.get(fileName),
                    hasTbClassCode = !!tb.namespace(nameSpace).get(); // jshint ignore:line

                    // create element definition callback
                    var define = (function( nameSpace, tagName, element ){ return function define(){

                        if( !window.customElements.get(tagName) ){

                            //console.log('define', tagName);
                            // auto-define autonomous custom element
                            customElements.define(
                                tagName, 
                                class extends HTMLElement{

                                    constructor(){
                                        super();
                                    }

                                    static get observedAttributes(){
                                        return Array
                                            .from( element.attributes )
                                            .map( function(pAttribute){ 
                                                return pAttribute.name; 
                                            });
                                    }

                                    connectedCallback(){
                                        var c = tb.namespace(nameSpace).get() 
                                                || class extends Tb{ // jshint ignore:line
                                                    constructor(){ super(); }
                                                },
                                            e;
                                        
                                        c.prototype.namespace = nameSpace;

                                        e = new tb(
                                            c,
                                            {},
                                            this
                                        );
                                        e.trigger('connected');
                                    }

                                    disconnectedCallback(){
                                        tb(this).trigger('disconnected');
                                    }

                                    adoptedCallback(){
                                        tb(this).trigger('adopted');
                                    }

                                    attributeChangedCallback( name, oldValue, newValue ){
                                        tb(this).trigger('attributeChanged', { name: name, oldValue: oldValue, newValue: newValue} );
                                    }

                                }
                            );

                        }

                    };})( nameSpace, tagName, pElement );

                    if (isUndefinedACE){
                        //console.log('tagName', tagName, 'in', pElement.parentNode );
                        if ( !hasTbClassCode ){
                            tb.require( fileName )
                                .then( define );
                        } else {
                            define();
                        }
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
            template.normalize();
            return !template['content']['childNodes'] 
                ? Array.from(template.childNodes) 
                : Array.from(template.content.childNodes);
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

                // uses 'template' element to retrieve DOM nodes
                var DOM = _htmlToElements( 
                    pSelector   // compress template string
                        .split('\n')
                        .map( (e) => e.trim().replace( /\t/g, '') )
                        .map( (e) => e.substr(-1) === '>' ? e : e + ' ' )
                        .join('')
                        .trim()
                ); 

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
                    var dom = tb.dom( DOM );
                    //dom.clean();
                    return dom;
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
                                }
                            }
                        );
                        setTimeout(function(){
                            tb.assumeTb( pDomNode );
                        },0);
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

                setTimeout(function(){
                    tb.assumeTb( pElement );
                },0);

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

                var that = this,
                    node;

                if (pParam !== undefined){
                    doClean = !pParam ? false : true;
                } else if (doClean){
                    that.forEach(
                        function( pElement ){
                            var treeWalker = document.createTreeWalker(
                                    pElement,
                                    128 + 4    // comment nodes + text nodes
                                );

                            while(treeWalker.nextNode()){
                                node = treeWalker.currentNode; 
                                if (
                                    node.nodeType === 8
                                    || (
                                        node.nodeType === 3
                                        && node.textContent.replace( /[\s]/g,'').length === 0
                                    )
                                ){
                                    // we need to IIFE so the node pointer is copied, 
                                    // otherwise it will only remove the last comment node of that while loop
                                    setTimeout((function(pNode){ return function(){ // jshint ignore:line
                                        pNode.remove();
                                    }; })( node ), 0);
                                }
                            }

                            setTimeout( function(){ 
                                pElement.normalize();
                            }, 0);

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

                setTimeout(function(){
                    tb.assumeTb( pTarget );
                },0);

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


/**
 @class tb.Util

 @description
     placeholder class, everything contained herein is a curry property of the tb() constructor
 */

/**
 an empty function just in case you need one

 @memberof tb
 @static
 @method tb.nop

 @example

     // this is not very useful, but alas...
     // append the empty function to the 'click' event handler list
     this.on('click', tb.nop);
 */
tb.nop = function(){};

/**
 @memberof tb
 @method tb.namespace
 @static
 @chainable

 @param {string} pNamespace
 @param {object} [pObject] object to scan

 @return {object} containing set() / get() functions for property in pNamespace

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
        that.namespaceArray =  pNamespace.indexOf( '.' ) ? pNamespace.split('.') : [ pNamespace ];
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

        if ( typeof pValue === 'function' 
            && pValue.prototype !== Function.prototype //jshint ignore:line
        ){ //it is a custom class
            pValue.prototype.namespace = that.namespace;
        }

        that.value = pValue;
        that.forceCreation = true;

        return that._walk( !that.target ? window : that.target, that.namespaceArray );
    }

})();

/**
 @memberof tb
 @static
 @method tb.attach

 @param  {object} [pRootNode] DOM node to start binding in
 
 @example

     tb.attach( document.body );
     // scans the given element and all of its descendants
     // in the DOM and looks for attributes "data-tb" in the nodes.

     // Resulting list will be scanned for those nodes that do not already
     // have a tb object inside which is given as a namespace in the data-tb attribute.

     // Creates missing tb object based on the class namespace given
     // in the "data-tb" attribute and stores it in the DOM element
    
 */
tb.attach = function( pRootNode ){

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
 returns a unique id

 @memberof tb
 @static
 @method tb.getId

 @return {string} - unique id

 */
tb.getId = function(){
    return 'id-' + (new Date()).getTime() + '-' + Math.random().toString().replace(/\./, '');
};

/**
 - Promise/A+ compliant promise functionality

 @memberof tb
 @static
 @class tb.Promise
 @constructor

 @param {function} pFunction function to execute
 
 @return {object} Promise/A+ compliant promise object

 @example

        var p = new tb.Promise(function(resolve, reject){

            setTimeout(function(){
                resolve('it worked.');
            },1000)

            setTimeout(function(){
                reject('something went wrong.');
            },500)

        }).then(function(pValue){

            console.log('Yippie! ', pValue);

        }).catch(function(pValue){

            console.log('Oops? ', pValue);

        }).finally(function(pValue){

            console.log('Cleaning up ', pValue);

        });

 */
tb.Promise = (function(){

    'use strict';

    var LAST_ERROR = null;
    var IS_ERROR = {};

    // Promise constructor
    function Promise(fn) {
        fn = fn || tb.nop;
        if (typeof this !== 'object') {
            throw new TypeError('Promises must be constructed via new');
        }
        this._deferredState = 0;
        this._state = 0;
        this._value = null;
        this._deferreds = null;
        if (fn === tb.nop) {
            return;
        }
        doResolve(fn, this);
    }
    Promise._onHandle = null;
    Promise._onReject = null;

    // Promise prototype
    Promise.prototype = {
        /**
         @method then
         @chainable

         @param {function} pFunction - function to execute when promise is resolved

         @return {object} - a new Promise instance (chaining)


         @example

                new tb.Promise(function(resolve, reject){
                    setTimeout( resolve('ok.') );
                }).then(function(pValue){
                    console.log( pValue );  // >ok.
                });

         */
        then: _then,

        /**
         @method catch
         @chainable

         @param {function} pFunction - function to execute when promise is rejected

         @return {object} - a new Promise instance (chaining)


         @example

                new tb.Promise(function(resolve, reject){
                    setTimeout( reject('oops.') );
                }).catch(function(pValue){
                    console.log( pValue );  // >oops.
                });

         */
        'catch': _catch,

        /**
         @method finally
         @chainable

         @param {function} pFunction - function to execute at the end in any case

         @return {object} - a new Promise instance (chaining)


         @example

                new tb.Promise(function(resolve, reject){
                    setTimeout( reject('whatever.') ); // could also be resolve, finally will always be executed
                }).finally(function(pValue){
                    console.log( pValue );  // >whatever.
                });

         */
        'finally': _finally,

        done: _done
    };

    // static methods

    /**
     @method tb.Promise.resolve
     @chainable
     @static

     @param {any} pValue - the value the returned promise will resolve with

     @return {object} - a new resolved Promise instance (chaining)


     @example

            var p = tb.Promise.resolve('resolved');

     */
    Promise.resolve = function( pValue ){
        var ret = new tb.Promise(function( resolve, reject ){
        });

        resolve( ret, pValue );

        return ret;
    };

    /**
     @method tb.Promise.reject
     @chainable
     @static

     @param {any} pValue - the value the returned promise will reject with

     @return {object} - a new rejected Promise instance (chaining)


     @example

            var p = tb.Promise.reject('rejected');

     */
    Promise.reject = function( pValue ){
        var ret = new tb.Promise(function( resolve, reject ){
        });

        reject( ret, pValue );

        return ret;
    };

    /**
     @method tb.Promise.all
     @chainable
     @static

     @param {array} pIterable - an array containing values and/or promises

     @return {object} - a new rejected Promise instance (chaining)

     @example

            // "then" function will be executed when ALL promises have been resolved
            // "catch" function will be executed if one of the promises rejects
            // values in the parameter array will be converted to Promise.resolve(value)

             var p = tb.Promise.all([
                 true,
                 tb.Promise.resolve('new value')
             ]).finally(function(pValue){
                console.log(pValue); // >[ true, 'new value' ]
             });

             var p = tb.Promise.all([
                 true,
                 tb.Promise.reject('oops.')
             ]).finally(function(pValue){
                console.log(pValue); // >oops.
             });
     */
    Promise.all = function( pIterable ){

        var count = pIterable.length,
            observable = tb.observable(count),
            promise = new Promise(),
            result = new Array(count);

        // convert to promises if necessary and add callbacks
        pIterable
            .forEach( function( pValue, pIndex ){

                if ( !pValue.then || typeof pValue.then !== 'function' ){
                    pValue = tb.Promise.resolve( pValue );
                }
                  
                pValue
                    .then(function(pValue){
                        result[ pIndex ] = pValue;
                    })
                    .catch(function(pValue){
                        if ( promise._state === 0 ){
                            reject( promise, pValue._value );
                        }
                    })
                    .finally(function(pValue){
                        observable( observable() - 1 );
                    });

            });

        observable.observe(function(pValue){
            if ( pValue === 0 ){
                observable = null;
                if ( promise._state === 0 ){
                    resolve( promise, result );
                }
            }
        });

        return promise;
    };

    /**
     @method tb.Promise.race
     @chainable
     @static

     @param {array} an array containing values and/or promises

     @return {object} a new rejected Promise instance (chaining)

     @example

            // "then" function will be executed when the fastest promise resolves
            // "catch" function will be executed when the fastest promise rejects
            // values in the parameter array will be converted to Promise.resolve(value)

            var p1 = new tb.Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve('ok.');
                },1000);
            });

            var p2 = new tb.Promise(function(resolve,reject){
                setTimeout(function(){
                    reject('oops.');
                },2000);
            });

            var p = tb.Promise.race([
                p1,
                p2
            ]).then(function(pValue){
                console.log(pValue); // >ok.
            }).catch(function(pValue){
                console.log(pValue); // (will never be reached, p1 resolves first)
            });
     */
    Promise.race = function( pIterable ){
        var promise = new tb.Promise();

        // convert to promises if necessary and add callbacks
        pIterable
            .forEach( function( pValue, pIndex, pOriginalIterable ){
                if ( pValue.constructor !== Promise ){
                    pOriginalIterable[ pIndex ] = Promise.resolve( pValue );
                }
                
                pOriginalIterable[ pIndex ]
                    .then(function(pValue){
                        if ( promise._state === 0 ){
                            resolve( promise, pValue );
                        }
                    })
                    .catch(function(pValue){
                        if ( promise._state === 0 ){
                            reject( promise, pValue );
                        }
                    });
            });

        return promise;
    };

    return Promise;

    // private functions

    // HINT: ignore:lines are needed because jslint regards these functions as being standalone,
    // which they are not - they are the implementation of Promise.prototype methods.

    function _then(onFulfilled, onRejected) {
        if ( !( this instanceof Promise) ) { // jshint ignore:line
            return safeThen(this, onFulfilled, onRejected); // jshint ignore:line
        }
        var res = new Promise(tb.nop);
        handle(this, new Handler(onFulfilled, onRejected, res)); // jshint ignore:line
        return res;
    }

    function _catch( pFunction ){
        return this.then( null, pFunction ); // jshint ignore:line
    }

    function _done(onFulfilled, onRejected) {
        var that = arguments.length ? this.then.apply(this, arguments) : this; // jshint ignore:line
        that.then(null, function (pValue) {
            setTimeout(function () {
                throw pValue;
            }, 0);
        });
    }

    function _finally(f) {
        var that = this; // jshint ignore:line

        return this.then(function (pValue) { // jshint ignore:line
            return Promise.resolve(f(that._value)).then(function () {
                return that._value;
            });
        }, function (pValue) {
            return Promise.resolve(f(that._value)).then(function () {
                throw that._value;
            });
        });
    }

    function getThen(obj) {
        try {
            return obj.then;
        } catch (e) {
            LAST_ERROR = e;
            return IS_ERROR;
        }
    }

    function tryCallOne(fn, a) {
        try {
            return fn(a);
        } catch (e) {
            LAST_ERROR = e;
            return IS_ERROR;
        }
    }
    function tryCallTwo(fn, a, b) {
        try {
            fn(a, b);
        } catch (e) {
            LAST_ERROR = e;
            return IS_ERROR;
        }
    }

    function safeThen(that, onFulfilled, onRejected) {
        return new that.constructor(function (resolve, reject) {
            var res = new tb.Promise(tb.nop);
            res.then(resolve, reject);
            handle(that, new Handler(onFulfilled, onRejected, res));
        });
    }

    function handle(that, deferred) {
        while (that._state === 3) {
            that = that._value;
        }
        if (Promise._onHandle) {
            Promise._onHandle(that);
        }
        if (that._state === 0) {
            if (that._deferredState === 0) {
                that._deferredState = 1;
                that._deferreds = deferred;
                return;
            }
            if (that._deferredState === 1) {
                that._deferredState = 2;
                that._deferreds = [that._deferreds, deferred];
                return;
            }
            that._deferreds.push(deferred);
            return;
        }
        handleResolved(that, deferred);
    }

    function handleResolved(that, deferred) {
        setTimeout( function() {
            var cb = that._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                if (that._state === 1) {
                    resolve(deferred.promise, that._value);
                } else {
                    reject(deferred.promise, that._value);
                }
                return;
            }
            var ret = tryCallOne(cb, that._value);
            if (ret === IS_ERROR) {
                reject(deferred.promise, LAST_ERROR);
            } else {
                resolve(deferred.promise, ret);
            }
        }, 0);
    }

    function resolve(that, newValue) {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === that) {
            return reject(
                that,
                new TypeError('A promise cannot be resolved with itself.')
            );
        }
        if (
            newValue &&
            (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
            var then = getThen(newValue);
            if (then === IS_ERROR) {
                return reject(that, LAST_ERROR);
            }
            if (
                then === that.then &&
                newValue instanceof Promise
            ) {
                that._state = 3;
                that._value = newValue;
                finale(that);
                return;
            } else if (typeof then === 'function') {
                doResolve(then.bind(newValue), that);
                return;
            }
        }
        that._state = 1;
        that._value = newValue;
        finale(that);
    }

    function reject(that, newValue) {
        that._state = 2;
        that._value = newValue;
        if (Promise._onReject) {
            Promise._onReject(that, newValue);
        }
        finale(that);
    }
    function finale(that) {
        if (that._deferredState === 1) {
            handle(that, that._deferreds);
            that._deferreds = null;
        }
        if (that._deferredState === 2) {
            for (var i = 0; i < that._deferreds.length; i++) {
                handle(that, that._deferreds[i]);
            }
            that._deferreds = null;
        }
    }

    function Handler(onFulfilled, onRejected, promise){
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }

    /**
     * execute promise function
     */
    function doResolve(fn, promise) {
        var done = false;
        var res = tryCallTwo(fn, function (value) {
            if (done) {
                return;
            }
            done = true;
            resolve(promise, value);
        }, function (reason) {
            if (done) {
                return;
            }
            done = true;
            reject(promise, reason);
        });
        if (!done && res === IS_ERROR) {
            done = true;
            reject(promise, LAST_ERROR);
        }
    }

})();

/**
 @memberof tb
 @static
 @class tb.Require
 @constructor

 @param {(string|string[])} pRequiredFiles string or string array containing required files

 @return {object} Promise/A+ compliant promise object

 tb.Require class ( uses tb.require function and returns the promise returned by it )

 - add into prototype of your constructor
 - instance will get an 'init' event when all files have loaded.

 @example

     tb.namespace( 'app.GrandParent' ).set( 
         (function(){

              // Constructor
              function GrandParent(){
                  var that = this;
    
                  that.handlers = {
                      init
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
    
              function init(){
                   // will be called when requirement loading is finished ( both success and error )
              }
    
         })()
     );
 */
tb.Require = function ( pFiles ) {
    return tb.require( pFiles );
};

tb.Require.prototype = {};


/**
 @memberof tb
 @static
 @method tb.require

 @param {(string|string[])} pFiles array of filenames
 @param {function} [pCallback] optional callback after all loading is done
 
 @return {object} - Promise/A+ compliant promise object

 @example

        // in your code ...
        tb.require([
            '/app/styles.css',                  // .css will be inserted into head <link>
            '/app/someJavascript.js',           // .js will be inserted into head <script>
            '/app/someData.json',               // .json data will be parsed to JS object
            '/app/templates/someTemplate.html'  // all other file contents will be saved into repo
        ], function( pValue ){
            // do something when all loading activity has finished
            console.log(pValue); // >[ 'done', 'done', <someObject>, '<someHtmlString>' ]
        });
 
 */
tb.require = function( pFiles, pCallback ){

    var promiseArray = [], // used for Promise.all()
        ret;

    //console.log( 'tb.require()', pFiles);

    if ( !pFiles ){
        var warn = 'tb.require: no files given.';

        console.warn(warn);

        return tb.Promise.reject(warn);
    }

    // convert to array anyway
    if ( typeof pFiles === 'string' ){
        pFiles = [ pFiles ];
    }

    // make parameter array for tb.Promise.all
    pFiles
        .forEach(function( pFile ){
            var type = _getTypeFromSrc( pFile );

            if ( pFile.split('/').pop().indexOf('.') === -1 ){ // file type extension
                var warn = 'tb.require: no file type given for ';

                console.warn( warn, pFile );

                return tb.Promise.reject( warn + pFile );
            }

            // file type container does not exist
            if ( !tb.require.repo[type] ){
                tb.require.repo[type] = {};
            }

            // file promise does not exist in container
            if ( !tb.require.repo[type][pFile] ){
                // if on client, load from server, if on server, load from file system
                tb.require.repo[type][pFile] = typeof module === 'undefined' ? _load( pFile ) : _fsLoad( pFile );
            }

            // finally push promise
            promiseArray.push( tb.require.repo[type][pFile] );

        });


    ret = tb.Promise.all(promiseArray);

    // attach callback if given
    if ( !!pCallback ){
        ret.finally( function(pValueArray){
            pCallback.call( pValueArray );
        });
    }

    return ret;

    // private functions

    function _fsLoad(pFile){
        
        var fs = require('fs'),
            type = _getTypeFromSrc(pFile),
            content,
            promise;

        promise = new tb.Promise(function(resolve, reject){

            var file = pFile;

            // we resolve all loading operations even if they fail, 
            // because failure shouldnt halt operations
            // in case of failure result value will be an error message
            if ( type === 'js' ){
                try {
                    require(file);
                    resolve('done.');
                } catch (e) {
                    resolve('error reading file using require("' + file + '"")');
                }
            } else {
                if ( fs.existsSync( file ) ){
                    try {
                        content = fs.readFileSync( file, 'utf8' );
                        resolve(content);
                    } catch (e) {
                        resolve( 'error: could not read file [' + file + ']');
                    }

                } else {
                    resolve('error: file not found [' + file + ']');
                }
            }

        }).finally(function(pValue){

            tb.require.repo[type][pFile] = pValue;
        
        });

        return promise;

    }

    function _load(pFile){
        
        var typeConfigs = { // standard configuration types
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
            typeConfig,
            type = _getTypeFromSrc(pFile),
            file = pFile,
            promise;

        // cache busting
        if ( !!tb.require.cacheBust ){ // temporarily disabled
            //file = pFile + ( pFile.indexOf('?') > -1 ? '&' : '?' ) + tb.getId();
        }

        //console.log('load', type, typeConfigs);

        // do loading
        if ( !!typeConfigs[type] ) { // either *.css or *.js file

            // increase loadcount ( tb.idle() related )
            tb.status.loadCount(tb.status.loadCount() + 1); // increase loadCount

            promise = new tb.Promise(function(resolve, reject){
                var element;

                //console.log('special load', type, typeConfigs);

                // get default config for type
                typeConfig = typeConfigs[type];

                // create DOM element
                element = document.createElement(typeConfig.tag);
                element.async = true;
                element.onreadystatechange = element.onload = function () {
                    var state = element.readyState;
                    if ( !state || /loaded|complete/.test(state) ) {
                        resolve('1');
                    }
                };

                // add attributes to DOM element
                Object
                    .keys( typeConfig.attributes )
                    .forEach(
                        function( pKey ){
                            element.setAttribute(pKey, tb.parse(typeConfig.attributes[pKey], { src: pFile }));
                        }
                    );

                // append node to head
                document.getElementsByTagName('head')[0].appendChild(element);

            }).finally(function(){

                // decrease loadcount ( tb.idle() related )
                tb.status.loadCount(tb.status.loadCount() - 1); // increase loadCount

                tb.require.repo[type][pFile] = 'done';
            
            });

            return promise;

        } else { // load via request if unknown type, trigger callback with text or JSON

            var f = function (data) {

                // convert if .json
                if ( type === 'json' && !!data['text']) {
                    try {
                        tb.require.repo[type][pFile] = JSON.parse(data.text);
                    } catch (e) {
                        console.error('invalid JSON: ', data);
                    }
                } else {
                    tb.require.repo[type][pFile] = data.text;
                }

            };

            var options = {
                url: file
            };

            return tb.request(options).finally(f);

        }

    }

    function _getTypeFromSrc(pSrc) {
        return pSrc.split('?')[0].split('.').pop();
    }

};

tb.require.repo = {};
tb.require.cacheBust = true;
tb.require.loadcount = 0;

tb.require.get = function(pFile){
    let extension = pFile.split('?')[0].split('.').pop();
    if (tb.require.repo[extension]){
        return tb.require.repo[extension][pFile] || undefined;
    }
    return false;
};

/**
 @memberof tb
 @static
 @method tb.webSocket

 @param pOptions { object } a hash object containing these options:

 @param {string} pOptions.url - the URL to call
 @param {array} [pOptions.protocols] - array containing protocol names the server can choose from

 @return {object} - a twoBirds compliant websocket implementation

 @example

        // hint: you must use ws:// from http:// apps, and wss:// from https:// apps
        var ws = tb.webSocket(
            'ws://localhost:8000'
        ).on(
            'error',
            function(){
                console.error( 'error establishing connection' );
            }
        ).on(
            'open',
            function(){
                console.log( 'connection opened' );
            }
        ).on(
            'close',
            function(){
                console.log( 'connection closed' );
            }
        ).on(
            'message',
            function( pMessage ){
                console.log( pMessage );
            }
        );

        ws.send(JSON.stringify( { id: tb.getId(), msg: 'Hallo' } ));

        ws.close();

 */
tb.webSocket = (function () {

    function WS( pConfig ){
        var that = this;

        that.config = pConfig;

        that.socket = !!that.config['protocols']
            ? new WebSocket( // jshint ignore:line
                that.config.url, 
                that.config['protocols']
            )
            : new WebSocket( // jshint ignore:line
                that.config.url 
            );

        that.socket.onopen = function onOpen( ev ){
            that.trigger( 'open', ev );
        };
        
        that.socket.onerror = function onError( ev ){
            that.trigger( 'error', ev );
        };
        
        that.socket.onmessage = function onMessage( ev ){
            that.trigger( 'message', ev.data );
        };
        
        that.socket.onclose = function onClose( ev ){
            that.trigger( 'close', ev );
        };
               
    } 

    WS.prototype = {
        send: send,
        close: close
    };

    return function( pUrl, pProtocols ){
        return new tb( 
            WS, 
            { 
                url: pUrl,
                protocols: pProtocols
            }
        );
    };
    
    function send(pSend) {
        this.socket.send(pSend);
    }

    function close() {
        this.socket.close();
    }

})();

/**
 @memberof tb
 @static
 @method tb.request

 @param pOptions { object } a hash object containing these options:<br><br><br>

 @param pOptions.url: (string, required) the URL to call
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
 @param {boolean} [pOptions.async] - defaults to true, indicates whether or not to make an asynchronous request

 @return {object} - a Promise/A+ compliant promise object

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
        function handleReadyState(pReq, pResolve, pStateChange, pReject, pOptions) {
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
                        handleTransactionResponse(pReq, pResolve, pReject, pOptions);
                    }
                };
            })(0), interval);

            return poll;
        }

        /** @private */
        function handleTransactionResponse(pReq, pResolve, pReject, pOptions) {
            var httpStatus,
                responseObject;

            try {
                httpStatus = pReq.connection.status;
            }
            catch (e) {
                httpStatus = 13030;
            }

            if (httpStatus >= 200 && httpStatus < 400) {
                responseObject = createResponseObject(pReq, pOptions);
                try {
                    pResolve( responseObject );
                }
                catch (e) {
                    if (tb.debug){
                        debugger;
                    }
                }
            }
            else {
                responseObject = createResponseObject(pReq, tb.extend( {}, pOptions ) );
                pReject( responseObject );
            }
            release(pReq);
        }

        /** @private */
        function createResponseObject(pObj, pOptions) {
            var obj = {
                tId: pObj.identifier,
                status: pObj.connection.status,
                statusText: pObj.connection.statusText,
                responseHeaders: {},
                requestHeaders: pOptions.headers,
                text: pObj.connection.responseText,
                xml: pObj.connection.responseXML,
                options: pOptions
            };

            pObj
                .connection
                .getAllResponseHeaders()
                .split('\r\n')
                .forEach(function(pSubString){
                    var key = pSubString.split(':')[0],
                        value = pSubString.substr( pSubString.indexOf(':')+1 );
                    if ( !!pSubString ) {
                        obj.responseHeaders[key] = value;
                    }
                });

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

        return function (pOptions) {
            var uid = 'tb' + tb.getId(),
                xmlreq = getConnection(uid),
                method = (pOptions.method ? pOptions.method.toUpperCase() : false) || 'GET',
                url = pOptions.url,
                params = '',
                successHandler = pOptions.success || tb.nop,
                errorHandler = pOptions.error || tb.nop,
                finalHandler = pOptions.finally || tb.nop,
                stateHandler = pOptions.statechange || tb.nop,
                isCachable = pOptions.cachable || true,
                headers = pOptions.headers = pOptions.headers || {},
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
                var promise = new tb.Promise(function( resolve, reject ){
                    if ( ( method === 'GET' || method === 'DELETE' ) && params !== '') {
                        url = url + (url.indexOf('?') < 0 ? '?' : '&') + params;
                    }
                    xmlreq.src = url;

                    xmlreq.connection.open(method, url, isAsync);

                    if (isAsync === true) {
                        xmlreq.poll = handleReadyState(xmlreq, resolve, stateHandler, reject, pOptions);
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
                                    //if ( !myR && myR.connection.status == 4 ) { return; }
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
                            resolve( createResponseObject( xmlreq, tb.extend( {}, pOptions ) ) );
                        }
                        else {
                            reject( createResponseObject( xmlreq, tb.extend( {}, pOptions ) ) );
                        }
                    }
                });

                promise
                    .then(function(pResult){
                        successHandler( pResult );
                    })
                    .catch(function(pResult){
                        errorHandler( pResult );
                    })
                    .finally(function(pResult){
                        finalHandler( pResult );
                    });

                return promise;
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
 @class tb.CRUD
 @constructor

 @param {object} pConfig - config parameter, usually an object @todo param description

 @return {object} - the model instance

 tb.CRUD constructor
 - create and return a simple CRUD model a "data" observable

 @example

     // CRUD model
     that.model = new tb.CRUD({
        'read': {
            url: 'demoapp/configuration/mock/demoapp-configuration-templates.json', // mock data
            method: 'GET',
            type: 'json',
            success: function( pResult ){
                that.model.data( JSON.parse( pResult.text ).data );
            },
            error: function( pResult ){
                console.log( 'an error occured', pResult );
            }
        }
     });

     // ... and later:

     // when template list data has been read, render
     that.model.data.observe( function modelDataChanged(){
        that.trigger( 'render' );
     });

     // read data
     that.model.read({
        // parameters ...
     });

 @example

     // default config mixin -> result will be in that.config
     // just for documentation purposes, will be done by the CRUD model itself

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
         pConfig // params as given to the constructor 
     );

 */
if (typeof module === 'undefined' ){ // will not work as a module

    tb.CRUD = function ( pConfig ) {
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

    tb.CRUD.prototype = (function(){
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


class Tb extends tb{

    constructor( pConfig, pTarget ){

        super( pConfig, pTarget );

        var that = this,
            observable = Symbol('observable'),
            onChange = Symbol('onChange');
        
        // make anonymous property
        that[observable] = tb.observable(false);

        // must be debounced for looped property changes like
        // ... tb.extend( store, $('form').values() );
        that[onChange] = tb.debounce(
            function(){
                this[observable]( tb.extend( {}, this ) );
            },
            0
        );

    }

}
