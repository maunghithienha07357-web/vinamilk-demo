import type html2canvas from "html2canvas";

type Html2CanvasOptions = NonNullable<Parameters<typeof html2canvas>[1]>;

type StylePatch = Partial<
  Pick<
    CSSStyleDeclaration,
    "maxHeight" | "overflow" | "height" | "transform" | "zoom" | "minHeight"
  >
>;

type Snapshot = { el: HTMLElement; prev: StylePatch };

function readInlinePatch(el: HTMLElement, patch: StylePatch): StylePatch {
  const prev: StylePatch = {};
  for (const key of Object.keys(patch) as (keyof StylePatch)[]) {
    prev[key] = el.style[key] ?? "";
  }
  return prev;
}

function applyPatch(el: HTMLElement, patch: StylePatch): void {
  for (const key of Object.keys(patch) as (keyof StylePatch)[]) {
    const value = patch[key];
    if (value != null) {
      el.style[key] = value;
    }
  }
}

/** Gắn stroke màu cố định cho Lucide SVG khi html2canvas clone (currentColor hay bị đen). */
export function fixPersonalReportIconsInClone(doc: Document): void {
  doc.querySelectorAll<HTMLElement>("[data-icon-color]").forEach((container) => {
    const color = container.getAttribute("data-icon-color");
    if (!color) return;

    container.querySelectorAll<SVGElement>("svg, svg *").forEach((node) => {
      node.setAttribute("stroke", color);
      node.style.stroke = color;
      if (node.tagName.toLowerCase() === "svg") {
        node.style.color = color;
      }
    });
  });
}

/** Chuẩn hóa progress row trong bản clone html2canvas — tránh bar đè chữ khi export ảnh. */
export function fixAnalyticsReportChartsInClone(doc: Document): void {
  doc
    .querySelectorAll<HTMLElement>(
      "[data-report-chart], [data-personal-report-print], .recharts-wrapper, .recharts-surface, .chart-card-body",
    )
    .forEach((el) => {
      el.style.overflow = "visible";
      el.style.maxHeight = "none";
    });
}

export function fixAnalyticsProgressRowsInClone(doc: Document): void {
  doc.querySelectorAll<HTMLElement>("[data-analytics-progress-row]").forEach((el) => {
    el.style.minHeight = "40px";
    el.style.overflow = "visible";
  });

  doc.querySelectorAll<HTMLElement>("[data-analytics-progress-label]").forEach((el) => {
    el.style.position = "relative";
    el.style.zIndex = "2";
    el.style.overflow = "visible";
    el.style.backgroundColor = "#ffffff";
  });

  doc.querySelectorAll<HTMLElement>("[data-analytics-progress-track]").forEach((el) => {
    el.style.position = "relative";
    el.style.zIndex = "0";
    el.style.overflow = "visible";
  });
}

/**
 * Tạm bỏ scale/transform/overflow gây cắt chữ khi html2canvas chụp dashboard analytics.
 * Trả về hàm restore để gọi trong finally.
 */
export function prepareElementForCapture(root: HTMLElement): () => void {
  const snapshots: Snapshot[] = [];

  const visit = (el: HTMLElement) => {
    const computed = window.getComputedStyle(el);
    const patch: StylePatch = {};

    if (el === root) {
      patch.maxHeight = "none";
      patch.overflow = "visible";
      patch.height = "auto";
    }

    if (computed.transform && computed.transform !== "none") {
      patch.transform = "none";
    }

    const zoom = computed.zoom;
    if (zoom && zoom !== "1" && zoom !== "normal") {
      patch.zoom = "1";
    }

    if (
      el.hasAttribute("data-analytics-progress-row") ||
      el.hasAttribute("data-analytics-progress-label") ||
      el.hasAttribute("data-analytics-progress-track") ||
      el.hasAttribute("data-report-chart") ||
      el.hasAttribute("data-personal-report-print") ||
      el.classList.contains("recharts-wrapper") ||
      el.classList.contains("recharts-surface") ||
      el.classList.contains("chart-card-body")
    ) {
      patch.overflow = "visible";
      patch.maxHeight = "none";
      if (el.hasAttribute("data-analytics-progress-row")) {
        patch.minHeight = "40px";
      }
    }

    if (Object.keys(patch).length > 0) {
      snapshots.push({ el, prev: readInlinePatch(el, patch) });
      applyPatch(el, patch);
    }
  };

  visit(root);
  root.querySelectorAll<HTMLElement>("*").forEach(visit);

  return () => {
    for (const { el, prev } of snapshots) {
      applyPatch(el, prev);
    }
  };
}

export function withAnalyticsCaptureOptions(
  options: Html2CanvasOptions = {},
): Html2CanvasOptions {
  const userOnclone = options.onclone;
  return {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    ...options,
    onclone: (clonedDoc, element) => {
      fixAnalyticsProgressRowsInClone(clonedDoc);
      fixAnalyticsReportChartsInClone(clonedDoc);
      fixPersonalReportIconsInClone(clonedDoc);
      userOnclone?.(clonedDoc, element);
    },
  };
}
