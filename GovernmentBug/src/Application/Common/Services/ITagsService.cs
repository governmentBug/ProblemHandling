using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Services;
public interface ITagsService
{
    Task<List<string>> GetTagsAsync(string query, int limit = 10);
    
}
