import {
  Component,
  View,
  ViewEncapsulation,
  LifecycleEvent,
  Host,
  SkipSelf,
  Attribute,
  Optional,
  OnChanges,
  OnInit
} from 'angular2/angular2';

import {isPresent, StringWrapper, NumberWrapper} from 'angular2/src/core/facade/lang';
import {ObservableWrapper, EventEmitter} from 'angular2/src/core/facade/async';
import {ListWrapper} from 'angular2/src/core/facade/collection';
import {Event, KeyboardEvent} from 'angular2/src/core/facade/browser';

import {MdRadioDispatcher} from 'angular2_material/src/components/radio/radio_dispatcher';
import {KeyCodes} from 'angular2_material/src/core/key_codes';

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

var _uniqueIdCounter: number = 0;

@Component({
  selector: 'md-radio-group',
  events: ['change'],
  properties: ['disabled', 'value'],
  host: {
    'role': 'radiogroup',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-activedescendant]': 'activedescendant',
    // TODO(jelbourn): Remove ^ when event retargeting is fixed.
    '(keydown)': 'onKeydown($event)',
    '[tabindex]': 'tabindex',
  }
})
@View({
  templateUrl: 'package:angular2_material/src/components/radio/radio_group.html',
  encapsulation: ViewEncapsulation.None
})
export class MdRadioGroup implements OnChanges {
  /** The selected value for the radio group. The value comes from the options. */
  value: any;

  /** The HTML name attribute applied to radio buttons in this group. */
  _name: string;

  /** Dispatcher for coordinating radio unique-selection by name. */
  radioDispatcher: MdRadioDispatcher;

  /** Array of child radio buttons. */
  _radios: MdRadioButton[];

  activedescendant: any;

  _disabled: boolean;

  /** The ID of the selected radio button. */
  selectedRadioId: string;

  change: EventEmitter;

  tabindex: number;

  constructor(@Attribute('tabindex') tabindex: string, @Attribute('disabled') disabled: string,
              radioDispatcher: MdRadioDispatcher) {
    this._name = `md-radio-group-${_uniqueIdCounter++}`;
    this._radios = [];
    this.change = new EventEmitter();
    this.radioDispatcher = radioDispatcher;
    this.selectedRadioId = '';
    this._disabled = false;

    // The simple presence of the `disabled` attribute dictates disabled state.
    this.disabled = isPresent(disabled);

    // If the user has not set a tabindex, default to zero (in the normal document flow).
    this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : 0;
  }

  /** Gets the name of this group, as to be applied in the HTML 'name' attribute. */
  getName(): string {
    return this._name;
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = isPresent(value) && value !== false;
  }

  /** Change handler invoked when bindings are resolved or when bindings have changed. */
  onChanges(_) {
    // If the component has a disabled attribute with no value, it will set disabled = ''.
    this.disabled = isPresent(this.disabled) && this.disabled !== false;

    // If the value of this radio-group has been set or changed, we have to look through the
    // child radio buttons and select the one that has a corresponding value (if any).
    if (isPresent(this.value) && this.value != '') {
      this.radioDispatcher.notify(this._name);
      ListWrapper.forEach(this._radios, (radio) => {
        if (radio.value == this.value) {
          radio.checked = true;
          this.selectedRadioId = radio.id;
          this.activedescendant = radio.id;
        }
      });
    }
  }

  /** Update the value of this radio group from a child md-radio being selected. */
  updateValue(value: any, id: string) {
    this.value = value;
    this.selectedRadioId = id;
    this.activedescendant = id;
    ObservableWrapper.callNext(this.change, null);
  }

  /** Registers a child radio button with this group. */
  register(radio: MdRadioButton) {
    this._radios.push(radio);
  }

  /** Handles up and down arrow key presses to change the selected child radio. */
  onKeydown(event: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    switch (event.keyCode) {
      case KeyCodes.UP:
        this.stepSelectedRadio(-1);
        event.preventDefault();
        break;
      case KeyCodes.DOWN:
        this.stepSelectedRadio(1);
        event.preventDefault();
        break;
    }
  }

  // TODO(jelbourn): Replace this with a findIndex method in the collections facade.
  getSelectedRadioIndex(): number {
    for (let i = 0; i < this._radios.length; i++) {
      if (this._radios[i].id == this.selectedRadioId) {
        return i;
      }
    }

    return -1;
  }

  /** Steps the selected radio based on the given step value (usually either +1 or -1). */
  stepSelectedRadio(step) {
    let index = this.getSelectedRadioIndex() + step;
    if (index < 0 || index >= this._radios.length) {
      return;
    }

    let radio = this._radios[index];

    // If the next radio is line is disabled, skip it (maintaining direction).
    if (radio.disabled) {
      this.stepSelectedRadio(step + (step < 0 ? -1 : 1));
      return;
    }

    this.radioDispatcher.notify(this._name);
    radio.checked = true;
    ObservableWrapper.callNext(this.change, null);

    this.value = radio.value;
    this.selectedRadioId = radio.id;
    this.activedescendant = radio.id;
  }
}


@Component({
  selector: 'md-radio-button',
  properties: ['id', 'name', 'value', 'checked', 'disabled'],
  host: {
    'role': 'radio',
    '[id]': 'id',
    '[tabindex]': 'tabindex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '(keydown)': 'onKeydown($event)',
  }
})
@View({
  templateUrl: 'package:angular2_material/src/components/radio/radio_button.html',
  directives: [],
  encapsulation: ViewEncapsulation.None
})
export class MdRadioButton implements OnInit {
  /** Whether this radio is checked. */
  checked: boolean;

  /** Whether the radio is disabled. */
  _disabled: boolean;

  /** The unique ID for the radio button. */
  id: string;

  /** Analog to HTML 'name' attribute used to group radios for unique selection. */
  name: string;

  /** Value assigned to this radio. Used to assign the value to the parent MdRadioGroup. */
  value: any;

  /** The parent radio group. May or may not be present. */
  radioGroup: MdRadioGroup;

  /** Dispatcher for coordinating radio unique-selection by name. */
  radioDispatcher: MdRadioDispatcher;

  tabindex: number;

  constructor(@Optional() @SkipSelf() @Host() radioGroup: MdRadioGroup, @Attribute('id') id: string,
              @Attribute('tabindex') tabindex: string, radioDispatcher: MdRadioDispatcher) {
    // Assertions. Ideally these should be stripped out by the compiler.
    // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.

    this.radioGroup = radioGroup;
    this.radioDispatcher = radioDispatcher;
    this.value = null;
    this.checked = false;

    this.id = isPresent(id) ? id : `md-radio-${_uniqueIdCounter++}`;

    // Whenever a radio button with the same name is checked, uncheck this radio button.
    radioDispatcher.listen((name) => {
      if (name == this.name) {
        this.checked = false;
      }
    });

    // When this radio-button is inside of a radio-group, the group determines the name.
    if (isPresent(radioGroup)) {
      this.name = radioGroup.getName();
      this.radioGroup.register(this);
    }

    // If the user has not set a tabindex, default to zero (in the normal document flow).
    if (!isPresent(radioGroup)) {
      this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : 0;
    } else {
      this.tabindex = -1;
    }
  }

  /** Change handler invoked when bindings are resolved or when bindings have changed. */
  onInit() {
    if (isPresent(this.radioGroup)) {
      this.name = this.radioGroup.getName();
    }
  }

  /** Whether this radio button is disabled, taking the parent group into account. */
  isDisabled(): boolean {
    // Here, this.disabled may be true/false as the result of a binding, may be the empty string
    // if the user just adds a `disabled` attribute with no value, or may be absent completely.
    // TODO(jelbourn): If someone sets `disabled="disabled"`, will this work in dart?
    return this.disabled || (isPresent(this.disabled) && StringWrapper.equals(this.disabled, '')) ||
           (isPresent(this.radioGroup) && this.radioGroup.disabled);
  }

  get disabled(): any {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = isPresent(value) && value !== false;
  }

  /** Select this radio button. */
  select(event: Event) {
    if (this.isDisabled()) {
      event.stopPropagation();
      return;
    }

    // Notifiy all radio buttons with the same name to un-check.
    this.radioDispatcher.notify(this.name);

    this.checked = true;

    if (isPresent(this.radioGroup)) {
      this.radioGroup.updateValue(this.value, this.id);
    }
  }

  /** Handles pressing the space key to select this focused radio button. */
  onKeydown(event: KeyboardEvent) {
    if (event.keyCode == KeyCodes.SPACE) {
      event.preventDefault();
      this.select(event);
    }
  }
}
