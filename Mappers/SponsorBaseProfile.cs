using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class SponsorBaseProfile : Profile
    {
        public SponsorBaseProfile()
        {
            CreateMap<Sponsor, SponsorBase>()
                .ReverseMap();
        }
    }
}
