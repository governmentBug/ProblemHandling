using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.User.Queries.GetAllUsers
{
    public record class GetAllUsersQuery:IRequest<List<UserDto>>{}
    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        public GetAllUsersQueryHandler(IApplicationDbContext context) => _context = context;
        public Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var users = _context.AppUsers
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email
                })
                .ToList();
            return Task.FromResult(users);
        }
    }

}
