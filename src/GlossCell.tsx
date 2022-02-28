import { massInterpolate, resolveKey } from "./Utils";

export function GlossCell(props: { data: [string, string], styles: any }) {
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