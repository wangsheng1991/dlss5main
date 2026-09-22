/**
 * The specification table.
 *
 * This file is data, and it is the asset: every future country and language is another entry here,
 * not another feature. Rows are added only from pages that were actually read, and each number
 * carries the sentence it came from so that a stranger — or a test, months later — can re-check it
 * without trusting whoever typed it.
 *
 * Russian first, on the evidence in `content-engine/docs/TOOL_RADAR.md` §11: 3 × 4 cm photos are
 * demanded by a long list of internal documents, the front page for that query has no large player
 * on it, and the competitor currently winning it is a chain of physical photo studios.
 */

import type { PhotoSpec } from './types';

const READ_AT = '2026-09-22';

export const PHOTO_SPECS: PhotoSpec[] = [
  {
    id: 'ru-doc-3x4',
    label: 'Фото 3 × 4 см',
    locale: 'ru',
    purpose: 'Медкнижка, студенческий билет, пропуск, военный билет, зачётная книжка — типовая 3 × 4 см',
    sizeMm: { width: 30, height: 40 },
    headHeightMm: { min: 26, max: 26 },
    // 3 mm in one source, 2–4 mm in the other: 3 sits inside the band, so the two agree.
    headroomMm: { min: 2, max: 4 },
    background: '#FFFFFF',
    minDpi: 600,
    sheets: ['10x15cm', '4x6in', 'a4'],
    status: 'verified',
    sources: [
      {
        url: 'https://photo-visa.online/s/foto-na-3-na-4-onlayn',
        quote: 'необходимо фото размером 30.00mm × 40.00mm с разрешением не менее 600 dpi. Фон должен быть белый, без посторонних предметов и теней.',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://photo-visa.online/s/foto-na-3-na-4-onlayn',
        quote: 'высота головы (до макушки волос) : 26.00mm расстояние от верхней части фотографии до верхней части волос : 3.00mm',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://39mm.ru/requirement.html',
        quote: 'Фото на мед.книжку, студ.билет, пенсионное удостоверение, разрешение на работу, временную регистрацию, зачетные книжки, пропуски, удостоверения, анкеты, военный билет (типовая 3х4 см)',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://39mm.ru/requirement.html',
        quote: 'Поле над головой: 2-4 мм.',
        retrievedAt: READ_AT,
      },
    ],
    conflicts: [
      {
        field: 'headHeightMm',
        value: '11-13 мм. в высоту',
        source: 'https://39mm.ru/requirement.html',
        resolution:
          'Rejected. An 11–13 mm head inside a 40 mm frame is a third of the height, which no document photo service accepts; the same page says "не менее 70-80%" three entries above. The figure is kept here rather than deleted so the next person re-reading that page finds the decision instead of repeating it.',
      },
    ],
  },
  {
    id: 'ru-passport-35x45',
    label: 'Фото на паспорт РФ, 35 × 45 мм',
    locale: 'ru',
    purpose: 'Паспорт гражданина РФ, загранпаспорт, анкеты и визовые пакеты, требующие российский формат',
    sizeMm: { width: 35, height: 45 },
    headHeightMm: { min: 32, max: 36 },
    headroomMm: { min: 4, max: 6 },
    background: '#FFFFFF',
    minDpi: 300,
    sheets: ['10x15cm', '4x6in', 'a4'],
    status: 'verified',
    sources: [
      {
        url: 'https://39mm.ru/requirement.html',
        quote: 'Размер головы: не менее 70-80% от общего размера фотографии по высоте. То есть изображение головы в длину 32-36 мм., в ширину 18-25 мм.',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://39mm.ru/requirement.html',
        quote: 'Поле над головой: 5 мм, разрешена погрешность 1 мм.',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://pasporta.org/zagranpasport/foto-na-zagranpasport/',
        quote: 'Над верхней частью головы должна оставаться свободная область высотой от 4 до 6 мм.',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://pasporta.org/zagranpasport/foto-na-zagranpasport/',
        quote: 'необходим снимок 35 на 45 мм',
        retrievedAt: READ_AT,
      },
      {
        url: 'https://visa-guru.ru/blog/zagranpassport/foto-na-zagranpasport',
        quote: 'Действующие стандарты предписывают, чтобы вверху снимка оставался зазор не менее 2 мм, а голова занимала примерно 32–36 мм.',
        retrievedAt: READ_AT,
      },
    ],
    conflicts: [
      {
        field: 'headroomMm',
        value: 'зазор не менее 2 мм',
        source: 'https://visa-guru.ru/blog/zagranpassport/foto-na-zagranpasport',
        resolution:
          'Adopted as a floor rather than a target. The admissible band of 4–6 mm satisfies "not less than 2 mm", so the two statements do not actually disagree once one is read as the minimum it says it is.',
      },
    ],
  },
  {
    id: 'ru-int-passport-35x45',
    label: 'Фото для анкеты на загранпаспорт (нового образца), 35 × 45 мм',
    locale: 'ru',
    purpose: 'Фотография, вклеиваемая в анкету на загранпаспорт нового образца',
    sizeMm: { width: 35, height: 45 },
    headHeightMm: { min: 25, max: 30 },
    headroomMm: { min: 2, max: 4 },
    background: '#FFFFFF',
    minDpi: 300,
    sheets: ['10x15cm', '4x6in', 'a4'],
    // One page describes this variant, and the format is still being phased in. Nothing may be
    // published from it until a second independent page is found — which is exactly the point of
    // keeping the status on the row instead of in somebody's head.
    status: 'single-source',
    sources: [
      {
        url: 'https://39mm.ru/requirement.html',
        quote: 'Нового образца (фото для анкеты на загранпаспорт): Размер: 35х45 мм. Цветность: цветная Размер головы: 25-30 мм. в высоту Поле над головой: 3 мм, разрешена погрешность 1 мм.',
        retrievedAt: READ_AT,
      },
    ],
  },
];

export function findSpec(id: string): PhotoSpec {
  const found = PHOTO_SPECS.find((spec) => spec.id === id);
  if (!found) throw new Error(`no specification named ${id}`);
  return found;
}

/** The rows a live page may be built from. Drafts and disputes stay out of the site. */
export function publishableSpecs(): PhotoSpec[] {
  return PHOTO_SPECS.filter((spec) => spec.status === 'verified');
}
