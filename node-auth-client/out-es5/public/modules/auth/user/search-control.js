"use strict";

define(["require", "exports", "react-dom", "react", "assert/dataSources"], function (require, exports, ReactDOM, React, dataSources_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function default_1(args) {
    var control = document.createElement("div");
    var searchTextInput;
    ReactDOM.render(React.createElement(React.Fragment, null, React.createElement("button", {
      key: "search-button",
      className: "btn btn-primary pull-right",
      onClick: function onClick() {
        return search(searchTextInput.value);
      }
    }, React.createElement("i", {
      className: "icon-search"
    }), React.createElement("span", null, "\u641C\u7D22")), React.createElement("input", {
      key: "search-text",
      type: "text",
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u8D26\u53F7",
      className: "form-control pull-right",
      style: {
        width: 300
      },
      ref: function ref(e) {
        return searchTextInput = searchTextInput || e;
      },
      onKeyDown: function onKeyDown(e) {
        if (!e) return;

        if (e.keyCode == 13) {
          search(searchTextInput.value);
        }
      }
    })), control);
    return control;
  }

  exports.default = default_1;

  function search(searchText) {
    searchText = (searchText || '').trim();
    var args = {
      filter: "mobile like '%".concat(searchText, "%' or user_name like '%").concat(searchText, "%' or email like '%").concat(searchText, "%'")
    };
    return dataSources_1.dataSources.user.select(args);
  }
});
