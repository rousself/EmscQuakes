
function getExtSettings() {
	var set=app._storage.getItem(app._saveSettingsLabel);
	if((typeof(set)=='string') && (set!='')) { return JSON.parse(set);}
	else {	return  '';	}	
}

function saveExtSettings(csettings) {
	app._storage.setItem(app._saveSettingsLabel,JSON.stringify(csettings));  app.loadStoredSettings();
}
function loadOptions() {
	setTimeout('loadOptions_suite()',300); 
}
function loadOptions_suite() { 
	var settings=getExtSettings();
	if(typeof(settings)!='object') return;
	document.getElementById("screenAlert").checked=eval(settings.screenAlert); document.getElementById("ShakeAlert").checked=eval(settings.shakeAlert); document.getElementById("AudioAlert").checked=eval(settings.audioAlert); 
	document.getElementById("ShakeMagMin").value=eval(settings.shakeAlertMag); document.getElementById("AudioMagMin").value=eval(settings.audioAlertMag);
	document.getElementById("MagMin").value=eval(settings.min_mag);	
	document.getElementById("timer").value=eval(settings.timers);	
	
	var myselect=document.getElementById("screenPos");
	for (var i=0; i<myselect.options.length; i++){
		if (myselect.options[i].value==settings.notPos){ myselect.options[i].selected="1"; break; }
	}
}	

function save_options() {
	var csettings={};
	csettings.screenAlert=document.getElementById("screenAlert").checked; 	csettings.shakeAlert=document.getElementById("ShakeAlert").checked; 
	csettings.audioAlert=document.getElementById("AudioAlert").checked;   	csettings.shakeAlertMag=parseInt(document.getElementById("ShakeMagMin").value); 
	csettings.audioAlertMag=parseInt(document.getElementById("AudioMagMin").value);
	csettings.min_mag=parseInt(document.getElementById("MagMin").value);
	csettings.timers=parseInt(document.getElementById("timer").value);

	var myselect=document.getElementById("screenPos");
	for (var i=0; i<myselect.options.length; i++){
		if (myselect.options[i].selected==true){ csettings.notPos=myselect.options[i].value; break;}
	}
	
	saveExtSettings(csettings);
	
}

function playAudioTest() {
	app.alertAudio({mag:4.5,region:'CENTRAL ITALY',ago:4});
	//var music=new AudioAlert(({mag:4.5,region:'CENTRAL ITALY',ago:4}); music.play();
}

function ShakeTest() { 
	var mag=parseInt(document.getElementById("ShakeMagTest").value);
	app.alertShake(mag);
}


//$(document).ready(function() {
	//$('#savebt').click(function() { save_options(); return false;});
	$('#playaudio').click( function() { playAudioTest(); return false; });
	$('#shaketest').click( function() { ShakeTest(); return false;});
	$('#Esetting').bind('hideIt', function() { console.log('hide'); save_options(); });
	loadOptions();
	/*MyAnalytics();*/ //gaTrack('options.html');
	
 //});

