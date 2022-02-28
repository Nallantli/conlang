import React from 'react';
import './default.scss';
import akamemi from './akamemi.json';
import { generateFromText, GlosserProps, GlosserState, GlossTemplate } from './Utils';
import { Gloss } from './Gloss';

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
