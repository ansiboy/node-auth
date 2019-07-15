"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

define(["require", "exports", "react", "./master-page", "./names", "assert/errors", "assert/services/index", "assert/dataSources"], function (require, exports, React, master_page_1, names_1, errors_1, index_1, dataSources_1) {
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
      var username = index_1.Service.loginInfo.value ? index_1.Service.loginInfo.value.username : "";
      _this.state = {
        menus: [],
        username: username
      };
      _this.app = props.app;
      _this.ps = _this.app.createService(index_1.PermissionService);
      return _this;
    }

    _createClass(MainMasterPage, [{
      key: "showPageByNode",
      value: function showPageByNode(node) {
        var children = node.children || [];

        if (!node.page_path && (node.children || []).length > 0) {
          this.showPageByNode(children[0]);
          return;
        }

        var pagePath = node.page_path;

        if (pagePath == null && children.length > 0) {
          node = children[0];
          pagePath = node.page_path;
        }

        if (!pagePath) {
          console.log("MenuItem ".concat(node.name, " page name is empty."));
          return;
        }

        if (pagePath.startsWith("#")) {
          pagePath = pagePath.substr(1);
          this.app.redirect(pagePath, {
            resourceId: node.id
          });
          return;
        }

        throw errors_1.errors.notImplement();
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

          if (item.page_path) {
            var obj = this.app.parseUrl(item.page_path) || {
              pageName: ''
            };
            if (obj.pageName == pageName) return item;
          }

          var children = item.children || [];
          stack.push.apply(stack, _toConsumableArray(children));
        }

        return null;
      }
    }, {
      key: "logout",
      value: function logout() {
        var s = this.app.createService(index_1.PermissionService);
        s.user.logout();
        location.href = "?".concat(Date.now(), "#login");
      } // loadMenuItmes() {
      //     this.ps.resource.list().then(resources => {
      //         let menuItems = translateToMenuItems(resources).filter(o => o.parent == null);
      //         this.setState({ menus: menuItems });
      //     })
      // }

      /**
       * 加载用户登录后所要显示的数据
       */

    }, {
      key: "loadUserData",
      value: function loadUserData(loginInfo) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var role;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.ps.resource.list().then(function (resources) {
                    var menuItems = dataSources_1.translateToMenuItems(resources).filter(function (o) {
                      return o.parent == null;
                    });

                    _this2.setState({
                      menus: menuItems
                    });
                  });
                  this.setState({
                    username: loginInfo.username
                  });

                  if (!loginInfo.roleId) {
                    _context.next = 7;
                    break;
                  }

                  _context.next = 5;
                  return this.ps.role.item(loginInfo.roleId);

                case 5:
                  role = _context.sent;

                  if (role) {
                    this.setState({
                      roleName: role.name
                    });
                  }

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      }
    }, {
      key: "clearUserData",
      value: function clearUserData() {
        this.setState({
          menus: [],
          username: null,
          roleName: null
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this3 = this;

        this.app.pageCreated.add(function (sender, page) {
          page.shown.add(function () {
            _this3.setState({
              currentPageName: page.name
            });

            _this3.setState({
              resourceId: page.data.resourceId || page.data.resource_id
            });
          });
        });
        index_1.Service.loginInfo.attach(function (value) {
          if (value) {
            _this3.loadUserData(value);
          } else {
            _this3.clearUserData();
          }
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this4 = this;

        var _this$state = this.state,
            menuData = _this$state.menus,
            username = _this$state.username,
            roleName = _this$state.roleName;
        var currentPageName = this.state.currentPageName || '';
        var firstLevelNodes = menuData.filter(function (o) {
          return o.type == "menu";
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
          return o.type == "menu";
        }).length == 0) {
          nodeClassName = 'hideSecond';
        }

        return React.createElement("div", {
          className: "".concat(nodeClassName),
          ref: function ref(e) {
            return _this4.element = e || _this4.element;
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
              display: o.type != "menu" ? "none" : ''
            },
            onClick: function onClick() {
              return _this4.showPageByNode(o);
            }
          }, React.createElement("i", {
            className: o.icon
          }), React.createElement("span", null, o.name));
        }))), React.createElement("div", {
          className: "second"
        }, React.createElement("ul", {
          className: "list-group"
        }, (firstLevelNode ? firstLevelNode.children || [] : []).filter(function (o) {
          return o.type == "menu";
        }).map(function (o, i) {
          return React.createElement("li", {
            key: i,
            className: o == secondLevelNode ? "list-group-item active" : "list-group-item",
            style: {
              cursor: 'pointer',
              display: o.type != "menu" ? "none" : ''
            },
            onClick: function onClick() {
              return _this4.showPageByNode(o);
            }
          }, React.createElement("i", {
            className: o.icon
          }), React.createElement("span", null, o.name));
        }))), React.createElement("div", {
          className: "main",
          ref: function ref(e) {
            if (e == null) return; // e.appendChild(this.pageContainer)
          }
        }, React.createElement("nav", {
          className: "navbar navbar-default"
        }, React.createElement("ul", {
          className: "toolbar"
        }, this.state.toolbar, React.createElement("li", {
          className: "light-blue pull-right",
          onClick: function onClick() {
            return _this4.logout();
          }
        }, React.createElement("i", {
          className: "icon-off"
        }), React.createElement("span", {
          style: {
            paddingLeft: 4,
            cursor: "pointer"
          }
        }, "\u9000\u51FA")), React.createElement("li", {
          className: "light-blue pull-right",
          style: {
            marginRight: 10
          }
        }, username || "", roleName ? "  (".concat(roleName, ")") : ""))), React.createElement("div", {
          className: "page-container",
          ref: function ref(e) {
            return _this4.pageContainer = e || _this4.pageContainer;
          }
        })));
      }
    }]);

    return MainMasterPage;
  }(master_page_1.MasterPage);

  exports.MainMasterPage = MainMasterPage;
});
