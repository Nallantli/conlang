

export function GlossPhonemic(props: { data: string, styles: any }) {
	const { data, styles } = props;
	const r = [];
	let lastHeight = 0;
	for (let i = 0; i < data.length; i++) {
		if (data[i] === '{') {
			let token = '';
			for (let j = i + 1; j < data.length; j++) {
				if (data[j] === '}') {
					i = j;
					break;
				}
				token += data[j];
			}
			const token_parts = token.split(':');
			const newHeight = parseInt(token_parts[1]) - 1;
			if (newHeight >= lastHeight) {
				r.push((
					<span
						className={styles[`level-${token_parts[1]}`]}
					>{token_parts[0]}
						<span
							className={styles["level-after-bottom"]}
							style={{
								top: `calc(100% + ${(lastHeight * 2) + 5}px)`,
								height: `${(newHeight - lastHeight) * 2}px`,
								backgroundImage: `linear-gradient(to ${(newHeight - lastHeight) % 2 === 0 ? 'top' : 'bottom'}, var(--color-text) 50%, rgba(255, 255, 255, 0) 0%)`
							}}
						></span></span>));
			} else {
				r.push((
					<span
						className={styles[`level-${token_parts[1]}`]}
					>{token_parts[0]}
						<span
							className={styles["level-after-top"]}
							style={{
								top: `calc(100% + ${(newHeight * 2) + 5}px)`,
								height: `${(lastHeight - newHeight) * 2}px`,
								backgroundImage: `linear-gradient(to ${(lastHeight - newHeight) % 2 === 0 ? 'bottom' : 'top'}, var(--color-text) 50%, rgba(255, 255, 255, 0) 0%)`
							}}
						></span></span>));
			}
			lastHeight = newHeight;
		} else {
			r.push(data[i]);
			lastHeight = 0;
		}
	}
	return (<div className={styles.GlossIPA}>/{r}/</div>);
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

function transliterate(s: string) {
	return s
		.replace(/²/g, "")
		.replace(/([^\sa-zāēīōū])/g, "")
		.replace(/qu/g, "q")
		.replace(/hu/g, "w")
		.replace(/lh/g, "ly")
		.replace(/tl/g, 'j');
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
