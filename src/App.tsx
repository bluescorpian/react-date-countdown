import { useState, useMemo, useEffect } from 'react';
import './App.css';
import * as Countdown from 'countdown';

function App() {
	const [countdown, setCountdown] = useState<countdown.Timespan | null>();

	const queryParams = useMemo(() => new URLSearchParams(window.location.search), [document.location.search]);

	const targetDate = useMemo(() => {
		const rawEpoch = queryParams.get('t');

		if (rawEpoch !== null) {
			const epoch = parseInt(rawEpoch);
			if (!isNaN(epoch)) {
				return epoch;
			}
		}
		return Date.now();
	}, [queryParams.get('t')]);

	const now = Date.now();

	function calculateCountdown() {
		if (targetDate) {
			const timeSpan = Countdown(Date.now(), targetDate, Countdown.DEFAULTS, 2) as countdown.Timespan;
			setCountdown(timeSpan);
		}
	}

	function formatCountdown(html: boolean) {
		if (countdown) {
			return (targetDate > now ? 'in ' : '') + (html ? countdown.toHTML('b', 'now') : countdown.toString('now')) + (targetDate < now ? ' ago' : '');
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
