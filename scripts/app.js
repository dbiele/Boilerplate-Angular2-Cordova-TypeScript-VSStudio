var App;
(function (App) {
    "use strict";
    var _testingDiv;
    var _onScreenText = "";
    function initialize() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    App.initialize = initialize;
    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        console.log("cordova is ready: onDeviceReady");
        _testingDiv = document.getElementById('testing');
        addTextToPage('onDeviceReady');
        document.addEventListener('pause', onCordovaPause, false);
        document.addEventListener('resume', onCordovaResume, false);
    }
    function onCordovaPause() {
        console.log("onCordovaPause");
        addTextToPage('<p>onCordovaPause</p>');
    }
    function onCordovaResume() {
        console.log("onCordovaResume");
        addTextToPage('<p>onCordovaResume</p>');
    }
    function addTextToPage(textContent) {
        //var combinedStrings = _onScreenText
        _onScreenText += '<li>' + textContent + '</li>';
        _testingDiv.innerHTML = '<ul>' + _onScreenText + '</ul>';
    }
})(App || (App = {}));
