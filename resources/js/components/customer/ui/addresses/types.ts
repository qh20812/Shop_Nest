export type AdministrativeOption = {
  id: number;
  name: string;
  code?: string;
};

export type CountryOption = {
  id: number;
  name: string;
  iso_code_2: string;
};

export type DivisionStructure = {
  levels: string[];
  labels: Record<string, string[]>;
};

export type CustomerAddress = {
  id: number;
  country_id?: number | null;
  recipient_name?: string | null;
  full_name?: string | null;
  phone?: string | null;
  phone_number?: string | null;
  address_line?: string | null;
  street_address?: string | null;
  province_id?: number | null;
  district_id?: number | null;
  ward_id?: number | null;
  province?: { id?: number; name?: string | null } | null;
  district?: { id?: number; name?: string | null } | null;
  ward?: { id?: number; name?: string | null } | null;
  province_name?: string | null;
  district_name?: string | null;
  ward_name?: string | null;
  postal_code?: string | null;
  is_default?: boolean | null;
  updated_at?: string | null;
};

export type AddressFormData = {
  country_id: number | '';
  recipient_name: string;
  phone: string;
  address_line: string;
  province_id: number | '';
  district_id: number | '';
  ward_id: number | '';
  postal_code: string;
  is_default: boolean;
};
