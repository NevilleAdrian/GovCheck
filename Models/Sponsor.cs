using GovCheck.Models.Conform;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models
{
    public class Sponsor : IModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public ICollection<Project> Projects { get; set; }

        public override string ToString()
        {
            return Id.ToString();
        }
    }
}
