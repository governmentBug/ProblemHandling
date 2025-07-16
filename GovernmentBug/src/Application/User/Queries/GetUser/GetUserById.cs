using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.User.Queries.GetUser;
public record class GetUserByIdQuery(int Id) : IRequest<UserDto>{}
public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    public GetUserByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = _context.AppUsers
            .Where(u => u.Id == request.Id).FirstOrDefault();

        return Task.FromResult(_mapper.Map<UserDto>(user));
    }
}
