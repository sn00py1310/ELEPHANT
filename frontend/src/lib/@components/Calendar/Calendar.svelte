<script lang="ts">
	import { Calendar } from 'calendar';
	import dayjs from 'dayjs';
	import * as ical from 'ical';
	import { RRule } from 'rrule';
	import type { Entry } from './Ical';

	export let calendar: string | null = null;
	export let full = false;

	let date = dayjs();
	const cal = new Calendar(1);

	let parsedData: { date: Number; entries: Entry[] }[][] = [];
	let displayData: { date: Number; entries: Entry[] }[][] = [];

	let data: Entry[] = [];

	$: if (calendar) generate(calendar);
	$: if (date) insertDataToCalender();
	$: displayData = full ? parsedData : [parsedData[0]];

	const generate = (calender: string) => {
		data = [];
		let icsJSON: ical.FullCalendar;
		try {
			icsJSON = ical.parseICS(calender);
		} catch (error) {
			console.warn('parse ics error', error);
			return;
		}
		Object.values(icsJSON).forEach(
			({ start, description, summary, location, end, uid, url, exdate, rrule }) => {
				let date: Date = new Date(start ?? '');
				if (!date) return;
				date.setHours(0, 0, 0, 0);

				if (!description || !summary || !location || !end || !start || !uid || !url || date) return;

				data.push({
					description,
					summary,
					location,
					end,
					start,
					uid,
					url,
					date
				});

				if (!exdate || !rrule) return;
				const _exdate: Date[] = Object.values(exdate);
				const rule = new RRule(rrule.origOptions);
				const removedExDates = rule
					.all()
					.filter((x) => !_exdate.some((d) => d.getTime() === x.getTime()));
				removedExDates.forEach((additionalDate) => {
					additionalDate.setHours(0, 0, 0, 0);
					data.push({
						description,
						summary,
						location,
						end,
						start,
						uid,
						url,
						date: additionalDate
					});
				});
			}
		);
		insertDataToCalender();
	};

	const insertDataToCalender = () => {
		parsedData = [];
		cal.monthDates(date.get('y'), date.get('M')).forEach((week, i) => {
			const nWeek: { date: number; entries: Entry[] }[] = [];
			week.forEach((day, y) => {
				const entries = data.filter((x) => x.date.getTime() === day.getTime());
				nWeek.push({ date: day.getDate(), entries });
			});
			parsedData.push(nWeek);
		});
	};
</script>

<div id="actions">
	<button on:click={() => (date = date.add(-1, 'M'))}>prev</button><span
		>{date.format('MMMM YYYY')}</span
	><button on:click={() => (date = date.add(1, 'M'))}>next</button>
</div>
<div id="overflow">
	<table>
		<tr>
			<th>mo</th>
			<th>th</th>
			<th>we</th>
			<th>th</th>
			<th>fr</th>
			<th>sa</th>
			<th>su</th>
		</tr>
		{#each displayData as week}
			<tr>
				{#each week as day}
					<td>
						<div class="day">
							<span>
								{day.date}
							</span>
							<div>
								{#each day.entries as entry}
									<div class="entry">
										<span class="time">
											{dayjs(entry.start).format('HH:mm')}-{dayjs(entry.end).format('HH:mm')}
										</span>
										<span>
											{entry.summary}
										</span>
									</div>
								{/each}
							</div>
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</table>
</div>

<style>
	#overflow {
		overflow: auto;
	}
	#actions {
		display: flex;
		justify-content: space-between;
	}
	#actions button {
		width: 7em;
	}
	#actions span {
		margin: auto;
		font-weight: 600;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	td,
	th {
		border: 1px solid var(--ctp-macchiato-text);
		vertical-align: top;
		max-width: 5em;
	}
	th {
		padding: 0.5em 1em;
		text-align: center;
	}
	.day {
		display: flex;
		flex-direction: column;
		align-items: start;
		padding: 3px;
		height: 100%;
		width: 100%;
	}
	.day > span {
		font-size: 11px;
		line-height: 11px;
		padding-bottom: 5px;
	}
	.day > div {
		min-height: 2em;
		display: flex;
		gap: 5px;
		height: 100%;
		width: 100%;
		flex-direction: column;
	}
	.entry {
		background-color: var(--ctp-macchiato-surface0);
		border-radius: 5px;
		max-height: 45px;
		padding: 4px;
		overflow: hidden;
		cursor: pointer;
		display: flex;
		flex-direction: column;
	}
	.entry .time {
		color: var(--ctp-macchiato-sky);
	}
	.entry span {
		font-size: 11px;
		line-height: 15px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.entry:hover {
		max-height: max-content;
	}
	.entry:hover span {
		white-space: initial;
		text-overflow: initial;
	}
</style>
