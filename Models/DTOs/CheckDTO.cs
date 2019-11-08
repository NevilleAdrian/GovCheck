using System.Collections.Generic;

namespace GovCheck.Models.DTOs
{
    public class CheckDTO : BaseCheck
    {
        public ICollection<UserCheckDTO> UserChecks { get; set; }
    }
}
