console.log( 'tb.core jasmine test' );



describe("twobirds-core", function() {

    describe("general", function() {

        describe("tb()", function() {

            it("tb() present and typeof 'function'", function() {
                expect( typeof tb === 'function' ).toBe(true);
            });

        });

        it("tb.Selector() present and typeof 'function'", function() {
            expect( typeof tb.Selector === 'function' ).toBe(true);
        });

        describe("tb.dom()", function() {

            it("tb.dom() present and typeof 'function'", function() {
                expect( typeof tb.dom === 'function' ).toBe(true);
            });

        });

        describe("tb.Event()", function() {

            it("tb.Event() present and typeof 'function'", function() {
                expect( typeof tb.Event === 'function' ).toBe(true);
            });

        });

        describe("tb.Require()", function() {

            it("tb.Require() present and typeof 'function'", function() {
                expect( typeof tb.Require === 'function' ).toBe(true);
            });

        });

    });

    describe("utils", function() {

        describe("tb.observable()", function() {

            it("tb.observable() present and typeof 'function'", function() {
                expect( typeof tb.observable === 'function' ).toBe(true);
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

