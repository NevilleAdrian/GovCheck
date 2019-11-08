using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.ViewModels
{
    public class ProjectViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string Brief { get; set; }
        public string Image { get; set; }
        public double Amount { get; set; }  
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime DatePosted { get; set; }
        public int NumberOfViews { get; set; }
        public string State { get; set; }
        public string LGA { get; set; }
        public int SponsorId { get; set; }
        public int ContractorId { get; set; }
        public int CategoryId { get; set; }
    }
}
