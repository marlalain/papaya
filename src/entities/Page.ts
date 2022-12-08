import {Element} from "./Element";

class Page {
	private _head: string = "<head></head>";
	private _title?: string;
	private _body: Element = new Element("body");

	head(str: TemplateStringsArray) {
		const text = str[0];

		if (this._title) {
			this._head = `<head>${text}<title>${this._title}</title></head>`;
		} else {
			this._head = `<head>${text}</head>`;
		}
	}

	title(str: string) {
		this._title = str;
	}

	body(body: Element[] | string) {
		if (typeof body === "string") {
			this._body.innerHtml([body]);
			return;
		}

		this._body.addChildren(body);
	}

	render(): string {
		return `<html lang="en">${this._head}${this._body.render()}</html>`;
	}
}

export {
	Page
}
