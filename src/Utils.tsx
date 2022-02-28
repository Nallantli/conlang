import glossKeys from './glossKeys.json';

export interface GlossTemplate {
	"link": string,
	"text": string,
	"phnm"?: string,
	"phnt"?: string,
	"trns": string,
	"expl"?: string,
	"data": [string, string]
}

export interface GlosserProps {
	query?: string[],
	styles: any
}

export interface GlosserState {
	query: string[],
	newQuery: string[],
	glosses: GlossTemplate[]
}

export function generateFromText(text: string) {
	text = transliterate(text.toLowerCase())
		.replace(/([bcdkjlmnpqrstwxyz]{0,1}[aeiouāēīōū](\s|$|(?=[bcdkjlmnpqrstwxyz]{0,1}[aeiouāēīōū])|[bcdkjlmnpqrhstwxyz]))/g, '{$1}')
		.replace(/\{(.*?) \}/g, '{$1} ');
	let newText = '';
	let current = '';
	let mode = 0;
	for (let i = 0; i < text.length; i++) {
		switch (mode) {
			case 0:
				if (text[i] === '{') {
					mode = 1;
				} else {
					newText += text[i];
				}
				break;
			case 1:
				if (text[i] === '}') {
					mode = 0;
					newText += `{${current}:${getSyllableWeight(current)}}`;
					current = '';
				} else {
					current += text[i];
				}
				break;
		}
	}
	return newText
		.replace(/j/g, 't͜ɬ')
		.replace(/y/g, 'j')
		.replace(/x/g, 'ʃ')
		.replace(/c/g, 't͜ʃ')
		.replace(/z/g, 't͜s')
		.replace(/h/g, 'ʔ')
		.replace(/q/g, 'kʷ')
		.replace(/ā/g, 'a͈')
		.replace(/ē/g, 'e͈')
		.replace(/ī/g, 'i͈')
		.replace(/ō/g, 'o͈')
		.replace(/ū/g, 'u͈');
}

export function transliterate(s: string) {
	return s
		.replace(/²/g, "")
		.replace(/qu/g, "q")
		.replace(/Qu/g, "Q")
		.replace(/hu/g, "w")
		.replace(/Hu/g, "W")
		.replace(/lh/g, "ly")
		.replace(/tl/g, 'j')
		.replace(/Tl/g, 'J');
}

function getSyllableWeight(syllable: string) {
	switch (syllable.length) {
		case 1:
			return syllable[0].match(/[aeiou]/) ? 2 : 5;
		case 2:
			if (syllable[0].match(/[aeiou]/)) {
				return syllable[1] === 'h' ? 1 : 3;
			}
			if (syllable[0].match(/[āēīōū]/)) {
				return syllable[1] === 'h' ? 4 : 6;
			}
			if (syllable[1].match(/[aeiou]/)) {
				return 2;
			}
			if (syllable[1].match(/[āēīōū]/)) {
				return 5;
			}
			return 0;
		case 3: {
			if (syllable[1].match(/[aeiou]/)) {
				return syllable[2] === 'h' ? 1 : 3;
			}
			if (syllable[1].match(/[āēīōū]/)) {
				return syllable[2] === 'h' ? 4 : 6;
			}
			return 0;
		}
	}
}

function interpolate(a: any[], b: any) {
	let c = [];
	for (let i = 0; i < a.length; i++) {
		c.push(a[i]);
		if (i < a.length - 1) {
			c.push(b);
		}
	}
	return c;
}

// bruh moment
export function massInterpolate(styles: any, value: string, callback: (a: string) => any) {
	if (!value) {
		console.log('no value');
		return undefined;
	}
	return interpolate(
		value.split('=').map(
			u => interpolate(
				u.split('-').map(
					u => interpolate(
						u.split('<').map(
							u => interpolate(
								u.split('>').map(
									u => interpolate(
										u.split('.').map(callback),
										(<span className={styles.GlossSeparator}>.</span>))),
								(<span className={styles.GlossSeparator}>&gt;</span>))),
						(<span className={styles.GlossSeparator}>&lt;</span>))),
				(<span className={styles.GlossSeparator}>-</span>))),
		(<span className={styles.GlossSeparator}>=</span>));
}

export function resolveKey(key: string) {
	return (glossKeys as { [key: string]: string })[key] || key;
}