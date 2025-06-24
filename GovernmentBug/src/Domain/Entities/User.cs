using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities;
public class User: BaseAuditableEntity
{
    [Key]
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; }= string.Empty;
    public string Role { get; set; }=string.Empty;  
}
