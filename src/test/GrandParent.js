var test = new Tb();

test.GrandParent = ( class GrandParent extends Tb{

    constructor( pConfig, pTarget ){

        super( pConfig, pTarget );

        var that = this;

        that.handlers = {
            init: that.init,
            test: that.test
        };

        that.storeTest = {};
        that.storeTest2 = [];

        that.observe( function(v){ console.log('GrandParent changed:', v) } );
    }

    // methods
    init(){
        var that = this;

        for ( var x=0; x < 5; x++ ) {
            new tb(
                'test.Parent',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

    test( e ){
        var that = this;

        //console.info( ' grandParent ::test()' );
    }

});

