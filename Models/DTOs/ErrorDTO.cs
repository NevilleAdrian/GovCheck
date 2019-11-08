using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace GovCheck.Models.DTOs
{
    public class ErrorDTO
    {
        public ICollection<ModelError> Errors { get; set; }
        public string Message { get; set; }
    }

}
