using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class UserCheckDTOProfile : Profile
    {
        public UserCheckDTOProfile()
        {
            CreateMap<UserCheckList, UserCheckDTO>()
                .ReverseMap();
        }
    }
}
