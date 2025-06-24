using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities;
public class User
{
    [Key]
    public int UserId { get; set; }
    public string FullName {  get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public User(int UserId,string FullName,string Email,string Role)
    {
        this.UserId = UserId;
        this.FullName = FullName;
        this.Email = Email;
        this.Role = Role;
    }
}
