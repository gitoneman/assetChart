define([
	"config",
	"zrender",
	"zrender/shape/Circle",
	"zrender/shape/Line",
	"zrender/shape/Group",
	"zrender/tool/event"
	],
	function(Config,zrender,CircleShape,Line,Group,Event){

	function asset(options){
		this.init.call(this,options)
	}

	asset.prototype = {
		init:function(options){
			var w = this;
			w.options = options;
			w.zr = options.zr;
			w.origin = options.origin;

			w.initHTML();
		},
		initHTML:function(){
			var w = this;

			w.group = new Group();
			w.subAsset = new Group();

			w.el = new CircleShape(w.options.assetOption.circle);
			w.line = new Line(w.options.assetOption.line);	
			w.drop = new CircleShape(w.options.assetOption.drop);

			w.group.addChild(w.drop)		
			w.group.addChild(w.el);
			w.group.addChild(w.line);
			
		},
		initEvent:function(){
			var w = this;
			var zr = w.zr;

			zr.modShape(w.el.id,{
				ondragend:function(params){
					w.update(params);
				}
			})
		},
		showEl:function(){
			var w = this;
			var zr = w.zr;

			var style = w.styleByLevel();
			zr.modShape(w.el.id,style);			
			return w;
		},
		placeLine:function(o){
			var w = this;
			var zr = w.zr;

			var style = w.styleByLevel();
			zr.modShape(w.line.id,style);
			
			zr.modShape(w.line.id,{
				style:{
					xStart : o.xStart,
			        yStart : o.yStart,
			        xEnd : o.xEnd,
			        yEnd : o.yEnd,
				}
			})

			return w;
		},
		animate:function(o){
			var w = this;
			var zr = w.zr;

			
			var style = w.styleByLevel();
			zr.modShape(w.drop.id,style);
			zr.modShape(w.drop.id,{
				style:{
					color:"#fff",
					x : o.xStart,
			        y : o.yStart,
				}				
			})
			var deferred = zr.animate(w.drop.id, "style", true);

			deferred.when(0, {
            	x:o.xStart,
            	y:o.yStart
            }).when(10000,{
            	x:o.xEnd,
            	y:o.yEnd
            }).start();

            zr.modLayer(Config.nLayer, Config.layer);

            return w;
		},
		hide:function(zr){
			var w = this;
			var zr = w.zr;

			w.changeOpacity("0.06");
			w.hideSubAsset();
		},
		show:function(){
			var w = this;
			var zr = w.zr;

			//高亮点击资产
			w.changeOpacity("1");
			if(w.el.clicked){
				w.changeOpacity("0.5")
			}	
			w.showSubAsset();						
		},
		changeOpacity:function(value){
			var w = this;
			var zr = w.zr;

			zr.modShape(w.el.id,{
				style:{
					opacity:value
				}
			}).modShape(w.line.id,{
				style:{
					opacity:value
				}
			}).modShape(w.drop.id,{
				style:{
					opacity:value
				}
			})
		},
		modify:function(type,o){
			var w = this;
			zr = w.zr;

			switch(type){
				case "circle":
					zr.modShape(w.el.id,o);
					break;
				case "line":
					zr.modShape(w.line.id,o);
					break;
				case "drop":
					zr.modShape(w.drop.id,o);
					break;
			}

			return w;
		},
		setAngel:function(value){
			var w = this;

			w.angel = value;
			return w;
		},
		setData:function(data){
			var w = this;

			w.data = data;
		},
		getData:function(){
			var w = this;
			return w.data;
		},
		showSubAsset:function(){
			var w = this;
			var children = w.subAsset._children;
			var length = children.length;
			var zr = w.zr;
			var per = Math.PI/14;
			var start = w.angel - Math.floor(length/2)*per;

			for (var i = length - 1; i >= 0; i--) {
				var child = children[i];
				var x = w.origin.x + Config.R*Math.cos(start + i*per);
				var y = w.origin.y + Config.R*Math.sin(start + i*per);

				var o = {
					xStart:x,
					yStart:y,
					xEnd:w.origin.x,
					yEnd:w.origin.y
				}

				zr.addGroup(child.group);
				child.modify("circle",{
					style:{
						x:x,
						y:y
					}
				}).showEl().placeLine(o).animate(o);
			};		
		},
		hideSubAsset:function(){
			var w = this;
			var children = w.subAsset._children;
			var length = children.length;
			var zr = w.zr;

			for (var i = length - 1; i >= 0; i--) {
				var child = children[i];

				zr.delGroup(child.group)
			}
		},
		hasChildren:function(){
			var w = this;

			return w.subAsset._children.length > 0;
		},
		update:function(params){
			var w = this;
			var zr = w.zr;
			var event = params.event;
			var x = Event.getX(event);
			var y = Event.getY(event);

			var o = {
				xStart:x,
				yStart:y,
				xEnd:w.origin.x,
				yEnd:w.origin.y
			}

			w.placeLine(o).animate(o);
			zr.refresh();
		},
		styleByLevel:function(){
			var w = this;
			var eps = w.data.eps;
			var style = {};

			if(eps < Config.min){
				style = {
					strokeColor:"rgba(135, 206, 250, 0.8)",
					color:"rgba(135, 206, 250, 0.8)",
					shadowColor:"rgb(52,179,242)"
				};
			}else if(eps > Config.max){
				style = {
					strokeColor:"#f00",
					color:"#f00",
					shadowColor:"#f00"
				};
			}else{
				style = {
					strokeColor:"#2ECC71",
					color:"#2ECC71",
					shadowColor:"#2ECC71"
				};
			}
			
			// switch(eps){
			// 	case eps < Config.min:
			// 		style = {
			// 			strokeColor:"rgba(135, 206, 250, 0.8)",
			// 			color:"rgba(135, 206, 250, 0.8)",
			// 			shadowColor:"rgb(52,179,242)"
			// 		};
			// 		break;
			// 	case eps <= Config.max && eps >= Config.min:
			// 		style = {
			// 			strokeColor:"#2ECC71",
			// 			color:"#2ECC71",
			// 			shadowColor:"#2ECC71"
			// 		};
			// 		break;
			// 	case eps > Config.max:
			// 		style = {
			// 			strokeColor:"#f00",
			// 			color:"#f00",
			// 			shadowColor:"#f00"
			// 		};
			// 		break;
			// }

			return {
				style:style
			}
		}
	}

	return asset;
	
});