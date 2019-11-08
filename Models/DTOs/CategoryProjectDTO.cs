using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.DTOs
{
    public class CategoryProjectDTO
    {
        public CategoryDTO Category { get; set; }
        public int Total { get; set; }
    }
}
