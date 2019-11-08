using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models.DTOs
{
    public class BaseProjectOnly
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Image { get; set; }
        public string Brief { get; set; }
        public double Amount { get; set; }
        public int TotalComments { get; set; }
        public double Rating { get; set; }
        public int NumberOfViews { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DatePosted { get; set; }
        public DateTime EndDate { get; set; }
        public string State { get; set; }
        public string LGA { get; set; }
        public int Duration { get; set; }
    }
}
