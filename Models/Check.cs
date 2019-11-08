using GovCheck.Models.Conform;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovCheck.Models
{
    public class Check : IModel
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
        public int CategoryId { get; set; }

        public ICollection<UserCheckList> UserChecks { get; set; }
        public override string ToString()
        {
            return Id.ToString();
        }
    }
}
