using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class UserCheckBaseProfile: Profile
    {
        public UserCheckBaseProfile()
        {
            CreateMap<UserCheckList, UserCheckBase>()
                .ReverseMap();
        }
    }
}
