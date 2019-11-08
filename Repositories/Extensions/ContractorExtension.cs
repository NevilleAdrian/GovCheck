using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Repositories.Extensions
{
    public static class ContractorExtension
    {
        
        public static ContractorDTO ConvertToDTO(this Contractor model, IMapper _mapper)
        {
            ContractorDTO contractor = _mapper.Map<Contractor, ContractorDTO>(model);
            contractor.Projects = model.Projects.Select(p => p.ConvertToBaseOnly(_mapper)).ToList();
            return contractor;
        }
    }
}
