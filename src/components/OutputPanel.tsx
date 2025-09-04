"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

interface OutputPanelProps {
  result: ExecutionResult | null;
  onClear: () => void;
}

export default function OutputPanel({ result, onClear }: OutputPanelProps) {
  const hasResult = result !== null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📤 Resultado da Execução
          </CardTitle>
          {hasResult && (
            <div className="flex items-center gap-2">
              {result.success ? (
                <Badge variant="default" className="bg-green-600">
                  ✅ Sucesso
                </Badge>
              ) : (
                <Badge variant="destructive">
                  ❌ Erro
                </Badge>
              )}
              {result.executionTime && (
                <Badge variant="secondary">
                  ⏱️ {result.executionTime}ms
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {hasResult && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const text = result.success ? result.output || '' : result.error || '';
                copyToClipboard(text);
              }}
            >
              📋 Copiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
            >
              🗑️ Limpar
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!hasResult ? (
          <div className="flex items-center justify-center h-[300px] text-center">
            <div className="space-y-2">
              <div className="text-6xl">🐍</div>
              <p className="text-muted-foreground">
                Execute um código Python para ver os resultados aqui
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {result.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-600">Output:</span>
                </div>
                <ScrollArea className="h-[300px] w-full">
                  <pre className="bg-muted/30 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap border-l-4 border-green-500">
                    {result.output || 'Código executado com sucesso (sem output)'}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-600">Erro:</span>
                </div>
                <ScrollArea className="h-[300px] w-full">
                  <pre className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap border-l-4 border-red-500 text-red-800 dark:text-red-200">
                    {result.error}
                  </pre>
                </ScrollArea>
              </div>
            )}

            {/* Informações adicionais */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
              <div>
                Status: {result.success ? '✅ Executado com sucesso' : '❌ Erro na execução'}
              </div>
              {result.executionTime && (
                <div>
                  Tempo: {result.executionTime}ms
                </div>
              )}
              <div>
                Python: python3
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}