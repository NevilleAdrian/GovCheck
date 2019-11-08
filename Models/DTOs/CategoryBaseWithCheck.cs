using System.Collections.Generic;

namespace GovCheck.Models.DTOs
{
    public class CategoryBaseWithCheck : CategoryBase
    {
        public ICollection<BaseCheck> Checks { get; set; }
    }
}
