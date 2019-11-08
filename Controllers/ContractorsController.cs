using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Repositories.Extensions;
using GovCheck.Repositories.Generics.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovCheck.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractorsController : ControllerBase
    {
        private readonly IModelManager<Contractor> _repo;
        private readonly IMapper _mapper;
        public ContractorsController(IModelManager<Contractor> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<ContractorBase> model = await _repo.Item()
                                                            .Select(c => c.Convert<Contractor, ContractorBase>(_mapper))
                                                            .ToListAsync();
            return Ok(model);
        }

        [HttpGet("{id:int}")]
        public async ValueTask<IActionResult> Get(int id, bool projects = false)
        {
            Contractor contractor = null;
            if (!projects)
            {
                contractor = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .FirstOrDefaultAsync();
                if (contractor != null)
                {
                    ContractorBase model = contractor.Convert<Contractor, ContractorBase>(_mapper);
                    return Ok(model);
                }
            }
            else
            {
                contractor = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.Projects)
                                            .ThenInclude(p => p.Comments)
                                        .FirstOrDefaultAsync();
                if (contractor != null)
                {
                    ContractorDTO model = contractor.ConvertToDTO(_mapper);
                    ContractorProjectDTO dto = new ContractorProjectDTO
                    {
                        Contractor = model,
                        Total = contractor.Projects.Count()
                    };
                    return Ok(dto);
                }

            }
            return NotFound(new ErrorDTO { Message = "Item not found" });
        }

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] ContractorBase model)
        {
            if (ModelState.IsValid)
            {
                var checker = await _repo.Item().Where(c => c.PM == model.PM && c.Organization == model.Organization).FirstOrDefaultAsync();
                if (checker != null) return BadRequest(new ErrorDTO { Message = "Contractor already exists" });
                Contractor contractor = model.Convert<ContractorBase, Contractor>(_mapper); ;
                (bool succeeded, Contractor addedContractor, string error) = await _repo.Add(contractor);
                if (succeeded) return Ok(addedContractor.Convert<Contractor, ContractorBase>(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] ContractorBase model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    Contractor contractor = model.Convert<ContractorBase, Contractor>(_mapper);
                    (bool succeeded, Contractor updatedContractor, string error) = await _repo.Update(contractor, model.Id);
                    if (succeeded) return Ok(updatedContractor.Convert<Contractor, ContractorBase>(_mapper));
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