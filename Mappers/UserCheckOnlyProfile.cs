using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class UserCheckOnlyProfile : Profile
    {
        public UserCheckOnlyProfile()
        {
            CreateMap<UserCheckList, UserCheckOnly>()
                .ReverseMap();
        }
    }
}
