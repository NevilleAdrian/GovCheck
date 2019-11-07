using GovCheck.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using GovCheck.Repositories;
using AutoMapper;
using GovCheck.Models;
using GovCheck.Repositories.Generics.Interfaces;
using EmiChoiceTravels.Repositories.Generics.Classes;
using GovCheck.Structs;
using GovCheck.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.OpenApi.Models;

namespace GovCheck
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration[AppConstant.Secret]));
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        //Validate credentials
                        ValidateIssuer = true,
                        ValidateIssuerSigningKey = true,
                        ValidateAudience = true,
                        //set valid params
                        ValidIssuer = Configuration[AppConstant.Issuer],
                        ValidAudience = Configuration[AppConstant.Audience],
                        IssuerSigningKey = securityKey
                    };
                });
            services.AddTransient<IModelManager<Project>, ModelManager<Project>>();
            services.AddTransient<IModelManager<Category>, ModelManager<Category>>();
            services.AddTransient<IModelManager<Contractor>, ModelManager<Contractor>>();
            services.AddTransient<IModelManager<Sponsor>, ModelManager<Sponsor>>();
            services.AddTransient<IModelManager<Comment>, ModelManager<Comment>>();
            services.AddTransient<IModelManager<Check>, ModelManager<Check>>();
            services.AddTransient<IModelManager<UserCheckList>, ModelManager<UserCheckList>>();
            services.AddTransient<IModelManager<ApplicationUser>, ModelManager<ApplicationUser>>();
            services.AddTransient<IImageService, ImageService>();
            services.AddTransient<IEmailSenderCustom, EmailSender>();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddTransient<AuthRepository>();
            services.AddTransient<AccountRepository>();

            services.AddAutoMapper(typeof(Startup));
            services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
            });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "GovCheck API", Version = "v1" });
            });
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "GovCheck API V1");
            });

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseSession();
            //Add JWToken to all incoming HTTP Request Header
            app.Use(async (context, next) =>
            {
                string jwtToken = context.Session.GetString("JWToken");
                if (!string.IsNullOrEmpty(jwtToken))
                {
                    if (context.Request.Headers.ContainsKey("Authorization"))
                    {
                        context.Request.Headers.Remove("Authorization");
                    }
                    context.Request.Headers.Add("Authorization", "Bearer " + jwtToken);
                }
                await next();
            });
            //Add JWToken Authentication service
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
