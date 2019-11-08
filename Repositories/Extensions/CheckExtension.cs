using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using System.Linq;

namespace GovCheck.Repositories.Extensions
{
    public static class CheckExtension
    {
        public static CheckDTO ConvertToDTO(this Check model, IMapper _mapper)
        {
            CheckDTO dto = _mapper.Map<Check, CheckDTO>(model);
            dto.UserChecks = model.UserChecks.Select(c => c.ConvertToDTO(_mapper)).ToList();
            return dto;
        }
    }
}
