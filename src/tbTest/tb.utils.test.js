describe("tb.utils.js", function() {

    describe("twobirds utility functions", function() {

        describe("tb.observable()", function() {

            it("tb.observable() present and typeof 'function'", function() {
                expect( typeof tb.observable === 'function' ).toBe(true);
            });

            describe("observed data simple data", function() {

                var o = tb.observable( '' );

                beforeEach(function () {
                    o( '' );
                });

                it("observed object get value", function() {
                    expect( o() === '' ).toBe(true);
                });

                it("observed object set numeric value", function() {
                    o(2);
                    expect( o() === 2 ).toBe(true);
                });

                it("observed object set string value", function() {
                    o('string');
                    expect( o() === 'string' ).toBe(true);
                });

                it("observed object set object value", function() {
                    o({});
                    expect( o() instanceof Object ).toBe(true);
                });

                it("observed object set array value", function() {
                    o([]);
                    expect( o() instanceof Array ).toBe(true);
                });

            });

            describe("observed data is object", function() {

                var o = tb.observable( {} );

                beforeEach(function () {
                    o( { a: 42 } );
                });

                it("observed object get complete object", function() {
                    expect( o().a === 42 ).toBe(true);
                });

                it("observed object replace complete object", function() {
                    o({ b: 24 });
                    expect( o('b') === 24 ).toBe(true);
                    expect( typeof o('a') === 'undefined' ).toBe(true);
                });

                it("observed object get value by key", function() {
                    expect( o('a') === 42 ).toBe(true);
                });

                it("observed object set value by key", function() {
                    o( 'a', 24 );
                    expect( o('a') === 24 ).toBe(true);
                });

                it("observed object set a namespace", function() {
                    o( 'd.e', 12 );
                    expect( o().d.e === 12 ).toBe(true);
                });

                it("observed object get a namespace", function() {
                    o( 'd.e', 6 );
                    expect( o('d.e') === 6 ).toBe(true);
                });

            });

        });

        describe("tb.namespace()", function() {

            it("present and typeof 'function'", function() {
                expect( typeof tb.namespace === 'function' ).toBe(true);
            });

            describe("variants", function() {

                var o = {};

                beforeEach(function () {
                    o = { a: 42, b:{ c: 99 } };
                });

                it("namespace object get simple property", function() {
                    expect( tb.namespace('a', o).get() === 42 ).toBe(true);
                });

                it("namespace object set simple property", function() {
                    tb.namespace('b', o).set({ c: 24 });
                    expect( tb.namespace('b.c', o).get() === 24 ).toBe(true);
                });

                it("namespace object get a namespace", function() {
                    expect( tb.namespace( 'b.c', o ).get() === 99 ).toBe(true);
                });

                it("namespace object set a namespace", function() {
                    tb.namespace( 'd.e', o ).set( 12 );
                    expect( tb.namespace('d.e', o ).get() === 12 ).toBe(true);
                });

            });

        });

        describe("tb.bind()", function() {

            it("tb.bind() present and typeof 'function'", function() {
                expect( typeof tb.bind === 'function' ).toBe(true);
            });

            afterEach(function() {
                tb.dom( 'body > .test-grandchild' ).remove();
            });

            describe("on boot", function() {

                var o = {};

                beforeEach(function () {
                    o = { a: 42, b:{ c: 99 } };
                });

                it("you wouldnt be here if it wouldnt work", function() {
                    expect( true ).toBe(true);
                });

            });

            describe("on demand", function() {

                it("add a tb instance to DOM *without* selector in .bind() call", function() {
                    var d = document.createElement( 'div' );

                    d.setAttribute('data-tb', 'test.GrandChild');

                    document.body.appendChild( d );

                    tb.bind();

                    expect( !!tb('body').children().last()[0].target.tb === true ).toBe(true);
                    expect( tb('body').children().last()[0].target.tb['test.GrandChild'] instanceof test.GrandChild ).toBe(true);
                });

                it("add a tb instance to DOM *with* selector in .bind() call", function() {
                    var d = document.createElement( 'div' );

                    d.setAttribute('data-tb', 'test.GrandChild');

                    document.body.appendChild( d );

                    tb.bind( document.body.lastElementChild );

                    expect( !!tb('body').children().last()[0].target.tb === true ).toBe(true);
                    expect( tb('body').children().last()[0].target.tb['test.GrandChild'] instanceof test.GrandChild ).toBe(true);
                });

                it("add several tb instances to DOM *without* selector in .bind() call", function() {
                    var d1 = document.createElement( 'div' ),
                        d2 = document.createElement( 'div' );

                    d1.setAttribute('data-tb', 'test.GrandChild');
                    d2.setAttribute('data-tb', 'test.GrandChild');

                    document.body.appendChild( d1 );
                    document.body.appendChild( d2 );

                    tb.bind();

                    expect( tb('body').children().last()[0].target.tb['test.GrandChild'] instanceof test.GrandChild ).toBe(true);
                    expect( tb('body').children().last().prev()[0].target.tb['test.GrandChild'] instanceof test.GrandChild ).toBe(true);
                });

            });

        });

        describe("tb.status {}", function() {

            it("tb.status present and typeof 'object'", function() {
                expect( typeof tb.status === 'object' ).toBe(true);
            });

            it("tb.status.loadCount present and typeof 'function'", function() {
                expect( typeof tb.status.loadCount === 'function' ).toBe(true);
            });

        });

        describe("tb.idle()", function() {

            it("tb.idle() present and typeof 'function'", function() {
                expect( typeof tb.idle === 'function' ).toBe(true);
            });

            it("you wouldnt be here if it wouldnt work, since it is needed to boot the test page", function() {
                expect( true ).toBe(true);
            });

        });

        describe("tb.getId()", function() {

            it("tb.getId() present and typeof 'function'", function() {
                expect( typeof tb.getId === 'function' ).toBe(true);
            });

            it("returns string result", function() {
                expect( typeof tb.getId() === 'string' ).toBe(true);
            });

        });

        describe("tb.extend()", function() {

            var o1 = {},
                o2 = { a: 1 },
                o3 = { b: 1 };

            beforeEach(function(){
                o1 = {};
            });

            it("tb.extend() present and typeof 'function'", function() {
                expect( typeof tb.extend === 'function' ).toBe(true);
            });

            it("return to be first parameter object", function() {
                var t = tb.extend( o1, o2 );
                expect( t === o1 ).toBe(true);
            });

            it("result object to be extended", function() {
                var t = tb.extend( o1, o2 );
                expect( o1.a === 1 ).toBe(true);
            });

            it("test for multiple objects", function() {
                var t = tb.extend( o1, o2, o3 );
                expect( o1.a === 1 ).toBe(true);
                expect( o1.b === 1 ).toBe(true);
            });

        });

        describe("tb.parse()", function() {

            it("tb.parse() present and typeof 'function'", function() {
                expect( typeof tb.parse === 'function' ).toBe(true);
            });

        });

        describe("tb.request()", function() {

            it("tb.request() present and typeof 'function'", function() {
                expect( typeof tb.request === 'function' ).toBe(true);
            });

        });

    });

});

