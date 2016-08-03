tb.namespace( 'test.GrandParent' ).set(
    (function(){

        // Constructor
        function GrandParent(){
            var that = this;

            that.handlers = {
                init: init,
                test: test
            };

        }

        // Prototype
        GrandParent.prototype = {

            namespace: 'test.GrandParent',

            'tb.Require': [
                '/test/GrandParent.css' // only to test whether double loading is avoided
            ]
        };

        return GrandParent;

        // Private Methods
        function init(){
            var that = this;

            for ( var x=0; x < 5; x++ ) {
                new tb(
                    'test.Parent',
                    {},
                    that.target.appendChild( document.createElement("div") )
                );
            }
        }

        function test( e ){
            var that = this;

            //console.info( ' grandParent ::test()' );
        }

    })()
);
