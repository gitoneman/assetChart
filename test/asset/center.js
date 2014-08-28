define([
	"config",
	"zrender",
	"zrender/shape/Circle"
	],function(config,zrender,CircleShape){

	function center(options){

		this.init.call(this,options)
	}
	center.prototype = {

		init:function(options){
			var w = this;
			w.options = options;

			w.initHTML();
		},
		initHTML:function(){
			var w = this;

			w.el = new CircleShape(w.options);
		},
		modify:function(zr,o){
			var w = this;
			zr.modShape(w.el.id,o);
			return w;
		}
	}

	return center;
});