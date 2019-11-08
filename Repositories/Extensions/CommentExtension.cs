using AutoMapper;
using GovCheck.Models;
using GovCheck.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovCheck.Repositories.Extensions
{
    public static class CommentExtension
    {

        public static CommentDTO ConvertToDTO(this Comment model, IMapper _mapper)
        {
            CommentDTO dto = _mapper.Map<Comment, CommentDTO>(model);
            dto.Date = model.DatePosted.ToShortDateString();
            dto.Time = model.DatePosted.ToShortTimeString();
            dto.User = model?.User?.Convert(_mapper);
            dto.Project = model?.Project?.ConvertToBase(_mapper);
            dto.Project.Category = model?.Project?.Category.Convert<Category, CategoryBaseWithCheck>(_mapper);
            dto.SubComments = _mapper.Map<ICollection<Comment>, ICollection<CommentAsIsDTO>>(model.SubComments).ToList();
            return dto;
        }
        public static CommentAsIsDTO ConvertToAsIs(this Comment model, IMapper _mapper)
        {
            CommentAsIsDTO dto = _mapper.Map<Comment, CommentAsIsDTO>(model);
            dto.Date = model.DatePosted.ToShortDateString();
            dto.Time = model.DatePosted.ToShortTimeString();
            dto.User = model?.User?.Convert(_mapper);
            dto.Checks = model.MyChecks?.Select(m => m.Convert<UserCheckList, UserCheckOnly>(_mapper)).ToList();
            dto.SubComments = _mapper.Map<ICollection<Comment>, ICollection<CommentAsIsDTO>>(model.SubComments).ToList();
            return dto;
        }

        public static BaseCommentWithCheck ConvertToBaseWithUserCheck(this Comment model, IMapper _mapper)
        {
            BaseCommentWithCheck dto = _mapper.Map<Comment, BaseCommentWithCheck>(model);
            dto.Date = model.DatePosted.ToShortDateString();
            dto.Time = model.DatePosted.ToShortTimeString();
            dto.Checks = model.MyChecks?.Select(m => m.ConvertToDTO(_mapper)).ToList();
            return dto;
        }

        public static BaseComment Convert(this Comment model, IMapper _mapper)
        {
            BaseComment comment = _mapper.Map<Comment, BaseComment>(model);
            comment.Date = model.DatePosted.ToShortDateString();
            comment.Time = model.DatePosted.ToShortTimeString();
            return comment;
        }

    }
}
