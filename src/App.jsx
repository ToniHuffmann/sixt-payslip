import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════
// ANONYMISED DATA — real SIXT DE payslips, März 2026
// Personal data replaced: names, addresses, IBANs, tax IDs,
// RV numbers, Workday IDs, birth dates → all fictional
// Employer: "SIXT SE" per product requirement
// Lohnart codes, monetary values, rates → authentic
// ═══════════════════════════════════════════════════════════════════

const DATA = {

  // ── DEFAULT: Grundgehalt only (no benefit)
  default: {
    meta: { name: "Anna Bergmann", workdayId: "W-00087432", kostenstelle: "RAC_719_HR_P", period: "März 2026", eintritt: "01.05.2022", stKlasse: "2", krankenkasse: "BKK firmus", kvRate: "8,390%", pvRate: "1,8000%", avRate: "1,30%", rvRate: "9,30%", svTage: "30 / 30" },
    entgelt: [
      { code: "1101", label: "Grundgehalt", kenn: "LSG", betrag: "4.014,42" },
    ],
    brutto: [
      { code: "/10E", label: "Gesamtbrutto (EBeschV)",   betrag: "4.014,42" },
      { code: "Y$04", label: "Steuer-Brutto, lfd.",      betrag: "4.014,42" },
      { code: "Y$05", label: "SV-Brutto KV, lfd.",       betrag: "4.014,42" },
      { code: "Y$06", label: "SV-Brutto RV, lfd.",       betrag: "4.014,42" },
      { code: "Y$51", label: "SV-Brutto AV, lfd.",       betrag: "4.014,42" },
      { code: "Y$08", label: "SV-Brutto PV, lfd.",       betrag: "4.014,42" },
    ],
    abzuege: [
      { code: "Y$33", label: "Lohnsteuer, lfd.",           betrag: "420,00", minus: true },
      { code: "Y$20", label: "Krankenversicherung, lfd.",  betrag: "336,81", minus: true },
      { code: "Y$21", label: "Rentenversicherung, lfd.",   betrag: "373,34", minus: true },
      { code: "Y$22", label: "Arbeitslosenvers., lfd.",    betrag: "52,19",  minus: true },
      { code: "Y$23", label: "Pflegeversicherung, lfd.",   betrag: "72,26",  minus: true },
    ],
    gesetzlNetto: "2.759,82",
    sonstige: [],
    ueberweisung: "2.759,82",
  },

  // ── MOBILITY: Grundgehalt + ÖPNV-Zuschuss §40(2)
  // Source: doc 01001174, Seite 3 (März 2026)
  // 3052 Kenn=G → in Gesamtbrutto only, NOT in Steuer-Brutto / SV-Brutto
  mobility: {
    meta: { name: "Anna Bergmann", workdayId: "W-00087432", kostenstelle: "RAC_719_HR_P", period: "März 2026", eintritt: "01.05.2022", stKlasse: "2", krankenkasse: "BKK firmus", kvRate: "8,390%", pvRate: "1,8000%", avRate: "1,30%", rvRate: "9,30%", svTage: "30 / 30" },
    entgelt: [
      { code: "1101", label: "Grundgehalt",               kenn: "LSG", betrag: "4.014,42" },
      { code: "3052", label: "Zuschuss zum ÖPNV pausch.", kenn: "G",   betrag: "20,00", highlight: true },
    ],
    brutto: [
      { code: "/10E", label: "Gesamtbrutto (EBeschV)",   betrag: "4.034,42" },
      { code: "Y$04", label: "Steuer-Brutto, lfd.",      betrag: "4.014,42", note: "excl. 3052 — pauschal §40(2)" },
      { code: "P42H", label: "Pausch.StB §40(2) AG",     betrag: "20,00",    dim: true },
      { code: "P3BH", label: "Pausch.StB §37b AG",       betrag: "22,58",    dim: true },
      { code: "Y$05", label: "SV-Brutto KV, lfd.",       betrag: "4.014,42" },
      { code: "Y$06", label: "SV-Brutto RV, lfd.",       betrag: "4.014,42" },
      { code: "Y$51", label: "SV-Brutto AV, lfd.",       betrag: "4.014,42" },
      { code: "Y$08", label: "SV-Brutto PV, lfd.",       betrag: "4.014,42" },
    ],
    abzuege: [
      { code: "Y$33", label: "Lohnsteuer, lfd.",           betrag: "433,00", minus: true },
      { code: "Y$20", label: "Krankenversicherung, lfd.",  betrag: "336,81", minus: true },
      { code: "Y$21", label: "Rentenversicherung, lfd.",   betrag: "373,34", minus: true },
      { code: "Y$22", label: "Arbeitslosenvers., lfd.",    betrag: "52,19",  minus: true },
      { code: "Y$23", label: "Pflegeversicherung, lfd.",   betrag: "72,26",  minus: true },
    ],
    gesetzlNetto: "2.766,82",
    sonstige: [
      { code: "/552", label: "Nachverrechnung aus Vorm.", betrag: "744,69", plus: true },
      { code: "95A6", label: "Einm.Netto gw.Vortl §37b", betrag: "22,58",  minus: true, dim: true },
    ],
    ueberweisung: "3.511,51",
    ueberweisungNormal: "2.766,82",
  },

  // ── DIENSTRAD: Grundgehalt + Fahrrad Grundrate + gw. Vorteil
  // Source: doc 01001113 (März 2026)
  dienstrad: {
    meta: { name: "Jonas Weber", workdayId: "W-00061345", kostenstelle: "RAC_001_HR_F", period: "März 2026", eintritt: "01.02.2022", stKlasse: "1", krankenkasse: "BKK firmus", kvRate: "8,390%", pvRate: "2,4000%", avRate: "1,30%", rvRate: "9,30%", svTage: "30 / 30" },
    entgelt: [
      { code: "1101", label: "Grundgehalt",         kenn: "LSG", betrag: "3.640,00" },
      { code: "8432", label: "Fahrrad 2 Grundrate", kenn: "LSG", betrag: "53,50",  minus: true, highlight: true },
      { code: "3065", label: "Fahrrad 1 gw.Vorteil",kenn: "LSG", betrag: "7,00",              highlight: true },
    ],
    brutto: [
      { code: "/10E", label: "Gesamtbrutto (EBeschV)",   betrag: "3.593,50" },
      { code: "Y$04", label: "Steuer-Brutto, lfd.",      betrag: "3.593,50" },
      { code: "P3BH", label: "Pausch.StB §37b AG",       betrag: "22,58",   dim: true },
      { code: "P42H", label: "Pausch.StB §40(2) AG",     betrag: "20,00",   dim: true },
      { code: "Y$05", label: "SV-Brutto KV, lfd.",       betrag: "3.593,50" },
      { code: "Y$06", label: "SV-Brutto RV, lfd.",       betrag: "3.593,50" },
      { code: "Y$51", label: "SV-Brutto AV, lfd.",       betrag: "3.593,50" },
      { code: "Y$08", label: "SV-Brutto PV, lfd.",       betrag: "3.593,50" },
    ],
    abzuege: [
      { code: "Y$33", label: "Lohnsteuer, lfd.",           betrag: "431,00", minus: true },
      { code: "Y$20", label: "Krankenversicherung, lfd.",  betrag: "301,50", minus: true },
      { code: "Y$21", label: "Rentenversicherung, lfd.",   betrag: "334,20", minus: true },
      { code: "Y$22", label: "Arbeitslosenvers., lfd.",    betrag: "46,72",  minus: true },
      { code: "Y$23", label: "Pflegeversicherung, lfd.",   betrag: "86,24",  minus: true },
    ],
    gesetzlNetto: "2.393,84",
    sonstige: [
      { code: "95A6", label: "Einm.Netto gw.Vortl §37b", betrag: "22,58", minus: true, dim: true },
      { code: "3065", label: "Fahrrad 1 gw.Vorteil",     betrag: "7,00",  minus: true, highlight: true },
    ],
    ueberweisung: "2.386,84",
  },

  // ── FIRMENWAGEN: from previously processed real payslip
  firmenwagen: {
    meta: { name: "Michael Bauer", workdayId: "W-00034891", kostenstelle: "RAC_MUC_001", period: "März 2026", eintritt: "15.03.2019", stKlasse: "1", krankenkasse: "TK", kvRate: "7,300%", pvRate: "1,7000%", avRate: "1,30%", rvRate: "9,30%", svTage: "30 / 30" },
    entgelt: [
      { code: "1101",  label: "Grundgehalt",                 kenn: "LSG", betrag: "5.500,00" },
      { code: "Y$33E", label: "PKW-Wert geldwerter Vorteil", kenn: "LSG", betrag: "550,00",  highlight: true },
      { code: "Y$21E", label: "PKW-KM geldwerter Vorteil",   kenn: "LSG", betrag: "165,00",  highlight: true },
      { code: "Y$10",  label: "Zuzahlung Dienstwagen",       kenn: "LSG", betrag: "150,00",  minus: true, highlight: true },
    ],
    brutto: [
      { code: "/10E", label: "Gesamtbrutto (EBeschV)",   betrag: "6.065,00" },
      { code: "Y$04", label: "Steuer-Brutto, lfd.",      betrag: "6.065,00" },
      { code: "Y$05", label: "SV-Brutto KV, lfd.",       betrag: "6.065,00" },
      { code: "Y$06", label: "SV-Brutto RV, lfd.",       betrag: "6.065,00" },
      { code: "Y$51", label: "SV-Brutto AV, lfd.",       betrag: "6.065,00" },
      { code: "Y$08", label: "SV-Brutto PV, lfd.",       betrag: "6.065,00" },
    ],
    abzuege: [
      { code: "Y$33", label: "Lohnsteuer, lfd.",           betrag: "1.480,00", minus: true },
      { code: "Y$20", label: "Krankenversicherung, lfd.",  betrag: "441,54",   minus: true },
      { code: "Y$21", label: "Rentenversicherung, lfd.",   betrag: "564,05",   minus: true },
      { code: "Y$22", label: "Arbeitslosenvers., lfd.",    betrag: "78,85",    minus: true },
      { code: "Y$23", label: "Pflegeversicherung, lfd.",   betrag: "103,11",   minus: true },
    ],
    gesetzlNetto: "3.397,45",
    sonstige: [],
    ueberweisung: "3.397,45",
  },
};

// ═══════════════════════════════════════════════════════════════════
// TOOLTIPS — bilingual, keyed by Lohnart code
// ═══════════════════════════════════════════════════════════════════
const TIPS = {
  "1101":  { en: "Base salary (Grundgehalt): your fixed contractual monthly gross salary. Starting point for all tax and social security calculations on this payslip.", de: "Grundgehalt: Ihr festes vertraglich vereinbartes monatliches Bruttogehalt. Ausgangspunkt für alle Steuer- und Sozialversicherungsberechnungen." },
  "3052":  { en: "Public transport subsidy (ÖPNV-Zuschuss): SIXT contributes €20/month towards your transport costs. Taxed flat-rate by SIXT under §40(2) EStG — SIXT pays the tax, not you. Therefore NOT in your personal Steuer-Brutto or SV-Brutto. You receive the full €20 with no personal deduction. Kenn 'G' = Gesamtbrutto only.", de: "ÖPNV-Zuschuss: SIXT zahlt 20 €/Monat zu Ihren Fahrtkosten. Von SIXT pauschal nach §40(2) EStG versteuert — SIXT trägt die Steuer. Nicht im persönlichen Steuerbrutto oder SV-Brutto. Sie erhalten 20 € vollständig. Kennzeichen 'G' = nur Gesamtbrutto." },
  "8432":  { en: "Bike lease rate (Fahrrad Grundrate): the monthly leasing instalment deducted from your gross salary before tax via salary conversion (Gehaltsumwandlung). Reduces your taxable gross — you pay less income tax and social security than on a comparable cash salary.", de: "Fahrrad-Grundrate: monatliche Leasingrate, die per Gehaltsumwandlung vom Bruttogehalt vor Steuer abgezogen wird. Senkt Ihr Steuerbrutto — weniger Lohnsteuer und SV als bei vergleichbarem Barlohn." },
  "3065":  { en: "Company bike benefit in kind (geldwerter Vorteil Fahrrad): taxable value for private use of the leased bike — 0.25% of gross list price per month. Added to taxable gross for tax/SV purposes, then deducted again from net pay (see Sonstige). No cash flows to you.", de: "Geldwerter Vorteil Fahrrad: steuerpflichtiger Wert der Privatnutzung, 0,25% des Bruttolistenpreises/Monat. Dem Steuerbrutto zugeschlagen, im Netto wieder abgezogen (siehe Sonstige). Keine Barauszahlung." },
  "Y$33E": { en: "Company car benefit in kind – value (PKW-Wert): taxable value of private car use, 1% of the car's list price per month. Increases your taxable gross — no cash payment.", de: "Geldwerter Vorteil PKW-Wert: steuerpflichtiger Wert der Privatnutzung, 1% des Listenpreises/Monat. Erhöht das Steuerbrutto — keine Barauszahlung." },
  "Y$21E": { en: "Company car commute benefit (PKW-KM): taxable value for home-to-work trips with the company car. Calculated as 0.03% of list price × distance in km × working months.", de: "PKW-KM geldwerter Vorteil: steuerpflichtiger Wert für Fahrten Wohnung–Arbeit. Berechnung: 0,03% des Listenpreises × Entfernung km × Monate." },
  "Y$10":  { en: "Personal contribution to company car (Zuzahlung Dienstwagen): your monthly payment towards the car, which reduces the taxable benefit in kind — lowering your income tax.", de: "Zuzahlung Dienstwagen: Ihr monatlicher Eigenanteil am Firmenwagen, der den geldwerten Vorteil mindert — und damit Ihre Lohnsteuer senkt." },
  "/10E":  { en: "Total gross (Gesamtbrutto, EBeschV): sum of all earnings components including flat-rate taxed benefits like the ÖPNV subsidy. Used for employer certificates and year-end reporting.", de: "Gesamtbrutto (EBeschV): Summe aller Entgeltbestandteile einschließlich pauschal versteuerter Benefits wie dem ÖPNV-Zuschuss. Basis für Arbeitgeberbescheinigungen und Jahresmeldung." },
  "Y$04":  { en: "Taxable gross, ongoing (Steuer-Brutto, lfd.): the portion of your earnings subject to personal income tax each month. Flat-rate taxed items (e.g. ÖPNV subsidy) and one-off payments are excluded.", de: "Steuer-Brutto, laufend: der monatlich der persönlichen Lohnsteuer unterliegende Teil. Pauschal versteuerte Bestandteile (z. B. ÖPNV-Zuschuss) und Einmalzahlungen sind ausgenommen." },
  "P42H":  { en: "Flat-rate income tax §40(2) EStG, paid by employer: SIXT pays this tax on the ÖPNV subsidy on your behalf. Does not reduce your net pay.", de: "Pauschalsteuer §40(2) EStG, vom Arbeitgeber: SIXT zahlt diese Steuer auf den ÖPNV-Zuschuss für Sie. Kein Abzug von Ihrem Netto." },
  "P3BH":  { en: "Flat-rate income tax §37b EStG, paid by employer: covers non-cash benefits (e.g. gifts/vouchers) where SIXT bears the tax. No effect on your net pay.", de: "Pauschalsteuer §37b EStG, vom Arbeitgeber: Für Sachzuwendungen trägt SIXT die Steuer. Kein Einfluss auf Ihr Netto." },
  "Y$05":  { en: "SV gross for health insurance (SV-Brutto KV): income base for your health insurance contribution. May differ from Steuer-Brutto when certain items are excluded.", de: "SV-Brutto KV: Bemessungsgrundlage für Krankenversicherungsbeiträge. Kann vom Steuerbrutto abweichen." },
  "Y$06":  { en: "SV gross for pension insurance (SV-Brutto RV): income base for pension insurance contributions.", de: "SV-Brutto RV: Bemessungsgrundlage für Rentenversicherungsbeiträge." },
  "Y$51":  { en: "SV gross for unemployment insurance (SV-Brutto AV): income base for unemployment insurance contributions.", de: "SV-Brutto AV: Bemessungsgrundlage für Arbeitslosenversicherungsbeiträge." },
  "Y$08":  { en: "SV gross for long-term care insurance (SV-Brutto PV): income base for care insurance contributions.", de: "SV-Brutto PV: Bemessungsgrundlage für Pflegeversicherungsbeiträge." },
  "Y$33":  { en: "Income tax, ongoing (Lohnsteuer, lfd.): withheld monthly from your taxable gross by SIXT and remitted to the tax office. Rate depends on your tax class and Steuer-Brutto.", de: "Lohnsteuer, laufend: monatlich von SIXT einbehalten und ans Finanzamt abgeführt. Satz abhängig von Steuerklasse und Steuerbrutto." },
  "Y$20":  { en: "Health insurance, employee share (Krankenversicherung, lfd.): calculated at your KV-AN rate on SV-Brutto KV, up to the contribution ceiling.", de: "Krankenversicherung, Arbeitnehmeranteil: KV-AN-Satz auf SV-Brutto KV bis zur Beitragsbemessungsgrenze." },
  "Y$21":  { en: "Pension insurance, employee share (Rentenversicherung, lfd.): currently 9.3% of SV-Brutto RV up to the contribution ceiling. Employer pays the same rate on top.", de: "Rentenversicherung, Arbeitnehmeranteil: aktuell 9,3% des SV-Brutto RV bis zur Beitragsbemessungsgrenze. Arbeitgeber trägt denselben Anteil zusätzlich." },
  "Y$22":  { en: "Unemployment insurance, employee share (Arbeitslosenversicherung, lfd.): currently 1.3% of SV-Brutto AV up to the contribution ceiling.", de: "Arbeitslosenversicherung, Arbeitnehmeranteil: aktuell 1,3% des SV-Brutto AV bis zur Beitragsbemessungsgrenze." },
  "Y$23":  { en: "Long-term care insurance, employee share (Pflegeversicherung, lfd.): base rate 1.7%, plus surcharge for employees without children. Your PV-AN rate is shown in the payslip footer.", de: "Pflegeversicherung, Arbeitnehmeranteil: Basissatz 1,7%, zzgl. Zuschlag für Kinderlose. Ihr PV-AN-Satz steht im Fußbereich." },
  "/552":  { en: "Subsequent settlement from prior month (Nachverrechnung aus Vormonat): a one-off correction payment from February processed in this month's payroll. Not part of regular monthly net pay — your normal net is 2.766,82 €.", de: "Nachverrechnung aus dem Vormonat: eine einmalige Korrekturzahlung aus Februar, die in dieser Abrechnung verarbeitet wurde. Kein Bestandteil des regulären monatlichen Nettogehalts — Ihr normales Netto beträgt 2.766,82 €." },
  "95A6":  { en: "Net non-cash benefit §37b EStG: a benefit-in-kind (e.g. gift/voucher) where SIXT paid the flat-rate tax. Shown for informational purposes; does not affect your bank transfer.", de: "Netto-Sachzuwendung §37b: ein Sachbezug (z. B. Geschenk/Gutschein), für den SIXT die Pauschalsteuer trägt. Informatorisch ausgewiesen; kein Einfluss auf die Überweisung." },
  "3065s": { en: "Bike benefit in kind — net deduction: the benefit-in-kind value was added to your taxable gross above for correct tax/SV reporting, then deducted here from net so that no cash is paid out.", de: "Geldwerter Vorteil Fahrrad — Nettoabzug: Der Vorteil wurde oben dem Steuerbrutto zugeschlagen, hier wieder abgezogen. Keine Barauszahlung — dient nur der korrekten steuerlichen Erfassung." },
  "/559":  { en: "Bank transfer (Überweisung): the actual amount transferred to your bank account — your take-home pay after all taxes, social security, and other adjustments.", de: "Überweisung: der tatsächlich auf Ihr Konto überwiesene Betrag — Ihr Auszahlungsbetrag nach allen Steuern, Sozialversicherungen und sonstigen Anpassungen." },
};

// ═══════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Tip({ k }) {
  const [v, setV] = useState(false);
  if (!TIPS[k]) return null;
  const t = TIPS[k];
  return (
    <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}
      onMouseEnter={() => setV(true)} onMouseLeave={() => setV(false)}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        background: "#ff6600", color: "#fff",
        fontSize: 9, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", userSelect: "none",
      }}>i</div>
      {v && (
        <div style={{
          position: "absolute", right: 18, top: -4, zIndex: 300,
          background: "#1a1a1a", border: "1px solid #ff6600",
          borderRadius: 6, padding: "9px 11px", width: 288,
          boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#ff6600", marginBottom: 3 }}>EN</div>
          <div style={{ fontSize: 11, color: "#eee", lineHeight: 1.5, marginBottom: 7 }}>{t.en}</div>
          <hr style={{ border: "none", borderTop: "1px solid #333", margin: "5px 0" }} />
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#ff6600", marginBottom: 3 }}>DE</div>
          <div style={{ fontSize: 11, color: "#eee", lineHeight: 1.5 }}>{t.de}</div>
        </div>
      )}
    </div>
  );
}

function Row({ code, label, kenn, betrag, minus, plus, highlight, dim, note, tipKey }) {
  const col = minus ? "#c0392b" : (plus || code === "3052") ? "#2a7a2a" : dim ? "#aaa" : "#1a1a1a";
  const prefix = minus ? "− " : plus ? "+ " : "";
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: highlight ? "4px 8px 4px 9px" : "4px 0",
      borderBottom: "1px solid #f0f0f0",
      borderLeft: highlight ? "3px solid #ff6600" : "none",
      background: highlight ? "#fff9f5" : "transparent",
      minHeight: 28, gap: 4,
    }}>
      <span style={{ fontSize: 10, color: "#bbb", fontFamily: "monospace", minWidth: 42, flexShrink: 0 }}>{code}</span>
      <span style={{ fontSize: 12, color: dim ? "#aaa" : "#2a2a2a", flex: 1, lineHeight: 1.3 }}>
        {label}
        {note && <span style={{ fontSize: 10, color: "#ff6600", marginLeft: 5, fontStyle: "italic" }}>({note})</span>}
      </span>
      {kenn !== undefined && (
        <span style={{ fontSize: 9, color: "#ccc", minWidth: 24, textAlign: "center", fontFamily: "monospace", flexShrink: 0 }}>{kenn}</span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
        <Tip k={tipKey || code} />
        <span style={{ fontSize: 12, fontWeight: 600, color: col, minWidth: 76, textAlign: "right", fontFamily: "monospace" }}>
          {prefix}{betrag} €
        </span>
      </div>
    </div>
  );
}

function SBar({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
      color: "#fff", background: "#2a2a2a",
      padding: "4px 10px", marginTop: 1, marginBottom: 1,
    }}>{children}</div>
  );
}

function SubtotalRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px 5px 52px", background: "#f0f0f0", borderTop: "1px solid #ddd" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#333", fontFamily: "monospace" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#1a1a1a", fontFamily: "monospace" }}>{value} €</span>
    </div>
  );
}

function UeberweisungRow({ value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 10px", background: "#000" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>/559  Überweisung</span>
          <Tip k="/559" />
        </div>
        <div style={{ fontSize: 10, color: "#888", marginTop: 2, fontFamily: "sans-serif" }}>Amount transferred to your bank account</div>
      </div>
      <span style={{ fontSize: 22, fontWeight: 900, color: "#ff6600", fontFamily: "monospace" }}>{value} €</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAYSLIP RENDERER
// ═══════════════════════════════════════════════════════════════════

function PayslipBody({ scenario }) {
  const d = DATA[scenario];
  if (!d) return null;
  const { meta, entgelt, brutto, abzuege, gesetzlNetto, sonstige, ueberweisung, ueberweisungNormal } = d;

  // tip key overrides for firmenwagen (code collision with abzug Y$33/Y$21)
  function entgeltTipKey(r) {
    if (scenario === "firmenwagen") {
      if (r.code === "Y$33E") return "Y$33E";
      if (r.code === "Y$21E") return "Y$21E";
    }
    return r.code;
  }
  function sonstiTipKey(r) {
    if (r.code === "3065") return "3065s";
    return r.code;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: "#000", padding: "12px 14px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#ff6600", letterSpacing: -0.3 }}>SIXT SE</div>
          <div style={{ fontSize: 10, color: "#777", marginTop: 1 }}>Entgeltabrechnung / Payslip</div>
          <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>Abrechnungszeitraum: {meta.period}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{meta.name}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>Workday-ID: {meta.workdayId}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>Kostenstelle: {meta.kostenstelle}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>Eintritt: {meta.eintritt}</div>
        </div>
      </div>

      {/* Column header */}
      <div style={{ display: "flex", padding: "3px 10px 3px 52px", background: "#111", gap: 4 }}>
        <span style={{ fontSize: 9, color: "#666", flex: 1, textTransform: "uppercase", letterSpacing: 0.4 }}>Lohnart / Entgeltbestandteile</span>
        <span style={{ fontSize: 9, color: "#666", minWidth: 24, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.4 }}>Kenn</span>
        <span style={{ fontSize: 9, color: "#666", minWidth: 82, textAlign: "right", textTransform: "uppercase", letterSpacing: 0.4 }}>Monat</span>
      </div>

      <div style={{ padding: "4px 10px 0" }}>

        {/* Entgeltbestandteile */}
        {entgelt.map((r, i) => <Row key={i} {...r} tipKey={entgeltTipKey(r)} />)}

        {/* Bruttoentgelte */}
        <div style={{ height: 1, background: "#ddd", margin: "4px 0" }} />
        <SBar>Bruttoentgelte</SBar>
        {brutto.map((r, i) => <Row key={i} {...r} />)}

        {/* Gesetzliche Abzüge */}
        <div style={{ height: 1, background: "#ddd", margin: "4px 0" }} />
        <SBar>Gesetzliche Abzüge</SBar>
        {abzuege.map((r, i) => <Row key={i} {...r} />)}

        {/* Gesetzl. Netto */}
        <div style={{ height: 1, background: "#ddd", margin: "4px 0" }} />
        <SubtotalRow label="/55E  Gesetzl. Netto (EBeschV)" value={gesetzlNetto} />

        {/* Sonstige */}
        {sonstige.length > 0 && (
          <>
            <SBar>Sonstige Be-/Abzüge</SBar>
            {sonstige.map((r, i) => <Row key={i} {...r} tipKey={sonstiTipKey(r)} />)}
            {scenario === "mobility" && ueberweisungNormal && (
              <div style={{ fontSize: 10, color: "#c45000", background: "#fff9f0", border: "1px solid #ffd4a3", borderRadius: 4, padding: "5px 8px", margin: "4px 0", fontStyle: "italic" }}>
                Note: The /552 Nachverrechnung (+744,69 €) is a one-off February correction — regular monthly net: {ueberweisungNormal} €
              </div>
            )}
          </>
        )}

        {/* Überweisungen */}
        <div style={{ height: 1, background: "#ddd", margin: "4px 0" }} />
      </div>

      <UeberweisungRow value={ueberweisung} />

      {/* Footer metadata */}
      <div style={{ padding: "8px 14px", background: "#f5f5f5", borderTop: "2px solid #ccc", display: "flex", flexWrap: "wrap", gap: "4px 18px" }}>
        {[
          ["ST-Klasse", meta.stKlasse],
          ["Krankenkasse", meta.krankenkasse],
          ["KV-AN", meta.kvRate],
          ["PV-AN", meta.pvRate],
          ["RV-AN", meta.rvRate],
          ["AV-AN", meta.avRate],
          ["Steuer-/SV-Tage", meta.svTage],
        ].map(([k, v]) => (
          <div key={k} style={{ fontSize: 10, color: "#666" }}>
            <strong style={{ color: "#333" }}>{k}:</strong> {v}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════

export default function PayslipDE() {
  const [scenario, setScenario] = useState("default");

  const scenarios = [
    { id: "default",     icon: "—",  label: "Kein Benefit",       sub: "Grundgehalt only · default" },
    { id: "mobility",    icon: "🚌", label: "Mobility Allowance", sub: "ÖPNV-Zuschuss §40(2)" },
    { id: "dienstrad",   icon: "🚲", label: "Dienstrad",          sub: "Company Bike" },
    { id: "firmenwagen", icon: "🚗", label: "Firmenwagen",        sub: "Company Car" },
  ];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 3 }}>Germany — Select Your Benefit Scenario</h2>
        <p style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>
          Choose the scenario matching your package. Highlighted fields (orange border) are scenario-specific — hover the <span style={{ background: "#ff6600", color: "#fff", borderRadius: "50%", padding: "0 4px", fontSize: 10, fontWeight: 700 }}>i</span> for bilingual explanations.
        </p>
      </div>

      {/* Scenario buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {scenarios.map(s => {
          const active = scenario === s.id;
          return (
            <button key={s.id} onClick={() => setScenario(s.id)} style={{
              flex: "1 1 120px",
              padding: "10px 11px",
              border: `2px solid ${active ? "#ff6600" : "#e0e0e0"}`,
              borderRadius: 7,
              background: active ? "#fff" : "#fafafa",
              boxShadow: active ? "0 0 0 3px rgba(255,102,0,0.12)" : "none",
              cursor: "pointer", textAlign: "left",
              transition: "all 0.1s ease", position: "relative",
            }}>
              {active && <span style={{ position: "absolute", top: 6, right: 8, color: "#ff6600", fontWeight: 900, fontSize: 11 }}>✓</span>}
              <div style={{ fontSize: 17, marginBottom: 3 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{s.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Payslip */}
      <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <PayslipBody scenario={scenario} />
      </div>
    </div>
  );
}
