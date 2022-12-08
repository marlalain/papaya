type MetaTags = "html" | "body" | "head" | "div" | "br";
type HeadingTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type TextTags = "p" | "span";
type ContentTags = "img";
type HtmlTag = MetaTags | HeadingTags | TextTags | ContentTags | string;

class Element {
	private readonly _tag: string;
	private _attributes: Record<string, string> = {};
	private readonly _selfClosing: boolean;
	private _children: Element[] = [];
	private _inner: string;

	count() {
		return this._children.length;
	}

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

	attributes() {
		return Object.entries(this._attributes).map(([k, v]) => `${k}="${v}"`).join("");
	}

	addChildren(txt: Element[]) {
		this._children.push(...txt);
	}

	render(): string {
		if (this._selfClosing) {
			return `<${this._tag} ${this.attributes()} />`;
		} else {
			return `<${this._tag} ${this.attributes()}>${this._inner ? this._inner : ""}${this._children.map(children => children ?
			 children.render() : "").join("")}</${this._tag}>`;
		}
	}

	renderAsChildren() {
		return [this.render()];
	}
}

export {
	Element
}
