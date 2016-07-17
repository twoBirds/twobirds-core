tb.namespace( 'test.GrandChild' ).set(
    (function(){

        // Constructor
        function GrandChild( pConfig ){
            var that = this;

            that.handlers = {
                init: init
            };

        }

        // Prototype
        GrandChild.prototype = {
            namespace: 'test.GrandChild'
        };

        return GrandChild;

        // Methods
        function init( e ){
            var that = this;

            for ( var i=0; i<2; i++ ){
                new tb(
                    'test.GreatGrandChild',
                    {},
                    that.target.appendChild( document.createElement("span") )
                );
            }
        }

    })()    
);
