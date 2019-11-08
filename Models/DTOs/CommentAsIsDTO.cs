using System;
using System.Collections.Generic;

namespace GovCheck.Models.DTOs
{
    public class CommentAsIsDTO : BaseComment
    {
        public UserBase User { get; set; }
        public ICollection<UserCheckOnly> Checks { get; set; }
        public ICollection<CommentAsIsDTO> SubComments { get; set; }
    }
}
