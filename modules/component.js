import mustache from "./mustache.js";

export class Component {
    constructor(options) {

        if (options instanceof Component) {
            return options;
        }

        this.name = options.name ?? (Math.random() + "_");
        this.selector = options.selector ?? null;
        this.data = options.data ?? null;
        this.template = options.template ?? null;

        if (this.template[0] == "#") {
            let tmpl = document.querySelector(this.template);
            this.template = tmpl.innerHTML;
        }
    }

    /**
     * Render the component using innerHTML or insertAdjacentHTML()
     * @param {string} method Can be "add" or "replace"
     * @param {string} extra Position string for insertAdjacentHTML()
     */
    render(method, extra) {
        method = method ?? "replace";
        extra = extra ?? "";
        let rendered = mustache.render(this.template, this.data);
        this[method](rendered, extra);
    }

    /**
     * Render html to selector using insertAdjacentHTML()
     * @param {string} text Raw HTML to render
     * @param {string} extra Position string
     */
    add(text, extra) {
        let target = document.querySelector(this.selector);

        target.insertAdjacentHTML?.(extra, text);
    }

    /**
     * Render HTML to selector using innerHTML = {text}
     * @param {string} text Raw HTML to render
     */
    replace(text) {
        let target = document.querySelector(this.selector);

        if (target) target.innerHTML = text;
    }
}