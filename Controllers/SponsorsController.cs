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
    public class SponsorsController : ControllerBase
    {
        private readonly IModelManager<Sponsor> _repo;
        private readonly IMapper _mapper;
        public SponsorsController(IModelManager<Sponsor> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<SponsorBase> model = await _repo.Item()
                                                            .Select(c => c.Convert<Sponsor, SponsorBase>(_mapper))
                                                            .ToListAsync();
            return Ok(model);
        }

        [HttpGet("{id:int}")]
        public async ValueTask<IActionResult> Get(int id, bool projects = false)
        {
            Sponsor sponsor = null;
            if (!projects)
            {
                sponsor = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .FirstOrDefaultAsync();
                if (sponsor != null)
                {
                    SponsorBase model = sponsor.Convert<Sponsor, SponsorBase>(_mapper);
                    return Ok(model);
                }
            }
            else
            {
                sponsor = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.Projects)
                                            .ThenInclude(p => p.Comments)
                                        .FirstOrDefaultAsync();
                if (sponsor != null)
                {
                    SponsorDTO model = sponsor.ConvertToDTO(_mapper);
                    SponsorProjectDTO dto = new SponsorProjectDTO
                    {
                        Sponsor = model,
                        Total = sponsor.Projects.Count()
                    };
                    return Ok(dto);
                }

            }
            return NotFound(new ErrorDTO { Message = "Item not found" });
        }

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] SponsorBase model)
        {
            if (ModelState.IsValid)
            {
                var checker = await _repo.Item().Where(c => c.Name == model.Name).FirstOrDefaultAsync();
                if (checker != null) return BadRequest(new ErrorDTO { Message = "Sponsor already exists" });
                Sponsor sponsor = model.Convert<SponsorBase, Sponsor>(_mapper);
                (bool succeeded, Sponsor addedSponsor, string error) = await _repo.Add(sponsor);
                if (succeeded) return Ok(addedSponsor.Convert<Sponsor, SponsorBase>(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] SponsorBase model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    Sponsor sponsor = model.Convert<SponsorBase, Sponsor>(_mapper);
                    (bool succeeded, Sponsor updatedSponsor, string error) = await _repo.Update(sponsor, model.Id);
                    if (succeeded) return Ok(updatedSponsor.Convert<Sponsor, SponsorBase>(_mapper));
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