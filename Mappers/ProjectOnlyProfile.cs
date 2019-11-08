using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Mappers
{
    public class ProjectOnlyProfile : Profile
    {
        public ProjectOnlyProfile()
        {
            CreateMap<Project, BaseProjectOnly>()
                .ReverseMap();
        }
    }
}
