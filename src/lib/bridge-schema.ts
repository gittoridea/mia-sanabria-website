/**
 * Bridge Data Output — OData response types.
 *
 * Source: RESO Web API / Bridge OData docs (extracted 2026-05-14).
 * Endpoint: https://api.bridgedataoutput.com/api/v2/OData/{dataset_id}/idx/Properties
 *
 * Only fields used in the sanitized display layer are typed here.
 * The raw API returns many more fields; the bridge-client.ts fetch
 * layer selects and sanitizes what the UI receives.
 */

export type ODataCollection<T> = {
  "@odata.context"?: string;
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
  value: T[];
};

export type BridgeMedia = {
  MediaURL?: string;
  Order?: number;
  MediaCategory?: string;
};

export type BridgeProperty = {
  ListingKey?: string;
  ListingId?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  StandardStatus?: string;
  ModificationTimestamp?: string;
  PropertyType?: string;
  PropertySubType?: string;
  PublicRemarks?: string;
  Media?: BridgeMedia[];
};

/** Fields requested from Bridge — explicit allowlist for $select param. */
export const BRIDGE_SELECT_FIELDS = [
  "ListingKey",
  "ListingId",
  "ListPrice",
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "LivingArea",
  "City",
  "PostalCode",
  "StandardStatus",
  "ModificationTimestamp",
  "PropertyType",
  "PublicRemarks",
].join(",") as string;
