"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  isExecuting: boolean;
  onExecute: () => void;
  onClear: () => void;
}

const PYTHON_EXAMPLES = {
  "Hello World": `print("Olá, mundo!")
print("Bem-vindo ao executor de códigos Python!")`,
  
  "Matemática Básica": `# Operações matemáticas
import math

a = 10
b = 3

print(f"Soma: {a} + {b} = {a + b}")
print(f"Multiplicação: {a} * {b} = {a * b}")
print(f"Divisão: {a} / {b} = {a / b:.2f}")
print(f"Potência: {a} ** {b} = {a ** b}")
print(f"Raiz quadrada de {a}: {math.sqrt(a):.2f}")`,

  "Trabalhando com Listas": `# Manipulação de listas
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

print("Lista original:", numeros)
print("Números pares:", [n for n in numeros if n % 2 == 0])
print("Números ímpares:", [n for n in numeros if n % 2 == 1])
print("Soma total:", sum(numeros))
print("Maior número:", max(numeros))
print("Menor número:", min(numeros))`,

  "Funções": `# Definindo e usando funções
def fibonacci(n):
    """Calcula a sequência de Fibonacci até n"""
    fib = [0, 1]
    while fib[-1] < n:
        fib.append(fib[-1] + fib[-2])
    return fib[:-1] if fib[-1] > n else fib

def eh_primo(num):
    """Verifica se um número é primo"""
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True

# Testando as funções
print("Fibonacci até 50:", fibonacci(50))
print("\\nNúmeros primos até 20:")
for i in range(2, 21):
    if eh_primo(i):
        print(i, end=" ")
print()`,

  "Estruturas de Dados": `# Trabalhando com dicionários e sets
estudantes = {
    "Ana": {"idade": 20, "curso": "Engenharia", "notas": [8.5, 9.0, 8.7]},
    "Bruno": {"idade": 19, "curso": "Medicina", "notas": [9.2, 8.8, 9.5]},
    "Carlos": {"idade": 21, "curso": "Engenharia", "notas": [7.5, 8.0, 7.8]}
}

print("=== Relatório dos Estudantes ===")
for nome, dados in estudantes.items():
    media = sum(dados["notas"]) / len(dados["notas"])
    print(f"{nome}: {dados['idade']} anos, {dados['curso']}")
    print(f"  Média: {media:.2f}")
    print()

# Cursos únicos
cursos = {dados["curso"] for dados in estudantes.values()}
print("Cursos disponíveis:", cursos)`,

  "Loops e Condicionais": `# Loops e estruturas condicionais
print("=== Tabuada do 7 ===")
for i in range(1, 11):
    resultado = 7 * i
    print(f"7 x {i:2d} = {resultado:2d}")

print("\\n=== Classificação de Números ===")
numeros = [15, 28, 7, 42, 33, 91, 6, 18]

for num in numeros:
    classificacao = []
    
    if num % 2 == 0:
        classificacao.append("par")
    else:
        classificacao.append("ímpar")
    
    if num > 20:
        classificacao.append("grande")
    else:
        classificacao.append("pequeno")
    
    if num % 3 == 0:
        classificacao.append("múltiplo de 3")
    
    print(f"{num:2d}: {', '.join(classificacao)}")`,
};

export default function CodeEditor({ code, setCode, isExecuting, onExecute, onClear }: CodeEditorProps) {
  const [selectedExample, setSelectedExample] = useState<string>("");

  const loadExample = (exampleName: string) => {
    if (exampleName && PYTHON_EXAMPLES[exampleName as keyof typeof PYTHON_EXAMPLES]) {
      setCode(PYTHON_EXAMPLES[exampleName as keyof typeof PYTHON_EXAMPLES]);
      setSelectedExample(exampleName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter para executar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🐍 Editor Python
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Ctrl+Enter para executar
          </Badge>
        </div>
        
        {/* Seletor de Exemplos */}
        <div className="flex flex-wrap gap-2 mt-3">
          <label className="text-sm font-medium">Exemplos:</label>
          {Object.keys(PYTHON_EXAMPLES).map((example) => (
            <Button
              key={example}
              variant={selectedExample === example ? "default" : "outline"}
              size="sm"
              onClick={() => loadExample(example)}
              className="text-xs h-7"
            >
              {example}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Editor de Código */}
        <div className="relative">
          <Textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setSelectedExample("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite seu código Python aqui...

# Exemplo:
print('Olá, mundo!')

for i in range(5):
    print(f'Número: {i}')"
            className="min-h-[300px] font-mono text-sm resize-none"
            disabled={isExecuting}
          />
          
          {isExecuting && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <div className="flex items-center gap-2 bg-background border rounded-lg px-4 py-2 shadow-lg">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Executando código...</span>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Controle */}
        <div className="flex gap-2">
          <Button 
            onClick={onExecute} 
            disabled={isExecuting || !code.trim()}
            className="flex-1 sm:flex-none"
          >
            {isExecuting ? (
              <>
                ⏸️ Executando...
              </>
            ) : (
              <>
                ▶️ Executar Código
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={onClear}
            disabled={isExecuting}
          >
            🔄 Limpar
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Enter</kbd> para executar rapidamente</p>
          <p>• Timeout máximo: 30 segundos</p>
          <p>• Comandos de sistema e E/O de arquivos são bloqueados por segurança</p>
        </div>
      </CardContent>
    </Card>
  );
}