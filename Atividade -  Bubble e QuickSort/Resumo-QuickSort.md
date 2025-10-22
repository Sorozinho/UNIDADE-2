# QuickSort — resumo objetivo

O que é
QuickSort é um algoritmo de ordenação “divide e conquista”. A ideia é escolher um pivô, separar (particionar) o vetor em dois lados — menores que o pivô e maiores que o pivô — e então ordenar recursivamente cada lado.

Como funciona (em palavras simples)
1) Escolha do pivô (ex.: último elemento, aleatório ou “mediana de três”).
2) Partição: reagrupa os elementos, colocando o pivô na posição final correta.
3) Chama QuickSort para a parte da esquerda e para a parte da direita.

Esquemas de partição (os mais comuns)
• Lomuto: fácil de entender/implementar (usa o último elemento como pivô). Costuma fazer mais trocas.
• Hoare: particiona com dois ponteiros que andam de fora para dentro; geralmente faz menos trocas e pode ser mais rápido.

Complexidade e memória
• Melhor/Médio caso: O(n log n)
• Pior caso: O(n²) (pivô ruim sempre caindo numa ponta, como em vetor já ordenado sem aleatorização)
• Memória: O(log n) em média pela recursão (in-place — não cria um segundo vetor grande)

Vantagens e limitações
• Vantagens: muito rápido na prática, usa pouca memória extra.
• Limitações: não é estável (não preserva a ordem de iguais), e o pior caso é O(n²) se o pivô for escolhido de forma ruim repetidamente.

Boas práticas
• Pivô: prefira aleatório ou “mediana de três” (primeiro, meio, último) para reduzir chance do pior caso.
• Subvetores pequenos: troque para InsertionSort quando o subvetor for muito curto (ex.: tamanho ≤ 16).
• Recursão: ordene primeiro o lado menor e use “tail recursion” (ou laço) no lado maior para limitar a profundidade da pilha a ~O(log n).
• Em C#: use Comparer<T>.Default para tipos genéricos ou um IComparer específico (por ex., StringComparer.Ordinal) quando ordenar strings.

Pseudocódigo (Lomuto, direto ao ponto)
quicksort(A, lo, hi):
    if lo >= hi: return
    p = particiona(A, lo, hi)   // pivô vai para A[p]
    quicksort(A, lo, p - 1)
    quicksort(A, p + 1, hi)

particiona(A, lo, hi):          // usa A[hi] como pivô
    pivot = A[hi]
    i = lo
    for j de lo até hi - 1:
        if A[j] <= pivot:
            trocar A[i] e A[j]
            i = i + 1
    trocar A[i] e A[hi]
    return i

Quando usar
• Ótima escolha geral para grandes volumes de dados em memória.
• Em dados quase ordenados ou muito pequenos, InsertionSort pode ser mais eficiente.
