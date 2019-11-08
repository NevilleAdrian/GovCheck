using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.DTOs
{
    public class CommentDTO : BaseComment
    {
        public UserBase User { get; set; }
        public BaseProject Project { get; set; }
        public ICollection<CommentAsIsDTO> SubComments { get; set; }
    }
}
