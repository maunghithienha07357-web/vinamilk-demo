import { jsPDF } from "jspdf";
import {
  appendCanvasToPdf,
  captureElement,
  safePdfFileName,
} from "@/features/analytics/utils/analyticsPdfCapture";

/** Xuất PDF từ DOM đang hiển thị — khớp với nội dung trên màn hình. */
export async function exportElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureElement(element, {
    scrollY: -window.scrollY,
    windowHeight: element.scrollHeight,
    height: element.scrollHeight,
    width: element.scrollWidth,
  });
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  appendCanvasToPdf(pdf, canvas, false);
  pdf.save(safePdfFileName(filename));
}
