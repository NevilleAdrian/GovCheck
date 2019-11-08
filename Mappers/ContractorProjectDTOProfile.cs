using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class ContractorProjectDTOProfile : Profile
    {
        public ContractorProjectDTOProfile()
        {
            CreateMap<ContractorProjectDTO, Contractor>()
                .ReverseMap();
        }
    }
}
