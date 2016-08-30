tb.namespace( 'test.GrandParent' ).set(
    (function(){
        
        class GrandParent {

            constructor(pConfig) {
                var that = this;

                that.handlers = {
                    init,
                    test
                };
            }

            // static

            // prototype

        }

        // proto properties and methods
        tb.extend(
            GrandParent.prototype,
            {
                namespace: 'test.GrandParent',

                'tb.Require': [
                    '/test/GrandParent.css'
                ],

                test: test
            }
        );

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
