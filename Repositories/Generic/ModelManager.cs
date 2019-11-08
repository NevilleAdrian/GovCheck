using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GovCheck.Data;
using Microsoft.Extensions.Logging;
using GovCheck.Repositories.Generics.Interfaces;
using GovCheck.Models.Conform;
using System.Collections.Generic;

namespace EmiChoiceTravels.Repositories.Generics.Classes
{
    
    public class ModelManager<TModel> : IModelManager<TModel>
        where TModel : class, IModel
    {
        private readonly ApplicationDbContext _ctx;
        private readonly ILogger<IModelManager<TModel>> _log;

        public ModelManager()
        {

        }
        public ModelManager(ApplicationDbContext context, ILogger<IModelManager<TModel>> log)
        {
            _ctx = context;
            _log = log;
        }

        public virtual async ValueTask<(bool, TModel, string)> Add(TModel model)
        {
            string error = null;
            bool success = false;
            TModel addedModel = null;
            try
            {
                _ctx.Set<TModel>().Add(model);
                await _ctx.SaveChangesAsync();
                success = true;
                addedModel = model;
            }
            catch(Exception ex)
            {
                error = ex.Message + ex.InnerException.Message;
                _log.LogError($"{error}");
                
            }
            return (success, addedModel, error);
        }

        public async ValueTask<(bool, IEnumerable<TModel>, string)> Add(IEnumerable<TModel> models)
        {
            string error = null;
            bool success = false;
            IEnumerable<TModel> addedModels = null;
            try
            {
                _ctx.Set<TModel>().AddRange(models);
                await _ctx.SaveChangesAsync();
                success = true;
                addedModels = models;
            }
            catch (Exception ex)
            {
                error = ex.Message + ex.InnerException.Message;
                _log.LogError($"{error}");

            }
            return (success, addedModels, error);
        }

        public virtual async ValueTask<(bool, string)> Delete<T>(T id)
        {
            string error = null;
            bool success = false;
            if (await Exists<T>(id))
            {
                try
                {
                    TModel model = await _ctx.Set<TModel>().FindAsync(id);
                    _ctx.Set<TModel>().Remove(model);
                    await _ctx.SaveChangesAsync();
                    success = true;
                    
                }
                catch (Exception ex)
                {
                    error = ex.Message + ex.InnerException.Message;
                    _log.LogError($"{error}");
                }
            }
            return (success, error);
        }

        public virtual DbSet<TModel> Item()
        {
            return _ctx.Set<TModel>();
        }

        public virtual async ValueTask<(bool, TModel, string)> Update<T>(TModel model, T id)
        {
            string error = null;
            TModel updatedModel = null;
            bool success = false;
            if(await Exists<T>(id))
            {
                try
                {
                    _ctx.Set<TModel>().Update(model);
                    await _ctx.SaveChangesAsync();
                    success = true;
                    updatedModel = model;
                }
                catch (Exception ex)
                {
                    _log.LogError($"{ex.Message}");
                    error = ex.Message + ex.InnerException.Message;
                }
            }

            return (success, updatedModel, error);
        }

        private async ValueTask<bool> Exists<T>(T id) => await _ctx.Set<TModel>().AnyAsync(x => x.ToString() == id.ToString());
    }

    
    
}
