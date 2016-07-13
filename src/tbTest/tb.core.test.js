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

    });

});

