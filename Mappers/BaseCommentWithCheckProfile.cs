using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class BaseCommentWithCheckProfile : Profile
    {
        public BaseCommentWithCheckProfile()
        {
            CreateMap<Comment, BaseCommentWithCheck>()
                .ReverseMap();
        }
    }
}
