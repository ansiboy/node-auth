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

define(["require", "exports", "react", "assert/services/index", "assert/dataSources", "../controls/list-view", "./constants", "error-handle"], function (require, exports, React, index_1, dataSources_1, list_view_1, constants_1, error_handle_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ListPageContext = React.createContext(null);

  var ListPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ListPage, _React$Component);

    function ListPage(props) {
      var _this;

      _classCallCheck(this, ListPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ListPage).call(this, props));
      _this.ps = new index_1.PermissionService(function (err) {
        return error_handle_1.default(err);
      }); //this.props.createService(PermissionService);

      return _this;
    }

    _createClass(ListPage, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        return React.createElement("div", {
          ref: function ref(e) {
            return __awaiter(_this2, void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              var resources, menuItems;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (e) {
                        _context.next = 2;
                        break;
                      }

                      return _context.abrupt("return");

                    case 2:
                      _context.next = 4;
                      return this.ps.resource.list();

                    case 4:
                      resources = _context.sent;
                      menuItems = dataSources_1.translateToMenuItems(resources);
                      this.listView = new list_view_1.ListView({
                        element: e,
                        dataSource: this.props.dataSource,
                        columns: this.props.columns,
                        menuItems: menuItems,
                        resourceId: this.props.resourceId,
                        context: this.props.context,
                        transform: this.props.transform,
                        pageSize: this.props.pageSize === undefined ? constants_1.constants.pageSize : this.props.pageSize
                      });

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));
          }
        });
      }
    }, {
      key: "dataSource",
      get: function get() {
        return this.props.dataSource;
      }
    }, {
      key: "gridView",
      get: function get() {
        return this.listView.gridView;
      }
    }]);

    return ListPage;
  }(React.Component);

  exports.ListPage = ListPage;
});
