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