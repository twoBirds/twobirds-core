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

    describe("tb() chained", function() {

        describe("add()", function() {

            it("tb('body').add('div') is a tb instance", function() {
                expect( tb('body').add('div') instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').add('div').length === 6", function() {
                expect( tb('body').add('div').length === 6 ).toBe(true);
            });

        });

        describe("children()", function() {

            it("tb('body').children() instanceof tb.Selector", function() {
                expect( tb('body').children() instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').children().length === 5", function() {
                expect( tb('body').children().length === 5 ).toBe(true);
            });

            it("tb('body').children('div') instanceof tb.Selector", function() {
                expect( tb('body').children('div') instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').children('div').length === 5", function() {
                expect( tb('body').children('div').length === 5 ).toBe(true);
            });

            it("tb('body').children('span') instanceof tb.Selector", function() {
                expect( tb('body').children('span') instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').children('span').length === 0", function() {
                expect( tb('body').children('span').length === 0 ).toBe(true);
            });

        });

        describe("descendants()", function() {

            it("tb('body').descendants() instanceof tb.Selector", function() {
                expect( tb('body').descendants() instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').descendants().length === 505", function() {
                expect( tb('body').descendants().length === 505 ).toBe(true);
            });

            it("tb('body').descendants('div') instanceof tb.Selector", function() {
                expect( tb('body').descendants('div') instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').descendants('div').length === 5", function() {
                expect( tb('body').descendants('div').length === 5 ).toBe(true);
            });

            it("tb('body').descendants('span') instanceof tb.Selector", function() {
                expect( tb('body').descendants('span') instanceof tb.Selector ).toBe(true);
            });

            it("tb('body').descendants('span').length === 500", function() {
                expect( tb('body').descendants('span').length === 500 ).toBe(true);
            });

        });

        describe("filter()", function() {

            it("tb('div').filter( 'body' ) instanceof tb.Selector", function() {
                expect( tb('div').filter( 'body' ) instanceof tb.Selector ).toBe(true);
            });

            it("tb('div').filter( 'body' ).length === 0", function() {
                expect( tb('div').filter( 'body' ).length === 0 ).toBe(true);
            });

            it("tb('div').filter( app.Parent ).length === 5", function() {
                expect( tb('div').filter( app.Parent ).length === 5 ).toBe(true);
            });

        });

        describe("first()", function() {

            it("tb('div').first() instanceof tb.Selector", function() {
                expect( tb('div').first() instanceof tb.Selector ).toBe(true);
            });

            it("tb('div').first().length === 1", function() {
                expect( tb('div').first().length === 1).toBe(true);
            });

            it("tb('div').first( 'span' ).length === 0", function() {
                expect( tb('div').first( 'span' ).length === 0 ).toBe(true);
            });

        });

        describe("get()", function() {

            it("tb('div').get('target')", function() {
                expect( tb('div')[0].get('target').tagName === "DIV" ).toBe(true);
            });

        });

        describe("last()", function() {

            it("tb('div').last() instanceof tb.Selector", function() {
                expect( tb('div').last() instanceof tb.Selector ).toBe(true);
            });

            it("tb('div').last().length === 1", function() {
                expect( tb('div').last().length === 1).toBe(true);
            });

            it("tb('div').last( 'span' ).length === 0", function() {
                expect( tb('div').last( 'span' ).length === 0 ).toBe(true);
            });

        });

        describe("next()", function() {

            it("tb('div').next() instanceof tb.Selector", function() {
                expect( tb('div').next() instanceof tb.Selector ).toBe(true);
            });

            it("tb('div')[0].next().length === 1", function() {
                expect( tb('div')[0].next().length === 1).toBe(true);
            });

            it("tb('div')[4].next().length === 0", function() {
                expect( tb('div').last().next().length === 0).toBe(true);
            });

            it("tb('div')[0].next( 'span' ).length === 0", function() {
                expect( tb('div').next( 'span' ).length === 0 ).toBe(true);
            });

        });

        describe("not()", function() {

            it("tb('div').not('div').length === 0", function() {
                expect( tb('div').not('div').length === 0).toBe(true);
            });

            it("tb('div').not('span').length === 5", function() {
                expect( tb('div').not('span').length === 5).toBe(true);
            });

        });

        describe("off()", function() {

            it("tb('div').off( 'testEventName', pHandler ) remove one handler at a time", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( app.GrandParent )[0].handlers['testEventName'] = [ testHandler1, testHandler2 ];

                tb( app.GrandParent ).off( 'testEventName', testHandler1 ); // remove first handler

                expect( tb( app.GrandParent )[0].handlers['testEventName'].length === 1 ).toBe(true);

            });

            it("tb('div').off( 'testEventName', pHandler ) remove last handler", function() {

                var testHandler1 = function(){};

                tb( app.GrandParent )[0].handlers['testEventName'] = [ testHandler1 ];

                tb( app.GrandParent ).off( 'testEventName', testHandler1 ); // remove first handler

                // 'testhandler' array in this.handlers should be gone when the last handler is removed
                expect( !tb( app.GrandParent )[0].handlers['testEventName'] ).toBe(true);

            });

            it("tb('div').off( 'testEventName' ) remove all handlers", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( app.GrandParent )[0].handlers['testEventName'] = [ testHandler1, testHandler2 ];

                tb( app.GrandParent ).off( 'testEventName' );

                // 'testhandler' array in this.handlers should be gone when the last handler is removed
                expect( !tb( app.GrandParent )[0].handlers['testEventName'] ).toBe(true);

            });

        });

        describe("on()", function() {

            it("tb('div').on( 'testEventName', pHandler ) add handler(s)", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( app.GrandParent )
                    .on(
                        'testEventName',
                        testHandler1
                    )
                    .on(
                        'testEventName',
                        testHandler2
                    );

                expect( tb( app.GrandParent )[0].handlers['testEventName'].length === 2 ).toBe(true);

                delete tb( app.GrandParent )[0].handlers['testEventName'];

            });

        });

        describe("one()", function() {

            it("tb('div').one( 'testEventName', pHandler ) add mixed handlers", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( app.GrandParent )
                    .one(
                        'testEventName',
                        testHandler1
                    )
                    .on(
                        'testEventName',
                        testHandler2
                    );


                tb( app.GrandParent )
                    .trigger(
                        'testEventName'
                    );

                expect( tb( app.GrandParent )[0].handlers['testEventName'].length === 1 ).toBe(true);

                delete tb( app.GrandParent )[0].handlers['testEventName'];
            });

            it("tb('div').one( 'testEventName', pHandler ) only .once handlers", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( app.GrandParent )
                    .one(
                        'testEventName',
                        testHandler1
                    )
                    .one(
                        'testEventName',
                        testHandler2
                    );


                tb( app.GrandParent )
                    .trigger(
                        'testEventName'
                    );

                console.log(tb( app.GrandParent )[0].handlers);
                expect( typeof tb( app.GrandParent )[0].handlers['testEventName'] === 'undefined' ).toBe(true);

            });

        });

    });

});

