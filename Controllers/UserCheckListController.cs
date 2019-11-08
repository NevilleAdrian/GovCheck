using System;
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
    public class UserCheckListController : Controller
    {
        private readonly IModelManager<UserCheckList> _repo;
        private readonly IMapper _mapper;
        public UserCheckListController(IModelManager<UserCheckList> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<UserCheckBase> model = await _repo.Item()
                                                            .Select(c => c.Convert<UserCheckList, UserCheckBase>(_mapper))
                                                            .ToListAsync();
            return Ok(model);
        }

        [HttpGet("{id:int}")]
        public async ValueTask<IActionResult> Get(int id)
        {
            UserCheckList check = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.Check)
                                        .Include(c => c.Comment)
                                        .FirstOrDefaultAsync();
            if (check != null)
            {
                UserCheckDTO model = check.ConvertToDTO(_mapper);

                return Ok(model);
            }
            return NotFound(new ErrorDTO { Message = "Item not found" });
        }

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] UserCheckBase model)
        {
            if (ModelState.IsValid)
            {
                UserCheckList userCheck = model.Convert<UserCheckBase, UserCheckList>(_mapper);
                (bool succeeded, UserCheckList addedUserCheck, string error) = await _repo.Add(userCheck);
                if (succeeded) return Ok(addedUserCheck.Convert<UserCheckList, UserCheckBase>(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPost("collections")]
        public async ValueTask<IActionResult> Post([FromBody] ICollection<UserCheckBase> models)
        {
            if (ModelState.IsValid)
            {
                IEnumerable<UserCheckList> userCheck = models.Select(model => model.Convert<UserCheckBase, UserCheckList>(_mapper));
                (bool succeeded, IEnumerable<UserCheckList> addedUserCheck, string error) = await _repo.Add(userCheck);
                if (succeeded) return Ok(addedUserCheck.Select(u => u.Convert<UserCheckList, UserCheckBase>(_mapper)));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] UserCheckBase model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    UserCheckList userCheck = model.Convert<UserCheckBase, UserCheckList>(_mapper);
                    (bool succeeded, UserCheckList updatedUserCheck, string error) = await _repo.Update(userCheck, model.Id);
                    if (succeeded) return Ok(updatedUserCheck.Convert<UserCheckList, UserCheckBase>(_mapper));
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
