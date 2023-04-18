import { useState, useMemo, useEffect } from 'react';
import './App.css';
import countdown from './countdown';

function App() {
	const [formattedCountdown, setCountdown] = useState<countdown.Timespan | null>();

	const targetDate = useMemo(() => {
		const rawEpoch = new URLSearchParams(window.location.search).get('t');

		if (rawEpoch !== null) {
			const epoch = parseInt(rawEpoch);
			if (!isNaN(epoch)) {
				return epoch;
			}
		}
		return Date.now();
	}, [window.location.search]);

	const now = Date.now();

	function calculateCountdown() {
		if (targetDate) {
			const formatted = countdown(Date.now(), targetDate, countdown.DEFAULTS, 2) as countdown.Timespan;
			setCountdown(formatted);
		}
	}

	function formatCountdown(html: boolean) {
		if (formattedCountdown) {
			return (
				(targetDate > now ? 'in ' : '') +
				(html ? formattedCountdown.toHTML('b', 'now') : formattedCountdown.toString('now')) +
				(targetDate < now ? ' ago' : '')
			);
		} else return 'now';
	}

	useEffect(() => {
		calculateCountdown();
		const interval = setInterval(() => calculateCountdown(), 1000);

		return () => clearInterval(interval);
	}, [targetDate]);

	document.title = formatCountdown(false);

	return (
		<div className='App'>
			<div className='countdown'>
				<span dangerouslySetInnerHTML={{ __html: formatCountdown(true) }}></span>
			</div>
		</div>
	);
}

export default App;
