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

define(["require", "exports", "react", "./master-page", "./names"], function (require, exports, React, master_page_1, names_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var MainMasterPage =
  /*#__PURE__*/
  function (_master_page_1$Master) {
    _inherits(MainMasterPage, _master_page_1$Master);

    function MainMasterPage(props) {
      var _this;

      _classCallCheck(this, MainMasterPage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MainMasterPage).call(this, props));
      _this.name = names_1.masterPageNames.main;
      _this.state = {
        menus: []
      }; // this.pageContainer = document.createElement('div')
      // this.pageContainer.className = 'page-container'

      _this.app = props.app; // this.app = new Application(this.pageContainer)

      return _this;
    }

    _createClass(MainMasterPage, [{
      key: "showPageByNode",
      value: function showPageByNode(node) {
        var children = node.children || [];

        if (!node.path && (node.children || []).length > 0) {
          this.showPageByNode(children[0]);
          return;
        }

        var pageName = node.path;

        if (pageName == null && children.length > 0) {
          node = children[0];
          pageName = node.name;
        }

        if (pageName == null && children.length > 0) {
          node = children[0];
          pageName = node.name;
        }

        if (pageName) {
          this.app.redirect(pageName);
          return;
        }

        console.log("MenuItem ".concat(node.name, " page name is empty."));
      }
    }, {
      key: "findMenuItemByResourceId",
      value: function findMenuItemByResourceId(menuItems, resourceId) {
        var stack = new Array();
        stack.push.apply(stack, _toConsumableArray(menuItems));

        while (stack.length > 0) {
          var item = stack.pop();
          if (item == null) return;
          if (item.id == resourceId) return item;
          var children = item.children || [];
          stack.push.apply(stack, _toConsumableArray(children));
        }

        return null;
      }
    }, {
      key: "findMenuItemByPageName",
      value: function findMenuItemByPageName(menuItems, pageName) {
        var stack = new Array();
        stack.push.apply(stack, _toConsumableArray(menuItems));

        while (stack.length > 0) {
          var item = stack.pop();
          if (item == null) throw new Error("item is null");

          if (item.path) {
            var obj = this.app.parseUrl(item.path) || {
              pageName: ''
            };
            if (obj.pageName == pageName) return item;
          }

          var children = item.children || [];
          stack.push.apply(stack, _toConsumableArray(children));
        }

        return null;
      }
      /** 设置工具栏 */

    }, {
      key: "setToolbar",
      value: function setToolbar(toolbar) {
        this.setState({
          toolbar: toolbar
        });
      }
      /** 设置菜单 */

    }, {
      key: "setMenus",
      value: function setMenus(menus) {
        menus = menus || [];

        var stack = _construct(Array, _toConsumableArray(menus));

        while (stack.length > 0) {
          var item = stack.pop();

          if (item.path) {
            var arr = item.path.split('/');

            if (item.path.indexOf('?') >= 0) {
              item.path = "".concat(item.path, "&resourceId=").concat(item.id);
            } else {
              item.path = "".concat(item.path, "?resourceId=").concat(item.id);
            }
          }

          stack.push.apply(stack, _toConsumableArray(item.children || []));
        }

        var currentPageName = this.app.currentPage ? this.app.currentPage.name : undefined;
        var resourceId = this.app.currentPage ? this.app.currentPage.data.resourceId || this.app.currentPage.data.resource_id : undefined;
        this.setState({
          menus: menus,
          currentPageName: currentPageName,
          resourceId: resourceId
        });
      }
      /** 获取菜单 */

    }, {
      key: "getMenus",
      value: function getMenus() {
        return this.state.menus || [];
      }
    }, {
      key: "setHideMenuPages",
      value: function setHideMenuPages(pageNames) {
        this.setState({
          hideMenuPages: pageNames || []
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        // this.app = new Application(this)
        this.app.pageCreated.add(function (sender, page) {
          page.shown.add(function () {
            _this2.setState({
              currentPageName: page.name
            });

            _this2.setState({
              resourceId: page.data.resourceId || page.data.resource_id
            });
          });
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var menuData = this.state.menus;
        var currentPageName = this.state.currentPageName || '';
        var firstLevelNodes = menuData.filter(function (o) {
          return o.visible == null || o.visible == true;
        });
        var currentNode;

        if (this.state.resourceId) {
          currentNode = this.findMenuItemByResourceId(firstLevelNodes, this.state.resourceId);
        } else if (currentPageName) {
          currentNode = this.findMenuItemByPageName(firstLevelNodes, currentPageName);
        }

        var firstLevelNode = null;
        var secondLevelNode;

        if (currentNode != null) {
          if (currentNode.parent == null) {
            firstLevelNode = currentNode;
          } else if (currentNode.parent.parent == null) {
            //二级菜单
            firstLevelNode = currentNode.parent;
            secondLevelNode = currentNode;
          } else if (currentNode.parent.parent.parent == null) {
            //三级菜单
            firstLevelNode = currentNode.parent.parent;
            secondLevelNode = currentNode.parent;
          }
        }

        var nodeClassName = '';
        var hideMenuPages = this.state.hideMenuPages || [];

        if (hideMenuPages.indexOf(currentPageName) >= 0) {
          nodeClassName = 'hideFirst';
        } else if (firstLevelNode == null || (firstLevelNode.children || []).filter(function (o) {
          return o.visible != false;
        }).length == 0) {
          nodeClassName = 'hideSecond';
        }

        return React.createElement("div", {
          className: "".concat(nodeClassName),
          ref: function ref(e) {
            return _this3.element = e || _this3.element;
          }
        }, React.createElement("div", {
          className: "first"
        }, React.createElement("ul", {
          className: "list-group"
        }, firstLevelNodes.map(function (o, i) {
          return React.createElement("li", {
            key: i,
            className: o == firstLevelNode ? "list-group-item active" : "list-group-item",
            style: {
              cursor: 'pointer',
              display: o.visible == false ? "none" : ''
            },
            onClick: function onClick() {
              return _this3.showPageByNode(o);
            }
          }, React.createElement("i", {
            className: o.icon
          }), React.createElement("span", null, o.name));
        }))), React.createElement("div", {
          className: "second"
        }, React.createElement("ul", {
          className: "list-group"
        }, (firstLevelNode ? firstLevelNode.children || [] : []).filter(function (o) {
          return o.visible != false;
        }).map(function (o, i) {
          return React.createElement("li", {
            key: i,
            className: o == secondLevelNode ? "list-group-item active" : "list-group-item",
            style: {
              cursor: 'pointer',
              display: o.visible == false ? "none" : ''
            },
            onClick: function onClick() {
              return _this3.showPageByNode(o);
            }
          }, React.createElement("span", null, o.name));
        }))), React.createElement("div", {
          className: "main",
          ref: function ref(e) {
            if (e == null) return; // e.appendChild(this.pageContainer)
          }
        }, React.createElement("nav", {
          className: "navbar navbar-default"
        }, this.state.toolbar), React.createElement("div", {
          className: "page-container",
          ref: function ref(e) {
            return _this3.pageContainer = e || _this3.pageContainer;
          }
        })));
      }
    }, {
      key: "application",
      get: function get() {
        return this.app;
      }
    }]);

    return MainMasterPage;
  }(master_page_1.MasterPage);

  exports.MainMasterPage = MainMasterPage;
});
