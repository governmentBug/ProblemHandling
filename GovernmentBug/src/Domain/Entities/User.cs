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
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Email { get; set; }= string.Empty;
    [MaxLength(50)]
    public string Role { get; set; }=string.Empty;  
}
