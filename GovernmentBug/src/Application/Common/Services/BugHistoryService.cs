using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Common.Services;
public class BugHistoryService :IBugHistoryService
{
    public List<BugHistory> CreateHistory(Bug original, Bug updated, int changedBy)
    {
        var result = new List<BugHistory>();

        var properties = typeof(Bug).GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(p => p.CanRead && p.CanWrite &&
                        p.PropertyType == typeof(string) || p.PropertyType.IsValueType)
            .Where(p => !new[] { "BugID", "CreatedDate", "CreatedByUserId" }.Contains(p.Name));

        foreach (var prop in properties)
        {
            var oldVal = prop.GetValue(original)?.ToString() ?? string.Empty;
            var newVal = prop.GetValue(updated)?.ToString() ?? string.Empty;

            if (oldVal != newVal)
            {
                result.Add(new BugHistory
                {
                    BugID = updated.BugID,
                    ChangedField = prop.Name,
                    OldValue = oldVal,
                    NewValue = newVal,
                    ChangedBy = changedBy,
                    ChangeDate = DateTime.UtcNow
                });
            }
        }

        return result;
    }

}
