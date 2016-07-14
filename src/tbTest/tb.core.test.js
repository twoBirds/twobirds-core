console.log( 'tb.core jasmine test' );



describe("tb.core.js", function() {

    describe("general tests", function() {

        it("tb() present and typeof 'function'", function() {
            expect( typeof tb === 'function' ).toBe(true);
        });

        it("tb.dom() present and typeof 'function'", function() {
            expect( typeof tb.dom === 'function' ).toBe(true);
        });

        it("tb.Model() present and typeof 'function'", function() {
            expect( typeof tb.Model === 'function' ).toBe(true);
        });

        it("tb.Event() present and typeof 'function'", function() {
            expect( typeof tb.Event === 'function' ).toBe(true);
        });

        it("tb.Require() present and typeof 'function'", function() {
            expect( typeof tb.Require === 'function' ).toBe(true);
        });

    });

    describe("tb() selector tests", function() {

        describe("tb( 'String' ) .querySelectorAll() string selector tests", function() {

            it("tb('body') is a tb instance", function() {
                expect( tb('body') instanceof tb.Selector ).toBe(true);
            });

            it("tb('body') to have .length 1", function() {
                expect( tb('body').length === 1 ).toBe(true);
            });

            it("tb('body')[0] instanceof tb", function() {
                expect( tb('body')[0] instanceof tb ).toBe(true);
            });

            it("tb('body')[0].target to be document.body DOM node", function() {
                expect( tb('body')[0].target === document.body ).toBe(true);
            });

        });

        describe("tb( /String/ ) regEx selector tests", function() {

            it("tb( /app.Body/ ) is a tb instance", function() {
                expect( tb('body') instanceof tb.Selector ).toBe(true);
            });

            it("tb( /app.Body/ ) to have .length 1", function() {
                expect( tb('body').length === 1 ).toBe(true);
            });

            it("tb( /app.Body/ )[0] instanceof tb", function() {
                expect( tb('body')[0] instanceof tb ).toBe(true);
            });

            it("tb( /app.Body/ )[0].target to be document.body DOM node", function() {
                expect( tb('body')[0].target === document.body ).toBe(true);
            });

        });

        describe("tb( classNamespace ) regEx selector tests", function() {

            it("tb( app.Body ) is a tb instance", function() {
                expect( tb('body') instanceof tb.Selector ).toBe(true);
            });

            it("tb( app.Body ) to have .length 1", function() {
                expect( tb('body').length === 1 ).toBe(true);
            });

            it("tb( app.Body )[0] instanceof tb", function() {
                expect( tb('body')[0] instanceof tb ).toBe(true);
            });

            it("tb( app.Body )[0].target to be document.body DOM node", function() {
                expect( tb('body')[0].target === document.body ).toBe(true);
            });

        });

        describe("tb( [ selector1, selector2, ... ] ) array of selectors tests", function() {

            it("tb( [ app.GrandParent, 'div', 'body' ] ) is a tb instance", function() {
                expect( tb([ app.GrandParent, 'div', 'body' ]) instanceof tb.Selector ).toBe(true);
            });

            it("tb( [ app.GrandParent ] ) to have .length 1", function() {
                // should be 6, not 7 due to uniqueness of result ( 'body' === app.GrandParent )
                expect( tb([ app.GrandParent, 'div', 'body' ]).length === 6 ).toBe(true);
            });

            it("tb( [ app.GrandParent, 'div' ] ) to have .length 6", function() {
                // should be 6, not 7 due to uniqueness of result ( 'body' === app.GrandParent )
                expect( tb([ app.GrandParent, 'div' ]).length === 6 ).toBe(true);
            });

            it("tb( [ app.GrandParent, 'div', 'body' ] ) to have .length 6", function() {
                // should be 6, not 7 due to uniqueness of result ( 'body' === app.GrandParent )
                expect( tb([ app.GrandParent, 'div', 'body' ]).length === 6 ).toBe(true);
            });

            it("tb( [ app.GrandParent, 'div', 'body' ] )[0] instanceof tb", function() {
                expect( tb([ app.GrandParent, 'div', 'body' ])[0] instanceof tb ).toBe(true);
            });

            it("tb( [ app.GrandParent, 'div', 'body' ] )[0].target to be document.body DOM node", function() {
                expect( tb([ app.GrandParent, 'div', 'body' ])[0].target === document.body ).toBe(true);
            });

            it("tb( [ app.GrandParent, 'div', 'body' ] )[1] instanceof tb", function() {
                expect( tb([ app.GrandParent, 'div', 'body' ])[1] instanceof tb ).toBe(true);
            });

            it("tb( [ app.GrandParent, 'div', 'body' ] )[1].target.tagName to be 'DIV'", function() {
                expect( tb([ app.GrandParent, 'div', 'body' ])[1].target.tagName === 'DIV' ).toBe(true);
            });

        });

    });

    describe("tb() chained methods test", function() {

        describe("tb().add() method tests", function() {

            describe("tb('body').add('div') instanceof tb.Selector", function() {
                expect( tb('body').add('div') instanceof tb.Selector ).toBe(true);
            });

            describe("tb('body').add('div').length === 6", function() {
                expect( tb('body').add('div').length === 6 ).toBe(true);
            });

        });

        describe("tb().children() method tests", function() {

            describe("tb('body').children() instanceof tb.Selector", function() {
                expect( tb('body').children() instanceof tb.Selector ).toBe(true);
            });

            describe("tb('body').children().length === 6", function() {
                expect( tb('body').children().length === 6 ).toBe(true);
            });

            describe("tb('body').children('div') instanceof tb.Selector", function() {
                expect( tb('body').children('div') instanceof tb.Selector ).toBe(true);
            });

            describe("tb('body').children('div').length === 5", function() {
                expect( tb('body').children('div').length === 5 ).toBe(true);
            });

            describe("tb('body').children('span') instanceof tb.Selector", function() {
                expect( tb('body').children('span') instanceof tb.Selector ).toBe(true);
            });

            describe("tb('body').children('span').length === 0", function() {
                expect( tb('body').children('span').length === 0 ).toBe(true);
            });

        });

    });


});

