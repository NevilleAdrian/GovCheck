using System.Collections.Generic;

namespace GovCheck.Models.DTOs
{
    public class ContractorDTO : ContractorBase
    {
        public ICollection<BaseProjectOnly> Projects { get; set; }
    }
}
