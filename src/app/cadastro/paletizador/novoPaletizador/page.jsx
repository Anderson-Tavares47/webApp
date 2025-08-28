"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdAddCircle } from "react-icons/io";

export default function NovoPaletizadorPage() {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "Auto",
    situacao: "ativo",
    email: "",
    celular: "",
    salario: "",
  });

  const [metas, setMetas] = useState([{ produto: "", tipo: "Palete", quantidade: "Palete" }]);

  const validarCampos = () => {
    const newErrors = {};
    if (!formData.nome?.trim()) newErrors.nome = "Campo obrigatório";
    if (!formData.email?.trim()) newErrors.email = "Campo obrigatório";
    if (!formData.celular?.trim()) newErrors.celular = "Campo obrigatório";
    if (!formData.salario?.trim()) newErrors.salario = "Campo obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (value.trim()) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleCelularChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 6) value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    else if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    else if (value.length > 0) value = `(${value}`;
    setFormData((p) => ({ ...p, celular: value }));
    if (value) setErrors((p) => ({ ...p, celular: undefined }));
  };

  const handleSalarioChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    const numericValue = (parseFloat(value || "0") / 100) || 0;
    const formatted = numericValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    setFormData((p) => ({ ...p, salario: formatted }));
    if (numericValue > 0) setErrors((p) => ({ ...p, salario: undefined }));
  };

  const handleSave = async () => {
    if (!validarCampos()) return;

    const payload = {
      nome: formData.nome,
      codigo: formData.codigo === "Auto" ? "" : formData.codigo,
      situacao: formData.situacao,
      email: formData.email,
      celular: formData.celular,
      salario: formData.salario,
      metas: metas.map((m) => ({ produto: m.produto, tipo: m.tipo, quantidade: m.quantidade })),
    };

    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/paletizador/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data?.message || "Erro ao cadastrar paletizador");
      } else {
        alert("Paletizador cadastrado com sucesso!");
        router.push("/cadastro/paletizador");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const removerMeta = (index) => setMetas((arr) => arr.filter((_, i) => i !== index));

  const handleQuantidadeChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    setMetas((arr) => {
      const clone = [...arr];
      clone[index].quantidade = value || "";
      return clone;
    });
  };

  const handleMetaChange = (index, e) => {
    const { name, value } = e.target;
    setMetas((arr) => {
      const clone = [...arr];
      clone[index][name] = value;
      return clone;
    });
  };

  const addMeta = () => setMetas((arr) => [...arr, { produto: "", tipo: "Palete", quantidade: "Palete" }]);

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4 text-left">
      {/* Cabeçalho */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#3B447B] font-['Roboto_Slab']">Paletizador</h1>
        <button
          onClick={() => router.back()}
          className="inline-flex h-[38px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          &larr; voltar
        </button>
      </div>

      {/* Linha gradiente */}
      <div className="mb-4 h-px w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Dados Gerais */}
      <div className="rounded bg-white p-5">
        {/* Linha 1 */}
        <div className="mb-4 flex flex-wrap gap-8">
          {/* Nome */}
          <div className="flex min-w-[240px] flex-1 flex-col">
            <label className="mb-1 text-[18px] text-[#676363] font-['Roboto_Slab']">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome completo do paletizador"
              value={formData.nome}
              onChange={handleChange}
              className={`h-10 w-full rounded border-2 px-3 text-[16px] outline-none transition-colors placeholder-black/50
                ${errors.nome ? "border-red-500 bg-red-50" : "border-[#CCCCCC] focus:border-[#07ABA0]"}`}
            />
            {errors.nome && <span className="mt-1 text-xs text-red-600">{errors.nome}</span>}
          </div>

          {/* Código */}
          <div className="flex min-w-[180px] flex-1 flex-col">
            <label className="mb-1 text-[18px] text-[#676363] font-['Roboto_Slab']">Código</label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              value={formData.codigo}
              disabled
              className="h-10 w-full rounded border-2 border-[#CCCCCC] bg-gray-100 px-3 text-[16px] text-gray-600 outline-none"
            />
          </div>

          {/* Situação */}
          <div className="flex min-w-[180px] flex-1 flex-col">
            <label className="mb-1 text-[18px] text-[#676363] font-['Roboto_Slab']">Situação</label>
            <select
              id="situacao"
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              className="h-10 w-full cursor-pointer rounded border-2 border-[#CCCCCC] px-3 text-[16px] outline-none transition-colors focus:border-[#07ABA0]"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        {/* Linha 2 */}
        <div className="flex flex-wrap gap-8">
          {/* Email */}
          <div className="flex min-w-[240px] flex-1 flex-col">
            <label className="mb-1 text-[18px] text-[#676363] font-['Roboto_Slab']">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`h-10 w-full rounded border-2 px-3 text-[16px] outline-none transition-colors
                ${errors.email ? "border-red-500 bg-red-50" : "border-[#CCCCCC] focus:border-[#07ABA0]"}`}
            />
            {errors.email && <span className="mt-1 text-xs text-red-600">{errors.email}</span>}
          </div>

          {/* Celular */}
          <div className="flex min-w-[200px] flex-1 flex-col">
            <label className="mb-1 text-[18px] text-[#676363] font-['Roboto_Slab']">Celular</label>
            <input
              id="celular"
              name="celular"
              type="text"
              placeholder="(99) 99999-9999"
              value={formData.celular}
              onChange={handleCelularChange}
              className={`h-10 w-full rounded border-2 px-3 text-[16px] outline-none transition-colors
                ${errors.celular ? "border-red-500 bg-red-50" : "border-[#CCCCCC] focus:border-[#07ABA0]"}`}
            />
            {errors.celular && <span className="mt-1 text-xs text-red-600">{errors.celular}</span>}
          </div>

          {/* Salário */}
          <div className="flex min-w-[200px] flex-1 flex-col">
            <label className="mb-1 text-[18px] text-[#676363] font-['Roboto_Slab']">Salário</label>
            <input
              id="salario"
              name="salario"
              type="text"
              placeholder="R$ 0,00"
              value={formData.salario}
              onChange={handleSalarioChange}
              className={`h-10 w-full rounded border-2 px-3 text-[16px] outline-none transition-colors
                ${errors.salario ? "border-red-500 bg-red-50" : "border-[#CCCCCC] focus:border-[#07ABA0]"}`}
            />
            {errors.salario && <span className="mt-1 text-xs text-red-600">{errors.salario}</span>}
          </div>
        </div>
      </div>

      {/* Linha gradiente */}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Metas Produção */}
      <h2 className="mt-5 text-[28px] font-bold text-[#3B447B] font-['Roboto_Slab']">Metas Produção</h2>

      <div className="mt-3 rounded bg-white p-5">
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">Produto</th>
                <th className="px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">Tipo</th>
                <th className="px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">Quantidade</th>
                <th className="px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">Ações</th>
              </tr>
            </thead>
            <tbody>
              {metas.map((meta, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      name="produto"
                      value={meta.produto}
                      onChange={(e) => handleMetaChange(index, e)}
                      className="h-[35px] w-full rounded border border-gray-300 px-2 text-[16px] outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      name="tipo"
                      value={meta.tipo}
                      onChange={(e) => handleMetaChange(index, e)}
                      placeholder="Palete"
                      className="h-[35px] w-[90px] rounded border border-gray-300 px-2 text-center text-[16px] outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="h-[35px] w-[110px] rounded border border-gray-300 px-2 text-center text-[16px] outline-none"
                      value={metas[index]?.quantidade || ""}
                      onChange={(e) => handleQuantidadeChange(e, index)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        className="h-[30px] w-[70px] rounded bg-[#D9534F] text-[14px] font-bold text-white transition-colors hover:bg-[#C9302C]"
                        onClick={() => removerMeta(index)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Totais */}
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-[#3B447B]">Totais</th>
                <td className="px-3 py-2 text-[#676363]">0</td>
                <td className="px-3 py-2 text-[#676363]">0,00</td>
                <td className="px-3 py-2" />
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={addMeta}
          className="mt-4 inline-flex items-center gap-2 font-['Roboto_Slab'] text-[18px] font-bold text-[#07ABA0] transition-colors hover:text-[#056B68]"
        >
          <IoMdAddCircle className="text-[20px]" />
          adicionar item
        </button>
      </div>

      {/* Linha gradiente fina (inferior) */}
      <div className="mt-10 h-px w-full bg-gradient-to-r from-[#999999] via-[#CCCCCC] to-[#999999]" />

      {/* Ações */}
      <div className="mt-5 flex gap-5">
        <button
          className="inline-flex h-[38px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[20px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
          onClick={handleSave}
        >
          salvar
        </button>

        <button
          className="h-[26px] w-[82px] text-left font-['Roboto_Slab'] text-[20px] font-bold text-[#3B447B] transition-colors hover:text-[#2E365F]"
          onClick={() => router.back()}
        >
          cancelar
        </button>
      </div>
    </div>
  );
}
