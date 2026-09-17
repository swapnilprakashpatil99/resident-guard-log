import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ClipboardList,
  Clock3,
  LogOut,
  MapPin,
  Menu,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
  Wifi,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gatehouse Visitor Log" },
      {
        name: "description",
        content: "A high-contrast visitor entry and approval console for residential society gate teams.",
      },
      { property: "og:title", content: "Gatehouse Visitor Log" },
      {
        property: "og:description",
        content: "Log visitors, request resident approval, and review today's gate activity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gatehouse,
});

type Tab = "new" | "log" | "manual";
type EntryStatus = "Pending" | "Approved" | "Denied" | "Manual";
type Purpose = "Guest" | "Delivery" | "Cab / Taxi" | "Service Staff" | "Courier" | "Other";

type Entry = {
  id: number;
  visitor: string;
  flat: string;
  purpose: Purpose;
  time: string;
  status: EntryStatus;
  phone?: string;
  photo?: string;
  note?: string;
};

const flats = Array.from({ length: 50 }, (_, index) => {
  const tower = String.fromCharCode(65 + Math.floor(index / 10));
  const floor = Math.floor(index / 10) + 1;
  const unit = String((index % 10) + 1).padStart(2, "0");
  return `${tower}-${floor}${unit}`;
});

const purposes: Purpose[] = ["Guest", "Delivery", "Cab / Taxi", "Service Staff", "Courier", "Other"];

const initialEntries: Entry[] = [
  {
    id: 1,
    visitor: "Priya Menon",
    flat: "B-201",
    purpose: "Service Staff",
    time: "09:12",
    status: "Approved",
    phone: "98765 12480",
    note: "Resident approved entry from the app.",
  },
  {
    id: 2,
    visitor: "Unknown Cab",
    flat: "A-304",
    purpose: "Cab / Taxi",
    time: "08:47",
    status: "Denied",
    phone: "99887 44321",
    note: "Resident did not approve this visit.",
  },
  {
    id: 3,
    visitor: "Swiggy Rider",
    flat: "C-101",
    purpose: "Courier",
    time: "08:20",
    status: "Manual",
    phone: "98220 11881",
    note: "Known delivery handed over at the gate.",
  },
  {
    id: 4,
    visitor: "Rohit Sharma",
    flat: "A-101",
    purpose: "Delivery",
    time: "08:05",
    status: "Pending",
    phone: "98980 4521",
    note: "Waiting for resident response.",
  },
];

const defaultActiveStatus: Entry = {
  id: 4,
  visitor: "Rohit Sharma",
  flat: "A-101",
  purpose: "Delivery",
  time: "08:05",
  status: "Pending",
  phone: "98980 4521",
  note: "Waiting for resident response.",
};

const statusCopy: Record<EntryStatus, { label: string; detail: string }> = {
  Pending: { label: "Pending", detail: "Waiting for resident approval" },
  Approved: { label: "Approved", detail: "Entry Allowed" },
  Denied: { label: "Denied", detail: "Entry Denied" },
  Manual: { label: "Manual", detail: "Manual Entry · Unverified" },
};

function Gatehouse() {
  const [hydrated, setHydrated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(window.localStorage.getItem("gatehouse-session") === "active");
    setHydrated(true);
    void navigator.serviceWorker?.register("/sw.js");
  }, []);

  if (!hydrated) {
    return <div className="min-h-screen bg-app-bg" aria-label="Loading gatehouse" />;
  }

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return <GatehouseConsole onLogout={() => setLoggedIn(false)} />;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState("9876543210");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (phone.replace(/\D/g, "").length < 10 || pin.length !== 4) {
      setError("Enter a 10-digit phone number and 4-digit PIN.");
      return;
    }
    window.localStorage.setItem("gatehouse-session", "active");
    onLogin();
  };

  const addPinDigit = (digit: string) => {
    setError("");
    setPin((current) => (current.length < 4 ? `${current}${digit}` : current));
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-app-bg px-5 py-8 text-app-foreground">
      <div className="w-full max-w-[520px]">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-app-brand/15 text-app-brand-light ring-1 ring-app-brand/30">
              <ShieldCheck className="size-7" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight">Gatehouse</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-app-muted">Security console</p>
            </div>
          </div>
          <div className="rounded-full bg-app-ok/10 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-app-ok ring-1 ring-app-ok/25">
            <Wifi className="mr-1 inline size-3.5" /> Ready
          </div>
        </div>

        <section className="rounded-[28px] bg-app-surface/80 p-5 shadow-2xl shadow-black/40 ring-1 ring-app-line sm:p-7">
          <div className="mb-7">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-app-brand-light">Guard login</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-app-foreground">Start your shift</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-app-muted">Sign in once on this gate tablet. Your session stays active between checks.</p>
          </div>

          <label className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-app-muted" htmlFor="phone">
            Guard phone number
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-app-bg px-4 ring-1 ring-app-line focus-within:ring-2 focus-within:ring-app-brand">
            <Smartphone className="size-5 text-app-brand-light" />
            <input
              id="phone"
              inputMode="numeric"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
              className="min-w-0 flex-1 bg-transparent text-lg font-semibold tracking-[0.12em] text-app-foreground outline-none placeholder:text-app-muted"
              placeholder="10 digit number"
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <label className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-app-muted">4-digit PIN</label>
            <span className="font-mono text-[11px] text-app-muted">Numeric keypad</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="grid h-14 place-items-center rounded-2xl bg-app-bg text-xl font-bold text-app-foreground ring-1 ring-app-line">
                {pin[index] ? "•" : <span className="size-2 rounded-full bg-app-line" />}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map((key) => (
              <Button
                key={key}
                type="button"
                variant="ghost"
                onClick={() => (key === "clear" ? setPin("") : key === "back" ? setPin((current) => current.slice(0, -1)) : addPinDigit(key))}
                className="h-14 rounded-2xl bg-app-bg text-lg font-bold text-app-foreground ring-1 ring-app-line hover:bg-app-brand/15 hover:text-app-brand-light"
              >
                {key === "clear" ? "Clear" : key === "back" ? "⌫" : key}
              </Button>
            ))}
          </div>

          {error && <p className="mt-4 rounded-xl bg-app-bad/10 px-3 py-3 text-sm font-semibold text-app-bad ring-1 ring-app-bad/25">{error}</p>}

          <Button type="button" onClick={handleLogin} className="mt-5 h-14 w-full rounded-2xl bg-app-brand text-base font-bold text-app-brand-foreground shadow-xl shadow-app-brand/20 hover:bg-app-brand-light hover:text-app-bg">
            Enter Main Gate <ArrowLeft className="size-5 rotate-180" />
          </Button>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-app-muted">Main Gate · Shift A</p>
        </section>
      </div>
    </main>
  );
}

function GatehouseConsole({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const [online, setOnline] = useState(true);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [activeStatus, setActiveStatus] = useState<Entry>(defaultActiveStatus);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [logSearch, setLogSearch] = useState("");
  const [manualDialogOpen, setManualDialogOpen] = useState(false);

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  const addEntry = (entry: Entry) => {
    setEntries((current) => [entry, ...current]);
    setActiveStatus(entry);
  };

  const updateStatus = (status: EntryStatus) => {
    setActiveStatus((current) => ({ ...current, status }));
    setEntries((current) => current.map((entry) => (entry.id === activeStatus.id ? { ...entry, status } : entry)));
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-foreground">
      <header className="sticky top-0 z-30 border-b border-app-line bg-app-bg/95 px-4 pb-3 pt-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-app-brand/15 text-app-brand-light ring-1 ring-app-brand/30">
              <ShieldCheck className="size-6" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-app-foreground">Main Gate · Shift A</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-app-muted">Arjun K. · On duty · Gate 03</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider ring-1 ${online ? "bg-app-ok/10 text-app-ok ring-app-ok/25" : "bg-app-warn/10 text-app-warn ring-app-warn/30"}`} aria-label={online ? "Online" : "Offline"}>
              {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
              {online ? "Online" : "Offline"}
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onLogout} aria-label="Sign out" className="size-10 rounded-xl text-app-muted hover:bg-app-bad/10 hover:text-app-bad">
              <LogOut className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-32 pt-5 sm:px-6">
        {activeTab === "new" && <NewEntryScreen onEntryAdded={addEntry} activeStatus={activeStatus} onStatusChange={updateStatus} online={online} />}
        {activeTab === "log" && <LogScreen entries={entries} search={logSearch} onSearch={setLogSearch} expandedId={expandedId} onExpand={setExpandedId} />}
        {activeTab === "manual" && <ManualEntryScreen onEntryAdded={addEntry} onOpenConfirm={() => setManualDialogOpen(true)} onCloseConfirm={() => setManualDialogOpen(false)} dialogOpen={manualDialogOpen} />}
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function ScreenHeading({ eyebrow, title, detail, icon }: { eyebrow: string; title: string; detail: string; icon: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-app-brand-light">{eyebrow}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-app-foreground">{title}</h1>
        <p className="mt-1 text-sm leading-6 text-app-muted">{detail}</p>
      </div>
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-app-brand/10 text-app-brand-light ring-1 ring-app-brand/25">{icon}</div>
    </div>
  );
}

function NewEntryScreen({ onEntryAdded, activeStatus, onStatusChange, online }: { onEntryAdded: (entry: Entry) => void; activeStatus: Entry; onStatusChange: (status: EntryStatus) => void; online: boolean }) {
  const [flatQuery, setFlatQuery] = useState("A-101");
  const [visitor, setVisitor] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("Delivery");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const flatSuggestions = useMemo(() => flats.filter((flat) => flat.toLowerCase().includes(flatQuery.toLowerCase())).slice(0, 5), [flatQuery]);

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPhotoUrl(URL.createObjectURL(file));
  };

  const submit = () => {
    if (!flatQuery || !visitor.trim()) {
      setError("Select a flat and enter the visitor name before sending.");
      return;
    }
    const entry: Entry = {
      id: Date.now(),
      visitor: visitor.trim(),
      flat: flatQuery,
      purpose,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "Pending",
      note: "Sent for resident approval from Main Gate.",
      ...(phone ? { phone } : {}),
      ...(photoUrl ? { photo: photoUrl } : {}),
    };
    onEntryAdded(entry);
    setError(online ? "Request sent. Watch the status below." : "Saved on this tablet. It will sync when online.");
    setVisitor("");
    setPhone("");
    setPhotoUrl("");
  };

  return (
    <div>
      <ScreenHeading eyebrow="Gate 03 · Home" title="New visitor entry" detail="Log a visitor and request resident approval." icon={<Plus className="size-6" />} />

      <section className="rounded-[28px] bg-app-surface/75 p-4 shadow-2xl shadow-black/30 ring-1 ring-app-line sm:p-5">
        <div>
          <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-app-muted" htmlFor="flat-search">Flat number</label>
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-app-bg px-4 ring-1 ring-app-line focus-within:ring-2 focus-within:ring-app-brand">
            <MapPin className="size-5 text-app-brand-light" />
            <input id="flat-search" value={flatQuery} onChange={(event) => setFlatQuery(event.target.value.toUpperCase())} className="min-w-0 flex-1 bg-transparent font-mono text-xl font-bold tracking-[0.12em] text-app-foreground outline-none placeholder:text-app-muted" placeholder="A-101" autoComplete="off" />
            <Search className="size-5 text-app-muted" />
          </div>
          {flatSuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2" aria-label="Flat suggestions">
              {flatSuggestions.map((flat) => (
                <Button key={flat} type="button" variant="ghost" onClick={() => setFlatQuery(flat)} className={`h-11 rounded-xl px-3 font-mono text-sm font-bold ring-1 ${flat === flatQuery ? "bg-app-brand/20 text-app-brand-light ring-app-brand/40" : "bg-app-bg text-app-muted ring-app-line hover:text-app-brand-light"}`}>
                  {flat}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Visitor name" htmlFor="visitor-name">
            <input id="visitor-name" value={visitor} onChange={(event) => setVisitor(event.target.value)} className="field-input" placeholder="Full name" />
          </Field>
          <Field label="Phone · optional" htmlFor="visitor-phone">
            <input id="visitor-phone" type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} className="field-input font-mono" placeholder="10 digit number" />
          </Field>
        </div>

        <div className="mt-4">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-app-muted">Purpose</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {purposes.map((option) => (
              <Button key={option} type="button" variant="ghost" aria-pressed={purpose === option} onClick={() => setPurpose(option)} className={`min-h-12 rounded-xl px-3 text-sm font-bold ring-1 ${purpose === option ? "bg-app-brand text-app-brand-foreground ring-app-brand" : "bg-app-bg text-app-muted ring-app-line hover:text-app-brand-light"}`}>
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-app-bg/70 p-3 ring-1 ring-app-line">
          {photoUrl ? <img src={photoUrl} alt="Visitor preview" className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-app-brand/40" /> : <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-app-brand/10 text-app-brand-light ring-1 ring-app-brand/25"><Camera className="size-7" /></div>}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-app-foreground">{photoUrl ? "Photo ready" : "Capture visitor photo"}</p>
            <p className="mt-1 text-xs leading-5 text-app-muted">{photoUrl ? "Preview attached to this entry." : "Use the device camera before sending."}</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="sr-only" />
          <Button type="button" variant="ghost" onClick={() => fileRef.current?.click()} className="h-12 shrink-0 rounded-xl bg-app-brand/15 px-4 font-bold text-app-brand-light ring-1 ring-app-brand/30 hover:bg-app-brand/25">
            <Camera className="size-5" /> Capture
          </Button>
        </div>

        {error && <p className={`mt-4 rounded-xl px-3 py-3 text-sm font-semibold ring-1 ${error.includes("sent") || error.includes("sync") ? "bg-app-ok/10 text-app-ok ring-app-ok/25" : "bg-app-bad/10 text-app-bad ring-app-bad/25"}`} aria-live="polite">{error}</p>}

        <Button type="button" onClick={submit} className="mt-4 h-16 w-full rounded-2xl bg-app-brand text-base font-bold text-app-brand-foreground shadow-xl shadow-app-brand/20 hover:bg-app-brand-light hover:text-app-bg">
          <Check className="size-5" /> Send for approval
        </Button>
      </section>

      <StatusCard entry={activeStatus} onStatusChange={onStatusChange} />
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-app-muted" htmlFor={htmlFor}>{label}</label>{children}</div>;
}

function StatusCard({ entry, onStatusChange }: { entry: Entry; onStatusChange: (status: EntryStatus) => void }) {
  const status = entry.status;
  const isPending = status === "Pending";
  const shell = status === "Approved" ? "bg-app-ok/10 ring-app-ok/30" : status === "Denied" ? "bg-app-bad/10 ring-app-bad/30" : "bg-app-warn/10 ring-app-warn/30";
  const accent = status === "Approved" ? "text-app-ok" : status === "Denied" ? "text-app-bad" : "text-app-warn";
  return (
    <section className={`mt-4 rounded-[28px] p-5 shadow-xl shadow-black/20 ring-1 ${shell}`} aria-live="polite">
      <div className="flex items-start gap-4">
        <div className={`relative grid size-14 shrink-0 place-items-center rounded-full ring-1 ${status === "Approved" ? "bg-app-ok/15 ring-app-ok/30" : status === "Denied" ? "bg-app-bad/15 ring-app-bad/30" : "bg-app-warn/15 ring-app-warn/30"}`}>
          {isPending && <span className="status-pulse absolute inset-0 rounded-full bg-app-warn/25" />}
          {status === "Approved" ? <CheckCircle2 className={`relative size-7 ${accent}`} /> : status === "Denied" ? <XCircle className={`relative size-7 ${accent}`} /> : <Clock3 className={`relative size-7 ${accent}`} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-app-foreground">{status === "Pending" ? `Waiting for approval from ${entry.flat}` : statusCopy[status].detail}</p>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-app-muted">{entry.visitor} · {entry.purpose} · {entry.flat}</p>
        </div>
      </div>
      {isPending && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" variant="ghost" onClick={() => onStatusChange("Approved")} className="h-12 rounded-xl bg-app-ok/15 font-bold text-app-ok ring-1 ring-app-ok/30 hover:bg-app-ok/25"><Check className="size-5" /> Allow entry</Button>
          <Button type="button" variant="ghost" onClick={() => onStatusChange("Denied")} className="h-12 rounded-xl bg-app-bad/15 font-bold text-app-bad ring-1 ring-app-bad/30 hover:bg-app-bad/25"><X className="size-5" /> Deny entry</Button>
        </div>
      )}
      {status === "Approved" && <p className="mt-4 rounded-xl bg-app-ok/15 px-3 py-3 text-center text-sm font-bold text-app-ok ring-1 ring-app-ok/25">Entry Allowed · Resident approved</p>}
      {status === "Denied" && <p className="mt-4 rounded-xl bg-app-bad/15 px-3 py-3 text-center text-sm font-bold text-app-bad ring-1 ring-app-bad/25">Entry Denied · Do not allow entry</p>}
    </section>
  );
}

function StatusBadge({ status }: { status: EntryStatus }) {
  const styles = status === "Approved" ? "bg-app-ok/15 text-app-ok ring-app-ok/30" : status === "Denied" ? "bg-app-bad/15 text-app-bad ring-app-bad/30" : status === "Manual" ? "bg-app-brand/15 text-app-brand-light ring-app-brand/30" : "bg-app-warn/15 text-app-warn ring-app-warn/30";
  return <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ring-1 ${styles}`}>{statusCopy[status].label}</span>;
}

function LogScreen({ entries, search, onSearch, expandedId, onExpand }: { entries: Entry[]; search: string; onSearch: (value: string) => void; expandedId: number | null; onExpand: (id: number | null) => void }) {
  const filteredEntries = entries.filter((entry) => `${entry.visitor} ${entry.flat}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <ScreenHeading eyebrow="Gate 03 · Activity" title="Today's log" detail={`${entries.length} entries recorded this shift. Tap a row for details.`} icon={<ClipboardList className="size-6" />} />
      <div className="mb-4 flex h-14 items-center gap-3 rounded-2xl bg-app-surface/75 px-4 ring-1 ring-app-line focus-within:ring-2 focus-within:ring-app-brand">
        <Search className="size-5 text-app-brand-light" />
        <input value={search} onChange={(event) => onSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-semibold text-app-foreground outline-none placeholder:text-app-muted" placeholder="Search flat or visitor name" aria-label="Search today's log" />
        {search && <Button type="button" variant="ghost" size="icon" onClick={() => onSearch("")} aria-label="Clear search" className="size-9 rounded-lg text-app-muted hover:text-app-foreground"><X className="size-4" /></Button>}
      </div>
      <div className="space-y-2">
        {filteredEntries.map((entry) => {
          const expanded = expandedId === entry.id;
          return <div key={entry.id} className={`overflow-hidden rounded-2xl ring-1 ${expanded ? "bg-app-surface ring-app-brand/40" : "bg-app-surface/65 ring-app-line"}`}>
            <Button type="button" variant="ghost" onClick={() => onExpand(expanded ? null : entry.id)} className="flex h-auto min-h-[76px] w-full items-center gap-3 rounded-none px-3 py-3 text-left hover:bg-app-brand/10">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-app-bg font-mono text-xs font-bold text-app-foreground ring-1 ring-app-line">{entry.flat}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-app-foreground">{entry.visitor}</p>
                <p className="mt-1 truncate text-xs text-app-muted">{entry.purpose} · {entry.time}</p>
              </div>
              <StatusBadge status={entry.status} />
              {expanded ? <ChevronUp className="size-5 shrink-0 text-app-muted" /> : <ChevronDown className="size-5 shrink-0 text-app-muted" />}
            </Button>
            {expanded && <div className="border-t border-app-line px-3 pb-4 pt-3">
              <div className="grid gap-3 sm:grid-cols-[88px_1fr]">
                {entry.photo ? <img src={entry.photo} alt={`${entry.visitor} visitor photo`} className="h-20 w-[88px] rounded-xl object-cover ring-1 ring-app-brand/30" /> : <div className="grid h-20 w-[88px] place-items-center rounded-xl bg-app-bg text-app-muted ring-1 ring-app-line"><UserRound className="size-7" /></div>}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Detail label="Flat" value={entry.flat} />
                  <Detail label="Time" value={entry.time} />
                  <Detail label="Phone" value={entry.phone || "Not provided"} />
                  <Detail label="Purpose" value={entry.purpose} />
                  <div className="col-span-2"><Detail label="Note" value={entry.note || "No additional note."} /></div>
                </div>
              </div>
            </div>}
          </div>;
        })}
        {filteredEntries.length === 0 && <div className="rounded-2xl bg-app-surface/65 px-4 py-10 text-center ring-1 ring-app-line"><CircleHelp className="mx-auto size-8 text-app-muted" /><p className="mt-3 text-sm font-semibold text-app-muted">No entries match that search.</p></div>}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="font-mono text-[10px] uppercase tracking-wider text-app-muted">{label}</p><p className="mt-1 text-sm font-semibold text-app-foreground">{value}</p></div>;
}

function ManualEntryScreen({ onEntryAdded, onOpenConfirm, onCloseConfirm, dialogOpen }: { onEntryAdded: (entry: Entry) => void; onOpenConfirm: () => void; onCloseConfirm: () => void; dialogOpen: boolean }) {
  const [flat, setFlat] = useState("A-102");
  const [visitor, setVisitor] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("Courier");
  const [error, setError] = useState("");

  const submit = () => {
    if (!flat || !visitor.trim()) {
      setError("Select a flat and enter the visitor name first.");
      return;
    }
    onOpenConfirm();
  };

  const confirm = () => {
    onEntryAdded({ id: Date.now(), visitor: visitor.trim(), flat, purpose, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }), status: "Manual", note: "Marked manually by gate guard; resident approval was not requested.", ...(phone ? { phone } : {}) });
    setVisitor("");
    setPhone("");
    setError("Manual entry added to today's log.");
    onCloseConfirm();
  };

  return (
    <div>
      <ScreenHeading eyebrow="Gate 03 · Exception" title="Manual entry" detail="For known deliveries and repeat service visitors only." icon={<PenLine className="size-6" />} />
      <div className="mb-4 flex items-start gap-3 rounded-2xl bg-app-warn/10 p-4 text-app-warn ring-1 ring-app-warn/30"><AlertTriangle className="mt-0.5 size-5 shrink-0" /><div><p className="text-sm font-bold">Manual Entry · Unverified</p><p className="mt-1 text-xs leading-5 text-app-muted">This bypasses resident approval and is clearly marked in the log.</p></div></div>
      <section className="rounded-[28px] bg-app-surface/75 p-4 shadow-2xl shadow-black/30 ring-1 ring-app-line sm:p-5">
        <Field label="Flat number" htmlFor="manual-flat"><input id="manual-flat" list="manual-flat-list" value={flat} onChange={(event) => setFlat(event.target.value.toUpperCase())} className="field-input font-mono" placeholder="A-101" /><datalist id="manual-flat-list">{flats.map((item) => <option key={item} value={item} />)}</datalist></Field>
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Visitor name" htmlFor="manual-name"><input id="manual-name" value={visitor} onChange={(event) => setVisitor(event.target.value)} className="field-input" placeholder="Full name" /></Field><Field label="Phone · optional" htmlFor="manual-phone"><input id="manual-phone" type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} className="field-input font-mono" placeholder="10 digit number" /></Field></div>
        <div className="mt-4"><p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-app-muted">Purpose</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{purposes.map((option) => <Button key={option} type="button" variant="ghost" onClick={() => setPurpose(option)} className={`min-h-12 rounded-xl px-3 text-sm font-bold ring-1 ${purpose === option ? "bg-app-brand text-app-brand-foreground ring-app-brand" : "bg-app-bg text-app-muted ring-app-line hover:text-app-brand-light"}`}>{option}</Button>)}</div></div>
        {error && <p className={`mt-4 rounded-xl px-3 py-3 text-sm font-semibold ring-1 ${error.includes("added") ? "bg-app-ok/10 text-app-ok ring-app-ok/25" : "bg-app-bad/10 text-app-bad ring-app-bad/25"}`} aria-live="polite">{error}</p>}
        <Button type="button" onClick={submit} className="mt-5 h-16 w-full rounded-2xl bg-app-brand text-base font-bold text-app-brand-foreground shadow-xl shadow-app-brand/20 hover:bg-app-brand-light hover:text-app-bg"><PenLine className="size-5" /> Add manual entry</Button>
      </section>

      {dialogOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-app-bg/85 px-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-[420px] rounded-[28px] bg-app-surface p-5 shadow-2xl shadow-black/50 ring-1 ring-app-line"><div className="mb-4 flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-app-warn">Confirm manual entry</p><h2 id="confirm-title" className="mt-1 font-display text-2xl font-bold text-app-foreground">Skip resident approval?</h2></div><Button type="button" variant="ghost" size="icon" onClick={onCloseConfirm} aria-label="Close confirmation" className="size-10 rounded-xl text-app-muted hover:text-app-foreground"><X className="size-5" /></Button></div><p className="text-sm leading-6 text-app-muted">This entry will not require resident approval. Continue?</p><div className="mt-5 grid grid-cols-2 gap-2"><Button type="button" variant="ghost" onClick={onCloseConfirm} className="h-12 rounded-xl bg-app-bg font-bold text-app-muted ring-1 ring-app-line">Cancel</Button><Button type="button" onClick={confirm} className="h-12 rounded-xl bg-app-warn font-bold text-app-bg hover:bg-app-warn/90">Continue</Button></div></div></div>}
    </div>
  );
}

function BottomNav({ activeTab, onChange }: { activeTab: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "new", label: "New entry", icon: <Plus className="size-5" /> },
    { id: "log", label: "Today's log", icon: <ClipboardList className="size-5" /> },
    { id: "manual", label: "Manual entry", icon: <PenLine className="size-5" /> },
  ];
  return <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[720px] -translate-x-1/2 border-t border-app-line bg-app-bg/95 px-3 py-2.5 backdrop-blur" aria-label="Main navigation"><div className="grid grid-cols-3 gap-2">{items.map((item) => <Button key={item.id} type="button" variant="ghost" aria-current={activeTab === item.id ? "page" : undefined} onClick={() => onChange(item.id)} className={`flex h-[68px] flex-col gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold uppercase tracking-wide ${activeTab === item.id ? "bg-app-brand/20 text-app-brand-light ring-1 ring-app-brand/35" : "text-app-muted hover:bg-app-surface hover:text-app-foreground"}`}>{item.icon}<span>{item.label}</span></Button>)}</div></nav>;
}