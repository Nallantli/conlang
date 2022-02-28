import React from 'react';
import { Gloss } from './Gloss';
import genesis from './genesis.json';
import { GlossTemplate } from "./Utils";
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
	hideGloss: boolean,
	fontOverrideIndex: number,
}

interface PassageTemplate {
	title: string,
	tphnt: string,
	passages: GlossTemplate[];
}

export class Genesis extends React.Component<GenesisProps, GenesisState> {
	constructor(props: GenesisProps) {
		super(props);

		this.state = {
			hideGloss: true,
			fontOverrideIndex: 0
		};
	}
	render() {
		const { styles } = this.props;
		const { hideGloss, fontOverrideIndex } = this.state;
		const passagemap = genesis as PassageTemplate[];
		return (<div className='App'>
			<div className={styles.Content}>
				{(genesis as PassageTemplate[]).map(section =>
				(<div>
					<div className={styles.GenesisHeader}>
						{section.title}
						<div className={styles.GenesisHeaderIPA}>[{section.tphnt}]</div>
					</div>
					<div>
						{section.passages.map(data => (<Gloss fontOverride={fontStyleNames[fontOverrideIndex]} noLink={true} hideGloss={hideGloss} styles={styles} gloss={data} select={() => { }} />))}
					</div>
				</div>)
				)}
			</div>
			<div className={styles.OptionsContainer}>
				<button className={styles.TextButton}
					onClick={() => this.setState(state => ({ hideGloss: !state.hideGloss }))}>
					toggle gloss
				</button>
				<br />
				<button className={styles.TextButton}
					onClick={() => this.setState(state => ({ fontOverrideIndex: (state.fontOverrideIndex + 1) % fontStyleNames.length }))}>
					cycle font
				</button>
			</div>
		</div>);
	}
}