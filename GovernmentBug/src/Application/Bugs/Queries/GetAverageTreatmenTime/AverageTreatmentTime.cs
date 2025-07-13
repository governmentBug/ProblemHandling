using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetAverageTreatmenTime
{
    public record class AverageTreatmentTimeQuery : IRequest<double>
    {
        public AverageTreatmentTimeQuery(int priorityId, int categoryId, DateTime created)
        {
            PriorityId = priorityId;
            CategoryId = categoryId;
            Created = created;
        }

        public int PriorityId { get; }
        public int CategoryId { get; }
        public DateTime Created { get; }
    }
    public class AverageTreatmentTimeQueryHandler : IRequestHandler<AverageTreatmentTimeQuery, double>
    {
        private readonly IApplicationDbContext _context;
        public AverageTreatmentTimeQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<double> Handle(AverageTreatmentTimeQuery request, CancellationToken cancellationToken)
        {
            var bugs = await _context.Bugs
                .Where(b => b.PriorityId == request.PriorityId &&
                            b.CategoryId == request.CategoryId &&
                            b.Category.CategoryName.Equals("Closed"))
                .Select(b => new
                {
                    b.CreatedDate,
                    b.BugHistories
                })
                .ToListAsync(cancellationToken);
            int totalDays = 0;
            foreach (var b in bugs)
            {
                var closedHistory = b.BugHistories
                    .Where(h => h.ChangedField.Equals("StatusId") && h.NewValue.Equals("3"))
                    .OrderByDescending(h=>h.Created)
                    .FirstOrDefault();
                totalDays += closedHistory != null ? (closedHistory.Created - b.CreatedDate).Days : 0;
            }
            return totalDays / bugs.Count;
        }
    }
}
