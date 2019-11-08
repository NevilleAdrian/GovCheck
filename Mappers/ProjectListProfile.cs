using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
namespace GovCheck.Mappers
{
    public class ProjectListProfile : Profile
    {
        public ProjectListProfile()
        {
            CreateMap<Project, BaseProject>()
                .ReverseMap();
        }
    }
}
