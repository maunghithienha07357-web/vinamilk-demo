import html2canvas from "html2canvas";
import type { jsPDF } from "jspdf";
import type { ReactNode } from "react";
import type { Root } from "react-dom/client";
import {
  prepareElementForCapture,
  withAnalyticsCaptureOptions,
} from "@/features/analytics/utils/prepareElementForCapture";

type Html2CanvasOptions = NonNullable<Parameters<typeof html2canvas>[1]>;

export async function captureElement(
  element: HTMLElement,
  options?: Html2CanvasOptions,
): Promise<HTMLCanvasElement> {
  const restore = prepareElementForCapture(element);

  try {
    return await html2canvas(element, withAnalyticsCaptureOptions(options));
  } finally {
    restore();
  }
}

/** ASCII-only — jsPDF default font không render tiếng Việt có dấu đúng */
const PDF_PAGE_FOOTER_PREFIX = "TNG Platform - Auto Report - Page";

export function stampPdfPageFooters(pdf: jsPDF): void {
  const total = pdf.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    pdf.setPage(page);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`${PDF_PAGE_FOOTER_PREFIX} ${page}/${total}`, pageWidth / 2, pageHeight - 4, {
      align: "center",
    });
  }
}

export function appendCanvasToPdf(pdf: jsPDF, canvas: HTMLCanvasElement, startNewPage: boolean): void {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidthMM = pdfWidth;
  const imgHeightMM = (canvas.height * imgWidthMM) / canvas.width;

  let offsetMM = 0;
  const eps = 0.5;
  let pageStarted = !startNewPage;

  while (offsetMM < imgHeightMM - eps) {
    if (!pageStarted) {
      pdf.addPage();
    }
    pageStarted = false;

    const sliceMM = Math.min(pdfHeight, imgHeightMM - offsetMM);
    const sourceYPx = (offsetMM / imgHeightMM) * canvas.height;
    const sourceHPx = (sliceMM / imgHeightMM) * canvas.height;

    const tmp = document.createElement("canvas");
    tmp.width = canvas.width;
    tmp.height = Math.max(1, Math.ceil(sourceHPx));
    const tctx = tmp.getContext("2d");
    if (!tctx) throw new Error("Không tạo được canvas 2D");
    tctx.drawImage(canvas, 0, sourceYPx, canvas.width, sourceHPx, 0, 0, canvas.width, sourceHPx);
    const sliceData = tmp.toDataURL("image/jpeg", 0.92);
    pdf.addImage(sliceData, "JPEG", 0, 0, imgWidthMM, sliceMM);
    offsetMM += sliceMM;
  }
}

export async function renderToHost(host: HTMLElement, root: Root, node: ReactNode): Promise<HTMLElement> {
  await new Promise<void>((resolve) => {
    root.render(node);
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await new Promise<void>((resolve) => setTimeout(resolve, 400));
  const el = host.firstElementChild as HTMLElement | null;
  if (!el) throw new Error("Không tạo được nội dung báo cáo PDF");
  return el;
}

const ILLEGAL_DOWNLOAD_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1f]/g;

/** Giữ tiếng Việt — chỉ loại ký tự không hợp lệ trên tên file. */
export function safePdfFileName(base: string): string {
  const trimmed = base.trim().replace(ILLEGAL_DOWNLOAD_FILENAME_CHARS, "_").replace(/\s+/g, " ");
  if (/\.pdf$/i.test(trimmed)) return trimmed.slice(0, 200);
  if (/\.png$/i.test(trimmed)) return trimmed.slice(0, 200);
  return `${trimmed.slice(0, 180)}.pdf`;
}

export function downloadJsPdf(pdf: jsPDF, filename: string): void {
  const name = safePdfFileName(filename);
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
