"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

define(["require", "exports", "react", "maishu-ui-toolkit", "assert/dataSources", "maishu-dilu", "maishu-chitu"], function (require, exports, React, ui, dataSources_1, maishu_dilu_1, maishu_chitu_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function getObjectType(url) {
    // let url = location.hash.substr(1);
    var obj = maishu_chitu_1.parseUrl(url);
    var arr = obj.pageName.split('/');
    return arr[0];
  }

  exports.ItemPageContext = React.createContext({
    dataItem: {},
    updatePageState: function updatePageState(dataItem) {
      return null;
    },
    beforeSave: function beforeSave(callback) {
      return null;
    }
  });

  var ItemPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ItemPage, _React$Component);

    function ItemPage(props) {
      var _this;

      _classCallCheck(this, ItemPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ItemPage).call(this, props));
      getObjectType(_this.props.source.url);
      _this.state = {
        dataItem: {},
        originalDataItem: {}
      };

      if (_this.props.afterGetItem) {
        _this.props.afterGetItem(_this.state.dataItem);
      }

      var objectType = getObjectType(_this.props.source.url);
      _this.dataSource = dataSources_1.dataSources[objectType];

      if (_this.props.data.id || _this.props.data.sourceId) {
        _this.loadDataItem(_this.props.data.id || _this.props.data.sourceId);
      }

      _this.beforeSaves = [];

      if (_this.props.beforeSave) {
        _this.beforeSaves.push(_this.props.beforeSave);
      }

      return _this;
    }

    _createClass(ItemPage, [{
      key: "loadDataItem",
      value: function loadDataItem(itemId) {
        var _this2 = this;

        var objectType = getObjectType(this.props.source.url);
        this.dataSource = dataSources_1.dataSources[objectType];
        this.dataSource.getItem(itemId).then(function (item) {
          console.assert(item != null);
          var originalDataItem = JSON.parse(JSON.stringify(item));

          _this2.setState({
            dataItem: item,
            originalDataItem: originalDataItem
          });

          if (_this2.props.afterGetItem) {
            _this2.props.afterGetItem(item);
          }
        });
      }
    }, {
      key: "save",
      value: function save() {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _this$state, dataItem, originalDataItem, changedData, names, i, r, obj, _r, _r2;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.validator.clearErrors();

                  if (this.validator.check()) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt("return", Promise.reject('validate fail'));

                case 3:
                  _this$state = this.state, dataItem = _this$state.dataItem, originalDataItem = _this$state.originalDataItem;

                  if (!(this.beforeSaves.length > 0)) {
                    _context.next = 7;
                    break;
                  }

                  _context.next = 7;
                  return Promise.all(this.beforeSaves.map(function (m) {
                    return m(dataItem);
                  }));

                case 7:
                  changedData = {};
                  names = Object.getOwnPropertyNames(dataItem);
                  i = 0;

                case 10:
                  if (!(i < names.length)) {
                    _context.next = 17;
                    break;
                  }

                  if (!(dataItem[names[i]] == originalDataItem[names[i]])) {
                    _context.next = 13;
                    break;
                  }

                  return _context.abrupt("continue", 14);

                case 13:
                  changedData[names[i]] = dataItem[names[i]];

                case 14:
                  i++;
                  _context.next = 10;
                  break;

                case 17:
                  if (!(Object.getOwnPropertyNames(changedData).length == 0)) {
                    _context.next = 20;
                    break;
                  }

                  console.log('Data item is not changed.');
                  return _context.abrupt("return");

                case 20:
                  if (!dataItem.id) {
                    _context.next = 37;
                    break;
                  }

                  if (this.props.data.sourceId) {
                    _context.next = 29;
                    break;
                  }

                  changedData.id = dataItem.id;
                  _context.next = 25;
                  return this.dataSource.update(changedData);

                case 25:
                  r = _context.sent;
                  Object.assign(dataItem, r || {});
                  _context.next = 35;
                  break;

                case 29:
                  obj = Object.assign({}, dataItem, changedData);
                  delete obj.id;
                  _context.next = 33;
                  return this.dataSource.insert(obj);

                case 33:
                  _r = _context.sent;
                  Object.assign(dataItem, _r || {});

                case 35:
                  _context.next = 41;
                  break;

                case 37:
                  _context.next = 39;
                  return this.dataSource.insert(changedData);

                case 39:
                  _r2 = _context.sent;
                  Object.assign(dataItem, _r2 || {});

                case 41:
                  originalDataItem = JSON.parse(JSON.stringify(dataItem));
                  this.setState({
                    originalDataItem: originalDataItem,
                    dataItem: dataItem
                  });

                case 43:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(props) {
        var dataItem = this.state.dataItem;
        var dataItemId = props.data.id || props.data.sourceId;

        if (dataItemId != dataItem.id) {
          this.setState({
            dataItem: {},
            originalDataItem: {}
          });

          if (props.data.id || props.data.sourceId) {
            this.loadDataItem(props.data.id || props.data.sourceId);
          }
        }
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var children = this.props.children == null ? [] : Array.isArray(this.props.children) ? this.props.children : [this.props.children];
        var validateFields = children.filter(function (o) {
          return o != null;
        }).map(function (o) {
          var props = o.props;
          if (props == null || props.validateRules == null) return null;
          var f = {
            name: props.name || props.dataField,
            rules: props.validateRules || []
          };
          return f;
        }).filter(function (o) {
          return o != null;
        });
        this.validator = _construct(maishu_dilu_1.FormValidator, [this.fieldsConatiner].concat(_toConsumableArray(validateFields)));
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var dataItem = this.state.dataItem;
        return React.createElement(React.Fragment, null, React.createElement("div", {
          className: "tabbable"
        }, React.createElement("ul", {
          className: "nav nav-tabs"
        }, React.createElement("li", {
          className: "pull-right"
        }, this.props.data.mode == 'view' ? null : React.createElement("button", {
          className: "btn btn-primary",
          ref: function ref(e) {
            if (!e) return;
            ui.buttonOnClick(e, function () {
              return _this3.save();
            }, {
              toast: '保存成功'
            });
          }
        }, React.createElement("i", {
          className: "icon-save"
        }), React.createElement("span", null, "\u4FDD\u5B58")), React.createElement("button", {
          className: "btn btn-primary",
          onClick: function onClick() {
            return _this3.props.app.back();
          }
        }, React.createElement("i", {
          className: "icon-reply"
        }), React.createElement("span", null, "\u8FD4\u56DE"))))), React.createElement("div", {
          ref: function ref(e) {
            return _this3.fieldsConatiner = e || _this3.fieldsConatiner;
          }
        }, React.createElement(exports.ItemPageContext.Provider, {
          value: {
            dataItem: dataItem,
            updatePageState: function updatePageState(dataItem) {
              _this3.setState({
                dataItem: dataItem
              });
            },
            beforeSave: function beforeSave(callback) {
              _this3.beforeSaves.push(callback);
            }
          }
        }, this.props.children)));
      }
    }]);

    return ItemPage;
  }(React.Component);

  exports.ItemPage = ItemPage;
});
