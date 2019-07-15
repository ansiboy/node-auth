"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

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

define(["require", "exports", "assert/index", "react", "assert/dataSources", "assert/services/index", "maishu-wuzhui-helper", "maishu-wuzhui", "react-dom", "maishu-chitu"], function (require, exports, index_1, React, dataSources_1, index_2, maishu_wuzhui_helper_1, maishu_wuzhui_1, ReactDOM, maishu_chitu_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var nameFieldWidth = 280;
  var operationFieldWidth = 200;

  var PathListPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(PathListPage, _React$Component);

    function PathListPage(props) {
      var _this;

      _classCallCheck(this, PathListPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PathListPage).call(this, props));
      _this.pathsStorage = new maishu_chitu_1.ValueStore();
      _this.state = {};
      _this.ps = _this.props.createService(index_2.PermissionService);

      _this.ps.path.list().then(function (paths) {
        _this.pathsStorage.value = paths;
      });

      return _this;
    }

    _createClass(PathListPage, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));
      }
    }, {
      key: "displayName",
      value: function displayName(menuItem) {
        var names = [];
        var parent = menuItem;

        while (parent) {
          names.unshift(parent.name);
          parent = parent.parent;
        }

        var name = names.join(" - ");
        return name;
      }
    }, {
      key: "parentDeep",
      value: function parentDeep(menuItem) {
        var deep = 0;
        var parent = menuItem.parent;

        while (parent) {
          deep = deep + 1;
          parent = parent.parent;
        }

        return deep;
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        _objectDestructuringEmpty(this.state);

        return React.createElement(index_1.ListPage, {
          dataSource: dataSources_1.dataSources.module,
          resourceId: this.props.data.resourceId,
          pageSize: null,
          // transform={(dataItems) => {
          //     dataItems = translateToMenuItems(dataItems);
          //     return dataItems;
          // }}
          columns: [maishu_wuzhui_helper_1.customField({
            headerText: '功能模块',
            itemStyle: {
              width: "".concat(nameFieldWidth, "px")
            },
            createItemCell: function createItemCell() {
              var cell = new maishu_wuzhui_1.GridViewDataCell({
                render: function render(item, element) {
                  element.style.paddingLeft = "".concat(_this2.parentDeep(item) * 20 + 20, "px");
                  element.innerHTML = item.name;
                }
              });
              return cell;
            }
          }), index_1.customDataField({
            headerText: "路径",
            render: function render(dataItem, element) {
              // let renderPaths = (paths: Path[]) => {
              //     paths = paths.filter(o => o.resource_id == dataItem.id);
              //     (dataItem as MyMenuItem).paths = paths;
              var paths = dataItem.paths;
              ReactDOM.render(React.createElement("table", {
                className: "table",
                style: {
                  marginBottom: 0,
                  backgroundColor: "unset"
                }
              }, React.createElement("tbody", null, paths.map(function (o) {
                return React.createElement("tr", {
                  key: o.id,
                  style: {
                    paddingBottom: 6
                  }
                }, React.createElement("td", {
                  style: {
                    borderTop: 0
                  }
                }, o.value));
              }))), element); // }
              // this.pathsStorage.attach((value) => {
              //     renderPaths(value);
              // })
            }
          }), index_1.operationField(this.props.data.resourceId, this.ps, this, "".concat(operationFieldWidth - 18, "px"))]
        });
      }
    }]);

    return PathListPage;
  }(React.Component);

  exports.default = PathListPage;
});
