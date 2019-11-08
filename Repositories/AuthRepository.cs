using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GovCheck.Repositories
{
    public class AuthRepository
    {
        public string GetToken(string email, bool isAdmin)
        {
            //get key
            string key = Startup.Configuration[AppConstant.Secret];
            //get symmetric key
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            //get signin credentials
            SigningCredentials signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            //get claims
            List<Claim> claims = new List<Claim>();

            if (isAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Administrator"));
                
            }
            else
            {
                claims.Add(new Claim(ClaimTypes.Role, "User"));
            }
            AppConstant.IsAdmin = isAdmin;
            claims.Add(new Claim(ClaimTypes.Email, email));

            //create web token
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: Startup.Configuration[AppConstant.Issuer],
                audience: Startup.Configuration[AppConstant.Audience],
                signingCredentials: signingCredentials,
                expires: isAdmin ? DateTime.Now.AddHours(8) : DateTime.Now.AddHours(1),
                claims: claims
                );
            //return a writable token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
