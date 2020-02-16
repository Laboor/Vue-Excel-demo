export default class FormBuilder {
  constructor(formDataObj) {
    this._formData = new FormData();
    this._value = {};
    this._controls = {};
    this._create(formDataObj);
  }

  get value() {
    return this._value;
  }

  get data() {
    return this._formData;
  }

  get valid() {
    return this._checkFormValidStatus();
  }

  get controls() {
    return this._deepClone(this._controls);
  }

  get(key) {
    return this._formData.get(key);
  }

  set(key, value, validator = []) {
    let _validator = [];
    let type = Object.prototype.toString.call(validator);
    if (type == '[object Function]') {
      _validator.push(validator);
    } else if (type == '[object Array]') {
      _validator = validator;
    } else throw new Error('The validator is not function or array');
    this._createControl(key, value, _validator);
    this._formData.set(key, value);
    this._setValue(key, value);
  }

  _deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = this._deepClone(obj[key]);
          } else {
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  }

  _setValue(key, value) {
    let that = this;
    Object.defineProperty(that._value, key, {
      get: function () {
        return value;
      },
      set: function (newVal) {
        value = newVal;
        that._formData.set(key, newVal);
        that._controls[key].value = newVal;
      },
      enumerable: true,
      configurable: true
    })
  }

  _createControl(key, value, validator) {
    let that = this;
    let newControl = Object.create({}, {
      value: {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
      },
      valid: {
        get: function () {
          return that._checkControlValidStatus(newControl.value, validator);
        },
        enumerable: true,
        configurable: true
      },
      validator: {
        value: validator,
        writable: false,
        enumerable: true,
        configurable: true
      }
    })
    that._controls[key] = newControl;
  }

  _create(formDataObj) {
    for (let [key, value] of Object.entries(formDataObj)) {
      this.set(key, value[0], value[1]);
    }
  }

  _checkControlValidStatus(value, validators) {
    let validStatus = false;
    for (let validator of validators) {
      validStatus = validStatus && validator(value);
    }
    return validStatus;
  }

  _checkFormValidStatus() {
    let formValid = false;
    for (let key of this._formData.keys()) {
      formValid = formValid && this._controls[key].valid;
    }
    return formValid;
  }
}
