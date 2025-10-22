using System;
using System.Collections.Generic;

namespace Unoesc.Algoritmos
{
    public static class BubbleSorter
    {
    
        public static void Sort(string[] array, bool descending = false, IComparer<string>? comparer = null)
        {
            if (array is null) throw new ArgumentNullException(nameof(array));
            comparer ??= StringComparer.Ordinal;

            bool swapped;
            int n = array.Length;

            do
            {
                swapped = false;
                for (int i = 0; i < n - 1; i++)
                {
                    int cmp = comparer.Compare(array[i], array[i + 1]);
                    bool shouldSwap = descending ? cmp < 0 : cmp > 0;
                    if (shouldSwap)
                    {
                        (array[i], array[i + 1]) = (array[i + 1], array[i]);
                        swapped = true;
                    }
                }
                n--; 
            } while (swapped);
        }
    }
}
