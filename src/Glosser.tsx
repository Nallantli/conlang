import React from 'react';
import './default.scss';
import fontStyles from './fontStyle.module.css';
import glossKeys from './glossKeys.json';
import akamemi from './akamemi.json';

interface GlossTemplate {
	"link": string,
	"text": string,
	"phnm"?: string,
	"phnt"?: string,
	"trns": string,
	"expl"?: string,
	"data": [string, string]
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
function massInterpolate(styles: any, value: string, callback: (a: string) => any) {
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

function resolveKey(key: string) {
	return (glossKeys as { [key: string]: string })[key] || key;
}

function GlossCell(props: { data: [string, string], styles: any }) {
	const { data, styles } = props;
	const [gloss, value] = data;
	return (
		<table className={styles.GlossCell}>
			<tbody>
				<tr>
					<td>{gloss.replace(/²/g, "").replace(/\Ø/g, "∅").replace(/\_/g, ' ')}</td>
				</tr>
				<tr>
					<td>
						{massInterpolate(styles, value, unit => {
							if (unit === '') {
								return undefined;
							}
							switch (unit[0]) {
								case '$':
									return (<span className={styles.SmallCaps}>{unit.replace(/\_/g, ' ').substr(1)}<div className={styles.GlossHover}><p>{resolveKey(unit.replace(/\_/g, ' ').substr(1))}</p></div></span>);
								default:
									return (<span className={styles.GlossWord}>{unit.replace(/\_/g, ' ')}</span>);
							}
						})}
					</td>
				</tr>
			</tbody>
		</table>
	);
}

function GlossPhonemic(props: { data: string, styles: any }) {
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

function generateFromText(text: string) {
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

function Gloss(props: { styles: any, gloss: GlossTemplate, select: (link: string) => void }) {
	const { gloss, select, styles } = props;
	const { data, link, text, phnm, phnt, trns, expl } = gloss;
	const [glosses, values] = data;
	const splitGloss = glosses.split(/\s+/g);
	const splitValue = values.split(/\s+/g);
	const dataTable = [];
	dataTable.push(<div>{
		splitGloss.map((gloss, i) => (<GlossCell styles={styles} data={[gloss, splitValue[i]]} />))
	}</div>);
	return (
		<div className={styles.Gloss}>
			<div className={styles.GlossHeader}>
				<a id={link} className={styles.GlossLink} href={`#${link}`}>#{link}</a>
				<button className={styles.GlossButton} onClick={() => select(link)}>+</button>
			</div>
			<div>
				<span className={fontStyles.FontLatin}>{text.replace(/²/g, '')}</span>
			</div>
			<div className={styles.GlossTable}>
				<GlossPhonemic styles={styles} data={phnm || generateFromText(text)} />
				{phnt && <div className={styles.GlossIPA}>[{phnt}]</div>}
				{dataTable}
				{trns && <div className={styles.GlossTrans}>{trns}</div>}
			</div>
			{expl && <div className={styles.GlossExpl} dangerouslySetInnerHTML={{ __html: expl }}></div>}
		</div>
	);
}

interface GlosserProps {
	query?: string[],
	styles: any
}
interface GlosserState {
	query: string[],
	newQuery: string[],
	glosses: GlossTemplate[]
}

function arrayEqual(a: any[], b: any[]) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

export class Glosser extends React.Component<GlosserProps, GlosserState> {
	constructor(props: GlosserProps) {
		super(props);
		this.selectGloss = this.selectGloss.bind(this);
		this.removeGloss = this.removeGloss.bind(this);
		this.applyQuery = this.applyQuery.bind(this);
		this.clearQuery = this.clearQuery.bind(this);
		this.state = {
			query: props.query || [],
			newQuery: props.query || [],
			glosses: (akamemi as GlossTemplate[]) || []
		};
	}

	selectGloss(link: string) {
		if (this.state.newQuery.indexOf(link) === -1) {
			this.setState({
				newQuery: this.state.newQuery.concat(link).sort()
			});
		}
	}

	removeGloss(link: string) {
		this.setState({
			newQuery: this.state.newQuery.filter(q => q !== link)
		}, () => {
			if (this.state.newQuery.length === 0) {
				this.clearQuery();
			}
		});
	}

	clearQuery() {
		this.setState({
			query: []
		});
	}

	applyQuery() {
		this.setState({
			query: this.state.newQuery
		});
	}

	render() {
		const { styles } = this.props;
		const { query, newQuery, glosses } = this.state;
		return (
			<div className="App">
				<div className={styles.Content}>
					{(query.length != 0 ? glosses.filter(a => query.includes(a.link)) : glosses)
						.map(data => (<Gloss styles={styles} gloss={data} select={this.selectGloss} />))}
				</div>
				{
					newQuery.length !== 0 &&
					<div className={styles.NewQueryContainer}>
						<button onClick={() => {
							window.location.href = `?q=${newQuery.join('|')}`;
						}} className={styles.NewQueryTotal}>{`?q=${newQuery.join('|')}`}</button>
						<div className={styles.ButtonContainer}>
							<button className={styles.TextButton} onClick={() => this.clearQuery()}>RESET</button>
							<button className={styles.TextButton} onClick={() => this.applyQuery()}>APPLY</button>
						</div>
						{newQuery.map(link => (<button onClick={() => this.removeGloss(link)} className={styles.NewQuery}>{link}</button>))}
						<div className={styles.NewQueryContainerAfter}>{`~ LINK(${newQuery.length}) ~`}</div>
					</div>
				}
			</div>
		);
	}
}
