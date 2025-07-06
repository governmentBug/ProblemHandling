using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Common.Services;
public interface IBugHistoryService
{
    List<BugHistory> CreateHistory(Bug original, Bug updated, int changedBy);
}
