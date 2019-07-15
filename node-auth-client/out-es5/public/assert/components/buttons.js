"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(["require", "exports", "maishu-ui-toolkit"], function (require, exports, maishu_ui_toolkit_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Buttons =
  /*#__PURE__*/
  function () {
    function Buttons() {
      _classCallCheck(this, Buttons);
    }

    _createClass(Buttons, null, [{
      key: "createListEditButton",
      value: function createListEditButton(onclick) {
        var button = document.createElement("button");
        button.className = "btn btn-minier btn-info";

        button.onclick = function (e) {
          return onclick(e);
        };

        button.innerHTML = "<i class=\"icon-pencil\"></i>";
        return button;
      }
    }, {
      key: "createListDeleteButton",
      value: function createListDeleteButton(onclick) {
        var button = document.createElement("button");
        button.className = "btn btn-minier btn-danger";

        button.onclick = function (e) {
          return onclick(e);
        };

        button.innerHTML = "<i class=\"icon-trash\"></i>";
        return button;
      }
    }, {
      key: "createListViewButton",
      value: function createListViewButton(onclick) {
        var button = document.createElement("button");
        button.className = "btn btn-minier btn-success";

        button.onclick = function (e) {
          return onclick(e);
        };

        button.innerHTML = "<i class=\"icon-eye-open\"></i>";
        return button;
      }
    }, {
      key: "createPageAddButton",
      value: function createPageAddButton(onclick) {
        return this.createPageTopRightButton("添加", "icon-plus", onclick);
      }
    }, {
      key: "createPageTopRightButton",
      value: function createPageTopRightButton(text, icon, onclick, args) {
        var button = document.createElement("button");
        button.className = "btn btn-primary pull-right";

        if (icon) {
          button.innerHTML = "<i class=\"".concat(icon, "\"></i><span>").concat(text, "</span>");
        } else {
          button.innerHTML = "<span>".concat(text, "</span>");
        }

        maishu_ui_toolkit_1.buttonOnClick(button, function (event) {
          return onclick(event);
        }, args);
        return button;
      }
    }]);

    return Buttons;
  }();

  Buttons.codes = {
    add: 'add',
    edit: 'edit',
    remove: 'remove',
    view: 'view',
    save: 'save'
  };
  exports.Buttons = Buttons;
});
