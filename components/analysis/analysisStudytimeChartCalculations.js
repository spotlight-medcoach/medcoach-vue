const { DateTime } = require('luxon')

export const fillEmptyDaysGroupingByMonth = (subcriptionStartAt, subcriptionEndAt) => {
	const nMonths = Math.ceil(subcriptionEndAt.diff(subcriptionStartAt, 'month').values.months)
	return Array
		.from({ length: nMonths }, (x, i) => subcriptionStartAt.plus({ months: i }))
		.reduce((acc, monthDate, idx, arr) => {
			const monthKey = monthDate.toFormat('yyyyMM')
			const monthStartOnDay = monthDate.startOf('month')
			const monthEndOnDay = monthDate.endOf('month')
			const nDays = Math.ceil(monthEndOnDay.diff(monthStartOnDay, 'days').values.days)
			const filledDays = Array
				.from({ length: nDays }, (x, i) => monthStartOnDay.plus({ days: i }))
				.reduce((acc, dayDate, idx, arr) => {
					const dayKey = dayDate.day
					const dayValue = 0
					acc[dayKey] = dayValue
					return acc
				}, {})
			acc[monthKey] = {
				key: monthKey,
				date: monthStartOnDay,
				start_on: monthStartOnDay.toISODate(),
				end_on: monthEndOnDay.toISODate(),
				study_minutes: 0,
				days: filledDays
			}
			return acc
		}, { days: {} })
}

export const formatByDayGroupingByMonth = (studyTimesDays) => {
	return studyTimesDays
		.reduce((acc, st, idx, arr) => {
			const date = DateTime.fromISO(st.date, { zone: 'utc' })
			const monthKey = date.toFormat('yyyyMM')
			if (!acc[monthKey]) {
				acc[monthKey] = {
					key: monthKey,
					date: date.startOf('month'),
					start_on: date.startOf('month').toISODate(),
					end_on: date.endOf('month').toISODate(),
					study_minutes: 0,
					days: {} // dayIndex: studyTime
				}
			}
			acc[monthKey].days[date.day] = Math.round(st.study_minutes / 60 * 100) / 100
			acc[monthKey].study_minutes += st.study_minutes
			if (acc[monthKey].study_minutes > acc.best.study_minutes) {
				acc.best = acc[monthKey]
			}
			return acc
		}, { best: { study_minutes: 0 } })
}

export const calculeDayValues = (ref, range) => {
	if (ref.days) {
		return range.map((dayIndex) => {
			const studyTimeDay = Math.round(ref.days[dayIndex] / 60 * 100) / 100
			return studyTimeDay || 0
		})
	}
	return 0
}
