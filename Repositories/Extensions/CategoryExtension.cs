using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Repositories.Extensions
{
    public static class CategoryExtension
    {
        public static CategoryDTO ConvertToDTO(this Category model, IMapper _mapper)
        {
            CategoryDTO category = _mapper.Map<Category, CategoryDTO>(model);
            category.Projects = model.Projects?.Select(p => p.ConvertToBaseOnly(_mapper)).ToList();
            category.Checks = model.Checks.Select(c => c.Convert<Check, BaseCheck>(_mapper)).ToList();
            return category;
        }

        public static CategoryBaseWithCheck ConvertToBaseWithCheck(this Category model, IMapper _mapper)
        {
            CategoryBaseWithCheck category = _mapper.Map<Category, CategoryBaseWithCheck>(model);
            category.Checks = model.Checks.Select(c => c.Convert<Check, BaseCheck>(_mapper)).ToList();
            return category;
        }
    }
}
