using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Repositories.Extensions
{
    public static class UserCheckListExtension
    {
        public static UserCheckDTO ConvertToDTO(this UserCheckList model, IMapper _mapper)
        {
            return new UserCheckDTO
            {
                Check = model.Check.Convert<Check, BaseCheck>(_mapper),
                Comment = model.Comment.Convert<Comment, BaseComment>(_mapper)
            };
        }
    }
}
