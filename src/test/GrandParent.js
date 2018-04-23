// globals
var test = new Tb(),    // repo
    $ = tb.dom;         // jQuery like selector

test.GrandParent = ( class GrandParent extends Tb{

    constructor( pConfig, pTarget ){

        super( pConfig, pTarget );

        var that = this;

        that.handlers = {
            init: that.init,
            test: that.test
        };

        // implicit: create stores
        // simply by access of non-existent properties
        that.a;
        that.b;

    }

    // methods
    init(){
        var that = this;

        that.a.observe(function(v){
            console.log('a changed',v);
        }, true); // true = once

        that.b.observe(function(v){
            console.log('b changed',v);
        }, true); // true = once

        that.b.c.d.e = 5;

        for ( var x=0; x < 5; x++ ) {
            new tb(
                'test.Parent',
                {},
                that.target.insertBefore( document.createElement('div'), $('img', that.target)[0] )
            );
        }

    }

    test( e ){
        var that = this;

        //console.info( ' grandParent:test() reached' );
    }

});
