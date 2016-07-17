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
                expect( !!tb.dom('div.test-parent')[0].nodeType ).toBe( true );
            });

            it("tb.dom('div.test-parent') to have .length 5", function() {
                expect( tb.dom('div.test-parent').length === 5 ).toBe( true );
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

            it("tb.dom( tb.dom( 'div.test-parent' ) ) has .length 5", function() {
                expect( tb.dom( tb.dom( 'div.test-parent') ).length === 5 ).toBe( true );
            });

        });

        describe("tb.dom( [ selector1, selector2, ... ] ) array of selectors tests", function() {

            it("tb.dom( [ document.body ] ) to have .length 1", function() {
                expect( tb.dom([ document.body ]).length === 1 ).toBe( true );
            });

            it("tb.dom( [ document.body, 'div.test-parent' ] ) to have .length 6", function() {
                expect( tb.dom([ document.body, 'div.test-parent' ]).length === 6 ).toBe( true );
            });

            it("tb.dom( [ document.body, 'div.test-parent', 'body' ] ) to have .length 6", function() {
                // should be 6, not 7 due to uniqueness of result ( 'body' === document.body )
                expect( tb.dom([ document.body, 'div.test-parent', 'body' ]).length === 6 ).toBe( true );
            });

            it("tb.dom( [ document.body, 'div.test-parent' ] )[0] to be document.body DOM node", function() {
                expect( tb.dom([ document.body, 'div.test-parent' ])[0] === document.body ).toBe( true );
            });

            it("tb.dom( [ document.body, 'div.test-parent' ] )[1] is a div", function() {
                expect( tb.dom([ document.body, 'div.test-parent' ])[1].tagName === 'DIV' ).toBe( true );
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

            it("tb.dom('body').add('div.test-parent').length === 6", function() {
                expect( tb.dom('body').add('div.test-parent').length === 6 ).toBe( true );
            });

            it("tb.dom('body').add('span.test-grandchild, span.test-greatgrandchild').length === 451", function() {
                expect( tb.dom('body').add('span.test-grandchild, span.test-greatgrandchild').length === 451 ).toBe( true );
            });

        });

        describe(".addClass() / .removeClass()", function() {

            it("tb.dom('body').addClass('test1class') contains test1class", function() {
                tb.dom('body').addClass('test1class');
                expect( tb.dom('body')[0].getAttribute('class').indexOf( 'test1class' ) > -1 ).toBe( true );
            });

            it("tb.dom('body').addClass('test2class test3class') contains 2 new classes now", function() {
                tb.dom('body').addClass('test2class test3class');
                expect( tb.dom('body')[0].getAttribute('class').indexOf( 'test2class' ) > -1 ).toBe( true );
                expect( tb.dom('body')[0].getAttribute('class').indexOf( 'test3class' ) > -1 ).toBe( true );
            });

            it("tb.dom('body') contains 4 classes now", function() {
                expect( tb.dom('body')[0].getAttribute('class').split( ' ' ).length === 4 ).toBe( true );
            });

            it("tb.dom('body') remove test classes", function() {
                tb.dom('body').removeClass( 'test1class test2class test3class' );
                expect( tb.dom('body')[0].getAttribute('class').split( ' ' ).length === 1 ).toBe( true );
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

        describe("children()", function() {

            it("tb.dom('body').children().length === 6", function() {
                // includes jasmine din tag
                expect( tb.dom('body').children().length === 6 ).toBe( true );
            });

            it("tb.dom('body').children('div.test-parent').length === 5", function() {
                expect( tb.dom('body').children('div.test-parent').length === 5 ).toBe( true );
            });

            it("tb.dom('body').children('span').length === 0", function() {
                expect( tb.dom('body').children('span').length === 0 ).toBe( true );
            });

        });

        describe("concat()", function() {

            it("tb.dom('body').concat( tb.dom( 'div.test-parent' ) ).length === 6", function() {
                var a = tb.dom('body').concat( tb.dom( 'div.test-parent' ) );
                expect( a.length === 6 ).toBe( true );
            });

        });

        describe("descendants()", function() {

            it("tb.dom('div.test-parent').descendants().length === 500", function() {
                expect( tb.dom('div.test-parent').descendants().length === 500 ).toBe( true );
            });

            it("tb.dom('div.test-parent').descendants('div').length === 0", function() {
                expect( tb.dom('div.test-parent').descendants('div').length === 0 ).toBe( true );
            });

            it("tb.dom('div.test-parent').descendants('span').length === 500", function() {
                expect( tb.dom('div.test-parent').descendants('span').length === 500 ).toBe( true );
            });

        });

        describe("empty()", function() {

            it("tb.dom('body').concat( tb.dom( 'div.test-parent' ) ).length === 6", function() {
                tb.dom('body').append( '<div class="test1"><div class="test2"></div></div>' );
                tb.dom('div.test1').empty();
                expect( tb.dom('div.test2').length === 0 ).toBe( true );
                tb.dom('div.test1').remove();
            });

        });

        describe("every()", function() {

            it("tb.dom( 'div.test-parent' ).every()", function() {
                var f = function(e){
                        return e.tagName === 'DIV';
                    },
                    a = tb.dom( 'div.test-parent' ).every( f );
                expect( a ).toBe( true );
            });

        });

        describe("filter()", function() {

            it("tb.dom( 'div.test-parent' ).filter( 'div' ) has .length 5", function() {
                var a = tb.dom( 'div.test-parent' ).filter( 'div' );
                expect( a.length === 5 ).toBe( true );
            });

            it("tb.dom( 'div.test-parent' ).filter( 'span' ) has .length 0", function() {
                var a = tb.dom( 'div.test-parent' ).filter( 'span' );
                expect( a.length === 0 ).toBe( true );
            });

            it("tb.dom( 'div.test-parent' ).filter( function )", function() {
                var f = function(e){
                        return e.tagName === 'DIV';
                    },
                    a = tb.dom( 'div.test-parent' ).filter( f );
                expect( a.length === 5 ).toBe( true );
            });

        });

    });

});

