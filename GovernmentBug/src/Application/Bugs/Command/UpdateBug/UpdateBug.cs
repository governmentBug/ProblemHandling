using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Enums;
using Ardalis.GuardClauses;
using MediatR;
using AutoMapper;
using GovernmentBug.Application.Common.Services;

namespace GovernmentBug.Application.Bugs.Commands.UpdateBug
{
    public record UpdateBugCommand : IRequest
    {
        public int BugId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PriorityId { get; set; }
        public int CategoryId { get; set; }
        public int StatusId { get; set; }

    }

    public class UpdateBugCommandHandler : IRequestHandler<UpdateBugCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public readonly IBugHistoryService _bugHistoryService;

        public UpdateBugCommandHandler(IApplicationDbContext context, IMapper mapper,IBugHistoryService bugHistoryService)
        {
            _context = context;
            _mapper = mapper;
            _bugHistoryService = bugHistoryService;
        }

        public async Task Handle(UpdateBugCommand request, CancellationToken cancellationToken)
        {
            var originalBug = await _context.Bugs
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.BugID == request.BugId, cancellationToken);

            Guard.Against.NotFound(request.BugId, originalBug);

            var bugToUpdate = await _context.Bugs
                .FindAsync(new object[] { request.BugId }, cancellationToken);

            Guard.Against.NotFound(request.BugId, bugToUpdate);

            _mapper.Map(request, bugToUpdate);

            var histories = _bugHistoryService.CreateHistory(originalBug, bugToUpdate, bugToUpdate.CreatedByUserId);

            if (histories.Any())
            {
                _context.BugHistories.AddRange(histories);
            }

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
