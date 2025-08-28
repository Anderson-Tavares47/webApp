"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NovoVeiculoPage() {
  const router = useRouter();

  // abas / estado
  const [activeTab, setActiveTab] = useState("dados");
  const [errors, setErrors] = useState({});
  const [registros, setRegistros] = useState([]);
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});

  // form
  const [formData, setFormData] = useState({
    modelo: "",
    ano: "",
    placa: "",
    codigo: "Auto",
    situacao: "Ativo",
    marca: "",
    tipo: "",
    km: "",
  });

  // carregar registros quando a aba "registros" abrir
  useEffect(() => {
    if (activeTab === "registros") {
      fetch("http://191.101.71.157:3334/api/v1/veiculo/listar?pagina=1&porPagina=10")
        .then((res) => res.json())
        .then((data) => {
          setRegistros(data?.dados || []);
        })
        .catch((err) => console.error("Erro ao listar veículos:", err));
    }
  }, [activeTab]);

  // validação
  const validarCampos = () => {
    const newErrors = {};
    if (!formData.modelo.trim()) newErrors.modelo = "Campo obrigatório";
    if (!formData.ano.trim()) newErrors.ano = "Campo obrigatório";
    if (!formData.placa.trim()) newErrors.placa = "Campo obrigatório";
    if (!formData.marca.trim()) newErrors.marca = "Campo obrigatório";
    if (!formData.tipo.trim()) newErrors.tipo = "Campo obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // máscaras / handlers
  const handleAnoChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData((p) => ({ ...p, ano: value }));
    if (value.trim()) setErrors((p) => { const x = { ...p }; delete x.ano; return x; });
  };

  const handlePlacaChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    // mantém padrão AAA0A00 ou AAA-0A00 visualmente
    value = value.replace(/^([A-Z]{3})(\d)([A-Z]?)(\d{0,2}).*$/, "$1-$2$3$4");
    setFormData((p) => ({ ...p, placa: value.replace("--", "-").slice(0, 8) }));
    if (value.trim()) setErrors((p) => { const x = { ...p }; delete x.placa; return x; });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (value.trim()) setErrors((p) => { const x = { ...p }; delete x[name]; return x; });
  };

  const handleSave = () => {
    if (!validarCampos()) return;

    fetch("http://191.101.71.157:3334/api/v1/veiculo/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          alert("Veículo criado com sucesso!");
          setFormData({
            modelo: "",
            ano: "",
            placa: "",
            codigo: "Auto",
            situacao: "Ativo",
            marca: "",
            tipo: "",
            km: "",
          });
        } else {
          alert("Erro ao criar veículo: " + (data?.message || "Erro desconhecido"));
        }
      })
      .catch(() => alert("Erro de conexão com servidor"));
  };

  return (
    <div className="w-full max-w-[1042px] mx-auto my-10 px-3 md:px-5">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-bold text-[28px] md:text-[32px] leading-[1.2] text-[#3B447B]">
          {activeTab === "dados" ? "Novo veículo" : "Veículos"}
        </h1>

        <button
          onClick={() => router.back()}
          className="h-10 px-6 rounded-full bg-[#3B447B] text-white font-bold text-[16px] hover:bg-[#2E365F] transition"
        >
          &larr; voltar
        </button>
      </div>

      {/* Abas */}
      <div className="font-bold text-[20px] leading-6">
        <button
          onClick={() => setActiveTab("dados")}
          className={`mr-6 pb-1 transition ${
            activeTab === "dados" ? "text-[#3B447B]" : "text-[#999999]"
          }`}
        >
          dados gerais
        </button>
        <button
          onClick={() => setActiveTab("registros")}
          className={`pb-1 transition ${
            activeTab === "registros" ? "text-[#3B447B]" : "text-[#999999]"
          }`}
        >
          registros
        </button>
      </div>

      {/* divisor gradiente topo */}
      <div className="h-px w-full my-5 bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Form */}
      {activeTab === "dados" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Modelo */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Modelo</label>
            <input
              name="modelo"
              type="text"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Modelo"
              className={`w-full md:w-4/5 rounded-md border-2 px-3 py-2 text-[16px] outline-none transition ${
                errors.modelo ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[#07ABA0]"
              }`}
            />
            {errors.modelo && <span className="text-red-600 text-xs mt-1">{errors.modelo}</span>}
          </div>

          {/* Ano */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Ano</label>
            <input
              name="ano"
              type="text"
              maxLength={4}
              value={formData.ano}
              onChange={handleAnoChange}
              placeholder="0000"
              className={`w-2/5 rounded-md border-2 px-3 py-2 text-[16px] outline-none transition ${
                errors.ano ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[#07ABA0]"
              }`}
            />
            {errors.ano && <span className="text-red-600 text-xs mt-1">{errors.ano}</span>}
          </div>

          {/* Placa */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Placa</label>
            <input
              name="placa"
              type="text"
              maxLength={8}
              value={formData.placa}
              onChange={handlePlacaChange}
              placeholder="AAA-0A00"
              className={`w-full md:w-4/5 rounded-md border-2 px-3 py-2 text-[16px] outline-none transition ${
                errors.placa ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[#07ABA0]"
              }`}
            />
            {errors.placa && <span className="text-red-600 text-xs mt-1">{errors.placa}</span>}
          </div>

          {/* Código (disabled) */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Código</label>
            <input
              type="text"
              value="Auto"
              disabled
              className="w-2/5 rounded-md border-2 px-3 py-2 text-[16px] outline-none bg-gray-100 text-gray-500 border-gray-300"
            />
          </div>

          {/* Situação */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Situação</label>
            <select
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              className="w-3/4 rounded-md border-2 px-3 py-2 text-[16px] outline-none cursor-pointer border-gray-300 focus:border-[#07ABA0]"
            >
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>

          {/* Marca */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Marca</label>
            <input
              name="marca"
              type="text"
              value={formData.marca}
              onChange={handleChange}
              className={`w-full md:w-4/5 rounded-md border-2 px-3 py-2 text-[16px] outline-none transition ${
                errors.marca ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[#07ABA0]"
              }`}
            />
            {errors.marca && <span className="text-red-600 text-xs mt-1">{errors.marca}</span>}
          </div>

          {/* Tipo */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Tipo</label>
            <input
              name="tipo"
              type="text"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full md:w-4/5 rounded-md border-2 px-3 py-2 text-[16px] outline-none transition ${
                errors.tipo ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[#07ABA0]"
              }`}
            />
            {errors.tipo && <span className="text-red-600 text-xs mt-1">{errors.tipo}</span>}
          </div>

          {/* Km (disabled) */}
          <div className="flex flex-col">
            <label className="text-[#676363] text-[18px] mb-1">Km</label>
            <input
              type="text"
              disabled
              className="w-3/4 rounded-md border-2 px-3 py-2 text-[16px] outline-none bg-gray-100 text-gray-500 border-gray-300"
            />
          </div>
        </div>
      )}

      {/* Tabela de registros */}
      {activeTab === "registros" && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-2 text-left text-[18px] font-normal text-[#676363]">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#07ABA0]"
                    checked={selecionarTodos}
                    onChange={(e) => {
                      const marcado = e.target.checked;
                      setSelecionarTodos(marcado);
                      const novoEstado = {};
                      registros.forEach((_, idx) => (novoEstado[idx] = marcado));
                      setCheckboxesSelecionados(novoEstado);
                    }}
                  />
                </th>
                {["Modelo", "Ano", "Placa", "Marca", "Tipo"].map((h) => (
                  <th
                    key={h}
                    className="py-2 px-2 text-left text-[18px] font-normal text-[#676363]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registros.map((registro, index) => (
                <tr
                  key={index}
                  className={index % 2 === 1 ? "bg-gray-50" : ""}
                >
                  <td className="py-2 pr-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#07ABA0]"
                      checked={checkboxesSelecionados[index] || false}
                      onChange={(e) => {
                        const novoEstado = {
                          ...checkboxesSelecionados,
                          [index]: e.target.checked,
                        };
                        setCheckboxesSelecionados(novoEstado);
                        const todosSelecionados =
                          registros.length > 0 &&
                          registros.every((_, idx) => novoEstado[idx]);
                        setSelecionarTodos(todosSelecionados);
                      }}
                    />
                  </td>
                  <td className="py-2 px-2 text-[18px] leading-6 text-[#3B447B]">
                    {registro.modelo}
                  </td>
                  <td className="py-2 px-2 text-[18px] leading-6 text-[#3B447B]">
                    {registro.ano}
                  </td>
                  <td className="py-2 px-2 text-[18px] leading-6 text-[#3B447B]">
                    {registro.placa}
                  </td>
                  <td className="py-2 px-2 text-[18px] leading-6 text-[#3B447B]">
                    {registro.marca}
                  </td>
                  <td className="py-2 px-2 text-[18px] leading-6 text-[#3B447B]">
                    {registro.tipo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* divisor gradiente bottom */}
      <div className={`h-px w-full ${activeTab === "dados" ? "mt-24" : "mt-8"} mb-6 bg-gradient-to-r from-[#999999] via-[#CCCCCC] to-[#999999]`} />

      {/* Ações */}
      <div className="flex items-center gap-5">
        <button
          onClick={handleSave}
          className="w-[140px] h-[38px] rounded-full bg-[#3B447B] text-white font-bold text-[16px] hover:bg-[#2E365F] transition"
        >
          salvar
        </button>
        <button
          onClick={() => router.back()}
          className="h-[26px] text-[#3B447B] font-bold text-[20px] leading-[26px] hover:text-[#2E365F] transition"
        >
          cancelar
        </button>
      </div>
    </div>
  );
}
