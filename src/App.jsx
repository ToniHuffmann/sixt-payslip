import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// THEME — dark / light tokens
// ─────────────────────────────────────────────────────────────
const themes = {
  dark: {
    pageBg:       "#0A0A0A",
    surface:      "#141414",
    surfaceCard:  "#1E1E1E",
    surfaceHover: "#252525",
    border:       "#3A3A3A",
    borderHover:  "#555555",
    text:         "#FFFFFF",
    textSecond:   "#BBBBBB",
    textMuted:    "#888888",
    tooltipBg:    "#1A1A1A",
    rowHover:     "rgba(255,95,0,0.08)",
    summaryCard:  "#141414",
    orange:       "#FF5F00",
  },
  light: {
    pageBg:       "#F5F5F5",
    surface:      "#FFFFFF",
    surfaceCard:  "#FFFFFF",
    surfaceHover: "#FFF5EF",
    border:       "#DDDDDD",
    borderHover:  "#BBBBBB",
    text:         "#111111",
    textSecond:   "#444444",
    textMuted:    "#888888",
    tooltipBg:    "#FFFFFF",
    rowHover:     "rgba(255,95,0,0.06)",
    summaryCard:  "#F9F9F9",
    orange:       "#FF5F00",
  },
};

// ─────────────────────────────────────────────────────────────
// COUNTRY CONFIG
// ─────────────────────────────────────────────────────────────
const countryConfig = {
  DE:  { name: "Germany",        flag: "🇩🇪", active: true,  currency: "EUR", lang: "Deutsch" },
  AT:  { name: "Austria",        flag: "🇦🇹", active: true,  currency: "EUR", lang: "Deutsch" },
  CH:  { name: "Switzerland",    flag: "🇨🇭", active: true,  currency: "CHF", lang: "Deutsch" },
  IT:  { name: "Italy",          flag: "🇮🇹", active: true,  currency: "EUR", lang: "Italiano" },
  BE:  { name: "Belgium",        flag: "🇧🇪", active: true,  currency: "EUR", lang: "Nederlands" },
  LUX: { name: "Luxembourg",     flag: "🇱🇺", active: true,  currency: "EUR", lang: "Français" },
  NL:  { name: "Netherlands",    flag: "🇳🇱", active: true,  currency: "EUR", lang: "Nederlands" },
  ES:  { name: "Spain",          flag: "🇪🇸", active: true,  currency: "EUR", lang: "Español" },
  PT:  { name: "Portugal",       flag: "🇵🇹", active: true,  currency: "EUR", lang: "Português" },
  UK:  { name: "United Kingdom", flag: "🇬🇧", active: true,  currency: "GBP", lang: "English" },
  FR:  { name: "France",         flag: "🇫🇷", active: true,  currency: "EUR", lang: "Français" },
  MC:  { name: "Monaco",         flag: "🇲🇨", active: true,  currency: "EUR", lang: "Français" },
};

// ─────────────────────────────────────────────────────────────
// DE SCENARIO DATA — real anonymised SIXT payslips, März 2026
// ─────────────────────────────────────────────────────────────
const DE_DATA = {
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
  dienstrad: {
    meta: { name: "Jonas Weber", workdayId: "W-00061345", kostenstelle: "RAC_001_HR_F", period: "März 2026", eintritt: "01.02.2022", stKlasse: "1", krankenkasse: "BKK firmus", kvRate: "8,390%", pvRate: "2,4000%", avRate: "1,30%", rvRate: "9,30%", svTage: "30 / 30" },
    entgelt: [
      { code: "1101", label: "Grundgehalt",          kenn: "LSG", betrag: "3.640,00" },
      { code: "8432", label: "Fahrrad 2 Grundrate",  kenn: "LSG", betrag: "53,50",  minus: true, highlight: true },
      { code: "3065", label: "Fahrrad 1 gw.Vorteil", kenn: "LSG", betrag: "7,00",              highlight: true },
    ],
    brutto: [
      { code: "/10E", label: "Gesamtbrutto (EBeschV)",   betrag: "3.593,50" },
      { code: "Y$04", label: "Steuer-Brutto, lfd.",      betrag: "3.593,50" },
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
  firmenwagen: {
    meta: { name: "Max Mustermann", workdayId: "W-00039867", kostenstelle: "RAC_719_HR_P", period: "März 2026", eintritt: "01.04.2022", stKlasse: "4", krankenkasse: "TK", kvRate: "7,300%", pvRate: "1,7000%", avRate: "1,30%", rvRate: "9,30%", svTage: "30 / 30" },
    entgelt: [
      { code: "1101", label: "Grundgehalt",           kenn: "LSG", betrag: "9.416,67" },
      { code: "8421", label: "Zuzahlung Dienstwagen", kenn: "LSG", betrag: "85,00",   minus: true, highlight: true },
      { code: "/425", label: "PKW-Wert gw.Vorteil",   kenn: "LSG", betrag: "597,00",             highlight: true },
      { code: "/426", label: "PKW-KM gw.Vorteil",     kenn: "LSG", betrag: "125,37",             highlight: true },
    ],
    brutto: [
      { code: "/10E", label: "Gesamtbrutto (EBeschV)",   betrag: "10.054,04" },
      { code: "Y$04", label: "Steuer-Brutto, lfd.",      betrag: "10.054,04" },
      { code: "P3BH", label: "Pausch.StB §37b AG",       betrag: "130,64",   dim: true },
      { code: "Y$05", label: "SV-Brutto KV, lfd.",       betrag: "5.812,50" },
      { code: "Y$06", label: "SV-Brutto RV, lfd.",       betrag: "8.450,00" },
      { code: "Y$51", label: "SV-Brutto AV, lfd.",       betrag: "8.450,00" },
      { code: "Y$08", label: "SV-Brutto PV, lfd.",       betrag: "5.812,50" },
    ],
    abzuege: [
      { code: "Y$33", label: "Lohnsteuer, lfd.",           betrag: "2.296,41", minus: true },
      { code: "Y$31", label: "Solidaritätszuschlag, lfd.", betrag: "36,43",    minus: true },
      { code: "Y$20", label: "Krankenversicherung, lfd.",  betrag: "424,31",   minus: true },
      { code: "Y$21", label: "Rentenversicherung, lfd.",   betrag: "785,85",   minus: true },
      { code: "Y$22", label: "Arbeitslosenvers., lfd.",    betrag: "109,85",   minus: true },
      { code: "Y$23", label: "Pflegeversicherung, lfd.",   betrag: "98,81",    minus: true },
    ],
    gesetzlNetto: "6.302,58",
    sonstige: [
      { code: "95A6", label: "Einm.Netto gw.Vortl §37b", betrag: "130,64", minus: true, dim: true },
      { code: "/425", label: "PKW-Wert gw.Vorteil",       betrag: "597,00", minus: true, highlight: true },
      { code: "/426", label: "PKW-KM gw.Vorteil",         betrag: "125,37", minus: true, highlight: true },
    ],
    ueberweisung: "5.449,57",
  },
};

const DE_TIPS = {
  "1101":  { en: "Base salary (Grundgehalt): your fixed contractual monthly gross salary. Starting point for all tax and social security calculations on this payslip.", de: "Grundgehalt: Ihr festes vertraglich vereinbartes monatliches Bruttogehalt. Ausgangspunkt für alle Steuer- und Sozialversicherungsberechnungen." },
  "3052":  { en: "Public transport subsidy (ÖPNV-Zuschuss): SIXT contributes €20/month towards your transport costs. Taxed flat-rate by SIXT under §40(2) EStG — SIXT pays the tax, not you. Therefore NOT in your personal Steuer-Brutto or SV-Brutto. You receive the full €20 with no personal deduction. Kenn 'G' = Gesamtbrutto only.", de: "ÖPNV-Zuschuss: SIXT zahlt 20 €/Monat zu Ihren Fahrtkosten. Von SIXT pauschal nach §40(2) EStG versteuert — SIXT trägt die Steuer. Nicht im persönlichen Steuerbrutto oder SV-Brutto. Sie erhalten 20 € vollständig. Kennzeichen 'G' = nur Gesamtbrutto." },
  "8432":  { en: "Bike lease rate (Fahrrad Grundrate): the monthly leasing instalment deducted from your gross salary before tax via salary conversion (Gehaltsumwandlung). Reduces your taxable gross — you pay less income tax and social security than on a comparable cash salary.", de: "Fahrrad-Grundrate: monatliche Leasingrate, die per Gehaltsumwandlung vom Bruttogehalt vor Steuer abgezogen wird. Senkt Ihr Steuerbrutto — weniger Lohnsteuer und SV als bei vergleichbarem Barlohn." },
  "3065":  { en: "Company bike benefit in kind (geldwerter Vorteil Fahrrad): taxable value for private use of the leased bike — 0.25% of gross list price per month. Added to taxable gross for tax/SV purposes, then deducted again from net pay (see Sonstige). No cash flows to you.", de: "Geldwerter Vorteil Fahrrad: steuerpflichtiger Wert der Privatnutzung, 0,25% des Bruttolistenpreises/Monat. Dem Steuerbrutto zugeschlagen, im Netto wieder abgezogen (siehe Sonstige). Keine Barauszahlung." },
  "8421":  { en: "Personal contribution to company car (Zuzahlung Dienstwagen): your monthly payment towards the car, which directly reduces the taxable benefit in kind — lowering your income tax liability.", de: "Zuzahlung Dienstwagen: Ihr monatlicher Eigenanteil am Firmenwagen. Mindert direkt den geldwerten Vorteil — und damit Ihre Lohnsteuer." },
  "/425":  { en: "Company car benefit in kind – list price (PKW-Wert gw.Vorteil): taxable value of private car use, calculated as 1% of the car's gross list price per month. Increases your taxable gross — no cash payment to you. Deducted again from net pay in Sonstige.", de: "Geldwerter Vorteil PKW-Wert: steuerpflichtiger Wert der Privatnutzung, 1% des Bruttolistenpreises/Monat. Erhöht das Steuerbrutto — keine Barauszahlung. Wird in Sonstige wieder vom Netto abgezogen." },
  "/426":  { en: "Company car commute benefit (PKW-KM gw.Vorteil): additional taxable value for home-to-work trips with the company car. Calculated as 0.03% of list price × distance in km × working months. Also deducted from net pay in Sonstige.", de: "PKW-KM geldwerter Vorteil: zusätzlicher Sachbezug für Fahrten Wohnung–Arbeit. Berechnung: 0,03% des Listenpreises × Entfernung km × Monate. Wird ebenfalls in Sonstige vom Netto abgezogen." },
  "/10E":  { en: "Total gross (Gesamtbrutto, EBeschV): sum of all earnings components including flat-rate taxed benefits like the ÖPNV subsidy. Used for employer certificates and year-end reporting.", de: "Gesamtbrutto (EBeschV): Summe aller Entgeltbestandteile einschließlich pauschal versteuerter Benefits wie dem ÖPNV-Zuschuss. Basis für Arbeitgeberbescheinigungen und Jahresmeldung." },
  "Y$04":  { en: "Taxable gross, ongoing (Steuer-Brutto, lfd.): the portion of your earnings subject to personal income tax each month. Flat-rate taxed items (e.g. ÖPNV subsidy) and one-off payments are excluded.", de: "Steuer-Brutto, laufend: der monatlich der persönlichen Lohnsteuer unterliegende Teil. Pauschal versteuerte Bestandteile (z. B. ÖPNV-Zuschuss) und Einmalzahlungen sind ausgenommen." },
  "P42H":  { en: "Flat-rate income tax §40(2) EStG, paid by employer: SIXT pays this tax on the ÖPNV subsidy on your behalf. Does not reduce your net pay.", de: "Pauschalsteuer §40(2) EStG, vom Arbeitgeber: SIXT zahlt diese Steuer auf den ÖPNV-Zuschuss für Sie. Kein Abzug von Ihrem Netto." },
  "P3BH":  { en: "Flat-rate income tax §37b EStG, paid by employer: covers non-cash benefits (e.g. gifts/vouchers) where SIXT bears the tax. No effect on your net pay.", de: "Pauschalsteuer §37b EStG, vom Arbeitgeber: Für Sachzuwendungen trägt SIXT die Steuer. Kein Einfluss auf Ihr Netto." },
  "Y$05":  { en: "SV gross for health insurance (SV-Brutto KV): income base for your health insurance contribution. Capped at the KV contribution ceiling (2026: €5,512.50/month).", de: "SV-Brutto KV: Bemessungsgrundlage für Krankenversicherungsbeiträge. Begrenzt auf die KV-Beitragsbemessungsgrenze (2026: 5.512,50 €/Monat)." },
  "Y$06":  { en: "SV gross for pension insurance (SV-Brutto RV): income base for pension insurance. Capped at the RV ceiling (2026: €8,450/month West Germany).", de: "SV-Brutto RV: Bemessungsgrundlage für Rentenversicherungsbeiträge. Begrenzt auf die RV-Beitragsbemessungsgrenze (2026: 8.450 €/Monat West)." },
  "Y$51":  { en: "SV gross for unemployment insurance (SV-Brutto AV): income base for unemployment insurance contributions.", de: "SV-Brutto AV: Bemessungsgrundlage für Arbeitslosenversicherungsbeiträge." },
  "Y$08":  { en: "SV gross for long-term care insurance (SV-Brutto PV): income base for care insurance. Same ceiling as KV.", de: "SV-Brutto PV: Bemessungsgrundlage für Pflegeversicherungsbeiträge. Gleiche Grenze wie KV." },
  "Y$33":  { en: "Income tax, ongoing (Lohnsteuer, lfd.): withheld monthly from your taxable gross by SIXT and remitted to the tax office. Rate depends on your tax class and Steuer-Brutto.", de: "Lohnsteuer, laufend: monatlich von SIXT einbehalten und ans Finanzamt abgeführt. Satz abhängig von Steuerklasse und Steuerbrutto." },
  "Y$31":  { en: "Solidarity surcharge (Solidaritätszuschlag): applies at higher income levels. Calculated as a percentage of income tax. Appears here due to high taxable gross including car benefit-in-kind.", de: "Solidaritätszuschlag: fällt bei höheren Einkommen an. Berechnet als Prozentsatz der Lohnsteuer. Erscheint hier aufgrund des hohen Steuerbruttos inkl. PKW-Sachbezug." },
  "Y$20":  { en: "Health insurance, employee share (Krankenversicherung, lfd.): calculated at your KV-AN rate on SV-Brutto KV, up to the contribution ceiling.", de: "Krankenversicherung, Arbeitnehmeranteil: KV-AN-Satz auf SV-Brutto KV bis zur Beitragsbemessungsgrenze." },
  "Y$21":  { en: "Pension insurance, employee share (Rentenversicherung, lfd.): currently 9.3% of SV-Brutto RV up to the contribution ceiling. Employer pays the same rate on top.", de: "Rentenversicherung, Arbeitnehmeranteil: aktuell 9,3% des SV-Brutto RV bis zur Beitragsbemessungsgrenze. Arbeitgeber trägt denselben Anteil zusätzlich." },
  "Y$22":  { en: "Unemployment insurance, employee share (Arbeitslosenversicherung, lfd.): currently 1.3% of SV-Brutto AV up to the contribution ceiling.", de: "Arbeitslosenversicherung, Arbeitnehmeranteil: aktuell 1,3% des SV-Brutto AV bis zur Beitragsbemessungsgrenze." },
  "Y$23":  { en: "Long-term care insurance, employee share (Pflegeversicherung, lfd.): base rate 1.7%, plus surcharge for employees without children. Your PV-AN rate is shown in the payslip footer.", de: "Pflegeversicherung, Arbeitnehmeranteil: Basissatz 1,7%, zzgl. Zuschlag für Kinderlose. Ihr PV-AN-Satz steht im Fußbereich." },
  "/552":  { en: "Subsequent settlement from prior month (Nachverrechnung aus Vormonat): a one-off correction payment from February processed in this month's payroll. Not part of regular monthly net pay — your normal net is 2.766,82 €.", de: "Nachverrechnung aus dem Vormonat: eine einmalige Korrekturzahlung aus Februar, die in dieser Abrechnung verarbeitet wurde. Kein Bestandteil des regulären monatlichen Nettogehalts — Ihr normales Netto beträgt 2.766,82 €." },
  "95A6":  { en: "Net non-cash benefit §37b EStG: a benefit-in-kind (e.g. gift/voucher) where SIXT paid the flat-rate tax. Shown for informational purposes; does not affect your bank transfer.", de: "Netto-Sachzuwendung §37b: ein Sachbezug (z. B. Geschenk/Gutschein), für den SIXT die Pauschalsteuer trägt. Informatorisch ausgewiesen; kein Einfluss auf die Überweisung." },
  "3065s": { en: "Bike benefit in kind — net deduction: the benefit-in-kind value was added to your taxable gross above for correct tax/SV reporting, then deducted here from net so that no cash is paid out.", de: "Geldwerter Vorteil Fahrrad — Nettoabzug: Der Vorteil wurde oben dem Steuerbrutto zugeschlagen, hier wieder abgezogen. Keine Barauszahlung — dient nur der korrekten steuerlichen Erfassung." },
  "/559":  { en: "Bank transfer (Überweisung): the actual amount transferred to your bank account — your take-home pay after all taxes, social security, and other adjustments.", de: "Überweisung: der tatsächlich auf Ihr Konto überwiesene Betrag — Ihr Auszahlungsbetrag nach allen Steuern, Sozialversicherungen und sonstigen Anpassungen." },
};

// ─────────────────────────────────────────────────────────────
// DE PAYSLIP COMPONENTS — styled to match generic renderer
// ─────────────────────────────────────────────────────────────
function DeTip({ k, T }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  if (!DE_TIPS[k]) return null;
  const t = DE_TIPS[k];
  return (
    <span ref={ref} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", border: `1px solid ${v ? T.orange : T.border}`, fontSize: 9, color: v ? T.orange : T.textMuted, fontStyle: "italic", flexShrink: 0, marginLeft: 5, background: v ? "rgba(255,95,0,0.12)" : "transparent", cursor: "help", position: "relative" }}
      onMouseEnter={() => setV(true)} onMouseLeave={() => setV(false)}>
      i
      {v && (
        <div style={{ position: "absolute", right: 18, top: -4, zIndex: 300, width: 300, background: T.tooltipBg, border: `1.5px solid ${T.orange}`, borderRadius: 10, padding: "14px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", pointerEvents: "none" }}>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 4 }}>English</div>
          <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.65, marginBottom: 10 }}>{t.en}</div>
          <div style={{ borderTop: `0.5px solid ${T.border}`, paddingTop: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 4 }}>Deutsch</div>
            <div style={{ fontSize: 12.5, color: T.textSecond, lineHeight: 1.65 }}>{t.de}</div>
          </div>
        </div>
      )}
    </span>
  );
}

function DeRow({ code, label, kenn, betrag, minus, plus, highlight, dim, note, tipKey, T }) {
  const col = minus ? "#c0392b" : plus ? "#2a7a2a" : dim ? T.textMuted : T.textSecond;
  const prefix = minus ? "− " : plus ? "+ " : "";
  const isHighlight = highlight;
  return (
    <tr style={{ background: isHighlight ? T.rowHover : "transparent" }}>
      <td style={{ padding: "5px 8px", fontSize: 11, color: T.textMuted, whiteSpace: "nowrap", verticalAlign: "middle" }}>{code}</td>
      <td style={{ padding: "5px 6px", fontSize: 12.5, color: dim ? T.textMuted : T.textSecond, verticalAlign: "middle" }}>
        <span style={{ display: "flex", alignItems: "center", borderLeft: isHighlight ? `3px solid ${T.orange}` : "none", paddingLeft: isHighlight ? 6 : 0 }}>
          {label}
          {note && <span style={{ fontSize: 10, color: T.orange, marginLeft: 5, fontStyle: "italic" }}>({note})</span>}
          <DeTip k={tipKey || code} T={T} />
        </span>
      </td>
      <td style={{ padding: "5px 6px", fontSize: 11, color: T.textMuted, textAlign: "center", verticalAlign: "middle" }}>{kenn || ""}</td>
      <td style={{ padding: "5px 8px", fontSize: 12.5, textAlign: "right", fontVariantNumeric: "tabular-nums", color: col, verticalAlign: "middle" }}>{prefix}{betrag} €</td>
    </tr>
  );
}

function DePayslipBody({ scenario, T }) {
  const d = DE_DATA[scenario];
  if (!d) return null;
  const { meta, entgelt, brutto, abzuege, gesetzlNetto, sonstige, ueberweisung, ueberweisungNormal } = d;
  function sonstiKey(r) { return r.code === "3065" ? "3065s" : r.code; }

  const SectionHeader = ({ title }) => (
    <tr>
      <td colSpan={4} style={{ padding: "10px 6px 4px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: T.orange, borderTop: `0.5px solid ${T.border}`, borderBottom: `0.5px solid ${T.border}` }}>{title}</td>
    </tr>
  );

  return (
    <div style={{ position: "relative", background: T.surfaceCard, borderRadius: 12 }}>
      {/* Header — matches generic renderer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 22px 14px", background: T.surface, borderRadius: "12px 12px 0 0", borderBottom: `1px solid ${T.border}` }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.09em", color: T.orange, marginBottom: 4 }}>🇩🇪 Payslip · DE</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: T.text, marginBottom: 3 }}>{meta.period}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>Datum: 20.03.2026 · EUR</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>SIXT SE</div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Zugspitzstraße 1, 82049 Pullach</div>
        </div>
      </div>

      {/* Employee info — matches generic renderer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `0.5px solid ${T.border}`, padding: "12px 16px", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: T.orange, marginBottom: 6 }}>Employee — Confidential</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 2 }}>{meta.name}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>Anonymised sample data</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {[["Workday-ID", meta.workdayId], ["Kostenstelle", meta.kostenstelle], ["Eintritt", meta.eintritt], ["ST-Klasse", meta.stKlasse], ["Krankenkasse", meta.krankenkasse]].map(([k, v]) => (
            <div key={k} style={{ minWidth: 120, padding: "4px 8px" }}>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 1 }}>{k}</div>
              <div style={{ fontSize: 12, color: T.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table — matches generic renderer column/row style */}
      <div style={{ padding: "4px 10px 12px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              <th style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>Code</th>
              <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>Description</th>
              <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", textAlign: "center" }}>Kenn</th>
              <th style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>This period</th>
            </tr>
          </thead>
          <tbody>
            <SectionHeader title="Entgeltbestandteile" />
            {entgelt.map((r, i) => <DeRow key={i} {...r} T={T} />)}
            <SectionHeader title="Bruttoentgelte" />
            {brutto.map((r, i) => <DeRow key={i} {...r} T={T} />)}
            <SectionHeader title="Gesetzliche Abzüge" />
            {abzuege.map((r, i) => <DeRow key={i} {...r} T={T} />)}
            {/* Gesetzl. Netto subtotal */}
            <tr style={{ background: T.summaryCard }}>
              <td colSpan={3} style={{ padding: "6px 8px", fontSize: 11, fontWeight: 500, color: T.textSecond, borderTop: `0.5px solid ${T.border}` }}>/55E — Gesetzl. Netto (EBeschV)</td>
              <td style={{ padding: "6px 8px", fontSize: 12.5, fontWeight: 500, color: T.text, textAlign: "right", borderTop: `0.5px solid ${T.border}` }}>{gesetzlNetto} €</td>
            </tr>
            {sonstige.length > 0 && (
              <>
                <SectionHeader title="Sonstige Be-/Abzüge" />
                {sonstige.map((r, i) => <DeRow key={i} {...r} tipKey={sonstiKey(r)} T={T} />)}
              </>
            )}
          </tbody>
        </table>

        {scenario === "mobility" && ueberweisungNormal && (
          <div style={{ fontSize: 11, color: T.orange, background: "rgba(255,95,0,0.06)", border: `0.5px solid ${T.orange}`, borderRadius: 8, padding: "8px 14px", margin: "8px 0", fontStyle: "italic" }}>
            Note: The /552 Nachverrechnung (+744,69 €) is a one-off February correction — regular monthly net: {ueberweisungNormal} €
          </div>
        )}
      </div>

      {/* Summary cards — identical to generic renderer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "0 14px 14px" }}>
        {[
          { label: "Gesamtbrutto", value: brutto[0]?.betrag ? brutto[0].betrag + " €" : "—", accent: false },
          { label: "Gesetzl. Netto", value: gesetzlNetto + " €", accent: false },
          { label: "Überweisung", value: ueberweisung + " €", accent: true },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: accent ? "rgba(255,95,0,0.10)" : T.summaryCard, border: `1px solid ${accent ? T.orange : T.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: accent ? T.orange : T.textMuted, marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: accent ? T.orange : T.text }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Footer metadata */}
      <div style={{ margin: "0 14px 12px", padding: "9px 14px", background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8, display: "flex", flexWrap: "wrap", gap: "4px 18px" }}>
        {[["KV-AN", meta.kvRate], ["PV-AN", meta.pvRate], ["RV-AN", meta.rvRate], ["AV-AN", meta.avRate], ["Steuer-/SV-Tage", meta.svTage]].map(([k, v]) => (
          <div key={k} style={{ fontSize: 11, color: T.textMuted }}><span style={{ fontWeight: 500, color: T.text }}>{k}:</span> {v}</div>
        ))}
      </div>
    </div>
  );
}

function GermanyPayslip({ T }) {
  const [scenario, setScenario] = useState("default");
  const scenarios = [
    { id: "default",     label: "Kein Benefit",       sub: "Grundgehalt only" },
    { id: "mobility",    label: "Mobility Allowance", sub: "ÖPNV-Zuschuss §40(2)" },
    { id: "dienstrad",   label: "Dienstrad",          sub: "Company Bike" },
    { id: "firmenwagen", label: "Firmenwagen",        sub: "Company Car" },
  ];
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>
          Choose the scenario matching your package. Highlighted rows are scenario-specific — hover the <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", border: `1px solid ${T.orange}`, fontSize: 9, color: T.orange, fontStyle: "italic" }}>i</span> for bilingual explanations.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {scenarios.map(s => {
          const active = scenario === s.id;
          return (
            <button key={s.id} onClick={() => setScenario(s.id)} style={{ flex: "1 1 120px", padding: "10px 11px", border: `1px solid ${active ? T.orange : T.border}`, borderRadius: 10, background: active ? "rgba(255,95,0,0.10)" : T.surfaceCard, cursor: "pointer", textAlign: "left", transition: "border-color 0.15s, background 0.15s", position: "relative" }}>
              {active && <span style={{ position: "absolute", top: 6, right: 8, color: T.orange, fontWeight: 500, fontSize: 11 }}>✓</span>}
              <div style={{ fontSize: 13, fontWeight: 500, color: active ? T.orange : T.text, marginBottom: 2, transition: "color 0.15s" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{s.sub}</div>
            </button>
          );
        })}
      </div>
      <DePayslipBody scenario={scenario} T={T} />
      <HelpBanner countryCode="DE" theme={T} />
      <div style={{ margin: "0 14px 18px", padding: "9px 14px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 11, color: T.textMuted, lineHeight: 1.7 }}>
        Sample payslip — all personal data is anonymised. Real employee figures are not stored here. Hover any <span style={{ fontStyle: "italic", border: `1px solid ${T.border}`, borderRadius: "50%", padding: "0 3px", fontSize: 9, color: T.orange }}>i</span> field for a bilingual explanation.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOOLTIP CONTENT — all other countries
// ─────────────────────────────────────────────────────────────
const tooltipsCH = {
  monatslohn:    { en: "Monthly salary: your fixed base salary for the month.", de: "Monatslohn: Ihr festes Grundgehalt für den Monat." },
  provision:     { en: "Provision / commission: variable pay based on sales or performance targets.", de: "Provision: variables Entgelt auf Basis von Verkaufs- oder Leistungszielen." },
  bruttolohn:    { en: "Gross salary (Bruttolohn): total earnings before any social security or other deductions.", de: "Bruttolohn: Gesamtverdienst vor Sozialversicherungsabzügen und anderen Abzügen." },
  ahv:           { en: "AHV contribution (Old Age and Survivors Insurance): Switzerland's main state pension. Employee rate: 5.3% of gross.", de: "AHV-Beitrag (Alters- und Hinterlassenenversicherung): die staatliche Rentenversicherung der Schweiz. Arbeitnehmeranteil: 5,3% des Bruttolohns." },
  alv:           { en: "ALV contribution (Unemployment Insurance): employee rate is 1.1% of gross up to the maximum insured salary.", de: "ALV-Beitrag (Arbeitslosenversicherung): Arbeitnehmeranteil 1,1% des Bruttolohns bis zum versicherten Maximallohn." },
  nbu:           { en: "NBU contribution (Non-occupational accident insurance): covers accidents outside work. Employee rate: 0.89% of gross.", de: "NBU-Beitrag (Nichtberufsunfallversicherung): deckt Unfälle außerhalb der Arbeit ab. Arbeitnehmeranteil: 0,89% des Bruttolohns." },
  uvgz:          { en: "UVGZ (Supplementary accident insurance): additional voluntary accident coverage beyond the mandatory UVG minimum.", de: "UVGZ (Zusatz-Unfallversicherung): freiwillige Ergänzungsversicherung über das gesetzliche UVG-Minimum hinaus." },
  ktg:           { en: "KTG (Daily sickness allowance insurance): provides income continuation if you are unable to work due to illness.", de: "KTG (Krankentaggeldversicherung): sichert Ihr Einkommen bei krankheitsbedingter Arbeitsunfähigkeit." },
  bvg:           { en: "BVG contribution (Occupational pension / 2nd pillar): mandatory workplace pension. The amount depends on your age and salary bracket.", de: "BVG-Beitrag (berufliche Vorsorge / 2. Säule): obligatorische betriebliche Altersvorsorge. Die Höhe hängt von Alter und Lohnklasse ab." },
  nettolohn:     { en: "Net salary (Nettolohn): gross minus all social insurance deductions. Before any additional deductions like parking.", de: "Nettolohn: Bruttolohn minus alle Sozialversicherungsabzüge. Noch vor weiteren Abzügen wie Parkgebühren." },
  parking:       { en: "Parking deduction: your personal contribution for a reserved parking space provided by SIXT.", de: "Parkplatzabzug: Ihr persönlicher Beitrag für einen von SIXT bereitgestellten Parkplatz." },
  ausbezahlt:    { en: "Paid out (Ausbezahlter Lohn): the final amount transferred to your bank account after all deductions.", de: "Ausbezahlter Lohn: der endgültige Betrag, der nach allen Abzügen auf Ihr Bankkonto überwiesen wird." },
};
const tooltipsIT = {
  minimoContr:   { en: "Minimum contractual pay (Minimo contrattuale): the minimum base salary set by the national collective labour agreement (CCNL) for your job level.", it: "Minimo contrattuale: la retribuzione base minima stabilita dal contratto collettivo nazionale di lavoro (CCNL) per il tuo livello." },
  contingenza:   { en: "Cost of living allowance (Contingenza): a historical cost-of-living supplement frozen in 1992 and maintained as a fixed amount.", it: "Contingenza: un'indennità storica di adeguamento al costo della vita, bloccata nel 1992 e mantenuta come importo fisso." },
  scatti:        { en: "Seniority increments (Scatti di anzianità): automatic salary increases earned every two years of continuous service, as per the CCNL.", it: "Scatti di anzianità: aumenti automatici di stipendio maturati ogni due anni di servizio continuativo, secondo il CCNL." },
  superminimo:   { en: "Individual supplement (Superminimo): a personal salary top-up above the contractual minimum, agreed individually or by company policy.", it: "Superminimo: un'integrazione salariale personale al di sopra del minimo contrattuale, concordata individualmente o per policy aziendale." },
  irpef:         { en: "IRPEF (Income tax): Italian personal income tax withheld monthly by SIXT and paid to the tax authority.", it: "IRPEF (Imposta sul Reddito delle Persone Fisiche): trattenuta mensile dal datore di lavoro e versata all'Agenzia delle Entrate." },
  inps:          { en: "INPS contribution: your mandatory social security contribution to the Italian national social security institute.", it: "Contributo INPS: il contributo previdenziale obbligatorio all'Istituto Nazionale della Previdenza Sociale." },
  tfr:           { en: "TFR (Severance pay fund): a mandatory fund set aside each month (~6.9% of gross). Paid out when you leave the company.", it: "TFR (Trattamento di Fine Rapporto): fondo obbligatorio accantonato ogni mese (~6,9% del lordo), liquidato alla cessazione del rapporto di lavoro." },
  netto:         { en: "Net pay: your gross salary minus IRPEF, INPS contributions, and other deductions.", it: "Netto: lo stipendio lordo meno IRPEF, contributi INPS e altre trattenute." },
};
const tooltipsBE = {
  vastLoon:      { en: "Fixed salary (Vast loon): your gross monthly base salary as per your employment contract.", nl: "Vast loon: uw bruto maandelijkse basisloon zoals vastgelegd in uw arbeidsovereenkomst." },
  dienstwagen:   { en: "Company car benefit (Dienstwagen): the taxable benefit-in-kind value of your company car for commuting.", nl: "Dienstwagen: het belastbaar voordeel van alle aard voor het woon-werkverkeer met uw bedrijfswagen." },
  totaalBruto:   { en: "Total gross (Totaal Bruto): all earnings before social security and withholding tax deductions.", nl: "Totaal Bruto: alle vergoedingen voor inhoudingen van RSZ en bedrijfsvoorheffing." },
  rsz:           { en: "RSZ employee contribution: Belgian social security contribution withheld at 13.07% of gross salary.", nl: "RSZ werknemersbijdrage: Belgische sociale zekerheidsbijdrage van 13,07% op het brutoloon." },
  voorheffing:   { en: "Withholding tax (Bedrijfsvoorheffing): Belgian income tax withheld at source by your employer.", nl: "Bedrijfsvoorheffing: Belgische bedrijfsbelasting ingehouden aan de bron door uw werkgever." },
  bijzBijdr:     { en: "Special social security contribution: an additional monthly contribution based on household income.", nl: "Bijzondere bijdrage sociale zekerheid: een aanvullende maandelijkse bijdrage op basis van het gezinsinkomen." },
  maaltijdcheques: { en: "Meal vouchers deduction: your personal share of the meal voucher cost.", nl: "Maaltijdcheques: uw persoonlijk aandeel in de kostprijs van de maaltijdcheques." },
  totaalNetto:   { en: "Net to be paid (Netto te betalen): your final take-home amount after all deductions.", nl: "Netto te betalen: uw uiteindelijk uit te betalen bedrag na alle inhoudingen." },
  werkgeverRSZ:  { en: "Total employer RSZ contribution: the social security costs borne by your employer — not deducted from your pay.", nl: "Totale werkgeversbijdrage RSZ: de sociale zekerheidsbijdrage die uw werkgever bovenop uw brutoloon betaalt." },
};
const tooltipsLUX = {
  monthlyGross:  { en: "Monthly gross: your fixed base salary before contributions and taxes.", fr: "Salaire mensuel brut : votre salaire de base fixe avant cotisations et impôts." },
  bikCar:        { en: "Benefit in kind – company car (BIK CAR): the taxable value of private use of your company car.", fr: "Avantage en nature – voiture de société : la valeur imposable de l'utilisation privée de votre voiture de société." },
  illness:       { en: "Illness contributions: mandatory contributions to Luxembourg's health insurance fund.", fr: "Cotisations maladie : cotisations obligatoires à la caisse de santé luxembourgeoise." },
  pension:       { en: "Pension contributions (8.5%): Luxembourg statutory pension insurance, shared equally between employee and employer.", fr: "Cotisations pension (8,5 %) : assurance pension légale luxembourgeoise, partagée à parts égales entre salarié et employeur." },
  dependence:    { en: "Dependence insurance (1.4%): covers long-term care needs. Unique to Luxembourg.", fr: "Assurance dépendance (1,4 %) : couvre les besoins de soins de longue durée. Spécifique au Luxembourg." },
  taxes:         { en: "Income tax: Luxembourg progressive income tax based on your tax card class.", fr: "Impôt sur le revenu : impôt progressif luxembourgeois selon votre classe d'impôt." },
  netPay:        { en: "Net pay: gross minus all social contributions and income tax.", fr: "Salaire net : brut moins toutes les cotisations sociales et l'impôt sur le revenu." },
  lunchVouchers: { en: "Lunch vouchers deduction: your personal contribution toward monthly meal vouchers provided by SIXT.", fr: "Déduction chèques-repas : votre part personnelle dans les chèques-repas mensuels fournis par SIXT." },
};
const tooltipsNL = {
  salaris:        { en: "Salary: your fixed monthly gross salary as agreed in your employment contract.", nl: "Salaris: uw vaste maandelijkse brutoloon zoals overeengekomen in uw arbeidscontract." },
  pensioenpremie: { en: "Pension premium: your monthly contribution to the company pension scheme.", nl: "Pensioenpremie: uw maandelijkse bijdrage aan de bedrijfspensioenregeling." },
  loonheffing:    { en: "Payroll tax (Loonheffing): Dutch income tax and national insurance contributions withheld at source.", nl: "Loonheffing: Nederlandse inkomstenbelasting en premies volksverzekeringen, ingehouden aan de bron." },
  wia:            { en: "WIA insurance (Disability): employee contribution covering long-term disability income.", nl: "WIA-verzekering: werknemersbijdrage die inkomen bij langdurige arbeidsongeschiktheid dekt." },
  wga:            { en: "WGA gap insurance: supplementary insurance bridging the gap between WGA benefit and your actual salary.", nl: "WGA-hiaatverzekering: aanvullende verzekering die het verschil dekt tussen de WGA-uitkering en uw werkelijk loon." },
  arbeidskorting: { en: "Employment tax credit (Arbeidskorting): a tax credit for working people that reduces your payroll tax liability.", nl: "Arbeidskorting: een belastingkorting voor werkenden die uw loonheffing vermindert." },
  vakantietoeslag: { en: "Holiday allowance reserve: 8% of your annual gross salary, accrued monthly and paid out once a year (usually May).", nl: "Vakantietoeslag: 8% van uw jaarlijkse brutoloon, maandelijks opgebouwd en eenmaal per jaar uitbetaald (meestal in mei)." },
  loonZVW:        { en: "ZVW income: the portion of your salary subject to the health insurance contribution. Your employer pays this on your behalf.", nl: "Loon ZVW: het deel van uw loon waarover de zorgverzekeringswetbijdrage wordt berekend. Uw werkgever betaalt deze namens u." },
  netto:          { en: "Net pay: payments minus all deductions — the amount transferred to your bank account.", nl: "Netto: betalingen minus alle inhoudingen — het bedrag dat op uw bankrekening wordt gestort." },
  fiets:          { en: "Bicycle benefit in kind: taxable addition for private use of a company bicycle.", nl: "Bijtelling fiets van de zaak: belastbare bijtelling voor privégebruik van een bedrijfsfiets." },
};
const tooltipsES = {
  salarioBase:    { en: "Base salary (Salario Base): the minimum fixed monthly pay as defined in your collective agreement.", es: "Salario Base: el salario mensual fijo mínimo definido en su convenio colectivo." },
  plusConvenio:   { en: "Collective agreement supplement (Plus Convenio): additional pay set by the applicable sector collective agreement.", es: "Plus Convenio: complemento salarial adicional establecido por el convenio colectivo sectorial." },
  pagaExtra:      { en: "Extra pay pro-rated: the monthly portion of your two annual bonus payments, spread across 12 months.", es: "Paga Extra Prorrateada: la parte mensual de sus dos pagas extraordinarias anuales, repartidas en 12 meses." },
  bonus:          { en: "Branch Manager Bonus: a variable performance-related bonus specific to your role.", es: "Branch Manager Bonus: un bono variable vinculado al rendimiento, específico de su puesto." },
  cotComunes:     { en: "Common social security contributions: employee contribution to the Spanish Social Security at 4.70%.", es: "Contingencias comunes: cotización del trabajador al régimen general de la Seguridad Social, a un 4,70%." },
  desempleo:      { en: "Unemployment contribution: employee contribution toward unemployment insurance at 1.55%.", es: "Desempleo: cotización del trabajador al seguro de desempleo, a un 1,55%." },
  irpf:           { en: "IRPF withholding: Spanish personal income tax withheld monthly based on your expected annual income.", es: "Retención IRPF: retención mensual del Impuesto sobre la Renta según la renta anual prevista." },
  especieVehiculo: { en: "Company car benefit in kind: the taxable value attributed to private use of a company car.", es: "Especie Vehículo: el valor en especie atribuido al uso privado de un vehículo de empresa." },
  liquidoPercibir: { en: "Net pay (Líquido a Percibir): your take-home pay after all social security and IRPF deductions.", es: "Líquido a Percibir: su salario neto tras deducir cotizaciones a la Seguridad Social y retención del IRPF." },
};
const tooltipsAT = {
  gehalt:         { en: "Salary (Gehalt): your fixed monthly base salary.", de: "Gehalt: Ihr festes monatliches Grundgehalt." },
  nachtzuschlag:  { en: "Night shift supplement: additional pay for hours worked between 10 PM and 6 AM. Partially or fully tax-exempt in Austria.", de: "Nachtzuschlag: Zusatzvergütung für Arbeit zwischen 22:00 und 06:00 Uhr. In Österreich teilweise oder vollständig steuerfrei." },
  sfnZuschlag:    { en: "SFN supplement: tax-exempt supplementary pay for Sundays, public holidays, and nights as per Austrian labour law.", de: "SFN-Zuschlag: steuerfreie Mehrvergütung für Sonn-, Feiertags- und Nachtarbeit gemäß österreichischem Arbeitsrecht." },
  inkrementalSale: { en: "Incremental sale bonus: variable performance pay for upselling or above-target sales results.", de: "Incremental Sale: variables Leistungsentgelt für Zusatzverkäufe oder überdurchschnittliche Verkaufsergebnisse." },
  svBeitrag:      { en: "Social security contribution (SV-Beitrag): Austrian employee social security covering health, pension, unemployment, and accident insurance.", de: "Sozialversicherungsbeitrag: österreichischer Arbeitnehmeranteil zur Sozialversicherung." },
  lohnsteuer:     { en: "Wage tax (Lohnsteuer): Austrian income tax withheld monthly, calculated using the progressive tax table.", de: "Lohnsteuer: österreichische Einkommensteuer, monatlich einbehalten nach der progressiven Lohnsteuertabelle." },
  auszahlung:     { en: "Net pay (Auszahlung): the final amount transferred to your bank account after all deductions.", de: "Auszahlung: der endgültige Betrag, der nach allen Abzügen auf Ihr Bankkonto überwiesen wird." },
  dienstgeberAT:  { en: "Employer contributions: social security costs borne by SIXT on top of your gross — not deducted from your pay.", de: "Dienstgeberanteile: Sozialversicherungskosten, die SIXT zusätzlich trägt. Werden nicht abgezogen." },
};
const tooltipsPT = {
  vencimento:     { en: "Base salary (Vencimento Base): your fixed monthly gross salary as stated in your employment contract.", pt: "Vencimento Base: o seu salário bruto mensal fixo conforme estabelecido no seu contrato de trabalho." },
  cartaoRefeicao: { en: "Meal card (Cartão Refeição): a tax-exempt meal allowance provided as a prepaid card.", pt: "Cartão Refeição: subsídio de refeição isento de impostos fornecido como cartão pré-pago." },
  segSocial:      { en: "Social security contribution: employee contribution at 11% of gross, covering pension, health, and unemployment.", pt: "Desconto Segurança Social: contribuição do trabalhador à taxa de 11% do salário bruto." },
  irs:            { en: "IRS withholding: Portuguese personal income tax withheld monthly based on income bracket and family situation.", pt: "Retenção IRS: imposto sobre o rendimento retido mensalmente com base no escalão e situação familiar." },
  liquido:        { en: "Net pay (Líquido para Receber): your take-home pay after social security and IRS deductions.", pt: "Líquido para Receber: o seu salário líquido após descontos de Segurança Social e IRS." },
};
const tooltipsUK = {
  basicPay:   { en: "Basic pay: your fixed monthly gross salary. Entries marked with * are backdated adjustments.", en2: "Basic pay: your fixed monthly gross salary. Entries marked with * are backdated adjustments." },
  fsaBonus:   { en: "FSA Bonus: a Fleet Sales Agent performance bonus paid for achieving sales targets.", en2: "FSA Bonus: a Fleet Sales Agent performance bonus paid for achieving sales targets." },
  pension:    { en: "Pension contribution (PENS L&G EE): your employee contribution to the Legal & General workplace pension scheme.", en2: "Pension contribution (PENS L&G EE): your employee contribution to the Legal & General workplace pension scheme." },
  ssp:        { en: "Statutory Sick Pay (SSP): the minimum amount your employer must pay when you are off sick for 4+ consecutive days.", en2: "Statutory Sick Pay (SSP): the minimum amount your employer must pay when you are off sick for 4+ consecutive days." },
  taxPaid:    { en: "Tax paid (PAYE): Income tax deducted under the Pay As You Earn system based on your tax code.", en2: "Tax paid (PAYE): Income tax deducted under the Pay As You Earn system based on your tax code." },
  eeNIC:      { en: "Employee National Insurance: your contribution funding the NHS, state pension, and other benefits.", en2: "Employee National Insurance: your contribution funding the NHS, state pension, and other benefits." },
  erNIC:      { en: "Employer National Insurance: SIXT's NI contribution on your behalf — not deducted from your pay.", en2: "Employer National Insurance: SIXT's NI contribution on your behalf — not deducted from your pay." },
  netPay:     { en: "Net pay: total payments minus deductions — the amount paid to your bank account via BACS.", en2: "Net pay: total payments minus deductions — the amount paid to your bank account via BACS." },
  taxCode:    { en: "Tax code: assigned by HMRC to determine your tax-free income. 1257L is the standard code for most employees.", en2: "Tax code: assigned by HMRC to determine your tax-free income. 1257L is the standard code for most employees." },
};
const tooltipsFR = {
  salaireBase:    { en: "Base salary: your fixed monthly gross salary as defined in your employment contract.", fr: "Salaire de base : votre salaire mensuel brut fixe défini dans votre contrat de travail." },
  primeICS:       { en: "ICS bonus: a variable individual performance bonus based on commercial and operational targets.", fr: "Prime ICS : prime variable individuelle liée aux objectifs commerciaux et opérationnels." },
  primeDimanche:  { en: "Sunday premium: additional pay for hours worked on Sundays, as required by French labour law.", fr: "Prime Dimanche : majoration pour les heures travaillées le dimanche." },
  primeJourFerie: { en: "Public holiday premium: additional pay for hours worked on public holidays.", fr: "Prime Jour Férié : majoration pour les heures travaillées les jours fériés." },
  heuresNuit:     { en: "Night hours: additional pay for hours worked during the night period.", fr: "Heures de nuit : majoration pour les heures effectuées pendant la plage horaire nocturne." },
  totalBrut:      { en: "Total gross: the sum of all earnings components before any social security or tax deductions.", fr: "Total Brut : la somme de tous les éléments de rémunération avant cotisations sociales et retenues fiscales." },
  securiteSociale: { en: "French Social Security: contributions funding health care, maternity leave, and death benefits.", fr: "Sécurité Sociale : cotisations finançant les soins de santé, le congé maternité et les prestations décès." },
  complementaireSante: { en: "Supplementary health insurance: mandatory top-up health insurance covering costs not reimbursed by basic Social Security.", fr: "Complémentaire Santé : mutuelle santé obligatoire couvrant les frais non remboursés par la Sécurité Sociale." },
  retraite:       { en: "Pension contributions: contributions to state pension and supplementary pension (AGIRC-ARRCO).", fr: "Retraite : cotisations à la retraite de base et complémentaire (AGIRC-ARRCO)." },
  chomage:        { en: "Unemployment insurance: paid entirely by the employer since 2018 for most employees.", fr: "Assurance chômage : entièrement à la charge de l'employeur depuis 2018 pour la plupart des salariés." },
  csg:            { en: "CSG: a broad-based social levy on all income. The deductible portion reduces your taxable income.", fr: "CSG : prélèvement social large. La part déductible réduit votre revenu imposable." },
  netAvantImpot:  { en: "Net before income tax: your net pay after all social contributions but before income tax withholding.", fr: "Net avant impôt : votre salaire net après cotisations sociales, mais avant le prélèvement à la source." },
  pas:            { en: "Income tax withholding at source (PAS): French income tax deducted directly from your salary each month.", fr: "Prélèvement à la source (PAS) : impôt sur le revenu déduit directement de votre salaire chaque mois." },
  netPaye:        { en: "Net paid: the final amount transferred to your bank account after all deductions including income tax.", fr: "Net payé : le montant final viré sur votre compte après toutes les retenues, y compris l'impôt sur le revenu." },
  ticketResto:    { en: "Meal vouchers: your share of the meal voucher cost. The employer pays at least 50%.", fr: "Ticket restaurant : votre part des tickets restaurant. L'employeur prend en charge au moins 50%." },
  allègement:     { en: "Employer contribution exemption: a government subsidy reducing employer social security costs on low/medium wages.", fr: "Allègement de cotisations : réduction gouvernementale des charges patronales sur les bas et moyens salaires." },
};
const tooltipsMC = {
  salaireBase:    { en: "Base salary: your fixed monthly gross salary.", fr: "Salaire de base : votre salaire mensuel brut fixe." },
  primeICS:       { en: "ICS bonus: a variable individual performance bonus.", fr: "Prime ICS : prime variable individuelle liée aux résultats." },
  heresSuppl:     { en: "Overtime at 125%: hours beyond 35h/week paid at 125% as required by Monaco labour law.", fr: "Heures supplémentaires à 125% : heures au-delà des 35h hebdomadaires, majorées à 125%." },
  dimanche:       { en: "Sunday premium: additional pay for Sunday hours per collective agreement.", fr: "Majoration heures dimanche : majoration pour les heures travaillées le dimanche." },
  feriesTrav:     { en: "Public holiday premium: additional pay for hours worked on public holidays.", fr: "Majoration heures jours fériés travaillés : majoration pour les heures les jours fériés." },
  absJourFerie:   { en: "Public holiday absence: compensation for a public holiday falling on a normally worked day.", fr: "Absence jour férié : indemnisation d'un jour férié tombant un jour normalement travaillé." },
  remunerationBrute: { en: "Total gross: sum of all salary components before social contributions.", fr: "Rémunération brute : somme de tous les éléments de salaire avant cotisations sociales." },
  css:            { en: "CSS & OMT contributions: Monaco's social security covering health, maternity, work accidents, and family benefits. Rate: 13.4% employee share.", fr: "Cotisations CSS & OMT : sécurité sociale monégasque couvrant santé, maternité, accidents du travail. Taux salarié : 13,4%." },
  car:            { en: "CAR pension: Monaco's mandatory supplementary pension fund.", fr: "Retraite CAR : caisse de retraite complémentaire obligatoire de Monaco." },
  emploiRAC:      { en: "Employment fund RAC: Monaco's unemployment and employment protection fund.", fr: "Prévoyance Emploi RAC : fonds monégasque pour l'emploi." },
  cmrc:           { en: "CMRC: Monaco's supplementary retirement and provident fund.", fr: "CMRC : fonds de retraite complémentaire et de prévoyance monégasque." },
  titreRepas:     { en: "Meal voucher deduction: your personal share of the meal voucher cost.", fr: "Retenue titre repas : votre part personnelle du coût des titres repas." },
  netAPayer:      { en: "Net to pay: your final take-home amount. Monaco residents pay no personal income tax.", fr: "Net à payer : votre montant net final. Les résidents monégasques ne paient pas d'impôt sur le revenu." },
  revenuImposable: { en: "Taxable income: used for French cross-border tax obligations, applicable only to French tax residents working in Monaco.", fr: "Revenu imposable : base pour les obligations fiscales françaises transfrontalières." },
};

// ─────────────────────────────────────────────────────────────
// SAMPLE DATA — all non-DE countries
// ─────────────────────────────────────────────────────────────
const sampleData = {
  CH: {
    employer: { name: "Sixt rent-a-car AG", address: "Gewerbestrasse 12, 4123 Allschwil" },
    employee: { name: "Max Muster", address: "Musterstrasse 1, 4000 Basel", personalNr: "9000000002", anstellung: "100.00%", svNr: "756.XXXX.XXXX.XX" },
    payroll: { period: "Februar 2026", date: "28.02.2026", currency: "CHF" },
    sections: [
      { title: "Lohnbestandteile", rows: [
        { label: "Monatslohn", monat: "4'932.15", tooltipKey: "monatslohn" },
        { label: "Provision ML", monat: "350.00", tooltipKey: "provision" },
        { label: "Bruttolohn", monat: "5'282.15", bold: true, tooltipKey: "bruttolohn" },
      ]},
      { title: "Sozialversicherungsabzüge", rows: [
        { label: "AHV-Beitrag", einheit: "5'282.15 CHF", ansatz: "5.300%", monat: "-279.95", tooltipKey: "ahv" },
        { label: "ALV-Beitrag", einheit: "5'282.15 CHF", ansatz: "1.100%", monat: "-58.10", tooltipKey: "alv" },
        { label: "NBU-Beitrag", einheit: "5'282.15 CHF", ansatz: "0.890%", monat: "-47.00", tooltipKey: "nbu" },
        { label: "UVGZ-Beitrag", einheit: "5'282.15 CHF", ansatz: "0.011%", monat: "-0.55", tooltipKey: "uvgz" },
        { label: "KTG-Beitrag", einheit: "5'282.15 CHF", ansatz: "0.672%", monat: "-35.50", tooltipKey: "ktg" },
        { label: "BVG-Beitrag fix", monat: "-256.30", tooltipKey: "bvg" },
        { label: "Nettolohn", monat: "4'604.75", bold: true, tooltipKey: "nettolohn" },
      ]},
      { title: "Weitere Abzüge", rows: [
        { label: "Parking", monat: "-35.00", tooltipKey: "parking" },
        { label: "Korrektur Vormonat", monat: "-6.35" },
        { label: "Ausbezahlter Lohn", monat: "4'563.40", bold: true, tooltipKey: "ausbezahlt" },
      ]},
    ],
    summary: { gross: "5'282.15 CHF", net: "4'604.75 CHF", paid: "4'563.40 CHF" },
    bank: "CH** **** **** **** **** *",
  },
  IT: {
    employer: { name: "Sixt Rent A Car SRL", address: "Via Bolzano 63, 39057 Appiano s.d.V. (BZ)" },
    employee: { name: "Mario Rossi", address: "Via Manzoni 1, 20020 Arconate (MI)", sapId: "15000000", globalId: "9000000003", livello: "A1", assunzione: "18.06.2018" },
    payroll: { period: "Febbraio 2026", date: "25.02.2026", currency: "EUR" },
    sections: [
      { title: "Retribuzione", rows: [
        { label: "Minimo contrattuale", monat: "2.107,50", tooltipKey: "minimoContr" },
        { label: "Contingenza", monat: "529,75", tooltipKey: "contingenza" },
        { label: "Scatti di anzianità", monat: "99,30", tooltipKey: "scatti" },
        { label: "Superminimo assorb.", monat: "1.365,06", tooltipKey: "superminimo" },
        { label: "E.D.R.", monat: "10,33" },
        { label: "E.A.R.", monat: "26,45" },
        { label: "Totale Retribuzione", monat: "4.147,39", bold: true },
      ]},
      { title: "Contributi e Trattenute", rows: [
        { label: "Contributi INPS (AN)", monat: "291,23–", tooltipKey: "inps" },
        { label: "IRPEF netta", monat: "656,34–", tooltipKey: "irpef" },
        { label: "Addizionale regionale", monat: "87,54–" },
        { label: "Addizionale comunale", monat: "30,08–" },
      ]},
      { title: "TFR", rows: [
        { label: "TFR mese", monat: "197,14", tooltipKey: "tfr" },
      ]},
      { title: "Netto", rows: [
        { label: "Netto a pagare", monat: "11.435,39", bold: true, tooltipKey: "netto" },
      ]},
    ],
    summary: { gross: "4.147,39 EUR", net: "3.072,20 EUR", paid: "3.072,20 EUR" },
    bank: "IT** **** **** **** **** **** ***",
    note: "Note: Net includes severance (TFR) and accrued holiday pay due to contract end.",
  },
  BE: {
    employer: { name: "BV Sixt Belgium", address: "Kouterveldstraat 6/C, 1831 Machelen" },
    employee: { name: "Jan Van De Velde", address: "Chaussée de Louvain 1, 1000 Bruxelles", globalId: "9000000004", indienst: "23.05.2016", functie: "SR PROF L&D MGMT BENELUX", statuut: "Bediende" },
    payroll: { period: "01/02/2026 – 28/02/2026", date: "23.02.2026", currency: "EUR" },
    sections: [
      { title: "Betalingen", rows: [
        { code: "700", label: "Vast loon / wedde", monat: "4.319,48", tooltipKey: "vastLoon" },
        { code: "7025", label: "Dienstwagen vervoer", monat: "163,79", tooltipKey: "dienstwagen" },
        { code: "****", label: "Totaal Bruto", monat: "4.319,48", bold: true, tooltipKey: "totaalBruto" },
      ]},
      { title: "Inhoudingen", rows: [
        { code: "9000", label: "RSZ werknemer (13,07%)", monat: "-564,56", tooltipKey: "rsz" },
        { code: "9434", label: "Belastb. vervoer dienstwagen", monat: "122,09" },
        { code: "9200", label: "Bedrijfsvoorheffing", monat: "-652,21", tooltipKey: "voorheffing" },
        { code: "9102", label: "Bijz.bijdr.soc.zekerheid", monat: "-37,86", tooltipKey: "bijzBijdr" },
        { code: "591",  label: "Maaltijdcheques", monat: "-15,40", tooltipKey: "maaltijdcheques" },
        { code: "****", label: "Totaal Netto", monat: "3.049,45", bold: true, tooltipKey: "totaalNetto" },
      ]},
      { title: "Bedrijfslasten (werkgever)", rows: [
        { label: "Totale werkgeversbijdrage RSZ", monat: "1.239,13", tooltipKey: "werkgeverRSZ" },
        { label: "Groepsverzekering werkgever", monat: "33,34" },
      ]},
    ],
    summary: { gross: "4.319,48 EUR", net: "3.049,45 EUR", paid: "3.049,45 EUR" },
    bank: "BE** **** **** ****",
  },
  LUX: {
    employer: { name: "Sixt SARL", address: "Aéroport de Luxembourg, L-1110 Findel" },
    employee: { name: "Jean Dupont", address: "1 Rue de la Gare, L-1616 Luxembourg", regNr: "AV0001SX01-0000001", startDate: "01.09.2008", poste: "Rental Sales Agent" },
    payroll: { period: "February 2026", date: "28.02.2026", currency: "EUR" },
    sections: [
      { title: "Gross Salary", rows: [
        { label: "Monthly gross", monat: "4,407.50", tooltipKey: "monthlyGross" },
        { code: "068", label: "BIK CAR (D)", monat: "760.00", tooltipKey: "bikCar" },
        { label: "Total gross", monat: "5,167.50", bold: true },
      ]},
      { title: "Social Contributions", rows: [
        { label: "Illness in kind (2.80%)", monat: "-144.69", tooltipKey: "illness" },
        { label: "Illness cash (0.25%)", monat: "-11.02", tooltipKey: "illness" },
        { label: "Pension (8.50%)", monat: "-439.24", tooltipKey: "pension" },
        { label: "Dependence insurance (1.40%)", monat: "-62.88", tooltipKey: "dependence" },
        { label: "Social contribution total", monat: "-657.83", bold: true },
      ]},
      { title: "Taxes", rows: [
        { label: "Taxable amount", monat: "4,293.05" },
        { label: "Income tax (11.74%)", monat: "-504.00", tooltipKey: "taxes" },
        { label: "Tax credit", monat: "22.49" },
        { label: "Net", monat: "4,036.25", bold: true, tooltipKey: "netPay" },
      ]},
      { title: "Deductions", rows: [
        { code: "069", label: "BIK CAR reversal (C)", monat: "-760.00" },
        { code: "185", label: "Lunch vouchers", monat: "-50.40", tooltipKey: "lunchVouchers" },
        { label: "Net to be paid", monat: "3,225.85", bold: true },
      ]},
    ],
    summary: { gross: "5.167,50 EUR", net: "4.036,25 EUR", paid: "3.225,85 EUR" },
    bank: "LU** **** **** **** ****",
  },
  NL: {
    employer: { name: "Sixt B.V.", address: "Kruisweg 791, 2132 NG Hoofddorp" },
    employee: { name: "Jan de Vries (sample)", address: "Voorbeeldstraat 1, 1011 AB Amsterdam", persNr: "0000001", globalId: "9000000005", indienst: "01.02.2023", functie: "Senior Executive" },
    payroll: { period: "februari 2026", date: "23.02.2026", currency: "EUR" },
    sections: [
      { title: "Betalingen", rows: [
        { label: "Salaris", monat: "7.756,76", tooltipKey: "salaris" },
        { label: "Bedrijfsfitn.deduct.", monat: "-54,50" },
        { label: "Bonus onbelast", monat: "150,00" },
        { label: "Betalingen totaal", monat: "7.852,26", bold: true },
      ]},
      { title: "Inhoudingen", rows: [
        { label: "Pensioenpremie", monat: "-265,66", tooltipKey: "pensioenpremie" },
        { label: "WIA-bodemverzekering", monat: "-3,77", tooltipKey: "wia" },
        { label: "WGA-hiaatverzekering", monat: "-30,71", tooltipKey: "wga" },
        { label: "Loonheffing TB", monat: "-2.507,75", tooltipKey: "loonheffing" },
        { label: "Inh WGA-premie", monat: "-69,15" },
        { label: "Eigen bijdrage fiets", monat: "-171,58" },
      ]},
      { title: "Bijtellingen", rows: [
        { label: "Bijt. fiets vd zaak", monat: "136,59", tooltipKey: "fiets" },
      ]},
      { title: "Bedragen", rows: [
        { label: "Loon ZVW", monat: "6.617,41", tooltipKey: "loonZVW" },
        { label: "Arbeidskorting", monat: "248,33", tooltipKey: "arbeidskorting" },
        { label: "Res. vakantietoeslag", monat: "620,54", tooltipKey: "vakantietoeslag" },
        { label: "Netto", monat: "4.803,64", bold: true, tooltipKey: "netto" },
      ]},
    ],
    summary: { gross: "7.852,26 EUR", net: "4.803,64 EUR", paid: "4.803,64 EUR" },
    bank: "NL** ABNA **** **** **",
  },
  ES: {
    employer: { name: "Six Rent A Car SLU", address: "Calle Canal de Sant Jordi 29, 07610 Palma de Mallorca" },
    employee: { name: "María García (sample)", address: "Calle Mayor 1, 07008 Palma", nrPers: "04000001", antiguedad: "31.08.2015", puesto: "Executive Branch Manager", jornada: "100%" },
    payroll: { period: "01.02.2026 – 28.02.2026", date: "23.02.2026", currency: "EUR" },
    sections: [
      { title: "Devengos", rows: [
        { label: "Salario Base", monat: "1.229,12", tooltipKey: "salarioBase" },
        { label: "Plus Convenio", monat: "116,59", tooltipKey: "plusConvenio" },
        { label: "Paga Extra Prorrateada", monat: "307,28", tooltipKey: "pagaExtra" },
        { label: "Comp. Absorbible Bruto", monat: "1.548,93" },
        { label: "Branch Manager Bonus", monat: "5.613,45", tooltipKey: "bonus" },
        { label: "Especie Vehículo", monat: "367,36", tooltipKey: "especieVehiculo" },
      ]},
      { title: "Deducciones", rows: [
        { label: "Trab. cont. comunes (4,70%)", monat: "-186,63", tooltipKey: "cotComunes" },
        { label: "Trab. desempleo (1,55%)", monat: "-55,58", tooltipKey: "desempleo" },
        { label: "Trab. formac. profesional", monat: "-3,96" },
        { label: "Trab. equidad intergen.", monat: "-5,38" },
        { label: "Retención IRPF (25,90%)", monat: "-2.271,57", tooltipKey: "irpf" },
        { label: "Ingreso a cuenta IRPF", monat: "-95,15" },
      ]},
      { title: "Neto", rows: [
        { label: "Líquido a percibir", monat: "5.926,89", bold: true, tooltipKey: "liquidoPercibir" },
      ]},
    ],
    summary: { gross: "8.782,73 EUR", net: "6.228,52 EUR", paid: "5.926,89 EUR" },
    bank: "ES** **** **** **** **** ****",
  },
  AT: {
    employer: { name: "Sixt GmbH", address: "1230 Wien, Liesinger-Flur-Gasse 17" },
    employee: { name: "Max Muster", address: "Musterweg 1, 1110 Wien", fnPnr: "100000 / 90000001", svNr: "6254/XX-XX-XXXX", eintritt: "15.07.2023", kostenstelle: "882", taetigkeit: "Rental Sales Agent" },
    payroll: { period: "Februar 2026", date: "23.02.2026", currency: "EUR" },
    sections: [
      { title: "Bezüge", rows: [
        { code: "1000", label: "Gehalt", monat: "1.900,00", tooltipKey: "gehalt" },
        { code: "3112", label: "Nachtzuschlag NAZ frei 100%", einheit: "19,17 Std", ansatz: "10,98", monat: "210,49", tooltipKey: "nachtzuschlag" },
        { code: "3114", label: "Nachtzuschlag NAZ pfl. 100%", einheit: "20,33 Std", ansatz: "10,98", monat: "223,22", tooltipKey: "nachtzuschlag" },
        { code: "3309", label: "SFN Zuschlag frei (Sixt)", einheit: "16,87 Std", ansatz: "10,98", monat: "185,23", tooltipKey: "sfnZuschlag" },
        { code: "1441", label: "Incremental Sale", monat: "2.565,51", tooltipKey: "inkrementalSale" },
        { label: "Summe Bezüge", monat: "5.084,45", bold: true },
      ]},
      { title: "Abzüge", rows: [
        { label: "SV-Beitrag (AN)", monat: "-943,75", tooltipKey: "svBeitrag" },
        { label: "Lohnsteuer", monat: "-739,53", tooltipKey: "lohnsteuer" },
        { label: "Gesetzl. Abzüge gesamt", monat: "-1.683,28", bold: true },
      ]},
      { title: "Auszahlung", rows: [
        { label: "Auszahlung", monat: "3.401,17", bold: true, tooltipKey: "auszahlung" },
      ]},
      { title: "Dienstgeberanteile (informativ)", rows: [
        { label: "SV Dienstgeber", monat: "1.091,72", tooltipKey: "dienstgeberAT" },
      ]},
    ],
    summary: { gross: "5.084,45 EUR", net: "3.401,17 EUR", paid: "3.401,17 EUR" },
    bank: "AT** **** **** **** ****",
  },
  PT: {
    employer: { name: "Sixt Research Development Services Lda", address: "Av. Infante Dom Henrique 143, 1950-406 Lisboa" },
    employee: { name: "João Silva (sample)", address: "Rua da Paz 1, 2680-039 Lisboa", nEmpregado: "9000000006", admissao: "21.04.2025", categoria: "Agent Corporate Travel", jornada: "100%" },
    payroll: { period: "Fevereiro 2026", date: "26.02.2026", currency: "EUR" },
    sections: [
      { title: "Abonos", rows: [
        { code: "321", label: "Vencimento Base", monat: "1.600,00", tooltipKey: "vencimento" },
        { code: "585", label: "Cartão Refeição (isento)", monat: "204,00", tooltipKey: "cartaoRefeicao" },
        { label: "Total Abonos", monat: "1.804,00", bold: true },
      ]},
      { title: "Descontos", rows: [
        { code: "1005", label: "Desconto Seg. Social (11%)", monat: "-176,00", tooltipKey: "segSocial" },
        { code: "1051", label: "I.R.S.", monat: "-48,00", tooltipKey: "irs" },
        { code: "1510", label: "Desc. Cartão Refeição", monat: "-204,00", tooltipKey: "cartaoRefeicao" },
        { label: "Total Descontos", monat: "-428,00", bold: true },
      ]},
      { title: "Líquido", rows: [
        { label: "Líquido para Receber", monat: "1.376,00", bold: true, tooltipKey: "liquido" },
      ]},
    ],
    summary: { gross: "1.600,00 EUR", net: "1.376,00 EUR", paid: "1.376,00 EUR" },
    bank: "PT** **** **** **** **** ****",
  },
  FR: {
    employer: { name: "Septentri Loc", address: "1 Pl. François Mitterrand, 59000 Lille" },
    employee: { name: "Jean Dupont (sample)", address: "1 Rue Exemple, 59000 Lille", nSalarie: "XX000XXX", nSecSociale: "X XX XX XX XXX XXX XX", entree: "19.06.2017", emploi: "Agent d'Opérations Location Executive", centreCouts: "AGENCE NORD" },
    payroll: { period: "Février 2026", date: "28.02.2026", currency: "EUR" },
    sections: [
      { title: "Éléments de salaire", rows: [
        { code: "1101", label: "Salaire de base", monat: "2.244,00", tooltipKey: "salaireBase" },
        { code: "3822", label: "Prime ICS", monat: "1.978,35", tooltipKey: "primeICS" },
        { code: "3833", label: "Prime Dimanche", einheit: "7,45 h", ansatz: "7,40", monat: "55,11", tooltipKey: "primeDimanche" },
        { code: "3834", label: "Prime Jour Férié", einheit: "5,67 h", ansatz: "7,40", monat: "41,94", tooltipKey: "primeJourFerie" },
        { code: "3845", label: "Heures de nuit", einheit: "0,48 h", ansatz: "11,10", monat: "5,33", tooltipKey: "heuresNuit" },
        { code: "/101", label: "Total Brut", monat: "4.324,73", bold: true, tooltipKey: "totalBrut" },
      ]},
      { title: "Santé", rows: [
        { label: "Sécurité Sociale – Maladie/Mat./Décès", einheit: "4.324,73", ansatz: "–", monat: "–", tooltipKey: "securiteSociale" },
        { label: "Complémentaire Incapacité Invalidité TA", einheit: "4.005,00", ansatz: "0,570%", monat: "-22,83", tooltipKey: "complementaireSante" },
        { label: "Complémentaire Santé", einheit: "4.005,00", ansatz: "0,600%", monat: "-24,03", tooltipKey: "complementaireSante" },
      ]},
      { title: "Retraite", rows: [
        { label: "Sécurité Sociale plafonnée", einheit: "4.005,00", ansatz: "6,900%", monat: "-276,35", tooltipKey: "retraite" },
        { label: "Sécurité Sociale déplafonnée", einheit: "4.324,73", ansatz: "0,400%", monat: "-17,30", tooltipKey: "retraite" },
        { label: "Complémentaire Tranche 1", einheit: "4.005,00", ansatz: "4,010%", monat: "-160,60", tooltipKey: "retraite" },
        { label: "Complémentaire Tranche 2", einheit: "319,73", ansatz: "9,720%", monat: "-31,07", tooltipKey: "retraite" },
        { label: "Contribution d'Équilibre Technique", einheit: "4.324,73", ansatz: "0,140%", monat: "-6,06", tooltipKey: "retraite" },
      ]},
      { title: "Assurance chômage", rows: [
        { label: "Chômage (employeur)", einheit: "4.324,73", ansatz: "4,250%", monat: "–", tooltipKey: "chomage" },
      ]},
      { title: "CSG / CRDS", rows: [
        { label: "CSG déductible de l'impôt sur le revenu", einheit: "4.355,25", ansatz: "6,800%", monat: "-296,16", tooltipKey: "csg" },
        { label: "CSG/CRDS non déductible", einheit: "4.355,25", ansatz: "2,900%", monat: "-126,31", tooltipKey: "csg" },
      ]},
      { title: "Net & Impôt", rows: [
        { label: "Net à payer avant impôt sur le revenu", monat: "3.221,20", bold: true, tooltipKey: "netAvantImpot" },
        { label: "Impôt sur le revenu à la source (6,70%)", einheit: "3.518,03", ansatz: "6,70%", monat: "-235,71", tooltipKey: "pas" },
        { label: "Ticket restaurant", einheit: "35 tickets", ansatz: "4,00€", monat: "-140,00", tooltipKey: "ticketResto" },
        { label: "Net payé en euros", monat: "2.985,49", bold: true, tooltipKey: "netPaye" },
      ]},
      { title: "Informations employeur", rows: [
        { label: "Allègement de cotisations employeur", monat: "216,78", tooltipKey: "allègement" },
        { label: "Total versé par l'employeur", monat: "6.188,21", bold: true },
      ]},
    ],
    summary: { gross: "4.324,73 EUR", net: "3.221,20 EUR", paid: "2.985,49 EUR" },
    bank: "FR** **** **** **** **** **** ***",
  },
  MC: {
    employer: { name: "Sixt SARL", address: "Beach Plaza, 0022 Avenue Princesse Grace, 98000 Monaco" },
    employee: { name: "Jean Martin (sample)", address: "1 Rue Exemple, 98000 Monaco", nSalarie: "XX0XXXXX", nCCSS: "XXXXXX-X", entree: "01.10.2018", emploi: "Agent Opération Location SR", horaire: "35,00h" },
    payroll: { period: "Janvier 2026", date: "29.01.2026", currency: "EUR" },
    sections: [
      { title: "Éléments de salaire", rows: [
        { label: "Salaire de base", einheit: "151,67 h", monat: "2.040,00", tooltipKey: "salaireBase" },
        { label: "Prime ICS", monat: "2.183,42", tooltipKey: "primeICS" },
        { label: "Heures supplémentaires à 125%", einheit: "3,52 h", ansatz: "16,813", monat: "59,18", tooltipKey: "heresSuppl" },
        { label: "Prime Local Sales Q4", monat: "20,00" },
        { label: "Majoration heures dimanche", einheit: "8,54 h", ansatz: "6,725", monat: "57,43", tooltipKey: "dimanche" },
        { label: "Majoration heures jours fériés trav.", einheit: "7,53 h", ansatz: "13,450", monat: "101,28", tooltipKey: "feriesTrav" },
        { label: "Absence jour férié", einheit: "7,00 h", ansatz: "13,450", monat: "94,15", tooltipKey: "absJourFerie" },
        { label: "Indemnité jour férié", einheit: "7,00 h", ansatz: "13,450", monat: "94,15" },
        { label: "Rémunération brute", monat: "4.461,31", bold: true, tooltipKey: "remunerationBrute" },
      ]},
      { title: "Cotisations salariales — Caisses Sociales Monaco", rows: [
        { label: "CSS & OMT T2 (13,40%)", einheit: "4.461,31", monat: "-597,82", tooltipKey: "css" },
        { label: "CGCS T2 (0,05%)", einheit: "4.461,31", monat: "-2,23" },
        { label: "CAR de base T1 (6,85%)", einheit: "5.556,98", monat: "-380,65", tooltipKey: "car" },
        { label: "CAR variable T1 (0,88%)", einheit: "5.556,98", monat: "-48,90", tooltipKey: "car" },
        { label: "Prévoyance Emploi RAC TA (2,40%)", einheit: "4.005,00", monat: "-96,12", tooltipKey: "emploiRAC" },
        { label: "Prévoyance Emploi RAC TB (2,40%)", einheit: "456,31", monat: "-10,95", tooltipKey: "emploiRAC" },
        { label: "CMRC TA (3,15%)", einheit: "3.971,00", monat: "-125,09", tooltipKey: "cmrc" },
        { label: "CMRC TB (8,64%)", einheit: "490,31", monat: "-42,36", tooltipKey: "cmrc" },
        { label: "CMRC non droits TA (0,86%)", einheit: "3.971,00", monat: "-34,15", tooltipKey: "cmrc" },
        { label: "CMRC non droits TB (1,08%)", einheit: "490,31", monat: "-5,30", tooltipKey: "cmrc" },
        { label: "Total cotisations salariales", monat: "-694,62", bold: true },
      ]},
      { title: "Autres retenues", rows: [
        { label: "Retenue titre repas (16 × 4,00€)", monat: "-64,00", tooltipKey: "titreRepas" },
      ]},
      { title: "Net & Paiement", rows: [
        { label: "Net à payer", monat: "3.702,69", bold: true, tooltipKey: "netAPayer" },
        { label: "Revenu imposable", monat: "3.766,69", tooltipKey: "revenuImposable" },
      ]},
      { title: "Cotisations patronales (informatives)", rows: [
        { label: "Total cotisations patronales", monat: "1.615,50", bold: true },
      ]},
    ],
    summary: { gross: "4.461,31 EUR", net: "3.702,69 EUR", paid: "3.702,69 EUR" },
    bank: "FR** **** **** **** **** **** ***",
    note: "Monaco has no personal income tax. No withholding tax (PAS) is deducted. French cross-border workers may have separate French tax obligations.",
  },
  UK: {
    employer: { name: "Sixt Rent A Car", address: "Great Britain" },
    employee: { name: "J. Smith (sample)", address: "Sample Street 1, Birmingham B1 1AA", empNr: "08000001", globalId: "9000000007", taxCode: "1257L/0", niCategory: "A", payMethod: "BACS" },
    payroll: { period: "28.02.2026", date: "27.02.2026", currency: "GBP", taxMonth: "11" },
    sections: [
      { title: "Payments", rows: [
        { label: "Basic pay", monat: "2,199.25", tooltipKey: "basicPay" },
        { label: "FSA Bonus", monat: "180.00", tooltipKey: "fsaBonus" },
        { label: "PENS L&G EE", monat: "-109.96", tooltipKey: "pension" },
        { label: "SSP Amount", monat: "237.50", tooltipKey: "ssp" },
        { label: "Total Payment", monat: "1,035.78", bold: true },
      ]},
      { title: "Deductions", rows: [
        { label: "Tax paid (PAYE)", monat: "-2.60", tooltipKey: "taxPaid" },
        { label: "Total Deduction", monat: "-2.60", bold: true },
      ]},
      { title: "Net Pay", rows: [
        { label: "Net Pay", monat: "1,038.38", bold: true, tooltipKey: "netPay" },
      ]},
      { title: "YTD & Balances", rows: [
        { label: "Total Gross YTD", monat: "23,680.62" },
        { label: "Tax paid YTD", monat: "2,429.80", tooltipKey: "taxPaid" },
        { label: "EE NIC YTD", monat: "973.16", tooltipKey: "eeNIC" },
        { label: "ER NIC YTD", monat: "2,864.01", tooltipKey: "erNIC" },
        { label: "PENS L&G ER (this month)", monat: "87.97", tooltipKey: "pension" },
      ]},
    ],
    summary: { gross: "1,035.78 GBP", net: "1,038.38 GBP", paid: "1,038.38 GBP" },
    bank: "GB** **** **** **** **** **",
    note: "* denotes backdated pay. Net Pay exceeds Total Payment due to a prior-period tax refund (negative deduction).",
  },
};

// ─────────────────────────────────────────────────────────────
// HELP BANNER
// ─────────────────────────────────────────────────────────────
const helpBannerLocal = {
  DE:  { before: "Wurde Ihre Frage nicht beantwortet? Öffnen Sie gerne ", link: "hier", after: " einen Workday-Case — unser Payroll-Team hilft Ihnen weiter." },
  AT:  { before: "Wurde Ihre Frage nicht beantwortet? Öffnen Sie gerne ", link: "hier", after: " einen Workday-Case — unser Payroll-Team hilft Ihnen weiter." },
  CH:  { before: "Wurde Ihre Frage nicht beantwortet? Öffnen Sie gerne ", link: "hier", after: " einen Workday-Case — unser Payroll-Team hilft Ihnen weiter." },
  IT:  { before: "La tua domanda non ha trovato risposta? Apri pure un caso Workday ", link: "qui", after: " — il nostro team Payroll è a tua disposizione." },
  BE:  { before: "Werd uw vraag niet beantwoord? Aarzel niet om ", link: "hier", after: " een Workday-case te openen — ons Payroll-team helpt u graag verder." },
  LUX: { before: "Votre question n'a pas trouvé de réponse ? N'hésitez pas à ouvrir un cas Workday ", link: "ici", after: " — notre équipe Payroll est là pour vous aider." },
  NL:  { before: "Is uw vraag niet beantwoord? Open gerust ", link: "hier", after: " een Workday-case — ons Payroll-team helpt u graag verder." },
  ES:  { before: "¿Su pregunta no ha sido respondida? No dude en abrir un caso en Workday ", link: "aquí", after: " — nuestro equipo de Payroll estará encantado de ayudarle." },
  PT:  { before: "A sua questão não foi respondida? Não hesite em abrir um caso no Workday ", link: "aqui", after: " — a nossa equipa de Payroll está aqui para ajudar." },
  UK:  { before: "", link: "", after: "" },
  FR:  { before: "Votre question n'a pas trouvé de réponse ? N'hésitez pas à ouvrir un cas Workday ", link: "ici", after: " — notre équipe Payroll est là pour vous aider." },
  MC:  { before: "Votre question n'a pas trouvé de réponse ? N'hésitez pas à ouvrir un cas Workday ", link: "ici", after: " — notre équipe Payroll est là pour vous aider." },
};

function HelpBanner({ countryCode, theme: T }) {
  const local = helpBannerLocal[countryCode] || helpBannerLocal.DE;
  const isEN = countryCode === "UK";
  const wdUrl = "https://wd103.myworkday.com/sixt/wdhelp/helpcenter/create";
  return (
    <div style={{ margin: "0 14px 18px", padding: "14px 18px", background: "rgba(255,95,0,0.06)", border: `1px solid ${T.orange}`, borderRadius: 10 }}>
      <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7, marginBottom: isEN ? 0 : 10 }}>
        <span style={{ fontWeight: 500, color: T.orange }}>Still have questions?</span> If your question was not answered, please don't hesitate to open a Workday case{" "}
        <a href={wdUrl} target="_blank" rel="noreferrer" style={{ color: T.orange, textDecoration: "underline", fontWeight: 500 }}>here</a>{" "}
        — our Payroll team is happy to help.
      </div>
      {!isEN && (
        <div style={{ fontSize: 12, color: T.textSecond, lineHeight: 1.7, borderTop: `0.5px solid ${T.border}`, paddingTop: 10 }}>
          {local.before}
          <a href={wdUrl} target="_blank" rel="noreferrer" style={{ color: T.orange, textDecoration: "underline", fontWeight: 500 }}>{local.link}</a>
          {local.after}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOOLTIP COMPONENT (generic renderer)
// ─────────────────────────────────────────────────────────────
const tooltipsByCountry = { CH: tooltipsCH, IT: tooltipsIT, BE: tooltipsBE, LUX: tooltipsLUX, NL: tooltipsNL, ES: tooltipsES, AT: tooltipsAT, PT: tooltipsPT, UK: tooltipsUK, FR: tooltipsFR, MC: tooltipsMC };
const localLangLabel = { CH: "Deutsch", IT: "Italiano", BE: "Nederlands", LUX: "Français", NL: "Nederlands", ES: "Español", AT: "Deutsch", PT: "Português", UK: "English", FR: "Français", MC: "Français" };
const localLangKey   = { CH: "de", IT: "it", BE: "nl", LUX: "fr", NL: "nl", ES: "es", AT: "de", PT: "pt", UK: "en2", FR: "fr", MC: "fr" };

function Tooltip({ tooltip, anchorRef, visible, T, countryCode }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (visible && anchorRef.current) {
      const root = document.getElementById("payslip-root");
      const rRect = anchorRef.current.getBoundingClientRect();
      const cRect = root ? root.getBoundingClientRect() : { left: 0, top: 0, width: 900 };
      setPos({ top: rRect.bottom - cRect.top + 8, left: Math.max(4, Math.min(rRect.left - cRect.left, (cRect.width || 900) - 324)) });
    }
  }, [visible, anchorRef]);
  if (!visible || !tooltip) return null;
  const lk = localLangKey[countryCode] || "de";
  const ll = localLangLabel[countryCode] || "Local";
  const localText = tooltip[lk] || tooltip.de || tooltip.en;
  return (
    <div style={{ position: "absolute", top: pos.top, left: pos.left, width: 316, zIndex: 9999, pointerEvents: "none", background: T.tooltipBg, border: `1.5px solid ${T.orange}`, borderRadius: 10, padding: "14px 16px", boxSizing: "border-box", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 4 }}>English</div>
        <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.65 }}>{tooltip.en}</div>
      </div>
      {lk !== "en" && <div style={{ borderTop: `0.5px solid ${T.border}`, paddingTop: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: T.orange, marginBottom: 4 }}>{ll}</div>
        <div style={{ fontSize: 12.5, color: T.textSecond, lineHeight: 1.65 }}>{localText}</div>
      </div>}
    </div>
  );
}

function InfoBadge({ active, T }) {
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", border: `1px solid ${active ? T.orange : T.border}`, fontSize: 9, color: active ? T.orange : T.textMuted, fontStyle: "italic", flexShrink: 0, marginLeft: 5, background: active ? "rgba(255,95,0,0.12)" : "transparent" }}>i</span>;
}

// ─────────────────────────────────────────────────────────────
// GENERIC PAYSLIP RENDERER (all non-DE countries)
// ─────────────────────────────────────────────────────────────
function GenericPayslip({ countryCode, T }) {
  const [active, setActive] = useState(null);
  const data = sampleData[countryCode];
  const tooltips = tooltipsByCountry[countryCode] || {};
  if (!data) return <div style={{ padding: 32, color: T.textMuted }}>No data available for this country yet.</div>;

  const Row = ({ code, label, einheit, ansatz, monat, jahr, tooltipKey, bold }) => {
    const ref = useRef(null);
    const isActive = active === (tooltipKey + label);
    const hasTooltip = !!tooltipKey && !!tooltips[tooltipKey];
    return (
      <tr ref={ref} onMouseEnter={() => hasTooltip && setActive(tooltipKey + label)} onMouseLeave={() => hasTooltip && setActive(null)}
        style={{ background: isActive ? T.rowHover : "transparent", cursor: hasTooltip ? "help" : "default", transition: "background 0.1s" }}>
        {code !== undefined && <td style={{ padding: "5px 8px", fontSize: 11, color: T.textMuted, whiteSpace: "nowrap" }}>{code}</td>}
        <td style={{ padding: "5px 6px", fontSize: 12.5, fontWeight: bold ? 500 : 400, color: bold ? T.text : T.textSecond }}>
          <span style={{ display: "flex", alignItems: "center" }}>{label}{hasTooltip && <InfoBadge active={isActive} T={T} />}</span>
        </td>
        {einheit !== undefined && <td style={{ padding: "5px 6px", fontSize: 11.5, color: T.textMuted }}>{einheit || ""}</td>}
        {ansatz !== undefined && <td style={{ padding: "5px 6px", fontSize: 11.5, color: T.textMuted, textAlign: "right" }}>{ansatz || ""}</td>}
        <td style={{ padding: "5px 8px", fontSize: 12.5, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: bold ? 500 : 400, color: bold ? T.text : T.textSecond }}>{monat || ""}</td>
        {jahr !== undefined && <td style={{ padding: "5px 8px", fontSize: 12, textAlign: "right", color: T.textMuted }}>{jahr || ""}</td>}
        {hasTooltip && <Tooltip tooltip={tooltips[tooltipKey]} anchorRef={ref} visible={isActive} T={T} countryCode={countryCode} />}
      </tr>
    );
  };

  const hasCode = data.sections.some(s => s.rows.some(r => r.code !== undefined));
  const hasEinheit = data.sections.some(s => s.rows.some(r => r.einheit !== undefined));

  return (
    <div id="payslip-root" style={{ position: "relative", background: T.surfaceCard, borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 22px 14px", background: T.surface, borderRadius: "12px 12px 0 0", borderBottom: `1px solid ${T.border}` }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.09em", color: T.orange, marginBottom: 4 }}>{countryConfig[countryCode]?.flag} Payslip · {countryCode}</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: T.text, marginBottom: 3 }}>{data.payroll.period}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>Date: {data.payroll.date} · {data.payroll.currency}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{data.employer.name}</div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{data.employer.address}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `0.5px solid ${T.border}`, padding: "12px 16px", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: T.orange, marginBottom: 6 }}>Employee — Confidential</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 2 }}>{data.employee.name}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>{data.employee.address}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {Object.entries(data.employee).filter(([k]) => !["name","address"].includes(k)).map(([k, v]) => (
            <div key={k} style={{ minWidth: 120, padding: "4px 8px" }}>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 1 }}>{k}</div>
              <div style={{ fontSize: 12, color: T.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "4px 10px 12px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {hasCode && <th style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>Code</th>}
              <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>Description</th>
              {hasEinheit && <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", textAlign: "left" }}>Unit</th>}
              {hasEinheit && <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", textAlign: "right" }}>Rate</th>}
              <th style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 500, color: T.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>This period</th>
            </tr>
          </thead>
          <tbody>
            {data.sections.map((section, si) => (
              <>
                <tr key={"sh"+si}><td colSpan={6} style={{ padding: "10px 6px 4px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: T.orange, borderTop: si > 0 ? `0.5px solid ${T.border}` : "none", borderBottom: `0.5px solid ${T.border}` }}>{section.title}</td></tr>
                {section.rows.map((row, ri) => <Row key={si+"-"+ri} {...row} />)}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "0 14px 14px" }}>
        {[
          { label: "Gross", value: data.summary.gross, accent: false },
          { label: "Net (statutory)", value: data.summary.net, accent: false },
          { label: "Paid to bank", value: data.summary.paid, accent: true },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: accent ? "rgba(255,95,0,0.10)" : T.summaryCard, border: `1px solid ${accent ? T.orange : T.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: accent ? T.orange : T.textMuted, marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: accent ? T.orange : T.text }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 14px 12px", padding: "9px 14px", background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textMuted }}>
        <span style={{ fontWeight: 500, color: T.text }}>Bank transfer: </span>{data.summary.paid} · {data.employee.name} · IBAN: {data.bank}
      </div>
      {data.note && <div style={{ margin: "0 14px 12px", padding: "8px 14px", background: "rgba(255,95,0,0.06)", border: `0.5px solid ${T.orange}`, borderRadius: 8, fontSize: 11, color: T.textSecond }}>{data.note}</div>}
      <HelpBanner countryCode={countryCode} theme={T} />
      <div style={{ margin: "0 14px 18px", padding: "9px 14px", border: `0.5px solid ${T.border}`, borderRadius: 8, fontSize: 11, color: T.textMuted, lineHeight: 1.7 }}>
        Sample payslip — all personal data is anonymised. Hover any <span style={{ fontStyle: "italic", border: `1px solid ${T.border}`, borderRadius: "50%", padding: "0 3px", fontSize: 9, color: T.orange }}>i</span> field for a bilingual explanation.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COUNTRY SELECTOR
// ─────────────────────────────────────────────────────────────
function CountrySelector({ onSelect, T }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ background: T.pageBg, minHeight: "100vh", padding: "48px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: T.orange, color: "#fff", fontWeight: 500, fontSize: 16, letterSpacing: "0.08em", padding: "6px 12px", borderRadius: 5 }}>SIXT</div>
          <div style={{ fontSize: 13, color: T.textMuted }}>Employee Portal</div>
        </div>
      </div>
      <div style={{ marginBottom: 44, maxWidth: 560, textAlign: "center", margin: "0 auto 44px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: T.orange, marginBottom: 12 }}>Payroll &amp; Compensation</div>
        <h1 style={{ fontSize: 34, fontWeight: 500, margin: "0 0 12px", color: T.text, lineHeight: 1.2 }}>Understand your payslip</h1>
        <p style={{ fontSize: 15, color: T.textMuted, margin: 0, lineHeight: 1.7 }}>Select your country to explore a sample payslip and learn what each field means — in English and your local language.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 10, marginBottom: 32 }}>
        {Object.entries(countryConfig).map(([code, c]) => {
          const isHov = hovered === code;
          return (
            <button key={code} onClick={() => c.active && onSelect(code)} onMouseEnter={() => setHovered(code)} onMouseLeave={() => setHovered(null)}
              style={{ background: isHov && c.active ? "rgba(255,95,0,0.1)" : T.surfaceCard, border: `1px solid ${isHov && c.active ? T.orange : T.border}`, borderRadius: 10, padding: "18px 14px", cursor: c.active ? "pointer" : "not-allowed", opacity: c.active ? 1 : 0.4, textAlign: "left", position: "relative", transition: "border-color 0.15s, background 0.15s" }}>
              <div style={{ fontSize: 26, marginBottom: 9, lineHeight: 1 }}>{c.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: isHov && c.active ? T.orange : T.text, marginBottom: 3, transition: "color 0.15s" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{code}</div>
              {!c.active && <div style={{ position: "absolute", top: 9, right: 9, fontSize: 10, fontWeight: 500, background: T.surface, color: T.textMuted, padding: "2px 7px", borderRadius: 4, border: `0.5px solid ${T.border}` }}>Soon</div>}
            </button>
          );
        })}
      </div>
      <div style={{ maxWidth: 540, padding: "14px 18px", background: T.surfaceCard, border: `0.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
        <span style={{ fontWeight: 500, color: T.text }}>How it works: </span>
        Hover any field marked with an <span style={{ fontStyle: "italic", border: `0.5px solid ${T.border}`, borderRadius: "50%", padding: "0 4px", fontSize: 10, color: T.orange }}>i</span> indicator for a bilingual explanation.
      </div>
    </div>
  );
}

function ThemeToggle({ isDark, toggle, T }) {
  return (
    <button onClick={toggle} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted, background: T.surfaceCard, border: `0.5px solid ${T.border}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}>
      <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [country, setCountry] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const T = isDark ? themes.dark : themes.light;

  if (!country) return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 20, right: 28, zIndex: 100 }}>
        <ThemeToggle isDark={isDark} toggle={() => setIsDark(d => !d)} T={T} />
      </div>
      <CountrySelector onSelect={setCountry} T={T} />
    </div>
  );

  const c = countryConfig[country];
  return (
    <div style={{ background: T.pageBg, minHeight: "100vh", padding: "20px 20px 52px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: T.textMuted }}>Employee Portal</span>
        <span style={{ fontSize: 13, color: T.border }}>›</span>
        <span style={{ fontSize: 13, color: T.textMuted }}>Understand your payslip</span>
        <span style={{ fontSize: 13, color: T.border }}>›</span>
        <span style={{ fontSize: 13, color: T.text }}>{c.flag} {c.name}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <ThemeToggle isDark={isDark} toggle={() => setIsDark(d => !d)} T={T} />
          <button onClick={() => setCountry(null)} style={{ fontSize: 12, color: T.textSecond, background: "transparent", border: `0.5px solid ${T.border}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>← Change country</button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 5px", color: T.text }}>Sample payslip — {c.name}</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>
          Hover any <span style={{ fontStyle: "italic", border: `1px solid ${T.border}`, borderRadius: "50%", padding: "0 4px", fontSize: 10, color: T.orange }}>i</span> field for a bilingual explanation. All data is anonymised.
        </p>
      </div>
      {country === "DE"
        ? <GermanyPayslip T={T} />
        : <GenericPayslip countryCode={country} T={T} />
      }
    </div>
  );
}
