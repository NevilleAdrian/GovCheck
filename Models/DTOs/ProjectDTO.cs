using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.DTOs
{
    public class ProjectDTO : BaseProject
    {
        public string Description { get; set; }
        public SponsorBase Sponsor { get; set; }
        public ContractorBase Contractor { get; set; }
        public ICollection<CommentAsIsDTO> Comments { get; set; }
    }
}
