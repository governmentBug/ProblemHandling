using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using GovernmentBug.Application.Common.Exceptions;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GovernmentBug.Application.Bugs.Queries.GetBugDetails
{
    public record GetBugDetailsQuery(int BugId) : IRequest<BugDetailsDto>;

    public class GetBugDetailsQueryHandler : IRequestHandler<GetBugDetailsQuery, BugDetailsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBugDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BugDetailsDto> Handle(GetBugDetailsQuery request, CancellationToken cancellationToken)
        {
            var bug = await _context.Bugs
               .AsNoTracking()
               .Where(b => b.BugID == request.BugId)
                .Include(b => b.Status)
                .Include(b => b.CreatedByUser)
                .Select(b => new BugDetailsDto
                {
                    BugId = b.BugID,
                    //CategoryName = b.Category.Name,
                    Title = b.Title,
                    Description = b.Description,
                    PriorityName = b.PriortyId,
                    StatusName = b.Status.ToString(),
                    AssignedToUserFullName = b.Status==StatusBug.In_progress ? b.CreatedByUser.FullName : null,
                    CreatedByUserFullName = b.CreatedByUser.FullName,
                    CreatedDate = b.CreatedDate
                })
               .FirstOrDefaultAsync(cancellationToken);
            if (bug == null)
                throw new NotFoundException("Bug", request.BugId.ToString());

            return bug;
        }
    }
}
