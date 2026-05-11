/**
 * Cycle 19B-FL — Lead-magnet data registry.
 *
 * Each entry is the source-of-truth for one downloadable PDF. The dynamic
 * `/downloads/[slug]/` route renders a print-friendly HTML view from this data
 * which `scripts/render-lead-magnets.ts` then prints to PDF via chrome
 * --headless --print-to-pdf.
 *
 * Honesty contract (per Cycle 19B-FL Constraints):
 *   - Every factual claim traces to a source-ledger row.
 *   - Mia coordinates; licensed specialists confirm.
 *   - No legal, insurance, inspection, marine-survey, engineering, tax, or
 *     lending advice rendered as advice — checklists frame questions, not
 *     answers, and route to specialists for ground truth.
 *   - No fabricated off-market guarantees, MLS-access promises, or
 *     response-time commitments.
 *   - PDF-use agreement (per principal directive Q3 + Q4): personal-use only,
 *     no resale, copyright retained, no professional-advice reliance.
 */

export type LedgerSource = {
  readonly label: string;
  readonly url?: string;
  readonly note?: string;
};

export type LeadMagnetSection = {
  readonly heading: string;
  readonly sub?: string;
  readonly items: ReadonlyArray<string>;
  readonly note?: string;
};

export type LeadMagnet = {
  readonly slug: string;
  readonly kind: "buyer" | "seller" | "valuation";
  readonly title: string;
  readonly subtitle: string;
  readonly intro: string;
  /** Cycle 19B-FL-R1 — optional enrichment for standalone PDF document */
  readonly whoFor?: string;
  readonly howToUse?: string;
  readonly documentsToRequest?: ReadonlyArray<string>;
  readonly specialists?: ReadonlyArray<string>;
  readonly redFlags?: ReadonlyArray<string>;
  readonly notes?: ReadonlyArray<string>;
  readonly sections: ReadonlyArray<LeadMagnetSection>;
  readonly nextStep: { readonly label: string; readonly href: string };
  readonly ledger: ReadonlyArray<LedgerSource>;
};

export const LEAD_MAGNETS: ReadonlyArray<LeadMagnet> = [
  {
    slug: "waterfront-buyer-due-diligence-checklist",
    kind: "buyer",
    title: "Waterfront Buyer Due Diligence Checklist",
    subtitle: "Eastern Fort Lauderdale waterfront residences",
    intro:
      "A working checklist for serious buyers of Fort Lauderdale waterfront residences. The list is organized by the diligence sequence Mia uses to structure private buyer-side conversations — survey first, water and dock data next, insurance underwriting before the offer. Each item is a question to bring to a licensed specialist, not a substitute for one.",
    whoFor:
      "Serious buyers of Eastern Fort Lauderdale waterfront residences who want a private diligence sequence before making an offer.",
    howToUse:
      "Work through the sections in order — survey first, then water and dock data, then insurance underwriting. Bring each question to the relevant licensed specialist; this checklist coordinates the conversation, it does not replace expert findings.",
    documentsToRequest: [
      "Boundary survey (most recent)",
      "Elevation certificate",
      "Dock and seawall inspection reports",
      "4-point inspection report",
      "Wind-mitigation report",
      "Permit history (LauderBuild)",
      "HOA architectural-review records (if applicable)",
      "Prior insurance claim history (CLUE report)",
    ],
    redFlags: [
      "Open or expired permits on the property record.",
      "Seawall inspection older than 5 years with no recent walk-through.",
      "Dock work in the past 10 years without a closed marine permit.",
      "Elevation certificate dated before a recent floodplain map revision.",
      "Insurance broker declines to quote pre-offer.",
      "Seller refuses to provide a CLUE / prior-claim history.",
    ],
    notes: [
      "Property address:",
      "Folio number:",
      "Scheduled inspection date:",
      "Insurance broker assigned:",
      "Specialist roster confirmed:",
      "Other:",
    ],
    sections: [
      {
        heading: "Parcel basics",
        items: [
          "Confirm folio number on the Broward County Property Appraiser record.",
          "Pull the legal description and confirm it matches the current survey on file.",
          "Cross-reference the address with the City of Fort Lauderdale property records.",
          "Note the parcel's zoning designation and any historic-district overlays.",
        ],
      },
      {
        heading: "Survey and legal description",
        items: [
          "Order or request the most recent boundary survey from the seller's file.",
          "Confirm lot frontage on the canal, lot depth, and any setbacks of record.",
          "Identify any easements (drainage, utility, dockage, shared seawall).",
          "Flag any encroachments visible on the survey for legal review.",
        ],
      },
      {
        heading: "Dockage capacity",
        items: [
          "Verify dock length, beam clearance, and fendering against the seller's dock permits.",
          "Confirm pile count and condition; request the most recent dock inspection if available.",
          "Note lift capacity, lift age, and any service history of the lift mechanism.",
          "Photograph the dock at low tide to confirm usable depth at the slip.",
        ],
      },
      {
        heading: "Seawall, cap, and tiebacks",
        items: [
          "Request the seawall inspection report (cap condition, tieback integrity, prior remediation).",
          "Note the seawall's installation year and any documented repairs.",
          "Confirm whether any seawall reserve fund or HOA reserve covers shared sections.",
          "Walk the seawall at low tide with the marine contractor if the inspection is older than 5 years.",
        ],
      },
      {
        heading: "Canal, turning basin, bridge clearance",
        items: [
          "Measure canal width at the residence and at the nearest turning basin.",
          "Confirm bridge clearances along the route to Port Everglades (or Hillsboro Inlet for residences farther north).",
          "Identify each drawbridge on the route and its current operating schedule.",
          "Confirm route-to-inlet count: number of fixed bridges (zero is the deepwater premium) and number of opening bridges.",
        ],
      },
      {
        heading: "Flood zone, elevation, prior claims",
        items: [
          "Pull the FEMA flood zone designation for the parcel.",
          "Request the elevation certificate; confirm the lowest finished floor elevation and reference datum.",
          "Request prior-claim history (a CLUE report from the seller or carrier where available).",
          "Compare flood-zone designation against any recent floodplain map revisions.",
        ],
      },
      {
        heading: "Insurance underwriting sequence",
        items: [
          "Engage a Florida-licensed insurance broker before the offer goes in, not after.",
          "Request quotes against the seller's recent 4-point inspection and wind-mitigation report.",
          "Confirm whether the parcel qualifies for private windstorm coverage or routes to Citizens.",
          "Note any underwriting conditions that would require remediation before binding.",
        ],
      },
      {
        heading: "Systems inspection",
        items: [
          "Order the 4-point inspection: roof, electrical, plumbing, HVAC.",
          "Order a wind-mitigation inspection to capture credits.",
          "Walk the property with a licensed home inspector experienced in waterfront residences.",
          "For older renovations, request a permit-history pull to confirm closed permits.",
        ],
      },
      {
        heading: "Renovation and permit history",
        items: [
          "Pull the City of Fort Lauderdale building-permit history (LauderBuild).",
          "Confirm every renovation has a closed permit; note any open or expired permits.",
          "For dock or seawall work in the past 10 years, confirm the marine-contractor permit closed.",
          "Note any HOA architectural-review records for cosmetic or structural changes.",
        ],
      },
      {
        heading: "Specialist roster",
        sub: "Mia coordinates the introductions; the specialists' findings — not Mia's summaries — are the ground truth.",
        items: [
          "Licensed home inspector with waterfront-residence experience.",
          "Florida-licensed marine contractor (dock, seawall, lift).",
          "Land surveyor for boundary, elevation, and as-built confirmations.",
          "Florida-licensed insurance broker familiar with coastal underwriting.",
          "Mortgage advisor (when financing), with coastal-Florida portfolio experience.",
          "Title insurance / closing attorney with Broward County jurisdiction.",
        ],
      },
    ],
    nextStep: {
      label: "Begin a Private Buyer Brief",
      href: "/contact/?intent=buyer-brief&market=fort-lauderdale&source=pdf-buyer-checklist",
    },
    ledger: [
      { label: "Broward County Property Appraiser", url: "https://web.bcpa.net/" },
      { label: "City of Fort Lauderdale property records", url: "https://www.fortlauderdale.gov/" },
      { label: "City of Fort Lauderdale LauderBuild permit portal" },
      { label: "FEMA Flood Map Service Center", url: "https://msc.fema.gov/" },
      { label: "Florida OIR — windstorm/4-point/wind-mitigation guidance" },
      {
        label:
          "MIA-SITE Cycle 18 source ledger — docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md",
      },
    ],
  },
  {
    slug: "luxury-seller-pre-listing-checklist",
    kind: "seller",
    title: "Luxury Seller Pre-Listing Checklist",
    subtitle: "Eastern Fort Lauderdale waterfront residences",
    intro:
      "A working checklist for owners preparing to list a Fort Lauderdale waterfront residence. The list mirrors the seller-side diligence Mia uses to structure private seller-side conversations before any photography or listing prep — current comparables, waterfront documentation, insurance dataroom, buyer-profile positioning. Each item is a deliverable to organize, not advice to follow.",
    whoFor:
      "Owners preparing to list a Fort Lauderdale waterfront residence who want to organize comparable sales, documentation, and positioning before any photography or open-house cycle.",
    howToUse:
      "Use this as the pre-listing dataroom checklist. Complete the comparables and documentation sections before scheduling photography. The pre-market decision tree at the end is a written decision, not an afterthought.",
    documentsToRequest: [
      "Most recent boundary survey",
      "Current dock and seawall inspection records",
      "Permit history from LauderBuild (open + closed)",
      "HOA architectural-review records (if applicable)",
      "Recent 4-point and wind-mitigation inspections",
      "Elevation certificate",
      "Renovation receipts and contractor invoices",
      "Prior-claim history (CLUE report) for past 5-7 years",
    ],
    specialists: [
      "Pre-listing inspector with waterfront-residence experience.",
      "Florida-licensed marine contractor (dock, seawall, lift inspection).",
      "Editorial photographer experienced with waterfront and dock-up narratives.",
      "Title insurance / closing attorney with Broward County jurisdiction.",
      "Florida-licensed insurance broker for buyer-side dataroom completeness.",
    ],
    redFlags: [
      "Open permits on the renovation record.",
      "Seawall age exceeding the inspection interval.",
      "No recent 4-point or wind-mitigation inspection on file.",
      "Photography contract that is not residence-specific.",
      "Comparable cohort uses generic neighborhood comps instead of canal-specific ones.",
    ],
    notes: [
      "Property address:",
      "Folio number:",
      "Target list date:",
      "Photography scheduled:",
      "Pre-market window (weeks):",
      "Other:",
    ],
    sections: [
      {
        heading: "Comparable-sales cohort",
        items: [
          "Identify the right comparable cohort: same canal, same block, similar lot profile, recent sales.",
          "Exclude generic neighborhood comps that miss the deepwater or finger-isle premium.",
          "Pull seller-side adjustments for renovations, dock conditions, and seawall age.",
          "Document Mia's comparable-sales review in writing so the listing strategy traces to specifics.",
        ],
      },
      {
        heading: "Waterfront documentation package",
        items: [
          "Most recent boundary survey on file (with as-built features).",
          "Current dock and seawall inspection records.",
          "Permit history pulled from LauderBuild (open + closed).",
          "HOA architectural-review records, where applicable.",
          "Photographs of dock and seawall at multiple tide levels.",
        ],
      },
      {
        heading: "Insurance dataroom",
        sub: "What the buyer's insurance broker and lender will request — organized before listing reduces post-inspection renegotiation.",
        items: [
          "Recent 4-point inspection (roof, electrical, plumbing, HVAC).",
          "Recent wind-mitigation inspection capturing applicable credits.",
          "Elevation certificate; confirm lowest finished floor elevation and datum reference.",
          "Prior-claim history (CLUE report) for the past 5-7 years where available.",
          "Renovation receipts and permits for any work that affects the insurance binding profile.",
        ],
      },
      {
        heading: "Inspection preparation",
        items: [
          "Pre-listing inspection (optional but compresses the buyer's contingency window).",
          "Address any items likely to surface in a buyer's 4-point or general inspection.",
          "Confirm all open permits have been closed by the contractor of record.",
          "Document any post-inspection repairs with paid invoices and warranties where applicable.",
        ],
      },
      {
        heading: "Editorial photography and dock-up narrative",
        items: [
          "Photography that captures the lot, the route to the inlet, the dock, and the lanai — not only the interiors.",
          "Confirm the listing copy carries the residence's specific identity (architectural era, canal context, lifestyle anchor).",
          "Prepare an open-house and broker-tour narrative tuned to a single buyer profile.",
          "Walk the photography contract with Mia before the photographer arrives so the brief is residence-specific.",
        ],
      },
      {
        heading: "Tour and showing strategy",
        items: [
          "Showing windows tuned to the buyer profile (vessel buyers at sunset; hosting buyers at golden hour).",
          "Staging tuned to the architectural era — not generic.",
          "Confirm any pre-showing checklist with Mia before each tour cycle.",
          "Schedule a broker-tour day before any public open house to surface broker-network feedback.",
        ],
      },
      {
        heading: "Buyer-profile positioning",
        items: [
          "Identify the single dominant buyer profile (yachting, in-town walkability, beach-corridor).",
          "Confirm listing copy, photography, and showing strategy align to that profile.",
          "Document the positioning rationale in writing so the strategy stays coherent if market conditions shift.",
        ],
      },
      {
        heading: "Quiet pre-market decision tree",
        sub: "A discrete decision to make in writing before any listing copy is finalized.",
        items: [
          "Decide whether to allow a quiet pre-market period (Mia mentions the residence privately to brokers whose buyers fit).",
          "Set the time horizon for the pre-market window (commonly 2-6 weeks).",
          "Define what triggers public listing (buyer-pool exhaustion, calendar date, market shift).",
          "Confirm the pre-market option is consistent with any HOA or contractual disclosure obligations.",
        ],
      },
      {
        heading: "Seller next step",
        sub: "Mia coordinates the introductions to inspectors, marine contractors, photographers, and the title/closing roster.",
        items: [
          "Request a confidential property-specific valuation.",
          "Schedule the listing brief — comps, positioning, photography, timeline.",
          "Decide on the pre-market period in writing before any listing copy goes out.",
        ],
      },
    ],
    nextStep: {
      label: "Request a Confidential Valuation",
      href: "/valuation/?market=fort-lauderdale&source=pdf-seller-checklist",
    },
    ledger: [
      { label: "Broward County Property Appraiser", url: "https://web.bcpa.net/" },
      { label: "City of Fort Lauderdale LauderBuild permit portal" },
      { label: "Florida OIR — windstorm/4-point/wind-mitigation guidance" },
      { label: "NAR REALTOR® Code of Ethics — Standards of Practice on advertising" },
      {
        label:
          "MIA-SITE Cycle 18 source ledger — docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md",
      },
    ],
  },
  {
    slug: "fort-lauderdale-waterfront-valuation-prep-sheet",
    kind: "valuation",
    title: "Fort Lauderdale Waterfront Valuation Prep Sheet",
    subtitle: "Information to organize before a confidential valuation review",
    intro:
      "A prep sheet for owners requesting a confidential, property-specific valuation. Public estimates miss the variables that drive waterfront price; this is the residence-specific information Mia uses to draw the right comparable cohort and frame an honest valuation conversation.",
    whoFor:
      "Owners requesting a confidential, residence-specific valuation review who want to organize parcel, water-frontage, and insurance data before the conversation.",
    howToUse:
      "Gather what you can answer; leave blanks where you can't. Mia uses your responses to frame a residence-specific comparable cohort instead of a generic neighborhood range.",
    documentsToRequest: [
      "Most recent boundary survey",
      "Elevation certificate",
      "Dock and seawall inspection records",
      "4-point and wind-mitigation inspection reports",
      "Permit history (LauderBuild)",
      "Any prior listing history of the residence",
    ],
    specialists: [
      "Florida-licensed insurance broker for dataroom completeness.",
      "Land surveyor for as-built confirmation if the survey is older than 5 years.",
      "Title insurance / closing attorney for any pre-listing structural questions.",
    ],
    redFlags: [
      "A public valuation estimate that diverges sharply from owner expectation without a residence-specific reason.",
      "Recent on-block sales the owner is unaware of.",
      "Prior listing history at a materially lower price-per-sqft without renovation since.",
      "Shared-seawall obligations not previously disclosed.",
    ],
    notes: [
      "Property address:",
      "Folio number:",
      "Year built:",
      "Linear feet of frontage:",
      "Notable architectural pedigree:",
      "Owner priority — list / hold / refinance:",
      "Other:",
    ],
    sections: [
      {
        heading: "Address and parcel basics",
        items: [
          "Full address with unit / building number if applicable.",
          "Broward County folio number (find it on the Property Appraiser record).",
          "Year built and most recent major renovation year.",
          "Living-area square footage and lot dimensions.",
        ],
      },
      {
        heading: "Neighborhood and submarket",
        items: [
          "Neighborhood name (Las Olas Isles, Harbor Beach, Rio Vista, Coral Ridge, Victoria Park, Bay Colony, Bermuda Riviera, etc.).",
          "HOA or property-owner-association status, if any.",
          "Country-club membership or other amenity attachments that travel with the residence.",
          "Any historic-district designation that affects renovation rules.",
        ],
      },
      {
        heading: "Water frontage and canal context",
        items: [
          "Linear feet of water frontage on the parcel.",
          "Canal name and width at the residence.",
          "Lot orientation (point, finger, canal-wide, lakefront).",
          "Whether the parcel sits on a turning basin or a through-canal.",
        ],
      },
      {
        heading: "Route-to-inlet and bridge variables",
        items: [
          "Inlet route (Port Everglades for most Eastern Fort Lauderdale parcels; Hillsboro Inlet for some northern alternatives).",
          "Count of fixed bridges between the dock and the open Atlantic (zero is the deepwater premium).",
          "Count of opening bridges; current operating schedules.",
          "Approximate run time from dock to inlet at idle speed.",
        ],
      },
      {
        heading: "Dock and seawall condition",
        items: [
          "Dock length, beam clearance, lift presence + capacity.",
          "Seawall installation year, last inspection year, any documented repairs.",
          "Any shared-seawall obligations with neighboring parcels.",
          "Any planned or anticipated seawall, dock, or lift work.",
        ],
      },
      {
        heading: "Architectural era and renovation history",
        items: [
          "Architectural era (1920s Mediterranean Revival, mid-century modern, coastal modern, contemporary, new construction).",
          "Significant renovations with year and scope.",
          "Pool, lanai, and outdoor-living features.",
          "Notable architectural pedigree (architect, builder, original owner) where it affects market value.",
        ],
      },
      {
        heading: "Insurance, flood, and elevation documents",
        items: [
          "Most recent 4-point inspection on file.",
          "Most recent wind-mitigation inspection.",
          "Current elevation certificate.",
          "Any prior-claim history (CLUE report or carrier letter).",
        ],
      },
      {
        heading: "Comparable-sales context",
        items: [
          "Any recent on-block sales the owner is aware of.",
          "Any prior listing history of the residence itself.",
          "Any private inquiries received before any prior listing in the past 24 months.",
          "Owner's perception of where the residence trades relative to immediate peers.",
        ],
      },
      {
        heading: "Seller goals and timeline",
        items: [
          "Goal — list, hold, refinance, gift, partial-interest, estate plan.",
          "Target timeline — list date, target-close month, hard deadlines.",
          "Privacy preference — public-listing, quiet pre-market, or hybrid.",
          "Any constraints from co-owners, trust beneficiaries, or counsel.",
        ],
      },
      {
        heading: "Next step",
        sub: "The information above lets Mia frame a residence-specific comparable cohort rather than a generic neighborhood range.",
        items: [
          "Submit the form on /valuation/ or call (954) 540-0358 to schedule the confidential review.",
          "Mia or her team will follow up to confirm the timeline for the confidential review.",
        ],
      },
    ],
    nextStep: {
      label: "Request a Confidential Valuation",
      href: "/valuation/?market=fort-lauderdale&source=pdf-valuation-prep",
    },
    ledger: [
      { label: "Broward County Property Appraiser", url: "https://web.bcpa.net/" },
      { label: "City of Fort Lauderdale LauderBuild permit portal" },
      { label: "FEMA Flood Map Service Center", url: "https://msc.fema.gov/" },
      {
        label:
          "MIA-SITE Cycle 18 source ledger — docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md",
      },
    ],
  },
];

export function getLeadMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find((m) => m.slug === slug);
}

export const LEAD_MAGNET_SLUGS = LEAD_MAGNETS.map((m) => m.slug);

export const PDF_DISCLAIMER =
  "Not legal, insurance, inspection, marine survey, engineering, tax, or lending advice. The information in this document is a working checklist drawn from Mia Sanabria's coordination experience with Eastern Fort Lauderdale waterfront residences. Mia coordinates the engagement of licensed specialists — inspectors, surveyors, marine contractors, insurance brokers, lenders, title agents — whose findings, not this document, are the ground truth for any specific residence.";

export const PDF_USE_AGREEMENT =
  "Use agreement: This document is provided for personal, non-commercial use by the recipient considering a buyer, seller, or valuation engagement with Mia Sanabria. Redistribution, resale, or rebranding without written permission is prohibited. © Mia Sanabria, REALTOR® with LPT Realty LLC. All content reflects information current to the build date noted on this page and may be updated without notice. By using this document, you acknowledge that it is informational only and not professional advice in any regulated field.";
