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
