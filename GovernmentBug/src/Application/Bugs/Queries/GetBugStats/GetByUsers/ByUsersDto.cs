using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByUsers
{
    public class ByUsersDto
    {
        public string[] UsersName { get; set; }
        public int[] TotalBugs { get; set; }
        public int[] TreatedBugs { get; set; }
        public ByUsersDto(int usersCount)
        {
            UsersName = new string[usersCount];
            TotalBugs = new int[usersCount];
            TreatedBugs = new int[usersCount];
        }
    }
}
