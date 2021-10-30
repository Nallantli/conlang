import { Glosser } from "./Glosser";
import styles from './darkTheme.module.scss';
import { Search } from "./Search";

export default function App() {
	const urlParams = new URLSearchParams(window.location.search);
	console.log(window.location.hash);
	switch (window.location.hash) {
		case "#/search":
			return <Search styles={styles} query={urlParams.get('q') || ''} />;
		default:
			return <Glosser query={urlParams.get('q')?.split('|')} styles={styles} />;
	}
}