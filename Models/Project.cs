using GovCheck.Models.Conform;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models
{
    public class Project : IModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

        //Foreign Tables
        [ForeignKey("SponsorId")]
        public Sponsor Sponsor { get; set; }
        public int SponsorId { get; set; }

        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }
        public int ContractorId { get; set; }

        //Projects have categories
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
        public int CategoryId { get; set; }

        //A project can have multiple comments
        public ICollection<Comment> Comments { get; set; }

        public override string ToString()
        {
            return Id.ToString();
        }
    }
}
