using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class BaseCheckProfile : Profile
    {
        public BaseCheckProfile()
        {
            CreateMap<Check, BaseCheck>()
                .ReverseMap();
        }
    }
}
