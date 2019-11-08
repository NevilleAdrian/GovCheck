using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace GovCheck.Services
{

    public class ImageService : IImageService
    {
        private const string default_Path = "images";
        private readonly IHostingEnvironment _env;
        public static Random random = new Random(55);
        public ImageService(IHostingEnvironment env)
        {
            _env = env;
        }
        public bool Create(IFormFile file, out string path)
        {
            path = "";
            if (file != null)
            {
                int randomId = random.Next(56, 1000);
                var fileName = $"{randomId}{Path.GetFileName(file.FileName)}";
                path = Path.Combine(default_Path, fileName);
                var absolutePath = Path.Combine(_env.WebRootPath, path);

                using (FileStream stream = new FileStream(absolutePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                return true;
            }
            return false;
        }

        public bool Edit(IFormFile file, string imageUrl, out string path)
        {
            path = "";
            if (file != null)
            {
                if (imageUrl != null)
                {
                    var oldPath = Path.Combine(_env.WebRootPath, imageUrl);
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }
                int randomId = random.Next(56, 1000);
                var fileName = $"{randomId}{Path.GetFileName(file.FileName)}";
                path = Path.Combine(default_Path, fileName);
                var absolutePath = Path.Combine(_env.WebRootPath, path);

                using (FileStream stream = new FileStream(absolutePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                return true;

            }
            return false;
        }

        public void Delete(string ImageUrl)
        {
            if (string.IsNullOrEmpty(ImageUrl))
            {
                ImageUrl = "";
            }
            var oldPath = Path.Combine(_env.WebRootPath, ImageUrl);
            if (File.Exists(oldPath))
            {
                System.IO.File.Delete(oldPath);
            }
        }

    }
}