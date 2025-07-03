using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Enums;
using Ardalis.GuardClauses;
using MediatR;
using AutoMapper;

namespace GovernmentBug.Application.Bugs.Commands.UpdateBug { 
public record UpdateBugCommand : IRequest
{
    public int BugId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string PriortyId { get; init; } = string.Empty;
    public StatusBug Status { get; init; }
    public int? AssignedToUserId { get; init; }
}

public class UpdateBugCommandHandler : IRequestHandler<UpdateBugCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateBugCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task Handle(UpdateBugCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Bugs
            .FindAsync(new object[] { request.BugId }, cancellationToken);

        Guard.Against.NotFound(request.BugId, entity);

        _mapper.Map(request, entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

public class BugMappingProfile : Profile
{
    public BugMappingProfile()
    {
        CreateMap<UpdateBugCommand, Bug>()
            .ForMember(dest => dest.BugID, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedByUser, opt => opt.Ignore());
    }
}

}
