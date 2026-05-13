# Audit Legal Report
**Generated:** 2026-05-13T17:20:14.999Z
**Summary:** 18 PASS · 1 WARN · 0 FAIL · 0 SKIP

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `legal.canonical.privacy` | ✅ | /privacy/ has canonical link | canonical present |
| `legal.breadcrumb.privacy` | ✅ | /privacy/ emits BreadcrumbList schema | BreadcrumbList present |
| `legal.footerLinks.privacy` | ✅ | /privacy/ renders all 4 legal footer links | all legal links present |
| `legal.email.privacy` | ✅ | /privacy/ uses canonical email from PUBLIC_FACT_LEDGER §1 | email msanabriarea@gmail.com present |
| `legal.canonical.terms` | ✅ | /terms/ has canonical link | canonical present |
| `legal.breadcrumb.terms` | ✅ | /terms/ emits BreadcrumbList schema | BreadcrumbList present |
| `legal.footerLinks.terms` | ✅ | /terms/ renders all 4 legal footer links | all legal links present |
| `legal.email.terms` | ✅ | /terms/ uses canonical email from PUBLIC_FACT_LEDGER §1 | email msanabriarea@gmail.com present |
| `legal.canonical.accessibility` | ✅ | /accessibility/ has canonical link | canonical present |
| `legal.breadcrumb.accessibility` | ✅ | /accessibility/ emits BreadcrumbList schema | BreadcrumbList present |
| `legal.footerLinks.accessibility` | ✅ | /accessibility/ renders all 4 legal footer links | all legal links present |
| `legal.email.accessibility` | ✅ | /accessibility/ uses canonical email from PUBLIC_FACT_LEDGER §1 | email msanabriarea@gmail.com present |
| `legal.canonical.dmca` | ✅ | /dmca/ has canonical link | canonical present |
| `legal.breadcrumb.dmca` | ✅ | /dmca/ emits BreadcrumbList schema | BreadcrumbList present |
| `legal.footerLinks.dmca` | ✅ | /dmca/ renders all 4 legal footer links | all legal links present |
| `legal.email.dmca` | ✅ | /dmca/ uses canonical email from PUBLIC_FACT_LEDGER §1 | email msanabriarea@gmail.com present |
| `legal.dmca.uscoFlag` | ⚠️ | DMCA page transparently notes USCO designated-agent registration pending | USCO + in-process language present (acceptable for staging; BLOCKED for production cutover per CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md) |
| `legal.privacy.ghlConditional` | ✅ | Privacy mentions GHL/LeadConnector as conditional service provider | conditional language present |
| `legal.terms.realtorAndFL` | ✅ | Terms include canonical REALTOR® mark definition and Florida governing-law clause | REALTOR® definition + FL governing law present |