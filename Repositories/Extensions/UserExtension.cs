using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;

namespace GovCheck.Repositories.Extensions
{
    public static class UserExtension
    {
        public static UserBase Convert(this ApplicationUser model, IMapper _mapper)
        {
            return _mapper.Map<ApplicationUser, UserBase>(model);
        }
    }
}
