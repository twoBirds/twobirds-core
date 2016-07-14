tb.namespace( 'test', true ).GrandChild = (function(){

    // Constructor
    function GrandChild( pConfig ){
        var that = this;

        that.handlers = {
            init
        };

    }

    // Prototype
    GrandChild.prototype = {
        namespace: 'test.GrandChild',

        'tb.Require': [ // predictive load to avoid tb.loader stress
            '/test/GreatGrandChild.js'
        ]
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

})();
