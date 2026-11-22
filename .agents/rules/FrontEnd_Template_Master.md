# FrontEnd Master Template: [Entity]

Complete, unabridged code for the Frontend layer. Replace `[Entity]` with PascalCase and `[entity]` with camelCase/snake_case as needed. Use `[entities]` for plural forms.

---

## 🟨 Master Service: `[Entity]Methods.jsx`

```javascript
import AxiosAPI from "../../utils/axiosConfig";

/* =========================
   LISTAR [ENTITY]
========================= */
export async function listar[Entitys](params = {}) {
  try {
    const response = await AxiosAPI.get(`/[entity]/listar[Entitys]`, {
      params: {
        search: params.search || null,
        per_page: params.per_page || 10,
        page: params.page || 1,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al listar [entitys]:", error);
    throw error;
  }
}

/* =========================
   REGISTRAR [ENTITY]
========================= */
export async function registrar[Entity]([entity]) {
  const [entity]Recibido = {
    descripcion: [entity]?.descripcion || "",
    monto: [entity]?.monto || 0,
    fecha_[entity]: [entity]?.fecha_[entity] || "",
    // Agregue más campos según sea necesario
  };

  try {
    const response = await AxiosAPI.post(
      `/[entity]/registrar[Entity]`,
      [entity]Recibido,
    );

    return response.data;
  } catch (error) {
    console.error("Error al registrar [entity]:", error);
    throw error;
  }
}

/* =========================
   ACTUALIZAR [ENTITY]
========================= */
export async function actualizar[Entity]([entity]) {
  const [entity]Recibido = {
    descripcion: [entity]?.descripcion || "",
    monto: [entity]?.monto || 0,
    fecha_[entity]: [entity]?.fecha_[entity] || "",
    // Agregue más campos según sea necesario
  };

  try {
    const response = await AxiosAPI.patch(
      `/[entity]/actualizar[Entity]/${[entity].id_[entity]}`,
      [entity]Recibido,
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar [entity]:", error);
    throw error;
  }
}

/* =========================
   ELIMINAR [ENTITY]
========================= */
export async function eliminar[Entity](id_[entity]) {
  try {
    const response = await AxiosAPI.delete(
      `/[entity]/eliminar[Entity]/${id_[entity]}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error al eliminar [entity]:", error);
    throw error;
  }
}
```

---

## 🟨 Master Listado: `Listado[Entity].jsx`

```javascript
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Search, Plus, Edit2, Trash2, Filter, Download, DollarSign, Calendar, X, AlertCircle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FolderOpen, Receipt, FileUp,
} from "react-icons";
import { useCrudContext } from "../../../../context/CrudContext";
import Loading from "../../../../components/Loading";
import { listar[Entity] } from "../../../../services/[entity]/[Entity]Methods";

export function Listado[Entity]() {
  const { isLoading, setIsLoading, isUpdated, openModal } = useCrudContext();

  const [[entities], set[Entities]] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [inputBusqueda, setInputBusqueda] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await listar[Entity]({
          page: currentPage,
          per_page: itemsPerPage,
          search: busqueda,
        });

        set[Entities](response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error al listar [entities]:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isUpdated, currentPage, busqueda, itemsPerPage]);

  const handleSearch = (e) => setInputBusqueda(e.target.value);
  const ejecutarBusqueda = () => { setBusqueda(inputBusqueda); setCurrentPage(1); };
  const handleKeyPress = (e) => { if (e.key === "Enter") ejecutarBusqueda(); };
  const limpiarBusqueda = () => { setInputBusqueda(""); setBusqueda(""); setCurrentPage(1); };
  const handleItemsPerPageChange = (e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); };

  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = pagination.last_page || 1;
    const maxVisible = window.innerWidth <= 768 ? 3 : 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        for (let i = 2; i <= Math.min(maxVisible, totalPages - 1); i++) pages.push(i);
        pages.push("ellipsis-end");
      } else if (currentPage >= totalPages - 2) {
        pages.push("ellipsis-start");
        for (let i = totalPages - (maxVisible - 1); i < totalPages; i++) pages.push(i);
      } else {
        pages.push("ellipsis-start");
        const pagesToShow = window.innerWidth <= 768 ? [currentPage] : [currentPage - 1, currentPage, currentPage + 1];
        pagesToShow.forEach((page) => pages.push(page));
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (newPage) => {
    const totalPages = pagination.last_page || 1;
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // Stats y cálculos (Opcional)
  const montoTotal = [entities].reduce((acc, item) => acc + parseFloat(item.monto || 0), 0);

  return (
    <>
      {isLoading ? <Loading /> : (
        <Container>
          <Header>
            <HeaderLeft>
              <Title><Receipt size={28} /> Gestión de [Entity]</Title>
              <Subtitle>Administra tus [entities]</Subtitle>
            </HeaderLeft>
            <HeaderRight>
              <ActionButton $primary onClick={() => openModal("registrar[Entity]")}><Plus size={20} /> Nuevo [Entity]</ActionButton>
            </HeaderRight>
          </Header>

          <StatsCards>
            <StatCard>
              <StatIcon $color="#0D7DFD"><Receipt size={24} /></StatIcon>
              <StatContent>
                <StatValue>{pagination.total || 0}</StatValue>
                <StatLabel>Total Registros</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon $color="#10b981"><DollarSign size={24} /></StatIcon>
              <StatContent>
                <StatValue>S/ {montoTotal.toFixed(2)}</StatValue>
                <StatLabel>Monto Total</StatLabel>
              </StatContent>
            </StatCard>
          </StatsCards>

          <Toolbar>
            <ToolbarLeft>
              <SearchBar>
                <Search size={20} color="#94a3b8" />
                <SearchInput
                  type="text"
                  placeholder="Buscar por [Campo 1], [Campo 2] o [Campo 3]..." // SINCRONIZAR CON BACKEND
                  value={inputBusqueda}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                />
                {inputBusqueda && <ClearButton onClick={limpiarBusqueda}><X size={16} /></ClearButton>}
                <SearchButton onClick={ejecutarBusqueda}><Search size={18} /></SearchButton>
              </SearchBar>
              <FilterGroup>
                <FilterSelect value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value="10">Mostrar 10</option>
                  <option value="20">Mostrar 20</option>
                  <option value="50">Mostrar 50</option>
                  <option value="100">Mostrar 100</option>
                </FilterSelect>
              </FilterGroup>
            </ToolbarLeft>
            {/* OPCIONAL: El bloque ToolbarRight solo se incluye bajo demanda del usuario */}
            <ToolbarRight>
              <IconButton title="Descargar Excel"><Download size={20} /></IconButton>
              <IconButton title="Filtros avanzados"><Filter size={20} /></IconButton>
            </ToolbarRight>
          </Toolbar>

          <TableContainer>
            {[entities].length === 0 ? (
              <EmptyState>
                <AlertCircle size={48} /><EmptyStateTitle>No se encontraron registros</EmptyStateTitle>
              </EmptyState>
            ) : (
              <>
                <TableWrapper>
                  <Table>
                    <thead>
                      <TableRow $isHeader>
                        <TableHeader>Descripción</TableHeader>
                        <TableHeader>Monto</TableHeader>
                        <TableHeader>Fecha</TableHeader>
                        <TableHeader>Acciones</TableHeader>
                      </TableRow>
                    </thead>
                    <tbody>
                      {[entities].map((item) => (
                        <TableRow key={item.id_[entity]}>
                          <TableCell><DescriptionText>{item.descripcion || "Sin descripción"}</DescriptionText></TableCell>
                          <TableCell><MontoText>S/ {parseFloat(item.monto || 0).toFixed(2)}</MontoText></TableCell>
                          <TableCell><DateText>{new Date(item.created_at).toLocaleDateString("es-ES")}</DateText></TableCell>
                          <TableCell>
                            <ActionButtons>
                              <ActionIconButton title="Editar" $color="#10b981" onClick={() => openModal("editar[Entity]", item)}><Edit2 size={16} /></ActionIconButton>
                              <ActionIconButton title="Eliminar" $color="#ef4444" onClick={() => openModal("eliminar[Entity]", item)}><Trash2 size={16} /></ActionIconButton>
                            </ActionButtons>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>

                <PaginationWrapper>
                  <PaginationInfo>Mostrando <strong>{pagination.from}</strong> a <strong>{pagination.to}</strong> de <strong>{pagination.total}</strong> registros</PaginationInfo>
                  <PaginationNav>
                    <PageButton onClick={() => handlePageChange(1)} disabled={pagination.current_page === 1}><ChevronsLeft size={16} /></PageButton>
                    <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={pagination.current_page === 1}><ChevronLeft size={16} /></PageButton>
                    {generatePageNumbers().map((page, index) => (
                      page === "ellipsis-start" || page === "ellipsis-end" 
                      ? <PageEllipsis key={index}>...</PageEllipsis>
                      : <PageButton key={page} className={currentPage === page ? "active" : ""} onClick={() => handlePageChange(page)}>{page}</PageButton>
                    ))}
                    <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={pagination.current_page === pagination.last_page}><ChevronRight size={16} /></PageButton>
                    <PageButton onClick={() => handlePageChange(pagination.last_page)} disabled={pagination.current_page === pagination.last_page}><ChevronsRight size={16} /></PageButton>
                  </PaginationNav>
                </PaginationWrapper>
              </>
            )}
          </TableContainer>
        </Container>
      )}
    </>
  );
}

// ============ STYLED COMPONENTS (Follow Premium Layout) ============
const Container = styled.div` padding: 2rem; background: #f8fafc; min-height: 100vh; @media (max-width: 768px) { padding: 1rem; } `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 2rem; @media (max-width: 768px) { flex-direction: column; } `;
const HeaderLeft = styled.div` flex: 1; `;
const Title = styled.h1` font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; @media (max-width: 768px) { font-size: 1.5rem; } `;
const Subtitle = styled.p` font-size: 1rem; color: #64748b; font-weight: 500; `;
const HeaderRight = styled.div` display: flex; gap: 1rem; `;
const ActionButton = styled.button` 
  display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; 
  background: ${p => p.$primary ? "linear-gradient(135deg, #3b82f6, #2563eb)" : p.$variant === "secondary" ? "linear-gradient(135deg, #10b981, #059669)" : "#ffffff"}; 
  color: ${p => p.$primary || p.$variant === "secondary" ? "#ffffff" : "#0f172a"}; 
  border: ${p => p.$primary || p.$variant === "secondary" ? "none" : "1px solid #e2e8f0"}; 
  border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; 
  box-shadow: ${p => p.$primary ? "0 4px 14px rgba(59, 130, 246, 0.3)" : "0 2px 8px rgba(0,0,0,0.05)"};
  &:hover { transform: translateY(-2px); box-shadow: ${p => p.$primary ? "0 6px 20px rgba(59, 130, 246, 0.4)" : "0 4px 12px rgba(0,0,0,0.1)"}; } 
`;
const Toolbar = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; `;
const ToolbarLeft = styled.div` display: flex; gap: 1rem; flex: 1; flex-wrap: wrap; `;
const SearchBar = styled.div` 
  display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.75rem 1rem; border-radius: 12px; border: 2px solid #e2e8f0; 
  min-width: 300px; flex: 1; max-width: 500px; position: relative; transition: all 0.3s ease;
  &:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;
const SearchInput = styled.input` flex: 1; border: none; outline: none; font-size: 0.95rem; color: #0f172a; font-weight: 500; padding-right: 80px; &::placeholder { color: #94a3b8; } `;
const ClearButton = styled.button` position: absolute; right: 52px; background: #ef4444; border: none; color: white; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; transition: all 0.2s; &:hover { background: #dc2626; } `;
const SearchButton = styled.button` position: absolute; right: 8px; background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; color: white; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; transition: all 0.2s; `;
const FilterGroup = styled.div` display: flex; gap: 0.75rem; `;
const FilterSelect = styled.select` padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; background: white; color: #0f172a; font-size: 0.9rem; font-weight: 600; cursor: pointer; outline: none; transition: all 0.3s ease; &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); } `;

// Estilos Opcionales del Toolbar (Disponibles para usar según requerimiento)
const ToolbarRight = styled.div` display: flex; gap: 0.75rem; `;
const IconButton = styled.button` width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: white; border: 2px solid #e2e8f0; border-radius: 12px; color: #64748b; cursor: pointer; transition: all 0.3s ease; &:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; } `;
const StatsCards = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.875rem; margin-bottom: 1.5rem; `;
const StatCard = styled.div` background: white; padding: 1rem 1.125rem; border-radius: 12px; display: flex; align-items: center; gap: 0.875rem; border: 2px solid #f1f5f9; transition: all 0.3s ease; &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07); border-color: #e2e8f0; } `;
const StatIcon = styled.div` width: 42px; height: 42px; background: ${props => props.$color}15; color: ${props => props.$color}; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; `;
const StatContent = styled.div``;
const StatValue = styled.div` font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 0.2rem; `;
const StatLabel = styled.div` font-size: 0.78rem; color: #64748b; font-weight: 600; `;
const TableContainer = styled.div` background: white; border-radius: 16px; overflow: hidden; border: 2px solid #f1f5f9; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04); `;
const TableWrapper = styled.div` overflow-x: auto; &::-webkit-scrollbar { width: 8px; height: 8px; } &::-webkit-scrollbar-track { background: #f8fafc; } &::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #cbd5e1, #94a3b8); border-radius: 5px; } `;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const TableRow = styled.tr` border-bottom: 1px solid #f1f5f9; transition: background-color 0.2s; ${(props) => props.$isHeader ? `background: linear-gradient(135deg, #3b82f6, #2563eb); color: white;` : `&:hover { background: #f8fafc; }`} `;
const TableHeader = styled.th` padding: 1rem 1.25rem; text-align: left; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; `;
const TableCell = styled.td` padding: 1rem 1.25rem; font-size: 0.875rem; color: #1e293b; vertical-align: middle; `;

// Componentes Semánticos (Genéricos)
const DescriptionText = styled.div` color: #64748b; font-weight: 500; `;
const MontoText = styled.div` color: #10b981; font-weight: 700; `;
const DateText = styled.div` color: #64748b; font-size: 0.78rem; font-weight: 500; white-space: nowrap; `;

const ActionButtons = styled.div` display: flex; gap: 0.5rem; `;
const ActionIconButton = styled.button` width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: ${props => props.$color}10; color: ${props => props.$color}; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; &:hover { background: ${props => props.$color}20; transform: scale(1.1); } `;
const EmptyState = styled.div` padding: 4rem 2rem; text-align: center; color: #94a3b8; `;
const EmptyStateTitle = styled.h3` font-size: 1.25rem; font-weight: 700; color: #64748b; margin: 1rem 0 0.5rem; `;
const PaginationWrapper = styled.div` padding: 16px 24px; background: #f9fafb; border-top: 2px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; `;
const PaginationInfo = styled.div` font-size: 14px; color: #6b7280; strong { color: #111827; } `;
const PaginationNav = styled.div` display: flex; gap: 6px; `;
const PageButton = styled.button` min-width: 40px; height: 40px; border-radius: 10px; border: 2px solid #e5e7eb; background: white; color: #475569; font-weight: 600; cursor: pointer; transition: all 0.2s; &.active { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); } `;
const PageEllipsis = styled.div` padding: 0 10px; color: #94a3b8; display: flex; align-items: center; font-weight: 600; `;

---

## 🟨 Master Registrar: `Registrar[Entity]Form.jsx`

```javascript
import { useRef, useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useCrudContext } from "../../../../context/CrudContext";
import { useNotifications } from "../../../../components/Notificaciones";
import { obtenerMensajeError } from "../../../../utils/obtenerMensajeError";
import { X, Receipt, FileText, DollarSign, Calendar } from "react-icons";
import { registrar[Entity] } from "../../../../services/[entity]/[Entity]Methods";

// PROPS OBLIGATORIAS: { onCerrar }
export function Registrar[Entity]Form({ onCerrar }) {
  const { handleChangeIsUpdated } = useCrudContext();
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    fecha_[entity]: "",
  });

  const [isDisabled, setIsDisable] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const { showError, showSuccess } = useNotifications();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingBtn(true);
    setIsDisable(true);
    try {
      const response = await registrar[Entity](formData);
      if (response.success) {
        showSuccess(response.message);
        handleChangeIsUpdated();
        onCerrar();
      }
    } catch (error) {
      showError(obtenerMensajeError(error));
    } finally {
      setIsLoadingBtn(false);
      setIsDisable(false);
    }
  };

  return ReactDOM.createPortal(
    <Overlay onClick={isDisabled ? undefined : onCerrar}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderContent>
            <IconWrapper><Receipt size={24} /></IconWrapper>
            <HeaderText>
              <Title>Nuevo [Entity]</Title>
              <Subtitle>Complete la información para el registro</Subtitle>
            </HeaderText>
          </HeaderContent>
          <CloseButton onClick={onCerrar} disabled={isDisabled}><X size={20} /></CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormField>
            <Label><FileText size={16} /> Descripción <Required>*</Required></Label>
            <InputWrapper>
              <TextArea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Escriba aquí..." required disabled={isDisabled} rows={3} />
            </InputWrapper>
          </FormField>

          <FormRow>
            <FormField>
              <Label><DollarSign size={16} /> Monto <Required>*</Required></Label>
              <InputWrapper>
                <Input type="number" name="monto" value={formData.monto} onChange={handleInputChange} placeholder="0.00" step="0.01" min="0" required disabled={isDisabled} />
                <CurrencyLabel>S/</CurrencyLabel>
              </InputWrapper>
            </FormField>
            <FormField>
              <Label><Calendar size={16} /> Fecha <Required>*</Required></Label>
              <InputWrapper>
                <Input type="date" name="fecha_[entity]" value={formData.fecha_[entity]} onChange={handleInputChange} required disabled={isDisabled} />
              </InputWrapper>
            </FormField>
          </FormRow>

          <Divider />
          <ButtonContainer>
            <CancelButton type="button" onClick={onCerrar} disabled={isDisabled}>Cancelar</CancelButton>
            <SaveButton type="submit" disabled={isDisabled}>
              {isLoadingBtn ? <><ProgressSpinner /> Registrando...</> : "Registrar [Entity]"}
            </SaveButton>
          </ButtonContainer>
        </Form>
      </Modal>
    </Overlay>,
    document.body
  );
}

// Estilos Premium (Shared with Editar)
const Overlay = styled.div` position: fixed; inset: 0; background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; `;
const Modal = styled.div` background: white; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); `;
const Header = styled.div` padding: 2rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); display: flex; justify-content: space-between; align-items: flex-start; position: relative; `;
const HeaderContent = styled.div` display: flex; gap: 1rem; align-items: center; `;
const IconWrapper = styled.div` width: 48px; height: 48px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; `;
const HeaderText = styled.div` display: flex; flex-direction: column; gap: 0.25rem; `;
const Title = styled.h2` font-size: 1.5rem; font-weight: 700; color: white; margin: 0; `;
const Subtitle = styled.p` font-size: 0.875rem; color: rgba(255, 255, 255, 0.9); margin: 0; `;
const CloseButton = styled.button` width: 36px; height: 36px; border-radius: 10px; border: none; background: rgba(255, 255, 255, 0.2); color: white; cursor: pointer; transition: all 0.2s; &:hover { background: rgba(255, 255, 255, 0.3); transform: rotate(90deg); } `;
const Form = styled.form` padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; &::-webkit-scrollbar { width: 6px; } &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; } `;
const FormRow = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 640px) { grid-template-columns: 1fr; } `;
const FormField = styled.div` display: flex; flex-direction: column; gap: 0.625rem; `;
const Label = styled.label` font-size: 0.875rem; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 0.5rem; `;
const Required = styled.span` color: #ef4444; `;
const InputWrapper = styled.div` position: relative; `;
const Input = styled.input` width: 100%; padding: 0.875rem 1.125rem; border: 2px solid #e5e7eb; border-radius: 12px; font-family: inherit; transition: all 0.3s; &[type="number"] { padding-left: 3rem; } &:focus { border-color: #3b82f6; outline: none; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); } `;
const TextArea = styled.textarea` width: 100%; padding: 0.875rem 1.125rem; border: 2px solid #e5e7eb; border-radius: 12px; font-family: inherit; transition: all 0.3s; resize: vertical; &:focus { border-color: #3b82f6; outline: none; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); } `;
const CurrencyLabel = styled.span` position: absolute; left: 1.125rem; top: 50%; transform: translateY(-50%); font-weight: 600; color: #6b7280; `;
const Divider = styled.div` height: 1px; background: #e5e7eb; margin: 0.5rem 0; `;
const ButtonContainer = styled.div` display: flex; gap: 0.875rem; `;
const Button = styled.button` flex: 1; padding: 0.875rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; border: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; `;
const CancelButton = styled(Button)` background: #f3f4f6; color: #4b5563; border: 2px solid #e5e7eb; &:hover { background: #e5e7eb; transform: translateY(-2px); } `;
const SaveButton = styled(Button)` background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); } `;
const ProgressSpinner = styled.div` width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; @keyframes spin { to { transform: rotate(360deg); } } `;
```

---

## 🟨 Master Editar: `Editar[Entity]Form.jsx`

```javascript
import { useRef, useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useCrudContext } from "../../../../context/CrudContext";
import { useNotifications } from "../../../../components/Notificaciones";
import { obtenerMensajeError } from "../../../../utils/obtenerMensajeError";
import { X, Receipt, FileText, DollarSign, Calendar } from "react-icons";
import { actualizar[Entity] } from "../../../../services/[entity]/[Entity]Methods";

// PROPS OBLIGATORIAS: { onCerrar, [entity] }
export function Editar[Entity]Form({ onCerrar, [entity] }) {
  const { handleChangeIsUpdated } = useCrudContext();
  const [formData, setFormData] = useState({
    id_[entity]: [entity].id_[entity] || "",
    descripcion: [entity].descripcion || "",
    monto: [entity].monto || "",
    fecha_[entity]: [entity].fecha_[entity] || "",
  });

  const [isDisabled, setIsDisable] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const { showError, showSuccess } = useNotifications();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingBtn(true);
    setIsDisable(true);
    try {
      const response = await actualizar[Entity](formData);
      if (response.success) {
        showSuccess(response.message);
        handleChangeIsUpdated();
        onCerrar();
      }
    } catch (error) {
      showError(obtenerMensajeError(error));
    } finally {
      setIsLoadingBtn(false);
      setIsDisable(false);
    }
  };

  return ReactDOM.createPortal(
    <Overlay onClick={isDisabled ? undefined : onCerrar}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderContent>
            <IconWrapper><Receipt size={24} /></IconWrapper>
            <HeaderText>
              <Title>Editar [Entity]</Title>
              <Subtitle>Actualice la información del registro</Subtitle>
            </HeaderText>
          </HeaderContent>
          <CloseButton onClick={onCerrar} disabled={isDisabled}><X size={20} /></CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Mismos campos que RegistrarForm pero vinculados a formData */}
          <FormField>
            <Label><FileText size={16} /> Descripción <Required>*</Required></Label>
            <InputWrapper>
              <TextArea name="descripcion" value={formData.descripcion} onChange={handleInputChange} required disabled={isDisabled} rows={3} />
            </InputWrapper>
          </FormField>

          <FormRow>
            <FormField>
              <Label><DollarSign size={16} /> Monto <Required>*</Required></Label>
              <InputWrapper>
                <Input type="number" name="monto" value={formData.monto} onChange={handleInputChange} step="0.01" min="0" required disabled={isDisabled} />
                <CurrencyLabel>S/</CurrencyLabel>
              </InputWrapper>
            </FormField>
            <FormField>
              <Label><Calendar size={16} /> Fecha <Required>*</Required></Label>
              <InputWrapper>
                <Input type="date" name="fecha_[entity]" value={formData.fecha_[entity]} onChange={handleInputChange} required disabled={isDisabled} />
              </InputWrapper>
            </FormField>
          </FormRow>

          <Divider />
          <ButtonContainer>
            <CancelButton type="button" onClick={onCerrar} disabled={isDisabled}>Cancelar</CancelButton>
            <SaveButton type="submit" disabled={isDisabled}>
              {isLoadingBtn ? <><ProgressSpinner /> Actualizando...</> : "Actualizar [Entity]"}
            </SaveButton>
          </ButtonContainer>
        </Form>
      </Modal>
    </Overlay>,
    document.body
  );
}
// Estilos heredados del template de Registrar
```

---

## 🟨 Master Eliminar: `Eliminar[Entity]Modal.jsx`

```javascript
import { useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useCrudContext } from "../../../../context/CrudContext";
import { useNotifications } from "../../../../components/Notificaciones";
import { obtenerMensajeError } from "../../../../utils/obtenerMensajeError";
import { X, Trash2, AlertTriangle } from "react-icons";
import { eliminar[Entity] } from "../../../../services/[entity]/[Entity]Methods";

// PROPS OBLIGATORIAS: { [entity], onCerrar }
export function Eliminar[Entity]Modal({ [entity], onCerrar }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const { handleChangeIsUpdated } = useCrudContext();
  const { showError, showSuccess } = useNotifications();

  const handleDelete = async () => {
    setIsLoadingBtn(true);
    setIsDisabled(true);
    try {
      const response = await eliminar[Entity]([entity].id_[entity]);
      showSuccess(response?.message || "Registro eliminado correctamente");
      handleChangeIsUpdated();
      onCerrar();
    } catch (error) {
      showError(obtenerMensajeError(error));
    } finally {
      setIsLoadingBtn(false);
      setIsDisabled(false);
    }
  };

  return ReactDOM.createPortal(
    <Overlay onClick={isDisabled ? undefined : onCerrar}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCerrar} disabled={isDisabled}><X size={16} /></CloseButton>
        <Content>
          <IconWarning><Trash2 size={28} /></IconWarning>
          <MessageTitle>¿Eliminar registro?</MessageTitle>
          <ItemInfo>
            <ItemAvatar><AlertTriangle size={16} /></ItemAvatar>
            <ItemDetails>
              <ItemName>{[entity]?.descripcion || "Sin descripción"}</ItemName>
              <ItemMeta>Monto · S/ {Number([entity]?.monto || 0).toFixed(2)}</ItemMeta>
            </ItemDetails>
          </ItemInfo>
          <MessageText>Esta acción es irreversible y no se podrá recuperar la información.</MessageText>
          <ButtonContainer>
            <CancelButton type="button" onClick={onCerrar} disabled={isDisabled}>Cancelar</CancelButton>
            <DeleteButton onClick={handleDelete} disabled={isDisabled}>
              {isLoadingBtn ? <><ProgressSpinner /> Eliminando...</> : "Eliminar"}
            </DeleteButton>
          </ButtonContainer>
        </Content>
      </Modal>
    </Overlay>,
    document.body
  );
}

// Estilos Premium
const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; `;
const Modal = styled.div` background: white; border-radius: 16px; width: 100%; max-width: 360px; overflow: hidden; display: flex; flex-direction: column; position: relative; `;
const CloseButton = styled.button` position: absolute; top: 0.75rem; right: 0.75rem; width: 28px; height: 28px; border-radius: 8px; border: none; background: #f3f4f6; color: #9ca3af; cursor: pointer; `;
const Content = styled.div` padding: 2rem 1.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; `;
const IconWarning = styled.div` width: 60px; height: 60px; border-radius: 50%; background: #fef2f2; border: 2px solid #fecaca; display: flex; align-items: center; justify-content: center; color: #ef4444; `;
const MessageTitle = styled.h3` font-weight: 700; color: #111827; margin: 0; `;
const ItemInfo = styled.div` display: flex; align-items: center; gap: 0.75rem; background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 0.75rem 1rem; width: 100%; text-align: left; `;
const ItemAvatar = styled.div` width: 34px; height: 34px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; `;
const ItemDetails = styled.div` display: flex; flex-direction: column; min-width: 0; `;
const ItemName = styled.div` font-size: 0.875rem; font-weight: 700; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
const ItemMeta = styled.div` font-size: 0.75rem; color: #6b7280; `;
const MessageText = styled.p` font-size: 0.8rem; color: #9ca3af; margin: 0; `;
const ButtonContainer = styled.div` display: flex; gap: 0.625rem; width: 100%; `;
const Button = styled.button` flex: 1; padding: 0.7rem; border-radius: 10px; font-weight: 600; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 0.4rem; `;
const CancelButton = styled(Button)` background: #f3f4f6; color: #4b5563; border: 1.5px solid #e5e7eb; `;
const DeleteButton = styled(Button)` background: linear-gradient(135deg, #ef4444, #dc2626); color: white; box-shadow: 0 3px 10px rgba(239, 68, 68, 0.35); &:hover { transform: translateY(-1px); } `;
const ProgressSpinner = styled.div` width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; `;
```

---

## 🟨 Master Page: `[Entity]Page.jsx`

```javascript
import { useCrudContext } from "../../context/CrudContext";

/* 
   IMPORTAR COMPONENTES (Ubicados en subcarpeta del módulo)
   La IA debe asegurarse de que estas rutas coincidan con la estructura creada.
   Estructura: import { Componente } from "./[modulo]/Componente";
*/
import { Listado[Entity] } from "./[modulo]/Listado[Entity]";
import { Registrar[Entity]Form } from "./[modulo]/Registrar[Entity]Form";
import { Editar[Entity]Form } from "./[modulo]/Editar[Entity]Form";
import { Eliminar[Entity]Modal } from "./[modulo]/Eliminar[Entity]Modal";

export function [Entity]Page() {
  const { modalState, closeModal } = useCrudContext();

  return (
    <>
      {/* VISTA PRINCIPAL: LISTADO */}
      <Listado[Entity] />

      {/* MODAL: REGISTRAR */}
      {modalState.type === "registrar[Entity]" && (
        <Registrar[Entity]Form onCerrar={closeModal} />
      )}

      {/* MODAL: EDITAR */}
      {modalState.type === "editar[Entity]" && (
        <Editar[Entity]Form 
          [entity]={modalState.data} 
          onCerrar={closeModal} 
        />
      )}

      {/* MODAL: ELIMINAR */}
      {modalState.type === "eliminar[Entity]" && (
        <Eliminar[Entity]Modal 
          [entity]={modalState.data} 
          onCerrar={closeModal} 
        />
      )}
    </>
  );
}
```

---

## 🟨 Master Route: `MyRoutes.jsx`

```javascript
/* 
   Instrucción IA: Importar el Orquestador al inicio del archivo MyRoutes.jsx
*/
import { [Entity]Page } from "../features/admin/pages/[Entity]Page.jsx";

/* 
   Instrucción IA: Inyectar la ruta dentro del bloque <RoleBasedRoute allowedRoles={["admin", "gerente"]}> 
   (O buscar el lugar apropiado según jerarquía solicitada).
*/
<Route path="/[entities-kebab-case]" element={<[Entity]Page />} />
```
