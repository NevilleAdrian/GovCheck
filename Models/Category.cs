using GovCheck.Models.Conform;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovCheck.Models
{
    public class Category : IModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Project> Projects { get; set; }
        public ICollection<Check> Checks { get; set; }
        public override string ToString()
        {
            return Id.ToString();
        }
    }
}
