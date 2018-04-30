/*! twobirds-core - v8.1.10 - 2018-04-30 */

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

        that.b = {};
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

        // when all children have run their inits
        that.on(
            'ready', 
            function(ev){ 
                $( that.target ).show();
            }, 
            true
        );

    }

    test( ev ){
        //console.info( ' grandParent:test() reached' );
    }

});


test.TestForm = ( class TestForm extends Tb{

    constructor(){
        super();

        var that = this;

        // model to read data from
        that.crud = new tb.CRUD({
            'read': {
                url: '/test/TestForm.json', // mock data
                method: 'GET',
                success: function( pResult ){
                    var values = JSON.parse( pResult.text );
                    $('form').values( values ); // set form input values
                    that.formValues = values; // set values for two way binding
                },
                error: function( pResult ){
                    console.log( 'an error occured', pResult );
                }
            }
        });

        tb.require([
            '/test/TestForm.html',
            '/test/TestForm.css'
        ]).then(
            that.render.bind(that)
        );

    }

    // methods
    render(){

        var that = this,
            fragment = $( tb.require.get('/test/TestForm.html') );

        // add fragment to DOM
        $( that.target )
            .append( fragment )
            .clean();

        /*
        data flow:
        - form -> that.formValues -> DOM
        - that.crud read() -> form 
        */

        // create formValues store
        that.formValues = {};

        // update DOM on formValues change
        that.formValues.bind( that.target );

        // update formValues store when form content is changed
        $('form').values().bind( that.formValues );

        // read data
        that.crud.read();

    }
});


test.Parent = ( class Parent extends Tb{

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

        for ( var x=0; x < 10; x++ ) {
            new tb(
                'test.Child',
                {},
                that.target.appendChild( document.createElement('span') )
            );
        }
    }
});


// simple internal classes...
test.Embedded1 = ( class Embedded1 extends Tb{ 
    constructor(){
        super();
        var that = this;
        that.embedded2 = new test.Embedded2();
    }
});

test.Embedded2 = ( class Embedded2 extends Tb{ 
    constructor(){
        super();

        var that = this;

        that.handlers = {
            'init': function( e ){
                var that = this;
                //that.trigger( 'test', that, 'u');
            }
        }

    }
});

test.Child = ( class Child extends Tb{

    constructor( pConfig, pTarget ){
        super( pConfig, pTarget );

        var that = this;

        that.handlers = {
            init: that.init,
            test: that.test
        };

        that.embedded1 = new test.Embedded1();
    }

    // methods
    init(){
        var that = this;

        for ( var x=0; x < 3; x++ ) {
            new tb(
                'test.GrandChild',
                {},
                that.target.appendChild( document.createElement('span') )
            );
        }
    }

    test( e ){
        var that = this;
        if ( e.data instanceof test.Embedded2 ){
            e.stopPropagation();
        }
        //console.info( 'child ::test() reached' );
    }

});


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
            new tb(
                'test.GreatGrandChild',
                {},
                that.target.appendChild( document.createElement('span') )
            );
        }
    }
});


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
