using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Category.Queries.GetCategoryByName
{
    public record class GetCategoryByNameQuery(string Name) : IRequest<CategoryDto>
    {
    }
    public class GetCategoryByNameQueryHandler : IRequestHandler<GetCategoryByNameQuery, CategoryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetCategoryByNameQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<CategoryDto> Handle(GetCategoryByNameQuery request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryName == request.Name, cancellationToken);
            if (category == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Category), request.Name);
            }
            return _mapper.Map<CategoryDto>(category);
        }
    }
}
