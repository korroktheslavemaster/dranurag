'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _utils = require('./utils');

var _search_result = require('./search_result');

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Abstract class representing a editor target.
 *
 * Editor classes must implement `#applySearchResult`, `#getCursorOffset`,
 * `#getBeforeCursor` and `#getAfterCursor` methods.
 *
 * @abstract
 */


/** @typedef */
var Editor = function (_EventEmitter) {
  _inherits(Editor, _EventEmitter);

  function Editor() {
    _classCallCheck(this, Editor);

    return _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).apply(this, arguments));
  }

  _createClass(Editor, [{
    key: 'destroy',

    /**
     * It is called when associated textcomplete object is destroyed.
     *
     * @return {this}
     */
    value: function destroy() {
      return this;
    }

    /**
     * It is called when a search result is selected by a user.
     */

  }, {
    key: 'applySearchResult',
    value: function applySearchResult(_) {
      throw new Error('Not implemented.');
    }

    /**
     * The input cursor's absolute coordinates from the window's left
     * top corner.
     */

  }, {
    key: 'getCursorOffset',
    value: function getCursorOffset() {
      throw new Error('Not implemented.');
    }

    /**
     * Editor string value from head to cursor.
     */

  }, {
    key: 'getBeforeCursor',
    value: function getBeforeCursor() {
      throw new Error('Not implemented.');
    }

    /**
     * Editor string value from cursor to tail.
     */

  }, {
    key: 'getAfterCursor',
    value: function getAfterCursor() {
      throw new Error('Not implemented.');
    }

    /** @private */

  }, {
    key: 'emitMoveEvent',
    value: function emitMoveEvent(code) {
      var moveEvent = (0, _utils.createCustomEvent)('move', {
        cancelable: true,
        detail: {
          code: code
        }
      });
      this.emit('move', moveEvent);
      return moveEvent;
    }

    /** @private */

  }, {
    key: 'emitEnterEvent',
    value: function emitEnterEvent() {
      var enterEvent = (0, _utils.createCustomEvent)('enter', { cancelable: true });
      this.emit('enter', enterEvent);
      return enterEvent;
    }

    /** @private */

  }, {
    key: 'emitChangeEvent',
    value: function emitChangeEvent() {
      var changeEvent = (0, _utils.createCustomEvent)('change', {
        detail: {
          beforeCursor: this.getBeforeCursor()
        }
      });
      this.emit('change', changeEvent);
      return changeEvent;
    }

    /** @private */

  }, {
    key: 'emitEscEvent',
    value: function emitEscEvent() {
      var escEvent = (0, _utils.createCustomEvent)('esc', { cancelable: true });
      this.emit('esc', escEvent);
      return escEvent;
    }

    /** @private */

  }, {
    key: 'getCode',
    value: function getCode(e) {
      return e.keyCode === 8 ? 'BS' // backspace
      : e.keyCode === 9 ? 'ENTER' // tab
      : e.keyCode === 13 ? 'ENTER' // enter
      : e.keyCode === 16 ? 'META' // shift
      : e.keyCode === 17 ? 'META' // ctrl
      : e.keyCode === 18 ? 'META' // alt
      : e.keyCode === 27 ? 'ESC' // esc
      : e.keyCode === 38 ? 'UP' // up
      : e.keyCode === 40 ? 'DOWN' // down
      : e.keyCode === 78 && e.ctrlKey ? 'DOWN' // ctrl-n
      : e.keyCode === 80 && e.ctrlKey ? 'UP' // ctrl-p
      : e.keyCode === 91 ? 'META' // left command
      : e.keyCode === 93 ? 'META' // right command
      : 'OTHER';
    }
  }]);

  return Editor;
}(_eventemitter2.default);

exports.default = Editor;
//# sourceMappingURL=editor.js.map