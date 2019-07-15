"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

define(["require", "exports", "./service", "../errors", "../events", "js-md5"], function (require, exports, service_1, errors_1, events_1, md5) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var PermissionService =
  /*#__PURE__*/
  function (_service_1$Service) {
    _inherits(PermissionService, _service_1$Service);

    function PermissionService() {
      var _this;

      _classCallCheck(this, PermissionService);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PermissionService).apply(this, arguments));
      _this.role = {
        /**
         * 获取角色列表
         */
        list: function list() {
          var url = _this.url("role/list");

          return _this.get(url);
        },

        /**
         * 获取单个角色
         * @param id 要获取的角色编号
         */
        item: function item(id) {
          var url = _this.url("role/item");

          return _this.get(url, {
            id: id
          });
        },

        /**
         * 添加角色
         * @param name 要添加的角色名称
         * @param remark 要添加的角色备注
         */
        add: function add(item) {
          var url = _this.url("role/add");

          return _this.postByJson(url, {
            item: item
          });
        },

        /**
         * 删除角色
         * @param id 要删除的角色编号
         */
        remove: function remove(id) {
          var url = _this.url("role/remove");

          return _this.postByJson(url, {
            id: id
          });
        },
        update: function update(item) {
          var url = _this.url("role/update");

          return _this.postByJson(url, {
            item: item
          });
        },
        resource: {
          /**
           * 获取角色所允许访问的资源 id
           * @param roleId 指定的角色编号
           */
          ids: function ids(roleId) {
            return __awaiter(_assertThisInitialized(_this), void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              var url, r;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (roleId) {
                        _context.next = 2;
                        break;
                      }

                      throw errors_1.errors.argumentNull('roleId');

                    case 2:
                      url = this.url('role/resource/ids');
                      _context.next = 5;
                      return this.getByJson(url, {
                        roleId: roleId
                      });

                    case 5:
                      r = _context.sent;
                      return _context.abrupt("return", r || []);

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));
          },

          /**
            *
            * @param roleId 指定的角色编号
            * @param resourceIds 角色所允许访问的资源编号
            */
          set: function set(roleId, resourceIds) {
            return __awaiter(_assertThisInitialized(_this), void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee2() {
              var url;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (roleId) {
                        _context2.next = 2;
                        break;
                      }

                      throw errors_1.errors.argumentNull('roleId');

                    case 2:
                      if (resourceIds) {
                        _context2.next = 4;
                        break;
                      }

                      throw errors_1.errors.argumentNull('resourceIds');

                    case 4:
                      url = this.url('role/resource/set');
                      return _context2.abrupt("return", this.postByJson(url, {
                        roleId: roleId,
                        resourceIds: resourceIds
                      }));

                    case 6:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2, this);
            }));
          }
        }
      };

      _this.resource = function () {
        var allResources = null;
        var listExecuting = false;
        var listPromiseStack = [];

        function deepClone(obj) {
          if (obj == null) return null;
          var value = JSON.parse(JSON.stringify(obj));
          value = service_1.Service.travelJSON(value);
          return value;
        }

        return {
          list: function list() {
            return __awaiter(_assertThisInitialized(_this), void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee3() {
              var result, url;
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (!(allResources == null)) {
                        _context3.next = 20;
                        break;
                      }

                      result = new Promise(function (resolve, reject) {
                        listPromiseStack.push({
                          resolve: resolve,
                          reject: reject
                        });
                      });

                      if (!listExecuting) {
                        _context3.next = 4;
                        break;
                      }

                      return _context3.abrupt("return", result);

                    case 4:
                      listExecuting = true;
                      url = this.url("resource/list");
                      _context3.prev = 6;
                      _context3.next = 9;
                      return this.get(url);

                    case 9:
                      allResources = _context3.sent;
                      listPromiseStack.forEach(function (o) {
                        return o.resolve(deepClone(allResources));
                      });
                      _context3.next = 17;
                      break;

                    case 13:
                      _context3.prev = 13;
                      _context3.t0 = _context3["catch"](6);
                      listPromiseStack.forEach(function (o) {
                        return o.reject(_context3.t0);
                      });
                      throw _context3.t0;

                    case 17:
                      _context3.prev = 17;
                      listExecuting = false;
                      return _context3.finish(17);

                    case 20:
                      return _context3.abrupt("return", deepClone(allResources));

                    case 21:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, this, [[6, 13, 17, 20]]);
            }));
          },
          item: function item(id) {
            return __awaiter(_assertThisInitialized(_this), void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee4() {
              var all, item;
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return this.resource.list();

                    case 2:
                      all = _context4.sent;
                      item = all.filter(function (o) {
                        return o.id == id;
                      })[0];
                      return _context4.abrupt("return", deepClone(item));

                    case 5:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4, this);
            }));
          },
          remove: function remove(id) {
            var url = _this.url("resource/remove");

            return _this.post(url, {
              id: id
            }).then(function (r) {
              allResources = allResources.filter(function (o) {
                return o.id != id;
              });
              return r;
            });
          },
          add: function add(item) {
            var url = _this.url("resource/add");

            return _this.postByJson(url, {
              item: item
            }).then(function (o) {
              item = Object.assign(item, o);
              allResources.push(item);
              return o;
            });
          },
          update: function update(item) {
            return __awaiter(_assertThisInitialized(_this), void 0, void 0,
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee5() {
              var url, r, source, names, i;
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      url = this.url("resource/update");
                      _context5.next = 3;
                      return this.postByJson(url, {
                        item: item
                      });

                    case 3:
                      r = _context5.sent;
                      source = allResources.filter(function (o) {
                        return o.id == item.id;
                      })[0];
                      console.assert(source != null);
                      names = Object.getOwnPropertyNames(source);

                      for (i = 0; i < names.length; i++) {
                        source[names[i]] = r[names[i]] || item[names[i]];
                      }

                      return _context5.abrupt("return", r);

                    case 9:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5, this);
            }));
          },
          path: {
            set: function set(resourceId, paths) {
              return __awaiter(_assertThisInitialized(_this), void 0, void 0,
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee6() {
                var url, r;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        url = this.url("resource/path/set");
                        _context6.next = 3;
                        return this.postByJson(url, {
                          resourceId: resourceId,
                          paths: paths
                        });

                      case 3:
                        r = _context6.sent;

                      case 4:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, this);
              }));
            }
          }
        };
      }();

      _this.resourcePaths = {
        list: function list() {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee7() {
            var url;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    url = this.url("resource_path/list");
                    return _context7.abrupt("return", this.get(url));

                  case 2:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this);
          }));
        }
      };
      _this.user = {
        list: function list(args) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee8() {
            var url, result;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    url = this.url('user/list');
                    _context8.next = 3;
                    return this.getByJson(url, {
                      args: args
                    });

                  case 3:
                    result = _context8.sent;

                    if (!(result == null)) {
                      _context8.next = 6;
                      break;
                    }

                    throw errors_1.errors.unexpectedNullResult();

                  case 6:
                    return _context8.abrupt("return", result);

                  case 7:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));
        },
        update: function update(item) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee9() {
            var url, result;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    url = this.url('user/update');
                    if (item.password) item.password = md5(item.password);
                    _context9.next = 4;
                    return this.postByJson(url, {
                      user: item
                    });

                  case 4:
                    result = _context9.sent;
                    return _context9.abrupt("return", result);

                  case 6:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9, this);
          }));
        },

        /**
         * 添加用户信息
         * @param item 用户
         */
        add: function add(item, roleIds) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee10() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    url = this.url('user/add');
                    console.assert(item.password != null);
                    item.password = md5(item.password);
                    _context10.next = 5;
                    return this.postByJson(url, {
                      item: item,
                      roleIds: roleIds
                    });

                  case 5:
                    r = _context10.sent;
                    return _context10.abrupt("return", r);

                  case 7:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10, this);
          }));
        },
        remove: function remove(id) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee11() {
            var url;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    url = this.url('user/remove');
                    return _context11.abrupt("return", this.postByJson(url, {
                      id: id
                    }));

                  case 2:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee11, this);
          }));
        },

        /**
         * 获取用户个人信息
         */
        me: function me() {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee12() {
            var url, user;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (service_1.Service.loginInfo.value) {
                      _context12.next = 2;
                      break;
                    }

                    return _context12.abrupt("return", null);

                  case 2:
                    url = this.url('user/me');
                    _context12.next = 5;
                    return this.getByJson(url);

                  case 5:
                    user = _context12.sent;
                    return _context12.abrupt("return", user);

                  case 7:
                  case "end":
                    return _context12.stop();
                }
              }
            }, _callee12, this);
          }));
        },

        /**
         * 登录
         * @param username 用户名
         * @param password 密码
         */
        login: function login(username, password) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee13() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    if (username) {
                      _context13.next = 2;
                      break;
                    }

                    throw errors_1.errors.argumentNull('username');

                  case 2:
                    if (password) {
                      _context13.next = 4;
                      break;
                    }

                    throw errors_1.errors.argumentNull('password');

                  case 4:
                    password = md5(password);
                    url = this.url('user/login');
                    _context13.next = 8;
                    return this.postByJson(url, {
                      username: username,
                      password: password
                    });

                  case 8:
                    r = _context13.sent;

                    if (!(r == null)) {
                      _context13.next = 11;
                      break;
                    }

                    throw errors_1.errors.unexpectedNullResult();

                  case 11:
                    r.username = username;
                    service_1.Service.loginInfo.value = r;
                    service_1.Service.setStorageLoginInfo(r);
                    events_1.events.login.fire(this, r);
                    return _context13.abrupt("return", r);

                  case 16:
                  case "end":
                    return _context13.stop();
                }
              }
            }, _callee13, this);
          }));
        },

        /**
         * 退出登录
         */
        logout: function logout() {
          if (service_1.Service.loginInfo.value == null) return; //TODO: 将服务端 token 设置为失效

          events_1.events.logout.fire(this, service_1.Service.loginInfo.value);
          service_1.Service.setStorageLoginInfo(null);
          service_1.Service.loginInfo.value = null;
        },

        /**
         * 重置密码
         * @param mobile 手机号
         * @param password 新密码
         * @param smsId 短信编号
         * @param verifyCode 验证码
         */
        resetPassword: function resetPassword(mobile, password, smsId, verifyCode) {
          if (!mobile) throw errors_1.errors.argumentNull('mobile');
          if (!password) throw errors_1.errors.argumentNull('password');
          if (!smsId) throw errors_1.errors.argumentNull('smsId');
          if (!verifyCode) throw errors_1.errors.argumentNull('verifyCode');
          password = md5(password);

          var url = _this.url('user/resetPassword');

          return _this.postByJson(url, {
            mobile: mobile,
            password: password,
            smsId: smsId,
            verifyCode: verifyCode
          });
        },

        /**
         * 注册
         * @param mobile 手机号
         * @param password 密码
         * @param smsId 短信编号
         * @param verifyCode 验证码
         */
        register: function register(mobile, password, smsId, verifyCode, data) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee14() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    if (mobile) {
                      _context14.next = 2;
                      break;
                    }

                    throw errors_1.errors.argumentNull('mobile');

                  case 2:
                    if (password) {
                      _context14.next = 4;
                      break;
                    }

                    throw errors_1.errors.argumentNull('password');

                  case 4:
                    if (smsId) {
                      _context14.next = 6;
                      break;
                    }

                    throw errors_1.errors.argumentNull('smsId');

                  case 6:
                    if (verifyCode) {
                      _context14.next = 8;
                      break;
                    }

                    throw errors_1.errors.argumentNull('verifyCode');

                  case 8:
                    url = this.url('user/register');
                    _context14.next = 11;
                    return this.postByJson(url, {
                      mobile: mobile,
                      password: password,
                      smsId: smsId,
                      verifyCode: verifyCode,
                      data: data
                    });

                  case 11:
                    r = _context14.sent;

                    if (!(r == null)) {
                      _context14.next = 14;
                      break;
                    }

                    throw errors_1.errors.unexpectedNullResult();

                  case 14:
                    service_1.Service.setStorageLoginInfo(r);
                    events_1.events.register.fire(this, r);
                    return _context14.abrupt("return", r);

                  case 17:
                  case "end":
                    return _context14.stop();
                }
              }
            }, _callee14, this);
          }));
        },

        /**
         * 重置手机号码
         * @param mobile 需要重置的新手机号
         * @param smsId 短信编号
         * @param verifyCode 验证码
         */
        resetMobile: function resetMobile(mobile, smsId, verifyCode) {
          if (!mobile) throw errors_1.errors.argumentNull('mobile');
          if (!smsId) throw errors_1.errors.argumentNull('smsId');
          if (!verifyCode) throw errors_1.errors.argumentNull('verifyCode');

          var url = _this.url('user/resetMobile');

          return _this.postByJson(url, {
            mobile: mobile,
            smsId: smsId,
            verifyCode: verifyCode
          });
        }
      };
      _this.token = {
        list: function list(args) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee15() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    url = this.url('token/list');
                    r = this.getByJson(url, {
                      args: args
                    });
                    return _context15.abrupt("return", r);

                  case 3:
                  case "end":
                    return _context15.stop();
                }
              }
            }, _callee15, this);
          }));
        },
        add: function add(item) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee16() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    url = this.url("token/add");
                    _context16.next = 3;
                    return this.postByJson(url, {
                      item: item
                    });

                  case 3:
                    r = _context16.sent;
                    return _context16.abrupt("return", r);

                  case 5:
                  case "end":
                    return _context16.stop();
                }
              }
            }, _callee16, this);
          }));
        }
      };
      _this.path = {
        list: function list(resourceId) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee17() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    url = this.url("path/list");
                    r = this.getByJson(url, {
                      resourceId: resourceId
                    });
                    return _context17.abrupt("return", r);

                  case 3:
                  case "end":
                    return _context17.stop();
                }
              }
            }, _callee17, this);
          }));
        },
        add: function add(item) {
          return __awaiter(_assertThisInitialized(_this), void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee18() {
            var url, r;
            return regeneratorRuntime.wrap(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    url = this.url("path/add");
                    r = this.postByJson(url, {
                      item: item
                    });
                    return _context18.abrupt("return", r);

                  case 3:
                  case "end":
                    return _context18.stop();
                }
              }
            }, _callee18, this);
          }));
        }
      };
      _this.sms = {
        /**
         * 发送重置密码操作验证码
         * @param mobile 接收验证码的手机号
         */
        sendResetVerifyCode: function sendResetVerifyCode(mobile) {
          if (!mobile) throw errors_1.errors.argumentNull('mobile');

          var url = _this.url('sms/sendVerifyCode');

          return _this.postByJson(url, {
            mobile: mobile,
            type: 'resetPassword'
          });
        },

        /**
         * 发送注册操作验证码
         * @param mobile 接收验证码的手机号
         */
        sendRegisterVerifyCode: function sendRegisterVerifyCode(mobile) {
          var url = _this.url('sms/sendVerifyCode');

          return _this.postByJson(url, {
            mobile: mobile,
            type: 'register'
          });
        }
      }; // //================================================================
      // // 用户相关
      // /**
      //  * 校验验证码
      //  * @param smsId 验证码信息的 ID 号
      //  * @param verifyCode 验证码
      //  */
      // async checkVerifyCode(smsId: string, verifyCode: string) {
      //     if (!smsId) throw errors.argumentNull('smsId')
      //     if (!verifyCode) throw errors.argumentNull('verifycode')
      //     let url = this.url('sms/checkVerifyCode')
      //     let r = await this.postByJson<boolean>(url, { smsId, verifyCode })
      //     return r
      // }
      // /**
      //  * 发送重置密码操作验证码
      //  * @param mobile 接收验证码的手机号
      //  */
      // sendResetVerifyCode(mobile: string) {
      //     if (!mobile) throw errors.argumentNull('mobile')
      //     let url = this.url('sms/sendVerifyCode')
      //     return this.postByJson<{ smsId: string }>(url, { mobile, type: 'resetPassword' })
      // }
      // /**
      //  * 获取用户
      //  * @param userId 用户编号
      //  */
      // async getUser(userId: string) {
      //     let url = this.url('user/item')
      //     let user = await this.getByJson<User | null>(url, { userId })
      //     return user
      // }
      // /**
      //  * 更新用户信息
      //  * @param item 用户
      //  */
      // updateUser(item: User) {
      //     let url = this.url('user/update')
      //     return this.postByJson(url, { user: item })
      // }
      // /**
      //  * 获取当前登录用户的角色
      //  */
      // async myRoles() {
      //     let url = this.url('user/getRoles')
      //     let roles = await this.getByJson<Role[]>(url)
      //     return roles
      // }
      // /**
      //  * 给指定的用户添加角色
      //  * @param userId 用户编号
      //  * @param roleIds 多个角色编号
      //  */
      // addUserRoles(userId: string, roleIds: string[]) {
      //     let url = this.url('user/addRoles')
      //     return this.postByJson(url, { userId, roleIds })
      // }
      // /**
      //  * 获取用角色
      //  * @param userId 用户编号
      //  */
      // async getUserRoles(userId: string): Promise<Role[]> {
      //     let url = this.url('role/userRoles');
      //     let r = await this.getByJson<{ [userId: string]: Role[] }>(url, { userIds: [userId] });
      //     return r[userId];
      // }

      return _this;
    }

    _createClass(PermissionService, [{
      key: "url",
      value: function url(path) {
        if (!PermissionService.baseUrl) throw errors_1.errors.serviceUrlCanntNull('permissionService');
        return "".concat(PermissionService.baseUrl, "/").concat(path);
      }
    }]);

    return PermissionService;
  }(service_1.Service);

  exports.PermissionService = PermissionService;
});
