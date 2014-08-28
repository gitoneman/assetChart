require([
	"zrender",
	"config",
	"asset",
	"center",
	"util",
	"zrender/config"
	],function(zrender,Config,Asset,Center,util,zconfig){
	
	var main = {
		init:function(){
			var w = this;

			w.canvas = document.querySelector("#main");
			w.info = document.querySelector("#info");


			w.zr = zrender.init(w.canvas);
			w.origin = {
				x:w.zr.getWidth()/2,
				y:w.zr.getHeight()/2
			}
			w.assetList = [];
			w.subAssetList = [];

			w.initEvent();
			w.initHTML();

		},
		initHTML:function(){
			var w = this;

			w.center = new Center(Config.centerOption);

			w.getData();
		},
		initEvent:function(){
			var w = this;

			w.zr.on(zconfig.EVENT.CLICK,function(params){
				w.clickHandle(params);
			})

		},
		getData:function(){
			var w  = this;

			//TODO ajax
			//
			var data = Config.genData();

			window.setInterval(function(){
				w.buildAsset(Config.genData());
			},10000);

			w.buildAsset(data);
		},
		buildAsset:function(data){
			var w = this;
			w.assetList = [];
			w.subAssetList = [];

			for (var i = data.length - 1; i >= 0; i--) {
				var asset = new Asset({
					zr:w.zr,
					origin:w.origin,
					assetOption:w.clone(Config.groupOption)					
				});
				asset.setData(data[i]);
				w.assetList.push(asset);

				var item = data[i].item;
				if(item.length){
					for (var j = item.length - 1; j >= 0; j--) {
						var subAsset = new Asset({
							zr:w.zr,
							origin:w.origin,
							assetOption:w.clone(Config.assetOption)
						});
						subAsset.setData(item[j]);
						asset.subAsset.addChild(subAsset);
						w.subAssetList.push(subAsset);
					};
				}	
			};
			w.paint();
		},
		paint:function(){
			var w = this;
			var length = w.assetList.length;

			w.zr.clear();
			for (var i = length - 1; i >= 0; i--) {
				var obj = w.assetList[i];
				var x = w.origin.x + Config.r*Math.cos(2*Math.PI*i/length)
				var y = w.origin.y + Config.r*Math.sin(2*Math.PI*i/length)
				var o = {
					xStart:x,
					yStart:y,
					xEnd:w.origin.x,
					yEnd:w.origin.y
				}

				//画布中添加资产并改变位置
				w.zr.addShape(obj.group);
				obj.initEvent();
				obj.modify("circle",{
					style:{
						x:x,
						y:y
					}
				}).showEl().placeLine(o).animate(o).setAngel(2*Math.PI*i/length);

			};

			//添加中心资产
			w.zr.addShape(w.center.el);	
			w.center.modify(w.zr,{
				style:{
					x:w.origin.x,
					y:w.origin.y
				}
			});

			w.zr.render();
			
		},
		clickHandle:function(params){
			var w = this;
			var target = params.target;
			
			if(!target){
				return;
			}
			var asset = w.findAssetById(target.id);
			if(asset.hasChildren()){
				target.clicked = !target.clicked;			
				asset.show();
				for (var i = w.assetList.length - 1; i >= 0; i--) {
					var obj = w.assetList[i];
					if(obj.el.id != target.id){
						obj.el.clicked = false;
						target.clicked ? obj.hide(w.zr):obj.show(w.zr);
					}
				};
				w.zr.refresh();
			}else{
				var data = asset.getData();
				for(var i in data){
					var ele = document.querySelector(".J_" + i);
					ele && (ele.innerHTML = data[i]);
					
				}
			}
		},
		findAssetById:function(id){
			var w = this;

			for (var i = w.assetList.length - 1; i >= 0; i--) {
				var obj = w.assetList[i];
				if(obj.el.id == id){
					return obj;
				}
			};
			for (var i = w.subAssetList.length - 1; i >= 0; i--) {
				var obj = w.subAssetList[i];
				if(obj.el.id == id){
					return obj;
				}
			};
			return null;
		},
		clone:function(source,target){
			var w = this;
			var target = target || {};

			for(var i in source){
				if(source.hasOwnProperty(i)){
					if(Object.prototype.toString.call(source[i]) == "[object Object]"){
						target[i] = {};
						w.clone(source[i],target[i])
					}else{
						target[i] = source[i];
					}				
				}
			}
			return target;
		},
		typeof:function(value){
			var w = this;
			var type = Object.prototype.toString.call(value);

			if(value === null){
				return null;
			}
			switch(type){
				case "[object Number]":
					type = "Number";
					break;
				case "[object String]":
					type = "String";
					break;
				case "[object Undefined]":
					type = "Undefined";
					break;
				case "[object Boolean]":
					type = "Boolean";
					break;
				case "[object Object]":
					type = "Object";
					break;
				case "[object Array]":
					type = "Array";
					break;
				case "[object Function]":
					type = "Function";
					break;
			}
			return type;
		}
	}
	main.init();
})