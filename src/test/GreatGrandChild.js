tb.namespace( 'test.GreatGrandChild' ).set(
    (function(){

        // Constructor
        function GreatGrandChild( pConfig ){
            var that = this;

            that.handlers = {
                init: init
            };

        }

        // Prototype
        GreatGrandChild.prototype = {
            namespace: 'test.GreatGrandChild'
        };

        return GreatGrandChild;

        // Methods
        function init( e ){
            var that = this;

            //that.trigger( 'test', that, 'u' );
        }

    })()
);
