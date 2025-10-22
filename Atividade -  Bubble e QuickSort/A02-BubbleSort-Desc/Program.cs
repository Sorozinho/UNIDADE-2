using System;
using Unoesc.Algoritmos;

class Program
{
    static void Main()
    {
        string[] palavras = { "uva", "banana", "abacaxi", "laranja", "kiwi" };

        Console.WriteLine("Antes:  " + string.Join(", ", palavras));
        BubbleSorter.Sort(palavras, descending: true); // decrescente
        Console.WriteLine("Depois: " + string.Join(", ", palavras));
    }
}
