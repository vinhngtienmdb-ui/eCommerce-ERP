import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });
  
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  return pdf.output("blob");
};

export const downloadPDF = async (elementId: string, filename: string) => {
  const blob = await generatePDF(elementId, filename);
  if (blob) {
    saveAs(blob, `${filename}.pdf`);
  }
};

export const generateWord = async (title: string, content: string, filename: string) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};

export const downloadWord = async (title: string, content: string, filename: string) => {
  const blob = await generateWord(title, content, filename);
  saveAs(blob, `${filename}.docx`);
};
