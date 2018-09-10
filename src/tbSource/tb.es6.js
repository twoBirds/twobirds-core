class Tb extends tb{

    constructor(){

        super();

        var that = this,
            observable = Symbol('observable'),
            onChange = Symbol('onChange');
        
        // make anonymous property
        that[observable] = tb.observable(false);

        // must be debounced for looped property changes like
        // ... tb.extend( store, $('form').values() );
        that[onChange] = tb.debounce(
            function(){
                this[observable]( tb.extend( {}, this ) );
            },
            0
        );

    }

}
