using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Services;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Bugs.Commands.UpdateBug
{
    public record UpdateBugAndClosedCommand : IRequest
    {
        public int BugId { get; set; }
        public string ReasonForClosure { get; set; } = string.Empty;
    }

    public class UpdateBugAndClosedCommandHandler : IRequestHandler<UpdateBugAndClosedCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public readonly IBugHistoryService _bugHistoryService;

        public UpdateBugAndClosedCommandHandler(IApplicationDbContext context, IMapper mapper, IBugHistoryService bugHistoryService)
        {
            _context = context;
            _mapper = mapper;
            _bugHistoryService = bugHistoryService;
        }

        public async Task Handle(UpdateBugAndClosedCommand request, CancellationToken cancellationToken)
        {
            var bugToUpdate = await _context.Bugs
                .FindAsync(new object[] { request.BugId }, cancellationToken);

            Guard.Against.NotFound(request.BugId, bugToUpdate);

            bugToUpdate.ReasonForClosure=request.ReasonForClosure;
            bugToUpdate.StatusId=await _context.Statuses.
                Where(s=>s.StatusName=="Close")
                .Select(s=>s.StatusId)
                .FirstOrDefaultAsync();

            var histories = _bugHistoryService.CreateHistory(bugToUpdate, bugToUpdate, bugToUpdate.CreatedByUserId);
    
            if (histories.Any())
            {
                _context.BugHistories.AddRange(histories);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }

}
