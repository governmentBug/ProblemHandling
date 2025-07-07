using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Category.Commands.CreateCategory
{
    public record class CreateCategoryCommand(string CategoryName) : IRequest<int>
    {
    }
public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, int>
    {
        private readonly IApplicationDbContext _context;
        public CreateCategoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var entity = new Domain.Entities.Category
            {
                CategoryName = request.CategoryName
            };
            _context.Categories.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return entity.CategoryId;
        }
    }
}
