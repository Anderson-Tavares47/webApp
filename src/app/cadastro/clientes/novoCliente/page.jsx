"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function NovoClientePage() {
  const router = useRouter();
  const [abaSelecionada, setAbaSelecionada] = useState("dados-gerais");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nome: "",
    cnpjCpf: "",
    codigo: "Auto",
    email: "",
    celular: "",
    situacao: "ativo",
  });

  const validarCampos = () => {
    let newErrors = {};
    if (!formData.nome?.trim()) newErrors.nome = "Campo obrigatório";
    if (!formData.cnpjCpf?.trim()) newErrors.cnpjCpf = "Campo obrigatório";
    if (!formData.email?.trim()) newErrors.email = "Campo obrigatório";
    if (!formData.celular?.trim()) newErrors.celular = "Campo obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCnpjCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    } else {
      value = value
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    setFormData((p) => ({ ...p, cnpjCpf: value }));
    if (value.trim()) setErrors((p) => ({ ...p, cnpjCpf: undefined }));
  };

  const handleCelularChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setFormData((p) => ({ ...p, celular: value }));
    if (value.trim()) setErrors((p) => ({ ...p, celular: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (value.trim()) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSave = async () => {
    if (!validarCampos()) return;
    const payload = {
      nome: formData.nome,
      cnpjCpf: formData.cnpjCpf,
      codigo: formData.codigo,
      email: formData.email,
      celular: formData.celular,
      situacao: formData.situacao,
    };
    try {
      const response = await fetch(
        "http://191.101.71.157:3334/api/v1/empresa/criar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Cliente cadastrado com sucesso!");
        router.push("/cadastro/clientes");
      } else {
        alert(result.message || "Erro ao cadastrar cliente.");
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // mock entregas
  const entregas = [
    {
      num: 1,
      data: "01/01/2025",
      placa: "HTX 900-01",
      motorista: "Juarez",
      endereco: "CONCATENAR CIDADE + UF",
      pedido: 0,
      nfe: "M²",
      frete: "0%",
      numEntrega: 1,
    },
    {
      num: 2,
      data: "01/01/2025",
      placa: "HTX 900-02",
      motorista: "Emmanuel",
      endereco: "BLOCO DE CONCRETO - 19X19X39",
      pedido: 0,
      nfe: "UND",
      frete: "0%",
      numEntrega: 2,
    },
    {
      num: 3,
      data: "03/01/2025",
      placa: "HTX 900-01",
      motorista: "Juarez",
      endereco: "PISO INTERTRAVADO H8 - 10X20X8",
      pedido: 700,
      nfe: "M²",
      frete: "1,5%",
      numEntrega: 3,
    },
    // ...adicione mais se quiser
  ];

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Cabeçalho */}
      <div className="relative mb-5 flex items-center justify-between">
        <h1 className="font-['Roboto_Slab'] text-[26px] font-bold leading-[36.93px] text-[#3B447B]">
          {abaSelecionada === "entregas" ? "Clientes" : "Novo Cliente"}
        </h1>

        <button
          onClick={() => router.back()}
          className="inline-flex h-[38px] items-center justify-center rounded-full bg-[#3B447B] px-6 font-['Roboto_Slab'] text-[20px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          &larr; voltar
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-5 font-['Roboto_Slab'] text-[20px] font-bold">
        <button
          onClick={() => setAbaSelecionada("dados-gerais")}
          className={`h-[26px] w-[120px] text-center transition-colors ${
            abaSelecionada === "dados-gerais"
              ? "text-[#3B447B]"
              : "text-[#676363]"
          }`}
        >
          dados gerais
        </button>
        <button
          onClick={() => setAbaSelecionada("entregas")}
          className={`h-[26px] w-[120px] text-center transition-colors ${
            abaSelecionada === "entregas" ? "text-[#3B447B]" : "text-[#676363]"
          }`}
        >
          entregas
        </button>
      </div>

      {/* Divisor gradiente */}
      <div className="mb-5 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Conteúdo */}
      <div>
        {abaSelecionada === "dados-gerais" && (
          <>
            {/* Linha 1 */}
            <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Nome */}
              <div className="flex flex-col">
                <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Razão ou Fantasia"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`h-10 rounded-md border-2 px-3 text-[16px] outline-none placeholder:text-black/60 ${
                    errors.nome
                      ? "border-red-500 bg-red-50"
                      : "border-[#CCCCCC]"
                  }`}
                />
                {errors.nome && (
                  <span className="mt-1 text-[12px] text-red-600">
                    {errors.nome}
                  </span>
                )}
              </div>

              {/* CNPJ/CPF */}
              <div className="flex flex-col">
                <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  CNPJ/CPF
                </label>
                <input
                  id="cnpjCpf"
                  name="cnpjCpf"
                  type="text"
                  value={formData.cnpjCpf}
                  onChange={handleCnpjCpfChange}
                  className={`h-10 rounded-md border-2 px-3 text-[16px] outline-none placeholder:text-black/60 ${
                    errors.cnpjCpf
                      ? "border-red-500 bg-red-50"
                      : "border-[#CCCCCC]"
                  }`}
                />
                {errors.cnpjCpf && (
                  <span className="mt-1 text-[12px] text-red-600">
                    {errors.cnpjCpf}
                  </span>
                )}
              </div>

              {/* Código (Auto) */}
              <div className="flex flex-col">
                <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Código
                </label>
                <input
                  id="codigo"
                  name="codigo"
                  type="text"
                  value={formData.codigo}
                  disabled
                  className="h-10 rounded-md border-2 border-[#CCCCCC] bg-[#F0F0F0] px-3 text-[16px] text-[#888] outline-none"
                />
              </div>
            </div>

            {/* Linha 2 */}
            <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-10 rounded-md border-2 px-3 text-[16px] outline-none placeholder:text-black/60 ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-[#CCCCCC]"
                  }`}
                />
                {errors.email && (
                  <span className="mt-1 text-[12px] text-red-600">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Celular */}
              <div className="flex flex-col">
                <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Celular
                </label>
                <input
                  id="celular"
                  name="celular"
                  type="text"
                  placeholder="(99) 99999-9999"
                  value={formData.celular}
                  onChange={handleCelularChange}
                  className={`h-10 rounded-md border-2 px-3 text-[16px] outline-none placeholder:text-black/60 ${
                    errors.celular
                      ? "border-red-500 bg-red-50"
                      : "border-[#CCCCCC]"
                  }`}
                />
                {errors.celular && (
                  <span className="mt-1 text-[12px] text-red-600">
                    {errors.celular}
                  </span>
                )}
              </div>

              {/* Situação */}
              <div className="flex flex-col">
                <label className="mb-1 font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                  Situação
                </label>
                <select
                  id="situacao"
                  name="situacao"
                  value={formData.situacao}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border-2 border-[#CCCCCC] bg-white px-3 text-[16px] outline-none"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Divisor longo antes dos botões (como no original) */}
            <div className="my-10 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            {/* Botões */}
            <div className="flex gap-5">
              <button
                onClick={handleSave}
                className="inline-flex h-[38px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] px-4 font-['Roboto_Slab'] text-[20px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
              >
                salvar
              </button>
              <button
                onClick={() => router.push("/cadastro/clientes")}
                className="font-['Roboto_Slab'] text-[20px] font-bold text-[#3B447B] transition-colors hover:text-[#2E365F]"
              >
                cancelar
              </button>
            </div>
          </>
        )}

        {abaSelecionada === "entregas" && (
          <>
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      "",
                      "Num",
                      "Data",
                      "Placa",
                      "Motorista",
                      "Endereço",
                      "Pedido",
                      "NF-e",
                      "Frete",
                      "Num Entrega",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]"
                      >
                        {i === 0 ? (
                          <input
                            type="checkbox"
                            className="h-[19px] w-[21px] accent-[#07ABA0]"
                          />
                        ) : (
                          h
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entregas.map((e, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 odd:bg-white even:bg-[#F9F9F9]"
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="h-[19px] w-[21px] accent-[#07ABA0]"
                        />
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.num}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.data}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.placa}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.motorista}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.endereco}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.pedido}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.nfe}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.frete}
                      </td>
                      <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                        {e.numEntrega}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Divisor + paginação simples */}
            <div className="my-5 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />
            <div className="flex items-center gap-3">
              <span className="font-['Roboto_Slab'] text-[18px] text-[#676363]">
                01
              </span>
              <span className="font-['Roboto_Slab'] text-[18px] text-[#676363]">
                02
              </span>
              <span className="flex h-6 w-6 items-center justify-center text-[#676363]">
                <FaLongArrowAltRight />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
