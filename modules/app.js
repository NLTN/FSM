import { EventManager } from "./events.js";
import { Component } from "./component.js";

export {Component, EventManager}

export class WebApp {
    constructor() {
        this.verion = 1.0;
        this.events = new EventManager();
        this.components = {};

        window.WebApp = window.WebApp || this;
    }

    /**
     * Creates a component you can render to the page as HTML. 
     * @param {Object} options {name, selector, template, data}
     */
    component(options) {
        // This is a trick to give you better code hinting in VS Code
        // It ensures VS Code knows that the comp variable is an instance of Component
        let comp = new Component(options);
        this.components[comp.name] = comp;
        return new Component(comp);
    }

    /**
     * 
     * @param {string} method HTTP Method ("GET", "POST", "PUT" or "DELETE")
     * @param {string} url URL to fetch
     * @param {Object} data Data to send with fetch request
     * @param {string} returnType Optional, "json" or "text"
     * @returns JSON or Text
     */
    async #customFetch(method, url, data, returnType) {
        returnType = returnType.toLowerCase();
        returnType = (returnType == "json" ? returnType : (returnType = "text" ? returnType : "json"));
        method = method.toUpperCase();
        const bodyValue = {
            GET: null,
            POST: JSON.stringify(data),
            PUT: JSON.stringify(data),
            DELETE: JSON.stringify(data)
        };

        let request = await fetch(url, {
            method: method,
            body: bodyValue[method]
        });

        let response = await request[returnType]();
        return response;
    }

    /**
     * Make a "GET" request to a specified URL. 
     * @param {string} url (Url to fetch)
     * @param {string} returnType (Optional, "json" or "text")
     * @returns either a JSON object or a string depending on returnType. 
     */
    async GET(url, returnType) {
        returnType = returnType ?? "json";
        return await this.#customFetch("GET", url, null, returnType);
    }

    /**
     * Make a "POST" request to a specified URL with data. 
     * @param {string} url (URL to fetch)
     * @param {Object} data (Data to send)
     * @param {string} returnType (Optional, "json" or "text")
     * @returns either a JSON object or a string depending on returnType. 
     */
    async POST(url, data, returnType) {
        returnType = returnType ?? "json";
        return await this.#customFetch("POST", url, data, returnType);
    }

    /**
     * Make a "PUT" request to a specified URL with data. 
     * @param {string} url (URL to fetch)
     * @param {Object} data (Data to send)
     * @param {string} returnType (Optional, "json" or "text")
     * @returns either a JSON object or a string depending on returnType. 
     */
    async PUT(url, data, returnType) {
        returnType = returnType ?? "json";
        return await this.#customFetch("PUT", url, data, returnType);
    }

    /**
     * Make a "DELETE" request to a specified URL with data. 
     * @param {string} url (URL to fetch)
     * @param {Object} data (Data to send)
     * @param {string} returnType (Optional, "json" or "text")
     * @returns either a JSON object or a string depending on returnType. 
     */
    async DELETE(url, data, returnType) {
        data = data ?? null;
        returnType = returnType ?? "json";
        if (typeof data === "string") returnType = data;
        return await this.#customFetch("DELETE", url, data, returnType);
    }
}
