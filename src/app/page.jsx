"use client"; // Obrigatório para usar hooks no cliente

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redireciona para a página de login
  }, []);

  return null; // Evita que a página renderize qualquer conteúdo antes do redirecionamento
}
