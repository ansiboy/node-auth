"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

define(["require", "exports", "react", "assert/index", "assert/index", "maishu-wuzhui-helper", "assert/dataSources", "assert/services/index"], function (require, exports, React, index_1, index_2, maishu_wuzhui_helper_1, dataSources_1, index_3) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var RoleListPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(RoleListPage, _React$Component);

    function RoleListPage(props) {
      var _this;

      _classCallCheck(this, RoleListPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RoleListPage).call(this, props));
      _this.state = {};
      _this.ps = _this.props.createService(index_3.PermissionService);
      return _this;
    }

    _createClass(RoleListPage, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var _ref, _ref2, resources, menuItems, currentMenuItem;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return Promise.all([this.ps.resource.list()]);

                case 2:
                  _ref = _context.sent;
                  _ref2 = _slicedToArray(_ref, 1);
                  resources = _ref2[0];
                  menuItems = dataSources_1.translateToMenuItems(resources);
                  currentMenuItem = menuItems.filter(function (o) {
                    return o.id == _this2.props.data.resourceId;
                  })[0];
                  this.setState({
                    currentMenuItem: currentMenuItem
                  });

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
    }, {
      key: "render",
      value: function render() {
        var currentMenuItem = this.state.currentMenuItem;

        if (!currentMenuItem) {
          return React.createElement("div", {
            className: "empty"
          }, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D...");
        }

        return React.createElement(index_2.ListPage, {
          resourceId: this.props.data.resourceId,
          context: this,
          dataSource: dataSources_1.dataSources.role,
          columns: [maishu_wuzhui_helper_1.boundField({
            dataField: 'id',
            headerText: '编号',
            headerStyle: {
              width: '300px'
            },
            itemStyle: {
              textAlign: 'center'
            }
          }), maishu_wuzhui_helper_1.boundField({
            dataField: 'name',
            headerText: '名称'
          }), index_1.dateTimeField({
            dataField: 'create_date_time',
            headerText: '创建时间'
          }), index_1.operationField(this.props.data.resourceId, this.ps, this, '160px')]
        });
      }
    }]);

    return RoleListPage;
  }(React.Component);

  exports.default = RoleListPage;
});
