using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Models.ViewModel;
using GovCheck.Repositories;
using GovCheck.Repositories.Extensions;
using GovCheck.Repositories.Generics.Interfaces;
using GovCheck.Structs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovCheck.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountRepository _acc;
        private readonly IModelManager<ApplicationUser> _repo;
        private readonly IMapper _mapper;
        private readonly IEmailSender _email;
        
        public AccountController(AccountRepository account, 
            IModelManager<ApplicationUser> repo,
            IMapper mapper,
            IEmailSender email)
        {
            _acc = account;
            _repo = repo;
            _mapper = mapper;
            _email = email;
           
        }
        [HttpPost("login")]
        public async ValueTask<IActionResult> Post([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                (string token, string error) = await _acc.LoginUser(model);
                if(token != null)
                {
                    HttpContext.Session.SetString("JWToken", token);
                    ApplicationUser whoLoggedIn = await _repo.Item()
                                                               .Where(u => u.Email == model.Email)
                                                               .FirstOrDefaultAsync();
                    UserBase dto = whoLoggedIn.Convert(_mapper);
                    return Ok(dto);
                }
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPost("register")]
        public async ValueTask<IActionResult> Post([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                (string token, string error) = await _acc.RegisterUser(model);
                if (token != null)
                {
                    HttpContext.Session.SetString("JWToken", token);
                    ApplicationUser whoRegistered = await _repo.Item()
                                                                .Where(u => u.Email == model.Email)
                                                                .FirstOrDefaultAsync();
                    UserBase dto = whoRegistered.Convert(_mapper);
                    return Ok(dto);
                }
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpGet("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return NoContent();
        }

        [Authorize]
        [HttpGet("getcurrentuser")]
        public async ValueTask<IActionResult> GetCurrentUser()
        {
            var userEmail = HttpContext.User.Claims
                                                .Where(u => u.Type.Contains("emailaddress"))
                                                .Select(u => u.Value).FirstOrDefault();
            UserBase user = await _repo.Item()
                                            .Where(u => u.Email.Equals(userEmail, StringComparison.OrdinalIgnoreCase))
                                            .Select(u => u.Convert(_mapper))
                                            .FirstOrDefaultAsync();
            return Ok(user);
        }

        [Authorize]
        [HttpPut("user")]
        public async ValueTask<IActionResult> Put([FromBody] UserBase model)
        {
            if (ModelState.IsValid)
            {
                var user = await _repo.Item().Where(u => model.Id == u.Id).FirstOrDefaultAsync();
                if (user != null)
                {
                    ApplicationUser userMappedFromModel = model.Convert<UserBase, ApplicationUser>(_mapper);
                    userMappedFromModel.PasswordHash = user.PasswordHash;
                    userMappedFromModel.IsSet = user.IsSet;
                    userMappedFromModel.Code = user.Code;
                    userMappedFromModel.CodeIssued = user.CodeIssued;
                    userMappedFromModel.CodeWillExpire = user.CodeWillExpire;
                    (bool succeeded, ApplicationUser updatedUser, string error) = await _repo.Update(userMappedFromModel, userMappedFromModel.Id);
                    if (succeeded) return Ok(updatedUser.Convert(_mapper));
                    return BadRequest(new ErrorDTO { Message = error});
                }
               
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [Authorize]
        [HttpPut("changepassword")]
        public async ValueTask<IActionResult> Put([FromBody] PatchKnownPasswordDTO model)
        {
            if (ModelState.IsValid)
            {
                bool succeeded = await _acc.ChangePassword(model);
                if (succeeded) return Ok(new { succeeded });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });

        }

        [HttpPost("generatecode")]
        public async ValueTask<IActionResult> Generate(string email)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await _repo.Item()
                                                    .Where(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
                                                    .FirstOrDefaultAsync();
                if(user != null)
                {
                    string code = $"{Guid.NewGuid().ToString().Replace("-", "")}{Guid.NewGuid().ToString().Replace("-", "")}";
                    user.Code = code;
                    user.CodeIssued = DateTime.Now;
                    user.CodeWillExpire = DateTime.Now.AddDays(2);
                    (bool succeeded, ApplicationUser _, string error) = await _repo.Update(user, user.Id);
                    if (succeeded)
                    {
                        string subject = "Change Password";
                        StringBuilder message = new StringBuilder(100);
                        message.Append($"Dear {user.FirstName},<br/><br/>");
                        message.Append($"You requested a change in password.<br/>Kindly use this link to reset your password.<br/>The code will expire in less than two (2) days.<br/><br/>");
                        message.Append($"<a href='{Request.Scheme}://{Request.Host}/forgotpassword?code={code}'>Reset Password</a><br/><br/>");
                        message.Append("Thank you.<br/><br/>Sincerely,<br/>Admin.");
                        await _email.SendEmailAsync(email, subject, message.ToString());
                        return NoContent();
                    }
                }
                
                return NotFound();
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });

        }

        [HttpPut("forgotpassword")]
        public async ValueTask<IActionResult> Put(string code, [FromBody] PatchUnknownPasswordDTO model)
        {
            if (ModelState.IsValid)
            {
                var user = await _repo.Item().Where(u => u.Email.Equals(model.Email)).FirstOrDefaultAsync();
                if(user != null)
                {
                    if(code == user.Code && user.CodeIssued <= user.CodeWillExpire)
                    {
                        bool succeeded = await _acc.ForgotPassword(model);
                        if (succeeded) return Ok(new { succeeded });
                    }
                    return BadRequest(new ErrorDTO { Message = "code is invalid or has expired" });
                }
                return BadRequest(new ErrorDTO { Message = "user not found" });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });

        }

        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<UserBase> users = await _repo.Item()
                                                        .Select(u => u.Convert(_mapper))
                                                        .ToListAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async ValueTask<IActionResult> Get(string id)
        {
            UserBase user = await _repo.Item()
                                          .Where(u => id == u.Id)
                                          .Select(u => u.Convert<ApplicationUser, UserBase>(_mapper))
                                          .FirstOrDefaultAsync();
            return Ok(user);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> Delete(string id)
        {
            (bool succeeded, string error) = await _repo.Delete(id);
            if (succeeded) return NoContent();
            return NotFound(new ErrorDTO { Message = error });
        }
    }
}