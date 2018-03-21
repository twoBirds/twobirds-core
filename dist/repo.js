/*! twobirds-core - v8.0.26 - 2018-03-21 */

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
