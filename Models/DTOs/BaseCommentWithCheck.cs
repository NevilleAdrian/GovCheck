using System.Collections.Generic;

namespace GovCheck.Models.DTOs
{
    public class BaseCommentWithCheck : BaseComment
    {
        public ICollection<UserCheckDTO> Checks { get; set; }
    }
}
