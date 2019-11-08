using GovCheck.Models;
using GovCheck.Models.Conform;
using GovCheck.Structs;
using Microsoft.EntityFrameworkCore;
using System;

namespace GovCheck.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options)
        {
        }

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Check> Checks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Contractor> Contractors { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<UserCheckList> UserChecks { get; set; }

    }
}
