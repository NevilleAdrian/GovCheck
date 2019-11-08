using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class ProductCommentProfile: Profile
    {
        public ProductCommentProfile()
        {
            CreateMap<Comment, CommentDTO>()
                .ReverseMap();

        }
    }
}
