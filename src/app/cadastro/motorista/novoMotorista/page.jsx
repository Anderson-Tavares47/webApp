"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoMotoristaPage() {
  const router = useRouter();

  const [abaSelecionada, setAbaSelecionada] = useState("dados-gerais");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    tipo: "pista",
    email: "",
    celular: "",
    situacao: "ativo",
    cnh: "",
    categoria: "",
    vencimento: "",
    usuarioSistema: "",
    senhaSistema: "",
  });

  const validarCampos = () => {
    const newErrors = {};
    if (!formData.nome?.trim()) newErrors.nome = "Campo obrigatório";
    if (!formData.email?.trim()) newErrors.email = "Campo obrigatório";
    if (!formData.cnh?.trim()) newErrors.cnh = "Campo obrigatório";
    if (!formData.categoria?.trim()) newErrors.categoria = "Campo obrigatório";
    if (!formData.vencimento?.trim()) newErrors.vencimento = "Campo obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCelularChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 6) value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    else if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    else if (value.length > 0) value = `(${value}`;
    setFormData((p) => ({ ...p, celular: value }));
  };

  const handleCNHChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((p) => ({ ...p, cnh: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, cnh: undefined }));
  };

  const handleCategoriaCNHChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-E]/g, "");
    setFormData((p) => ({ ...p, categoria: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, categoria: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    if (!validarCampos()) return;

    const payload = {
      nome: formData.nome,
      codigo: formData.codigo || "",
      tipo: formData.tipo,
      email: formData.email,
      celular: formData.celular,
      situacao: formData.situacao,
      cnh: formData.cnh,
      categoria: formData.categoria,
      vencimento: formData.vencimento,
      usuarioSistema: formData.usuarioSistema,
      senhaSistema: formData.senhaSistema,
    };

    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/motorista/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Motorista cadastrado com sucesso!");
        router.push("/cadastro/motorista");
      } else {
        alert(result.message || "Erro ao cadastrar motorista.");
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Cabeçalho */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-['Roboto_Slab'] text-[clamp(22px,3vw,37px)] font-bold text-[#3B447B]">
          Novo Motorista
        </h1>
        <button
          onClick={() => router.back()}
          className="inline-flex h-[35px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] font-['Roboto_Slab'] text-[clamp(14px,2vw,16px)] font-bold text-white transition-colors hover:bg-[#2E376B]"
        >
          &larr; voltar
        </button>
      </div>

      {/* Abas (apenas uma, mantendo padrão visual) */}
      <div className="mb-2 flex border-b-2 border-[#CCCCCC]">
        <button
          onClick={() => setAbaSelecionada("dados-gerais")}
          className={`rounded-t-[10px] px-5 py-2 font-['Roboto_Slab'] font-bold ${
            abaSelecionada === "dados-gerais"
              ? "text-[clamp(16px,2vw,20px)] text-[#3B447B]"
              : "text-[clamp(14px,2vw,20px)] text-[#676767]"
          }`}
        >
          dados gerais
        </button>
      </div>

      {/* Conteúdo da aba */}
      <div className="min-h-[600px]">
        {abaSelecionada === "dados-gerais" && (
          <>
            {/* Linha 1 */}
            <div className="mb-5 flex w-full flex-wrap items-start justify-between gap-6">
              <div className="min-w-[250px] flex-1">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  placeholder="Nome completo do motorista"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full rounded-md border-2 px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors placeholder:font-['Roboto_Slab'] placeholder:text-[16px] placeholder:font-bold placeholder:text-black/60 focus:border-[#07ABA0] ${
                    errors.nome ? "border-red-500 bg-rose-50" : "border-[#CCCCCC]"
                  }`}
                />
                {errors.nome && <span className="mt-1 block text-xs text-red-600">{errors.nome}</span>}
              </div>

              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Código
                </label>
                <input
                  id="codigo"
                  type="text"
                  name="codigo"
                  placeholder="Opcional"
                  value={formData.codigo}
                  onChange={handleChange}
                  disabled
                  className="w-[220px] rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-500/70 outline-none disabled:bg-gray-100"
                />
              </div>

              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-[220px] cursor-pointer rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0]"
                >
                  <option value="pista">Truck</option>
                  <option value="lider">Toco</option>
                </select>
              </div>
            </div>

            {/* Linha 2 */}
            <div className="mb-5 flex w-full flex-wrap items-start justify-between gap-6">
              <div className="min-w-[250px] flex-1">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-md border-2 px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0] ${
                    errors.email ? "border-red-500 bg-rose-50" : "border-[#CCCCCC]"
                  }`}
                />
                {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
              </div>

              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Celular
                </label>
                <input
                  id="celular"
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleCelularChange}
                  placeholder="(99) 99999-9999"
                  className="w-[220px] rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0]"
                />
              </div>

              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Situação
                </label>
                <select
                  id="situacao"
                  name="situacao"
                  value={formData.situacao}
                  onChange={handleChange}
                  className="w-[220px] cursor-pointer rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0]"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Linha 3 CNH/Categoria/Vencimento */}
            <div className="mb-5 flex w-full flex-wrap items-start justify-between gap-6">
              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  CNH
                </label>
                <input
                  id="cnh"
                  type="text"
                  name="cnh"
                  value={formData.cnh}
                  onChange={handleCNHChange}
                  maxLength={11}
                  className={`w-[220px] rounded-md border-2 px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0] ${
                    errors.cnh ? "border-red-500 bg-rose-50" : "border-[#CCCCCC]"
                  }`}
                />
                {errors.cnh && <span className="mt-1 block text-xs text-red-600">{errors.cnh}</span>}
              </div>

              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Categoria
                </label>
                <input
                  id="categoria"
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleCategoriaCNHChange}
                  maxLength={2}
                  className={`w-[120px] rounded-md border-2 px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0] ${
                    errors.categoria ? "border-red-500 bg-rose-50" : "border-[#CCCCCC]"
                  }`}
                />
                {errors.categoria && <span className="mt-1 block text-xs text-red-600">{errors.categoria}</span>}
              </div>

              <div className="min-w-[250px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Vencimento
                </label>
                <input
                  id="vencimento"
                  type="date"
                  name="vencimento"
                  value={formData.vencimento}
                  onChange={handleChange}
                  className={`w-[220px] cursor-pointer rounded-md border-2 px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0] ${
                    errors.vencimento ? "border-red-500 bg-rose-50" : "border-[#CCCCCC]"
                  }`}
                />
                {errors.vencimento && <span className="mt-1 block text-xs text-red-600">{errors.vencimento}</span>}
              </div>
            </div>

            {/* Linha gradiente */}
            <div className="my-4 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            <h2 className="mb-3 font-['Roboto_Slab'] text-[clamp(22px,3vw,28px)] font-bold text-[#3B447B]">
              Dados de Acesso
            </h2>

            {/* Acesso */}
            <div className="flex max-w-[420px] flex-col gap-4">
              <div>
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Usuário do Sistema
                </label>
                <input
                  id="usuarioSistema"
                  type="text"
                  name="usuarioSistema"
                  value={formData.usuarioSistema}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0]"
                />
              </div>
              <div>
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Senha do Sistema
                </label>
                <input
                  id="senhaSistema"
                  type="password"
                  name="senhaSistema"
                  value={formData.senhaSistema}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-900 outline-none transition-colors focus:border-[#07ABA0]"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Linha gradiente + Ações */}
      <div className="my-10 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />
      <div className="flex items-center gap-6">
        <button
          onClick={handleSave}
          className="inline-flex h-[38px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] px-5 text-[16px] font-bold text-white transition-transform transition-colors hover:scale-105 hover:bg-[#2E365F]"
        >
          salvar
        </button>

        <button
          onClick={() => router.push("/cadastro/motorista")}
          className="font-['Roboto_Slab'] text-[20px] font-bold text-[#3B447B] hover:scale-105"
        >
          cancelar
        </button>
      </div>
    </div>
  );
}
