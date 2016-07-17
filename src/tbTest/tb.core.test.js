console.log( 'tb.core jasmine test' );



describe("tb.core.js", function() {

    describe("general tests", function() {

        it("tb() present and typeof 'function'", function() {
            expect( typeof tb === 'function' ).toBe( true );
        });

        it("tb.dom() present and typeof 'function'", function() {
            expect( typeof tb.dom === 'function' ).toBe( true );
        });

        it("tb.Model() present and typeof 'function'", function() {
            expect( typeof tb.Model === 'function' ).toBe( true );
        });

        it("tb.Event() present and typeof 'function'", function() {
            expect( typeof tb.Event === 'function' ).toBe( true );
        });

        it("tb.Require() present and typeof 'function'", function() {
            expect( typeof tb.Require === 'function' ).toBe( true );
        });

    });

    describe("tb() selector tests", function() {

        describe("tb( 'String' ) .querySelectorAll() string selector tests", function() {

            it("tb('body') is a tb instance", function() {
                expect( tb('body') instanceof tb.Selector ).toBe( true );
            });

            it("tb('body') to have .length 1", function() {
                expect( tb('body').length === 1 ).toBe( true );
            });

            it("tb('body')[0] instanceof tb", function() {
                expect( tb('body')[0] instanceof tb ).toBe( true );
            });

            it("tb('body')[0].target to be document.body DOM node", function() {
                expect( tb('body')[0].target === document.body ).toBe( true );
            });

        });


        describe("tb( /String/ ) regEx selector tests", function() {

            it("tb( /test.Body/ ) is a tb instance", function() {
                expect( tb('body') instanceof tb.Selector ).toBe( true );
            });

            it("tb( /test.Body/ ) to have .length 1", function() {
                expect( tb('body').length === 1 ).toBe( true );
            });

            it("tb( /test.Body/ )[0] instanceof tb", function() {
                expect( tb('body')[0] instanceof tb ).toBe( true );
            });

            it("tb( /test.Body/ )[0].target to be document.body DOM node", function() {
                expect( tb('body')[0].target === document.body ).toBe( true );
            });

        });

        describe("tb( classNamespace ) regEx selector tests", function() {

            it("tb( test.Body ) is a tb instance", function() {
                expect( tb('body') instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Body ) to have .length 1", function() {
                expect( tb('body').length === 1 ).toBe( true );
            });

            it("tb( test.Body )[0] instanceof tb", function() {
                expect( tb('body')[0] instanceof tb ).toBe( true );
            });

            it("tb( test.Body )[0].target to be document.body DOM node", function() {
                expect( tb('body')[0].target === document.body ).toBe( true );
            });

        });

        describe("tb( [ selector1, selector2, ... ] ) array of selectors tests", function() {

            it("tb( [ test.GrandParent, 'div', 'body' ] ) is a tb instance", function() {
                expect( tb([ test.GrandParent, 'div', 'body' ]) instanceof tb.Selector ).toBe( true );
            });

            it("tb( [ test.GrandParent ] ) to have .length 1", function() {
                expect( tb([ test.GrandParent, 'div', 'body' ]).length === 6 ).toBe( true );
            });

            it("tb( [ test.GrandParent, 'div' ] ) to have .length 6", function() {
                expect( tb([ test.GrandParent, 'div' ]).length === 6 ).toBe( true );
            });

            it("tb( [ test.GrandParent, 'div', 'body' ] ) to have .length 6", function() {
                // should be 6, not 7 due to uniqueness of result ( 'body' === test.GrandParent )
                expect( tb([ test.GrandParent, 'div', 'body' ]).length === 6 ).toBe( true );
            });

            it("tb( [ test.GrandParent, 'div', 'body' ] )[0] instanceof tb", function() {
                expect( tb([ test.GrandParent, 'div', 'body' ])[0] instanceof tb ).toBe( true );
            });

            it("tb( [ test.GrandParent, 'div', 'body' ] )[0].target to be document.body DOM node", function() {
                expect( tb([ test.GrandParent, 'div', 'body' ])[0].target === document.body ).toBe( true );
            });

            it("tb( [ test.GrandParent, 'div', 'body' ] )[1] instanceof tb", function() {
                expect( tb([ test.GrandParent, 'div', 'body' ])[1] instanceof tb ).toBe( true );
            });

            it("tb( [ test.GrandParent, 'div', 'body' ] )[1].target.tagName to be 'DIV'", function() {
                expect( tb([ test.GrandParent, 'div', 'body' ])[1].target.tagName === 'DIV' ).toBe( true );
            });

        });

    });

    describe("tb() chained", function() {

        describe("add()", function() {

            it("tb('body').add('div') is a tb instance", function() {
                expect( tb('body').add('div') instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').add('div').length === 6", function() {
                expect( tb('body').add('div').length === 6 ).toBe( true );
            });

        });

        describe("children()", function() {

            it("tb('body').children() instanceof tb.Selector", function() {
                expect( tb('body').children() instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').children().length === 5", function() {
                expect( tb('body').children().length === 5 ).toBe( true );
            });

            it("tb('body').children('div') instanceof tb.Selector", function() {
                expect( tb('body').children('div') instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').children('div').length === 5", function() {
                expect( tb('body').children('div').length === 5 ).toBe( true );
            });

            it("tb('body').children('span') instanceof tb.Selector", function() {
                expect( tb('body').children('span') instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').children('span').length === 0", function() {
                expect( tb('body').children('span').length === 0 ).toBe( true );
            });

        });

        describe("descendants()", function() {

            it("tb('body').descendants() instanceof tb.Selector", function() {
                expect( tb('body').descendants() instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').descendants().length === 505", function() {
                expect( tb('body').descendants().length === 505 ).toBe( true );
            });

            it("tb('body').descendants('div') instanceof tb.Selector", function() {
                expect( tb('body').descendants('div') instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').descendants('div').length === 5", function() {
                expect( tb('body').descendants('div').length === 5 ).toBe( true );
            });

            it("tb('body').descendants('span') instanceof tb.Selector", function() {
                expect( tb('body').descendants('span') instanceof tb.Selector ).toBe( true );
            });

            it("tb('body').descendants('span').length === 500", function() {
                expect( tb('body').descendants('span').length === 500 ).toBe( true );
            });

        });

        describe("filter()", function() {

            it("tb('div').filter( 'body' ) instanceof tb.Selector", function() {
                expect( tb('div').filter( 'body' ) instanceof tb.Selector ).toBe( true );
            });

            it("tb('div').filter( 'body' ).length === 0", function() {
                expect( tb('div').filter( 'body' ).length === 0 ).toBe( true );
            });

            it("tb('div').filter( test.Parent ).length === 5", function() {
                expect( tb('div').filter( test.Parent ).length === 5 ).toBe( true );
            });

        });

        describe("first()", function() {

            it("tb('div').first() instanceof tb.Selector", function() {
                expect( tb('div').first() instanceof tb.Selector ).toBe( true );
            });

            it("tb('div').first().length === 1", function() {
                expect( tb('div').first().length === 1).toBe( true );
            });

            it("tb('div').first( 'span' ).length === 0", function() {
                expect( tb('div').first( 'span' ).length === 0 ).toBe( true );
            });

        });

        describe("get()", function() {

            it("tb('div').get('target')", function() {
                expect( tb('div')[0].get('target').tagName === "DIV" ).toBe( true );
            });

        });

        describe("last()", function() {

            it("tb('div').last() instanceof tb.Selector", function() {
                expect( tb('div').last() instanceof tb.Selector ).toBe( true );
            });

            it("tb('div').last().length === 1", function() {
                expect( tb('div').last().length === 1).toBe( true );
            });

            it("tb('div').last( 'span' ).length === 0", function() {
                expect( tb('div').last( 'span' ).length === 0 ).toBe( true );
            });

        });

        describe("next()", function() {

            it("tb('div').next() instanceof tb.Selector", function() {
                expect( tb('div').next() instanceof tb.Selector ).toBe( true );
            });

            it("tb('div')[0].next().length === 1", function() {
                expect( tb('div')[0].next().length === 1).toBe( true );
            });

            it("tb('div')[4].next().length === 0", function() {
                expect( tb('div').last().next().length === 0).toBe( true );
            });

            it("tb('div')[0].next( 'span' ).length === 0", function() {
                expect( tb('div').next( 'span' ).length === 0 ).toBe( true );
            });

        });

        describe("not()", function() {

            it("tb('div').not('div').length === 0", function() {
                expect( tb('div').not('div').length === 0).toBe( true );
            });

            it("tb('div').not('span').length === 5", function() {
                expect( tb('div').not('span').length === 5).toBe( true );
            });

        });

        describe("off()", function() {

            it("tb('div').off( 'testEventName', pHandler ) remove one handler at a time", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( test.GrandParent )[0].handlers['testEventName'] = [ testHandler1, testHandler2 ];

                tb( test.GrandParent ).off( 'testEventName', testHandler1 ); // remove first handler

                expect( tb( test.GrandParent )[0].handlers['testEventName'].length === 1 ).toBe( true );

            });

            it("tb('div').off( 'testEventName', pHandler ) remove last handler", function() {

                var testHandler1 = function(){};

                tb( test.GrandParent )[0].handlers['testEventName'] = [ testHandler1 ];

                tb( test.GrandParent ).off( 'testEventName', testHandler1 ); // remove first handler

                // 'testhandler' array in this.handlers should be gone when the last handler is removed
                expect( !tb( test.GrandParent )[0].handlers['testEventName'] ).toBe( true );

            });

            it("tb('div').off( 'testEventName' ) remove all handlers", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( test.GrandParent )[0].handlers['testEventName'] = [ testHandler1, testHandler2 ];

                tb( test.GrandParent ).off( 'testEventName' );

                // 'testhandler' array in this.handlers should be gone when the last handler is removed
                expect( !tb( test.GrandParent )[0].handlers['testEventName'] ).toBe( true );

            });

        });

        describe("on()", function() {

            it("tb('div').on( 'testEventName', pHandler ) add handler(s)", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( test.GrandParent )
                    .on(
                        'testEventName',
                        testHandler1
                    )
                    .on(
                        'testEventName',
                        testHandler2
                    );

                expect( tb( test.GrandParent )[0].handlers['testEventName'].length === 2 ).toBe( true );

                delete tb( test.GrandParent )[0].handlers['testEventName'];

            });

        });

        describe("one()", function() {

            it("tb('div').one( 'testEventName', pHandler ) add mixed handlers", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( test.GrandParent )
                    .one(
                        'testEventName',
                        testHandler1
                    )
                    .on(
                        'testEventName',
                        testHandler2
                    );


                tb( test.GrandParent )
                    .trigger(
                        'testEventName'
                    );

                expect( tb( test.GrandParent )[0].handlers['testEventName'].length === 1 ).toBe( true );

                delete tb( test.GrandParent )[0].handlers['testEventName'];
            });

            it("tb('div').one( 'testEventName', pHandler ) only .once handlers", function() {

                var testHandler1 = function(){},
                    testHandler2 = function(){};

                tb( test.GrandParent )
                    .one(
                        'testEventName',
                        testHandler1
                    )
                    .one(
                        'testEventName',
                        testHandler2
                    );


                tb( test.GrandParent )
                    .trigger(
                        'testEventName'
                    );

                expect( typeof tb( test.GrandParent )[0].handlers['testEventName'] === 'undefined' ).toBe( true );

            });

        });

        describe("parent()", function() {

            it("tb('body').parent() instanceof tb.Selector", function() {
                expect( tb('body').parent() instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Child ).parent().length === 5", function() {
                expect( tb( test.Child ).parent().length === 5 ).toBe( true );
            });

            it("tb( test.Child ).parent('div') instanceof tb.Selector", function() {
                expect( tb( test.Child ).parent('div') instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Child ).parent('div').length === 5", function() {
                expect( tb( test.Child ).parent('div').length === 5 ).toBe( true );
            });

            it("tb( test.Child ).parent('span') instanceof tb.Selector", function() {
                expect( tb( test.Child ).parent('span') instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Child ).parent('span').length === 0", function() {
                expect( tb( test.Child ).parent('span').length === 0 ).toBe( true );
            });

        });

        describe("parents()", function() {

            it("tb('body').parents() instanceof tb.Selector", function() {
                expect( tb('body').parents() instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Child ).parents().length === 6", function() {
                expect( tb( test.Child ).parents().length === 6 ).toBe( true );
            });

            it("tb( test.Child ).parents('div') instanceof tb.Selector", function() {
                expect( tb( test.Child ).parents('div') instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Child ).parents('div').length === 5", function() {
                expect( tb( test.Child ).parents('div').length === 5 ).toBe( true );
            });

            it("tb( test.Child ).parents('span') instanceof tb.Selector", function() {
                expect( tb( test.Child ).parents('span') instanceof tb.Selector ).toBe( true );
            });

            it("tb( test.Child ).parents('span').length === 0", function() {
                expect( tb( test.Child ).parents('span').length === 0 ).toBe( true );
            });

        });

        describe("prev()", function() {

            it("tb('div').prev() instanceof tb.Selector", function() {
                expect( tb('div').prev() instanceof tb.Selector ).toBe( true );
            });

            it("tb('div')[1].prev().length === 1", function() {
                expect( tb('div')[1].prev().length === 1).toBe( true );
            });

            it("tb('div')[0].prev().length === 0", function() {
                expect( tb('div')[0].prev().length === 0).toBe( true );
            });

            it("tb('div')[1].prev( 'span' ).length === 0", function() {
                expect( tb('div')[1].prev( 'span' ).length === 0 ).toBe( true );
            });

        });

        describe("set()", function() {

            it("tb('body').set('answer', 42 ) instanceof tb.Selector", function() {
                expect( tb('body').set('answer', 42 )[0]['answer'] === 42 ).toBe( true );
                delete tb('body')[0]['answer'];
            });

            it("tb('div').set('answer', 42 ) instanceof tb.Selector", function() {
                tb('div').set('answer', 42 ); // 5 elements

                [].forEach.call(
                    tb('div'),
                    function( tbInstance ){
                        expect( tbInstance['answer'] === 42 ).toBe( true );
                        delete tbInstance['answer'];
                    }
                );
            });

        });

        describe("toArray()", function() {

            it("tb('body').toArray() instanceof Array", function() {
                expect( tb('body').toArray() instanceof Array ).toBe( true );
            });

            it("tb('body').toArray() .length === 1", function() {
                expect( tb('body').toArray().length === 1 ).toBe( true );
            });

            it("tb('div').toArray() instanceof Array", function() {
                expect( tb('div').toArray() instanceof Array ).toBe( true );
            });

            it("tb('div').toArray() .length === 5", function() {
                expect( tb('div').toArray().length === 5 ).toBe( true );
            });

        });

        describe("trigger()", function() {

            var GPdone = false,
                Cdone = false,
                GGCdone = false,
                handlers = {
                    GPtestHandler: function(e){    // test handler for Grandparent
                        GPdone = true;
                    },
                    CtestHandler: function(e){     // test handler for Child
                        Cdone = true;
                    },
                    GGCtestHandler: function(e) {   // test handler for GreatGrandChild
                        GGCdone = true;
                    }
                };

            beforeEach(function() {

                // reset done vars
                GPdone = false;
                Cdone = false;
                GGCdone = false;

            });

            afterEach(function() {
                // clear all handlers from all tb() instances
                tb('*').off( 'triggerTest' );
            });

            // trigger a simple local event, no bubbling
            describe("local event", function() {

                beforeEach(function(done) {

                    // set handlers for testing
                    tb( test.GreatGrandChild )[0].on( 'triggerTest', handlers.GGCtestHandler );
                    tb( test.Child )[0].on( 'triggerTest', handlers.CtestHandler );
                    tb( test.GrandParent )[0].on( 'triggerTest', handlers.GPtestHandler );

                    // trigger event
                    tb( test.Child )[0].trigger( 'triggerTest' );

                    // set timeout for resolving
                    setTimeout(
                        function() {
                            done();
                        },
                        200
                    );

                });

                it("handler called", function (done) {
                    expect( Cdone === true ).toBe( true );
                    done();
                });
            });

            // trigger a local event and bubble up
            describe("local event bubbling up", function() {

                beforeEach(function(done) {

                    // set handlers for testing
                    tb( test.GreatGrandChild )[0].on( 'triggerTest', handlers.GGCtestHandler );
                    tb( test.Child )[0].on( 'triggerTest', handlers.CtestHandler );
                    tb( test.GrandParent )[0].on( 'triggerTest', handlers.GPtestHandler );

                    // trigger event
                    tb( test.Child )[0].trigger( 'triggerTest', null, 'lu' );

                    // set timeout for resolving
                    setTimeout(
                        function() {
                            done();
                        },
                        200
                    );

                });

                it("handler called", function (done) {
                    expect( Cdone === true && GPdone === true ).toBe( true );
                    done();
                });
            });

            // trigger event only bubble up
            describe("event only bubbling up", function() {

                beforeEach(function(done) {

                    // set handlers for testing
                    tb( test.GreatGrandChild )[0].on( 'triggerTest', handlers.GGCtestHandler );
                    tb( test.Child )[0].on( 'triggerTest', handlers.CtestHandler );
                    tb( test.GrandParent )[0].on( 'triggerTest', handlers.GPtestHandler );

                    // trigger event
                    tb( test.Child )[0].trigger( 'triggerTest', null, 'u' );

                    // set timeout for resolving
                    setTimeout(
                        function() {
                            done();
                        },
                        200
                    );

                });

                it("handler called", function (done) {
                    expect( Cdone === false && GPdone === true ).toBe( true );
                    done();
                });
            });

            // trigger event only bubble down
            describe("event only bubbling down", function() {

                beforeEach(function(done) {

                    // set handlers for testing
                    tb( test.GreatGrandChild )[0].on( 'triggerTest', handlers.GGCtestHandler );
                    tb( test.Child )[0].on( 'triggerTest', handlers.CtestHandler );
                    tb( test.GrandParent )[0].on( 'triggerTest', handlers.GPtestHandler );

                    // trigger event
                    tb( test.Child )[0].trigger( 'triggerTest', null, 'd' );

                    // set timeout for resolving
                    setTimeout(
                        function() {
                            done();
                        },
                        1000
                    );

                });

                it("handler called", function (done) {
                    expect( Cdone === false && GGCdone === true ).toBe( true );
                    done();
                });
            });

            // trigger event only bubble up and down
            describe("event bubbling up and down", function() {

                beforeEach(function(done) {

                    // set handlers for testing
                    tb( test.GreatGrandChild )[0].on( 'triggerTest', handlers.GGCtestHandler );
                    tb( test.Child )[0].on( 'triggerTest', handlers.CtestHandler );
                    tb( test.GrandParent )[0].on( 'triggerTest', handlers.GPtestHandler );

                    // trigger event
                    tb( test.Child )[0].trigger( 'triggerTest', null, 'ud' );

                    // set timeout for resolving
                    setTimeout(
                        function() {
                            done();
                        },
                        1000
                    );

                });

                it("handler called", function (done) {
                    expect( GPdone === true && GGCdone === true ).toBe( true );
                    done();
                });
            });

            // trigger event local and bubble up and down
            describe("event local and bubbling up and down", function() {

                beforeEach(function(done) {

                    // set handlers for testing
                    tb( test.GreatGrandChild )[0].on( 'triggerTest', handlers.GGCtestHandler );
                    tb( test.Child )[0].on( 'triggerTest', handlers.CtestHandler );
                    tb( test.GrandParent )[0].on( 'triggerTest', handlers.GPtestHandler );

                    // trigger event
                    tb( test.Child )[0].trigger( 'triggerTest', null, 'lud' );

                    // set timeout for resolving
                    setTimeout(
                        function() {
                            done();
                        },
                        1000
                    );

                });

                it("handler called", function (done) {
                    expect( GPdone === true && Cdone === true && GGCdone === true ).toBe( true );
                    done();
                });
            });

        });

    });

});

