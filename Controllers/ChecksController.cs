using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Repositories.Extensions;
using GovCheck.Repositories.Generics.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GovCheck.Controllers
{
    [Route("api/[controller]")]
    public class ChecksController : Controller
    {
        private readonly IModelManager<Check> _repo;
        private readonly IMapper _mapper;
        public ChecksController(IModelManager<Check> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<BaseCheck> model = await _repo.Item()
                                                            .Select(c => c.Convert<Check, BaseCheck>(_mapper))
                                                            .ToListAsync();
            return Ok(model);
        }

        [HttpGet("{id:int}")]
        public async ValueTask<IActionResult> Get(int id)
        {
            Check check = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.UserChecks)
                                        .FirstOrDefaultAsync();
            if (check != null)
            {
                CheckDTO model = check.ConvertToDTO(_mapper);

                return Ok(model);
            }
            return NotFound(new ErrorDTO { Message = "Item not found" });
        }

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] BaseCheck model)
        {
            if (ModelState.IsValid)
            {
                var checker = await _repo.Item().Where(c => c.Name == model.Name && c.CategoryId == model.CategoryId).FirstOrDefaultAsync();
                if (checker != null) return BadRequest(new ErrorDTO { Message = "Check already exists" });
                Check check = model.Convert<BaseCheck, Check>(_mapper);
                (bool succeeded, Check addedCheck, string error) = await _repo.Add(check);
                if (succeeded) return Ok(addedCheck.Convert<Check, BaseCheck>(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] BaseCheck model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    Check check = model.Convert<BaseCheck, Check>(_mapper);
                    (bool succeeded, Check updatedCheck, string error) = await _repo.Update(check, model.Id);
                    if (succeeded) return Ok(updatedCheck.Convert<Check, BaseCheck>(_mapper));
                    return NotFound(new ErrorDTO { Message = error });
                }

            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }
        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> Delete(int id)
        {
            (bool succeeded, string error) = await _repo.Delete(id);
            if (succeeded) return NoContent();
            return NotFound(new ErrorDTO { Message = error });
        }
    }
}
