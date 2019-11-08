using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Models.ViewModels;
using GovCheck.Repositories.Extensions;
using GovCheck.Repositories.Generics.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovCheck.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        //Injecting the generic repository to be configured for projects
        private readonly IModelManager<Project> _repo;
        private readonly IModelManager<Category> _category;
        private readonly IMapper _mapper;
        public ProjectsController(IModelManager<Project> repo, IModelManager<Category> category, IMapper mapper)
        {
            _repo = repo;
            _category = category;
            _mapper = mapper;
        }

        //This returns all projects based on HomeDTO settings
        //accessed with /api/projects
        [HttpGet]
        public async ValueTask<IActionResult> Get()
        {
            ICollection<Project> model = await _repo.Item()
                                    .Include(x => x.Category)
                                    .Include(x => x.Comments)
                                    .ToListAsync();

            ICollection<Category> categories = await _category.Item().ToListAsync();

            ICollection<BaseProject> projectProjects = model
                                    .Select(p => p.ConvertToBase(_mapper))
                                    .Take(10).ToList();

            ICollection<CategoryBase> projectCategories = categories
                                                                .Select(c => c.Convert<Category, CategoryBase>(_mapper))
                                                                .ToList();
            var homeModel = new HomeDTO
            {
                Projects = projectProjects,
                Categories = projectCategories,
                Total = model.Count
            };

            return Ok(homeModel);
        }

        /// <summary>
        ///     get a single project and increase view if so
        /// </summary>
        /// <param name="id"></param>
        /// <param name="view"></param>
        /// <returns>TotalDTO</returns>

        [HttpGet("{id}")]
        public async ValueTask<IActionResult> Get(int id, bool view = false)
        {
            //Get project of interest
            Project model = await _repo.Item()
                                        .Where(x => x.Id == id)
                                        .Include(x => x.Category)
                                            .ThenInclude(c => c.Checks)
                                        .Include(x => x.Sponsor)
                                        .Include(x => x.Contractor)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.User)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.SubComments)
                                                .ThenInclude(c => c.User)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.MyChecks)
                                        .FirstOrDefaultAsync();
            if(model != null)
            {
                if (view)
                {
                    await IncreaseProjectViews(model);
                }
                ProjectDTO project = model.ConvertToDTO(_mapper);

                return Ok(project);
            }

            return NotFound(new ErrorDTO { Message = "project not found" });
        }

        [HttpGet("count")]
        public IActionResult Count() => Ok(new TotalDTO { Total = _repo.Item().Count() });

        [HttpGet("started/count")]
        public IActionResult StartedCount() => Ok(new TotalDTO { Total = _repo.Item().Where(p => p.StartDate <= DateTime.Now).Count() });

        [HttpGet("completed/count")]
        public IActionResult CompletedCount() => Ok(new TotalDTO { Total = _repo.Item().Where(p => DateTime.Now == p.EndDate).Count() });


        private async Task IncreaseProjectViews(Project model)
        {
            model.NumberOfViews += 1;
            var _ = await _repo.Update(model, model.Id);
        }

        [HttpGet("{slug}")]
        public async ValueTask<IActionResult> Get(string slug, bool view = false)
        {
            //Get project of interest
            Project model = await _repo.Item()
                                        .Where(x => x.Slug == slug)
                                        .Include(x => x.Category)
                                              .ThenInclude(c => c.Checks)
                                        .Include(x => x.Sponsor)
                                        .Include(x => x.Contractor)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.User)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.SubComments)
                                                .ThenInclude(c => c.User)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.MyChecks)
                                        .FirstOrDefaultAsync();
            if (model != null)
            {
                if (view)
                {
                    await IncreaseProjectViews(model);
                }
                ProjectDTO project = model.ConvertToDTO(_mapper);
                return Ok(project);
            }

            return NotFound(new ErrorDTO { Message = "user not found" });
        }

        //Get project of interest
        [HttpGet("search")]
        public async ValueTask<IActionResult> Search(string search) =>
                        Ok(await _repo.Item()
                                        .Where(x => x.Title.Contains(search, StringComparison.OrdinalIgnoreCase)
                                                    || x.Description.Contains(search, StringComparison.OrdinalIgnoreCase))
                                        .Include(x => x.Sponsor)
                                        .Include(x => x.Category)
                                        .Include(x => x.Contractor)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.SubComments)
                                        .Select(p => p.ConvertToDTO(_mapper))
                                        .ToListAsync());

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] ProjectViewModel model)
        {
            if (ModelState.IsValid)
            {
                Project project = model.Convert<ProjectViewModel, Project>(_mapper);
                project.Slug = $"{project.Title.Trim().Replace(" ", "-")}-{DateTime.Now.ToString("MM-dd-yyyy")}";
                (bool succeeded, Project addedProject, string error) = await _repo.Add(project);
                if (succeeded) return Ok(addedProject.ConvertToBaseOnly(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return BadRequest(new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() });
        }

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] ProjectViewModel model)
        {
            if (ModelState.IsValid)
            {
                Project project = model.Convert<ProjectViewModel, Project>(_mapper);
                project.Slug = $"{project.Title.Trim().Replace(" ", "-")}-{DateTime.Now.ToString("MM-dd-yyyy")}";
                (bool succeeded, Project updatedProject, string error) = await _repo.Update(project, model.Id);
                if (succeeded) return Ok(updatedProject.ConvertToBaseOnly(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
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

        [HttpGet("report/{id:int}")]
        public async ValueTask<IActionResult> Report(int id)
        {
            //Get project of interest
            Project model = await _repo.Item()
                                        .Where(x => x.Id == id)
                                        .Include(x => x.Category)
                                            .ThenInclude(c => c.Checks)
                                        .Include(x => x.Sponsor)
                                        .Include(x => x.Contractor)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.User)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.SubComments)
                                                .ThenInclude(c => c.User)
                                        .Include(x => x.Comments)
                                            .ThenInclude(c => c.MyChecks)
                                        .FirstOrDefaultAsync();
            if (model != null)
            {
                ProjectDTO project = model.ConvertToDTO(_mapper);
                return Ok(new ReportDTO { Report = GenerateReport(project) });
            }

            return NotFound(new ErrorDTO { Message = "project not found" });
        }

        private string GenerateReport(ProjectDTO model)
        {
            StringBuilder reportGen = new StringBuilder(500);
            reportGen.Append($"This is a report on '{model.Title}'. ");
            string startVerb = model.StartDate >= DateTime.Now ? "supposedly started on" : "is expected to start on";
            string endVerb = model.EndDate >= DateTime.Now ? "will supposedly finished on" : "is expected to end on";
            reportGen.Append($"The project {startVerb} {model.StartDate} and {endVerb} {model.EndDate}. ");
            reportGen.Append($"This is the brief: ");
            reportGen.Append($"{model.Brief} ");
            char plural = model.TotalComments > 1 ? 's' : ' ';
            reportGen.Append($"So far, this project has {model.TotalComments} direct comment{plural}. ");
            var _ = model.Comments.Select(c => {
                List<string> details = new List<string>();
                foreach(var item in model.Category.Checks)
                {
                    int totalSum = c.Checks.Count(check => check.Check.Id == item.Id);
                    if(totalSum != 0)
                    {
                        float percent = (float)totalSum / model.TotalComments;
                        reportGen.Append($"{percent}% of users claimed that {item.Name} is done. ");
                    }
                }
                return true;
            });
            
            reportGen.Append($"Thank you.");
            return reportGen.ToString();
        }
    }
}