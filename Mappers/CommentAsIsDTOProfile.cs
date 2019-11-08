using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class CommentAsIsDTOProfile : Profile
    {
        public CommentAsIsDTOProfile()
        {
            CreateMap<Comment, CommentAsIsDTO>()
                .ReverseMap();
        }
    }
}
