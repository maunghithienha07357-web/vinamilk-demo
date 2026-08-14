import ExcelJS from "exceljs";

const HEADER_BG = "FF1E3A5F";
const HEADER_FG = "FFFFFFFF";
const TITLE_BG = "FFE8F0E4";
const BORDER_COLOR = "FFD1D5DB";
const ROW_ALT_BG = "FFF8FAFC";

function triggerDownload(buffer: ArrayBuffer, filename: string): void {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportSurveyExcel(input: {
  title: string;
  subtitle?: string;
  columns: Array<{ key: string; header: string }>;
  rows: Array<Record<string, string>>;
  fileBase: string;
}): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Survey";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Khảo sát", {
    views: [{ state: "frozen", ySplit: 4 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });

  const colCount = Math.max(input.columns.length, 1);
  sheet.columns = input.columns.map((c) => ({ key: c.key, width: 20 }));

  const titleRow = sheet.addRow([input.title]);
  sheet.mergeCells(1, 1, 1, colCount);
  titleRow.height = 28;
  titleRow.getCell(1).font = { bold: true, size: 14, name: "Calibri", color: { argb: "FF1F2937" } };
  titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
  titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: TITLE_BG } };

  if (input.subtitle) {
    const subtitleRow = sheet.addRow([input.subtitle]);
    sheet.mergeCells(2, 1, 2, colCount);
    subtitleRow.getCell(1).font = { size: 10, name: "Calibri", color: { argb: "FF4B5563" } };
    subtitleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
  }

  sheet.addRow([]);
  const headerRow = sheet.addRow(input.columns.map((c) => c.header));
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: HEADER_FG }, size: 11, name: "Calibri" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: BORDER_COLOR } },
      left: { style: "thin", color: { argb: BORDER_COLOR } },
      bottom: { style: "thin", color: { argb: BORDER_COLOR } },
      right: { style: "thin", color: { argb: BORDER_COLOR } },
    };
  });

  input.rows.forEach((row, idx) => {
    const dataRow = sheet.addRow(input.columns.map((c) => row[c.key] ?? ""));
    dataRow.height = 20;
    const alt = idx % 2 === 1;
    dataRow.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
      if (alt) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ROW_ALT_BG } };
      cell.border = {
        top: { style: "thin", color: { argb: BORDER_COLOR } },
        left: { style: "thin", color: { argb: BORDER_COLOR } },
        bottom: { style: "thin", color: { argb: BORDER_COLOR } },
        right: { style: "thin", color: { argb: BORDER_COLOR } },
      };
    });
  });

  sheet.autoFilter = {
    from: { row: sheet.rowCount - input.rows.length, column: 1 },
    to: { row: sheet.rowCount, column: colCount },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer as ArrayBuffer, `${input.fileBase}.xlsx`);
}
