using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugDetails;
public class BugDetalsDto
{
    public int BugId { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Title { get; set; }
    public int PriorityId {  get; set; }
    public string? PriorityName { get; set; }
    public string? Description { get; set; }
    public int StatusId {  get; set; }
    public string? StatusName { get; set; }
    public string? AssignedToUserFullName { get; set; }
    public string? CreatedByUserFullName { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? ReasonForClosure {  get; set; }
}
