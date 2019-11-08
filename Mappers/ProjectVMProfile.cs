using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.ViewModels;

namespace GovCheck.Mappers
{
    public class ProjectVMProfile : Profile
    {
        public ProjectVMProfile()
        {
            CreateMap<ProjectViewModel, Project>()
                .ReverseMap();
        }
    }
}
