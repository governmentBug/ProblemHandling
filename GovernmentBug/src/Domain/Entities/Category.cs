using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities;
public class Category
{
    [Key]
    public int CategoryId { get; set; }
    [StringLength(50)]
    public string CategoryName { get; set; }=string.Empty;
}
