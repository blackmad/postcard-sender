export const POSTCARD_COST = 0.70;
export const LETTER_COST = 0.63;

export interface Address {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
}

export interface Template {
  template: string;
  fields: string[];
  addresses: Address[];
  name: string;
  id: string;
}