using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Models.ViewModels;
using GovCheck.Repositories.Extensions;
using GovCheck.Repositories.Generics.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GovCheck.Controllers
{
    [Route("api/[controller]")]
    public class CommentsController : Controller
    {
        private readonly IModelManager<Comment> _repo;
        private readonly IMapper _mapper;
        public CommentsController(IModelManager<Comment> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async ValueTask<IActionResult> Get(bool project = false)
        {
            if (!project)
            {
                ICollection<BaseComment> model = await _repo.Item()
                                                            .Select(c => c.Convert(_mapper))
                                                            .ToListAsync();
                return Ok(model);
            }
            else
            {
                ICollection<CommentDTO> model = await _repo.Item()
                                                                .Include(c => c.Project)
                                                                    .ThenInclude(p => p.Category)
                                                                .Include(c => c.User)
                                                                .Select(c => c.ConvertToDTO(_mapper))
                                                                .ToListAsync();
                return Ok(model);
            }
            
        }

        [HttpGet("{id:int}")]
        public async ValueTask<IActionResult> Get(int id, bool project = false)
        {
            Comment comment = null;
            if (!project)
            {
                comment = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.MyChecks)
                                        .Include(c => c.SubComments)
                                        .FirstOrDefaultAsync();
                if (comment != null)
                {
                    BaseCommentWithCheck model = comment.ConvertToBaseWithUserCheck(_mapper);
                    return Ok(model);
                }
            }
            else
            {
                comment = await _repo.Item()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.MyChecks)
                                        .Include(c => c.Project)
                                            .ThenInclude(p => p.Category)
                                        .Include(c => c.User)
                                        .Include(c => c.SubComments)
                                        .FirstOrDefaultAsync();
                if (comment != null)
                {
                    CommentAsIsDTO dto = comment.ConvertToAsIs(_mapper);
                    return Ok(dto);
                }

            }
            return NotFound(new ErrorDTO { Message = "user not found" });
        }

        [HttpPost]
        public async ValueTask<IActionResult> Post([FromBody] CommentViewModel model)
        {
            if (ModelState.IsValid)
            {
                Comment comment = model.Convert<CommentViewModel, Comment>(_mapper);
                comment.DatePosted = DateTime.Now;
                (bool succeeded, Comment addedComment, string error) = await _repo.Add(comment);
                if (succeeded) return Ok(addedComment.Convert(_mapper));
                return BadRequest(new ErrorDTO { Message = error });
            }
            return base.BadRequest(ShowError());
        }

        

        [HttpPut]
        public async ValueTask<IActionResult> Put([FromBody] CommentViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Id != 0)
                {
                    Comment comment = model.Convert<CommentViewModel, Comment>(_mapper);
                    (bool succeeded, Comment updatedComment, string error) = await _repo.Update(comment, model.Id);
                    if (succeeded) return Ok(updatedComment.Convert(_mapper));
                    return NotFound(new ErrorDTO { Message = error });
                }

            }
            return BadRequest(ShowError());
        }
        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> Delete(int id)
        {
            (bool succeeded, string error) = await _repo.Delete(id);
            if (succeeded) return NoContent();
            return NotFound(new ErrorDTO { Message = error });
        }
        private ErrorDTO ShowError()
        {
            return new ErrorDTO { Errors = ModelState.Values.SelectMany(e => e.Errors).ToList() };
        }
    }
}
