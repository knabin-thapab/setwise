import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import RelatedTools, { TOOL_SETS } from "../components/RelatedTools";
import { usePageMeta } from "../lib/usePageMeta";
import { useStructuredData } from "../lib/useStructuredData";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGenerator() {
  usePageMeta({
    title: "Free Freelance Invoice Generator & Tax Escrow | Setwise",
    description: "Create free, professional freelance invoices in your browser with built-in tax set-aside guidance. No signup, no watermark, download as PDF instantly.",
    path: "/invoice-generator",
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Setwise Freelance Invoice Generator",
      url: "https://tnabin.com.np/invoice-generator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free browser-based invoice generator with automated quarterly tax set-aside calculations and instant PDF export.",
    }),
    []
  );

  useStructuredData(schema);

  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");
  const [businessName, setBusinessName] = useState("Acme Studio");

  const [businessEmail, setBusinessEmail] = useState("billing@acmestudio.com");
  const [businessAddress, setBusinessAddress] = useState("123 Freelance Way, Suite 400\nAustin, TX 78701");

  const [clientName, setClientName] = useState("Client Company Inc.");
  const [clientEmail, setClientEmail] = useState("accounts@clientcompany.com");
  const [clientAddress, setClientAddress] = useState("500 Enterprise Blvd\nNew York, NY 10001");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [currency, setCurrency] = useState("$");
  const [notes, setNotes] = useState(
    "Thank you for your business! Payment can be made via ACH transfer or Stripe invoice link."
  );

  const [showTaxSetAside, setShowTaxSetAside] = useState(true);
  const [taxRateEstimate, setTaxRateEstimate] = useState(28); // 28% estimated combined tax

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Brand Identity Design & Style Guide", quantity: 1, rate: 2400 },
    { id: "2", description: "Responsive Frontend Web Development (40 hrs)", quantity: 40, rate: 85 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "Consulting & Deliverables", quantity: 1, rate: 500 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.quantity) || 0) * (Number(curr.rate) || 0), 0);
  }, [items]);

  const taxSetAsideAmount = useMemo(() => {
    return subtotal * (taxRateEstimate / 100);
  }, [subtotal, taxRateEstimate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="mx-auto w-full max-w-[1300px] px-3.5 py-6 sm:px-6 sm:py-10 lg:px-8 pb-24 sm:pb-12">
      <div className="no-print">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Calculators", href: "/#calculator" },
            { label: "Invoice Generator", href: "/invoice-generator" },
          ]}
        />
      </div>

      {/* Top Banner */}
      <div className="no-print mb-5 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#cbd7cf] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">FREE FREELANCE TOOL</span>
            <span className="rounded-full bg-[#dcf0ea] px-2 py-0.5 text-[10px] font-extrabold text-[#11716d]">
              Client Ready
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.05em] text-[#102a2d]">
            Freelance Invoice Generator
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4b6563]">
            Create, customize, and download client-ready invoices with built-in quarterly tax escrow.
          </p>
        </div>
        <div className="hidden sm:block">
          <button
            onClick={handlePrint}
            className="calc-button !py-3 !px-6 flex items-center justify-center gap-2 shadow-md"
          >
            <span>📥</span> Download / Print PDF
          </button>
        </div>
      </div>

      {/* ─── Mobile Tab Switcher (Edit vs Preview) ─── */}
      <div className="no-print mb-5 flex rounded-xl border border-[#cbd6cf] bg-[#e6ede6] p-1 text-xs sm:text-sm font-extrabold lg:hidden">
        <button
          type="button"
          onClick={() => setActiveMobileTab("edit")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 transition ${
            activeMobileTab === "edit"
              ? "bg-[#11716d] text-white shadow-sm"
              : "text-[#4b6563] hover:text-[#102a2d]"
          }`}
        >
          <span>✏️</span> Edit Details
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 transition ${
            activeMobileTab === "preview"
              ? "bg-[#11716d] text-white shadow-sm"
              : "text-[#4b6563] hover:text-[#102a2d]"
          }`}
        >
          <span>👁️</span> Live Preview ({currency}{subtotal.toLocaleString()})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* ─── LEFT: Form Controls (Visible if edit tab on mobile or on desktop) ─── */}
        <div
          className={`no-print space-y-5 sm:space-y-6 rounded-[22px] sm:rounded-[24px] border border-[#cbd6cf] bg-[#fbfcf8] p-4 sm:p-6 shadow-sm ${
            activeMobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#e5ebe6] pb-3">
            <h2 className="text-base sm:text-lg font-extrabold tracking-[-0.03em] text-[#102a2d]">
              1. Your Business Info
            </h2>
            <span className="text-[11px] font-bold text-[#6a8e87]">Step 1 of 3</span>
          </div>

          {/* Business Info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Your Name / Company</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Studio"
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Your Billing Email</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="billing@yourdomain.com"
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#2a4d49]">Your Address / Location</label>
              <textarea
                rows={2}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="123 Freelance Way, City, State"
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white"
              />
            </div>
          </div>

          <hr className="border-[#dce4de]" />

          {/* Client Info */}
          <div className="flex items-center justify-between border-b border-[#e5ebe6] pb-3">
            <h2 className="text-base sm:text-lg font-extrabold tracking-[-0.03em] text-[#102a2d]">
              2. Client Information
            </h2>
            <span className="text-[11px] font-bold text-[#6a8e87]">Step 2 of 3</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Client Name / Company</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Company LLC"
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@company.com"
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#2a4d49]">Client Address</label>
              <textarea
                rows={2}
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Client Street, City, State ZIP"
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white"
              />
            </div>
          </div>

          <hr className="border-[#dce4de]" />

          {/* Dates & Currency */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2 text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2 text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              >
                <option value="$">USD ($)</option>
                <option value="£">GBP (£)</option>
                <option value="€">EUR (€)</option>
                <option value="CAD $">CAD ($)</option>
                <option value="AUD $">AUD ($)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2 text-xs sm:text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2a4d49]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2 text-xs sm:text-sm font-semibold outline-none focus:border-[#11716d] bg-white min-h-[44px]"
              />
            </div>
          </div>

          <hr className="border-[#dce4de]" />

          {/* Line Items - Mobile responsive card layout */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-extrabold tracking-[-0.03em] text-[#102a2d]">
                3. Invoice Line Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-lg bg-[#11716d] px-3 py-1.5 text-xs font-extrabold text-white shadow-xs hover:bg-[#0e5f5c] active:scale-95 transition"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#cbd7cf] bg-white p-3.5 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold rounded bg-[#eef3ee] px-2 py-0.5 text-[#102a2d]">
                      Line Item #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold text-[#b83b3b] hover:text-red-700 p-1 flex items-center gap-1"
                        aria-label="Remove item"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#6a8e87] block mb-1">
                      Description / Service
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Website UI Design or 20 hrs consulting"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-[#6a8e87] block mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        className="w-full rounded-lg border border-[#b9c9c0] p-2 text-sm font-semibold outline-none focus:border-[#11716d] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a8e87] block mb-1">Rate ({currency})</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                        className="w-full rounded-lg border border-[#b9c9c0] p-2 text-sm font-semibold outline-none focus:border-[#11716d] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a8e87] block mb-1">Line Total</label>
                      <div className="flex items-center justify-center min-h-[44px] rounded-lg bg-[#f0f4ef] px-2 text-xs sm:text-sm font-bold text-[#102a2d] truncate">
                        {currency}{((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-[#dce4de]" />

          {/* Setwise Differentiator: Tax Set-Aside Box */}
          <div className="rounded-xl border border-[#b6d1c3] bg-[#e6f1ec] p-3.5 sm:p-4 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 font-bold text-[#1b4b45] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTaxSetAside}
                  onChange={(e) => setShowTaxSetAside(e.target.checked)}
                  className="rounded text-[#11716d] h-4 w-4"
                />
                Calculate Tax Set-Aside Escrow
              </label>
              <span className="font-mono text-[10px] sm:text-xs font-bold text-[#11716d] rounded bg-white/80 px-2 py-0.5">
                Setwise Feature
              </span>
            </div>
            {showTaxSetAside && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#305c56] border-t border-[#b6d1c3]/50 pt-2">
                <span>
                  Recommended ~{taxRateEstimate}% for quarterly taxes:
                </span>
                <span className="font-extrabold text-[#11716d] text-sm sm:text-base">
                  {currency}
                  {taxSetAsideAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-[#2a4d49]">Payment Instructions & Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#b9c9c0] p-2.5 text-sm font-semibold outline-none focus:border-[#11716d] bg-white"
            />
          </div>

          {/* Mobile Preview Trigger Button */}
          <div className="pt-2 lg:hidden">
            <button
              type="button"
              onClick={() => setActiveMobileTab("preview")}
              className="w-full rounded-xl bg-[#11716d] py-3.5 text-center font-extrabold text-white shadow-md active:bg-[#0e5f5c]"
            >
              View Finished Invoice Preview →
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Live Invoice Preview Document ─── */}
        <div className={activeMobileTab === "edit" ? "hidden lg:block" : "block"}>
          <div className="no-print mb-3 flex items-center justify-between text-xs text-[#6a8e87]">
            <span className="font-extrabold uppercase tracking-wider text-[#11716d] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#11716d] animate-pulse" />
              Live Invoice Preview
            </span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 rounded-lg bg-[#143e3f] px-3 py-1.5 text-xs font-bold text-white shadow-xs sm:hidden"
            >
              <span>📥</span> Print PDF
            </button>
          </div>

          <div className="invoice-print-area rounded-[20px] border border-[#cbd6cf] bg-white p-4 sm:p-8 shadow-lg text-[#1a2f30] font-sans">
            {/* Header Lockup */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#e5ebe6] pb-4 sm:pb-6 gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="" className="h-6 w-6" />
                  <span className="text-lg sm:text-xl font-black tracking-[-0.05em] text-[#102a2d]">
                    {businessName || "Your Company"}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-line text-xs leading-5 text-[#6a837e]">
                  {businessAddress}
                </p>
                <p className="text-xs text-[#6a837e]">{businessEmail}</p>
              </div>
              <div className="sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-[#f0f4ef] pt-2 sm:pt-0">
                <span className="text-xl sm:text-2xl font-black tracking-[-0.04em] text-[#11716d]">INVOICE</span>
                <p className="mt-0.5 font-mono text-xs font-bold text-[#3d5a56]">#{invoiceNumber}</p>
                <p className="text-xs text-[#6a837e]">Issued: {issueDate}</p>
                <p className="text-xs font-bold text-[#b54b2a]">Due: {dueDate}</p>
              </div>
            </div>

            {/* Billed To */}
            <div className="mt-4 sm:mt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6a837e]">Billed To:</p>
              <p className="mt-0.5 text-base font-extrabold text-[#102a2d]">{clientName || "Client Name"}</p>
              <p className="whitespace-pre-line text-xs text-[#526967]">{clientAddress}</p>
              <p className="text-xs text-[#526967]">{clientEmail}</p>
            </div>

            {/* Line Items Table with horizontal overflow on mobile */}
            <div className="overflow-x-auto -mx-1 px-1 mt-4 sm:mt-6">
              <table className="w-full min-w-[300px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-[#11716d] text-[11px] sm:text-xs font-bold text-[#102a2d]">
                    <th className="py-2.5 pr-2">Description</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Rate</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef2ea]">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 sm:py-3 pr-2 font-medium">{item.description}</td>
                      <td className="py-2.5 sm:py-3 text-center text-[#526967]">{item.quantity}</td>
                      <td className="py-2.5 sm:py-3 text-right text-[#526967]">
                        {currency}
                        {Number(item.rate).toLocaleString()}
                      </td>
                      <td className="py-2.5 sm:py-3 text-right font-bold text-[#102a2d]">
                        {currency}
                        {((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Calculation */}
            <div className="mt-5 flex justify-end border-t border-[#cbd6cf] pt-3">
              <div className="w-56 sm:w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-xs text-[#526967]">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#102a2d]">
                    {currency}
                    {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#11716d] pt-2 text-base font-black text-[#102a2d]">
                  <span>Total Due:</span>
                  <span className="text-[#11716d]">
                    {currency}
                    {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Setwise Tax Set-Aside Recommendation Note */}
            {showTaxSetAside && (
              <div className="mt-5 sm:mt-6 rounded-xl border border-[#cbd7cf] bg-[#f8faf6] p-3 text-xs text-[#3f5d57]">
                <p className="font-bold text-[#11716d]">💡 Freelancer Tax Planning Note (Setwise):</p>
                <p className="mt-0.5 leading-5">
                  Set aside approximately{" "}
                  <b>
                    {currency}
                    {taxSetAsideAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </b>{" "}
                  ({taxRateEstimate}%) into your quarterly tax escrow to stay prepared for IRS deadlines.
                </p>
              </div>
            )}

            {/* Notes / Bank details */}
            {notes && (
              <div className="mt-5 sm:mt-6 border-t border-[#e5ebe6] pt-3 text-xs text-[#6a837e]">
                <p className="font-bold text-[#102a2d]">Notes & Payment Terms:</p>
                <p className="mt-0.5 leading-5 whitespace-pre-line">{notes}</p>
              </div>
            )}
          </div>

          {/* Mobile Back to Edit button */}
          <div className="mt-4 pt-2 lg:hidden">
            <button
              type="button"
              onClick={() => setActiveMobileTab("edit")}
              className="w-full rounded-xl border border-[#cbd6cf] bg-white py-3 text-center text-xs font-extrabold text-[#2a4d49] hover:bg-[#e6ede6]"
            >
              ← Back to Edit Details
            </button>
          </div>
        </div>
      </div>

      {/* ─── Fixed Sticky Mobile Action Bar ─── */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-30 border-t border-[#cbd6cf] bg-white/95 p-3.5 backdrop-blur-md shadow-lg sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#6a8e87] uppercase block">Total Due</span>
            <span className="text-lg font-black text-[#11716d]">
              {currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {activeMobileTab === "edit" ? (
              <button
                onClick={() => setActiveMobileTab("preview")}
                className="rounded-full bg-[#e8f2ee] px-4 py-2.5 text-xs font-extrabold text-[#11716d] border border-[#11716d]/30"
              >
                Preview 👁️
              </button>
            ) : (
              <button
                onClick={() => setActiveMobileTab("edit")}
                className="rounded-full bg-[#f0f4ef] px-3.5 py-2.5 text-xs font-extrabold text-[#3a5854]"
              >
                Edit ✏️
              </button>
            )}
            <button
              onClick={handlePrint}
              className="rounded-full bg-[#11716d] px-5 py-2.5 text-xs font-black text-white shadow-md active:bg-[#0e5f5c]"
            >
              📥 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Link Card */}
      <div className="no-print mt-8 sm:mt-12 flex flex-col items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#143e3f] p-5 sm:p-6 text-white sm:flex-row">
        <div>
          <h3 className="text-base sm:text-lg font-black">Want to know your real take-home rate?</h3>
          <p className="text-xs text-[#aed3c7] mt-1">
            Calculate your profit margin and true hourly wage after expenses and taxes.
          </p>
        </div>
        <Link
          to="/profit-margin-calculator"
          className="rounded-full bg-[#6dd4c8] px-5 py-2.5 text-xs font-extrabold text-[#102a2d] transition hover:bg-white w-full sm:w-auto text-center"
        >
          Check Profit Margin →
        </Link>
      </div>

      <div className="no-print">
        <RelatedTools tools={TOOL_SETS.invoice} />
      </div>
    </main>
  );
}

