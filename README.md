#Steps to create a Visual Studio 2015 + TypeScript + Cordova + Angular2 project: 

//TODO: Format the layout
 
Software to Use

Visual Studio 2015
	Windows and Web Development > Microsoft Web Developer Tools
	HTML/JavaScript (Apache Cordova)
 


Visual Studio > Extension and Updates
Web Essentials 2015
Open Command Line
Add New File

Update Apache Cordova
	Npm install –g cordova

Update folder Res images.  Res images contains icons and splash screens for resolution specific devices.

Update the config.xml 
	The images are missing from the default res > icon > windows folder.
<icon src="res/icons/windows/Square44x44Logo.scale-100.png" width="44" height="44" />
<icon src="res/icons/windows/Square71x71Logo.scale-100.png" width="71" height="71" />
Update Typescript to latest version
	Download typescript for Visual Studio 2015
	http://www.microsoft.com/en-us/download/details.aspx?id=48593
	Click the details button to reveal a list of all version.  Download the appropriate version
	Manual Process
C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5\tsc
npm install -g typescript
npm install -g typescript@next
tsc –version
where tsc
Other things to confirm are installed:
	Android SDK Manager
	Java JDK is installed and using 64bit version. Ie C:\Program Files\Java\jdk1.8.0_60
	Tools > Options > Tools for Apache Cordova
 

1.	Create a blank TypeScript Cordova Project.
Add Git version control if necessary.
TortoisGit > Settings > Remote > add Origin. Git Commit, Push to add git changes.
2.	Remove Project_Readme.html
3.	Update Cordova-Android to latest version.  Instructions on how to do it.
add to config.xml <engine name="android" spec="4.1.0" />
Use these instructions to install globally
http://cordova.apache.org/announcements/2015/07/21/cordova-android-4.1.0.html 
If the project is published, before updating the config.xml then you’ll need to use the command prompt to upgrade the cordova-android version.  Use this:
`cordova platform remove android`
4.	Update config.xml
a.	Update Minimum SDK Version to 14.  This is because we’re using cordova-android 4.1.0.
b.	Update the package name.  Package name should be domain name in reverse.  Io.gihub.dbiele
5.	Add Gulp(gulpfile.js). Change package.json devdependencies to include gulp.
6.	Change Cordova CLI to 5.1.1. in config.xml .  Confirm taco.json has been updated. Taco is using for IOS building and the remote agent uses the CLI version defined in the taco.json.
7.	Confirm tsconfig.json exists in scripts > typings
a.	Compile with AMD.  Make sure this is set in the tsconfig.json file.  Add "module": "amd"
8.	Make sure to show all files in the solution explorer. Show all files.
Add Cordova Plugins
9.	Crosswalk
Add Cordova CrossWalk plugin. Config.xml > plugins > Crosswalk Webview.  Note, if there’s a problem installing the apk to the device, delete the previous installs on the device.
10.	Cordova-plugin-whitelist
Add the “cordova-plugin-whitelist” to dependencies in config.xml. Whitelist is a core cordova plugin.  Or use NPM to download the files and install locally.
https://www.npmjs.com/package/cordova-plugin-whitelist
11.	Other Popular Plugins
a.	Cordova-plugin-console
b.	Cordova-plugin-device
c.	Cordova-plugin-inappbrowser
d.	Cordova-plugin-dialogs
e.	Cordova-plugin-splashscreen
f.	Cordova-plugin-statusbar
Update Security for Cordova
12.	Cordova Security: Add external domains to config.xml Domain Access
a.	Make sure access origin  = * 
b.	Or remove * and add the names of the domains. https://*.jspm.io and https://*.angularjs.org. This is used for the index.html script tags
13.	Update www/index.html
a.	<meta charset="utf-8" />
b.	<meta http-equiv="X-UA-Compatible" content="IE=edge">
use the latest engine to render the page and execute JavaScript.
c.	<meta name="viewport" content="width=device-width, initial-scale=1">
initial-scale property controls the zoom level when the page is first loaded.
The maximum-scale, minimum-scale, and user-scalable properties control how users are allowed to zoom the page in or out.
Width can be set to a specific number of pixels like width=600 or to the special value device-width value which is the width of the screen in CSS pixels at a scale of 100%
d.	<meta name="description" content="Visual Studio 2015, Cordova, TypeScript, Angular 2 Starter">
e.	Add security policy. See below.
14.	Need to add the following code to index.html to allow for the CDN and JavaScript to work correctly:
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
<meta http-equiv="Content-Security-Policy" content="default-src https: 'self' jspm.io; script-src 'self' 'unsafe-inline' https://jspm.io">

Add Keystores for release

15.	Update build.json to include keystore for releasing to device. Publishing in release mode requires build.json to include keystore.
a.	Create a keystore and save it locally. Information on how to create keystore
https://github.com/Microsoft/cordova-docs/tree/master/tutorial-package-publish#android
b.	Update build.json to include keystore information.
 
c.	Note: If errors occur, this may be due to previous version of app on device.  Delete app on device and rebuild.
Install d.ts files for angular
16.	Install TSD and configure TSD to download d.ts files.
https://github.com/dbiele/Cordova_TypeScript_RequireJS_
a.	npm install tsd –g
17.	Install Angular2 d.ts files
a.	tsd install angular2 –s
18.	configure TSD to install files in proper location
a.	Delete newly added TSD typings folder
b.	Change tsd.json to point to new folder scripts/typings
c.	Create TSD task in gulp
d.	Reinstall d.ts files by running gulp task
19.	Confirm Angular 2 is the latest version by checking https://github.com/angular/angular/releases and https://github.com/borisyankov/DefinitelyTyped/tree/master/angular2
20.	Add systemJS d.ts files
a.	Tsd install Systemjs -s
Install gulp-tslint
1.	Add to package.json
DevDependencies > "gulp-tslint"
2.	Add the following to gulpfile.js:
gulp.task('tslint', function () {
    // Built-in rules are at
    // https://github.com/palantir/tslint#supported-rules
    var tslintConfig = {
        "rules": {
            "semicolon": true,
            "requireReturnType": true,
            "requireParameterType": true,
            "jsdoc-format": true,
            "quotemark": [true, "single"],
            "variable-name": [true,"allow-leading-underscore"]
        }
    };

    return gulp.src(['scripts/**/*.ts', '!scripts/typings/**'])
        //Custom rules can be added to configuration.  rulesDirectory: 'folder/folder'
      .pipe(tslint({ configuration: tslintConfig }))
      .pipe(tslint.report('verbose', { emitError: true, reportLimit: 0 }));
});

Install SASS
1.	Add to package.json
devDependencies “

Adding Angular 2 JavaScript Files
21.	Add JavaScript files using package.json would be the usual approach, but because this is in alpha, add the following to index.html.  
a.	<script src="https://github.jspm.io/jmcriffey/bower-traceur-runtime@0.0.87/traceur-runtime.js"></script>
b.	<script src="https://jspm.io/system@0.16.js"></script>
c.	<script src="https://code.angularjs.org/2.0.0-alpha.33/angular2.dev.js"></script>
d.	<script src="https://code.angularjs.org/2.0.0-alpha.33/router.dev.js"></script>
22.	Not using jspm.io and angularjs.org script links
a.	Create the ‘libs’ folder in www/scripts/
b.	Add the following javascript dependency files to www/scripts/libs if not using jspm.io and code.angularjs.org <script> tags
i.	Rx
ii.	Rx-lite
iii.	Traceur-runtime
iv.	Angular2 
v.	SystemJS
Can use JSPM for dynamically loading JavaScript development dependency files. Write ES6 modules and load external modules from CDN.


 
Notes
May require ADB to install the package manually. Visual Studio 2015 can sometimes create conflicts with devices.  
adb install <location of apk file>
List and uninstall APPs on Android device using ADB
1.	Open Command Prompt
2.	CD to the ADB folder
a.	C:\Program Files (x86)\Android\android-sdk\platform-tools
3.	Find the app
a.	adb root
b.	adb shell
c.	pm list packages
4.	Uninstall the app
a.	Adb uninstall <name of package example io.cordova….>

