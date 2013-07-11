var map,E_layer,dataE,lay;
var mov=[];
function init() {
if(typeof L == 'undefined') { setTimeout("init()",200); return; }
//window.L_DISABLE_3D = true;
$('#map').css('height', $('#footer').position().top-$('#map').position().top);
 map = new L.Map('map', {
		//center: new L.LatLng(0,0/*51.505, -0.09*/,nowrap), 
		//zoom: 2,
		crs:L.CRS.EPSG3857 //L.CRS.EPSG4326 //L.CRS.EPSG3857
		//,closePopupOnClick:false
		,worldCopyJump:true
		//,inertia:true
		//,maxBounds:[[-90,-180],[90,180]]
	});
	console.log( typeof map +'  '+map);
	
	map.setView([0, 0], 2);
	layers(2);
	
	map.on('dragend', function(event) {
		var bounds=map.getBounds();
	//	var rect = L.rectangle(bounds, {color: 'blue', weight: 1}).addTo(map);

		for (var j0 in mov) { mov[j0].mark.setLatLng(mov[j0].origlatlng); }
		delete mov;
		var def=0;
		if(bounds._southWest.lng <= -180) def=-360;
		else if(bounds._northEast.lng >= 180) def=360;
		for (var j in dataE) {
			var z=bounds.contains([dataE[j].geometry.coordinates[1],dataE[j].geometry.coordinates[0]]);
			if(!z) {
				if(typeof dataE[j].marker != 'undefined') { 
					mov.push({mark:dataE[j].marker,origlatlng:dataE[j].marker.getLatLng()}); 
					dataE[j].marker.setLatLng(new L.LatLng(dataE[j].marker._latlng.lat,(dataE[j].marker._latlng.lng+def))); 
					//if(dataE[j].id==323326) console.log('['+dataE[j].marker._latlng.lat+','+(dataE[j].marker._latlng.lng+def)+']');
				} 
			}
		}
		
		//map.fitBounds(map.getBounds());
	});
	
}
function layers(n) { 
	var tileUrl=[{url:'http://mtile0{s}.mqcdn.com/tiles/1.0.0/vy/sat/{z}/{x}/{y}.png',attr: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a><img src="http://developer.mapquest.com/content/osm/mq_logo.png"/>',sub:[1,2,3,4],shema:'xyz'} /**/
				,{url:'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg', attr:'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a><img src="http://developer.mapquest.com/content/osm/mq_logo.png"/>',sub:[1,2,3,4],shema:'xyz'}
				,{url:'http://static{s}.emsc-csem.org/Images/TMS/{z}/{x}/{y}.png',attr: 'Map data © EMSC',sub:[1,2,3],shema:'xyz'}
				];
	if(typeof E_layer!='undefined') map.removeLayer(E_layer);
	
	E_layer=new L.tileLayer( tileUrl[n].url, {
			maxZoom: 9, minZoom:1,
			attribution: tileUrl[n].attr,
			subdomains: tileUrl[n].sub,  //subdomains: [1,2,3,4],
			scheme: tileUrl[n].shema   //'xyz' //'tms'
			,continuousWorld: false
	});
	E_layer.addTo(map);
}	

function loadData() {
	dataE=app.getGeoJson(); 
	lay=L.geoJson(dataE, {
		pointToLayer: function (feature, latlng) {
			var marker=L.circleMarker(latlng, feature.geojsonMarkerOptions); 
			feature.marker=marker;
			return marker;
		},
		filter: function(feature, layer) {
				var mag=feature.properties.mag; 
				return true;
		},
		
		onEachFeature: function (feature, layer) {
			if (feature.properties && feature.properties.popupContent) {
				layer.bindPopup(feature.properties.popupContent); 
			}
		}
	
	}).addTo(map);
}

try {
if(typeof map == 'undefined') init(); 
//loadData();
}
catch(e) {console.log('error '+e.emssage); }
