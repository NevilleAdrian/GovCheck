using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class ContractorBaseProfile : Profile
    {
        public ContractorBaseProfile()
        {
            CreateMap<ContractorBase, Contractor>()
                .ReverseMap();
        }
    }
}
