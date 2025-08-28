// src/app/cadastro/operadores/novoOperador/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlusCircle } from "react-icons/fa";

export default function NovoOperadorPage() {
  const router = useRouter();

  const [abaSelecionada, setAbaSelecionada] = useState("dados-gerais");
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    tipo: "pista",
    email: "",
    celular: "",
    situacao: "ativo",
    usuarioSistema: "",
    senhaSistema: "",
    regraComissao: "",
  });

  const [produtos, setProdutos] = useState([
    { id: 1, produto: "", unidade: "", quantidade: "", valor: "" },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setFormData((s) => ({ ...s, celular: value }));
  };

  const adicionarItem = () => {
    setProdutos((list) => [
      ...list,
      { id: (list[list.length - 1]?.id || 0) + 1, produto: "", unidade: "", quantidade: "", valor: "" },
    ]);
  };

  const removerItem = (id) => {
    setProdutos((list) => list.filter((i) => i.id !== id));
  };

  const handleProdutoChange = (id, field, value) => {
    setProdutos((list) =>
      list.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleValorChange = (id, value) => {
    let numeric = value.replace(/\D/g, "");
    if (numeric.length > 2) {
      numeric = numeric.slice(0, -2) + "." + numeric.slice(-2);
    } else if (numeric.length === 2) {
      numeric = "0." + numeric;
    } else if (numeric.length === 1) {
      numeric = "0.0" + numeric;
    } else {
      numeric = "0.00";
    }
    const formatted = Number(numeric).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    handleProdutoChange(id, "valor", formatted);
  };

  const handleQuantidadeChange = (id, value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 1 && v.startsWith("0")) v = v.slice(1);
    handleProdutoChange(id, "quantidade", v);
  };

  const handleUnidadeChange = (id, value) => {
    let v = value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    if (v.includes(".")) {
      const [i, d = ""] = v.split(".");
      v = i + "." + d.slice(0, 2);
    }
    handleProdutoChange(id, "unidade", v);
  };

  const handleSave = async () => {
  if (
    !formData.nome ||
    !formData.email ||
    !formData.celular ||
    !formData.usuarioSistema ||
    !formData.senhaSistema
  ) {
    alert("Por favor, preencha todos os campos obrigatórios!");
    return;
  }

  const payload = {
    nome: formData.nome,
    codigo: formData.codigo,
    tipo: formData.tipo,
    email: formData.email,
    celular: formData.celular,
    situacao: formData.situacao,
    usuario: formData.usuarioSistema,
    senha: formData.senhaSistema,
    produtos: produtos.map((p) => ({
      produto: p.produto,
      unidade: p.unidade,
      quantidade: p.quantidade,
      valor: p.valor,
    })),
    regraComissao: formData.regraComissao || "",
  };

  try {
    const token = localStorage.getItem("token"); // pega o token salvo

    const response = await fetch(
      "https://api-alvesemoura.solutionsfac.com.br/api/v1/operador/criar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Erro ao criar operador:", err);
      alert("Erro ao salvar operador.");
      return;
    }

    alert("Operador salvo com sucesso!");
    router.push("/cadastro/operadores");
  } catch (e) {
    console.error("Erro na requisição:", e);
    alert("Erro de conexão com o servidor.");
  }
};


  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-['Roboto_Slab'] text-[clamp(22px,3vw,37px)] font-bold text-[#3B447B]">
          Novo operador
        </h1>
        <div className="relative -right-[125px] top-5">
          <button
            onClick={() => router.back()}
            className="inline-flex h-[35px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] font-['Roboto_Slab'] text-[clamp(14px,2vw,16px)] font-bold text-white transition-colors hover:bg-[#2E376B]"
          >
            &larr; voltar
          </button>
        </div>
      </div>

      {/* Abas */}
      <div className="mb-5 w-[112%] border-b-2 border-[#CCCCCC]">
        <button
          onClick={() => setAbaSelecionada("dados-gerais")}
          className={`mr-4 rounded-t-[10px] px-5 py-2 font-['Roboto_Slab'] font-bold ${
            abaSelecionada === "dados-gerais"
              ? "text-[#3B447B] text-[clamp(16px,2vw,20px)]"
              : "text-[#676767] text-[clamp(14px,2vw,20px)]"
          }`}
        >
          dados gerais
        </button>
        <button
          onClick={() => setAbaSelecionada("comissao")}
          className={`rounded-t-[10px] px-5 py-2 font-['Roboto_Slab'] font-bold ${
            abaSelecionada === "comissao"
              ? "text-[#3B447B] text-[clamp(16px,2vw,20px)]"
              : "text-[#676767] text-[clamp(14px,2vw,20px)]"
          }`}
        >
          comissão
        </button>
      </div>

      {/* Conteúdo da aba */}
      <div className="min-h-[600px] transition-opacity">
        {abaSelecionada === "dados-gerais" && (
          <>
            <div className="rounded-[10px] p-5">
              <div className="mb-5 flex w-full flex-wrap items-start justify-between gap-6">
                <div className="min-w-[250px] flex-1">
                  <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome completo do operador"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0] placeholder:font-['Roboto_Slab'] placeholder:text-[16px] placeholder:font-bold placeholder:text-[#999999]"
                  />
                </div>

                <div className="min-w-[250px]">
                  <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                    Código
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    placeholder="Opcional"
                    disabled
                    className="w-[280px] rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-600 outline-none disabled:bg-gray-100"
                  />
                </div>

                <div className="min-w-[250px]">
                  <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                    Tipo
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-[220px] cursor-pointer rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0]"
                  >
                    <option value="pista">Pista</option>
                    <option value="lider">Líder</option>
                  </select>
                </div>
              </div>

              <div className="mb-5 flex w-full flex-wrap items-start justify-between gap-6">
                <div className="min-w-[250px] flex-1">
                  <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0]"
                  />
                </div>

                <div className="min-w-[250px]">
                  <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                    Celular
                  </label>
                  <input
                    type="text"
                    name="celular"
                    value={formData.celular}
                    onChange={handlePhoneChange}
                    placeholder="(99) 99999-9999"
                    maxLength={15}
                    className="w-[280px] rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0]"
                  />
                </div>

                <div className="min-w-[250px]">
                  <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                    Situação
                  </label>
                  <select
                    name="situacao"
                    value={formData.situacao}
                    onChange={handleChange}
                    className="w-[220px] cursor-pointer rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0]"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-10 h-[2px] w-[115%] bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            <h2 className="mb-4 font-['Roboto_Slab'] text-[clamp(22px,3vw,37px)] font-bold text-[#3B447B]">
              Dados de Acesso
            </h2>

            <div className="flex flex-col gap-4">
              <div className="min-w-[250px] max-w-[420px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  Usuário do Sistema
                </label>
                <input
                  type="text"
                  name="usuarioSistema"
                  value={formData.usuarioSistema}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0]"
                />
              </div>

              <div className="min-w-[250px] max-w-[420px]">
                <label className="mb-1 block font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  Senha do Sistema
                </label>
                <input
                  type="password"
                  name="senhaSistema"
                  value={formData.senhaSistema}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 outline-none transition-colors focus:border-[#07ABA0]"
                />
              </div>
            </div>
          </>
        )}

        {abaSelecionada === "comissao" && (
          <div className="mt-5 rounded-lg bg-white p-4">
            <h2 className="mb-3 font-['Roboto_Slab'] text-[22px] font-bold text-[#3B447B]">
              Produtos
            </h2>

            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-['Roboto_Slab'] font-bold text-[#676363]">
                      Produto
                    </th>
                    <th className="px-4 py-3 text-left font-['Roboto_Slab'] font-bold text-[#676363]">
                      Unidade
                    </th>
                    <th className="px-4 py-3 text-left font-['Roboto_Slab'] font-bold text-[#676363]">
                      Quantidade
                    </th>
                    <th className="px-4 py-3 text-left font-['Roboto_Slab'] font-bold text-[#676363]">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left font-['Roboto_Slab'] font-bold text-[#676363]">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="h-[35px] w-full rounded border border-[#CCCCCC] px-2 text-[16px] text-gray-800"
                          value={item.produto}
                          onChange={(e) =>
                            handleProdutoChange(item.id, "produto", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="h-[35px] w-[80px] rounded border border-[#999999] px-2 text-[16px] text-gray-800"
                          value={item.unidade}
                          onChange={(e) => handleUnidadeChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="h-[35px] w-[80px] rounded border border-[#999999] px-2 text-[16px] text-gray-800"
                          value={item.quantidade}
                          onChange={(e) => handleQuantidadeChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="h-[35px] w-[100px] rounded border border-[#999999] px-2 text-[16px] text-gray-800"
                          value={item.valor}
                          onChange={(e) => handleValorChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removerItem(item.id)}
                            className="inline-flex h-10 w-[100px] items-center justify-center rounded-full bg-[#D9534F] px-3 text-sm font-bold text-white transition-colors hover:bg-[#C9302C]"
                          >
                            excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td className="px-4 py-3 font-['Roboto_Slab'] text-[#676363]">Totais</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3">0,00</td>
                    <td className="px-4 py-3" />
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={adicionarItem}
              className="mt-3 inline-flex items-center gap-2 font-bold text-[#07ABA0] transition-colors hover:text-[#055E57]"
            >
              <FaPlusCircle /> adicionar item
            </button>

            <div className="my-10 h-[2px] w-[115%] bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            <div className="flex max-w-[600px] flex-col gap-2">
              <label className="font-['Roboto_Slab'] text-[16px] font-bold text-[#676363]">
                Regra para liberação de comissões
              </label>
              <select
                name="regraComissao"
                value={formData.regraComissao}
                onChange={handleChange}
                className="h-[50px] w-[365px] cursor-pointer rounded border border-[#CCCCCC] px-2 font-['Roboto_Slab'] text-[18px] font-bold text-gray-800 outline-none transition-colors focus:border-[#3B447B]"
              >
                <option value="">Selecione</option>
                <option value="total_producao">Total produção</option>
                <option value="media_operador">Média produção Operador</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-10 h-[2px] w-[115%] bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />
        <div className="flex items-center gap-5">
          <button
            onClick={handleSave}
            className="inline-flex h-[38px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] px-5 text-[16px] font-bold text-white transition-transform transition-colors hover:scale-105 hover:bg-[#2E365F]"
          >
            salvar
          </button>

          <button
            onClick={() => router.push("/cadastro/operadores")}
            className="font-['Roboto_Slab'] text-[20px] font-bold text-[#3B447B] hover:scale-105"
          >
            cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
