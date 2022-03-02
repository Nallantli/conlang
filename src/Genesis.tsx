import React from 'react';
import { Gloss } from './Gloss';
import genesis from './genesis.json';
import { GlossTemplate, transliterate } from "./Utils";
import fontStyles from './fontStyle.module.css';
import './default.scss';

const fontStyleNames = [
	"FontLatin",
	"FontEtlSerif",
	"FontEtlSans",
	"FontEtlGothic",
	"FontEtlBlock",
	"FontEtlAkataneen"
];
export interface GenesisProps {
	styles: any
}

export interface GenesisState {
	glossState: number,
	fontOverrideIndex: number,
}

interface PassageTemplate {
	title: string,
	tphnt: string,
	image: string,
	passages: GlossTemplate[];
}

export class Genesis extends React.Component<GenesisProps, GenesisState> {
	constructor(props: GenesisProps) {
		super(props);

		this.state = {
			glossState: 0,
			fontOverrideIndex: 0
		};
	}
	render() {
		const { styles } = this.props;
		const { glossState, fontOverrideIndex } = this.state;
		const passagemap = genesis as PassageTemplate[];
		return (<div className='App'>
			<div className={styles.Content}>
				{(genesis as PassageTemplate[]).map(({ title, tphnt, image, passages }) =>
				(<div>
					<div className={styles.GenesisHeader}>
						<span className={fontStyles[`${fontStyleNames[fontOverrideIndex]}Header`]}>
							{fontOverrideIndex === 0 ? title.replace(/²/g, "") : transliterate(title)}
						</span>
						{glossState > 0 && <div className={styles.GenesisHeaderIPA}>[{tphnt}]</div>}
					</div>
					<div style={{ display: "flex" }}>
						{image && <img className={styles.GenesisImage} src={process.env.PUBLIC_URL + `/${image}`} />}
					</div>
					{glossState === 0 &&
						<div className={styles.RawText}>
							{passages.map((data, i) => (
								<span className={fontStyles[fontStyleNames[fontOverrideIndex]]}>
									<span className={styles.SectionNumber}>{i + 1}{' '}</span>
									{fontOverrideIndex === 0 ? data.text.replace(/²/g, "") : transliterate(data.text)}
									{' '}
								</span>
							))}
						</div>}
					{glossState === 1 &&
						<div>
							{passages.map(data => (<Gloss fontOverride={fontStyleNames[fontOverrideIndex]} noLink={true} hideGloss={true} styles={styles} gloss={data} select={() => { }} />))}
						</div>
					}
					{glossState === 2 &&
						<div>
							{passages.map(data => (<Gloss fontOverride={fontStyleNames[fontOverrideIndex]} noLink={true} hideGloss={false} styles={styles} gloss={data} select={() => { }} />))}
						</div>
					}
				</div>)
				)}
			</div>
			<div className={styles.OptionsContainer}>
				<button className={styles.TextButton}
					onClick={() => this.setState(state => ({ glossState: (state.glossState + 1) % 3 }))}>
					cycle gloss
				</button>
				<br />
				<button className={styles.TextButton}
					onClick={() => this.setState(state => ({ fontOverrideIndex: (state.fontOverrideIndex + 1) % fontStyleNames.length }))}>
					cycle font
				</button>
			</div>
		</div >);
	}
}