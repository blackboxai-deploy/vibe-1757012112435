"use client";

import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import { Separator } from "@/components/ui/separator";

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export default function Home() {
  const [code, setCode] = useState(`# Bem-vindo ao Executor de Códigos Python! 🐍

print("Olá! Este é um executor de códigos Python online.")
print("Você pode escrever qualquer código Python aqui e executá-lo.")
print()

# Exemplo simples:
nome = "Desenvolvedor"
print(f"Seja bem-vindo, {nome}!")

# Experimente os exemplos no menu acima ou escreva seu próprio código!`);

  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    if (!code.trim()) {
      alert("Por favor, digite algum código Python para executar");
      return;
    }

    setIsExecuting(true);
    setResult(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data: ExecutionResult = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Erro ao executar código:', error);
      setResult({
        success: false,
        error: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setResult(null);
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🐍</div>
              <div>
                <h1 className="text-2xl font-bold">Executor de Códigos Python</h1>
                <p className="text-sm text-muted-foreground">
                  Execute código Python diretamente no navegador
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Python 3.x</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Execução Segura</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Timeout: 30s</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor */}
          <div className="flex-1 min-w-0">
            <CodeEditor
              code={code}
              setCode={setCode}
              isExecuting={isExecuting}
              onExecute={executeCode}
              onClear={clearCode}
            />
          </div>

          {/* Separator - apenas visível em telas grandes */}
          <div className="hidden lg:block">
            <Separator orientation="vertical" className="h-full" />
          </div>
          <div className="lg:hidden">
            <Separator orientation="horizontal" />
          </div>

          {/* Output Panel */}
          <div className="flex-1 min-w-0">
            <OutputPanel
              result={result}
              onClear={clearResult}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 mt-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>• Execute código Python com segurança</span>
              <span>• Exemplos integrados para aprendizado</span>
              <span>• Interface moderna e responsiva</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Feito com ❤️ e Next.js</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}