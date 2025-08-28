"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FaArrowLeft, FaPlusCircle, FaCalculator } from "react-icons/fa";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState("dados-gerais");

  const [porcentagem, setPorcentagem] = useState("");
  const [estoqueMaximo, setEstoqueMaximo] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [numeroVolume, setNumeroVolume] = useState("");
  const [dimensoes, setDimensoes] = useState({ largura: "", altura: "", comprimento: "" });
  const [pesos, setPesos] = useState({ pesoLiquido: "", pesoBruto: "" });

  const [formData, setFormData] = useState({
    descricao: "",
    unidade: "",
    tipo: "",
    preco: "0,00",
  });

  const [tabelas, setTabelas] = useState([{ id: 1, quantidade: "", custo: "0,00", total: "0,00" }]);
  const [errors, setErrors] = useState({});

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  // ---- formatadores/handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (value.trim() !== "") setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePrecoChange = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (!v) v = "0";
    v = (parseFloat(v) / 100).toFixed(2).replace(".", ",");
    setFormData((s) => ({ ...s, preco: v }));
    if (v !== "0,00") setErrors((p) => ({ ...p, preco: "" }));
  };

  const handlePesoChange = (field, value) => {
    const v = value.replace(/[^0-9,]/g, "");
    setPesos((s) => ({ ...s, [field]: v }));
    if (v.trim() !== "") setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleDimensaoChange = (field, value) => {
    const v = value.replace(/[^0-9,]/g, "");
    setDimensoes((s) => ({ ...s, [field]: v }));
    if (v.trim() !== "") setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleNumeroVolumeChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setNumeroVolume(v);
    if (v.trim() !== "") setErrors((p) => ({ ...p, numeroVolume: undefined }));
  };

  const handleEstoqueMinimoChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setEstoqueMinimo(v);
    if (v.trim() !== "") setErrors((p) => ({ ...p, estoqueMinimo: undefined }));
  };

  const handleEstoqueMaximoChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setEstoqueMaximo(v);
    if (v.trim() !== "") setErrors((p) => ({ ...p, estoqueMaximo: undefined }));
  };

  const handlePorcentagemChange = (e) => {
    let v = e.target.value.replace(/[^0-9,]/g, "");
    const parts = v.split(",");
    if (parts.length > 2) v = parts[0] + "," + parts.slice(1).join("");
    if (v.includes(",")) {
      const [i, d = ""] = v.split(",");
      v = i + "," + d.slice(0, 1);
    }
    setPorcentagem(v);
  };

  const formatarPreco = (valor) => {
    if (!valor) return "0,00";
    let v = valor.replace(/\D/g, "");
    return (parseFloat(v) / 100).toFixed(2).replace(".", ",");
  };

  const atualizarCusto = (e, index) => {
    let v = e.target.value || "0,00";
    v = formatarPreco(v);
    const list = [...tabelas];
    if (!list[index]) return;
    list[index].custo = v;
    const qtd = parseFloat((list[index].quantidade || "0").replace(",", ".")) || 0;
    const custo = parseFloat(v.replace(",", ".")) || 0;
    list[index].total = (qtd * custo).toFixed(2).replace(".", ",");
    setTabelas(list);
  };

  const atualizarQuantidade = (e, index) => {
    let v = e.target.value.replace(/\D/g, "");
    const list = [...tabelas];
    if (!list[index]) return;
    list[index].quantidade = v || "";
    const qtd = parseFloat((v || "0").replace(",", ".")) || 0;
    const custo = parseFloat(list[index].custo.replace(",", ".")) || 0;
    list[index].total = (qtd * custo).toFixed(2).replace(".", ",");
    setTabelas(list);
  };

  const removerTabela = (index) => {
    setTabelas((list) => list.filter((_, i) => i !== index));
  };

  const adicionarTabela = () =>
    setTabelas((list) => [...list, { id: Date.now(), quantidade: "", custo: "0,00", total: "0,00" }]);

  const atualizarCustoProduto = () => {
    // placeholder: cálculos avançados se precisar
  };

  // ---- submit
  const handleSalvar = async () => {
    const payload = {
      descricao: formData.descricao,
      unidade: formData.unidade,
      tipo: formData.tipo,
      preco: formData.preco.replace(",", "."),
      pesoLiquido: pesos.pesoLiquido.replace(",", "."),
      pesoBruto: pesos.pesoBruto.replace(",", "."),
      numeroVolume,
      largura: dimensoes.largura.replace(",", "."),
      altura: dimensoes.altura.replace(",", "."),
      comprimento: dimensoes.comprimento.replace(",", "."),
      estoqueMinimo,
      estoqueMaximo,
      estrutura: tabelas.map((i) => ({
        produto: i.produto || "Produto Padrão",
        unidade: i.unidade || "UND",
        quantidade: i.quantidade,
        custo: i.custo.replace(",", "."),
        total: i.total.replace(",", "."),
      })),
      indiceDesperdicio: porcentagem.replace(",", "."),
    };

    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/produto/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Produto criado com sucesso!");
        router.push("/produtos");
      } else {
        alert("Erro ao criar produto: " + (result.message || "Erro desconhecido"));
      }
    } catch (e) {
      console.error(e);
      alert("Falha na comunicação com o servidor.");
    }
  };

  const baseInput =
    "w-full rounded-md border-2 border-[#CCCCCC] px-3 py-2 text-[16px] text-gray-800 placeholder-black/60 outline-none transition-colors focus:border-[#07ABA0]";
  const baseLabel = "mb-1 block font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]";
  const errorClass = "border-red-500 bg-red-50";

  return (
    <div className={`mx-auto my-10 w-full max-w-[1042px] px-4 ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-['Roboto_Slab'] text-[clamp(22px,3vw,32px)] font-bold text-[#3B447B]">
          Novo produto
        </h1>
        <button
          onClick={() => router.back()}
          className="inline-flex h-[38px] w-[140px] items-center justify-center gap-2 rounded-full bg-[#3B447B] px-4 font-['Roboto_Slab'] text-[14px] font-bold text-white transition-colors hover:bg-[#2E365F]"
        >
          <FaArrowLeft /> voltar
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex gap-8">
        {[
          { id: "dados-gerais", label: "dados gerais" },
          { id: "producao", label: "produção" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAbaSelecionada(tab.id)}
            className={`rounded-t-[10px] px-2 py-1 font-['Roboto_Slab'] text-[20px] font-bold ${
              abaSelecionada === tab.id ? "text-[#3B447B]" : "text-[#676363] hover:text-[#3B447B]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="mb-4 h-[1px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Conteúdo */}
      <div>
        {abaSelecionada === "dados-gerais" && (
          <div className="flex flex-col gap-4">
            {/* Linha 1 */}
            <div className="flex flex-wrap items-end gap-6">
              <div className="min-w-[260px] flex-1">
                <label className={baseLabel}>Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  placeholder="Descrição completa do produto"
                  value={formData.descricao}
                  onChange={handleChange}
                  className={`${baseInput} ${errors.descricao ? errorClass : ""}`}
                />
                {errors.descricao && <span className="text-sm text-red-600">{errors.descricao}</span>}
              </div>

              <div className="min-w-[120px]">
                <label className={baseLabel}>Código</label>
                <input type="text" value="Automático" disabled className={`${baseInput} disabled:bg-gray-100`} />
              </div>

              <div className="min-w-[220px]">
                <label className={baseLabel}>Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`${baseInput} ${errors.tipo ? errorClass : ""} cursor-pointer`}
                >
                  <option value="">Selecione</option>
                  <option>Fabricado</option>
                  <option>Matéria</option>
                </select>
                {errors.tipo && <span className="text-sm text-red-600">{errors.tipo}</span>}
              </div>
            </div>

            {/* Linha 2 */}
            <div className="flex flex-wrap items-end gap-6">
              <div className="min-w-[220px]">
                <label className={baseLabel}>Unidade</label>
                <input
                  type="text"
                  name="unidade"
                  placeholder="Ex: UND, M²"
                  value={formData.unidade}
                  onChange={handleChange}
                  className={`${baseInput} ${errors.unidade ? errorClass : ""}`}
                />
                {errors.unidade && <span className="text-sm text-red-600">{errors.unidade}</span>}
              </div>

              <div className="min-w-[260px]">
                <label className={baseLabel}>Preço de custo</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                    R$
                  </span>
                  <input
                    type="text"
                    name="preco"
                    placeholder="0,00"
                    value={formData.preco}
                    onChange={handlePrecoChange}
                    className={`${baseInput} ${errors.preco ? errorClass : ""} pl-10`}
                  />
                </div>
                {errors.preco && <span className="text-sm text-red-600">{errors.preco}</span>}
              </div>
            </div>

            {/* Divider seção */}
            <div className="my-3 h-[1px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            {/* Dimensões e peso */}
            <h2 className="mb-2 font-['Roboto_Slab'] text-[24px] font-bold text-[#3B447B]">Dimensões e peso</h2>

            <div className="flex flex-wrap items-end gap-6">
              {/* Peso Líquido */}
              <div className="min-w-[220px]">
                <label className={baseLabel}>Peso Líquido</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Em Kg"
                    value={pesos.pesoLiquido}
                    onChange={(e) => handlePesoChange("pesoLiquido", e.target.value)}
                    className={`${baseInput} ${errors.pesoLiquido ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    Kg
                  </span>
                </div>
                {errors.pesoLiquido && <span className="text-sm text-red-600">{errors.pesoLiquido}</span>}
              </div>

              {/* Peso Bruto */}
              <div className="min-w-[220px]">
                <label className={baseLabel}>Peso Bruto</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Em Kg"
                    value={pesos.pesoBruto}
                    onChange={(e) => handlePesoChange("pesoBruto", e.target.value)}
                    className={`${baseInput} ${errors.pesoBruto ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    Kg
                  </span>
                </div>
                {errors.pesoBruto && <span className="text-sm text-red-600">{errors.pesoBruto}</span>}
              </div>

              {/* Nº de Vol */}
              <div className="min-w-[220px]">
                <label className={baseLabel}>N° de VOL. por embalagem</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Em Unidade"
                    value={numeroVolume}
                    onChange={handleNumeroVolumeChange}
                    className={`${baseInput} ${errors.numeroVolume ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    un
                  </span>
                </div>
                {errors.numeroVolume && <span className="text-sm text-red-600">{errors.numeroVolume}</span>}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-6">
              {/* Largura */}
              <div className="min-w-[180px]">
                <label className={baseLabel}>Largura</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0,0"
                    value={dimensoes.largura}
                    onChange={(e) => handleDimensaoChange("largura", e.target.value)}
                    className={`${baseInput} ${errors.largura ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    cm
                  </span>
                </div>
                {errors.largura && <span className="text-sm text-red-600">{errors.largura}</span>}
              </div>

              {/* Altura */}
              <div className="min-w-[180px]">
                <label className={baseLabel}>Altura</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0,0"
                    value={dimensoes.altura}
                    onChange={(e) => handleDimensaoChange("altura", e.target.value)}
                    className={`${baseInput} ${errors.altura ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    cm
                  </span>
                </div>
                {errors.altura && <span className="text-sm text-red-600">{errors.altura}</span>}
              </div>

              {/* Comprimento */}
              <div className="min-w-[180px]">
                <label className={baseLabel}>Comprimento</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0,0"
                    value={dimensoes.comprimento}
                    onChange={(e) => handleDimensaoChange("comprimento", e.target.value)}
                    className={`${baseInput} ${errors.comprimento ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    cm
                  </span>
                </div>
                {errors.comprimento && <span className="text-sm text-red-600">{errors.comprimento}</span>}
              </div>

              <div className="relative top-[-30px] ml-4 flex flex-1 items-center">
                <img src="/pacote-caixa.svg" alt="Dimensões do Produto" className="max-h-[120px]" />
              </div>
            </div>

            {/* Divider seção */}
            <div className="my-3 h-[1px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            {/* Estoque */}
            <h2 className="mb-2 font-['Roboto_Slab'] text-[24px] font-bold text-[#3B447B]">Estoque</h2>

            <div className="flex flex-wrap items-end gap-6">
              <div className="min-w-[200px]">
                <label className={baseLabel}>Controlar estoque</label>
                <select className={`${baseInput} cursor-pointer`}>
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>

              <div className="min-w-[200px]">
                <label className={baseLabel}>Estoque mínimo</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0"
                    value={estoqueMinimo}
                    onChange={handleEstoqueMinimoChange}
                    className={`${baseInput} ${errors.estoqueMinimo ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    un
                  </span>
                </div>
                {errors.estoqueMinimo && <span className="text-sm text-red-600">{errors.estoqueMinimo}</span>}
              </div>

              <div className="min-w-[200px]">
                <label className={baseLabel}>Estoque máximo</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0,0"
                    value={estoqueMaximo}
                    onChange={handleEstoqueMaximoChange}
                    className={`${baseInput} ${errors.estoqueMaximo ? errorClass : ""} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    cm
                  </span>
                </div>
                {errors.estoqueMaximo && <span className="text-sm text-red-600">{errors.estoqueMaximo}</span>}
              </div>

              <div className="min-w-[200px]">
                <label className={baseLabel}>Controlar lotes</label>
                <select className={`${baseInput} cursor-pointer`}>
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === "producao" && (
          <div className="mt-2">
            <h2 className="mb-2 font-['Roboto_Slab'] text-[24px] font-bold text-[#3B447B]">Estrutura</h2>

            {tabelas.map((t, index) => (
              <div key={t.id} className="mb-4 overflow-x-auto rounded-md border border-gray-200 p-3">
                <table className="min-w-[720px] w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {["Produto", "Unidade", "Quantidade", "Custo", "Total", "Ações"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-2">
                        <input className={baseInput} type="text" />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className={`${baseInput} w-[100px]`}
                          type="text"
                          value={tabelas[index]?.unidade || ""}
                          onChange={(e) => {
                            const list = [...tabelas];
                            list[index].unidade = e.target.value;
                            setTabelas(list);
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className={`${baseInput} w-[100px]`}
                          type="text"
                          value={tabelas[index]?.quantidade || ""}
                          onChange={(e) => atualizarQuantidade(e, index)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className={`${baseInput} w-[120px]`}
                          type="text"
                          value={tabelas[index]?.custo || ""}
                          onChange={(e) => atualizarCusto(e, index)}
                          placeholder="0,00"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input className={`${baseInput} w-[120px] bg-gray-100`} type="text" readOnly value={t.total} />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removerTabela(index)}
                          className="inline-flex h-8 items-center justify-center rounded-md bg-[#D9534F] px-3 text-sm font-bold text-white transition-colors hover:bg-[#C9302C]"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-3 py-2 font-bold text-[#3B447B]">Totais</td>
                      <td className="px-3 py-2">0</td>
                      <td className="px-3 py-2">0,00</td>
                      <td className="px-3 py-2"></td>
                      <td className="px-3 py-2">0,00</td>
                      <td className="px-3 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            <div className="mb-6 flex flex-wrap gap-6">
              <button
                className="inline-flex items-center gap-2 font-['Roboto_Slab'] text-[16px] font-bold text-[#07ABA0] transition-colors hover:text-[#056B68]"
                onClick={adicionarTabela}
              >
                <FaPlusCircle /> adicionar item
              </button>

              <button
                className="inline-flex items-center gap-2 font-['Roboto_Slab'] text-[16px] font-bold text-[#07ABA0] transition-colors hover:text-[#056B68]"
                onClick={atualizarCustoProduto}
              >
                <FaCalculator /> atualizar custo do produto
              </button>
            </div>

            <div className="my-6 h-[1px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

            <h2 className="mb-2 font-['Roboto_Slab'] text-[24px] font-bold text-[#3B447B]">Índice desperdício</h2>
            <div className="flex items-end gap-4">
              <div className="min-w-[160px]">
                <label className={baseLabel}>Porcentagem</label>
                <div className="relative">
                  <input
                    name="porcentagem"
                    type="text"
                    placeholder="0,0"
                    value={porcentagem}
                    onChange={handlePorcentagemChange}
                    className={`${baseInput} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#D9D9D9] px-2 py-0.5 font-bold text-gray-500">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Divider final e ações */}
        <div className="my-6 h-[1px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />
        <div className="flex items-center gap-4">
          <button
            onClick={handleSalvar}
            className="inline-flex h-[38px] w-[140px] items-center justify-center rounded-full bg-[#3B447B] px-5 text-[16px] font-bold text-white transition-transform transition-colors hover:scale-105 hover:bg-[#2E365F]"
          >
            salvar
          </button>
          <button
            onClick={() => router.back()}
            className="font-['Roboto_Slab'] text-[18px] font-bold text-[#3B447B] hover:text-[#2E365F]"
          >
            cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
