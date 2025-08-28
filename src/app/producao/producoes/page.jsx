"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProducaoModal from "@/components/ModalProducoes";
import {
  FaArrowLeft,
  FaPlusCircle,
  FaCalculator,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";

import "../../../styles/producoes.css";

export default function producoesPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState("dados-gerais");
  const [preco, setPreco] = useState("0,00");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [producoes, setProducoes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    quantidadeTotal: "",
    indiceLinha: "",
    segundaLinha: "",
    unidade: "",
    metaCiclos: "",
    tempo: "",
    solicitacoes: "",
    areia: "",
    areiaIndustrial: "",
    valor: "",
    tempoParado: "",
    cimento: "",
    brita: "",
    aditivo: "",
    dataProducao: new Date().toISOString().split('T')[0],
    numeroProducao: "",
    receita: "PISO INTERTRAVADO H8 - 10X20X8",
    primeiraLinha: "Automático",
    maquina: "HTX 900-01",
    operador: "Juarez"
  });

  // Fetch productions on component mount
  useEffect(() => {
    fetchProducoes();
  }, []);

  const fetchProducoes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://191.101.71.157:3334/api/v1/producao/listar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filtros: {},
          pagina: 0,
          porPagina: 10
        })
      });
      
      if (!response.ok) throw new Error('Failed to fetch productions');
      
      const data = await response.json();
      setProducoes(data);
    } catch (error) {
      console.error('Error fetching productions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [tabelas, setTabelas] = useState([
    { id: 1, produto: "", unidade: "", quantidade: "", custo: "0,00", total: "0,00" },
  ]);

  const removerTabela = (index) => {
    const novasTabelas = tabelas.filter((_, i) => i !== index);
    setTabelas(novasTabelas);
  };

  const atualizarCusto = (e, index) => {
    let valor = e.target.value || "0,00";
    valor = valor.replace(/\D/g, "");
    valor = (parseFloat(valor) / 100).toFixed(2).replace(".", ",");

    const novasTabelas = [...tabelas];
    if (!novasTabelas[index]) return;

    novasTabelas[index].custo = valor;

    const quantidade =
      parseFloat((novasTabelas[index].quantidade || "0").replace(",", ".")) ||
      0;
    const custo = parseFloat(valor.replace(",", ".")) || 0;
    novasTabelas[index].total = (quantidade * custo)
      .toFixed(2)
      .replace(".", ",");

    setTabelas(novasTabelas);
  };

  const atualizarQuantidade = (e, index) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    setTabelas((prevTabelas) => {
      const novasTabelas = [...prevTabelas];
      novasTabelas[index] = {
        ...novasTabelas[index],
        quantidade: value,
        total: (
          parseFloat(value || "0") *
          parseFloat(novasTabelas[index].custo.replace(",", ".") || "0")
        )
          .toFixed(2)
          .replace(".", ","),
      };
      return novasTabelas;
    });
  };

  const formatarPreco = (valor) => {
    if (!valor) return "0,00";
    valor = valor.toString().replace(/\D/g, "");
    valor = (parseFloat(valor) / 100).toFixed(2).replace(".", ",");
    return valor;
  };

  const handlePrecoChange = (e) => {
    let value = formatarPreco(e.target.value);
    setPreco(value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.preco;
      return newErrors;
    });
  };

  const adicionarTabela = () => {
    const novoCusto = tabelas.length === 0 ? "" : "0,00";
    setTabelas([
      ...tabelas,
      { 
        id: Date.now(), 
        produto: "",
        quantidade: "", 
        unidade: "",
        custo: novoCusto, 
        total: "0,00" 
      },
    ]);
  };

  const handleQuantidadeChange = (e, field) => {
    let value = e.target.value.replace(/\D/g, "");

    setFormData((prev) => {
      const newErrors = { ...errors };
      delete newErrors[field];

      return { ...prev, [field]: value };
    });
  };

  const handlePorcentagemChange = (e) => {
    let value = e.target.value.replace(/[^0-9,]/g, "");
    if (value.includes(",")) {
      const parts = value.split(",");
      value = parts[0] + "," + (parts[1] ? parts[1].slice(0, 1) : "");
    }
    setFormData((prev) => ({ ...prev, indiceLinha: value || "" }));
  };

  const handleSegundaLinhaChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    if (value.includes(",")) {
      const [integer, decimal] = value.split(",");
      value = integer + "," + (decimal.slice(0, 1) || "");
    }
    setFormData((prev) => ({ ...prev, segundaLinha: value }));
  };

  const handleSave = async () => {
    if (!validarCampos()) return;

    try {
      const estrutura = tabelas.map(item => ({
        produto: item.produto,
        unidade: item.unidade,
        quantidade: item.quantidade,
        custo: item.custo,
        total: item.total
      }));

      const payload = {
        ...formData,
        preco,
        estrutura
      };

      const response = await fetch('http://191.101.71.157:3334/api/v1/producao/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save production');

      const data = await response.json();
      console.log('Production saved:', data);
      // Optionally refresh the list or redirect
      fetchProducoes();
    } catch (error) {
      console.error('Error saving production:', error);
    }
  };

  const handleUnidadeChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, unidade: value }));
  };

  const handleMetaCiclosChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, metaCiclos: value }));
  };

  const handleTempoChange = (e, field) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + ":" + value.slice(2, 4);
    }

    if (value.includes(":")) {
      const [horas, minutos] = value.split(":");
      if (parseInt(horas, 10) > 99) value = "99:" + minutos;
      if (parseInt(minutos, 10) > 59) value = horas + ":59";
    }

    setFormData((prev) => {
      const newErrors = { ...errors };
      delete newErrors[field];

      return { ...prev, [field]: value };
    });
  };

  const handleSolicitacoesChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, solicitacoes: value }));
  };

  const handleAreiaChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    if (value.includes(",")) {
      const [integer, decimal] = value.split(",");
      value = integer + "," + (decimal.slice(0, 1) || "");
    }
    setFormData((prev) => ({ ...prev, areia: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.areia;
      return newErrors;
    });
  };

  const handleAreiaIndustrialChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    if (value.includes(",")) {
      const [integer, decimal] = value.split(",");
      value = integer + "," + (decimal.slice(0, 1) || "");
    }
    setFormData((prev) => ({ ...prev, areiaIndustrial: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.areiaIndustrial;
      return newErrors;
    });
  };

  const handleTempoParadoChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + ":" + value.slice(2, 4);
    }
    const [horas, minutos] = value.split(":");
    if (horas && parseInt(horas, 10) > 99) {
      value = "99" + (minutos ? ":" + minutos : "");
    }
    if (minutos && parseInt(minutos, 10) > 59) {
      value = horas + ":59";
    }
    setFormData((prev) => ({
      ...prev,
      tempoParado: value,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.tempoParado;
      return newErrors;
    });
  };

  const handleCimentoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    if (value.includes(",")) {
      const [integer, decimal] = value.split(",");
      value = integer + "," + (decimal.slice(0, 1) || "");
    }
    setFormData((prev) => ({ ...prev, cimento: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.cimento;
      return newErrors;
    });
  };

  const handleBritaChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    if (value.includes(",")) {
      const [integer, decimal] = value.split(",");
      value = integer + "," + (decimal.slice(0, 1) || "");
    }
    setFormData((prev) => ({ ...prev, brita: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.brita;
      return newErrors;
    });
  };

  const handleAditivoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }
    if (value.includes(",")) {
      const [integer, decimal] = value.split(",");
      value = integer + "," + (decimal.slice(0, 1) || "");
    }
    setFormData((prev) => ({ ...prev, aditivo: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.aditivo;
      return newErrors;
    });
  };

  const atualizarUnidade = (e, index) => {
    let value = e.target.value.replace(/\D/g, "");
    setTabelas((prevTabelas) => {
      const novasTabelas = [...prevTabelas];
      novasTabelas[index] = {
        ...novasTabelas[index],
        unidade: value,
      };
      return novasTabelas;
    });
  };

  const handleNumeroChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      valor: value,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.valor;
      return newErrors;
    });
  };

  const handleCheckboxChange = (id, checked) => {
    const novoEstado = {
      ...checkboxesSelecionados,
      [id]: checked,
    };
    setCheckboxesSelecionados(novoEstado);
    const todosSelecionados =
      Object.values(novoEstado).length === 10 &&
      Object.values(novoEstado).every((v) => v);
    setSelecionarTodos(todosSelecionados);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, [name]: numericValue }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validarCampos = () => {
    let newErrors = {};

    if (!formData.quantidadeTotal || formData.quantidadeTotal.trim() === "")
      newErrors.quantidadeTotal = "Campo obrigatório";
    if (!formData.indiceLinha || formData.indiceLinha.trim() === "")
      newErrors.indiceLinha = "Campo obrigatório";
    if (!formData.segundaLinha || formData.segundaLinha.trim() === "")
      newErrors.segundaLinha = "Campo obrigatório";
    if (!formData.unidade || formData.unidade.trim() === "")
      newErrors.unidade = "Campo obrigatório";
    if (!preco || preco.trim() === "0,00")
      newErrors.preco = "Campo obrigatório";
    if (!formData.metaCiclos || formData.metaCiclos.trim() === "")
      newErrors.metaCiclos = "Campo obrigatório";
    if (!formData.tempo || formData.tempo.trim() === "")
      newErrors.tempo = "Campo obrigatório";
    if (!formData.solicitacoes || formData.solicitacoes.trim() === "")
      newErrors.solicitacoes = "Campo obrigatório";
    if (!formData.areia || formData.areia.trim() === "")
      newErrors.areia = "Campo obrigatório";
    if (!formData.areiaIndustrial || formData.areiaIndustrial.trim() === "")
      newErrors.areiaIndustrial = "Campo obrigatório";
    if (!formData.valor || formData.valor.trim() === "")
      newErrors.valor = "Campo obrigatório";
    if (!formData.tempoParado || formData.tempoParado.trim() === "")
      newErrors.tempoParado = "Campo obrigatório";
    if (!formData.cimento || formData.cimento.trim() === "")
      newErrors.cimento = "Campo obrigatório";
    if (!formData.brita || formData.brita.trim() === "")
      newErrors.brita = "Campo obrigatório";
    if (!formData.aditivo || formData.aditivo.trim() === "")
      newErrors.aditivo = "Campo obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className={`novo-producoes-container ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="novo-producoes-content">
        <div className="novo-producoes-header">
          <h1 className="novo-producoes-title">Produção</h1>
          <div className="acoes-container">
            <button onClick={() => router.back()} className="back-button">
              <FaArrowLeft /> voltar
            </button>
            <button className="acoes-btnModal" onClick={toggleModal}></button>
            <ProducaoModal isOpen={isModalOpen} toggleModal={toggleModal} />
          </div>
        </div>

        <div className="tabs">
          <span
            className={`tab ${
              abaSelecionada === "dados-gerais" ? "active" : ""
            }`}
            onClick={() => setAbaSelecionada("dados-gerais")}
          >
            dados gerais
          </span>
          <span
            className={`tab ${abaSelecionada === "eventos" ? "active" : ""}`}
            onClick={() => setAbaSelecionada("eventos")}
          >
            eventos
          </span>
        </div>

        <hr className="tabs-divider" />

        <div className="aba-conteudo">
          {abaSelecionada === "dados-gerais" && (
            <div className="dados-gerais-form">
              <div className="form-row">
                <div className="form-group descricao">
                  <label>Receita</label>
                  <input
                    type="text"
                    value={formData.receita}
                    disabled
                  />
                </div>
                <div className="form-group codigo">
                  <label>Primeira Linha</label>
                  <input 
                    type="text" 
                    value={formData.primeiraLinha} 
                    disabled 
                  />
                </div>
                <div className="form-group tipo">
                  <label>Quantidade Total</label>
                  <input
                    type="text"
                    placeholder="700"
                    value={formData.quantidadeTotal || ""}
                    onChange={(e) =>
                      handleQuantidadeChange(e, "quantidadeTotal")
                    }
                    className={errors.quantidadeTotal ? "input-error" : ""}
                  />
                  {errors.quantidadeTotal && (
                    <span className="error-message">
                      {errors.quantidadeTotal}
                    </span>
                  )}
                </div>

                <div className="form-group tipo">
                  <label>Indice 2° Linha</label>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="1,5"
                      value={formData.indiceLinha || ""}
                      onChange={(e) => handleQuantidadeChange(e, "indiceLinha")}
                      className={errors.indiceLinha ? "input-error" : ""}
                    />
                    <span className="unit">%</span>
                  </div>
                  {errors.indiceLinha && (
                    <span className="error-message">{errors.indiceLinha}</span>
                  )}
                </div>
              </div>
              <div className="containerProducao">
                <div className="textoAbaixo">
                  <span>Data Produção</span>
                  <strong>{formData.dataProducao}</strong>
                </div>
                <div className="textoProducao">
                  <span>Número da Produção</span>
                  <strong>{formData.numeroProducao || '--'}</strong>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group unidade">
                  <label>Segunda Linha</label>
                  <input
                    type="text"
                    name="segundaLinha"
                    placeholder="10,5"
                    value={formData.segundaLinha || ""}
                    onChange={handleChange}
                    className={errors.segundaLinha ? "input-error" : ""}
                  />
                  {errors.segundaLinha && (
                    <span className="error-message">{errors.segundaLinha}</span>
                  )}
                </div>

                <div className="form-group unidade">
                  <label htmlFor="unidade">Unidade</label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="unidade"
                      placeholder="M²"
                      value={formData.unidade || ""}
                      onChange={handleChange}
                      className={errors.unidade ? "input-error" : ""}
                    />
                    <span className="unit">²</span>
                  </div>
                  {errors.unidade && (
                    <span className="error-message">{errors.unidade}</span>
                  )}
                </div>

                <div className="form-group preco">
                  <label>Comissão Operador</label>
                  <div className="input-group">
                    <span className="prefix">R$</span>
                    <input
                      type="text"
                      value={preco}
                      onChange={handlePrecoChange}
                      className={errors.preco ? "input-error" : ""}
                    />
                  </div>
                  {errors.preco && (
                    <span className="error-message">{errors.preco}</span>
                  )}
                </div>
              </div>

              <hr className="section-divider" />

              <div className="section-title">Lançamentos</div>
              <div className="form-content">
                <div className="form-row2">
                  <div className="form-group">
                    <label>Meta Ciclos</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="metaCiclos"
                        placeholder="2000"
                        value={formData.metaCiclos || ""}
                        onChange={handleChange}
                        className={errors.metaCiclos ? "input-error" : ""}
                      />
                    </div>
                    {errors.metaCiclos && (
                      <span className="error-message">{errors.metaCiclos}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Tempo Total de Produção</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="tempo"
                        placeholder="9:00"
                        value={formData.tempo || ""}
                        onChange={handleChange}
                        className={errors.tempo ? "input-error" : ""}
                      />
                    </div>
                    {errors.tempo && (
                      <span className="error-message">{errors.tempo}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Solicitações</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="solicitacoes"
                        placeholder="Em Unidade"
                        value={formData.solicitacoes || ""}
                        onChange={handleChange}
                        className={errors.solicitacoes ? "input-error" : ""}
                      />
                    </div>
                    {errors.solicitacoes && (
                      <span className="error-message">
                        {errors.solicitacoes}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Areia</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="areia"
                        placeholder="0,0"
                        value={formData.areia || ""}
                        onChange={handleAreiaChange}
                        className={errors.areia ? "input-error" : ""}
                      />
                      <span className="unit">Kg</span>
                    </div>
                    {errors.areia && (
                      <span className="error-message">{errors.areia}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Areia Industrial</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="areiaIndustrial"
                        placeholder="0,0"
                        value={formData.areiaIndustrial || ""}
                        onChange={handleAreiaIndustrialChange}
                        className={errors.areiaIndustrial ? "input-error" : ""}
                      />
                      <span className="unit">Kg</span>
                    </div>
                    {errors.areiaIndustrial && (
                      <span className="error-message">
                        {errors.areiaIndustrial}
                      </span>
                    )}
                  </div>
                </div>
                <div className="info-box">
                  <span>Máquina</span>
                  <strong>{formData.maquina}</strong>
                  <div className="info-operador">
                    <span>Operador</span>
                    <strong>{formData.operador}</strong>
                  </div>
                </div>
                <div className="form-row2">
                  <div className="form-group">
                    <label>Ciclos Atingidos</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="valor"
                        placeholder="2300"
                        value={formData.valor || ""}
                        onChange={handleChange}
                        className={errors.valor ? "input-error" : ""}
                      />
                    </div>
                    {errors.valor && (
                      <span className="error-message">{errors.valor}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Tempo Parado</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="tempoParado"
                        placeholder="00:30"
                        value={formData.tempoParado || ""}
                        onChange={handleTempoParadoChange}
                        maxLength="5"
                        className={errors.tempoParado ? "input-error" : ""}
                      />
                      <span className="unit">Hr</span>
                    </div>
                    {errors.tempoParado && (
                      <span className="error-message">
                        {errors.tempoParado}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Cimento</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="cimento"
                        placeholder="0,0"
                        value={formData.cimento || ""}
                        onChange={handleCimentoChange}
                        className={errors.cimento ? "input-error" : ""}
                      />
                      <span className="unit">Kg</span>
                    </div>
                    {errors.cimento && (
                      <span className="error-message">{errors.cimento}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Brita</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="brita"
                        placeholder="0,0"
                        value={formData.brita || ""}
                        onChange={handleBritaChange}
                        className={errors.brita ? "input-error" : ""}
                      />
                      <span className="unit">Kg</span>
                    </div>
                    {errors.brita && (
                      <span className="error-message">{errors.brita}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Aditivo</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="aditivo"
                        placeholder="70"
                        value={formData.aditivo || ""}
                        onChange={handleAditivoChange}
                        className={errors.aditivo ? "input-error" : ""}
                      />
                      <span className="unit">L</span>
                    </div>
                    {errors.aditivo && (
                      <span className="error-message">{errors.aditivo}</span>
                    )}
                  </div>
                </div>

                <div className="section-title2">Estrutura</div>
                {tabelas.map((tabela, index) => (
                  <div key={tabela.id} className="tabela-producoes-container">
                    <table className="tabela-producoes">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Unidade</th>
                          <th>Quantidade</th>
                          <th>Custo</th>
                          <th>Total</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input 
                              type="text" 
                              className="input-produto" 
                              value={tabela.produto}
                              onChange={(e) => {
                                const novasTabelas = [...tabelas];
                                novasTabelas[index].produto = e.target.value;
                                setTabelas(novasTabelas);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input-unidade"
                              value={tabela.unidade || ""}
                              onChange={(e) => atualizarUnidade(e, index)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input-unidade"
                              value={tabela.quantidade || ""}
                              onChange={(e) => atualizarQuantidade(e, index)}
                            />
                          </td>
                          <td>
                            <div className="input-group input-custo">
                              <span className="prefix">R$</span>
                              <input
                                type="text"
                                value={tabela.custo}
                                onChange={(e) => atualizarCusto(e, index)}
                                placeholder="0,00"
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input-total"
                              value={tabela.total}
                              readOnly
                            />
                          </td>
                          <td className="acoes">
                            <div className="botoes-acoes">
                              {/* <button className="save-btn">Salvar</button> */}
                              <button
                                className="delete-btn"
                                onClick={() => removerTabela(index)}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="1" className="totais-label">
                            Totais
                          </td>
                          <td>0</td>
                          <td>0,00</td>
                          <td></td>
                          <td>0,00</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
                <div className="estrutura-actions">
                  <button className="add-item-btn" onClick={adicionarTabela}>
                    <FaPlusCircle /> adicionar item
                  </button>
                  <button
                    className="update-cost-btn"
                    onClick={() => {
                      // Implement your update cost logic here
                    }}
                  >
                    <FaCalculator /> atualizar custo do produto
                  </button>
                </div>
              </div>
              <hr className="tabs-divider" />

              <div className="form-actions">
                <button className="salvar-btn" onClick={handleSave}>
                  Finalizar
                </button>
              </div>
            </div>
          )}

          {abaSelecionada === "eventos" && (
            <div className="producao-content">
              <table className="tabela-eventos">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selecionarTodos}
                        onChange={(e) => {
                          const marcado = e.target.checked;
                          setSelecionarTodos(marcado);
                          const novosCheckboxes = {};
                          for (let i = 1; i <= 10; i++) {
                            novosCheckboxes[i] = marcado;
                          }
                          setCheckboxesSelecionados(novosCheckboxes);
                        }}
                      />
                    </th>
                    <th>Num</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Operador</th>
                    <th>Equipamento</th>
                    <th>Tipo de Parada</th>
                    <th>Motivo</th>
                    <th>Solução</th>
                    <th>Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {producoes.map((producao, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkboxesSelecionados[index] || false}
                          onChange={(e) =>
                            handleCheckboxChange(index, e.target.checked)
                          }
                        />
                      </td>
                      <td>{producao.numero || index + 1}</td>
                      <td>{producao.data || '--/--/----'}</td>
                      <td>{producao.hora || '--:--:--'}</td>
                      <td>
                        <strong>{producao.operador || '--'}</strong>
                      </td>
                      <td>{producao.equipamento || '--'}</td>
                      <td>{producao.tipoParada || '--'}</td>
                      <td>{producao.motivo || '--'}</td>
                      <td>{producao.solucao || '--'}</td>
                      <td>{producao.tempo || '--:--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr className="divider-tabela" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}