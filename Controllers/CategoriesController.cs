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
    public class CategoriesController : ControllerBase
    {
        //Injecting the generic repository to be configured for projects
        private readonly IModelManager<Category> _repo;
        private readonly IMapper _mapper;
        public CategoriesController(IModelManager<Category> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<CategoryBase> model = await _repo.Item()
                                                            .Select(c => c.Convert<Category, CategoryBase>(_mapper))
                                                            .ToListAsync();
            return Ok(model);
        }

        [HttpGet("{id:int}")]
        public async ValueTask<IActionResult> Get(int id, bool projects = false)
        {
            Category category = null;
            if (!projects)
            {
                category = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.Checks)
                                        .FirstOrDefaultAsync();
                if(category != null)
                {
                    CategoryBaseWithCheck model = category.ConvertToBaseWithCheck(_mapper);
                    return Ok(model);
                }
            }
            else
            {
                category = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.Checks)
                                        .Include(c => c.Projects)
                                            .ThenInclude(p => p.Comments)
                                        .FirstOrDefaultAsync();
                if (category != null)
                {
                    CategoryDTO model = category.ConvertToDTO(_mapper);
                    CategoryProjectDTO dto = new CategoryProjectDTO
                    {
                        Category = model,
                        Total = category.Projects.Count()
                    };
                    return Ok(dto);
                }
                
            }
            return NotFound(new ErrorDTO { Message = "Item not found" });
        }

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] CategoryBase model)
        {
            if (ModelState.IsValid)
            {
                var checker = await _repo.Item().Where(c => c.Name.Equals(model.Name, StringComparison.OrdinalIgnoreCase)).FirstOrDefaultAsync();
                if (checker != null) return BadRequest(new ErrorDTO { Message = "Category already exists" });
                Category category = model.Convert<CategoryBase, Category>(_mapper);

                (bool succeeded, Category addedCategory, string error) = await _repo.Add(category);
                if (succeeded) return Ok(addedCategory.Convert<Category, CategoryBase>(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] CategoryBase model)
        {
            if (ModelState.IsValid)
            {
                if(model.Id != 0)
                {
                    Category category = model.Convert<CategoryBase, Category>(_mapper);
                    (bool succeeded, Category updatedCategory, string error) = await _repo.Update(category, model.Id);
                    if (succeeded) return Ok(updatedCategory.Convert<Category, CategoryBase>(_mapper));
                    return NotFound(new ErrorDTO { Message = error });
                }
                
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }
        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> Delete(int id)
        {
            (bool succeeded, string error) = await _repo.Delete(id);
            if (succeeded) return (NoContent());
            return BadRequest(new ErrorDTO { Message = error });
        }
    }
}