using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.DTOs
{
    public class HomeDTO
    {
        public ICollection<BaseProject> Projects { get; set; }
        public ICollection<CategoryBase> Categories { get; set; }
        public int Total { get; set; }
    }
}
