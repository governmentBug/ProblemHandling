using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Category.Queries.GetCategoryById
{
    public record class GetCategoryByIdQuery(int Id) : IRequest<CategoryDto>
    {
    }
    public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetCategoryByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<CategoryDto> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryId == request.Id, cancellationToken);
            if (category == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Category), request.Id.ToString());
            }
            return _mapper.Map<CategoryDto>(category);
        }
    }
}
