using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using GovernmentBug.Application.Bugs.Queries.GetBugDetails;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Comments.Queires.GetCommentsBug;
public record GetCommentsBug(int BugId):IRequest<List<CommentsBugDto>>;

    public class GetCommentsBugQueryHandler : IRequestHandler<GetCommentsBug, List<CommentsBugDto>>
    {
            private readonly IApplicationDbContext _context;
            private readonly IMapper _mapper;

            public GetCommentsBugQueryHandler(IApplicationDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<List<CommentsBugDto>> Handle(GetCommentsBug request, CancellationToken cancellationToken)
            {
                var entity = await _context.Bugs
                   .AsNoTracking()
                   .FirstOrDefaultAsync(b => b.BugID == request.BugId, cancellationToken);
                Guard.Against.NotFound(request.BugId, entity);

                var Comments = await _context.Comments
                       .AsNoTracking()
                       .Where(b => b.BugID == request.BugId)
                        .Select(b => new CommentsBugDto
                        {
                            BugID = b.BugID,
                            CommentID = b.CommentID,
                            CommentDate = b.CommentDate,
                            CommentedBy = b.CommentedBy,
                            CommentText= b.CommentText
                        })
                       .ToListAsync(cancellationToken);
               
                return Comments;
             }

       
    }
 

