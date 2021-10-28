import React from 'react';
import './darkTheme.module.scss';
import './default.scss';
import styles from './styles.module.scss';
import fontStyles from './fontStyle.module.css';
import glossKeys from './glossKeys.json';
import akamemi from './akamemi.json';

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
function massInterpolate(value: string, callback: (a: string) => any) {
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

function GlossCell(props: { data: [string, string] }) {
	const [gloss, value] = props.data;
	return (
		<table className={styles.GlossCell}>
			<tbody>
				<tr>
					<td>{gloss.replace(/²/g, "").replace(/\Ø/g, "∅").replace(/\_/g, ' ')}</td>
				</tr>
				<tr>
					<td>
						{massInterpolate(value, unit => {
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

function GlossPhonemic(props: { data: string }) {
	const { data } = props;
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

function Gloss(props: { link?: string, text: string, phnm?: string, phnt?: string, trns: string, expl?: string, data: string[] }) {
	const { link, data, text, phnm, phnt, trns, expl } = props;
	const [glosses, values] = data;
	const splitGloss = glosses.split(/\s+/g);
	const splitValue = values.split(/\s+/g);
	const dataTable = [];
	dataTable.push(<div>{
		splitGloss.map((gloss, i) => (<GlossCell data={[gloss, splitValue[i]]} />))
	}</div>);
	return (
		<div className={styles.Gloss}>
			{link && <a id={link} className={styles.GlossLink} href={`#${link}`}>#{link}</a>}
			<div>
				<span className={fontStyles.FontLatin}>{text.replace(/²/g, '')}</span>
			</div>
			<div className={styles.GlossTable}>
				{phnm && <GlossPhonemic data={phnm} />}
				{phnt && <div className={styles.GlossIPA}>[{phnt}]</div>}
				{dataTable}
				{trns && <div className={styles.GlossTrans}>{trns}</div>}
			</div>
			{expl && <div className={styles.GlossExpl} dangerouslySetInnerHTML={{__html: expl}}></div>}
		</div>
	);
}

function App() {
	return (
		<div className="App">
			<div className={styles.Content}>
				{
					akamemi.map(data => (<Gloss {...data} />))
				}
			</div>
		</div>
	);
}

export default App;
