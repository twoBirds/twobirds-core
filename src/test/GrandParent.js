test.GrandParent = ( class GrandParent extends Tb{

    constructor( pConfig, pTarget ){

        super( pConfig, pTarget );

        var that = this;

        that.handlers = {
            init: that.init,
            test: that.test
        };

        // implicit: create stores
        // simply by access of non-existing properties
        that.a;
        that.b;

    }

    // methods
    init(){
        var that = this;

        $( that.target ).hide();

        that.b.c.d.e = 5;

        for ( var x=0; x < 5; x++ ) {
            new tb(
                'test.Parent',
                {},
                that.target.insertBefore( document.createElement('div'), $('img', that.target)[0] )
            );
        }

        that.on('ready', function(ev){ 
            $( that.target ).show();
        }, true);

    }

    test( ev ){
        //console.info( ' grandParent:test() reached' );
    }

});
