using System;
class Program
{
    static void Main()
    {
        string[] names = {
            "Diabo","Anfitriao", "Existido","Desconjuracao","Calamidade","Ordem Paranormal","OSNF","OSNI","KIAN","HEXATOMBE"};

        Console.Write("Digite o nome que voce quer procurar: ");
        string searchTerm = Console.ReadLine();

        int foundIndex = -1;

        for (int i = 0; i < names.Length; i++)
        {
            if (names[i] == searchTerm)
            {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex != -1)
        {
            Console.WriteLine("Encontrado na posição: " + foundIndex);
        }
        else{
            Console.WriteLine("nome nao foi encontrado");
        }
    }
}
