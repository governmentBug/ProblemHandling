using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByUsers
{
    public record class GetByUsersQuery : IRequest<ByUsersDto> { }
public class GetByUsersQueryHandler : IRequestHandler<GetByUsersQuery, ByUsersDto>
    {
        private readonly IApplicationDbContext _context;
        public GetByUsersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ByUsersDto> Handle(GetByUsersQuery request, CancellationToken cancellationToken)
        {
            var query = from bug in _context.Bugs
                        group bug by bug.CreatedByUser into g
                        select new
                        {
                            UserName = g.Key.FullName,
                            TotalBugs = g.Count(),
                            TreatedBugs = g.Count(b => b.Status.StatusName.Equals("בטיפול")
                            || b.Status.StatusName.Equals("סגור"))
                        };

            var result = await query.ToListAsync(cancellationToken); 
            var byUsers = new ByUsersDto(result.Count());
            byUsers.UsersName = result.Select(x => x.UserName).ToArray();
            byUsers.TotalBugs = result.Select(x => x.TotalBugs).ToArray();
            byUsers.TreatedBugs = result.Select(x => x.TreatedBugs).ToArray();

            return byUsers;
        }
    }
}
