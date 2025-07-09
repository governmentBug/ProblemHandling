using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoenM.ImageHash;
using CoenM.ImageHash.HashAlgorithms;
using GovernmentBug.Application.Common.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
namespace GovernmentBug.Application.Common.Services
{
    public class ImageComparisonService : IImageComparisonService
    {
        private static int HammingDistance(ulong x, ulong y)
        {
            ulong val = x ^ y;
            int distance = 0;
            while (val != 0)
            {
                distance++;
                val &= val - 1;
            }
            return distance;
        }


        public ulong GetImageHash(string imagePath)
        {
            using var image = Image.Load<Rgba32>(imagePath);
            var hasher = new PerceptualHash();
            return hasher.Hash(image);
        }
        public int CompareImages(string imagePath1, string imagePath2)
        {
            ulong hash1 = GetImageHash(imagePath1);
            ulong hash2 = GetImageHash(imagePath2);
            return HammingDistance(hash1, hash2);
        }
    }

}
