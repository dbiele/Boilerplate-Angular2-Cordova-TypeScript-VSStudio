// For an introduction to this template, see the following documentation:
// https://github.com/dbiele/Boilerplate-Angular2-Cordova-TypeScript-VSStudio
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var BA2CT;
(function (BA2CT) {
    "use strict";
    var Application;
    (function (Application) {
        function logToStage(log) {
            var ul;
            var li;
            ul = document.getElementById('body_content');
            li = document.createElement('li');
            li.textContent = 'LogToStage: ' + log;
            ul.appendChild(li);
        }
        function initialize() {
            console.log('Application initialize');
            logToStage('Initialize');
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            console.log('Application onDeviceREady');
            logToStage('Device is Ready');
            document.addEventListener('pause', onDevicePause, false);
            document.addEventListener('resume', onDeviceResume, false);
            document.addEventListener('onMenuButton', onDeviceMenuButton, false);
            //document.addEventListener('onMenuButton', onDeviceOffline, false);
            //document.addEventListener('onMenuButton', onDeviceMenuOnline, false);
            //document.addEventListener('onMenuButton', onDeviceBackButton, false);
            //document.addEventListener('onMenuButton', onDeviceSearchButton, false);
            // TODO: Scripts are ready to load.
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }
        function onDevicePause() {
            console.log('applicaiton onPause');
            logToStage('onPause');
            // TODO: This application has been suspended. Save application state here.
        }
        function onDeviceResume() {
            console.log('application onResume');
            logToStage('onResume');
            // TODO: This application has been reactivated. Restore application state here.
        }
        function onDeviceMenuButton() {
        }
    })(Application = BA2CT.Application || (BA2CT.Application = {}));
})(BA2CT || (BA2CT = {}));
//# sourceMappingURL=app.js.map