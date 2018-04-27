test.TestForm = ( class TestForm extends Tb{

    constructor(){
        super();

        tb.require([
            '/test/TestForm.html',
            '/test/TestForm.css'
        ]).then(
            this.render.bind(this)
        );
    }

    // methods
    render(){

        var fragment = $( tb.require.get('/test/TestForm.html') );

        // add fragment to DOM
        $( this.target )
            .append( fragment )
            .clean();

        // create formValues store
        this.formValues = tb.extend( {}, $('form').values() ); // set initial values from DOM inputs...

        // update DOM on formValues change
        this.formValues.bind( this.target );

        // update formValues store when form content is changed
        $('form').values().bind( this.formValues );
    }
});
