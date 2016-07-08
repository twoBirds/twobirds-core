tb.namespace( 'app', true ).GrandChild = (function(){

    // Constructor
    function GrandChild( pConfig ){
        var that = this;

        that.handlers = {
            init
        };

    }

    // Prototype
    GrandChild.prototype = {
        namespace: 'app.GrandChild',

        'tb.require': [
            '/app/GreatGrandChild.js'
        ]
    };

    return GrandChild;

    // Methods
    function init( e ){
        var that = this;

        for ( var i=0; i<2; i++ ){
            new tb(
                'app.GreatGrandChild',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

})();
