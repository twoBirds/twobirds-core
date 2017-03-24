tb.namespace( 'test.Parent' ).set(
    (function(){

        // Constructor
        function Parent( pConfig ){
            var that = this;

            that.handlers = {
                init: init
            };

        }

        // Prototype
        Parent.prototype = {
            namespace: 'test.Parent',

            

        };

        return Parent;

        // Methods
        function init(){
            var that = this;

            for ( var i=0; i<10; i++ ){
                new tb(
                    'test.Child',
                    {},
                    that.target.appendChild( document.createElement("span") )
                );
            }
        }

    })()
);
