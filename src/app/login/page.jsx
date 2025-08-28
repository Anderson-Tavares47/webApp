"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!login || !senha) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("https://api-alvesemoura.solutionsfac.com.br/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Falha no login");
      }

      localStorage.setItem("token", data?.data?.token);
      router.push("/home");
    } catch (err) {
      setError(err.message || "Erro inesperado ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA]">
      <div className="w-full max-w-[400px] text-center p-8">
        {/* Logo */}
        <img
          src="/logo-login.svg"
          alt="Logo"
          className="w-[211px] h-[214px] rounded-[39px] object-contain mx-auto mb-4"
        />

        {/* Título / Subtítulo */}
        <h1 className="font-['Istok_Web',sans-serif] font-bold text-[36px] leading-[51.82px] text-[#3B447B] drop-shadow-md">
          Seja Bem Vindo
        </h1>
        <span className="font-['Istok_Web',sans-serif] text-[20px] leading-[28.79px] text-[#07ABA0] drop-shadow-md mt-2 block mb-12">
          Efetue seu login
        </span>

        {/* Erro */}
        {error && (
          <p className="text-[#CA3D3D] text-sm mb-3">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          {/* Usuário/E-mail */}
          <div className="relative w-[300px]">
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder=" "
              className="peer w-full rounded-md border border-black/50 px-3 py-3 pr-10
                         text-[16px] text-[#333] bg-white outline-none
                         transition focus:border-[#07ABA0] focus:ring-2 focus:ring-[#07ABA0]/20"
            />
            <label
              htmlFor="login"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-400
                         bg-white px-1 transition-all duration-200 pointer-events-none
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[16px]
                         peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#07ABA0]"
            >
              Usuário ou e-mail
            </label>
          </div>

          {/* Senha */}
          <div className="relative w-[300px]">
            <input
              id="senha"
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder=" "
              className="peer w-full rounded-md border border-black/50 px-3 py-3 pr-10
                         text-[16px] text-[#333] bg-white outline-none
                         transition focus:border-[#07ABA0] focus:ring-2 focus:ring-[#07ABA0]/20"
            />
            <label
              htmlFor="senha"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-400
                         bg-white px-1 transition-all duration-200 pointer-events-none
                         peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[16px]
                         peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#07ABA0]"
            >
              Senha
            </label>

            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#555] hover:text-black"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-[300px] h-10 rounded-full bg-[#3B447B] text-white font-bold text-[16px]
                       shadow-md transition hover:bg-[#2E365F] active:scale-[0.98]"
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  );
}
