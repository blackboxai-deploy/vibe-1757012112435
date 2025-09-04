import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'node:child_process';

interface ExecuteRequest {
  code: string;
}

interface ExecuteResponse {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<ExecuteResponse>> {
  try {
    const body: ExecuteRequest = await request.json();
    
    if (!body.code || typeof body.code !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Código Python é obrigatório'
      }, { status: 400 });
    }

    // Sanitização básica do código
    const sanitizedCode = body.code.trim();
    
    if (sanitizedCode.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Código não pode estar vazio'
      });
    }

    // Verificar se há comandos perigosos (básico)
    const dangerousCommands = [
      'import os',
      'import subprocess',
      'import sys',
      'os.system',
      'subprocess.',
      'exec(',
      'eval(',
      '__import__',
      'open(',
      'file(',
      'input(',
      'raw_input('
    ];

    const hasDangerousCommand = dangerousCommands.some(cmd => 
      sanitizedCode.toLowerCase().includes(cmd.toLowerCase())
    );

    if (hasDangerousCommand) {
      return NextResponse.json({
        success: false,
        error: 'Código contém comandos não permitidos por segurança'
      });
    }

    const startTime = Date.now();

    // Executar código Python
    const result = await executeCode(sanitizedCode);
    
    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: result.success,
      output: result.output,
      error: result.error,
      executionTime
    });

  } catch (error) {
    console.error('Erro ao executar código:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

async function executeCode(code: string): Promise<{ success: boolean; output?: string; error?: string }> {
  return new Promise((resolve) => {
    const python = spawn('python3', ['-c', code], {
      timeout: 30000, // 30 segundos
      killSignal: 'SIGKILL'
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          output: stdout || 'Código executado com sucesso (sem output)'
        });
      } else {
        resolve({
          success: false,
          error: stderr || `Processo finalizado com código: ${code}`
        });
      }
    });

    python.on('error', (error) => {
      if (error.message.includes('ENOENT')) {
        resolve({
          success: false,
          error: 'Python não está instalado ou não foi encontrado no sistema'
        });
      } else {
        resolve({
          success: false,
          error: `Erro ao executar: ${error.message}`
        });
      }
    });

    // Timeout manual adicional
    setTimeout(() => {
      if (!python.killed) {
        python.kill('SIGKILL');
        resolve({
          success: false,
          error: 'Execução cancelada por timeout (30 segundos)'
        });
      }
    }, 30000);
  });
}