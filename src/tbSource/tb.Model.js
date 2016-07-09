/**
 @class tb.Model
 @constructor

 @param {object} pConfig - config parameter, usually an object @todo param description

 @return {object} - the model instance

 tb.Model constructor
 - create and return a simple CRUD model a "data" observable

 @example

     // templates crud model
     that.templatesModel = new tb.Model({
                'read': {
                    url: 'demoapp/configuration/mock/demoapp-configuration-templates.json', // mock data
                    method: 'GET',
                    type: 'json',
                    params: {
                    },
                    success: function( pResult ){
                        that.templatesModel.data( JSON.parse( pResult.text ).data );
                    },
                    error: function( pResult ){
                        console.log( 'an error occured', pResult );
                    }
                }
            });

     // ... and later:

     // when template list data has been read, render
     that.templatesModel.data.observe( function templateModelDataChanged(){
                that.trigger( 'render' );
            });

     // read data
     that.templatesModel.read();

 @example

     // default config mixin -> result will be in that.config
     tb.extend(
     that.config,
     {   // default settings, reference only
         'create': {
             url: '',
             method: 'POST',
             success: function( pResult ){
                 that.data( pResult );
             }
         },
         'read': {
             url: '',
             method: 'GET',
             success: function( pResult ){
                 that.data( pResult );
             }
         },
         'update': {
             url: '',
             method: 'PUT',
             success: function( pResult ){
                 that.data( pResult );
             }
         },
         'delete': {
             url: '',
             method: 'DELETE',
             success: function( pResult ){
                 that.data( pResult );
             }
         }
     },
     pConfig
     );

 */
tb.Model = function ( pConfig ) {
    var that = this;

    // result element
    that.data = tb.observable( {} );
    that.config = {};

    // default config mixin -> result will be in that.config
    tb.extend(
        that.config,
        {   // default settings, reference only
            'create': {
                url: '',
                method: 'POST',
                success: function( pResult ){
                    that.data( pResult );
                }
            },
            'read': {
                url: '',
                method: 'GET',
                success: function( pResult ){
                    that.data( pResult );
                }
            },
            'update': {
                url: '',
                method: 'PUT',
                success: function( pResult ){
                    that.data( pResult );
                }
            },
            'delete': {
                url: '',
                method: 'DELETE',
                success: function( pResult ){
                    that.data( pResult );
                }
            }
        },
        pConfig
    );

};

tb.Model.prototype = (function(){
    // private

    // create get parameter string
    function makeGetParameterString( pParameterObject ){

        var result='';

        Object
            .keys( pParameterObject )
            .forEach(
                function( key ) {
                    result += ( !!result ? '&' : '' ) + key + '=' + pParameterObject[key];
                }
            );

        return result;
    }

    return {

        /**
         @method create

         @param {object} [pParameters] - any combination of parameters

         .create() method

         */
        'create': function( pParams ){
            var o = tb.extend( {}, this.config.create );

            if ( !o.url ){
                console.error( 'no create url given!');
                return;
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: pParams ? tb.parse( this.config.create.url, pParams ) : this.config.create.url
                    },
                    {
                        params: pParams
                    }
                )
            );

        },

        /**
         @method read

         @param {object} [pParameters] - any combination of parameters

         .read() method

         */
        'read': function( pParams ){

            var o = tb.extend( {}, this.config.read );

            if ( !o.url ){
                console.error( 'no read url given!');
                return;
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: pParams ? tb.parse( this.config.read.url, pParams ) : this.config.read.url
                    },
                    {
                        params: pParams
                    }
                )
            );

        },

        /**
         @method update

         @param {object} [pParameters] - any combination of parameters

         .update() method

         */
        'update': function( pParams ){
            var o = tb.extend( {}, this.config.update );

            if ( !o.url ){
                console.error( 'no update url given!');
                return;
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: pParams ? tb.parse( this.config.update.url, pParams ) : this.config.update.url
                    },
                    {
                        params: pParams
                    }
                )
            );

        },

        /**
         @method delete

         @param {object} [pParameters] - any combination of parameters

         .delete() method

         */
        'delete': function( pParams ){
            var o = tb.extend( {}, this.config['delete'] );

            if ( !o.url ){
                console.error( 'no delete url given!');
                return;
            }

            tb.request(
                tb.extend(
                    o,
                    { // if params given, use microparse to fill them in url
                        url: pParams ? tb.parse( this.config.delete.url, pParams ) : this.config.delete.url
                    },
                    {
                        params: pParams
                    }
                )
            );

        }

    };

})();
