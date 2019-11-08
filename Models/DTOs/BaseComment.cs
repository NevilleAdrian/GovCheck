using System;

namespace GovCheck.Models.DTOs
{
    public class BaseComment
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string Video { get; set; }
        public string Image { get; set; }
        public double Rating { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string UserId { get; set; }
        public int ProjectId { get; set; }
        public int? CommentId { get; set; }
        public DateTime DatePosted { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
    }
}
