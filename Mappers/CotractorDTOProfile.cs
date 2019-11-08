using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class CotractorDTOProfile : Profile
    {
        public CotractorDTOProfile()
        {
            CreateMap<ContractorDTO, Contractor>()
                .ReverseMap();
        }
    }
}
