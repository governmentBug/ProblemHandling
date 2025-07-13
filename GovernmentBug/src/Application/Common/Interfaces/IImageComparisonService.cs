using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Interfaces
{
    public interface IImageComparisonService
    {
        ulong GetImageHash(string imagePath);
        int CompareImages(string imagePath1, string imagePath2);
    }

}
