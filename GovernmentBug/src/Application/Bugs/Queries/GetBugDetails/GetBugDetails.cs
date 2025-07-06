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
    public record GetBugDetailsQuery(int BugId) : IRequest<BugDetalsDto>
    {
        public class GetBugDetailsQueryHandler : IRequestHandler<GetBugDetailsQuery, BugDetalsDto>
        {
            private readonly IApplicationDbContext _context;
            private readonly IMapper _mapper;

            public GetBugDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<BugDetalsDto> Handle(GetBugDetailsQuery request, CancellationToken cancellationToken)
            {
                var bug = await _context.Bugs
                   .AsNoTracking()
                   .Where(b => b.BugID == request.BugId)
                    .Include(b => b.CreatedByUser)
                    .Select(b => new BugDetalsDto
                    {

                        BugId = b.BugID,
                        Title = b.Title,
                        Description = b.Description,
                        CategoryId = b.CategoryId,
                        CategoryName = b.Category.CategoryName,
                        PriorityId = b.PriorityId,
                        PriorityName = b.Priority.PriorityName,
                        StatusId = b.StatusId,
                        StatusName = b.Status.StatusName,
                        AssignedToUserFullName = b.CreatedByUser.FullName,
                        CreatedByUserFullName = b.CreatedByUser.FullName,
                        CreatedDate = b.CreatedDate,
                        ReasonForClosure = b.ReasonForClosure,
                    })
                   .FirstOrDefaultAsync(cancellationToken);
                if (bug == null)
                    throw new NotFoundException("Bug", request.BugId.ToString());

                return bug;
            }
        }
    }
}
