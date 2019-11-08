using GovCheck.Models.Conform;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovCheck.Models
{
    public class UserCheckList : IModel
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("CheckId")]
        public Check Check { get; set; }
        public int CheckId { get; set; }

        [ForeignKey("CommentId")]
        public Comment Comment { get; set; }
        public int CommentId { get; set; }

        public override string ToString()
        {
            return Id.ToString();
        }
    }
}
