using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities;
public class Priority : BaseAuditableEntity
{
    [Key]
    public int PriorityId { get; set; }
    [StringLength(50)]
    public string PriorityName {  get; set; }=string.Empty;  
}
