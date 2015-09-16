var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular2_1 = require('angular2/angular2');
var lang_1 = require('angular2/src/core/facade/lang');
var async_1 = require('angular2/src/core/facade/async');
var collection_1 = require('angular2/src/core/facade/collection');
var key_codes_1 = require('angular2_material/src/core/key_codes');
// TODO(jelbourn): Behaviors to test
// Disabled radio don't select
// Disabled radios don't propagate click event
// Radios are disabled by parent group
// Radios set default tab index iff not in parent group
// Radios are unique-select
// Radio updates parent group's value
// Change to parent group's value updates the selected child radio
// Radio name is pulled on parent group
// Radio group changes on arrow keys
// Radio group skips disabled radios on arrow keys
var _uniqueIdCounter = 0;
var MdRadioGroup = (function () {
    function MdRadioGroup(tabindex, disabled, radioDispatcher) {
        this._name = "md-radio-group-" + _uniqueIdCounter++;
        this._radios = [];
        this.change = new async_1.EventEmitter();
        this.radioDispatcher = radioDispatcher;
        this.selectedRadioId = '';
        this._disabled = false;
        // The simple presence of the `disabled` attribute dictates disabled state.
        this.disabled = lang_1.isPresent(disabled);
        // If the user has not set a tabindex, default to zero (in the normal document flow).
        this.tabindex = lang_1.isPresent(tabindex) ? lang_1.NumberWrapper.parseInt(tabindex, 10) : 0;
    }
    /** Gets the name of this group, as to be applied in the HTML 'name' attribute. */
    MdRadioGroup.prototype.getName = function () {
        return this._name;
    };
    Object.defineProperty(MdRadioGroup.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = lang_1.isPresent(value) && value !== false;
        },
        enumerable: true,
        configurable: true
    });
    /** Change handler invoked when bindings are resolved or when bindings have changed. */
    MdRadioGroup.prototype.onChanges = function (_) {
        var _this = this;
        // If the component has a disabled attribute with no value, it will set disabled = ''.
        this.disabled = lang_1.isPresent(this.disabled) && this.disabled !== false;
        // If the value of this radio-group has been set or changed, we have to look through the
        // child radio buttons and select the one that has a corresponding value (if any).
        if (lang_1.isPresent(this.value) && this.value != '') {
            this.radioDispatcher.notify(this._name);
            collection_1.ListWrapper.forEach(this._radios, function (radio) {
                if (radio.value == _this.value) {
                    radio.checked = true;
                    _this.selectedRadioId = radio.id;
                    _this.activedescendant = radio.id;
                }
            });
        }
    };
    /** Update the value of this radio group from a child md-radio being selected. */
    MdRadioGroup.prototype.updateValue = function (value, id) {
        this.value = value;
        this.selectedRadioId = id;
        this.activedescendant = id;
        async_1.ObservableWrapper.callNext(this.change, null);
    };
    /** Registers a child radio button with this group. */
    MdRadioGroup.prototype.register = function (radio) {
        this._radios.push(radio);
    };
    /** Handles up and down arrow key presses to change the selected child radio. */
    MdRadioGroup.prototype.onKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        switch (event.keyCode) {
            case key_codes_1.KeyCodes.UP:
                this.stepSelectedRadio(-1);
                event.preventDefault();
                break;
            case key_codes_1.KeyCodes.DOWN:
                this.stepSelectedRadio(1);
                event.preventDefault();
                break;
        }
    };
    // TODO(jelbourn): Replace this with a findIndex method in the collections facade.
    MdRadioGroup.prototype.getSelectedRadioIndex = function () {
        for (var i = 0; i < this._radios.length; i++) {
            if (this._radios[i].id == this.selectedRadioId) {
                return i;
            }
        }
        return -1;
    };
    /** Steps the selected radio based on the given step value (usually either +1 or -1). */
    MdRadioGroup.prototype.stepSelectedRadio = function (step) {
        var index = this.getSelectedRadioIndex() + step;
        if (index < 0 || index >= this._radios.length) {
            return;
        }
        var radio = this._radios[index];
        // If the next radio is line is disabled, skip it (maintaining direction).
        if (radio.disabled) {
            this.stepSelectedRadio(step + (step < 0 ? -1 : 1));
            return;
        }
        this.radioDispatcher.notify(this._name);
        radio.checked = true;
        async_1.ObservableWrapper.callNext(this.change, null);
        this.value = radio.value;
        this.selectedRadioId = radio.id;
        this.activedescendant = radio.id;
    };
    MdRadioGroup = __decorate([
        angular2_1.Component({
            selector: 'md-radio-group',
            events: ['change'],
            properties: ['disabled', 'value'],
            host: {
                'role': 'radiogroup',
                '[attr.aria-disabled]': 'disabled',
                '[attr.aria-activedescendant]': 'activedescendant',
                // TODO(jelbourn): Remove ^ when event retargeting is fixed.
                '(keydown)': 'onKeydown($event)',
                '[tabindex]': 'tabindex'
            }
        }),
        angular2_1.View({
            templateUrl: 'package:angular2_material/src/components/radio/radio_group.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }),
        __param(0, angular2_1.Attribute('tabindex')),
        __param(1, angular2_1.Attribute('disabled'))
    ], MdRadioGroup);
    return MdRadioGroup;
})();
exports.MdRadioGroup = MdRadioGroup;
var MdRadioButton = (function () {
    function MdRadioButton(radioGroup, id, tabindex, radioDispatcher) {
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        var _this = this;
        this.radioGroup = radioGroup;
        this.radioDispatcher = radioDispatcher;
        this.value = null;
        this.checked = false;
        this.id = lang_1.isPresent(id) ? id : "md-radio-" + _uniqueIdCounter++;
        // Whenever a radio button with the same name is checked, uncheck this radio button.
        radioDispatcher.listen(function (name) {
            if (name == _this.name) {
                _this.checked = false;
            }
        });
        // When this radio-button is inside of a radio-group, the group determines the name.
        if (lang_1.isPresent(radioGroup)) {
            this.name = radioGroup.getName();
            this.radioGroup.register(this);
        }
        // If the user has not set a tabindex, default to zero (in the normal document flow).
        if (!lang_1.isPresent(radioGroup)) {
            this.tabindex = lang_1.isPresent(tabindex) ? lang_1.NumberWrapper.parseInt(tabindex, 10) : 0;
        }
        else {
            this.tabindex = -1;
        }
    }
    /** Change handler invoked when bindings are resolved or when bindings have changed. */
    MdRadioButton.prototype.onInit = function () {
        if (lang_1.isPresent(this.radioGroup)) {
            this.name = this.radioGroup.getName();
        }
    };
    /** Whether this radio button is disabled, taking the parent group into account. */
    MdRadioButton.prototype.isDisabled = function () {
        // Here, this.disabled may be true/false as the result of a binding, may be the empty string
        // if the user just adds a `disabled` attribute with no value, or may be absent completely.
        // TODO(jelbourn): If someone sets `disabled="disabled"`, will this work in dart?
        return this.disabled || (lang_1.isPresent(this.disabled) && lang_1.StringWrapper.equals(this.disabled, '')) ||
            (lang_1.isPresent(this.radioGroup) && this.radioGroup.disabled);
    };
    Object.defineProperty(MdRadioButton.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = lang_1.isPresent(value) && value !== false;
        },
        enumerable: true,
        configurable: true
    });
    /** Select this radio button. */
    MdRadioButton.prototype.select = function (event) {
        if (this.isDisabled()) {
            event.stopPropagation();
            return;
        }
        // Notifiy all radio buttons with the same name to un-check.
        this.radioDispatcher.notify(this.name);
        this.checked = true;
        if (lang_1.isPresent(this.radioGroup)) {
            this.radioGroup.updateValue(this.value, this.id);
        }
    };
    /** Handles pressing the space key to select this focused radio button. */
    MdRadioButton.prototype.onKeydown = function (event) {
        if (event.keyCode == key_codes_1.KeyCodes.SPACE) {
            event.preventDefault();
            this.select(event);
        }
    };
    MdRadioButton = __decorate([
        angular2_1.Component({
            selector: 'md-radio-button',
            properties: ['id', 'name', 'value', 'checked', 'disabled'],
            host: {
                'role': 'radio',
                '[id]': 'id',
                '[tabindex]': 'tabindex',
                '[attr.aria-checked]': 'checked',
                '[attr.aria-disabled]': 'disabled',
                '(keydown)': 'onKeydown($event)'
            }
        }),
        angular2_1.View({
            templateUrl: 'package:angular2_material/src/components/radio/radio_button.html',
            directives: [],
            encapsulation: angular2_1.ViewEncapsulation.None
        }),
        __param(0, angular2_1.Optional()),
        __param(0, angular2_1.SkipSelf()),
        __param(0, angular2_1.Host()),
        __param(1, angular2_1.Attribute('id')),
        __param(2, angular2_1.Attribute('tabindex'))
    ], MdRadioButton);
    return MdRadioButton;
})();
exports.MdRadioButton = MdRadioButton;
