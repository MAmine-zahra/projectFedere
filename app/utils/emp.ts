export function isTodayOutsideIntervals(intervals: { date_emprunt: Date; date_retour: Date }[]): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    return intervals.some(({ date_emprunt, date_retour }) => {
        const start = new Date(date_emprunt);
        start.setHours(0, 0, 0, 0); // Normalize start date to midnight

        const end = new Date(date_retour);
        end.setHours(0, 0, 0, 0); // Normalize end date to midnight
        console.log(today > start || today < end)
        return today > start || today < end;
    });
}
