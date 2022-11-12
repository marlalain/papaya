import { Element } from "./element";

class MarkdownParser {
	private readonly _markdown: string;
	private readonly _meta: Element;

	constructor(text: string) {
		this._markdown = text;
		this._meta = new Element('div');
	}

	parse() {
		this._markdown.split('\n').forEach(line => {
			let element: Element;

			if (line === "") {}
			else if (line.startsWith("# ")) {
				element = new Element('h1');
				element.innerHtml([line.split('# ')[1]]);
			} else if (line.startsWith('## ')) {
				element = new Element('h2');
				element.innerHtml([line.split('## ')[1]]);
			} else {
				element = new Element('p');
				element.innerHtml([line]);
			}
			this._meta.addChildren([element])
		});
	}

	title(text: string) {
		this._meta.innerHtml([text]);
	}

	render() {
		return this._meta.render();
	}
}

export {
	MarkdownParser
}
