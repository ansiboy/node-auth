"use strict";

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

define(["require", "exports", "maishu-chitu", "maishu-wuzhui"], function (require, exports, maishu_chitu_1, maishu_wuzhui_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.constants = {
    pageSize: 15,
    buttonTexts: {
      add: '添加',
      edit: '修改',
      delete: '删除',
      view: '查看'
    },
    buttonCodes: {
      add: 'add',
      edit: 'edit',
      delete: 'delete',
      view: 'view'
    },
    noImage: '暂无图片',
    base64SrcPrefix: 'data:image'
  };
  exports.services = {
    imageService: null
  };

  function getObjectType(url) {
    var obj = maishu_chitu_1.parseUrl(url);
    var arr = obj.pageName.split('/');
    return arr[0];
  }

  exports.getObjectType = getObjectType;

  function toDataSource(source) {
    var _this = this;

    return new maishu_wuzhui_1.DataSource({
      select: function select() {
        return __awaiter(_this, void 0, void 0,
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var items;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return source;

                case 2:
                  items = _context.sent;
                  return _context.abrupt("return", {
                    dataItems: items,
                    totalRowCount: items.length
                  });

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));
      }
    });
  }

  exports.toDataSource = toDataSource;
});
