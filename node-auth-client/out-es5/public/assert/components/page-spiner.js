"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["require", "exports", "react"], function (require, exports, React) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PageSpinerContext = React.createContext({
    result: null
  });

  var PageSpiner =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(PageSpiner, _React$Component);

    function PageSpiner(props) {
      var _this;

      _classCallCheck(this, PageSpiner);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PageSpiner).call(this, props));
      _this.state = {
        status: 'Loading'
      };
      return _this;
    }

    _createClass(PageSpiner, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.load();
      }
    }, {
      key: "load",
      value: function load() {
        var _this2 = this;

        this.setState({
          status: 'Loading'
        });
        return this.props.load().then(function (o) {
          _this2.loadResult = o;

          _this2.setState({
            status: 'LoadSuccess'
          });
        }).catch(function (o) {
          console.error(o);

          _this2.setState({
            status: 'LoadFail'
          });
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var status = this.state.status;

        switch (status) {
          case 'Loading':
            return React.createElement("div", {
              className: "loading"
            }, React.createElement("i", {
              className: "icon-spinner icon-spin",
              style: {
                marginRight: 4
              }
            }), React.createElement("span", null, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D"));

          case 'LoadSuccess':
            return React.createElement(exports.PageSpinerContext.Provider, {
              value: {
                result: this.loadResult
              }
            }, this.props.children);

          case 'LoadFail':
            return React.createElement("div", {
              className: "load-fail"
            }, React.createElement("div", {
              onClick: function onClick() {
                return _this3.load();
              }
            }, "\u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u65B0\u52A0\u8F7D"));
        }
      }
    }]);

    return PageSpiner;
  }(React.Component);

  exports.PageSpiner = PageSpiner;
});
