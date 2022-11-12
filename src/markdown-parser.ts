import { Element } from "./element";

const countCharacters = (character: string, str: string) => {
	let times = 0;

	for (let char of str.split('')) {
		if (char !== character) continue;
		times++;
	}

	return times;
}

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
			else if (line.startsWith("#")) {
				// Heading

				type headingLevels = 1 | 2 | 3 | 4 | 5 | 6;
				const level = countCharacters("#", line) as headingLevels;
				element = new Element(`h${level}`);
				element.innerHtml([line.split('# ')[1]]);
			} else if (line.startsWith('!')) {
				// Images

				element = new Element('img');
				const alt = line.match(/(?<=\[).*(?=])/)[0];
				const src = line.match(/(?<=\().*(?=\))/)[0];
				element.addAttribute({ alt, src });
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
