import { SITE_PROFILE } from './profile';
import { SITE_HOST, SUPPORT_EMAIL } from './site';

/**
 * Values the legal pages have to state in one place, so the Terms, the Privacy Policy and the
 * Refund Policy can never contradict each other (or the pricing page) after an edit.
 *
 * `contactEmail` must match the mailbox the billing API advertises (`MEMBERSHIP_CONTACT_EMAIL`,
 * defaulting to the deployment's own support address), because that is where buyers are told to write.
 */
export const LEGAL = {
  /** Brand the subscription is sold under. Replace with the registered entity name if there is one. */
  operator: SITE_PROFILE.operatorName,
  website: SITE_HOST,
  contactEmail: SUPPORT_EMAIL,
  refundWindowDays: 14,
  /** Jurisdiction whose courts hear disputes — change if the operating entity is registered elsewhere. */
  governingLaw: "the People's Republic of China",
  updatedAt: 'September 20, 2026',
} as const;

export const REAL_PERSON_UPLOAD_POLICY = 'You may upload or use a photo or other material depicting a real person only if it depicts you or you have that person’s explicit consent to upload and process it with AI. You must also have permission from any other rights holder whose authorisation is needed. Do not upload someone else’s photo without their consent.';

export const PROMPT_SCREENING_DISCLOSURE = 'Waffo Pancake processes the text instructions sent for content safety screening before AI generation. This check receives text only; we do not send uploaded photos or account details to Waffo for prompt screening.';

export const REAL_PERSON_UPLOAD_NOTICE = {
  en: 'Upload photos of yourself or people who have given permission for AI processing. You must also have any required permission from the photo’s rights holder.',
  zh: '仅上传本人照片，或已获照片中人物同意用于 AI 处理的照片。若还需照片权利人授权，请先取得授权。',
};
