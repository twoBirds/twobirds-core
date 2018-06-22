app.Mist = class Mist extends Tb{

    constructor(){
        super();

        let that = this;

        that.handlers = {
            init: that.init
        };

    }

    get template(){ return `
        <p>app-mist test template</p>`;
    }

    // omitted if autonomous custom element 
    get namespace(){
        return 'app.Mist';
    }

    // methods
    init(){

        let that = this;

        $(that.target)
            .append( $(that.template.trim()) )
            .clean();

    }

};
