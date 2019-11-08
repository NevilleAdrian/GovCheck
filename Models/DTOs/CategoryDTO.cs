using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.DTOs
{
    public class CategoryDTO : CategoryBase
    {
        public ICollection<BaseProjectOnly> Projects { get; set; }
        public ICollection<BaseCheck> Checks { get; set; }
    }
}
