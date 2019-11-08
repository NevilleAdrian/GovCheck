using System;

namespace GovCheck.Models.DTOs
{
    public class BaseProject : BaseProjectOnly
    {
        public CategoryBaseWithCheck Category { get; set; }
    }
}
