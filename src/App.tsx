import { Glosser } from "./Glosser";
import styles from './darkTheme.module.scss';
import { Search } from "./Search";
import { Genesis } from "./Genesis";

export default function App() {
	return <Genesis styles={styles} />;
	/*
	const urlParams = new URLSearchParams(window.location.search);
	switch (window.location.hash) {
	case "#/search":
		return <Search styles={styles} query={urlParams.get('q') || ''} />;
	case "#/genesis":
		return <Genesis styles={styles} />;
	default:
		return <Glosser query={urlParams.get('q')?.split('|')} styles={styles} />;
	}
	*/
}