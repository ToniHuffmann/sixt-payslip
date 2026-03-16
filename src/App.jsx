import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// SIXT DESIGN TOKENS
// ─────────────────────────────────────────────────────────────
const T = {
  orange:       "#FF5F00",
  orangeHover:  "#E55500",
  orangeLight:  "#FFF0E6",
  black:        "#0A0A0A",
  darkGray:     "#1A1A1A",
  midGray:      "#2C2C2C",
  borderGray:   "#3A3A3A",
  lightBorder:  "#E8E8E8",
  textMuted:    "#888888",
  textSecond:   "#BBBBBB",
  white:        "#FFFFFF",
  surface:      "#141414",
  surfaceCard:  "#1E1E1E",
  surfaceHover: "#252525",
  tooltipBg:    "#1A1A1A",
  tooltipBorder:"#FF5F00",
  green:        "#00C87A",
};

const s = {
  page:     { background: T.black, minHeight: "100vh", color: T.white, fontFamily: "var(--font-sans)" },
  card:     { background: T.surfaceCard, border: `0.5px solid ${T.borderGray}`, borderRadius: 12 },
  cardHover:{ background: T.surfaceHover },
  section:  { fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.textMuted },
  label:    { fontSize: 12, color: T.textSecond },
  value:    { fontSize: 13, color: T.white },
  mono:     { fontVariantNumeric: "tabular-nums" },
};

// ─────────────────────────────────────────────────────────────
// COUNTRY CONFIG
// ─────────────────────────────────────────────────────────────
const countryConfig = {
  DE:  { name: "Germany",         flag: "🇩🇪", active: true  },
  AT:  { name: "Austria",         flag: "🇦🇹", active: false },
  CH:  { name: "Switzerland",     flag: "🇨🇭", active: false },
  IT:  { name: "Italy",           flag: "🇮🇹", active: false },
  FR:  { name: "France",          flag: "🇫🇷", active: false },
  MC:  { name: "Monaco",          flag: "🇲🇨", active: false },
  UK:  { name: "United Kingdom",  flag: "🇬🇧", active: false },
  BE:  { name: "Belgium",         flag: "🇧🇪", active: false },
  NL:  { name: "Netherlands",     flag: "🇳🇱", active: false },
  LUX: { name: "Luxembourg",      flag: "🇱🇺", active: false },
  ES:  { name: "Spain",           flag: "🇪🇸", active: false },
  PT:  { name: "Portugal",        flag: "🇵🇹", active: false },
};

// ─────────────────────────────────────────────────────────────
// BILINGUAL TOOLTIPS — DE
// ─────────────────────────────────────────────────────────────
const tooltipsDE = {
  workdayId: {
    en: "Your unique Workday employee ID used for payroll processing across all SIXT systems.",
    de: "Ihre eindeutige Workday-Mitarbeiter-ID, die für die Gehaltsabrechnung in allen SIXT-Systemen verwendet wird.",
  },
  kostenstelle: {
    en: "Cost centre: the internal organisational unit your salary costs are charged to. The prefix (e.g. RAC = Rent-A-Car) indicates the business division.",
    de: "Kostenstelle: die interne Organisationseinheit, der Ihre Gehaltskosten zugeordnet werden. Das Präfix (z. B. RAC = Rent-A-Car) steht für den Geschäftsbereich.",
  },
  grundgehalt: {
    en: "Base salary (Grundgehalt): your fixed contractual monthly gross salary before any additions or deductions.",
    de: "Grundgehalt: Ihr festes vertraglich vereinbartes monatliches Bruttogehalt vor etwaigen Zulagen oder Abzügen.",
  },
  pkwWert: {
    en: "Company car benefit in kind – value (PKW-Wert): the taxable monetary value of your private use of a company car, calculated as 1% of the car's list price per month. This increases your taxable gross.",
    de: "Geldwerter Vorteil Dienstwagen – Wert: der steuerpflichtige Geldwert für die Privatnutzung des Firmenwagens, berechnet als 1% des Listenpreises pro Monat. Erhöht Ihr zu versteuerndes Brutto.",
  },
  pkwKm: {
    en: "Company car commute benefit (PKW-KM): the taxable value for your home-to-work commute with a company car, calculated as 0.03% of the list price × distance in km × months.",
    de: "Geldwerter Vorteil Dienstwagen – Fahrtkosten: der steuerpflichtige Wert für Fahrten zwischen Wohnung und erster Tätigkeitsstätte, berechnet mit 0,03% des Listenpreises × Entfernung × Monate.",
  },
  zuzahlungDienstwagen: {
    en: "Personal contribution to company car (Zuzahlung Dienstwagen): an amount you pay towards your company car, which reduces the taxable benefit in kind accordingly.",
    de: "Zuzahlung Dienstwagen: Ihr Eigenanteil am Firmenwagen, der den steuerpflichtigen geldwerten Vorteil entsprechend mindert.",
  },
  nettoSachzuwendung: {
    en: "Net non-cash benefit §37b EStG: a benefit-in-kind (e.g. gift or voucher) where SIXT pays the flat-rate tax on your behalf, so no additional tax is deducted from your net pay.",
    de: "Netto-Sachzuwendung §37b: ein Sachbezug (z. B. Geschenk oder Gutschein), für den SIXT die Pauschalsteuer übernimmt. Ihnen entsteht dadurch kein weiterer Steuerabzug.",
  },
  gesamtbrutto: {
    en: "Total gross (Gesamtbrutto): sum of all earnings — base salary, benefits in kind, and other additions — before taxes or social security deductions. Used for employer reporting (EBeschV).",
    de: "Gesamtbrutto: Summe aller Entgeltbestandteile — Grundgehalt, geldwerte Vorteile und Zulagen — vor Steuern und Sozialversicherungsabzügen. Wird für Arbeitgeberbescheinigungen (EBeschV) verwendet.",
  },
  steuerBrutto: {
    en: "Taxable gross (Steuer-Brutto, lfd.): the portion of your gross subject to regular income tax. May differ from total gross because some components are taxed separately or at flat rates.",
    de: "Steuer-Brutto, laufend: der Teil Ihres Bruttoentgelts, der der regulären Lohnsteuer unterliegt. Kann vom Gesamtbrutto abweichen, weil bestimmte Bestandteile separat oder pauschal versteuert werden.",
  },
  pauschStb: {
    en: "Flat-rate tax base §37b (Pausch.StB): the value of benefits-in-kind on which SIXT pays a flat 30% tax on your behalf, not charged to your personal income tax.",
    de: "Pauschale Steuerbemessungsgrundlage §37b: der Wert der Sachbezüge, für die SIXT pauschal 30% Lohnsteuer übernimmt. Fließt nicht in Ihre persönliche Lohnsteuer ein.",
  },
  svBruttoKV: {
    en: "Social security gross for health insurance (SV-Brutto KV): the portion of earnings used to calculate health insurance contributions, capped at the statutory contribution ceiling.",
    de: "SV-Brutto KV: der für die Krankenversicherungsbeiträge maßgebliche Bruttoanteil, begrenzt durch die Beitragsbemessungsgrenze zur Krankenversicherung.",
  },
  svBruttoRV: {
    en: "Social security gross for pension insurance (SV-Brutto RV): the portion of earnings used to calculate pension contributions. The ceiling is higher than for health insurance.",
    de: "SV-Brutto RV: der für die Rentenversicherungsbeiträge maßgebliche Bruttoanteil. Diese Grenze liegt höher als bei der Krankenversicherung.",
  },
  lohnsteuer: {
    en: "Wage tax (Lohnsteuer, lfd.): income tax withheld monthly from your regular salary by SIXT and transferred to the tax authority. Amount depends on your tax class, income, and allowances.",
    de: "Lohnsteuer, laufend: die monatlich von SIXT einbehaltene und ans Finanzamt abgeführte Einkommensteuer. Die Höhe hängt von Steuerklasse, Einkommen und Freibeträgen ab.",
  },
  solidaritaetszuschlag: {
    en: "Solidarity surcharge (Solidaritätszuschlag): a supplement on top of income tax. Since 2021 it only applies to higher incomes. If shown, your income exceeds the exemption threshold.",
    de: "Solidaritätszuschlag: ein Aufschlag auf die Lohnsteuer. Seit 2021 gilt er nur noch für höhere Einkommen.",
  },
  rentenversicherung: {
    en: "Pension insurance — employee share (Rentenversicherung, lfd.): currently 9.3% of your pension-relevant gross up to the contribution ceiling. Your employer pays an equal share on top.",
    de: "Rentenversicherung — Arbeitnehmeranteil: aktuell 9,3% des rentenversicherungspflichtigen Bruttos bis zur Beitragsbemessungsgrenze. Ihr Arbeitgeber zahlt den gleichen Anteil zusätzlich.",
  },
  arbeitslosenversicherung: {
    en: "Unemployment insurance — employee share (Arbeitslosenversicherung): currently 1.3% of relevant gross up to the ceiling. Your employer pays an equal share on top.",
    de: "Arbeitslosenversicherung — Arbeitnehmeranteil: aktuell 1,3% des maßgeblichen Bruttos bis zur Beitragsbemessungsgrenze. Ihr Arbeitgeber zahlt den gleichen Anteil zusätzlich.",
  },
  gesetzlNetto: {
    en: "Statutory net (Gesetzl. Netto): gross minus statutory deductions (income tax, solidarity surcharge, employee social security). Before voluntary deductions such as private health insurance.",
    de: "Gesetzliches Netto: Brutto abzüglich gesetzlicher Abzüge (Lohnsteuer, Solidaritätszuschlag, Arbeitnehmer-Sozialversicherung). Noch vor freiwilligen Abzügen wie dem privaten KV-Beitrag.",
  },
  agZuschussKV: {
    en: "Employer subsidy for private health insurance (AG-Zuschuss KV): since you have private health insurance, your employer must pay a subsidy of up to 50% of the standard GKV rate, capped at half your actual premium.",
    de: "Arbeitgeberzuschuss zur privaten KV: Da Sie privat krankenversichert sind, zahlt Ihr Arbeitgeber einen Zuschuss von bis zu 50% des GKV-Beitragssatzes — maximal die Hälfte Ihres tatsächlichen Beitrags.",
  },
  agZuschussPV: {
    en: "Employer subsidy for private long-term care insurance (AG-Zuschuss PV): your employer contributes up to half of the statutory long-term care rate toward your private premium.",
    de: "Arbeitgeberzuschuss zur privaten PV: Ihr Arbeitgeber übernimmt bis zur Hälfte des gesetzlichen Pflegeversicherungssatzes als Beitrag zu Ihrer privaten Pflegeversicherung.",
  },
  abgefBeitragKV: {
    en: "Private health insurance premium deducted (Abgef. Beitrag freiw. KV): your full monthly private health insurance premium, deducted from net pay. The AG-Zuschuss KV offsets part of this.",
    de: "Abgeführter Beitrag zur privaten KV: der volle monatliche Beitrag zu Ihrer privaten Krankenversicherung, abgezogen vom Nettogehalt. Der AG-Zuschuss KV erstattet einen Teil davon.",
  },
  abgefBeitragPV: {
    en: "Private long-term care insurance premium deducted (Abgef. Beitrag freiw. PV): your full monthly private long-term care premium, deducted from net pay.",
    de: "Abgeführter Beitrag zur privaten PV: der volle monatliche Beitrag zu Ihrer privaten Pflegeversicherung, abgezogen vom Nettogehalt.",
  },
  einmNetto37b: {
    en: "One-time net benefit §37b: the net value of a benefit-in-kind taxed by SIXT at the flat rate. Appears as a deduction here to balance the accounting.",
    de: "Einmaliges Netto geldwerter Vorteil §37b: der Nettowert eines Sachbezugs, der von SIXT pauschal versteuert wurde. Erscheint als Abzug zur Saldierung der Abrechnung.",
  },
  aufrollung: {
    en: "Retroactive correction (Aufrollung / Aufrollungsdifferenz): a recalculation of a prior payroll period due to a salary change or correction. Positive = additional payment; negative = recovery of overpayment.",
    de: "Aufrollung / Aufrollungsdifferenz: Neuberechnung eines zurückliegenden Zeitraums wegen Gehaltsänderung oder Korrektur. Positiv = Nachzahlung; negativ = Rückforderung.",
  },
  ueberweisung: {
    en: "Bank transfer (Überweisung): the actual amount transferred to your bank account — your final take-home pay after all taxes, social security, insurance premiums, and other deductions.",
    de: "Überweisung: der tatsächlich auf Ihr Bankkonto überwiesene Betrag — Ihr Auszahlungsbetrag nach allen Steuern, Sozialversicherungen, Versicherungsbeiträgen und sonstigen Abzügen.",
  },
  stKlasse: {
    en: "Tax class (Steuerklasse): determines your income tax rate. Class 3 = married, spouse earns significantly less. Class 4 = married couples with similar incomes.",
    de: "Steuerklasse: bestimmt Ihren Lohnsteuersatz. Klasse 3 = verheiratet, Partner verdient deutlich weniger. Klasse 4 = Ehepaare mit ähnlichem Einkommen.",
  },
  rvNummer: {
    en: "Pension insurance number (RV-Nummer): your personal social security identifier, tracking all pension contributions over your working life.",
    de: "Rentenversicherungsnummer: Ihre persönliche Sozialversicherungskennung zur Erfassung aller Rentenbeiträge über Ihr gesamtes Berufsleben.",
  },
  stIdentnummer: {
    en: "Tax identification number (ST-Identnummer): your permanent personal tax ID assigned by the German Federal Central Tax Office. It never changes.",
    de: "Steueridentifikationsnummer: Ihre lebenslange persönliche Steuer-ID, zugeteilt vom Bundeszentralamt für Steuern. Sie ändert sich nie.",
  },
  nachverrechnung: {
    en: "Subsequent settlement (Nachverrechnung aus Vormonat): an additional payment from a prior period processed in this month's payroll.",
    de: "Nachverrechnung aus dem Vormonat: eine Nachzahlung aus einem früheren Zeitraum, die in der aktuellen Abrechnung verarbeitet wurde.",
  },
};

// ─────────────────────────────────────────────────────────────
// SAMPLE DATA — anonymised
// ─────────────────────────────────────────────────────────────
const sampleDataDE = {
  employer: { name: "SXT Dienst. GmbH & Co. KG", address: "Grubenstraße 27, 18055 Rostock" },
  employee: { name: "Max Mustermann", address: "Musterstraße 1, 18055 Rostock", workdayId: "9000000001", geburtsdatum: "01.01.1990", eintritt: "01.04.2022", austritt: "—", kostenstelle: "RAC_719_HR P", abteilung: "—" },
  payroll: { period: "Februar 2026", date: "18.02.2026", currency: "EUR", steuerSVTage: "30 / 30" },
  tax: { stIdentnummer: "XX XXX XXX XXX", rvNummerSvKz: "XX XXXXXX X XXX / 9111", stKlasse: "4 / 0,862 / 2,0", kirchensteuer: "— / —", krankenkasse: "Mobil Krankenkasse (Privat)", avAN: "1,30 %", rvAN: "9,30 %" },
  entgeltbestandteile: [
    { code: "1101",  label: "Grundgehalt",              kenn: "LSG", monat: "9.416,67",  tooltipKey: "grundgehalt" },
    { code: "4946",  label: "Netto Sachzuwendung §37b", kenn: "",    monat: "77,58",     tooltipKey: "nettoSachzuwendung" },
    { code: "8421",  label: "Zuzahlung Dienstwagen",    kenn: "LSG", monat: "85,00–",    tooltipKey: "zuzahlungDienstwagen" },
    { code: "/425",  label: "PKW-Wert gw.Vorteil",      kenn: "LSG", monat: "597,00",    tooltipKey: "pkwWert" },
    { code: "/426",  label: "PKW-KM gw.Vorteil",        kenn: "LSG", monat: "125,37",    tooltipKey: "pkwKm" },
  ],
  bruttoentgelte: [
    { code: "/10E", label: "Gesamtbrutto (EBeschV)",  monat: "10.131,62", jahr: "20.238,72", tooltipKey: "gesamtbrutto", bold: true },
    { code: "Y$04", label: "Steuer-Brutto, lfd.",     monat: "10.054,04", jahr: "20.108,08", tooltipKey: "steuerBrutto" },
    { code: "P3BH", label: "Pausch.StB §37b AG",      monat: "77,58",     jahr: "130,64",    tooltipKey: "pauschStb" },
    { code: "Y$05", label: "SV-Brutto KV, lfd.",      monat: "5.812,50",  jahr: "11.625,00", tooltipKey: "svBruttoKV" },
    { code: "Y$06", label: "SV-Brutto RV, lfd.",      monat: "8.450,00",  jahr: "16.900,00", tooltipKey: "svBruttoRV" },
    { code: "Y$51", label: "SV-Brutto AV, lfd.",      monat: "8.450,00",  jahr: "16.900,00", tooltipKey: "svBruttoRV" },
    { code: "Y$08", label: "SV-Brutto PV, lfd.",      monat: "5.812,50",  jahr: "11.625,00", tooltipKey: "svBruttoKV" },
  ],
  gesetzlicheAbzuege: [
    { code: "Y$33", label: "Lohnsteuer, lfd.",            monat: "2.296,41–", jahr: "4.592,82",  tooltipKey: "lohnsteuer" },
    { code: "Y$31", label: "Solidaritätszuschlag, lfd.",  monat: "36,43–",    jahr: "72,86",     tooltipKey: "solidaritaetszuschlag" },
    { code: "Y$21", label: "Rentenversicherung, lfd.",    monat: "785,85–",   jahr: "1.571,70",  tooltipKey: "rentenversicherung" },
    { code: "Y$22", label: "Arbeitslosenvers., lfd.",     monat: "109,85–",   jahr: "219,70",    tooltipKey: "arbeitslosenversicherung" },
  ],
  gesetzlNetto: { code: "/55E", label: "Gesetzl. Netto (EBeschV)", monat: "6.903,08", tooltipKey: "gesetzlNetto" },
  sonstigeAbzuege: [
    { code: "/552",  label: "Nachverrechnung aus Vormonat", monat: "110,55",    jahr: "",          tooltipKey: "nachverrechnung" },
    { code: "95A6",  label: "Einm.Netto gw.Vortl §37b",    monat: "130,64–",   jahr: "",          tooltipKey: "einmNetto37b" },
    { code: "Y139",  label: "AG-Zuschuss KV",               monat: "537,36",    jahr: "1.074,72",  tooltipKey: "agZuschussKV" },
    { code: "/3Q8",  label: "AG-Zuschuss PV",               monat: "104,63",    jahr: "209,26",    tooltipKey: "agZuschussPV" },
    { code: "Y137",  label: "Abgef. Beitrag freiw. KV",     monat: "1.074,74–", jahr: "2.149,48–", tooltipKey: "abgefBeitragKV" },
    { code: "Y128",  label: "Abgef. Beitrag freiw. PV",     monat: "194,72–",   jahr: "389,44–",   tooltipKey: "abgefBeitragPV" },
    { code: "/425",  label: "PKW-Wert gw.Vorteil",          monat: "597,00–",   jahr: "1.194,00–", tooltipKey: "pkwWert" },
    { code: "/426",  label: "PKW-KM gw.Vorteil",            monat: "125,37–",   jahr: "250,74–",   tooltipKey: "pkwKm" },
  ],
  ueberweisung: { code: "/559", label: "Überweisung", monat: "5.586,21", bank: "DE** **** **** **** **** **", tooltipKey: "ueberweisung" },
};

// ─────────────────────────────────────────────────────────────
// TOOLTIP COMPONENT
// ─────────────────────────────────────────────────────────────
function Tooltip({ tooltip, anchorRef, visible }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (visible && anchorRef.current) {
      const root = document.getElementById("payslip-root");
      const rRect = anchorRef.current.getBoundingClientRect();
      const cRect = root ? root.getBoundingClientRect() : { left: 0, top: 0, width: 900 };
      const rawLeft = rRect.left - cRect.left;
      const maxLeft = (cRect.width || 900) - 324;
      setPos({ top: rRect.bottom - cRect.top + 8, left: Math.max(4, Math.min(rawLeft, maxLeft)) });
    }
  }, [visible, anchorRef]);

  if (!visible || !tooltip) return null;

  return (
    <div style={{
      position: "absolute",
      top: pos.top,
      left: pos.left,
      width: 316,
      zIndex: 9999,
      pointerEvents: "none",
      background: T.tooltipBg,
      border: `1.5px solid ${T.tooltipBorder}`,
      borderRadius: 10,
      padding: "14px 16px",
      boxSizing: "border-box",
    }}>
      <div style={{ marginBottom: 11 }}>
        <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 5 }}>English</div>
        <div style={{ fontSize: 12.5, color: T.white, lineHeight: 1.65 }}>{tooltip.en}</div>
      </div>
      <div style={{ borderTop: `0.5px solid ${T.borderGray}`, paddingTop: 11 }}>
        <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 5 }}>Deutsch</div>
        <div style={{ fontSize: 12.5, color: T.textSecond, lineHeight: 1.65 }}>{tooltip.de}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INFO BADGE
// ─────────────────────────────────────────────────────────────
function InfoBadge({ active }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 14, height: 14, borderRadius: "50%",
      border: `1px solid ${active ? T.orange : T.borderGray}`,
      fontSize: 9, color: active ? T.orange : T.textMuted,
      fontStyle: "italic", flexShrink: 0, marginLeft: 5,
      background: active ? "rgba(255,95,0,0.12)" : "transparent",
    }}>i</span>
  );
}

// ─────────────────────────────────────────────────────────────
// TABLE ROW
// ─────────────────────────────────────────────────────────────
function Row({ code, label, kenn, monat, jahr, tooltipKey, tooltips, active, setActive, bold, highlight }) {
  const ref = useRef(null);
  const isActive = active === tooltipKey;
  const hasTooltip = !!tooltipKey && !!tooltips[tooltipKey];

  return (
    <tr ref={ref}
      onMouseEnter={() => hasTooltip && setActive(tooltipKey)}
      onMouseLeave={() => hasTooltip && setActive(null)}
      style={{ background: isActive ? "rgba(255,95,0,0.08)" : highlight ? "rgba(255,255,255,0.03)" : "transparent", cursor: hasTooltip ? "help" : "default", transition: "background 0.1s" }}>
      <td style={{ padding: "5px 8px", fontSize: 11.5, color: T.textMuted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{code}</td>
      <td style={{ padding: "5px 4px", fontSize: 12.5, fontWeight: bold ? 500 : 400, color: bold ? T.white : T.textSecond }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          {label}
          {hasTooltip && <InfoBadge active={isActive} />}
        </span>
      </td>
      <td style={{ padding: "5px 6px", fontSize: 11.5, color: T.textMuted, textAlign: "center" }}>{kenn || ""}</td>
      <td style={{ padding: "5px 8px", fontSize: 12.5, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: bold ? 500 : 400, color: bold ? T.white : T.textSecond }}>{monat || ""}</td>
      <td style={{ padding: "5px 8px", fontSize: 12, textAlign: "right", fontVariantNumeric: "tabular-nums", color: T.textMuted }}>{jahr || ""}</td>
      {hasTooltip && <Tooltip tooltip={tooltips[tooltipKey]} anchorRef={ref} visible={isActive} />}
    </tr>
  );
}

function SectionHeader({ label }) {
  return (
    <tr>
      <td colSpan={5} style={{
        padding: "12px 8px 5px",
        fontSize: 10, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: T.orange,
        borderTop: `0.5px solid ${T.borderGray}`,
        borderBottom: `0.5px solid ${T.borderGray}`,
      }}>{label}</td>
    </tr>
  );
}

function Spacer() { return <tr><td colSpan={5} style={{ height: 4 }} /></tr>; }

// ─────────────────────────────────────────────────────────────
// INFO FIELD (header area)
// ─────────────────────────────────────────────────────────────
function InfoField({ label, value, tooltipKey, tooltips, active, setActive }) {
  const ref = useRef(null);
  const isActive = active === tooltipKey;
  const hasTooltip = !!tooltipKey && !!tooltips[tooltipKey];
  return (
    <div ref={ref}
      onMouseEnter={() => hasTooltip && setActive(tooltipKey)}
      onMouseLeave={() => hasTooltip && setActive(null)}
      style={{ padding: "5px 8px", borderRadius: 6, background: isActive ? "rgba(255,95,0,0.08)" : "transparent", cursor: hasTooltip ? "help" : "default" }}>
      <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: T.white, display: "flex", alignItems: "center" }}>
        {value}
        {hasTooltip && <InfoBadge active={isActive} />}
      </div>
      {hasTooltip && <Tooltip tooltip={tooltips[tooltipKey]} anchorRef={ref} visible={isActive} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GERMANY PAYSLIP
// ─────────────────────────────────────────────────────────────
function PayslipDE({ data, tooltips }) {
  const [active, setActive] = useState(null);
  const d = data;
  const rp = { tooltips, active, setActive };
  const fp = { tooltips, active, setActive };

  return (
    <div id="payslip-root" style={{ position: "relative", background: T.darkGray, borderRadius: 12, overflow: "visible" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px 16px", background: T.surface, borderRadius: "12px 12px 0 0", borderBottom: `1px solid ${T.borderGray}` }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.09em", color: T.orange, marginBottom: 5 }}>Entgeltabrechnung</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: T.white, marginBottom: 4 }}>Payslip · {d.payroll.period}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>Datum: {d.payroll.date} · Währung: {d.payroll.currency}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: T.white }}>{d.employer.name}</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{d.employer.address}</div>
        </div>
      </div>

      {/* EMPLOYEE + TAX DETAILS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `0.5px solid ${T.borderGray}` }}>
        <div style={{ padding: "14px 16px", borderRight: `0.5px solid ${T.borderGray}` }}>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 8 }}>Employee · persönlich/vertraulich</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.white, marginBottom: 3 }}>{d.employee.name}</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 10 }}>{d.employee.address}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <InfoField label="Workday ID"   value={d.employee.workdayId}    tooltipKey="workdayId"   {...fp} />
            <InfoField label="Geburtsdatum" value={d.employee.geburtsdatum} />
            <InfoField label="Eintritt"     value={d.employee.eintritt} />
            <InfoField label="Austritt"     value={d.employee.austritt} />
            <InfoField label="Kostenstelle" value={d.employee.kostenstelle} tooltipKey="kostenstelle" {...fp} />
            <InfoField label="Abteilung"    value={d.employee.abteilung} />
          </div>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 8 }}>Tax &amp; Social Security</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <InfoField label="ST-Identnummer"          value={d.tax.stIdentnummer}  tooltipKey="stIdentnummer"        {...fp} />
            <InfoField label="RV-Nummer / SV-Kz"       value={d.tax.rvNummerSvKz}   tooltipKey="rvNummer"             {...fp} />
            <InfoField label="ST-Klasse / Fakt. / Ki." value={d.tax.stKlasse}        tooltipKey="stKlasse"             {...fp} />
            <InfoField label="Kirchensteuer"           value={d.tax.kirchensteuer} />
            <InfoField label="Krankenkasse"            value={d.tax.krankenkasse} />
            <InfoField label="Steuer-/SV-Tage"         value={d.payroll.steuerSVTage} />
            <InfoField label="AV-AN"                   value={d.tax.avAN}           tooltipKey="arbeitslosenversicherung" {...fp} />
            <InfoField label="RV-AN"                   value={d.tax.rvAN}           tooltipKey="rentenversicherung"   {...fp} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ padding: "4px 8px 12px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.borderGray}` }}>
              {[["Lohnart","left"],["Entgeltbestandteile","left"],["Kenn","center"],["Monat","right"],["Jahressummen","right"]].map(([h, a]) => (
                <th key={h} style={{ padding: "10px 8px 7px", fontSize: 10, fontWeight: 500, textAlign: a, color: T.orange, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Spacer />
            {d.entgeltbestandteile.map((r, i) => <Row key={i} {...r} {...rp} />)}
            <Spacer />
            <SectionHeader label="Bruttoentgelte" />
            {d.bruttoentgelte.map((r, i) => <Row key={i} {...r} {...rp} />)}
            <Spacer />
            <SectionHeader label="Gesetzliche Abzüge" />
            {d.gesetzlicheAbzuege.map((r, i) => <Row key={i} {...r} {...rp} />)}
            <Spacer />
            <Row code={d.gesetzlNetto.code} label={d.gesetzlNetto.label} monat={d.gesetzlNetto.monat} tooltipKey={d.gesetzlNetto.tooltipKey} bold highlight {...rp} />
            <Spacer />
            <SectionHeader label="Sonstige Be-/Abzüge" />
            {d.sonstigeAbzuege.map((r, i) => <Row key={i} {...r} {...rp} />)}
            <Spacer />
            <SectionHeader label="Überweisungen" />
            <Row code={d.ueberweisung.code} label={d.ueberweisung.label} monat={d.ueberweisung.monat} tooltipKey={d.ueberweisung.tooltipKey} bold {...rp} />
          </tbody>
        </table>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "0 14px 14px" }}>
        {[
          { label: "Gesamtbrutto",   value: "10.131,62 €", sub: "Total gross earnings",             accent: false },
          { label: "Gesetzl. Netto", value: "6.903,08 €",  sub: "After taxes & social security",    accent: false },
          { label: "Überweisung",    value: "5.586,21 €",  sub: "Transferred to your bank account", accent: true  },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} style={{ background: accent ? "rgba(255,95,0,0.12)" : T.surface, border: `1px solid ${accent ? T.orange : T.borderGray}`, borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: accent ? T.orange : T.textMuted, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 500, color: accent ? T.orange : T.white, marginBottom: 3 }}>{value}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* BANK INFO */}
      <div style={{ margin: "0 14px 14px", padding: "10px 14px", background: T.surface, border: `0.5px solid ${T.borderGray}`, borderRadius: 8, fontSize: 12, color: T.textMuted, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 500, color: T.white }}>Information zur Überweisung:</span>
        <span>5.586,21 EUR · {d.employee.name} · {d.ueberweisung.bank}</span>
      </div>

      {/* FOOTER NOTE */}
      <div style={{ margin: "0 14px 18px", padding: "10px 14px", border: `0.5px solid ${T.borderGray}`, borderRadius: 8, fontSize: 11, color: T.textMuted, lineHeight: 1.7 }}>
        <span style={{ color: T.white, fontWeight: 500 }}>"Workday Help:</span> Hilft bei Fragen zur Gehaltsabrechnung" · Kennz.: (E)inmalzahlung, (L)ohnsteuer-, (S)V-pflichtig, (G)esamtbrutto · Bescheinigung nach § 108 Absatz 3 Satz 1 Gewerbeordnung
        <span style={{ color: T.borderGray }}> · </span>
        Sample payslip — all data is anonymised. Real employee figures are not stored here.
      </div>
    </div>
  );
}

function PayslipRenderer({ countryCode }) {
  if (countryCode === "DE") return <PayslipDE data={sampleDataDE} tooltips={tooltipsDE} />;
  return null;
}

// ─────────────────────────────────────────────────────────────
// COUNTRY SELECTOR
// ─────────────────────────────────────────────────────────────
function CountrySelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ ...s.page, padding: "48px 28px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 52 }}>
        <div style={{ background: T.orange, color: T.white, fontWeight: 500, fontSize: 16, letterSpacing: "0.08em", padding: "6px 12px", borderRadius: 5 }}>SIXT</div>
        <div style={{ fontSize: 13, color: T.textMuted }}>Employee Portal</div>
      </div>
      <div style={{ marginBottom: 44, maxWidth: 560 }}>
        <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: T.orange, marginBottom: 12 }}>Payroll &amp; Compensation</div>
        <h1 style={{ fontSize: 36, fontWeight: 500, margin: "0 0 14px", color: T.white, lineHeight: 1.2 }}>Understand your payslip</h1>
        <p style={{ fontSize: 15, color: T.textMuted, margin: 0, lineHeight: 1.7 }}>
          Select your country to explore a sample payslip and learn what each field means — in English and your local language.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 10, marginBottom: 32 }}>
        {Object.entries(countryConfig).map(([code, c]) => {
          const isHov = hovered === code;
          return (
            <button key={code}
              onClick={() => c.active && onSelect(code)}
              onMouseEnter={() => setHovered(code)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHov && c.active ? "rgba(255,95,0,0.1)" : T.surfaceCard,
                border: `1px solid ${isHov && c.active ? T.orange : T.borderGray}`,
                borderRadius: 10, padding: "18px 14px",
                cursor: c.active ? "pointer" : "not-allowed",
                opacity: c.active ? 1 : 0.4, textAlign: "left", position: "relative",
                transition: "border-color 0.15s, background 0.15s",
              }}>
              <div style={{ fontSize: 26, marginBottom: 9, lineHeight: 1 }}>{c.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: isHov && c.active ? T.orange : T.white, marginBottom: 3, transition: "color 0.15s" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{code}</div>
              {!c.active && (
                <div style={{ position: "absolute", top: 9, right: 9, fontSize: 10, fontWeight: 500, background: T.midGray, color: T.textMuted, padding: "2px 7px", borderRadius: 4, border: `0.5px solid ${T.borderGray}` }}>Soon</div>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ maxWidth: 540, padding: "14px 18px", background: T.surfaceCard, border: `0.5px solid ${T.borderGray}`, borderRadius: 10, fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
        <span style={{ fontWeight: 500, color: T.white }}>How it works: </span>
        Hover any field marked with an <span style={{ fontStyle: "italic", border: `0.5px solid ${T.borderGray}`, borderRadius: "50%", padding: "0 4px", fontSize: 10, color: T.orange }}>i</span> indicator to see a bilingual explanation in English and German.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [country, setCountry] = useState(null);

  if (!country) return <CountrySelector onSelect={setCountry} />;

  const c = countryConfig[country];
  return (
    <div style={{ ...s.page, padding: "20px 20px 52px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ background: T.orange, color: T.white, fontWeight: 500, fontSize: 16, letterSpacing: "0.08em", padding: "6px 12px", borderRadius: 5 }}>SIXT</div>
        <span style={{ fontSize: 13, color: T.textMuted }}>Employee Portal</span>
        <span style={{ fontSize: 13, color: T.borderGray }}>›</span>
        <span style={{ fontSize: 13, color: T.textMuted }}>Understand your payslip</span>
        <span style={{ fontSize: 13, color: T.borderGray }}>›</span>
        <span style={{ fontSize: 13, color: T.white }}>{c.flag} {c.name}</span>
        <button onClick={() => setCountry(null)} style={{ marginLeft: "auto", fontSize: 12, color: T.textSecond, background: "transparent", border: `0.5px solid ${T.borderGray}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>← Change country</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 5px", color: T.white }}>Sample payslip — {c.name}</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>
          Hover any <span style={{ fontStyle: "italic", border: `1px solid ${T.borderGray}`, borderRadius: "50%", padding: "0 4px", fontSize: 10, color: T.orange }}>i</span> field for a bilingual explanation. All data shown is anonymised.
        </p>
      </div>
      <PayslipRenderer countryCode={country} />
    </div>
  );
}