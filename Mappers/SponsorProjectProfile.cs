using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class SponsorProjectProfile : Profile
    {
        public SponsorProjectProfile()
        {
            CreateMap<Sponsor, SponsorProjectDTO>()
                .ReverseMap();
        }
    }
}
