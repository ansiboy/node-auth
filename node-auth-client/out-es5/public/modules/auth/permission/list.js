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

define(["require", "exports", "assert/index", "assert/index", "react", "maishu-wuzhui-helper", "react-dom", "assert/services/index", "assert/dataSources"], function (require, exports, index_1, index_2, React, maishu_wuzhui_helper_1, ReactDOM, index_3, dataSources_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var nameFieldWidth = 280;
  var remarkWidth = 240;

  var PermissionPage =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(PermissionPage, _React$Component);

    function PermissionPage(props) {
      var _this;

      _classCallCheck(this, PermissionPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PermissionPage).call(this, props));
      _this.checkboxs = [];
      _this.ps = _this.props.createService(index_3.PermissionService);
      return _this;
    }

    _createClass(PermissionPage, [{
      key: "save",
      value: function save() {
        var checkedResourceIds = this.checkboxs.filter(function (o) {
          return o.checked;
        }).map(function (o) {
          return o.value;
        });
        return this.ps.role.resource.set(this.props.data.dataItemId, checkedResourceIds);
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {}
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
      key: "checkItem",
      value: function checkItem(menuItem) {
        var p = menuItem;

        while (p) {
          this.checkboxs.filter(function (o) {
            return o.value == p.id;
          })[0].checked = true;
          p = p.parent;
        }
      }
    }, {
      key: "loadData",
      value: function loadData() {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.ps.role.resource.ids(this.props.data.dataItemId);

                case 2:
                  this.resourceIds = _context.sent;
                  return _context.abrupt("return", {
                    resourceIds: this.resourceIds
                  });

                case 4:
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
        var _this2 = this;

        return React.createElement(index_1.PageSpiner, {
          load: function load() {
            return _this2.loadData();
          }
        }, React.createElement(index_1.PageSpinerContext.Consumer, null, function (args) {
          return React.createElement(index_2.ListPage, {
            resourceId: _this2.props.data.resourceId,
            context: _this2,
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
            columns: [index_1.sortNumberField(), index_1.customDataField({
              headerText: '菜单名称',
              itemStyle: {
                width: "".concat(nameFieldWidth, "px")
              },
              render: function render(item, element) {
                ReactDOM.render(React.createElement("div", {
                  style: {
                    paddingLeft: _this2.parentDeep(item) * 20 + 10
                  }
                }, React.createElement("div", {
                  className: "checkbox",
                  style: {
                    margin: 0
                  }
                }, React.createElement("label", null, React.createElement("input", {
                  type: "checkbox",
                  value: item.id,
                  ref: function ref(e) {
                    if (!e) return;

                    _this2.checkboxs.push(e);

                    e.checked = _this2.resourceIds.indexOf(item.id) >= 0;

                    e.onchange = function () {
                      e.checked ? _this2.checkItem(item) : null;
                    };
                  }
                }), React.createElement("span", null, item.name)))), element);
              }
            }), maishu_wuzhui_helper_1.boundField({
              dataField: "page_path",
              headerText: "路径"
            }), maishu_wuzhui_helper_1.boundField({
              dataField: "remark",
              headerText: "备注",
              itemStyle: {
                width: "".concat(remarkWidth, "px")
              }
            }), index_1.dateTimeField({
              dataField: 'create_date_time',
              headerText: '创建时间'
            })]
          });
        }));
      }
    }]);

    return PermissionPage;
  }(React.Component);

  exports.default = PermissionPage;
}); // import React = require("react");
// import { createGridView, boundField, customField } from "maishu-wuzhui-helper";
// import { DataSource, GridViewDataCell, GridView } from "maishu-wuzhui";
// import ReactDOM = require("react-dom");
// import * as ui from 'maishu-ui-toolkit'
// import { PermissionService } from "assert/services/index";
// import { ItemPageProps, customDataField } from "assert/index";
// import { AppService } from "assert/service";
// import { Resource } from "entities";
// type Item = Resource & { children?: Item[], selected?: boolean }
// interface State {
//     // resources: Item[],
//     title: string,
//     // selectedResourceIds: string[]
//     platformSelectAll: boolean,
//     distributorSelectAll: boolean
// }
// export default class PermissionPage extends React.Component<ItemPageProps<Item>, State>{
//     resourceTable: HTMLTableElement;
//     gridView: GridView<Resource>;
//     resources: Item[];
//     dataSource: DataSource<Resource>;
//     constructor(props) {
//         super(props)
//         this.state = { title: '', platformSelectAll: false, distributorSelectAll: false }
//         let ps = this.props.createService(PermissionService)
//         let roleId = this.props.data.id
//         ps.role.item(roleId).then(async role => {
//             this.setState({ title: `${role.name}权限` })
//         })
//     }
//     selectAll(category: any, checked: boolean) {
//         let resources = this.resources;//.filter(o => o.category == category)
//         for (let i = 0; i < resources.length; i++) {
//             resources[i].selected = true
//             for (let j = 0; j < resources[i].children.length; j++) {
//                 let dataItem = (resources[i].children[j] as Item)
//                 dataItem.selected = checked
//             }
//             this.dataSource.updated.fire(this.dataSource, resources[i])
//         }
//     }
//     createDataSource(resources: Resource[]) {
//         // let roleId = this.props.data.id
//         // if (roleId == PLATFORM_ADMIN_ROLE_ID)
//         //     resources = resources.filter(o => o.category == 'platform')
//         // else
//         //     resources = resources.filter(o => o.category == 'distributor')
//         let ds = new DataSource<Resource>({
//             async select(args) {
//                 if (args.sortExpression) {
//                     let arr = args.sortExpression.split(/\s+/)
//                     let field = arr[0]
//                     let orderType = arr[1] || 'asc'
//                     if (orderType == 'asc') {
//                         resources.sort((c1, c2) => c1[field] <= c2[field] ? 1 : -1)
//                     }
//                     else {
//                         resources.sort((c1, c2) => c1[field] > c2[field] ? 1 : -1)
//                     }
//                 }
//                 let dataItems = resources.slice(args.startRowIndex, args.startRowIndex + args.maximumRows)
//                 let result = { dataItems, totalRowCount: resources.length }
//                 return result
//             }
//         })
//         ds.updated.add(() => {
//             this.checkIsSelectAll(resources)
//         })
//         this.checkIsSelectAll(resources)
//         return ds
//     }
//     checkIsSelectAll(resources: Item[]) {
//         // let platformCommands: Item[] = []
//         // resources.filter(o => o.category == 'platform')
//         //     .forEach((o: Item) => platformCommands.push(...o.children))
//         // let platformSelectAll = platformCommands.filter(o => o.selected).length == platformCommands.length
//         // let distributorCommands: Item[] = []
//         // resources.filter(o => o.category == 'distributor')
//         //     .forEach((o: Item) => distributorCommands.push(...o.children))
//         // let distributorSelectAll = distributorCommands.filter(o => o.selected).length == distributorCommands.length
//         // this.setState({ platformSelectAll, distributorSelectAll })
//     }
//     async createGridView(table: HTMLTableElement) {
//         let ps = this.props.createService(PermissionService);
//         let appService = ps.createService(AppService);
//         let menuItems = await appService.menuList();
//         // menuItems.reverse();
//         let resources: Item[] = [];
//         while (menuItems.length > 0) {
//             let menuItem = menuItems.shift();
//             resources.push(menuItem);
//             menuItem.children.filter(o => o.type == "menu").forEach(c => resources.push(c));
//         }
//         resources.forEach(c => {
//             c.children = c.children.filter(o => o.type == "control");
//         })
//         // resources.reverse();
//         let ds = this.dataSource = this.createDataSource(resources)
//         // let items: { [value: string]: string } = {};
//         // for (let i = 0; i < categroyNames.length; i++) {
//         //     items[categroyNames[i].name] = categroyNames[i].value
//         // }
//         let gridView = createGridView({
//             dataSource: ds,
//             element: table,
//             columns: [
//                 boundField({ dataField: 'name', headerText: '名称', sortExpression: 'name' }),
//                 // valueTextField({
//                 //     dataField: 'category', headerText: '类型', sortExpression: 'category',
//                 //     items
//                 // }),
//                 // customDataField({
//                 //     headerText: '类型',
//                 //     render: (dataItem: Resource, element: HTMLElement) => {
//                 //         let item = categroyNames.filter(o => o.value == dataItem.category)[0]
//                 //         if (item)
//                 //             return item.name
//                 //         return dataItem.category
//                 //     }
//                 // }),
//                 customField({
//                     headerText: '权限',
//                     createItemCell(dataItem: Item) {
//                         let cell = new GridViewDataCell({
//                             render(dataItem: Item, element: HTMLElement) {
//                                 let children = dataItem.children || []
//                                 ReactDOM.render(<>
//                                     <span className="checkbox" key={dataItem.id} style={{ marginRight: 20 }}>
//                                         <input type="checkbox" checked={dataItem.selected == true}
//                                             onChange={e => {
//                                                 dataItem.selected = e.target.checked
//                                                 ds.updated.fire(ds, dataItem)
//                                             }} />
//                                         浏览
//                                     </span>
//                                     {children.map(c =>
//                                         <span className="checkbox" key={c.id} style={{ marginRight: 20 }}>
//                                             <input type="checkbox" checked={c.selected == true}
//                                                 onChange={e => {
//                                                     c.selected = e.target.checked
//                                                     ds.updated.fire(ds, dataItem)
//                                                 }} />
//                                             {c.name}
//                                         </span>
//                                     )}
//                                 </>, element)
//                             }
//                         })
//                         return cell;
//                     }
//                 }),
//                 customField({
//                     headerText: '操作',
//                     itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
//                     createItemCell() {
//                         let cell = new GridViewDataCell({
//                             render(dataItem: Item, element: HTMLElement) {
//                                 let children = dataItem.children || []
//                                 // if (children.length == 0) {
//                                 //     return
//                                 // }
//                                 ReactDOM.render(<span className="checkbox">
//                                     <input type="checkbox"
//                                         checked={children.length == children.filter(o => o.selected).length && dataItem.selected == true}
//                                         onChange={e => {
//                                             dataItem.selected = e.target.checked
//                                             children.forEach(o => o.selected = e.target.checked)
//                                             ds.updated.fire(ds, dataItem)
//                                         }} />
//                                     全选
//                             </span>, cell.element)
//                             }
//                         })
//                         return cell
//                     }
//                 })
//             ],
//             pageSize: null
//         })
//         let roleId = this.props.data.id
//         ps.role.resource.ids(roleId).then(ids => {
//             for (let i = 0; i < resources.length; i++) {
//                 resources[i].selected = ids.indexOf(resources[i].id) >= 0
//                 for (let j = 0; j < resources[i].children.length; j++) {
//                     let child = (resources[i].children[j] as Item)
//                     child.selected = ids.indexOf(child.id) >= 0
//                 }
//                 ds.updated.fire(ds, resources[i])
//             }
//         })
//         return gridView
//     }
//     save() {
//         let roleId = this.props.data.id
//         let ps = this.props.createService(PermissionService)
//         let selectedResourceIds: string[] = []
//         this.resources.forEach(r => {
//             let selectedChildIds = r.children.filter(o => (o as Item).selected).map(o => o.id);
//             if (selectedChildIds.length > 0) {
//                 selectedResourceIds.push(...selectedChildIds)
//                 // selectedResourceIds.push(r.id)
//             }
//             if (r.selected) {
//                 selectedResourceIds.push(r.id)
//             }
//         })
//         let result = ps.role.resource.set(roleId, selectedResourceIds)
//         return result
//     }
//     async componentDidMount() {
//         this.gridView = await this.createGridView(this.resourceTable)
//     }
//     render() {
//         let roleId = this.props.data.id
//         let { title, platformSelectAll, distributorSelectAll } = this.state
//         return <div className="role-permission">
//             <div className="tabbable">
//                 <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
//                     <li className="pull-left">
//                         <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
//                     </li>
//                     <li className="pull-right">
//                         <button className="btn btn-primary"
//                             ref={e => {
//                                 if (!e) return
//                                 ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' })
//                             }}>
//                             <i className="icon-save" />
//                             <span>保存</span>
//                         </button>
//                         <button className="btn btn-primary" onClick={() => this.props.app.back()}>
//                             <i className="icon-reply" ></i>
//                             <span>返回</span>
//                         </button>
//                     </li>
//                 </ul>
//             </div>
//             <div style={{ overflowY: 'auto' }}
//                 ref={e => {
//                     if (!e) return
//                     const SIZE = 180
//                     if (window.innerHeight > SIZE)
//                         e.style.height = `${window.innerHeight - SIZE}px`
//                     window.addEventListener('resize', () => {
//                         if (window.innerHeight > SIZE)
//                             e.style.height = `${window.innerHeight - SIZE}px`
//                     })
//                 }}>
//                 <table ref={e => this.resourceTable = e || this.resourceTable}>
//                 </table>
//             </div>
//             {/* <div style={{ paddingTop: 10 }}>
//                 {roleId == PLATFORM_ADMIN_ROLE_ID ?
//                     <span className="checkbox" style={{ marginRight: 20, display: 'none' }} >
//                         <input type="checkbox" checked={platformSelectAll}
//                             onChange={e => this.selectAll('platform', e.target.checked)} />
//                         全选
//                     </span> :
//                     <span className="checkbox" style={{ display: 'none' }}>
//                         <input type="checkbox" checked={distributorSelectAll}
//                             onChange={e => this.selectAll('distributor', e.target.checked)} />
//                         全选
//                     </span>
//                 }
//             </div> */}
//         </div>
//     }
// }
