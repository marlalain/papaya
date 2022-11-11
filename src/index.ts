const { http } = Melon;
const app = http.app({
	name: "papaya",
	host: "localhost",
	port: 5000,
	enableHttps: false,
});

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

type MetaTags = 'html' | 'body' | 'head' | 'div';
type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextTags = 'p';
type HtmlTag = MetaTags | HeadingTags | TextTags;

class Element {
	private readonly _tag: string;
	private _attributes: Record<string, string>;
	private readonly _selfClosing: boolean;
	private _children: Element[] = [];
	private _inner: string;

	constructor(tag: HtmlTag, options?: { selfClosing: boolean }) {
		this._tag = tag;

		if (options) this._selfClosing = options.selfClosing;
	}

	innerHtml(inner: TemplateStringsArray | string[]) {
		this._inner = inner[0];
	}

	addAttribute(attribute: Record<string, string>) {
		this._attributes = {
			...this._attributes,
			...attribute,
		};
	}

	addChildren(txt: Element[]) {
		this._children.push(...txt);
	}

	render(): string {
		if (this._selfClosing) {
			return `<${this._tag} />`;
		} else {
			return `<${this._tag}>${this._inner ? this._inner : ''}${this._children.map(children => children ? children.render() : '').join('')}</${this._tag}>`;
		}
	}

	renderAsChildren() {
		return [this.render()];
	}
}

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

const html: string = (() => {
	const page = new Page();
	page.title("My Melon Wiki");

	const markdown = Melon.fs.readText('./src/index.md');

	const parser = new MarkdownParser(markdown);
	parser.parse();
	page.body(parser.render());

	return page.render();
})();


app.get("/", async () => http.static(html, 'text/html'));

app.run();
