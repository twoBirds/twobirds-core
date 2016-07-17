// simple objects...
test.EmbeddedObject1 = function EmbeddedObject1( pConfig ){
};

test.EmbeddedObject1.prototype = {
    namespace: 'test.EmbeddedObject1',
    'test.EmbeddedObject2': {}
};

test.EmbeddedObject2 = function EmbeddedObject2( pConfig ){
    var that = this;

    that.handlers = {
        'init': function( e ){
            that.trigger( 'test', that, 'u');
        }
    }
};

test.EmbeddedObject2.prototype = {
    namespace: 'test.EmbeddedObject2'
};


tb.namespace( 'test.Child').set(
    (function(){

        // Constructor
        function Child( pConfig ){
            var that = this;

            that.handlers = {
                init: init,
                test: test
            };

        }

        // Prototype
        Child.prototype = {
            namespace: 'test.Child',
            'test.EmbeddedObject1': {}
        };

        return Child;

        // Methods
        function init( e ){
            var that = this;

            for ( var i=0; i<3; i++ ){
                new tb(
                    'test.GrandChild',
                    {},
                    that.target.appendChild( document.createElement("span") )
                );
            }
        }

        function test( e ){
            var that = this;

            if ( e.data.namespace === 'test.EmbeddedObject2' ){
                e.stopPropagation();
            }
            //console.info( 'child ::test()' );
        }

    })()    
);
