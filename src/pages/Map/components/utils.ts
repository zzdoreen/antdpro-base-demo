import classNames from "classnames";
import type { ReactElement } from "react";
import ReactDOM from "react-dom";

export class DOMControl extends BMapGL.Control {
    private dom: ReactElement;
    Dom: HTMLElement | null = null;
    border: boolean;
    center: boolean;
    className: string;

    constructor(
        dom: ReactElement,
        {
            anchor = BMAP_ANCHOR_BOTTOM_LEFT,
            offset = new BMapGL.Size(10, 10),
            border = true,
            center = false,
            className = ''
        },
    ) {
        super();
        this.defaultAnchor = anchor;
        this.defaultOffset = offset;
        this.dom = dom;
        this.border = border;
        this.center = center;
        this.className = className;
    }
    initialize(map: BMapGL.Map) {
        const dom = document.createElement('div');
        dom.className = classNames(
            this.border && 'dom-control',
            this.center && 'control-center',
            this.className
        )
        ReactDOM.render(this.dom, dom);
        this.Dom = dom
        map.getContainer().appendChild(dom);
        return dom;
    }
    update(dom: ReactElement) {
        ReactDOM.render(dom, this.Dom);
    }
}


export class TDOMControl extends T.Control {
    private dom: ReactElement;
    private Dom: HTMLElement | null = null;
    border: boolean;
    center: boolean;
    className: string

    constructor(
        dom: ReactElement,
        {
            border = true,
            center = false,
            className = ''
        },
    ) {
        super();
        this.dom = dom;
        this.border = border;
        this.center = center;
        this.className = className;
    }
    onAdd(map: any) {
        const dom = document.createElement('div');
        dom.className = classNames(
            this.border && 'dom-control',
            this.center && 'control-center',
            this.className
        )

        ReactDOM.render(this.dom, dom);
        this.Dom = dom
        map.getContainer().appendChild(dom);
        return dom;
    }
    // onRemove() {
    //   console.log('onRemove')
    //   delete this.dom
    // }
    update(dom: ReactElement) {
        ReactDOM.render(dom, this.Dom);
    }
}