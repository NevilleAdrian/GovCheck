using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Mappers
{
    public class CategoryBaseWithCheckProfile : Profile
    {
        public CategoryBaseWithCheckProfile()
        {
            CreateMap<Category, CategoryBaseWithCheck>()
                .ReverseMap();
        }
    }
}
