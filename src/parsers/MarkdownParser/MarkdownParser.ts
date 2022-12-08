import { Element } from "../../entities/Element";

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
	private _currTable: Element;
	private _lastType: string;

	constructor(text: string) {
		this._markdown = text;
		this._meta = new Element("div");
	}

	parse() {
		const markdownValues = this._markdown.split('\n');

		for(const line of markdownValues) {
			if(line.trim() != "") {
				const element = this.parseLine(line);
				this._meta.addChildren([element]);
			}
		}
	}

	title(text: string) {
		this._meta.innerHtml([text]);
	}

	render() {
		return this._meta.render();
	}

	private parseLine = (line: string) => {
		const operations = {
			"#": () => {
				type headingLevels = 1 | 2 | 3 | 4 | 5 | 6;
				const level = countCharacters("#", line) as headingLevels;
				const element = new Element(`h${level}`);
				element.innerHtml([line.split("# ")[1]]);
	
				return element;
			},
			"!": () => {
				const element = new Element("img");
				const alt = line.match(/(?<=\[).*(?=])/)[0];
				const src = line.match(/(?<=\().*(?=\))/)[0];
				element.addAttribute({ alt, src });
	
				return element;
			},
			"|": () => {
				if(this._lastType != "|") {
					this._currTable = new Element("table");
				}

				const columns = line.split("|");
	
				element.addChildren(columns.map(item => {
					const childElement = new Element("td");
					childElement.innerHtml([item]);
					return childElement;
				}));
	
				this._currTable.addChildren([element]);
			}
		};
	
		const starter = line.trim()[0];
		this._lastType = starter;

		if(starter != "!" && this._currTable.count() > 0) {
			const result = this._currTable;
			this._currTable = new Element("table");
			
			return result;
		}
	
		if(operations[starter]) {
			return operations[starter]();
		}
	
		const element = new Element("p");
		element.innerHtml([line]);
	
		return element;
	}
}

export {
	MarkdownParser
}
