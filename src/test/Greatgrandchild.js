test.Greatgrandchild = class extends Tb{

    constructor(){
        super();

        var that = this;

        that.handlers = {
            init: that.init,
            connected: that.connected,
            disconnected: that.disconnected,
            attributeChanged: that.attributeChanged,
            adopted: that.adopted
        };

    }

    // methods
    init(){

        var that = this;

        that.updateStyle();

        //that.trigger( 'test', that, 'u' );
    }

    updateStyle(){

        var that = this;

        function random(min,max) {
            var random = Math.floor(Math.random()*(max-min+1)+min);
            return random;
        }

        function randomBorderColor(){
            return 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
        }

        $(that.target).attr('style', 'border-color:'+randomBorderColor() );

    }

    connected(){

        var that = this;

        //console.log('connected', that.target);
    }

    disconnected(){

        var that = this;

        //console.log('disconnected', that.target);
    }

    attributeChanged(ev){

        var that = this;

        console.log('attributeChanged', ev.data);
    }

    adopted(){

        var that = this;

        //console.log('adopted', that.target);
    }

};
