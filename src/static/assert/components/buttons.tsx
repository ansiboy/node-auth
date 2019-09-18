import React = require("react");
import { buttonOnClick, ClickArguments } from "maishu-ui-toolkit";

export class Buttons {
    static codes = {
        add: 'add',
        edit: 'edit',
        remove: 'remove',
        view: 'view',
        save: 'save'
    }
    static createListEditButton(onclick: (e: MouseEvent) => void): HTMLButtonElement {

        let button = document.createElement("button");
        button.className = "btn btn-minier btn-info";
        button.onclick = (e) => onclick(e);
        button.innerHTML = `<i class="icon-pencil"></i>`;

        return button;

    }
    static createListDeleteButton(onclick: (e: MouseEvent) => void): HTMLButtonElement {

        let button = document.createElement("button");
        button.className = "btn btn-minier btn-danger";
        button.onclick = (e) => onclick(e);
        button.innerHTML = `<i class="icon-trash"></i>`;

        return button;

    }
    static createListViewButton(onclick: (e: MouseEvent) => void) {

        let button = document.createElement("button");
        button.className = "btn btn-minier btn-success";
        button.onclick = (e) => onclick(e);
        button.innerHTML = `<i class="icon-eye-open"></i>`;

        return button;
    }
    static createPageAddButton(onclick: (e: MouseEvent) => Promise<any>) {
        return this.createPageTopRightButton("添加", "icon-plus", onclick);
    }
    static createPageTopRightButton(text: string, icon: string, onclick: (e: MouseEvent) => Promise<any>, args?: ClickArguments) {

        let button = document.createElement("button");
        button.className = "btn btn-primary pull-right";
        if (icon) {
            button.innerHTML = `<i class="${icon}"></i><span>${text}</span>`;
        }
        else {
            button.innerHTML = `<span>${text}</span>`;
        }
        buttonOnClick(button, (event) => onclick(event), args);

        return button;

    }
}