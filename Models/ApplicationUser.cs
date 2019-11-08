using GovCheck.Models.Conform;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovCheck.Models
{
    public class ApplicationUser : IModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }
        public string SurName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsSet { get; set; }
        public string PasswordHash { get; set; }
        public string Code { get; set; }
        public DateTime CodeIssued { get; set; }
        public DateTime CodeWillExpire { get; set; }
        public ICollection<Comment> Comments { get; set; }

        public override string ToString()
        {
            return Id.ToString();
        }
    }
}
