define(function(require){

	function genData(){
		var root = {};
		root.item = [];

		for (var i = Math.floor(Math.random()*20); i >= 0; i--) {
			root.item.push({
				eps:Math.floor(Math.random()*10000),
				name:"asset-" + i,
				work:Math.floor(Math.random()*15),
				alarm:Math.floor(Math.random()*15),
				item:[] 
			});
		};

		for (var j = root.item.length -1; j >= 0; j--) {
			var obj = root.item[j];
			obj.item = [];

			for (var k = Math.floor(Math.random()*10); k >= 0; k--) {
				obj.item.push({
					eps:Math.floor(Math.random()*10000),
					name:"SubAsset-" + k,
					work:Math.floor(Math.random()*15),
					alarm:Math.floor(Math.random()*15),
				});
			};
		};

		return root.item;
	}
	return {
		"R":400,
		"r":260,
		"max":8000,
		"min":4000,
		"centerOption":{
			style : {
	            r : 50,
	            shadowColor : 'rgb(52,179,242)',
	            color : 'rgba(135, 206, 250, 0.8)',
	            shadowBlur : 3,
	            shadowOffsetX : 0,
	            shadowOffsetY : 0
	        },
	        zlevel:5
		},
		"assetOption":{
			"circle":{
				style : {
		            r : 20,
		            shadowColor : 'rgb(52,179,242)',
		            color : 'rgba(135, 206, 250, 0.8)',
		            shadowBlur : 3,
		            shadowOffsetX : 0,
		            shadowOffsetY : 0
		        },
		        clickable:true,
		        zlevel:5
			},
			"line":{
				style : {
			        strokeColor : 'rgba(135, 206, 250, 0.8)',   // == color
			        lineWidth : 2,
			        lineCap : 'round',
			        lineType : 'solid',
			    },
			    zlevel:4
			},
			"drop":{
				style:{
                    r : 2,
                    shadowColor : 'rgba(135, 206, 250, 0.8)',
                    color : '#fff',
                    shadowBlur : 10,
                    shadowOffsetX : 0,
                    shadowOffsetY : 0
				},
				zlevel:6
			}
		},
		"groupOption":{
			"circle":{
				style : {
		            r : 30,
		            shadowColor : 'rgb(52,179,242)',
		            color : 'rgba(135, 206, 250, 0.8)',
		            shadowBlur : 3,
		            shadowOffsetX : 0,
		            shadowOffsetY : 0
		        },
		        clickable:true,
		        zlevel:5,
		        draggable:true,
			},
			"line":{
				style : {
			        strokeColor : 'rgba(135, 206, 250, 0.8)',   // == color
			        shadowColor : 'rgba(135, 206, 250, 0.8)',
			        lineWidth : 2,
			        lineCap : 'round',
			        lineType : 'solid',
			    },
			    zlevel:4
			},
			"drop":{
				style:{
                    r : 2,
                    shadowColor : 'rgba(135, 206, 250, 0.8)',
                    color : '#fff',
                    shadowBlur : 10,
                    shadowOffsetX : 0,
                    shadowOffsetY : 0
				},
				zlevel:6
			}
		},
		"layer":{
            motionBlur : true,
            lastFrameAlpha : 0.8
        },
        "nLayer":6,
		"genData":genData,

	}
});