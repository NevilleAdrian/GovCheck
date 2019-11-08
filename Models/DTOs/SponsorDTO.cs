using System.Collections.Generic;

namespace GovCheck.Models.DTOs
{
    public class SponsorDTO : SponsorBase
    {
        public ICollection<BaseProjectOnly> Projects { get; set; }
    }
}
