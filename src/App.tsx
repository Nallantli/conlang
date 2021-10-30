import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Glosser } from "./Glosser";
import styles from './darkTheme.module.scss';
import { Search } from "./Search";

export default function App() {
	const urlParams = new URLSearchParams(window.location.search);
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Glosser query={urlParams.get('q')?.split('|')} styles={styles} />
				</Route>
				<Route path="/search">
					<Search styles={styles} query={urlParams.get('q') || ''} />
				</Route>
			</Switch>
		</Router>
	);
}