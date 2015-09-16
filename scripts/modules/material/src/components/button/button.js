var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var angular2_1 = require('angular2/angular2');
var async_1 = require('angular2/src/core/facade/async');
var lang_1 = require('angular2/src/core/facade/lang');
// TODO(jelbourn): Ink ripples.
// TODO(jelbourn): Make the `isMosueDown` stuff done with one global listener.
var MdButton = (function () {
    function MdButton() {
        /** Whether a mousedown has occured on this element in the last 100ms. */
        this.isMouseDown = false;
        /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
        this.isKeyboardFocused = false;
    }
    MdButton.prototype.onMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this.isMouseDown = true;
        async_1.TimerWrapper.setTimeout(function () { _this.isMouseDown = false; }, 100);
    };
    MdButton.prototype.onFocus = function () {
        this.isKeyboardFocused = !this.isMouseDown;
    };
    MdButton.prototype.onBlur = function () {
        this.isKeyboardFocused = false;
    };
    MdButton = __decorate([
        angular2_1.Component({
            selector: '[md-button]:not(a), [md-fab]:not(a), [md-raised-button]:not(a)',
            host: {
                '(mousedown)': 'onMousedown()',
                '(focus)': 'onFocus()',
                '(blur)': 'onBlur()',
                '[class.md-button-focus]': 'isKeyboardFocused'
            }
        }),
        angular2_1.View({
            templateUrl: 'package:angular2_material/src/components/button/button.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        })
    ], MdButton);
    return MdButton;
})();
exports.MdButton = MdButton;
var MdAnchor = (function (_super) {
    __extends(MdAnchor, _super);
    function MdAnchor() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(MdAnchor.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = lang_1.isPresent(value) && this.disabled !== false;
        },
        enumerable: true,
        configurable: true
    });
    MdAnchor.prototype.onClick = function (event) {
        // A disabled anchor shouldn't navigate anywhere.
        if (this.disabled) {
            event.preventDefault();
        }
    };
    /** Invoked when a change is detected. */
    MdAnchor.prototype.onChanges = function (_) {
        // A disabled anchor should not be in the tab flow.
        this.tabIndex = this.disabled ? -1 : 0;
    };
    MdAnchor = __decorate([
        angular2_1.Component({
            selector: 'a[md-button], a[md-raised-button], a[md-fab]',
            properties: ['disabled'],
            host: {
                '(click)': 'onClick($event)',
                '(mousedown)': 'onMousedown()',
                '(focus)': 'onFocus()',
                '(blur)': 'onBlur()',
                '[tabIndex]': 'tabIndex',
                '[class.md-button-focus]': 'isKeyboardFocused',
                '[attr.aria-disabled]': 'disabled'
            }
        }),
        angular2_1.View({
            templateUrl: 'package:angular2_material/src/components/button/button.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        })
    ], MdAnchor);
    return MdAnchor;
})(MdButton);
exports.MdAnchor = MdAnchor;
