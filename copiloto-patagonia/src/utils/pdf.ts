export interface PdfSection {
  heading: string;
  lines: string[];
}

export async function generateItineraryPdf(title: string, subtitle: string, sections: PdfSection[], warning: string) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  let y = 64;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 48) {
      doc.addPage();
      y = 64;
    }
  };

  doc.setFillColor(22, 119, 166);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Copiloto Patagonia by Glaciares Rent a Car', marginX, 26);

  doc.setTextColor(8, 59, 92);
  doc.setFontSize(20);
  doc.text(title, marginX, y);
  y += 22;

  doc.setFontSize(11);
  doc.setTextColor(57, 66, 78);
  const subtitleLines = doc.splitTextToSize(subtitle, maxWidth);
  doc.text(subtitleLines, marginX, y);
  y += subtitleLines.length * 14 + 12;

  sections.forEach((section) => {
    ensureSpace(24);
    doc.setFontSize(13);
    doc.setTextColor(22, 119, 166);
    doc.text(section.heading, marginX, y);
    y += 16;

    doc.setFontSize(10.5);
    doc.setTextColor(57, 66, 78);
    section.lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(`- ${line}`, maxWidth);
      ensureSpace(wrapped.length * 13 + 4);
      doc.text(wrapped, marginX, y);
      y += wrapped.length * 13 + 4;
    });
    y += 8;
  });

  ensureSpace(40);
  doc.setFillColor(247, 250, 252);
  doc.setDrawColor(242, 140, 40);
  const warningLines = doc.splitTextToSize(warning, maxWidth - 16);
  const boxHeight = warningLines.length * 12 + 16;
  doc.roundedRect(marginX, y, maxWidth, boxHeight, 4, 4, 'FD');
  doc.setFontSize(9.5);
  doc.setTextColor(39, 42, 46);
  doc.text(warningLines, marginX + 8, y + 14);

  doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
