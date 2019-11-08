using AutoMapper;
using GovCheck.Data;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Models.ViewModel;
using GovCheck.Repositories.Extensions;
using GovCheck.Services;
using GovCheck.Structs;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Repositories
{
    public class AccountRepository
    {
        private readonly AuthRepository _auth;
        private readonly ApplicationDbContext _ctx;
        private readonly IImageService _img;
        private readonly IEmailSender _email;
        private readonly IMapper _mapper;
        public AccountRepository(AuthRepository auth,
            ApplicationDbContext context,
            IImageService image,
            IEmailSender email,
            IMapper mapper)
        {
            _auth = auth;
            _ctx = context;
            _img = image;
            _email = email;
            _mapper = mapper;
        }

        public async ValueTask<(string, string)> LoginUser(LoginViewModel model)
        {
            var loginPassword = model.Password;
            var user = await _ctx.Users.Where(x => x.Email.Equals(model.Email, StringComparison.InvariantCultureIgnoreCase))
                                                .FirstOrDefaultAsync();
            if(user == null) { return (null, "no such user in the database"); }
            
            string incomingHash = Hash.GetHashedValue(loginPassword);
            if(incomingHash != user.PasswordHash)
            {
                return (null, "password do not match");
            }
            else
            {
                if (!user.IsSet)
                {
                    user.IsAdmin = CheckAdmin(model.Email);
                    user.IsSet = true;
                    _ctx.Users.Update(user);
                    await _ctx.SaveChangesAsync();
                }
                return (_auth.GetToken(model.Email, user.IsAdmin), null);
            }
        }

        public async ValueTask<(string, string)> RegisterUser(RegisterViewModel model)
        {
            if(model.Password == model.ConfirmPassword)
            {
                bool hasAccount = await _ctx.Users.AnyAsync(u => u.Email.Equals(model.Email, StringComparison.OrdinalIgnoreCase));
                if (hasAccount) { return (null, "user already exists"); }

                string passwordHash = Hash.GetHashedValue(model.Password);
                ApplicationUser user = model.Convert<RegisterViewModel, ApplicationUser>(_mapper);
                user.PasswordHash = passwordHash;
                user.IsAdmin = CheckAdmin(model.Email);
                user.IsSet = true;
                user.Id = Guid.NewGuid().ToString().Replace("-", "");
                try
                {
                    _ctx.Users.Add(user);
                    await _ctx.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Message: {ex.Message}");
                    return (null, ex.Message);
                }
                return (await LoginUser(new LoginViewModel { Email = model.Email, Password = model.Password }));
            }
            return (null, "password must match");
            
        }

        private static bool CheckAdmin(string email)
        {
            var adminEmails = Startup.Configuration.GetSection("AdminEmails")
                                                                    .AsEnumerable()
                                                                    .Where(e => !string.IsNullOrEmpty(e.Value))
                                                                    .Select(e => e.Value);
            return adminEmails.Contains(email, StringComparer.OrdinalIgnoreCase);
        }

        public async ValueTask<bool> ChangePassword(PatchKnownPasswordDTO patch)
        {
            ApplicationUser user = await GetUserById(patch.Id);
            if(user != null)
            {
                string passwordHash = Hash.GetHashedValue(patch.OldPassword);
                if(passwordHash == user.PasswordHash)
                {
                    string newHashedPassword = Hash.GetHashedValue(patch.NewPassword);
                    user.PasswordHash = newHashedPassword;
                    return await UpdateUser(user);
                }
            }
            return false;
        }

        public async ValueTask<bool> ForgotPassword(PatchUnknownPasswordDTO patch)
        {
            ApplicationUser user = await GetUserByEmail(patch.Email);
            if (user != null)
            {
                if (patch.NewPassword == patch.ConfirmNewPassword)
                {
                    string passwordHash = Hash.GetHashedValue(patch.NewPassword);
                    user.PasswordHash = passwordHash;
                    return await UpdateUser(user);
                }
                
            }
            return false;
        }

        private async ValueTask<bool> UpdateUser(ApplicationUser user)
        {
            try
            {
                _ctx.Users.Update(user);
                await _ctx.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
            return false;
        }

        private async ValueTask<ApplicationUser> GetUserById(string id) => await _ctx.Users.FindAsync(id);
        private async ValueTask<ApplicationUser> GetUserByEmail(string email) => await _ctx.Users
                                                                                              .Where(u => u.Email
                                                                                                            .Equals(email, 
                                                                                                                    StringComparison.OrdinalIgnoreCase))
                                                                                              .FirstAsync();
    }
}
