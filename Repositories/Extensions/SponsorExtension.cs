using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Repositories.Extensions
{
    public static class SponsorExtension
    {
        public static SponsorDTO ConvertToDTO(this Sponsor model, IMapper _mapper)
        {
            SponsorDTO sponsor = _mapper.Map<Sponsor, SponsorDTO>(model);
            sponsor.Projects = model.Projects.Select(p => p.ConvertToBaseOnly(_mapper)).ToList();
            return sponsor;
        }
    }
}
