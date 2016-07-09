// simple objects...
app.EmbeddedObject1 = function EmbeddedObject1( pConfig ){
};

app.EmbeddedObject1.prototype = {
    namespace: 'app.EmbeddedObject1',
    'app.EmbeddedObject2': {}
};

app.EmbeddedObject2 = function EmbeddedObject2( pConfig ){
    var that = this;

    that.handlers = {
        'init': function( e ){
            that.trigger( 'test', that, 'u');
        }
    }
};

app.EmbeddedObject2.prototype = {
    namespace: 'app.EmbeddedObject2'
};


tb.namespace( 'app', true ).Child = (function(){

    // Constructor
    function Child( pConfig ){
        var that = this;

        that.handlers = {
            init,
            test
        };

    }

    // Prototype
    Child.prototype = {
        namespace: 'app.Child',
        'app.EmbeddedObject1': {}
    };

    return Child;

    // Methods
    function init( e ){
        var that = this;

        for ( var i=0; i<3; i++ ){
            new tb(
                'app.GrandChild',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

    function test( e ){
        var that = this;

        if ( e.data.namespace === 'app.EmbeddedObject2' ){
            e.stopPropagation();
        }
        //console.info( 'child ::test()' );
    }

})();
