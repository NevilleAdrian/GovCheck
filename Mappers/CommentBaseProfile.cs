using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class CommentBaseProfile : Profile
    {
        public CommentBaseProfile()
        {
            CreateMap<Comment, BaseComment>()
                .ReverseMap();
        }
    }
}
