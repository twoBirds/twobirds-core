describe("tb.dom() selector tests", function() {

    var $ = tb.dom;
    
    describe("general tests", function() {

        it("tb.dom() present and typeof 'function'", function() {
            expect( typeof tb.dom === 'function' ).toBe(true);
        });

    });

    describe("tb.dom() selector tests", function() {

        describe("tb.dom( 'String' ) .querySelectorAll() string selector tests", function() {

            it("tb.dom('body') is DOM node", function() {
                expect( !!tb.dom('body')[0].nodeType ).toBe( true );
            });

            it("tb.dom('body') to have .length 1", function() {
                expect( tb.dom('body').length === 1 ).toBe( true );
            });

            it("tb.dom('div') is DOM node", function() {
                expect( !!tb.dom('div')[0].nodeType ).toBe( true );
            });

            it("tb.dom('[data-tb~=\"test.Parent\"]') to have .length 5", function() {
                expect( tb.dom('[data-tb~="test.Parent"]').length === 5 ).toBe( true );
            });

        });

        describe("tb.dom( pDomNode ) pick a DOM node", function() {

            it("tb.dom( document.body )[0] is dom node", function() {
                expect( tb.dom( document.body )[0].nodeType === 1 ).toBe( true );
            });

            it("tb.dom( document.createElement('div') )[0] is dom element node", function() {
                expect( tb.dom( document.createElement('div') )[0].nodeType === 1 ).toBe( true );
            });

            it("tb.dom( document.createElement('div') )[0] is a div", function() {
                expect( tb.dom( document.createElement('div') )[0].tagName === 'DIV' ).toBe( true );
            });

        });

        describe("tb.dom( pTbResultSet ) get DOM nodes from tb.dom() selector result set", function() {

            it("tb.dom( tb.dom( document.body ) )[0] is dom node", function() {
                expect( tb.dom( tb.dom( document.body ) )[0].nodeType === 1 ).toBe( true );
            });

            it("tb.dom( tb.dom( 'div' ) )[0] is dom node", function() {
                expect( !!tb.dom( tb.dom( 'div') )[0].nodeType ).toBe( true );
            });

            it("tb.dom( tb.dom( '[data-tb~=\"test.Parent\"]' ) ) has .length 5", function() {
                expect( tb.dom( tb.dom( '[data-tb~="test.Parent"]') ).length === 5 ).toBe( true );
            });

        });

        describe("tb.dom( [ selector1, selector2, ... ] ) array of selectors tests", function() {

            it("tb.dom( [ document.body ] ) to have .length 1", function() {
                expect( tb.dom([ document.body ]).length === 1 ).toBe( true );
            });

            it("tb.dom( [ document.body, '[data-tb~=\"test.Parent\"]' ] ) to have .length 6", function() {
                expect( tb.dom([ document.body, '[data-tb~="test.Parent"]' ]).length === 6 ).toBe( true );
            });

            it("tb.dom( [ document.body, '[data-tb~=\"test.Parent\"]', 'body' ] ) to have .length 6", function() {
                // should be 6, not 7 due to uniqueness of result ( 'body' === document.body )
                expect( tb.dom([ document.body, '[data-tb~="test.Parent"]', 'body' ]).length === 6 ).toBe( true );
            });

            it("tb.dom( [ document.body, '[data-tb~=\"test.Parent\"]' ] )[0] to be document.body DOM node", function() {
                expect( tb.dom([ document.body, '[data-tb~="test.Parent"]' ])[0] === document.body ).toBe( true );
            });

            it("tb.dom( [ document.body, '[data-tb~=\"test.Parent\"]' ] )[1] is a div", function() {
                expect( tb.dom([ document.body, '[data-tb~="test.Parent"]' ])[1].tagName === 'DIV' ).toBe( true );
            });

        });

        describe("tb.dom( 'HtmlString' ) create DOM nodes from HTML String", function() {

            it("tb.dom( '<div>' ) to have .length 1", function() {
                expect( tb.dom('<div>').length === 1 ).toBe( true );
            });

        });

    });

    describe("tb.dom() chained", function() {

        describe(".add()", function() {

            it("tb.dom('body').add('[data-tb~=\"test.Parent\"]').length === 6", function() {
                expect( tb.dom('body').add('[data-tb~="test.Parent"]').length === 6 ).toBe( true );
            });

            it("tb.dom('body').add('[data-tb~=\"test.GrandChild\"],test-greatgrandchild').length === 451", function() {
                expect( tb.dom('body').add('[data-tb~="test.GrandChild"],test-greatgrandchild').length === 451 ).toBe( true );
            });

        });

        describe(".addClass() / .removeClass()", function() {

            it("tb.dom('body').addClass('test1class') contains test1class", function() {
                tb.dom('body').addClass('test1class');
                expect( tb.dom('body')[0].getAttribute('class').split(' ').indexOf( 'test1class' ) > -1 ).toBe( true );
            });

            it("tb.dom('body').addClass('test2class test3class') contains 2 new classes now", function() {
                tb.dom('body').addClass('test2class test3class');
                expect( tb.dom('body')[0].getAttribute('class').split(' ').indexOf( 'test2class' ) > -1 ).toBe( true );
                expect( tb.dom('body')[0].getAttribute('class').split(' ').indexOf( 'test3class' ) > -1 ).toBe( true );
            });

            it("tb.dom('body') contains 3 classes now", function() {
                expect( tb.dom('body')[0].getAttribute('class').split(' ').length === 3 ).toBe( true );
            });

            it("tb.dom('body') remove test classes", function() {
                tb.dom('body').removeClass( 'test1class test2class test3class' );
                expect( !tb.dom('body')[0].getAttribute('class') ).toBe( true );
            });

        });

        describe(".append() / .remove()", function() {

            it("tb.dom('body').append('<a></a>')", function() {
                tb.dom('body').append('<a></a>');
                expect( document.body.lastChild.tagName === 'A' ).toBe( true );
            });

            it("tb.dom('body').append('<a></a><b></b>')", function() {
                tb.dom('body').append('<a></a><b></b>');
                expect( document.body.lastChild.tagName === 'B' ).toBe( true );
            });

            it("tb.dom('body > a,body > b').remove()", function() {
                tb.dom('body > a,body > b').remove();
                expect( document.body.lastChild.tagName === 'DIV' ).toBe( true );
            });

        });

        describe(".appendTo()", function() {

            it("tb.dom('<a></a><b></b><input />').appendTo('body')", function() {
                tb.dom('<a></a><b></b><input />').appendTo('body');
                expect( document.body.lastChild.tagName === 'INPUT' ).toBe( true );
            });

            it("tb.dom('body > a,body > b, body > input').remove()", function() {
                tb.dom('body > a,body > b, body > input').remove();
                expect( document.body.lastChild.tagName === 'DIV' ).toBe( true );
            });

        });

        describe(".attr() / .removeAttr()", function() {

            it("tb.dom('body').attr('data-test', 'test')", function() {
                tb.dom('body').attr('data-test', 'test');
                expect( document.body.getAttribute('data-test') === 'test' ).toBe( true );
            });

            it("tb.dom('body').removeAttr('data-test')", function() {
                tb.dom('body').removeAttr('data-test');
                var hasAttribute = [].some.call(
                    document.body.attributes,
                    function(e){
                        return e.name === 'data-test';
                    }
                );
                expect( hasAttribute === false ).toBe( true );
            });

            it("tb.dom('body').attr({ 'data-test1': 'test1', 'data-test2': 'test2' })", function() {
                tb.dom('body').attr({ 'data-test1': 'test1', 'data-test2': 'test2' });
                expect( document.body.getAttribute('data-test1') === 'test1' ).toBe( true );
                expect( document.body.getAttribute('data-test2') === 'test2' ).toBe( true );
            });

            it("tb.dom('body').removeAttr('data-test1 data-test2')", function() {
                tb.dom('body').removeAttr('data-test1 data-test2');
                var hasAttribute = [].some.call(
                    document.body.attributes,
                    function(e){
                        return e.name === 'data-test1' || e.name === 'data-test2';
                    }
                );
                expect( hasAttribute === false ).toBe( true );
            });

        });

        describe(".children()", function() {

            it("tb.dom('body').children().length === 8", function() {
                // includes jasmine din tag
                expect( tb.dom('body').children().length === 8 ).toBe( true );
            });

            it("tb.dom('body').children('[data-tb~=\"test.Parent\"]').length === 5", function() {
                expect( tb.dom('body').children('[data-tb~="test.Parent"]').length === 5 ).toBe( true );
            });

            it("tb.dom('body').children('span').length === 0", function() {
                expect( tb.dom('body').children('span').length === 0 ).toBe( true );
            });

        });

        describe(".concat()", function() {

            it("tb.dom('body').concat( tb.dom( '[data-tb~=\"test.Parent\"]' )[0] ).length === 2", function() {
                var a = tb.dom('body').concat( tb.dom( '[data-tb~="test.Parent"]' )[0] );
                expect( a.length === 2 ).toBe( true );
            });

        });

        describe(".descendants()", function() {

            it("tb.dom('[data-tb~=\"test.Parent\"]').descendants().length === 500", function() {
                expect( tb.dom('[data-tb~="test.Parent"]').descendants().length === 500 ).toBe( true );
            });

            it("tb.dom('[data-tb~=\"test.Parent\"]').descendants('div').length === 0", function() {
                expect( tb.dom('[data-tb~="test.Parent"]').descendants('div').length === 0 ).toBe( true );
            });

            it("tb.dom('[data-tb~=\"test.Parent\"]').descendants('span,test-greatgrandchild').length === 500", function() {
                expect( tb.dom('[data-tb~="test.Parent"]').descendants('span,test-greatgrandchild').length === 500 ).toBe( true );
            });

        });

        describe(".empty()", function() {

            it("tb.dom('body').concat( tb.dom( '[data-tb~=\"test.Parent\"]' ) ).length === 6", function() {
                tb.dom('body').append( '<div class="test1"><div class="test2"></div></div>' );
                tb.dom('div.test1').empty();
                expect( tb.dom('div.test2').length === 0 ).toBe( true );
                tb.dom('div.test1').remove();
            });

        });

        describe(".every()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).every()", function() {
                var f = function(e){
                        return e.tagName === 'DIV';
                    },
                    a = tb.dom( '[data-tb~="test.Parent"]' ).every( f );
                expect( a ).toBe( true );
            });

        });

        describe(".filter()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).filter( 'div' ) has .length 5", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).filter( 'div' );
                expect( a.length === 5 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).filter( 'span' ) has .length 0", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).filter( 'span' );
                expect( a.length === 0 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).filter( function )", function() {
                var f = function(e){
                        return e.tagName === 'DIV';
                    },
                    a = tb.dom( '[data-tb~="test.Parent"]' ).filter( f );
                expect( a.length === 5 ).toBe( true );
            });

        });

        describe(".forEach()", function() {

            it("forEach()", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' );
                a.forEach(function(e){
                    tb.dom(e).addClass('testForEach');
                });
                expect( tb.dom( 'div.testForEach' ).length === 5 ).toBe( true );
                a.forEach(function(e){
                    tb.dom(e).removeClass('testForEach');
                });
            });

        });

        describe(".hasClass()", function() {

            it("hasClass() true", function() {
                var a = tb.dom( 'body' ).addClass('test');
                expect( tb.dom( 'body' ).hasClass( 'test' ) === true ).toBe( true );
            });

            it("hasClass() false", function() {
                var a = tb.dom( 'body' ).removeClass('test');
                expect( tb.dom( 'body' ).hasClass( 'test' ) === false ).toBe( true );
            });

        });

        describe(".hide() / .show()", function() {

            it("hide()", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).hide();
                expect( a[0].style.display === 'none' && a[4].style.display === 'none' ).toBe( true );
            });

            it("show()", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).show();
                expect( a[0].style.display !== 'none' && a[4].style.display !== 'none' ).toBe( true );
            });

        });

        describe(".html()", function() {

            it("tb.dom( document.body ).append('<b></b>').children('b').html('just a test')", function() {
                tb.dom( document.body ).append('<b></b>').children('b').html('just a test');
                expect( tb.dom( 'body > b')[0].innerHTML === 'just a test' ).toBe( true );
            });

            it("tb.dom( 'body > b' ).html('')", function() {
                tb.dom( 'body > b' ).html('');
                expect( tb.dom( 'body > b')[0].innerHTML === '' ).toBe( true );
                tb.dom( 'body > b' ).remove();
            });

        });

        describe(".indexOf()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]').indexOf( tb.dom('[data-tb~=\"test.Parent\"]')[0] ) === 0", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]').indexOf( tb.dom( '[data-tb~="test.Parent"]')[0] ) === 0 ).toBe( true );
            });

        });

        describe(".insertAfter() / .insertBefore()", function() {

            it("tb.dom( '<b></b>' ).insertBefore( tb.dom( '[data-tb~=\"test.Parent\"]' )[2] )", function() {
                tb.dom( '<b></b>' ).insertBefore( tb.dom( '[data-tb~="test.Parent"]' )[2] );
                expect( tb.dom( 'b')[0].nextElementSibling === tb.dom( '[data-tb~="test.Parent"]' )[2] ).toBe( true );
                tb.dom( 'body > b' ).remove();
            });

            it("tb.dom( '<b></b>' ).insertAfter( tb.dom( '[data-tb~=\"test.Parent\"]' )[2] )", function() {
                tb.dom( '<b></b>' ).insertAfter( tb.dom( '[data-tb~="test.Parent"]' )[2] );
                expect( tb.dom( '[data-tb~="test.Parent"]' )[2].nextElementSibling === tb.dom( 'b' )[0] ).toBe( true );
                tb.dom( 'body > b' ).remove();
            });

        });

        describe(".map()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).map( function( e, i ){ s += i; return i; } )", function() {
                var s = 0,
                    a;
                a = tb.dom( '[data-tb~="test.Parent"]' ).map( function( e, i ){ s += i; return i; } );
                expect( a instanceof Array && s === 10 && a[0] === 0 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).map( function( e, i ){ return e; } )", function() {
                var s = 0,
                    a;
                a = tb.dom( '[data-tb~="test.Parent"]' ).map( function( e, i ){ return e; } );
                expect( !( a instanceof Array ) && !!a['0'] && !!a['0']['nodeType'] ).toBe( true );
            });

        });

        describe(".not()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).not( '[data-tb~=\"test.Parent\"]:nth-child(4)' )", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).not( '[data-tb~="test.Parent"]:nth-child(4)' );
                expect( a.length === 4 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).not( '[data-tb~=\"test.Parent\"]:nth-child(4), [data-tb~=\"test.Parent\"]:nth-child(5)' )", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).not( '[data-tb~="test.Parent"]:nth-child(4), [data-tb~="test.Parent"]:nth-child(5)' );
                expect( a.length === 3 ).toBe( true );
            });

        });

        describe(".parent()", function() {

            it("tb.dom( '[data-tb~=\"test.Child\"]' ).parent().length === 5", function() {
                expect( tb.dom( '[data-tb~="test.Child"]' ).parent().length === 5 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Child\"]' ).parent('div').length === 5", function() {
                expect( tb.dom( '[data-tb~="test.Child"]' ).parent('div').length === 5 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Child\"]' ).parent('span').length === 0", function() {
                expect( tb.dom( '[data-tb~="test.Child"]' ).parent('span').length === 0 ).toBe( true );
            });

        });

        describe(".parents()", function() {

            it("tb.dom( '[data-tb~=\"test.Child\"]' ).parents().length === 6", function() {
                expect( tb.dom( '[data-tb~="test.Child"]' ).parents().length === 6 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Child\"]' ).parents('div').length === 5", function() {
                expect( tb.dom( '[data-tb~="test.Child"]' ).parents('div').length === 5 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Child\"]' ).parents('span').length === 0", function() {
                expect( tb.dom( '[data-tb~="test.Child"]' ).parents('span').length === 0 ).toBe( true );
            });

        });

        describe(".pop()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).pop() remainder has .length 4", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' );
                a.pop();
                
                expect( a.length === 4 ).toBe( true );
            });

            it("!!tb.dom( '[data-tb~=\"test.Parent\"]' ).pop()['nodeType']", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ),
                    b = a.pop();
                expect( !!b['nodeType'] ).toBe( true );
            });

        });

        describe(".push()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).push( document.body )", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ).push( document.body );
                expect( a.length === 6 ).toBe( true );
            });

        });

        describe(".reduce()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).reduce(...)", function() {
                var x,
                    f = function( p, t, i ){
                        var y = p;
                        y += i;
                        return y;
                    },
                    a = tb.dom( '[data-tb~="test.Parent"]' );

                x = a.reduce( f, 0 );

                expect( x === 10 ).toBe( true );
            });

        });

        describe(".reduceRight()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).reduceRight(...)", function() {
                var x,
                    f = function( p, t, i ){
                        var y = p;
                        y += i*2;
                        return y;
                    },
                    a = tb.dom( '[data-tb~="test.Parent"]' );

                x = a.reduceRight( f, 0 );

                expect( x === 20 ).toBe( true );
            });

        });

        describe(".reverse()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).reverse()", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).reverse()[0] === tb.dom( '[data-tb~="test.Parent"]' )[4] ).toBe( true );
            });

        });

        describe(".shift()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).shift()['nodeType']", function() {
                expect( !!tb.dom( '[data-tb~="test.Parent"]' ).shift()['nodeType'] ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).shift()[0] === tb.dom( '[data-tb~=\"test.Parent\"]' )[1]", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' );
                a.shift();
                expect( a[0] === tb.dom( '[data-tb~="test.Parent"]' )[1] ).toBe( true );
            });

        });

        describe(".slice()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).slice(...) instanceof tb", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).slice( 1, 3 )['__tbSelector__'] ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).slice( 1, 2 )[0] === tb.dom( '[data-tb~=\"test.Parent\"]' )[1]", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).slice( 1, 3 )[0] === tb.dom( '[data-tb~="test.Parent"]' )[1] ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).slice( 1, 2 )[1] === tb.dom( '[data-tb~=\"test.Parent\"]' )[2]", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).slice( 1, 3 )[1] === tb.dom( '[data-tb~="test.Parent"]' )[2] ).toBe( true );
            });

        });

        describe(".some()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).some(...)", function() {
                var f = function(e, i){
                        return i === 3;
                    },
                    a = tb.dom( '[data-tb~="test.Parent"]' ).some( f );
                expect( a ).toBe( true );
            });

        });

        describe(".splice()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).slice(...) instanceof tb.dom", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ),
                    b = a.splice( 1, 1 , document.body);
                expect( a['__tbSelector__'] ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).splice( 1, 1 , document.body) deleted element", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ),
                    b = a.splice( 1, 1 , document.body)[0];
                expect( b === tb.dom( '[data-tb~="test.Parent"]' )[1] ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).splice( 1, 1 , document.body).length === 5", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ),
                    b = a.splice( 1, 1 , document.body);
                expect( a.length === 5 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).splice( 1, 1 , document.body) inserted element", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' ),
                    b = a.splice( 1, 1 , document.body);
                expect( a[1] === document.body ).toBe( true );
            });

        });

        describe(".toArray()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).toArray() instanceof Array", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).toArray() instanceof Array ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).toArray().length === tb.dom( '[data-tb~=\"test.Parent\"]' ).length", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).toArray().length === tb.dom( '[data-tb~="test.Parent"]' ).length ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).toArray()[0] === tb.dom( '[data-tb~=\"test.Parent\"]' )[0]", function() {
                expect( tb.dom( '[data-tb~="test.Parent"]' ).toArray()[0] === tb.dom( '[data-tb~="test.Parent"]' )[0] ).toBe( true );
            });

        });

        describe(".unique()", function() {

            it("tb.dom( [ document.body, 'body' ] ).length === 1", function() {
                expect( tb.dom( [ document.body, 'body' ] ).length === 1 ).toBe( true );
            });

        });

        describe(".trigger(), .off(), .on(), .one()", function() {

            var GPdone = false,
                Cdone = false,
                firstCalled = '',
                handlers = {
                    GPtestHandler: function(e){    // test handler for Grandparent
                        //console.log('GPtestHandler');
                        firstCalled = firstCalled || 'GP';
                        GPdone = true;
                    },
                    CtestHandler: function(e){     // test handler for Child
                        //console.log('CtestHandler');
                        firstCalled = firstCalled || 'C';
                        Cdone = true;
                    }
                };

            beforeEach(function() {
                // reset done vars
                GPdone = false;
                Cdone = false;
                firstCalled = false;
            });

            afterEach(function() {
                // clear all handlers from all tb() instances
                tb.dom([ '[data-tb~="test.GrandParent"]', '[data-tb~="test.Child"]' ])
                    .off( 'triggerTest', handlers.GPtestHandler )
                    .off( 'triggerTest', handlers.CtestHandler );
            });

            // trigger a simple local event, no bubbling
            describe(".trigger() + .on()", function() {

                beforeEach(function() {

                    // set handlers for testing - capture = false
                    tb.dom( '[data-tb~="test.GrandParent"]' ).on( 'triggerTest', handlers.GPtestHandler );
                    tb.dom( tb.dom( '[data-tb~="test.Child"]')[0] ).on( 'triggerTest', handlers.CtestHandler );

                    // trigger event
                    tb.dom( tb.dom( '[data-tb~="test.Child"]')[0] ).trigger( 'triggerTest', {}, true, true );

                });

                afterEach(function() {
                    // clear all handlers from all tb() instances
                    tb.dom([ '[data-tb~="test.GrandParent"]', '[data-tb~="test.Child"]' ])
                        .off( 'triggerTest', handlers.GPtestHandler )
                        .off( 'triggerTest', handlers.CtestHandler );
                });

                it("handler called - no bubbling, synchronous and in correct order", function () {
                    //console.log( Cdone, GPdone, firstCalled );
                    expect( Cdone === true && GPdone === true && firstCalled === 'C' ).toBe( true );
                });
            });

            // trigger a simple local event, with capture
            describe(".trigger() + .on(), pCapture = true", function() {

                beforeEach(function() {

                    // set handlers for testing - capture = false
                    tb.dom( '[data-tb~="test.GrandParent"]' ).on( 'triggerTest', handlers.GPtestHandler, true );
                    tb.dom( tb.dom( '[data-tb~="test.Child"]')[0] ).on( 'triggerTest', handlers.CtestHandler );

                    // trigger event
                    tb.dom( tb.dom( '[data-tb~="test.Child"]')[0] ).trigger( 'triggerTest', {}, true, true );

                });

                afterEach(function() {
                    // clear all handlers from all tb() instances
                    tb.dom([ '[data-tb~="test.GrandParent"]', '[data-tb~="test.Child"]' ])
                        .off( 'triggerTest', handlers.GPtestHandler, true )
                        .off( 'triggerTest', handlers.CtestHandler );
                });

                it("handler called - with caption, synchronous and in correct order", function () {
                    //console.log( Cdone, GPdone, firstCalled );
                    expect( Cdone === true && GPdone === true && firstCalled === 'GP' ).toBe( true );
                });
            });

            // trigger a simple local event, no bubbling
            describe(".trigger() + .on(), no bubbling", function() {

                beforeEach(function() {

                    // set handlers for testing - capture = false
                    tb.dom( '[data-tb~="test.GrandParent"]' ).on( 'triggerTest', handlers.GPtestHandler );
                    tb.dom( tb.dom( '[data-tb~="test.Child"]')[0] ).on( 'triggerTest', handlers.CtestHandler );

                    // trigger event
                    tb.dom( tb.dom( '[data-tb~="test.Child"]')[0] ).trigger( 'triggerTest', {}, false, true );

                });

                afterEach(function() {
                    // clear all handlers from all tb() instances
                    tb.dom([ '[data-tb~="test.GrandParent"]', '[data-tb~="test.Child"]' ])
                        .off( 'triggerTest', handlers.GPtestHandler )
                        .off( 'triggerTest', handlers.CtestHandler );
                });

                it("handler called - no bubbling, synchronous and in correct order", function () {
                    //console.log( Cdone, GPdone, firstCalled );
                    expect( Cdone === true && GPdone === false && firstCalled === 'C' ).toBe( true );
                });
            });

        });

        describe(".unshift()", function() {

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).unshift( document.body, tb.dom( test.Child )[0] )", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' );

                a.unshift( document.body, tb.dom( test.Child )[0] );

                expect( a.length === 7 ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).unshift( document.body, tb.dom( test.Child )[0] )[0]", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' );

                a.unshift( document.body, tb.dom( test.Child )[0] );

                expect( a[0] === document.body ).toBe( true );
            });

            it("tb.dom( '[data-tb~=\"test.Parent\"]' ).unshift( document.body, tb.dom( test.Child )[0] )[1]", function() {
                var a = tb.dom( '[data-tb~="test.Parent"]' );

                a.unshift( document.body, tb.dom( test.Child )[0] );

                expect( a[1] === tb.dom( test.Child )[0] ).toBe( true );
            });

        });

    });

});

