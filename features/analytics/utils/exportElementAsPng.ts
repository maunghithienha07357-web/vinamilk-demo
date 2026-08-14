import html2canvas from "html2canvas";
import {
  prepareElementForCapture,
  withAnalyticsCaptureOptions,
} from "@/features/analytics/utils/prepareElementForCapture";

export async function exportElementAsPng(element: HTMLElement, filename: string): Promise<void> {
  const restore = prepareElementForCapture(element);

  try {
    const canvas = await html2canvas(
      element,
      withAnalyticsCaptureOptions({
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollY: -window.scrollY,
        windowHeight: element.scrollHeight,
        height: element.scrollHeight,
        width: element.scrollWidth,
      }),
    );

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    restore();
  }
}
