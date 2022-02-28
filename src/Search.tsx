import React from "react";
import { GlossPhonemic } from "./GlossPhonemic";
import lexicon from "./lex-formatted.json";
import { generateFromText } from "./Utils";

function transliterate(s: string) {
	return s
		.replace(/m²/g, "M")
		.replace(/t²/g, "T")
		.replace(/n²/g, "M")
		.replace(/h²/g, "T")
		.replace(/qu/g, "q")
		.replace(/hu/g, "w")
		.replace(/āh/g, "aa")
		.replace(/ēh/g, "ee")
		.replace(/īh/g, "ii")
		.replace(/ōh/g, "oo")
		.replace(/ūh/g, "uu")
		.replace(/ā/g, "a:")
		.replace(/ē/g, "e:")
		.replace(/ī/g, "i:")
		.replace(/ō/g, "o:")
		.replace(/ū/g, "u:")
		.replace(/ihi:/g, "yi:")
		.replace(/ll/g, "lr")
		.replace(/lh/g, "ly")
		.replace(/tl/g, 'j');
}

function reortho(s: string) {
	return s
		.replace(/lr/g, 'll')
		.replace(/aa/g, 'a:h')
		.replace(/ee/g, 'e:h')
		.replace(/ii/g, 'i:h')
		.replace(/oo/g, 'o:h')
		.replace(/uu/g, 'u:h')
		.replace(/yi:/g, 'ihi:')
		.replace(/yi/g, 'i:')
		.replace(/iy([^aeiou]|$)/g, 'i:$1')
		.replace(/wu:/g, 'uhu:')
		.replace(/wu/g, 'u:')
		.replace(/hu/g, 'hü')
		.replace(/a:/g, 'ā')
		.replace(/e:/g, 'ē')
		.replace(/i:/g, 'ī')
		.replace(/o:/g, 'ō')
		.replace(/u:/g, 'ū')
		.replace(/w([aeiouāēīōū])/g, 'hu$1')
		.replace(/M([aeiouāēīōū])/g, 'm²$1')
		.replace(/T([aeiouāēīōū])/g, 't²$1')
		.replace(/Mm/g, 'm²m')
		.replace(/M/g, 'n²')
		.replace(/T/g, 'h²')
		.replace(/ly/g, 'lh')
		.replace(/q/g, 'qu')
		.replace(/j/g, 'tl');
}

function declineNoun(lemma: string[]): [string, string, string, string] {
	const noun = lemma[0];
	if (noun === '*' || lemma.length === 4) {
		return [lemma[0] || '*', lemma[1] || '*', lemma[2] || '*', lemma[3] || '*'];
	}
	if (noun.substr(noun.length - 2) === 'en') {
		let lemma = noun.substr(0, noun.length - 2);
		if (lemma.match(/[cdhklnprswxyzMT]{2}$/)) {
			return [lemma + 'en', lemma.substr(0, lemma.length - 1) + 'a' + lemma[lemma.length - 1], lemma + 'a', lemma.substr(0, lemma.length - 1) + 'o' + lemma[lemma.length - 1]]
		} else if (lemma.match(/[bjtm]$/) || lemma.match(/(aa|ee|ii|oo|uu)[cdhklnprswxyzMT]$/)) {
			return [lemma + 'en', lemma + 'e', lemma + 'e:', lemma + 'u'];
		} else if (lemma.match(/q$/)) {
			return [lemma + 'en', lemma + 'e', lemma + 'e:', lemma + 'o'];
		} else if (lemma.match(/u:$/)) {
			return [lemma + 'en', lemma, lemma + 'e:', lemma + 'o'];
		} else {
			return [lemma + 'en', lemma, lemma + 'e:', lemma + 'u'];
		}
	} else if (noun.substr(noun.length - 2) === ':n') {
		let lemma = noun.substr(0, noun.length - 2);
		if (lemma.match(/[^cdhklnprswxyzMT][cdhklnprswxyzMT:aeiou]e$/) && !lemma.match(/(aa|ee|ii|oo|uu)[cdhklnprswxyzMT]e$/)) {
			return [lemma + ':n', lemma.substr(0, lemma.length - 1), lemma + 'mi', lemma + ':s'];
		} else {
			return [lemma + ':n', lemma, lemma + 'mi', lemma + ':s'];
		}
	} else if (noun.substr(noun.length - 2) === ':s') {
		let lemma = noun.substr(0, noun.length - 2);
		if (lemma.match(/(u:|[uqw])$/)) {
			return [lemma + ':s', lemma + 's', lemma + 'sin', lemma + 'os'];
		} else {
			return [lemma + ':s', lemma + 's', lemma + 'sin', lemma + 'us'];
		}
	} else if (noun.substr(noun.length - 2) === ':x') {
		let lemma = noun.substr(0, noun.length - 2);
		if (lemma.match(/(u:|[uqw])$/)) {
			return [lemma + ':x', lemma + 'x', lemma + 'xin', lemma + 'ox'];
		} else {
			return [lemma + ':x', lemma + 'x', lemma + 'xin', lemma + 'ux'];
		}
	} else if (noun.substr(noun.length - 2) === ':r') {
		let lemma = noun.substr(0, noun.length - 2);
		return [lemma + ':r', lemma + 'r', lemma + 'win', lemma + 'hro'];
	}
	return [lemma[0] || '*', lemma[1] || '*', lemma[2] || '*', lemma[3] || '*'];
}

function Declension(props: { styles: any, data: [string, string, string, string] }) {
	const { styles, data } = props;
	return (
		<div className={styles.GlossExpl}>
			<table>
				<tbody>
					<tr>
						<td></td>
						<td className={styles.TableHeader}>Singular</td>
						<td className={styles.TableHeader}>Plural</td>
					</tr>
					<tr>
						<td className={styles.TableHeader}>Absolutive</td>
						<td>{reortho(data[0]).replaceAll('²', '')}</td>
						<td>{reortho(data[2]).replaceAll('²', '')}</td>
					</tr>
					<tr>
						<td className={styles.TableHeader}>Possessed</td>
						<td>~{reortho(data[1]).replaceAll('²', '')}</td>
						<td>~{reortho(data[3]).replaceAll('²', '')}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function conjugateVerbStem(stem: string) {
	if (stem.match(/[tmqbj]$/)) {
		return stem + 'e';
	}
	if (stem.match(/[^aeiou:][^aeiou:]$/)) {
		return stem + 'e';
	}
	if (stem.match(/(aa|ee|ii|oo|uu)[^aeiou:]$/)) {
		return stem + 'e';
	}
	if (stem.match(/[^aeiou]/) && stem.length === 1) {
		return stem + 'e';
	}
	return stem;
}

function getLookup(lemma: string[]) {
	for (let i = 0; i < lemma.length; i++) {
		if (lemma[i] !== '*') {
			return lemma[i];
		}
	}
	return '';
}

const alphabet = 'aābcdeēfghiījklmnoōpqrstuūvwxyz';

function compareStrings(a: string, b: string): number {
	if (a === '') {
		return -1;
	}
	if (b === '') {
		return 1;
	}
	if (alphabet.indexOf(a[0]) < alphabet.indexOf(b[0])) {
		return -1;
	}
	if (alphabet.indexOf(a[0]) > alphabet.indexOf(b[0])) {
		return 1;
	}
	if (alphabet.indexOf(a[0]) === alphabet.indexOf(b[0])) {
		return compareStrings(a.substr(1), b.substr(1));
	}
	return 0;
}

function Entry(props: { styles: any, entry: any }) {
	const { styles, entry } = props;
	let index = 0;
	for (let i = 0; i < entry.lemma.length; i++) {
		if (entry.lemma[i] !== '*') {
			index = i;
			break;
		}
	}
	return (
		<div className={styles.Entry}>
			<div className={styles.EntryHeader}>
				<span className={styles.EntryLemma}>{entry.lemma[index].replaceAll('²', '')}</span>
				<span className={styles.EntryType}>{entry.altType}</span>
			</div>
			{(entry.type === 'VI' || entry.type === 'VT') && <div className={styles.EntrySubHeader}>
				<span className={styles.EntryNounLemma}>{`${entry.lemma[0].replaceAll('²', '')}, ${reortho(conjugateVerbStem(transliterate(entry.lemma[0].substr(0, entry.lemma[0].length - 1)))).replaceAll('²', '')}nā, ${reortho(conjugateVerbStem(transliterate(entry.lemma[0].substr(0, entry.lemma[0].length - 1)))).replaceAll('²', '')}cā`}</span>
			</div>}
			{entry.lemma.length > 1 && (<div className={styles.EntrySubHeader}>
				<span className={styles.EntryNounLemma}>{`${entry.lemma[index].replaceAll('²', '')}, ~${entry.lemma[index + 1].replaceAll('²', '')}`}</span>
			</div>)}
			<div className={styles.EntryIPA}>
				<GlossPhonemic styles={styles} data={generateFromText(entry.lemma[index])} />
			</div>
			<div className={styles.EntryBody}>
				{entry.definition.map((def: string, i: number) => (
					<div key={i} className={styles.EntryDef}>
						<span className={styles.EntryDefIndex}>{i + 1}</span>
						<span className={styles.EntryDefText}>{def}</span>
					</div>
				))}
			</div>
			{entry.type === 'N' && (<Declension styles={styles} data={entry.declensions || declineNoun(entry.lemma.map(transliterate))} />)}
		</div>
	);
}

interface SearchProps {
	styles: any;
	query: string;
}

interface SearchState {
	query: string;
	results: any[];
}

export class Search extends React.Component<SearchProps, SearchState> {
	constructor(props: SearchProps) {
		super(props);
		this.state = {
			query: props.query,
			results: lexicon.sort((a: any, b: any) => compareStrings(getLookup(a.lemma), getLookup(b.lemma))),
		}
	}

	render() {
		const { styles } = this.props;
		const { results, query } = this.state;
		let r: RegExp | undefined = undefined;
		try {
			r = new RegExp(query);
		} catch (error) {
		}
		return (
			<div className={styles.Content}>
				<div className={styles.SearchBar}>
					<input type="text" value={query} onChange={(e) => this.setState({ query: e.target.value })} />
				</div>
				<div className={styles.SearchResults}>
					{(r ? results.filter(w => getLookup(w.lemma).replaceAll('²', '').match(r as RegExp)) : results).map(entry => (<Entry styles={this.props.styles} entry={entry} />))}
				</div>
			</div>
		)
	}
}