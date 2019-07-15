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

define(["require", "exports", "react", "maishu-wuzhui-helper", "assert/index", "maishu-wuzhui", "assert/services/index", "assert/dataSources", "assert/index", "react-dom"], function (require, exports, React, maishu_wuzhui_helper_1, index_1, maishu_wuzhui_1, index_2, dataSources_1, index_3, ReactDOM) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var sortFieldWidth = 80;
  var nameFieldWidth = 280;
  var operationFieldWidth = 200;
  var typeFieldWidth = 140;
  var remarkWidth = 240;

  var ResourceListPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ResourceListPage, _React$Component);

    function ResourceListPage(props) {
      var _this;

      _classCallCheck(this, ResourceListPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceListPage).call(this, props));
      _this.state = {
        resources: []
      };
      _this.permissionService = _this.props.createService(index_2.PermissionService);
      return _this;
    }

    _createClass(ResourceListPage, [{
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

        return React.createElement(index_3.ListPage, Object.assign({}, {
          resourceId: this.props.data.resourceId
        }, {
          context: this,
          dataSource: dataSources_1.dataSources.resource,
          pageSize: null,
          transform: function transform(items) {
            items = items.filter(function (o) {
              return o.type == "menu" || o.type == "control";
            });
            items.sort(function (a, b) {
              return a.sort_number < b.sort_number ? -1 : 1;
            });
            items = dataSources_1.translateToMenuItems(items);
            return items;
          },
          columns: [maishu_wuzhui_helper_1.boundField({
            dataField: 'sort_number',
            itemStyle: {
              width: "".concat(sortFieldWidth, "px")
            },
            headerText: "序号"
          }), maishu_wuzhui_helper_1.customField({
            headerText: '菜单名称',
            itemStyle: {
              width: "".concat(nameFieldWidth, "px")
            },
            createItemCell: function createItemCell() {
              var cell = new maishu_wuzhui_1.GridViewDataCell({
                render: function render(item, element) {
                  element.style.paddingLeft = "".concat(_this2.parentDeep(item) * 20 + 10, "px");
                  element.innerHTML = item.name;
                }
              });
              return cell;
            }
          }), maishu_wuzhui_helper_1.boundField({
            dataField: "page_path",
            headerText: "路径"
          }), index_1.customDataField({
            headerText: "图标",
            itemStyle: {
              width: "180px"
            },
            render: function render(dataItem, element) {
              ReactDOM.render(React.createElement(React.Fragment, null, dataItem.icon ? React.createElement("i", {
                className: "".concat(dataItem.icon),
                style: {
                  marginRight: 10
                }
              }) : null, React.createElement("span", null, dataItem.icon)), element);
            }
          }), maishu_wuzhui_helper_1.boundField({
            dataField: "remark",
            headerText: "备注",
            itemStyle: {
              width: "".concat(remarkWidth, "px")
            }
          }), maishu_wuzhui_helper_1.boundField({
            dataField: "type",
            headerText: "类型",
            itemStyle: {
              width: "".concat(typeFieldWidth, "px")
            }
          }), index_1.dateTimeField({
            dataField: 'create_date_time',
            headerText: '创建时间'
          }), index_1.operationField(this.props.data.resourceId, this.permissionService, this, "".concat(operationFieldWidth, "px"))]
        }));
      }
    }]);

    return ResourceListPage;
  }(React.Component);

  exports.default = ResourceListPage; // return <>
  //     <div className="tabbable">
  //         <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
  //             <li className="pull-left">
  //                 <div style={{ fontWeight: 'bold', fontSize: 16 }}>菜单管理</div>
  //             </li>
  //             <li className="pull-right">
  //                 <button className="btn btn-primary pull-right"
  //                     onClick={() => {
  //                         this.props.app.forward('menu/item', this.props.data)
  //                     }}>
  //                     <i className="icon-plus" />
  //                     <span>添加</span>
  //                 </button>
  //             </li>
  //         </ul>
  //     </div>
  //     <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
  //         <thead>
  //             <tr>
  //                 <th style={{ width: sortFieldWidth }}>序号</th>
  //                 <th style={{ width: nameFieldWidth }}>菜单名称</th>
  //                 <th style={{}}>路径</th>
  //                 <th style={{ width: remarkWidth }}>备注</th>
  //                 <th style={{ width: typeFieldWidth }}>类型</th>
  //                 <th style={{ width: createDateTimeFieldWidth }}>创建时间</th>
  //                 <th style={{ width: operationFieldWidth + 18 }}>操作</th>
  //             </tr>
  //         </thead>
  //     </table>
  //     <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll' }}>
  //         <table className="table table-striped table-bordered table-hover"
  //             ref={e => this.dataTable = e || this.dataTable}>
  //         </table>
  //     </div>
  // </>

  {
    /* <tbody>
                          {resources.map(resource =>
                              <tr key={resource.id}>
                                  <td style={{ width: sortFieldWidth }}>{resource.sort_number}</td>
                                  <td style={{ width: nameFieldWidth, paddingLeft: `${this.parentDeep(resource) * 20 + 10}px` }}>{resource.name}</td>
                                  <td >{resource.page_path}</td>
                                  <td style={{ width: remarkWidth }} >{resource.remark}</td>
                                  <td style={{ width: typeFieldWidth, textAlign: "center" }}>{resource.type == 'menu' ? '菜单' : resource.type == 'button' ? '按钮' : ''}</td>
                                  <td style={{ width: createDateTimeFieldWidth }}>{toDateTimeString(resource.create_date_time)}</td>
                                  <td style={{ width: operationFieldWidth, textAlign: "center" }}
                                      ref={e => {
                                          if (!e) return;
                                                renderOperationButtons(this.props.data.resourceId, currentResource.children, e, currentResource, this.props.app);
                                            }}>
                                  </td>
                              </tr>
                          )}
                      </tbody> */
  }
});
