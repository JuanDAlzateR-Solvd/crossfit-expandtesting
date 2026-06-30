/**
 * Form payloads for the /form-validation page — separated from page logic so the
 * same page object can be driven with many positive/negative data sets.
 */

/**
 * Payment options are the `<select>` **values** used by the live page
 * (`cashondelivery` / `card`), selected by value for robustness — the visible
 * labels carry inconsistent casing/whitespace.
 */
export type PaymentMethod = 'cashondelivery' | 'card';

export interface FormValidationPayload {
  readonly contactName: string;
  /** Must match the page's required pattern `[0-9]{3}-[0-9]{7}` (e.g. 012-3456789). */
  readonly contactNumber: string;
  /** ISO date string, `yyyy-mm-dd`, suitable for an `<input type="date">`. */
  readonly pickupDate: string;
  readonly paymentMethod: PaymentMethod;
}

/** A fully valid submission. */
export const validFormPayload: FormValidationPayload = {
  contactName: 'Annie Thorisdottir',
  contactNumber: '012-3456789',
  pickupDate: '2026-07-15',
  paymentMethod: 'card',
};

/**
 * Malformed payloads for negative testing. Each supplies a value that violates a
 * required/pattern constraint so the matching inline validation message appears
 * and the form stays on the page.
 *
 * NOTE: the live page pre-fills Contact Name with `value="dodo"`, so a negative
 * "required name" case must explicitly clear the field (empty string) rather
 * than just omit it.
 */
export const invalidFormPayloads: Readonly<Record<string, Partial<FormValidationPayload>>> = {
  blankContactName: {
    contactName: '', // clears the pre-filled "dodo" so the field is invalid
  },
  badContactNumber: {
    contactName: 'Rich Froning',
    contactNumber: '123', // does not match [0-9]{3}-[0-9]{7}
    pickupDate: '2026-07-15',
    paymentMethod: 'card',
  },
};
