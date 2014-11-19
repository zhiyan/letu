#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

var androidRes = [
	{
    "icons/icon-96.png":"drawable/icon.png"
	},
	{
    "icons/icon-72.png":"drawable-hdpi/icon.png"
	},
	{
    "icons/icon-36.png":"drawable-ldpi/icon.png"
	},
	{
    "icons/icon-48.png":"drawable-mdpi/icon.png"
	},
	{
    "icons/icon-96.png":"drawable-xhdpi/icon.png"
	},
	{
    "splash/800x480.png":"drawable-land-hdpi/screen.png"
	},
	{
    "splash/320x200.png":"drawable-land-ldpi/screen.png"
	},
	{
    "splash/480x320.png":"drawable-land-mdpi/screen.png"
	},
	{
    "splash/1280x720.png":"drawable-land-xhdpi/screen.png"
	},
	{
    "splash/480x800.png":"drawable-port-hdpi/screen.png"
	},
	{
    "splash/200x320.png":"drawable-port-ldpi/screen.png"
	},
	{
    "splash/640x960@0.5x.png":"drawable-port-mdpi/screen.png"
	},
	{
    "splash/720x1280.png":"drawable-port-xhdpi/screen.png"
	}
];

var iosRes = [
	{
		"640x1136.png":"Default-568h@2x~iphone.png"
	},
	{
		"1024x768@2x.png":"Default-Landscape@2x~ipad.png"
	},
	{
		"1024x768.png":"Default-Landscape~ipad.png"
	},
	{
		"768x1024@2x.png":"Default-Portrait@2x~ipad.png"
	},
	{
		"768x1024@1x.png":"Default-Portrait~ipad.png"
	},
	{
		"640x960.png":"Default@2x~iphone.png"
	},
	{
		"640x960@0.5x.png":"Default~iphone.png"
	}
];

if( process.env.CORDOVA_PLATFORMS === "ios" ){
	//splash
	iosRes.forEach(function(obj) {
			Object.keys(obj).forEach(function(key) {
					var val = obj[key];
					var srcfile = path.join(rootdir, "res/splash", key);
					var destfile = path.join(rootdir, "platforms/ios/乐途帮/Resources/splash", val);
					var destdir = path.dirname(destfile);
					if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
							fs.createReadStream(srcfile).pipe(
								fs.createWriteStream(destfile));
					}
			});
	});
	// icons
	fs.readdir( path.join(rootdir, "res/icons"), function( err, paths ){
			paths.forEach(function( filename ){
				var srcfile = path.join(rootdir, "res/icons", filename);
				var destfile = path.join(rootdir, "platforms/ios/乐途帮/Resources/icons", filename);
				var destdir = path.dirname(destfile);
				if (fs.existsSync(srcfile) && fs.existsSync(destdir) && path.extname(filename) === ".png" ) {
						fs.createReadStream(srcfile).pipe(
							fs.createWriteStream(destfile));
				}
			})
	});
}else if( process.env.CORDOVA_PLATFORMS === "android" ){
// android
	androidRes.forEach(function(obj) {
			Object.keys(obj).forEach(function(key) {
					var val = obj[key];
					var srcfile = path.join(rootdir, "res", key);
					var destfile = path.join(rootdir, "platforms/android/res", val);
					var destdir = path.dirname(destfile);
					if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
							fs.createReadStream(srcfile).pipe(
								fs.createWriteStream(destfile));
					}
			});
	});
}
