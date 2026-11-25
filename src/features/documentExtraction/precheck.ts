import { ACCEPTED_MIME, IMAGE_MAX_SIDE, MAX_FILE_BYTES } from './constants';
import type { RejectReason } from './types';

export interface Rejection { reason: RejectReason; message: string }

const EXT_MIME: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' };

export function mimeOf(name: string, mime: string): string {
  if (mime && (ACCEPTED_MIME as readonly string[]).includes(mime)) return mime;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MIME[ext] ?? mime;
}

export function checkType(name: string, mime: string): Rejection | null {
  const m = mimeOf(name, mime);
  return (ACCEPTED_MIME as readonly string[]).includes(m) ? null
    : { reason: 'BAD_TYPE', message: 'We can read JPG, PNG, WEBP and PDF files. Upload one of those.' };
}

export function checkSize(size: number, max = MAX_FILE_BYTES): Rejection | null {
  return size <= max ? null : { reason: 'TOO_BIG', message: `This file is ${(size / 1048576).toFixed(1)} MB. The limit is ${Math.round(max / 1048576)} MB.` };
}

/** A password-protected PDF carries an /Encrypt entry in its trailer. */
export function isPasswordProtectedPdf(bytes: Uint8Array): boolean {
  let s = '';
  const step = 1 << 15;
  for (let i = 0; i < bytes.length; i += step) s += String.fromCharCode(...bytes.subarray(i, Math.min(i + step, bytes.length)));
  return /\/Encrypt\b/.test(s);
}
export const passwordRejection = (): Rejection => ({ reason: 'PASSWORD', message: 'This PDF is password protected. Upload an unlocked copy.' });

export async function sha256Hex(buf: ArrayBuffer | Uint8Array): Promise<string> {
  const view = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const digest = await crypto.subtle.digest('SHA-256', view as unknown as BufferSource);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function scaleToFit(w: number, h: number, maxSide = IMAGE_MAX_SIDE): { width: number; height: number; scaled: boolean } {
  const longest = Math.max(w, h);
  if (longest <= maxSide) return { width: w, height: h, scaled: false };
  const k = maxSide / longest;
  return { width: Math.round(w * k), height: Math.round(h * k), scaled: true };
}

/** Browser only. Returns the original file if it is small enough or cannot be decoded. */
export async function downscaleImage(file: Blob, mime: string, maxSide = IMAGE_MAX_SIDE): Promise<Blob> {
  if (!mime.startsWith('image/')) return file;
  try {
    const bmp = await createImageBitmap(file);
    const { width, height, scaled } = scaleToFit(bmp.width, bmp.height, maxSide);
    if (!scaled) { bmp.close?.(); return file; }
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, width, height);
    bmp.close?.();
    const out = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.9));
    return out ?? file;
  } catch { return file; }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  const step = 1 << 14;
  for (let i = 0; i < bytes.length; i += step) bin += String.fromCharCode(...bytes.subarray(i, i + step));
  return btoa(bin);
}
