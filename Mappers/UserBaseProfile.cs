using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class UserBaseProfile : Profile
    {
        public UserBaseProfile()
        {
            CreateMap<UserBase, ApplicationUser>()
                .ReverseMap();
        }
    }
}
