using GovCheck.Models.Conform;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GovCheck.Repositories.Generics.Interfaces
{
    public interface IModelManager<TModel> 
        where TModel: class, IModel
    {
        ValueTask<(bool, TModel, string)> Add(TModel model);
        ValueTask<(bool, IEnumerable<TModel>, string)> Add(IEnumerable<TModel> models);
        ValueTask<(bool, TModel, string)> Update<T>(TModel model, T id);
        ValueTask<(bool, string)> Delete<T>(T id);
        DbSet<TModel> Item();
    }
}
