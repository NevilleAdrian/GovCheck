using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.ViewModel;

namespace GovCheck.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<RegisterViewModel, ApplicationUser>()
                .ReverseMap();
        }
    }
}
