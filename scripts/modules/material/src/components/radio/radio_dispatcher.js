/**
 * Class for radio buttons to coordinate unique selection based on name.
 * Indended to be consumed as an Angular service.
 */
var MdRadioDispatcher = (function () {
    function MdRadioDispatcher() {
        this._listeners = [];
    }
    /** Notify other nadio buttons that selection for the given name has been set. */
    MdRadioDispatcher.prototype.notify = function (name) {
        this._listeners.forEach(function (listener) { return listener(name); });
    };
    /** Listen for future changes to radio button selection. */
    MdRadioDispatcher.prototype.listen = function (listener) {
        this._listeners.push(listener);
    };
    return MdRadioDispatcher;
})();
exports.MdRadioDispatcher = MdRadioDispatcher;
