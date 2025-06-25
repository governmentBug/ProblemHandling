using System;

namespace GovernmentBug.Application.Common.Models
{
    public class BugHistoryDto
    {
        public int HistoryID { get; init; }
        public int BugID { get; init; }
        public string ChangedField { get; init; } = string.Empty;
        public string OldValue { get; init; } = string.Empty;
        public string NewValue { get; init; } = string.Empty;
        public int ChangedBy { get; init; }
        public DateTime ChangeDate { get; init; }

    }
}
