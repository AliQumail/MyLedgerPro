namespace server.Services
{
    public static class ReminderScheduleCalculator
    {
        public static DateTime ComputeNextRunAt(string frequency, TimeSpan timeOfDay, int? dayOfWeek, int? dayOfMonth, DateTime fromUtc)
        {
            var from = fromUtc;

            switch (frequency)
            {
                case "Once":
                    {
                        var candidate = from.Date + timeOfDay;
                        if (candidate <= from) candidate = candidate.AddDays(1);
                        return candidate;
                    }
                case "Daily":
                    {
                        var candidate = from.Date + timeOfDay;
                        if (candidate <= from) candidate = candidate.AddDays(1);
                        return candidate;
                    }
                case "Weekly":
                    {
                        var targetDow = dayOfWeek ?? (int)from.DayOfWeek;
                        var candidate = from.Date + timeOfDay;
                        var diff = ((targetDow - (int)candidate.DayOfWeek) + 7) % 7;
                        candidate = candidate.AddDays(diff);
                        if (candidate <= from) candidate = candidate.AddDays(7);
                        return candidate;
                    }
                case "Monthly":
                    {
                        var targetDom = Math.Clamp(dayOfMonth ?? 1, 1, 28);
                        var candidate = new DateTime(from.Year, from.Month, targetDom) + timeOfDay;
                        if (candidate <= from) candidate = candidate.AddMonths(1);
                        return candidate;
                    }
                default:
                    return from.AddDays(1);
            }
        }
    }
}
