tb.namespace( 'test.GrandParent' ).set(
    (function(){
        
        function GrandParent(pConfig) {
            var that = this;

            that.handlers = {
                init: init,
                test: test
            };
        }

        // proto properties and methods
        GrandParent.prototype = {
            namespace: 'test.GrandParent',

            'tb.Require': [
                '/test/GrandParent.css'
            ],

            test: test
        };

        return GrandParent;

        // private methods
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
