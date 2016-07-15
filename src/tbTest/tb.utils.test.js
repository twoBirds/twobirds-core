describe("tb.utils.js", function() {

    describe("twobirds utility functions", function() {

        describe("tb.observable()", function() {

            it("tb.observable() present and typeof 'function'", function() {
                expect( typeof tb.observable === 'function' ).toBe(true);
            });

            describe("observed data is object", function() {

                var o = tb.observable( {} );

                beforeEach(function () {
                    o( { a: 42 } );
                });

                it("observed object get complete object contains key/value a/42", function() {
                    expect( o().a === 42 ).toBe(true);
                });

                it("observed object get value by key", function() {
                    expect( o('a') === 42 ).toBe(true);
                });

                it("observed object replace complete object", function() {
                    o({ b: 24 });
                    expect( o('b') === 24 ).toBe(true);
                    expect( typeof o('a') === 'undefined' ).toBe(true);
                });

                it("observed object replace one key", function() {
                    o( 'a', 24 );
                    expect( o().a === 24 ).toBe(true);
                });

                it("observed object replace a namespace", function() {
                    o( 'b.c', 24 );
                    expect( o().b.c === 24 ).toBe(true);
                });

            });

        });

        describe("tb.namespace()", function() {

            it("tb.namespace() present and typeof 'function'", function() {
                expect( typeof tb.namespace === 'function' ).toBe(true);
            });

        });

        describe("tb.bind()", function() {

            it("tb.bind() present and typeof 'function'", function() {
                expect( typeof tb.bind === 'function' ).toBe(true);
            });

        });

        describe("tb.status {}", function() {

            it("tb.status {} present and typeof 'object'", function() {
                expect( typeof tb.status === 'object' ).toBe(true);
            });

        });

        describe("tb.idle()", function() {

            it("tb.idle() present and typeof 'function'", function() {
                expect( typeof tb.idle === 'function' ).toBe(true);
            });

        });

        describe("tb.getId()", function() {

            it("tb.getId() present and typeof 'function'", function() {
                expect( typeof tb.getId === 'function' ).toBe(true);
            });

        });

        describe("tb.extend()", function() {

            it("tb.extend() present and typeof 'function'", function() {
                expect( typeof tb.extend === 'function' ).toBe(true);
            });

        });

        describe("tb.parse()", function() {

            it("tb.extend() present and typeof 'function'", function() {
                expect( typeof tb.extend === 'function' ).toBe(true);
            });

        });

        describe("tb.request()", function() {

            it("tb.request() present and typeof 'function'", function() {
                expect( typeof tb.request === 'function' ).toBe(true);
            });

        });

    });

});

