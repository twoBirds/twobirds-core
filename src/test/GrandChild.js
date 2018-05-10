test.GrandChild = ( class GrandChild extends Tb{

    constructor( pConfig, pTarget ){
        super( pConfig, pTarget );

        var that = this;

        that.handlers = {
            init: that.init
        };
    }

    // methods
    init(){
        var that = this;

        for ( var x=0; x < 2; x++ ) {
            /*
            new tb(
                'test.GreatGrandChild',
                {},
                that.target.appendChild( document.createElement('span') )
            );
            */
            that.target.appendChild(document.createElement('test-GreatGrandChild'))
        }
    }
});
