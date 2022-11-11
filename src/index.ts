const { http } = Melon;
const app = http.app({
	name: "papaya",
	host: "localhost",
	port: 5000,
	enableHttps: false,
});

type MetaTags = 'html' | 'body' | 'head' | 'div';
type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextTags = 'p';
type HtmlTag = MetaTags | HeadingTags | TextTags;

class Element {
	private readonly _tag: string;
	private _attributes: Record<string, string>;
	private readonly _selfClosing: boolean;
	private _children: string[];

	constructor(tag: HtmlTag, options?: { selfClosing: boolean }) {
		this._tag = tag;

		if (options) this._selfClosing = options.selfClosing;
	}

	addAttribute(attribute: Record<string, string>) {
		this._attributes = {
			...this._attributes,
			...attribute,
		};
	}

	children(txt: TemplateStringsArray | string[]) {
		this._children = [...txt];
	}

	render() {
		if (this._selfClosing) {
			return `<${this._tag} />`;
		} else {
			return `<${this._tag}>${this._children.join('')}</${this._tag}>`;
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

	body(str: TemplateStringsArray | string[]) {
		this._body.children(str);
	}

	render() {
		return `<html lang="en">${this._head}${this._body.render()}</html>`;
	}
}

const page = new Page();
page.title("My Melon Wiki");

const helloTitle = new Element('h1');
helloTitle.children`My Melon Wiki!`;
page.body(helloTitle.renderAsChildren());

app.get("/", async () => http.static(page.render(), 'text/html'));

app.run();
