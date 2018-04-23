test.GreatGrandChild = ( class GreatGrandChild extends Tb{

    constructor( pConfig, pTarget ){
        super( pConfig, pTarget );

        var that = this;

        that.handlers = {
            init: that.init
        };
    }

    // methods
    init( e ){
        var that = this;

        //that.trigger( 'test', that, 'u' );
    }
});
