using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.getByCategory
{
    public record class GetByCategoryQuery:IRequest<ByCategoryDto>{}
    public class GetByCategoryQueryHandler : IRequestHandler<GetByCategoryQuery, ByCategoryDto>
    {
        private readonly IApplicationDbContext _context;
        public GetByCategoryQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public Task<ByCategoryDto> Handle(GetByCategoryQuery request, CancellationToken cancellationToken)
        {
            var bugsByCategory = _context.Bugs.GroupBy(b => b.Category.CategoryName);
            var byCategory = new ByCategoryDto();
            foreach (var bugs in bugsByCategory)
            {
                byCategory.ByCategory.Add(bugs.Key, bugs.Count());
            }
            return Task.FromResult(byCategory);
        }
    }
}
