using GovCheck.Models.DTOs;
using GovCheck.Models.ViewModels;
using GovCheck.Services;
using Microsoft.AspNetCore.Mvc;

namespace GovCheck.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IImageService _img;
        public FilesController(IImageService image)
        {
            _img = image;
        }
        [HttpPost("upload")]
        public IActionResult Post([FromForm]FileViewModel model)
        {
            if(ModelState.IsValid && model.File != null)
            {
                if(_img.Create(model.File, out string path))
                {
                    return Ok(new FileDTO { Name = path });
                }
                return BadRequest(new ErrorDTO { Message = "We could not add this resource. Please try again" });
            }
            return BadRequest(new ErrorDTO { Message = "Your data is bad" });
        }
    }
}


