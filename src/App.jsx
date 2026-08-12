import { useState, useMemo, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import "./styles/global.css";

import { useLocalStorage, safeSet } from "./hooks/useLocalStorage";
import { C0 } from "./data/contacts";
import { A0 } from "./data/activities";
import { BLANK_C, BLANK_A, BLANK_LEAD } from "./constants/blanks";
import { iso2br, br2iso, fmtD, todayBR } from "./utils/date";

import { uniqueId } from "./utils/helpers";

import { Login, Sidebar } from "./components/layout";
import { Dashboard, Contacts, Activities, CalendarView, Leads } from "./components/sections";
import {
  ContactModal,
  ActivityModal,
  ImportModal,
  ExpModal,
  FinanceModal,
  LeadModal,
} from "./components/modals";

export default function GestaoFacil() {
  const [page, setPage] = useState("login");
  const [sidebar, setSide] = useState(true);
  const [loading, setLoading] = useState(false);

  const [contacts, setContacts] = useLocalStorage("gf-contacts", C0);
  const [activities, setActivities] = useLocalStorage("gf-activities", A0);
  const [leads, setLeads] = useLocalStorage("gf-leads", []);

  const [cCatFil, setCCatFil] = useState("all");
  const [aFil, setAFil] = useState("all");

  const [cModal, setCModal] = useState(null);
  const [aModal, setAModal] = useState(null);
  const [lModal, setLModal] = useState(null);
  const [mImp, setMImp] = useState(false);
  const [mExp, setMExp] = useState(null);
  const [mFin, setMFin] = useState(null);

  const [lastBackupTs, setLastBackupTs] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("gf-lastBackup");
      if (raw) setLastBackupTs(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const backupDue = useMemo(() => {
    return !lastBackupTs || Date.now() - new Date(lastBackupTs).getTime() > 7 * 24 * 60 * 60 * 1000;
  }, [lastBackupTs]);

  useEffect(() => {
    if (page === "login") return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 520);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    if (page === "login" || !backupDue) return;
    const t = setTimeout(() => doBackup(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, backupDue]);

  // ── CONTACTS ──────────────────────────────────────────────
  const saveC = useCallback(() => {
    if (!cModal?.name?.trim()) return;
    const item = { ...cModal, name: cModal.name.trim() };
    if (!item.id) item.id = uniqueId();
    setContacts((p) =>
      cModal.id ? p.map((c) => (c.id === cModal.id ? item : c)) : [...p, item]
    );
    setCModal(null);
  }, [cModal, setContacts]);

  const delC = useCallback(
    (id) => {
      setContacts((p) => p.filter((c) => c.id !== id));
      setCModal(null);
    },
    [setContacts]
  );

  // ── ACTIVITIES ────────────────────────────────────────────
  const deriveActivityDates = (types, typeSchedules) => {
    let derivedStart = "";
    let derivedEnd = "";
    let derivedStartTime = "";
    let derivedEndTime = "";
    let derivedFormat = "";

    for (const t of types) {
      const s = typeSchedules[t] || {};
      if (!derivedFormat && s.format) derivedFormat = s.format;

      if (t === "Curso Avançado Online 10h" && s.format === "Presencial") {
        const ds = (s.dates || []).filter((d) => d.date);
        if (ds.length) {
          if (!derivedStart) {
            derivedStart = iso2br(ds[0].date);
            derivedStartTime = ds[0].startTime || "";
          }
          derivedEnd = iso2br(ds[ds.length - 1].date);
          derivedEndTime = ds[ds.length - 1].endTime || "";
        }
      } else {
        if (s.startDate && !derivedStart) {
          derivedStart = iso2br(s.startDate);
          derivedStartTime = s.startTime || "";
        }
        if (s.startDate) {
          derivedEnd = iso2br(s.endDate || s.startDate);
          derivedEndTime = s.endTime || "";
        }
      }
    }

    return { derivedStart, derivedEnd, derivedStartTime, derivedEndTime, derivedFormat };
  };

  const saveA = useCallback(() => {
    const types = aModal?.types || [];
    if (!types.length) return;

    const scheds = aModal.typeSchedules || {};
    const { derivedStart, derivedEnd, derivedStartTime, derivedEndTime, derivedFormat } =
      deriveActivityDates(types, scheds);

    const totalValue = types.reduce((s, t) => s + (parseFloat(scheds[t]?.value) || 0), 0);
    const firstTax = parseFloat(scheds[types[0]]?.tax) || parseFloat(aModal.tax) || 10;

    const matchedContact = contacts.find((c) => c.name === aModal.client);
    const clientCategory = aModal.clientCategory || matchedContact?.category || "";

    const item = {
      ...aModal,
      types,
      type: types[0],
      clientCategory,
      value: totalValue || parseFloat(aModal.value) || 0,
      tax: firstTax,
      startDate: derivedStart || fmtD(aModal.startDate || "") || "",
      endDate: derivedEnd || derivedStart || fmtD(aModal.endDate || "") || derivedStart || "",
      startTime: derivedStartTime || aModal.startTime || "",
      endTime: derivedEndTime || aModal.endTime || "",
      format: derivedFormat || aModal.format || "Presencial",
    };

    if (!item.id) item.id = uniqueId();

    setActivities((p) =>
      aModal.id
        ? p.map((a) => (a.id === aModal.id ? { ...item, expenses: a.expenses || [] } : a))
        : [...p, { ...item, expenses: [] }]
    );

    if (item.client?.trim()) {
      setContacts((prev) => {
        const exists = prev.some(
          (c) => c.name.trim().toLowerCase() === item.client.trim().toLowerCase()
        );
        if (exists) return prev;
        return [
          ...prev,
          {
            id: uniqueId(),
            name: item.client.trim(),
            contactName: "",
            category: item.clientCategory || "Privado",
            email: "",
            phone: "",
            whatsapp: "",
            city: item.city || "",
            state: item.state || "",
            notes: "",
            departments: [],
            pagRazaoSocial: "",
            pagName: "",
            pagEmail: "",
            pagWhatsapp: "",
            pagPhone: "",
            pagEndereco: "",
            pagCNPJ: "",
            pagInscMunicipal: "",
            pagInscEstadual: "",
          },
        ];
      });
    }

    setAModal(null);
  }, [aModal, setActivities, setContacts, contacts]);

  const delA = useCallback(
    (id) => {
      setActivities((p) => p.filter((a) => a.id !== id));
      setAModal(null);
    },
    [setActivities]
  );

  const openA = useCallback((a) => {
    setAModal({
      ...a,
      types: a.types && a.types.length > 0 ? a.types : a.type ? [a.type] : [],
      value: String(a.value),
      tax: String(a.tax),
      startDate: br2iso(a.startDate),
      endDate: br2iso(a.endDate),
    });
  }, []);

  const saveExp = useCallback(
    (actId, items) => {
      setActivities((p) => p.map((a) => (a.id === actId ? { ...a, expenses: items } : a)));
    },
    [setActivities]
  );

  // ── LEADS ─────────────────────────────────────────────────
  const saveLead = useCallback(() => {
    if (!lModal?.organization?.trim()) return;

    const existing = leads.find((l) => l.id === lModal.id);
    const history = lModal.statusHistory || [];
    let newHistory = [...history];

    if (!lModal.id) {
      newHistory = [{ status: lModal.status, date: todayBR() }];
    } else if (existing && existing.status !== lModal.status) {
      newHistory = [...newHistory, { status: lModal.status, date: todayBR() }];
    }

    const item = {
      ...lModal,
      organization: lModal.organization.trim(),
      id: lModal.id || uniqueId(),
      statusHistory: newHistory,
    };

    setLeads((prev) =>
      lModal.id ? prev.map((l) => (l.id === item.id ? item : l)) : [...prev, item]
    );
    setLModal(null);
  }, [lModal, leads, setLeads]);

  const convertLeadToActivity = useCallback(
    (lead) => {
      const newActivity = {
        id: uniqueId(),
        types: [],
        type: "",
        format: "Presencial",
        client: lead.organization || "",
        clientCategory: "",
        department: "",
        departmentContact: "",
        paymentName: "",
        paymentEmail: "",
        paymentWhatsapp: "",
        paymentPhone: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        city: "",
        state: "",
        status: "Proposta Enviada",
        value: 0,
        tax: 10,
        expenses: [],
        notes: lead.notes || "",
      };

      setActivities((p) => [...p, newActivity]);
      setLeads((p) => p.map((l) => (l.id === lead.id ? { ...l, status: "Proposta Enviada" } : l)));
      setLModal(null);
      setAModal({ ...newActivity, value: "", tax: "10", startDate: "", endDate: "" });
      setPage("activities");
    },
    [setActivities, setLeads]
  );

  const saveLeadAndConvert = useCallback(() => {
    if (!lModal?.organization?.trim()) return;

    const history = lModal.statusHistory || [];
    let newHistory = [...history];

    if (!lModal.id) {
      newHistory = [
        { status: "Aguardando Proposta", date: todayBR() },
        { status: "Proposta Enviada", date: todayBR() },
      ];
    } else {
      const existing = leads.find((l) => l.id === lModal.id);
      if (existing && existing.status !== "Proposta Enviada") {
        newHistory = [...newHistory, { status: "Proposta Enviada", date: todayBR() }];
      }
    }

    const item = {
      ...lModal,
      organization: lModal.organization.trim(),
      status: "Proposta Enviada",
      id: lModal.id || uniqueId(),
      statusHistory: newHistory,
    };

    setLeads((prev) =>
      lModal.id ? prev.map((l) => (l.id === item.id ? item : l)) : [...prev, item]
    );
    setLModal(null);
    convertLeadToActivity(item);
  }, [lModal, leads, setLeads, convertLeadToActivity]);

  const delLead = useCallback(
    (id) => {
      setLeads((p) => p.filter((l) => l.id !== id));
      setLModal(null);
    },
    [setLeads]
  );

  // ── BACKUP ────────────────────────────────────────────────
  const doBackup = useCallback(() => {
    const ws1 = XLSX.utils.json_to_sheet(
      contacts.map((ct) => ({
        Organização: ct.name,
        Responsável: ct.contactName,
        Categoria: ct.category,
        "E-mail": ct.email,
        Telefone: ct.phone,
        WhatsApp: ct.whatsapp,
        Cidade: ct.city,
        UF: ct.state,
        Observações: ct.notes,
        "Razão Social": ct.pagRazaoSocial || "",
        "Pag. Nome": ct.pagName || "",
        "Pag. E-mail": ct.pagEmail || "",
        "Pag. WhatsApp": ct.pagWhatsapp || "",
        CNPJ: ct.pagCNPJ || "",
        "Insc. Municipal": ct.pagInscMunicipal || "",
        "Insc. Estadual": ct.pagInscEstadual || "",
        Endereço: ct.pagEndereco || "",
      }))
    );

    const ws2 = XLSX.utils.json_to_sheet(
      activities.map((a) => ({
        Modalidade: a.type,
        Formato: a.format,
        Cliente: a.client,
        "Data Início": a.startDate,
        "Data Fim": a.endDate,
        Horário: a.startTime + "-" + a.endTime,
        Cidade: a.city,
        UF: a.state,
        Status: a.status,
        Valor: a.value,
        Despesas: (a.expenses || []).reduce((s, e) => s + (parseFloat(e.valor) || 0), 0),
        Observações: a.notes,
      }))
    );

    const ws3 = XLSX.utils.json_to_sheet(
      leads.map((l) => ({
        Organização: l.organization,
        Contato: l.contactName,
        Canal: l.canal,
        Status: l.status,
        "Data Início": l.startDate,
        "Follow-up": l.followUp,
        Anotações: l.notes,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Contatos");
    XLSX.utils.book_append_sheet(wb, ws2, "Atividades");
    XLSX.utils.book_append_sheet(wb, ws3, "Em Conversa");

    const d = new Date();
    XLSX.writeFile(
      wb,
      `backup-gestao-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}.xlsx`
    );

    const iso = d.toISOString();
    safeSet("gf-lastBackup", iso);
    setLastBackupTs(iso);
  }, [contacts, activities, leads]);

  // ── RENDER ────────────────────────────────────────────────
  if (page === "login") {
    return <Login onLogin={() => setPage("dashboard")} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f2f3f5",
        fontFamily: "'Inter',system-ui,sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar
        page={page}
        onNavigate={setPage}
        sidebar={sidebar}
        onToggle={() => setSide((s) => !s)}
        onLogout={() => setPage("login")}
      />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 28,
          minWidth: 0,
        }}
      >
        {page === "dashboard" && (
          <Dashboard
            activities={activities}
            loading={loading}
            backupDue={backupDue}
            onBackup={doBackup}
            onOpenActivity={openA}
            onActivityStatusChange={(id, st) => {
              setActivities((p) => p.map((a) => (a.id === id ? { ...a, status: st } : a)));
              setAFil("all");
            }}
            onNavigateActivities={() => setPage("activities")}
          />
        )}

        {page === "contacts" && (
          <Contacts
            contacts={contacts}
            loading={loading}
            categoryFilter={cCatFil}
            onCategoryFilterChange={setCCatFil}
            onNew={() => setCModal({ ...BLANK_C })}
            onEdit={(ct) => setCModal({ ...ct })}
            onFinances={(ct) => setMFin(ct)}
            onImport={() => setMImp(true)}
          />
        )}

        {page === "activities" && (
          <Activities
            activities={activities}
            loading={loading}
            statusFilter={aFil}
            onStatusFilterChange={setAFil}
            onNew={() => setAModal({ ...BLANK_A })}
            onOpen={openA}
            onExpenses={(a) => setMExp(a)}
          />
        )}

        {page === "calendar" && (
          <CalendarView
            activities={activities}
            onNew={() => setAModal({ ...BLANK_A })}
            onOpen={openA}
          />
        )}

        {page === "leads" && (
          <Leads
            leads={leads}
            onNew={() => setLModal({ ...BLANK_LEAD })}
            onEdit={(l) => setLModal({ ...l })}
          />
        )}
      </main>

      <ImportModal
        show={mImp}
        onClose={() => setMImp(false)}
        onImport={(rows) =>
          setContacts((p) => {
            const existingNames = new Set(p.map((c) => c.name.trim().toLowerCase()));
            const newRows = rows.filter((r) => !existingNames.has(r.name.trim().toLowerCase()));
            return [...p, ...newRows];
          })
        }
      />
      <ExpModal
        show={!!mExp}
        activity={mExp}
        onClose={() => setMExp(null)}
        onSave={saveExp}
      />
      <FinanceModal
        show={!!mFin}
        contact={mFin}
        onClose={() => setMFin(null)}
        onEdit={(ct) => setCModal({ ...ct })}
      />
      <ContactModal
        show={!!cModal}
        contact={cModal}
        onClose={() => setCModal(null)}
        onChange={setCModal}
        onSave={saveC}
        onDelete={delC}
      />
      <LeadModal
        lead={lModal}
        onClose={() => setLModal(null)}
        onChange={setLModal}
        onSave={saveLead}
        onSaveAndConvert={saveLeadAndConvert}
        onDelete={delLead}
      />
      <ActivityModal
        activity={aModal}
        contacts={contacts}
        onClose={() => setAModal(null)}
        onChange={setAModal}
        onSave={saveA}
        onDelete={delA}
      />
    </div>
  );
}
