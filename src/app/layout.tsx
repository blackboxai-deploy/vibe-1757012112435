import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Executor de Códigos Python | Python Online",
  description: "Execute códigos Python diretamente no navegador com interface moderna e segura. Editor online com exemplos integrados e execução em tempo real.",
  keywords: ["python", "executor", "código", "online", "programação", "desenvolvimento"],
  authors: [{ name: "Python Executor" }],
  openGraph: {
    title: "Executor de Códigos Python",
    description: "Execute códigos Python online com segurança e facilidade",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}