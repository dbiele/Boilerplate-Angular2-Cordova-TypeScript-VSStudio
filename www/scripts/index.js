/// <reference path="./typings/systemjs/systemjs.d.ts"/> 
// Sets the reference paths
System.config({
    baseURL: './scripts/',
    transpiler: 'traceur',
    traceurOptions: {
        annotations: true,
        types: true,
        memberVariables: true
    },
    paths: {
        'app': './app.js'
    }
});
// Loads ./scripts/app.js
// System calls inititalize when import has completed loading.
System.import('app').then(function () { return dbiele.BA2CT.Application.initialize(); });
//# sourceMappingURL=index.js.map