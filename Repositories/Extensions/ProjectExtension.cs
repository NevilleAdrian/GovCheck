using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using GovCheck.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Repositories.Extensions
{
    public static class ProjectExtension
    {
        public static ProjectDTO ConvertToDTO(this Project model, IMapper _mapper)
        {
            //Get comments on the project and project
            ICollection<CommentAsIsDTO> comments = model.Comments.Where(c => c.CommentId == null).Select(c =>
            {
                var comment = c.ConvertToAsIs(_mapper);
                comment.SubComments = c.SubComments.Select(co => co.ConvertToAsIs(_mapper)).ToList();
                return comment;
            }).ToList();

            //Project project as a ProjectDTO
            ProjectDTO project = _mapper.Map<Project, ProjectDTO>(model);
            project.TotalComments = model.Comments.Count;
            project.Comments = comments;
            project.Sponsor = model.Sponsor.Convert<Sponsor, SponsorBase>(_mapper);
            project.Contractor = model.Contractor.Convert<Contractor, ContractorBase>(_mapper);
            project.Category = model.Category.Convert<Category, CategoryBaseWithCheck>(_mapper);
            project.Duration = (project.EndDate - project.StartDate).Days;
            return project;
        }

        public static BaseProject ConvertToBase(this Project model, IMapper _mapper)
        {
            BaseProject updated = _mapper.Map<Project, BaseProject>(model);
            updated.TotalComments = model.Comments.Count;
            updated.Rating = model.Comments.Aggregate(0.0, (acc, comment) => acc + comment.Rating);
            updated.Duration = (model.EndDate - model.StartDate).Days;
            updated.Category = model.Category.Convert<Category, CategoryBaseWithCheck>(_mapper);
            return updated;
        }

        public static BaseProjectOnly ConvertToBaseOnly(this Project model, IMapper _mapper)
        {
            return _mapper.Map<Project, BaseProjectOnly>(model);
        }

    }
}
