test.TestForm = ( class TestForm extends Tb{

    constructor(){
        super();

        let that = this;

        tb.require([
            '/test/TestForm.html'
        ]).then(
            that.render.bind(that)
        );

    }

    // methods
    render(){

        var fragment = $( tb.require.get('/test/TestForm.html') ).clean();

        // add fragment to DOM
        $( this.target ).append( fragment );

        // formValues store
        this.formValues = tb.extend( {}, $('form').values() ); 

        // bind formValues to DOM -> updates DOM on formValues change
        this.formValues.bind( this.target );

        // bind form input changes to formValues
        $('form').values().bind( this.formValues );
    }
});
