using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class CheckDTOProfile : Profile
    {
        public CheckDTOProfile()
        {
            CreateMap<Check, CheckDTO>()
                .ReverseMap();
        }
    }
}
