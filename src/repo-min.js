var test={},app={},$=tb.dom;tb.assumeTb(!0),test.GrandParent=class extends Tb{constructor(t,e){super(t,e);this.handlers={init:this.init,test:this.test},this.b={}}init(){var t=this;$(t.target).hide(),t.b.c.d.e=5;for(var e=0;e<5;e++)new tb("test.Parent",{},t.target.insertBefore(document.createElement("div"),$("img",t.target)[0]));t.on("ready",function(e){$(t.target).show()},!0)}test(t){}},test.TestForm=class extends Tb{constructor(){super();var t=this;t.crud=new tb.CRUD({read:{url:"/test/TestForm.json",method:"GET",success:function(e){var s=JSON.parse(e.text);$("form").values(s),t.formValues=s},error:function(t){console.log("an error occured",t)}}}),tb.require(["/test/TestForm.html","/test/TestForm.css"]).then(t.render.bind(t))}render(){var t=$(tb.require.get("/test/TestForm.html"));$(this.target).append(t).clean(),this.formValues={},this.formValues.bind(this.target),$("form").values().bind(this.formValues),this.crud.read()}},test.Parent=class extends Tb{constructor(t,e){super(t,e);this.handlers={init:this.init}}init(){for(var t=0;t<10;t++)new tb("test.Child",{},this.target.appendChild(document.createElement("span")))}},test.Embedded1=class extends Tb{constructor(){super();this.embedded2=new test.Embedded2}},test.Embedded2=class extends Tb{constructor(){super();this.handlers={init:function(t){}}}},test.Child=class extends Tb{constructor(t,e){super(t,e);this.handlers={init:this.init,test:this.test},this.embedded1=new test.Embedded1}init(){for(var t=0;t<3;t++)new tb("test.GrandChild",{},this.target.appendChild(document.createElement("span")))}test(t){t.data instanceof test.Embedded2&&t.stopPropagation()}},test.GrandChild=class extends Tb{constructor(t,e){super(t,e);this.handlers={init:this.init}}init(){for(var t=0;t<2;t++)this.target.appendChild(document.createElement("test-GreatGrandChild"))}},test.GreatGrandChild=class extends Tb{constructor(){super();this.handlers={init:this.init}}static get namespace(){return"test.GreatGrandChild"}init(){this.updateStyle()}updateStyle(){function t(t,e){return Math.floor(Math.random()*(e-t+1)+t)}$(this.target).attr("style","border-color:rgb("+t(0,255)+","+t(0,255)+","+t(0,255)+")")}},function(){customElements.define("test-greatgrandchild",class extends HTMLElement{constructor(){super()}connectedCallback(){new tb(test.GreatGrandChild,{},this)}})}();