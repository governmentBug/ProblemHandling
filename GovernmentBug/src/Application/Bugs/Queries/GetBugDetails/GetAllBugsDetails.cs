using AutoMapper;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GovernmentBug.Application.Bugs.Queries.GetBugDetails;

public record GetBugDetails() : IRequest<List<BugDetalsDto>>;

public class GetBugDetailsHandler : IRequestHandler<GetBugDetails, List<BugDetalsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBugDetailsHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BugDetalsDto>> Handle(GetBugDetails request, CancellationToken cancellationToken)
    {
        var bugs = await _context.Bugs
            .AsNoTracking()
            .Include(b => b.CreatedByUser)
            .Select(b => new BugDetalsDto
            {
                BugId = b.BugID,
                Title = b.Title,
                Description = b.Description,
                PriorityName = b.PriortyId,
                StatusName = b.StatusId.ToString(),
                AssignedToUserFullName = b.StatusId == StatusBug.In_progress ? b.CreatedByUser.FullName : null,
                CreatedByUserFullName = b.CreatedByUser.FullName,
                CreatedDate = b.CreatedDate
            })
            .ToListAsync(cancellationToken);

        return bugs;
    }
}
