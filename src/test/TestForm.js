test.TestForm = ( class TestForm extends Tb{

    constructor(){
        super();

        let that = this;

        that.handlers = {
            init: that.init
        };

        that.formValues = tb.extend( {}, $('form').values() ); 
    }

    // methods
    init(){
        // bind formValues to DOM -> updates DOM on change
        this.formValues.bind( this.target );

        // bind form input changes to formValues
        $('form').values().bind( this.formValues );
    }
});
