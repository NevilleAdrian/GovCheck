using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.ViewModels;

namespace GovCheck.Mappers
{
    public class CommentViewModelProfile : Profile
    {
        public CommentViewModelProfile()
        {
            CreateMap<Comment, CommentViewModel>()
                .ReverseMap();
        }
    }
}
