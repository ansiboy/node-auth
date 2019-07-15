"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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

define(["require", "exports", "maishu-wuzhui", "./services/index", "error-handle"], function (require, exports, maishu_wuzhui_1, index_1, error_handle_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var permissionService = new index_1.PermissionService(function (error) {
    return error_handle_1.default(error);
  });

  var MyDataSource =
  /*#__PURE__*/
  function (_maishu_wuzhui_1$Data) {
    _inherits(MyDataSource, _maishu_wuzhui_1$Data);

    function MyDataSource(params) {
      var _this;

      _classCallCheck(this, MyDataSource);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MyDataSource).call(this, params));

      if (params.item == null) {
        params.item = function (id) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var filter, args, r;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    filter = "id = '".concat(id, "'");
                    args = new maishu_wuzhui_1.DataSourceSelectArguments();
                    args.filter = filter;
                    _context.next = 5;
                    return this.executeSelect(args);

                  case 5:
                    r = _context.sent;
                    return _context.abrupt("return", r.dataItems[0]);

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
        };
      }

      _this.getItem = params.item;
      return _this;
    }

    return MyDataSource;
  }(maishu_wuzhui_1.DataSource);

  exports.MyDataSource = MyDataSource;

  function createRoleDataSource() {
    var roleDataSource = new MyDataSource({
      primaryKeys: ['id'],
      select: function select() {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2() {
          var roles;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return permissionService.role.list();

                case 2:
                  roles = _context2.sent;
                  return _context2.abrupt("return", {
                    dataItems: roles,
                    totalRowCount: roles.length
                  });

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));
      },
      item: function item(id) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3() {
          var role;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return permissionService.role.item(id);

                case 2:
                  role = _context3.sent;
                  return _context3.abrupt("return", role);

                case 4:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));
      },
      insert: function insert(item) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4() {
          var r;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return permissionService.role.add(item);

                case 2:
                  r = _context4.sent;
                  return _context4.abrupt("return", r);

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));
      },
      delete: function _delete(item) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee5() {
          var r;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return permissionService.role.remove(item.id);

                case 2:
                  r = _context5.sent;
                  return _context5.abrupt("return", r);

                case 4:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));
      },
      update: function update(item) {
        return __awaiter(this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee6() {
          var r;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return permissionService.role.update(item);

                case 2:
                  r = _context6.sent;
                  return _context6.abrupt("return", r);

                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));
      }
    });
    return roleDataSource;
  }

  function translateToMenuItems(resources) {
    var arr = new Array();

    var stack = _toConsumableArray(resources.filter(function (o) {
      return o.parent_id == null;
    }).reverse());

    var _loop = function _loop() {
      var item = stack.pop();
      item.children = resources.filter(function (o) {
        return o.parent_id == item.id;
      });

      if (item.parent_id) {
        item.parent = resources.filter(function (o) {
          return o.id == item.parent_id;
        })[0];
      }

      stack.push.apply(stack, _toConsumableArray(item.children.reverse()));
      arr.push(item);
    };

    while (stack.length > 0) {
      _loop();
    }

    var ids = arr.map(function (o) {
      return o.id;
    });

    var _loop2 = function _loop2(i) {
      var item = arr.filter(function (o) {
        return o.id == ids[i];
      })[0];
      console.assert(item != null);

      if (item.children.length > 1) {
        item.children.sort(function (a, b) {
          return a.sort_number < b.sort_number ? -1 : 1;
        });
      }
    };

    for (var i = 0; i < ids.length; i++) {
      _loop2(i);
    }

    return arr;
  }

  exports.translateToMenuItems = translateToMenuItems;

  function createUserDataSource() {
    var _this2 = this;

    var userDataSource = new MyDataSource({
      primaryKeys: ["id"],
      select: function select(args) {
        return __awaiter(_this2, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee7() {
          var r;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return permissionService.user.list(args);

                case 2:
                  r = _context7.sent;
                  r.dataItems.forEach(function (o) {
                    o.data = o.data || {};
                  });
                  return _context7.abrupt("return", r);

                case 5:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));
      },
      update: function update(item) {
        return __awaiter(_this2, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee8() {
          var r;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return permissionService.user.update(item);

                case 2:
                  r = _context8.sent;
                  return _context8.abrupt("return", r);

                case 4:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8);
        }));
      },
      insert: function insert(item) {
        return __awaiter(_this2, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee9() {
          var roleIds, r;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return permissionService.user.add(item, roleIds);

                case 2:
                  r = _context9.sent;
                  return _context9.abrupt("return", r);

                case 4:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9);
        }));
      },
      delete: function _delete(item) {
        return __awaiter(_this2, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee10() {
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  return _context10.abrupt("return", permissionService.user.remove(item.id));

                case 1:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10);
        }));
      }
    });
    return userDataSource;
  }

  exports.createUserDataSource = createUserDataSource;

  function createTokenDataSource() {
    var _this3 = this;

    var tokenDataSource = new MyDataSource({
      primaryKeys: ["id"],
      select: function select(args) {
        return __awaiter(_this3, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee11() {
          var r;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return permissionService.token.list(args);

                case 2:
                  r = _context11.sent;
                  return _context11.abrupt("return", r);

                case 4:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11);
        }));
      },
      insert: function insert(item) {
        return __awaiter(_this3, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee12() {
          var r;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return permissionService.token.add(item);

                case 2:
                  r = _context12.sent;
                  return _context12.abrupt("return", r);

                case 4:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12);
        }));
      }
    });
    return tokenDataSource;
  }

  function createPathDataSource() {
    var _this4 = this;

    var dataSource = new MyDataSource({
      primaryKeys: ["id"],
      select: function select(args) {
        return __awaiter(_this4, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee13() {
          var r;
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  _context13.next = 2;
                  return permissionService.path.list();

                case 2:
                  r = _context13.sent;
                  return _context13.abrupt("return", {
                    dataItems: r,
                    totalRowCount: r.length
                  });

                case 4:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13);
        }));
      }
    });
    return dataSource;
  }

  function createResourceDataSource() {
    var _this5 = this;

    var dataSource = new MyDataSource({
      primaryKeys: ["id"],
      select: function select(args) {
        return __awaiter(_this5, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee14() {
          var r;
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  _context14.next = 2;
                  return permissionService.resource.list();

                case 2:
                  r = _context14.sent;
                  return _context14.abrupt("return", {
                    dataItems: r,
                    totalRowCount: r.length
                  });

                case 4:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14);
        }));
      },
      item: function item(id) {
        return __awaiter(_this5, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee15() {
          var r;
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.next = 2;
                  return permissionService.resource.item(id);

                case 2:
                  r = _context15.sent;
                  debugger;
                  return _context15.abrupt("return", r);

                case 5:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15);
        }));
      },
      update: function update(item) {
        return __awaiter(_this5, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee16() {
          var menuItem, r;
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  item = Object.assign({}, item);
                  menuItem = item;
                  delete menuItem.children;
                  delete menuItem.parent;
                  _context16.next = 6;
                  return permissionService.resource.update(item);

                case 6:
                  r = _context16.sent;
                  return _context16.abrupt("return", r);

                case 8:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16);
        }));
      },
      insert: function insert(item) {
        return __awaiter(_this5, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee17() {
          var r;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return permissionService.resource.add(item);

                case 2:
                  r = _context17.sent;
                  return _context17.abrupt("return", r);

                case 4:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17);
        }));
      },
      delete: function _delete(item) {
        return __awaiter(_this5, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee18() {
          var r;
          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _context18.next = 2;
                  return permissionService.resource.remove(item.id);

                case 2:
                  r = _context18.sent;
                  return _context18.abrupt("return", r);

                case 4:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18);
        }));
      }
    });
    return dataSource;
  }

  function createModuleDataSource() {
    var _this6 = this;

    var dataSource = new maishu_wuzhui_1.DataSource({
      primaryKeys: ["id"],
      select: function select() {
        return __awaiter(_this6, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee19() {
          var _ref, _ref2, resources, paths, resourcePaths, dataItems;

          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  _context19.next = 2;
                  return Promise.all([permissionService.resource.list(), permissionService.path.list(), permissionService.resourcePaths.list()]);

                case 2:
                  _ref = _context19.sent;
                  _ref2 = _slicedToArray(_ref, 3);
                  resources = _ref2[0];
                  paths = _ref2[1];
                  resourcePaths = _ref2[2];
                  dataItems = translateToMenuItems(resources);
                  dataItems.forEach(function (dataItem) {
                    var pathIds = resourcePaths.filter(function (o) {
                      return o.resource_id == dataItem.id;
                    }).map(function (o) {
                      return o.path_id;
                    });
                    dataItem.paths = paths.filter(function (o) {
                      return pathIds.indexOf(o.id) >= 0;
                    });
                  });
                  return _context19.abrupt("return", {
                    dataItems: dataItems,
                    totalRowCount: dataItems.length
                  });

                case 10:
                case "end":
                  return _context19.stop();
              }
            }
          }, _callee19);
        }));
      },
      update: function update(dataItem) {
        return __awaiter(_this6, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee20() {
          return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
              switch (_context20.prev = _context20.next) {
                case 0:
                  _context20.next = 2;
                  return permissionService.resource.path.set(dataItem.id, dataItem.paths.map(function (o) {
                    return o.value;
                  }));

                case 2:
                case "end":
                  return _context20.stop();
              }
            }
          }, _callee20);
        }));
      }
    });
    return dataSource;
  }

  var DataSources = function DataSources() {
    _classCallCheck(this, DataSources);

    this.role = createRoleDataSource();
    this.user = createUserDataSource();
    this.token = createTokenDataSource();
    this.path = createPathDataSource();
    this.resource = createResourceDataSource();
    this.module = createModuleDataSource();
  };

  exports.DataSources = DataSources;
  exports.dataSources = new DataSources();
});
