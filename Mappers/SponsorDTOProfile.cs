using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class SponsorDTOProfile : Profile
    {
        public SponsorDTOProfile()
        {
            CreateMap<Sponsor, SponsorDTO>()
                .ReverseMap();
        }
    }
}
