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

define(["require", "exports", "maishu-wuzhui-helper", "./page-view"], function (require, exports, maishu_wuzhui_helper_1, page_view_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var ListView =
  /*#__PURE__*/
  function (_page_view_1$PageView) {
    _inherits(ListView, _page_view_1$PageView);

    function ListView(args) {
      var _this;

      _classCallCheck(this, ListView);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ListView).call(this, args));
      var resource = args.menuItems.filter(function (o) {
        return o.id == args.resourceId;
      })[0];

      var parentDeep = _this.parentDeep(resource);

      if (parentDeep > 1) {
        _this.showBackButton();
      }

      _this.createGridView(args);

      return _this;
    } // protected render(element) {
    //     this.createGridView(element, this.args as ListViewArguments<T>)
    // }


    _createClass(ListView, [{
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
      key: "createGridView",
      value: function createGridView(args) {
        var tableElement = document.createElement("table");
        var tableIsFixed = args.pageSize == null;
        var dataSource = args.dataSource,
            columns = args.columns;

        var _gridView = maishu_wuzhui_helper_1.createGridView({
          element: tableElement,
          dataSource: dataSource,
          columns: columns,
          pageSize: args.pageSize,
          pagerSettings: {
            activeButtonClassName: 'active',
            buttonContainerWraper: 'ul',
            buttonWrapper: 'li',
            buttonContainerClassName: 'pagination',
            showTotal: true
          },
          sort: args.transform,
          showHeader: !tableIsFixed
        });

        if (tableIsFixed) {
          tableElement.style.maxWidth = "unset";
          tableElement.style.width = "calc(100% + 18px)";
          var element = document.createElement("div");
          element.innerHTML = "\n            <table class=\"table table-striped table-bordered table-hover\" style=\" margin: 0 \">\n                <thead>\n                    <tr>\n     \n                    </tr>\n                </thead>\n            </table>\n            <div style=\"height: calc(100% - 160px); width: calc(100% - 300px); position: absolute; overflow-y: scroll; overflow-x: hidden\">\n            </div>\n            ";
          var div = element.querySelector("div");
          div.appendChild(tableElement);
          var tableHeader = element.querySelector("tr");
          columns.map(function (col) {
            var th = document.createElement("th");
            console.assert(col != null, "col is null");
            if (col.itemStyle) th.style.width = col.itemStyle["width"];
            th.innerHTML = col.headerText;
            return th;
          }).forEach(function (th) {
            tableHeader.appendChild(th);
          });
          args.element.appendChild(element);
        } else {
          args.element.appendChild(tableElement);
        }

        return _gridView;
      }
    }, {
      key: "gridView",
      get: function get() {
        return this._gridView;
      }
    }]);

    return ListView;
  }(page_view_1.PageView);

  exports.ListView = ListView;
});
