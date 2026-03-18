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
  MC:  { name: "Monaco",         flag: "🇲🇨", active: true, currency: "EUR", lang: "Français" },
};

// ─────────────────────────────────────────────────────────────
// TOOLTIP CONTENT — per country
// ─────────────────────────────────────────────────────────────

const tooltipsDE = {
  grundgehalt:   { en: "Base salary: your fixed contractual monthly gross before any additions or deductions.", de: "Grundgehalt: Ihr vertraglich vereinbartes monatliches Bruttogehalt vor Zulagen und Abzügen." },
  pkwWert:       { en: "Company car benefit in kind (1% rule): taxable value of private use of your company car, added to your gross.", de: "Geldwerter Vorteil PKW (1%-Regelung): steuerpflichtiger Wert der Privatnutzung des Firmenwagens, erhöht Ihr Brutto." },
  pkwKm:         { en: "Commute benefit: taxable value for home-to-work trips with your company car (0.03% × list price × km).", de: "Fahrtkosten-Vorteil: steuerpflichtiger Wert für Fahrten Wohnung–Arbeit mit dem Firmenwagen (0,03% × Listenpreis × km)." },
  gesamtbrutto:  { en: "Total gross (Gesamtbrutto): all earnings combined before tax and social security. Used for official employer certificates (EBeschV).", de: "Gesamtbrutto: alle Entgeltbestandteile vor Steuern und Sozialversicherung. Grundlage für Arbeitgeberbescheinigungen (EBeschV)." },
  steuerBrutto:  { en: "Taxable gross (ongoing): the portion of gross subject to regular monthly income tax.", de: "Steuer-Brutto, laufend: der laufend lohnsteuerpflichtige Teil Ihres Bruttogehalts." },
  lohnsteuer:    { en: "Wage tax: income tax withheld monthly by SIXT and transferred to the tax authority on your behalf.", de: "Lohnsteuer: monatlich vom Arbeitgeber einbehaltene und ans Finanzamt abgeführte Einkommensteuer." },
  solidaritaet:  { en: "Solidarity surcharge: supplement on income tax; since 2021 only applies to higher earners.", de: "Solidaritätszuschlag: Aufschlag auf die Lohnsteuer; seit 2021 nur noch für höhere Einkommen." },
  rv:            { en: "Pension insurance (employee share): currently 9.3% of pension-relevant gross up to the ceiling.", de: "Rentenversicherung (AN-Anteil): aktuell 9,3% des rentenversicherungspflichtigen Bruttos bis zur BBG." },
  av:            { en: "Unemployment insurance (employee share): currently 1.3% of relevant gross up to the ceiling.", de: "Arbeitslosenversicherung (AN-Anteil): aktuell 1,3% des beitragspflichtigen Bruttos." },
  gesetzlNetto:  { en: "Statutory net: gross minus statutory deductions (tax + social security). Before voluntary deductions like private health insurance.", de: "Gesetzliches Netto: Brutto minus gesetzliche Abzüge (Steuer + SV). Noch vor freiwilligen Abzügen wie privater KV." },
  agZuschussKV:  { en: "Employer subsidy for private health insurance: legally required contribution of up to 50% of the standard GKV rate.", de: "AG-Zuschuss KV: gesetzlich vorgeschriebener Arbeitgeberzuschuss zur privaten Krankenversicherung (max. 50% des GKV-Satzes)." },
  ueberweisung:  { en: "Bank transfer: the actual net amount transferred to your bank account.", de: "Überweisung: der tatsächlich auf Ihr Konto überwiesene Nettobetrag." },
  stKlasse:      { en: "Tax class: determines your income tax rate. Class 1 = single; Class 3 = married, higher earner; Class 4 = married, similar incomes.", de: "Steuerklasse: bestimmt Ihren Lohnsteuersatz. Klasse 1 = ledig; Klasse 3 = verheiratet, Hauptverdiener; Klasse 4 = verheiratet, ähnliches Einkommen." },
};

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
  irpef:         { en: "IRPEF (Income tax): Italian personal income tax (Imposta sul Reddito delle Persone Fisiche), withheld monthly by SIXT and paid to the tax authority.", it: "IRPEF (Imposta sul Reddito delle Persone Fisiche): trattenuta mensile dal datore di lavoro e versata all'Agenzia delle Entrate." },
  inps:          { en: "INPS contribution: your mandatory social security contribution to the Italian national social security institute, covering pension, illness, and other benefits.", it: "Contributo INPS: il contributo previdenziale obbligatorio all'Istituto Nazionale della Previdenza Sociale, che copre pensione, malattia e altri benefici." },
  tfr:           { en: "TFR (Severance pay fund – Trattamento di Fine Rapporto): a mandatory fund set aside each month equal to ~6.9% of gross. Paid out when you leave the company.", it: "TFR (Trattamento di Fine Rapporto): fondo obbligatorio accantonato ogni mese (~6,9% del lordo), liquidato alla cessazione del rapporto di lavoro." },
  netto:         { en: "Net pay: your gross salary minus IRPEF, INPS contributions, and other deductions. The amount transferred to your bank account.", it: "Netto: lo stipendio lordo meno IRPEF, contributi INPS e altre trattenute. L'importo accreditato sul tuo conto bancario." },
};

const tooltipsBE = {
  vastLoon:      { en: "Fixed salary (Vast loon): your gross monthly base salary as per your employment contract.", nl: "Vast loon: uw bruto maandelijkse basisloon zoals vastgelegd in uw arbeidsovereenkomst." },
  dienstwagen:   { en: "Company car benefit (Dienstwagen): the taxable benefit-in-kind value of your company car for commuting, calculated based on CO₂ emissions and list price.", nl: "Dienstwagen: het belastbaar voordeel van alle aard voor het woon-werkverkeer met uw bedrijfswagen, berekend op basis van CO₂-uitstoot en catalogusprijs." },
  totaalBruto:   { en: "Total gross (Totaal Bruto): all earnings before social security and withholding tax deductions.", nl: "Totaal Bruto: alle vergoedingen voor inhoudingen van RSZ en bedrijfsvoorheffing." },
  rsz:           { en: "RSZ employee contribution (Sociale Zekerheid): Belgian social security contribution withheld at 13.07% of gross salary.", nl: "RSZ werknemersbijdrage: Belgische sociale zekerheidsbijdrage van 13,07% op het brutoloon." },
  voorheffing:   { en: "Withholding tax (Bedrijfsvoorheffing): Belgian income tax withheld at source by your employer based on your tax scale.", nl: "Bedrijfsvoorheffing: Belgische bedrijfsbelasting ingehouden aan de bron door uw werkgever op basis van uw belastingschaal." },
  bijzBijdr:     { en: "Special social security contribution (Bijz. bijdr. soc. zekerheid): an additional monthly contribution based on household income, capped annually.", nl: "Bijzondere bijdrage sociale zekerheid: een aanvullende maandelijkse bijdrage op basis van het gezinsinkomen, jaarlijks begrensd." },
  maaltijdcheques: { en: "Meal vouchers deduction: your personal share of the meal voucher cost (the rest is paid by your employer).", nl: "Maaltijdcheques: uw persoonlijk aandeel in de kostprijs van de maaltijdcheques (de rest wordt betaald door uw werkgever)." },
  totaalNetto:   { en: "Net to be paid (Netto te betalen): your final take-home amount after all deductions.", nl: "Netto te betalen: uw uiteindelijk uit te betalen bedrag na alle inhoudingen." },
  werkgeverRSZ:  { en: "Total employer RSZ contribution: the social security costs borne by your employer on top of your gross salary — not deducted from your pay.", nl: "Totale werkgeversbijdrage RSZ: de sociale zekerheidsbijdrage die uw werkgever bovenop uw brutoloon betaalt — wordt niet ingehouden op uw loon." },
};

const tooltipsLUX = {
  monthlyGross:  { en: "Monthly gross: your fixed base salary before contributions and taxes.", fr: "Salaire mensuel brut : votre salaire de base fixe avant cotisations et impôts." },
  bikCar:        { en: "Benefit in kind – company car (BIK CAR): the taxable value of private use of your company car, added to your gross income.", fr: "Avantage en nature – voiture de société : la valeur imposable de l'utilisation privée de votre voiture de société, ajoutée à votre revenu brut." },
  illness:       { en: "Illness contributions: mandatory contributions to Luxembourg's health insurance fund — split into in-kind (medical care) and cash (sick pay) portions.", fr: "Cotisations maladie : cotisations obligatoires à la caisse de santé luxembourgeoise — divisées en nature (soins médicaux) et espèces (indemnités journalières)." },
  pension:       { en: "Pension contributions (8.5%): Luxembourg statutory pension insurance, shared equally between employee and employer.", fr: "Cotisations pension (8,5 %) : assurance pension légale luxembourgeoise, partagée à parts égales entre salarié et employeur." },
  dependence:    { en: "Dependence insurance (1.4%): covers long-term care needs. Unique to Luxembourg — paid only by employees on gross minus a flat deduction.", fr: "Assurance dépendance (1,4 %) : couvre les besoins de soins de longue durée. Spécifique au Luxembourg — payée uniquement par les salariés." },
  taxes:         { en: "Income tax: Luxembourg progressive income tax based on your tax card class (class 1 = single, class 2 = married/equivalent).", fr: "Impôt sur le revenu : impôt progressif luxembourgeois selon votre classe d'impôt (classe 1 = célibataire, classe 2 = marié/équivalent)." },
  netPay:        { en: "Net pay: gross minus all social contributions and income tax. Before benefit-in-kind reversals and other deductions.", fr: "Salaire net : brut moins toutes les cotisations sociales et l'impôt sur le revenu. Avant les corrections d'avantages en nature et autres retenues." },
  lunchVouchers: { en: "Lunch vouchers deduction: your personal contribution toward monthly meal vouchers provided by SIXT.", fr: "Déduction chèques-repas : votre part personnelle dans les chèques-repas mensuels fournis par SIXT." },
};

const tooltipsNL = {
  salaris:       { en: "Salary: your fixed monthly gross salary as agreed in your employment contract.", nl: "Salaris: uw vaste maandelijkse brutoloon zoals overeengekomen in uw arbeidscontract." },
  pensioenpremie: { en: "Pension premium (Pensioenpremie): your monthly contribution to the company pension scheme, deducted from gross salary.", nl: "Pensioenpremie: uw maandelijkse bijdrage aan de bedrijfspensioenregeling, ingehouden op uw brutoloon." },
  loonheffing:   { en: "Payroll tax (Loonheffing): Dutch income tax and national insurance contributions withheld at source by your employer.", nl: "Loonheffing: Nederlandse inkomstenbelasting en premies volksverzekeringen, ingehouden aan de bron door uw werkgever." },
  wia:           { en: "WIA insurance (Disability): employee contribution to the Work and Income according to Work Capacity Act — covers long-term disability income.", nl: "WIA-verzekering: werknemersbijdrage aan de Wet werk en inkomen naar arbeidsvermogen — dekt inkomen bij langdurige arbeidsongeschiktheid." },
  wga:           { en: "WGA gap insurance (Hiaatverzekering): supplementary insurance bridging the gap between WGA benefit and your actual salary in case of partial disability.", nl: "WGA-hiaatverzekering: aanvullende verzekering die het verschil dekt tussen de WGA-uitkering en uw werkelijk loon bij gedeeltelijke arbeidsongeschiktheid." },
  arbeidskorting: { en: "Employment tax credit (Arbeidskorting): a tax credit for working people that reduces your payroll tax liability.", nl: "Arbeidskorting: een belastingkorting voor werkenden die uw loonheffing vermindert." },
  vakantietoeslag: { en: "Holiday allowance reserve (Vakantietoeslag): 8% of your annual gross salary, accrued monthly and paid out once a year (usually May).", nl: "Vakantietoeslag: 8% van uw jaarlijkse brutoloon, maandelijks opgebouwd en eenmaal per jaar uitbetaald (meestal in mei)." },
  loonZVW:       { en: "ZVW income (Loon ZVW): the portion of your salary subject to the health insurance contribution (Zorgverzekeringswet). Your employer pays this contribution on your behalf.", nl: "Loon ZVW: het deel van uw loon waarover de zorgverzekeringswetbijdrage wordt berekend. Uw werkgever betaalt deze bijdrage namens u." },
  netto:         { en: "Net pay: payments minus all deductions — the amount transferred to your bank account.", nl: "Netto: betalingen minus alle inhoudingen — het bedrag dat op uw bankrekening wordt gestort." },
  fiets:         { en: "Bicycle benefit in kind (Bijt. fiets vd zaak): taxable addition for private use of a company bicycle, added to your taxable income.", nl: "Bijtelling fiets van de zaak: belastbare bijtelling voor privégebruik van een bedrijfsfiets, toegevoegd aan uw belastbaar inkomen." },
};

const tooltipsES = {
  salarioBase:   { en: "Base salary (Salario Base): the minimum fixed monthly pay as defined in your collective agreement (convenio colectivo).", es: "Salario Base: el salario mensual fijo mínimo definido en su convenio colectivo." },
  plusConvenio:  { en: "Collective agreement supplement (Plus Convenio): an additional pay component set by the applicable sector collective agreement.", es: "Plus Convenio: un complemento salarial adicional establecido por el convenio colectivo sectorial aplicable." },
  pagaExtra:     { en: "Extra pay pro-rated (Paga Extra Prorrateada): the monthly portion of your two annual bonus payments (summer and Christmas), spread equally across 12 months.", es: "Paga Extra Prorrateada: la parte mensual de sus dos pagas extraordinarias anuales (verano y Navidad), repartidas en 12 meses." },
  bonus:         { en: "Branch Manager Bonus: a variable performance-related bonus specific to your role, paid on top of your fixed salary.", es: "Branch Manager Bonus: un bono variable vinculado al rendimiento, específico de su puesto, pagado adicionalmente al salario fijo." },
  cotComunes:    { en: "Common social security contributions (Trab. cont. comunes): employee contribution to the Spanish Social Security general scheme at 4.70% of contribution base.", es: "Contingencias comunes: cotización del trabajador al régimen general de la Seguridad Social, a un 4,70% de la base de cotización." },
  desempleo:     { en: "Unemployment contribution (Trab. desempleo): employee contribution toward unemployment insurance at 1.55% of the contribution base.", es: "Desempleo: cotización del trabajador al seguro de desempleo, a un 1,55% de la base de cotización." },
  irpf:          { en: "IRPF withholding (Retención IRPF): Spanish personal income tax withheld monthly. The rate (here 25.9%) is calculated based on your expected annual income and personal circumstances.", es: "Retención IRPF: retención mensual del Impuesto sobre la Renta de las Personas Físicas. El tipo (aquí 25,9%) se calcula según la renta anual prevista y circunstancias personales." },
  especieVehiculo: { en: "Company car benefit in kind (Especie Vehículo): the taxable value attributed to private use of a company car, added to your gross income.", es: "Especie Vehículo: el valor en especie atribuido al uso privado de un vehículo de empresa, añadido a su renta bruta." },
  liquidoPercibir: { en: "Net pay (Líquido a Percibir): your take-home pay after all social security contributions and IRPF tax have been deducted.", es: "Líquido a Percibir: su salario neto tras deducir todas las cotizaciones a la Seguridad Social y la retención del IRPF." },
};

const tooltipsAT = {
  gehalt:        { en: "Salary (Gehalt): your fixed monthly base salary.", de: "Gehalt: Ihr festes monatliches Grundgehalt." },
  nachtzuschlag: { en: "Night shift supplement (Nachtzuschlag): additional pay for hours worked between 10 PM and 6 AM. In Austria, supplements for nightwork are partially or fully tax-exempt.", de: "Nachtzuschlag: Zusatzvergütung für Arbeit zwischen 22:00 und 06:00 Uhr. In Österreich sind Nachtzuschläge teilweise oder vollständig steuerfrei." },
  sfnZuschlag:   { en: "SFN supplement (Zuschlag): tax-exempt supplementary pay for work on Sundays, public holidays, and nights (Sonntag, Feiertag, Nacht — SFN) as regulated by Austrian labour law.", de: "SFN-Zuschlag: steuerfreie Mehrvergütung für Sonn-, Feiertags- und Nachtarbeit gemäß österreichischem Arbeitsrecht." },
  inkrementalSale: { en: "Incremental sale bonus: variable performance pay for upselling or achieving above-target sales results at the rental branch.", de: "Incremental Sale: variables Leistungsentgelt für Zusatzverkäufe oder überdurchschnittliche Verkaufsergebnisse an der Mietstation." },
  svBeitrag:     { en: "Social security contribution (SV-Beitrag): Austrian employee social security covering health, pension, unemployment, and accident insurance.", de: "Sozialversicherungsbeitrag: österreichischer Arbeitnehmeranteil zur Sozialversicherung (Kranken-, Pensions-, Unfall- und Arbeitslosenversicherung)." },
  lohnsteuer:    { en: "Wage tax (Lohnsteuer): Austrian income tax withheld from your salary monthly. Calculated using the progressive tax table (Lohnsteuertabelle).", de: "Lohnsteuer: österreichische Einkommensteuer, die monatlich vom Gehalt einbehalten wird. Berechnet nach der progressiven Lohnsteuertabelle." },
  auszahlung:    { en: "Net pay (Auszahlung): the final amount transferred to your bank account after all deductions.", de: "Auszahlung: der endgültige Betrag, der nach allen Abzügen auf Ihr Bankkonto überwiesen wird." },
  dienstgeberAT: { en: "Employer contributions (Dienstgeberanteile): social security costs borne by SIXT on top of your gross salary. These are not deducted from your pay.", de: "Dienstgeberanteile: Sozialversicherungskosten, die SIXT zusätzlich zu Ihrem Bruttogehalt trägt. Werden nicht von Ihrem Gehalt abgezogen." },
};

const tooltipsPT = {
  vencimento:    { en: "Base salary (Vencimento Base): your fixed monthly gross salary as stated in your employment contract.", pt: "Vencimento Base: o seu salário bruto mensal fixo conforme estabelecido no seu contrato de trabalho." },
  cartaoRefeicao: { en: "Meal card (Cartão Refeição): a tax-exempt meal allowance provided as a prepaid card for daily meals. Up to a legal threshold it is exempt from tax and social security.", pt: "Cartão Refeição: subsídio de refeição isento de impostos fornecido como cartão pré-pago para refeições diárias. Até um determinado limite legal está isento de impostos e segurança social." },
  segSocial:     { en: "Social security contribution (Desconto Seg. Social): employee contribution to the Portuguese Social Security at 11% of gross salary, covering pension, health, and unemployment.", pt: "Desconto Segurança Social: contribuição do trabalhador para a Segurança Social portuguesa à taxa de 11% do salário bruto, cobrindo reforma, saúde e desemprego." },
  irs:           { en: "IRS withholding (I.R.S.): Portuguese personal income tax (Imposto sobre o Rendimento das Pessoas Singulares) withheld monthly based on your income bracket and family situation.", pt: "Retenção IRS: imposto sobre o rendimento das pessoas singulares retido mensalmente com base no escalão de rendimento e situação familiar." },
  liquido:       { en: "Net pay (Líquido para Receber): your take-home pay after social security and IRS deductions.", pt: "Líquido para Receber: o seu salário líquido após descontos de Segurança Social e IRS." },
};

const tooltipsUK = {
  basicPay:      { en: "Basic pay: your fixed monthly gross salary. Entries marked with * are backdated adjustments from a previous pay period.", en2: "Basic pay: your fixed monthly gross salary. Entries marked with * are backdated adjustments from a previous pay period." },
  fsaBonus:      { en: "FSA Bonus: a Fleet Sales Agent performance bonus paid for achieving sales targets.", en2: "FSA Bonus: a Fleet Sales Agent performance bonus paid for achieving sales targets." },
  pension:       { en: "Pension contribution (PENS L&G EE): your employee contribution to the Legal & General workplace pension scheme, deducted from gross pay.", en2: "Pension contribution (PENS L&G EE): your employee contribution to the Legal & General workplace pension scheme, deducted from gross pay." },
  ssp:           { en: "Statutory Sick Pay (SSP): the minimum amount your employer must pay when you are off sick for 4 or more consecutive days, as set by UK law.", en2: "Statutory Sick Pay (SSP): the minimum amount your employer must pay when you are off sick for 4 or more consecutive days, as set by UK law." },
  taxPaid:       { en: "Tax paid (PAYE): Income tax deducted under the Pay As You Earn system based on your tax code. Your tax code (e.g. 1257L) determines your tax-free personal allowance.", en2: "Tax paid (PAYE): Income tax deducted under the Pay As You Earn system based on your tax code. Your tax code (e.g. 1257L) determines your tax-free personal allowance." },
  eeNIC:         { en: "Employee National Insurance (EE NIC): your contribution to the UK National Insurance system, funding the NHS, state pension, and other benefits.", en2: "Employee National Insurance (EE NIC): your contribution to the UK National Insurance system, funding the NHS, state pension, and other benefits." },
  erNIC:         { en: "Employer National Insurance (ER NIC): SIXT's NI contribution on your behalf — not deducted from your pay, shown for information only.", en2: "Employer National Insurance (ER NIC): SIXT's NI contribution on your behalf — not deducted from your pay, shown for information only." },
  netPay:        { en: "Net pay: total payments minus deductions — the amount paid to your bank account via BACS.", en2: "Net pay: total payments minus deductions — the amount paid to your bank account via BACS." },
  taxCode:       { en: "Tax code: assigned by HMRC to determine how much tax-free income you receive. 1257L is the standard code for most employees (£12,570 personal allowance).", en2: "Tax code: assigned by HMRC to determine how much tax-free income you receive. 1257L is the standard code for most employees (£12,570 personal allowance)." },
};

// ─────────────────────────────────────────────────────────────
// SAMPLE DATA — all countries, fully anonymised
// ─────────────────────────────────────────────────────────────
const sampleData = {
  DE: {
    employer: { name: "SXT Dienst. GmbH & Co. KG", address: "Grubenstraße 27, 18055 Rostock" },
    employee: { name: "Max Mustermann", address: "Musterstraße 1, 18055 Rostock", workdayId: "9000000001", eintritt: "01.04.2022", kostenstelle: "RAC_719_HR P" },
    payroll: { period: "Februar 2026", date: "18.02.2026", currency: "EUR", steuerSVTage: "30/30" },
    tax: { stKlasse: "4 / 0,862 / 2,0", rvAN: "9,30%", avAN: "1,30%", krankenkasse: "Privat (Mobil KK)" },
    sections: [
      { title: "Entgeltbestandteile", rows: [
        { code: "1101", label: "Grundgehalt", kenn: "LSG", monat: "9.416,67", tooltipKey: "grundgehalt" },
        { code: "/425", label: "PKW-Wert gw.Vorteil", kenn: "LSG", monat: "597,00", tooltipKey: "pkwWert" },
        { code: "/426", label: "PKW-KM gw.Vorteil", kenn: "LSG", monat: "125,37", tooltipKey: "pkwKm" },
      ]},
      { title: "Bruttoentgelte", rows: [
        { code: "/10E", label: "Gesamtbrutto (EBeschV)", monat: "10.131,62", jahr: "20.238,72", tooltipKey: "gesamtbrutto", bold: true },
        { code: "Y$04", label: "Steuer-Brutto, lfd.", monat: "10.054,04", jahr: "20.108,08", tooltipKey: "steuerBrutto" },
      ]},
      { title: "Gesetzliche Abzüge", rows: [
        { code: "Y$33", label: "Lohnsteuer, lfd.", monat: "2.296,41–", jahr: "4.592,82", tooltipKey: "lohnsteuer" },
        { code: "Y$31", label: "Solidaritätszuschlag", monat: "36,43–", tooltipKey: "solidaritaet" },
        { code: "Y$21", label: "Rentenversicherung, lfd.", monat: "785,85–", tooltipKey: "rv" },
        { code: "Y$22", label: "Arbeitslosenvers., lfd.", monat: "109,85–", tooltipKey: "av" },
        { code: "/55E", label: "Gesetzl. Netto (EBeschV)", monat: "6.903,08", bold: true, tooltipKey: "gesetzlNetto" },
      ]},
      { title: "Sonstige Be-/Abzüge", rows: [
        { code: "Y139", label: "AG-Zuschuss KV", monat: "537,36", tooltipKey: "agZuschussKV" },
        { code: "Y137", label: "Abgef. Beitrag freiw. KV", monat: "1.074,74–" },
        { code: "Y128", label: "Abgef. Beitrag freiw. PV", monat: "194,72–" },
        { code: "/425", label: "PKW-Wert gw.Vorteil", monat: "597,00–" },
        { code: "/426", label: "PKW-KM gw.Vorteil", monat: "125,37–" },
      ]},
      { title: "Überweisungen", rows: [
        { code: "/559", label: "Überweisung", monat: "5.586,21", bold: true, tooltipKey: "ueberweisung" },
      ]},
    ],
    summary: { gross: "10.131,62 EUR", net: "6.903,08 EUR", paid: "5.586,21 EUR" },
    bank: "DE** **** **** **** **** **",
  },
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
    summary: { gross: "4.147,39 EUR", net: "3.072,20 EUR", paid: "11.435,39 EUR" },
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
    summary: { gross: "5,167.50 EUR", net: "4,036.25 EUR", paid: "3,225.85 EUR" },
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

const tooltipsFR = {
  salaireBase:   { en: "Base salary (Salaire de base): your fixed monthly gross salary as defined in your employment contract and collective agreement.", fr: "Salaire de base : votre salaire mensuel brut fixe tel que défini dans votre contrat de travail et la convention collective." },
  primeICS:      { en: "ICS bonus (Prime ICS): a variable individual performance bonus based on commercial and operational targets.", fr: "Prime ICS : prime variable individuelle liée aux objectifs commerciaux et opérationnels." },
  primeDimanche: { en: "Sunday premium (Prime Dimanche): additional pay for hours worked on Sundays, as required by French labour law and the applicable collective agreement.", fr: "Prime Dimanche : majoration pour les heures travaillées le dimanche, conformément au droit du travail français et à la convention collective applicable." },
  primeJourFerie:{ en: "Public holiday premium (Prime Jour Férié): additional pay for hours worked on public holidays, above the standard hourly rate.", fr: "Prime Jour Férié : majoration pour les heures travaillées les jours fériés, au-delà du taux horaire normal." },
  heuresNuit:    { en: "Night hours (Heures de nuit): additional pay for hours worked during the night period, as defined by the collective agreement.", fr: "Heures de nuit : majoration pour les heures effectuées pendant la plage horaire nocturne définie par la convention collective." },
  totalBrut:     { en: "Total gross (Total Brut): the sum of all earnings components before any social security contributions or tax deductions.", fr: "Total Brut : la somme de tous les éléments de rémunération avant cotisations sociales et retenues fiscales." },
  securiteSociale: { en: "French Social Security — illness/maternity/death (Sécurité Sociale Maladie): contributions funding health care, maternity leave, and death benefits. The employer pays a much larger share than the employee.", fr: "Sécurité Sociale Maladie/Maternité/Décès : cotisations finançant les soins de santé, le congé maternité et les prestations décès. L'employeur cotise bien plus que le salarié." },
  complementaireSante: { en: "Supplementary health insurance (Complémentaire Santé): mandatory top-up health insurance that covers costs not reimbursed by the basic Social Security scheme.", fr: "Complémentaire Santé : mutuelle santé obligatoire couvrant les frais non remboursés par la Sécurité Sociale de base." },
  retraite:      { en: "Pension contributions (Retraite): contributions to both the basic state pension (Sécurité Sociale plafonnée/déplafonnée) and the supplementary pension (AGIRC-ARRCO), split between employee and employer.", fr: "Retraite : cotisations à la retraite de base (SS plafonnée/déplafonnée) et à la retraite complémentaire (AGIRC-ARRCO), réparties entre salarié et employeur." },
  chomage:       { en: "Unemployment insurance (Chômage): contribution to the French unemployment insurance fund (Unédic), paid entirely by the employer since 2018 for most employees.", fr: "Assurance chômage : cotisation au régime d'assurance chômage (Unédic), entièrement à la charge de l'employeur depuis 2018 pour la plupart des salariés." },
  csg:           { en: "CSG (Generalised Social Contribution): a broad-based social levy on all income funding Social Security. The deductible portion reduces your taxable income; the non-deductible portion does not.", fr: "CSG (Contribution Sociale Généralisée) : prélèvement social large assis sur tous les revenus. La part déductible réduit votre revenu imposable ; la part non déductible ne le réduit pas." },
  netAvantImpot: { en: "Net before income tax (Net à payer avant impôt sur le revenu): your net pay after all social contributions but before income tax withholding (PAS).", fr: "Net à payer avant impôt sur le revenu : votre salaire net après toutes les cotisations sociales, mais avant le prélèvement à la source (PAS)." },
  pas:           { en: "Income tax withholding at source (Impôt sur le revenu prélevé à la source / PAS): French income tax deducted directly from your salary each month since the 2019 reform. The rate is personalised based on your household income.", fr: "Prélèvement à la source (PAS) : impôt sur le revenu déduit directement de votre salaire chaque mois depuis la réforme de 2019. Le taux est personnalisé selon les revenus de votre foyer fiscal." },
  netPaye:       { en: "Net paid (Net payé en euros): the final amount transferred to your bank account after all deductions including income tax.", fr: "Net payé en euros : le montant final viré sur votre compte bancaire après toutes les retenues, y compris l'impôt sur le revenu." },
  ticketResto:   { en: "Meal vouchers (Ticket restaurant): a deduction for your share of the meal voucher cost. The employer pays at least 50% — the balance is deducted from your net pay.", fr: "Ticket restaurant : retenue correspondant à votre part des tickets restaurant. L'employeur prend en charge au moins 50 % ; le solde est déduit de votre salaire net." },
  allègement:    { en: "Employer contribution exemption (Allègement de cotisations employeur): a government subsidy reducing employer social security costs on low and medium wages, part of the Fillon reductions scheme.", fr: "Allègement de cotisations employeur : réduction gouvernementale des charges patronales sur les bas et moyens salaires, dans le cadre des réductions Fillon." },
};

const tooltipsMC = {
  salaireBase:    { en: "Base salary (Salaire de base): your fixed monthly gross salary based on your classification and collective agreement.", fr: "Salaire de base : votre salaire mensuel brut fixe selon votre classification et la convention collective." },
  primeICS:       { en: "ICS bonus (Prime ICS): a variable individual performance bonus based on commercial and operational results.", fr: "Prime ICS : prime variable individuelle liée aux résultats commerciaux et opérationnels." },
  heresSuppl:     { en: "Overtime at 125% (Heures supplémentaires à 125%): hours worked beyond the standard 35h/week, paid at 125% of the normal hourly rate as required by Monaco labour law.", fr: "Heures supplémentaires à 125% : heures effectuées au-delà des 35h hebdomadaires, majorées à 125% du taux horaire normal conformément au droit du travail monégasque." },
  dimanche:       { en: "Sunday premium (Majoration heures dimanche): additional pay for hours worked on Sundays, as per the automotive services collective agreement.", fr: "Majoration heures dimanche : majoration pour les heures travaillées le dimanche, selon la convention collective des services de l'automobile." },
  feriesTrav:     { en: "Public holiday premium (Majoration heures jours fériés travaillés): additional pay for hours worked on public holidays.", fr: "Majoration heures jours fériés travaillés : majoration pour les heures effectuées les jours fériés." },
  absJourFerie:   { en: "Public holiday absence (Absence jour férié): compensation for a public holiday that falls on a normally worked day — you receive your normal pay without working.", fr: "Absence jour férié : indemnisation d'un jour férié tombant un jour normalement travaillé — vous percevez votre salaire normal sans travailler." },
  remunerationBrute: { en: "Total gross (Rémunération brute): the sum of all salary components before any social contributions or deductions.", fr: "Rémunération brute : la somme de tous les éléments de salaire avant cotisations sociales et retenues." },
  css:            { en: "CSS & OMT contributions (Caisses Sociales de Monaco): Monaco's social security system managed by the CCSS — covering health, maternity, work accidents, and family benefits. Rate: 13.4% employee share.", fr: "Cotisations CSS & OMT : système de sécurité sociale monégasque géré par la CCSS — couvrant santé, maternité, accidents du travail et prestations familiales. Taux salarié : 13,4%." },
  car:            { en: "CAR pension (Caisse de Retraite de Monaco): Monaco's mandatory supplementary pension fund. Contributions are split between employee and employer across two tranches (T1 and variable).", fr: "Retraite CAR : caisse de retraite complémentaire obligatoire de Monaco. Les cotisations sont réparties entre salarié et employeur sur deux tranches." },
  emploiRAC:      { en: "Employment fund RAC (Prévoyance Emploi RAC): contributions to Monaco's unemployment and employment protection fund, covering two salary tranches (TA and TB).", fr: "Prévoyance Emploi RAC : cotisations au fonds monégasque pour l'emploi, couvrant deux tranches de salaire (TA et TB)." },
  cmrc:           { en: "CMRC (Caisse Monégasque de Retraite Complémentaire): Monaco's supplementary retirement and provident fund — split across salary tranches TA and TB, with separate rates for standard and non-entitled contributions.", fr: "CMRC (Caisse Monégasque de Retraite Complémentaire) : fonds de retraite complémentaire et de prévoyance monégasque — réparti sur les tranches TA et TB, avec des taux distincts selon les droits." },
  titreRepas:     { en: "Meal voucher deduction (Retenue titre repas): your personal share of the meal voucher cost deducted from net pay. The employer contributes the other portion.", fr: "Retenue titre repas : votre part personnelle du coût des titres repas, déduite du salaire net. L'employeur prend en charge l'autre partie." },
  netAPayer:      { en: "Net to pay (Net à payer): your final take-home amount. Note: Monaco residents pay no personal income tax — unlike France, there is no withholding tax deducted from your payslip.", fr: "Net à payer : votre montant net final. À noter : les résidents monégasques ne paient pas d'impôt sur le revenu — contrairement à la France, aucun prélèvement fiscal n'est déduit sur votre bulletin." },
  revenuImposable: { en: "Taxable income (Revenu imposable): the gross amount used as the basis for French cross-border tax obligations, applicable only to employees who are French tax residents working in Monaco.", fr: "Revenu imposable : le montant brut servant de base aux obligations fiscales françaises transfrontalières, applicable uniquement aux salariés résidents fiscaux français travaillant à Monaco." },
};

const tooltipsByCountry = { DE: tooltipsDE, CH: tooltipsCH, IT: tooltipsIT, BE: tooltipsBE, LUX: tooltipsLUX, NL: tooltipsNL, ES: tooltipsES, AT: tooltipsAT, PT: tooltipsPT, UK: tooltipsUK, FR: tooltipsFR, MC: tooltipsMC };
const localLangLabel = { DE: "Deutsch", CH: "Deutsch", IT: "Italiano", BE: "Nederlands", LUX: "Français", NL: "Nederlands", ES: "Español", AT: "Deutsch", PT: "Português", UK: "English", FR: "Français", MC: "Français" };
const localLangKey = { DE: "de", CH: "de", IT: "it", BE: "nl", LUX: "fr", NL: "nl", ES: "es", AT: "de", PT: "pt", UK: "en2", FR: "fr", MC: "fr" };

// ─────────────────────────────────────────────────────────────
// TOOLTIP COMPONENT
// ─────────────────────────────────────────────────────────────
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
// GENERIC PAYSLIP RENDERER (used for all countries)
// ─────────────────────────────────────────────────────────────
function GenericPayslip({ countryCode, T: theme }) {
  const [active, setActive] = useState(null);
  const data = sampleData[countryCode];
  const tooltips = tooltipsByCountry[countryCode] || {};
  if (!data) return <div style={{ padding: 32, color: theme.textMuted }}>No data available for this country yet.</div>;

  const Row = ({ code, label, einheit, ansatz, monat, jahr, tooltipKey, bold }) => {
    const ref = useRef(null);
    const isActive = active === (tooltipKey + label);
    const hasTooltip = !!tooltipKey && !!tooltips[tooltipKey];
    return (
      <tr ref={ref} onMouseEnter={() => hasTooltip && setActive(tooltipKey + label)} onMouseLeave={() => hasTooltip && setActive(null)}
        style={{ background: isActive ? theme.rowHover : "transparent", cursor: hasTooltip ? "help" : "default", transition: "background 0.1s" }}>
        {code !== undefined && <td style={{ padding: "5px 8px", fontSize: 11, color: theme.textMuted, whiteSpace: "nowrap" }}>{code}</td>}
        <td style={{ padding: "5px 6px", fontSize: 12.5, fontWeight: bold ? 500 : 400, color: bold ? theme.text : theme.textSecond }}>
          <span style={{ display: "flex", alignItems: "center" }}>{label}{hasTooltip && <InfoBadge active={isActive} T={theme} />}</span>
        </td>
        {einheit !== undefined && <td style={{ padding: "5px 6px", fontSize: 11.5, color: theme.textMuted }}>{einheit || ""}</td>}
        {ansatz !== undefined && <td style={{ padding: "5px 6px", fontSize: 11.5, color: theme.textMuted, textAlign: "right" }}>{ansatz || ""}</td>}
        <td style={{ padding: "5px 8px", fontSize: 12.5, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: bold ? 500 : 400, color: bold ? theme.text : theme.textSecond }}>{monat || ""}</td>
        {jahr !== undefined && <td style={{ padding: "5px 8px", fontSize: 12, textAlign: "right", color: theme.textMuted }}>{jahr || ""}</td>}
        {hasTooltip && <Tooltip tooltip={tooltips[tooltipKey]} anchorRef={ref} visible={isActive} T={theme} countryCode={countryCode} />}
      </tr>
    );
  };

  const hasCode = data.sections.some(s => s.rows.some(r => r.code !== undefined));
  const hasEinheit = data.sections.some(s => s.rows.some(r => r.einheit !== undefined));

  return (
    <div id="payslip-root" style={{ position: "relative", background: theme.surfaceCard, borderRadius: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 22px 14px", background: theme.surface, borderRadius: "12px 12px 0 0", borderBottom: `1px solid ${theme.border}` }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.09em", color: theme.orange, marginBottom: 4 }}>{countryConfig[countryCode]?.flag} Payslip · {countryCode}</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: theme.text, marginBottom: 3 }}>{data.payroll.period}</div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>Date: {data.payroll.date} · {data.payroll.currency}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{data.employer.name}</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{data.employer.address}</div>
        </div>
      </div>

      {/* Employee info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `0.5px solid ${theme.border}`, padding: "12px 16px", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.orange, marginBottom: 6 }}>Employee — Confidential</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, marginBottom: 2 }}>{data.employee.name}</div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>{data.employee.address}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {Object.entries(data.employee).filter(([k]) => !["name","address"].includes(k)).map(([k, v]) => (
            <div key={k} style={{ minWidth: 120, padding: "4px 8px" }}>
              <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>{k}</div>
              <div style={{ fontSize: 12, color: theme.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "4px 10px 12px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {hasCode && <th style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 500, color: theme.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>Code</th>}
              <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: theme.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>Description</th>
              {hasEinheit && <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: theme.orange, textTransform: "uppercase", textAlign: "left" }}>Unit</th>}
              {hasEinheit && <th style={{ padding: "8px 6px 6px", fontSize: 10, fontWeight: 500, color: theme.orange, textTransform: "uppercase", textAlign: "right" }}>Rate</th>}
              <th style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 500, color: theme.orange, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>This period</th>
            </tr>
          </thead>
          <tbody>
            {data.sections.map((section, si) => (
              <>
                <tr key={"sh"+si}><td colSpan={6} style={{ padding: "10px 6px 4px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.orange, borderTop: si > 0 ? `0.5px solid ${theme.border}` : "none", borderBottom: `0.5px solid ${theme.border}` }}>{section.title}</td></tr>
                {section.rows.map((row, ri) => <Row key={si+"-"+ri} {...row} />)}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "0 14px 14px" }}>
        {[
          { label: "Gross", value: data.summary.gross, accent: false },
          { label: "Net (statutory)", value: data.summary.net, accent: false },
          { label: "Paid to bank", value: data.summary.paid, accent: true },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: accent ? "rgba(255,95,0,0.10)" : theme.summaryCard, border: `1px solid ${accent ? theme.orange : theme.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: accent ? theme.orange : theme.textMuted, marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: accent ? theme.orange : theme.text }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Bank */}
      <div style={{ margin: "0 14px 12px", padding: "9px 14px", background: theme.surface, border: `0.5px solid ${theme.border}`, borderRadius: 8, fontSize: 12, color: theme.textMuted }}>
        <span style={{ fontWeight: 500, color: theme.text }}>Bank transfer: </span>{data.summary.paid} · {data.employee.name} · IBAN: {data.bank}
      </div>

      {data.note && <div style={{ margin: "0 14px 12px", padding: "8px 14px", background: "rgba(255,95,0,0.06)", border: `0.5px solid ${theme.orange}`, borderRadius: 8, fontSize: 11, color: theme.textSecond }}>{data.note}</div>}

      {/* Footer */}
      <div style={{ margin: "0 14px 18px", padding: "9px 14px", border: `0.5px solid ${theme.border}`, borderRadius: 8, fontSize: 11, color: theme.textMuted, lineHeight: 1.7 }}>
        Sample payslip — all personal data is anonymised. Real employee figures are not stored here. Hover any <span style={{ fontStyle: "italic", border: `1px solid ${theme.border}`, borderRadius: "50%", padding: "0 3px", fontSize: 9, color: theme.orange }}>i</span> field for a bilingual explanation.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COUNTRY SELECTOR
// ─────────────────────────────────────────────────────────────
function CountrySelector({ onSelect, T: theme }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ background: theme.pageBg, minHeight: "100vh", padding: "48px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: theme.orange, color: "#fff", fontWeight: 500, fontSize: 16, letterSpacing: "0.08em", padding: "6px 12px", borderRadius: 5 }}>SIXT</div>
          <div style={{ fontSize: 13, color: theme.textMuted }}>Employee Portal</div>
        </div>
      </div>
      <div style={{ marginBottom: 44, maxWidth: 560 }}>
        <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.orange, marginBottom: 12 }}>Payroll &amp; Compensation</div>
        <h1 style={{ fontSize: 34, fontWeight: 500, margin: "0 0 12px", color: theme.text, lineHeight: 1.2 }}>Understand your payslip</h1>
        <p style={{ fontSize: 15, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>Select your country to explore a sample payslip and learn what each field means — in English and your local language.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 10, marginBottom: 32 }}>
        {Object.entries(countryConfig).map(([code, c]) => {
          const isHov = hovered === code;
          return (
            <button key={code} onClick={() => c.active && onSelect(code)} onMouseEnter={() => setHovered(code)} onMouseLeave={() => setHovered(null)}
              style={{ background: isHov && c.active ? "rgba(255,95,0,0.1)" : theme.surfaceCard, border: `1px solid ${isHov && c.active ? theme.orange : theme.border}`, borderRadius: 10, padding: "18px 14px", cursor: c.active ? "pointer" : "not-allowed", opacity: c.active ? 1 : 0.4, textAlign: "left", position: "relative", transition: "border-color 0.15s, background 0.15s" }}>
              <div style={{ fontSize: 26, marginBottom: 9, lineHeight: 1 }}>{c.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: isHov && c.active ? theme.orange : theme.text, marginBottom: 3, transition: "color 0.15s" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>{code}</div>
              {!c.active && <div style={{ position: "absolute", top: 9, right: 9, fontSize: 10, fontWeight: 500, background: theme.surface, color: theme.textMuted, padding: "2px 7px", borderRadius: 4, border: `0.5px solid ${theme.border}` }}>Soon</div>}
            </button>
          );
        })}
      </div>
      <div style={{ maxWidth: 540, padding: "14px 18px", background: theme.surfaceCard, border: `0.5px solid ${theme.border}`, borderRadius: 10, fontSize: 13, color: theme.textMuted, lineHeight: 1.7 }}>
        <span style={{ fontWeight: 500, color: theme.text }}>How it works: </span>
        Hover any field marked with an <span style={{ fontStyle: "italic", border: `0.5px solid ${theme.border}`, borderRadius: "50%", padding: "0 4px", fontSize: 10, color: theme.orange }}>i</span> indicator for a bilingual explanation.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// THEME TOGGLE BUTTON
// ─────────────────────────────────────────────────────────────
function ThemeToggle({ isDark, toggle, T: theme }) {
  return (
    <button onClick={toggle} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.textMuted, background: theme.surfaceCard, border: `0.5px solid ${theme.border}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", transition: "all 0.15s" }}>
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
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ background: T.orange, color: "#fff", fontWeight: 500, fontSize: 16, letterSpacing: "0.08em", padding: "6px 12px", borderRadius: 5 }}>SIXT</div>
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
      <GenericPayslip countryCode={country} T={T} />
    </div>
  );
}
