"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function NovaMaquinaPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState(""); // mantido desabilitado
  const [situacao, setSituacao] = useState("Ativo");
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      alert("O campo Modelo é obrigatório.");
      return;
    }

    try {
      setSalvando(true);
      const response = await fetch("http://191.101.71.157:3334/api/v1/maquina/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, situacao }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Erro:", data);
        alert(data?.message || "Erro ao criar máquina.");
        return;
      }

      alert("Máquina criada com sucesso!");
      router.push("/cadastro/maquinas");
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4 text-left">
      {/* Cabeçalho */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-['Roboto_Slab'] text-[35px] font-bold text-[#3B447B]">
          Máquina
        </h1>

        <button
          onClick={() => router.back()}
          className="inline-flex h-[38px] w-[100px] items-center justify-center gap-2 rounded-full bg-[#3B447B] px-3 text-[14px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          <FaArrowLeft className="text-[12px]" />
          voltar
        </button>
      </div>

      {/* Linha gradiente */}
      <div className="my-2 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Formulário */}
      <form
        className="mt-5 flex flex-wrap gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Modelo */}
        <div className="flex min-w-[260px] flex-1 flex-col">
          <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
            Modelo
          </label>
          <input
            type="text"
            name="modelo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#3B447B]"
          />
        </div>

        {/* Código (auto / desabilitado) */}
        <div className="flex min-w-[240px] flex-1 flex-col">
          <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
            Código
          </label>
          <input
            type="text"
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Auto"
            disabled
            className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-600 outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        {/* Situação */}
        <div className="flex min-w-[220px] flex-1 flex-col">
          <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
            Situação
          </label>
          <select
            id="situacao"
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
            className="h-[40px] w-full cursor-pointer rounded-md border-2 border-[#CCCCCC] px-3 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#3B447B]"
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </form>

      {/* Ações */}
      <div className="mt-10 flex flex-wrap items-center gap-5">
        <div className="h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

        <button
          onClick={handleSubmit}
          disabled={salvando}
          className="inline-flex h-[38px] w-[100px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {salvando ? "salvando..." : "salvar"}
        </button>

        <button
          onClick={() => router.back()}
          className="text-[16px] font-bold text-[#3B447B] transition-transform hover:scale-[1.03]"
        >
          cancelar
        </button>
      </div>
    </div>
  );
}
