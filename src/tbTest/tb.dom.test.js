describe("tb.dom() selector tests", function() {

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

        describe("tb.dom( pTbResultSet ) get DOM nodes from tb() selector result set", function() {

            it("tb.dom( tb( document.body ) )[0] is dom node", function() {
                expect( tb.dom( tb( document.body ) )[0].nodeType === 1 ).toBe( true );
            });

            it("tb.dom( tb( 'div' ) )[0] is dom node", function() {
                expect( !!tb.dom( tb( 'div') )[0].nodeType ).toBe( true );
            });

            it("tb.dom( tb( 'div.test-parent' ) ) has .length 5", function() {
                expect( tb.dom( tb( 'div.test-parent') ).length === 5 ).toBe( true );
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

});

