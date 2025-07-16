using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByStatus
{
    public record class GetByStatusQuery : IRequest<ByStatusDto>
    {
    }
    public class GetByStatusQueryHandler : IRequestHandler<GetByStatusQuery, ByStatusDto>
    {
        private readonly IApplicationDbContext _context;
        public GetByStatusQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ByStatusDto> Handle(GetByStatusQuery request, CancellationToken cancellationToken)
        {
            var byStatusDto = new ByStatusDto();
            byStatusDto.TotalBugs = await _context.Bugs.CountAsync(cancellationToken);

            byStatusDto.OpenBugs.Total = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("פתוח"), cancellationToken);
            byStatusDto.OpenBugs.Low = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("פתוח")
            && b.Priority.PriorityName.Equals("נמוך"), cancellationToken);
            byStatusDto.OpenBugs.Medium = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("פתוח")
            && b.Priority.PriorityName.Equals("בינוני"), cancellationToken);
            byStatusDto.OpenBugs.High = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("פתוח")
            && b.Priority.PriorityName.Equals("גבוה"), cancellationToken);
            byStatusDto.OpenBugs.Critical = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("פתוח")
            && b.Priority.PriorityName.Equals("קריטי"), cancellationToken);

            byStatusDto.CloseBugs.Total = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("סגור"), cancellationToken);
            byStatusDto.CloseBugs.Low = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("סגור")
            && b.Priority.PriorityName.Equals("נמוך"), cancellationToken);
            byStatusDto.CloseBugs.Medium = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("סגור")
            && b.Priority.PriorityName.Equals("בינוני"), cancellationToken);
            byStatusDto.CloseBugs.High = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("סגור")
            && b.Priority.PriorityName.Equals("גבוה"), cancellationToken);
            byStatusDto.CloseBugs.Critical = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("סגור")
            && b.Priority.PriorityName.Equals("קריטי"), cancellationToken);

            byStatusDto.ActiveBugs.Total = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בטיפול"), cancellationToken);
            byStatusDto.ActiveBugs.Low = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בטיפול")
            && b.Priority.PriorityName.Equals("נמוך"), cancellationToken);
            byStatusDto.ActiveBugs.Medium = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בטיפול")
            && b.Priority.PriorityName.Equals("בינוני"), cancellationToken);
            byStatusDto.ActiveBugs.High = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בטיפול")
            && b.Priority.PriorityName.Equals("גבוה"), cancellationToken);
            byStatusDto.ActiveBugs.Critical = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בטיפול")
            && b.Priority.PriorityName.Equals("קריטי"), cancellationToken);

            byStatusDto.CancelledBugs.Total = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בוטל"), cancellationToken);
            byStatusDto.CancelledBugs.Low = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בוטל")
            && b.Priority.PriorityName.Equals("נמוך"), cancellationToken);
            byStatusDto.CancelledBugs.Medium = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בוטל")
            && b.Priority.PriorityName.Equals("בינוני"), cancellationToken);
            byStatusDto.CancelledBugs.High = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בוטל")
            && b.Priority.PriorityName.Equals("גבוה"), cancellationToken);
            byStatusDto.CancelledBugs.Critical = await _context.Bugs.CountAsync(b => b.Status.StatusName.Equals("בוטל")
            && b.Priority.PriorityName.Equals("קריטי"), cancellationToken);

            return byStatusDto;
        }
    }

}
