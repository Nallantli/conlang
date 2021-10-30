import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import styles from './darkTheme.module.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Search } from './Search';

const urlParams = new URLSearchParams(window.location.search);

ReactDOM.render(
	<React.StrictMode>
		{(() => {
			switch (window.location.pathname) {
				default:
					return (<App query={urlParams.get('q')?.split('|')} styles={styles} />);
				case '/conlang/search':
				case '/search':
					return (<Search styles={styles} query={urlParams.get('q') || ''} />);
			}
		})()}
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
