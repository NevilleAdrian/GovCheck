using GovCheck.Models.Conform;
using GovCheck.Structs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Models
{
    public class Comment : IModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Message { get; set; }
        public string Video { get; set; }
        public string Image { get; set; }
        public double Rating { get; set; }
        public DateTime DatePosted { get; set; }

        //A user from this location has a weight of 1
        //and a user from another location has a weight of 0.5
        public float Weight { get; set; }

        //We get user's longitude and latitude GeoTagging
        public double Longitude { get; set; }
        public double Latitude { get; set; }

        //Foreign Tables

        //Only users can comment
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }

        //A comment must be to a project
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
        public int ProjectId { get; set; }

        //A comment can be attached to a comment
        [ForeignKey("CommentId")]
        public Comment CommentAboutMe { get; set; }
        public int? CommentId { get; set; }

        //Comment has sub comments
        public ICollection<Comment> SubComments { get; set; }

        //Comment has checklists
        public ICollection<UserCheckList> MyChecks { get; set; }
        public override string ToString()
        {
            return Id.ToString();
        }

    }
}
