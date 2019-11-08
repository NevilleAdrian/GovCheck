using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace GovCheck.Services
{
    public static class Hash
    {
        public static string GetHashedValue(string password)
        {
            //using SHA512 to generate the hashing
            using (SHA256 hashSvc = SHA256.Create())
            {
                //creating the hash
                byte[] hash = hashSvc.ComputeHash(Encoding.UTF8.GetBytes(password));
                //using bitconverter, we convert the hased bits into hex removing the '-'
                string hex = BitConverter.ToString(hash).Replace("-", "");
                return hex;
            }
        }
    }
}
