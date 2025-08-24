using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByUser
{
    public record class GetByUserQuery(int UserId):IRequest<ByUserDto>{}
    public class GetByUserQueryHandler : IRequestHandler<GetByUserQuery, ByUserDto>
    {
        private readonly IApplicationDbContext _context;
        public GetByUserQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public Task<ByUserDto> Handle(GetByUserQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;
            var userBugs = _context.Bugs
                .Where(b => b.CreatedByUserId == userId)
                .Select(b => new
                {
                    b.StatusId,
                    b.Status.StatusName,
                    b.Priority.PriorityName,
                    b.Created,
                    b.BugHistories
                })
                .ToList();

            var totalBugs = userBugs.Count;
            var treatBugs = userBugs.Count(b => b.StatusName == "בטיפול");

            var closeStatusId = _context.Statuses.First(s => s.StatusName == "סגור").StatusId;
            var closedBugs = userBugs.Where(b => b.StatusId == closeStatusId).ToList();
            double avgTreatment = 0;
            if (closedBugs.Count > 0)
            {
                var totalDays = closedBugs.Sum(b =>
                {
                    var closeHistory = b.BugHistories
                        .FirstOrDefault(h => h.ChangedField == "StatusId" && h.NewValue == closeStatusId.ToString());
                    return closeHistory != null ? (closeHistory.ChangeDate - b.Created).Days : 0;
                });
                avgTreatment = (double)totalDays / closedBugs.Count;
            }

            var byPriority = new ByPriorityDto
            {
                Low = userBugs.Count(b => b.PriorityName == "נמוך"),
                Medium = userBugs.Count(b => b.PriorityName == "בינוני"),
                High = userBugs.Count(b => b.PriorityName == "גבוה"),
                Critical = userBugs.Count(b => b.PriorityName == "קריטי"),
                Total = totalBugs
            };

            return Task.FromResult(new ByUserDto
            {
                TotalBugs = totalBugs,
                TreatBugs = treatBugs,
                AverageTreatmenTime = avgTreatment,
                ByPriority = byPriority
            });
        }
    }

}
