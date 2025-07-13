using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities;
public class Status
{
    [Key]
    public int StatusId { get; set; }
    [StringLength(50)]
    public string StatusName { get; set; }=string.Empty;
    public ICollection<Bug> Bugs { get; set; } = new List<Bug>();
}
