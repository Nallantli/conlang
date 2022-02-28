import fontStyles from './fontStyle.module.css';
import { GlossCell } from "./GlossCell";
import { GlossPhonemic } from "./GlossPhonemic";
import { generateFromText, GlossTemplate, transliterate } from "./Utils";

export function Gloss(props: { noLink?: boolean, hideGloss?: boolean, fontOverride?: string, styles: any, gloss: GlossTemplate, select: (link: string) => void }) {
	const { gloss, select, styles, noLink, hideGloss, fontOverride } = props;
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
			{!noLink &&
				<div className={styles.GlossHeader}>
					<a id={link} className={styles.GlossLink} href={`#${link}`}>#{link}</a>
					<button className={styles.GlossButton} onClick={() => select(link)}>+</button>
				</div>}
			<div>
				<span className={fontOverride ? fontStyles[fontOverride] : fontStyles.FontLatin}>{
					fontOverride && fontOverride !== 'FontLatin' ? transliterate(text) : text.replace(/²/g, '')
				}</span>
			</div>
			<div className={styles.GlossTable}>
				{false && <div className={styles.GlossIPAContainer}>
					<GlossPhonemic styles={styles} data={phnm || generateFromText(text)} />
				</div>}
				{phnt && <div className={styles.GlossIPA}>[{phnt}]</div>}
				{!hideGloss && dataTable}
				{trns && <div className={styles.GlossTrans}>{trns}</div>}
			</div>
			{!hideGloss && expl && <div className={styles.GlossExpl} dangerouslySetInnerHTML={{ __html: expl }}></div>}
		</div>
	);
}