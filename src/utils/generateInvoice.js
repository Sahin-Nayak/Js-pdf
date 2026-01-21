import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import data from "../data/invoiceData.json";
import logo from "../assets/logo.png";

export default function generateInvoice() {
  const doc = new jsPDF("p", "mm", "a4");

  const LEFT = 5;
  const RIGHT = 205;
  let y = 10;

 // ================= LOGO =================
    const imgProps = doc.getImageProperties(logo);
    const logoWidth = 45;
    const logoHeight = (imgProps.height * logoWidth) / imgProps.width;

    doc.addImage(logo, "PNG", LEFT, y, logoWidth, logoHeight);


  y += 18;
  doc.setLineWidth(0.4);
  doc.line(LEFT, y, RIGHT, y);

  // ================= TITLE =================
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Tax Invoice", LEFT + 2, y);

  // ================= META =================
  y += 10;
  doc.setFontSize(9);

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Number:", LEFT + 2, y);
  doc.text("Order Number:", LEFT + 2, y + 5);
  doc.text("Nature of Transaction:", LEFT + 2, y + 10);
  doc.text("Place of Supply:", LEFT + 2, y + 15);

  doc.setFont("helvetica", "normal");
  doc.text(data.invoice.invoiceNumber, LEFT + 45, y);
  doc.text(data.invoice.orderNumber, LEFT + 45, y + 5);
  doc.text(data.invoice.natureOfTransaction, LEFT + 45, y + 10);
  doc.text(data.invoice.placeOfSupply, LEFT + 45, y + 15);

  doc.setFont("helvetica", "bold");
  doc.text("Order Place Date:", RIGHT - 60, y);
  doc.text("Order Shipped Date:", RIGHT - 60, y + 5);
  doc.text("Nature of Supply:", RIGHT - 60, y + 10);

  doc.setFont("helvetica", "normal");
  doc.text(data.invoice.orderPlacedDate, RIGHT - 5, y, { align: "right" });
  doc.text(data.invoice.orderShippedDate, RIGHT - 5, y + 5, { align: "right" });
  doc.text(data.invoice.natureOfSupply, RIGHT - 5, y + 10, { align: "right" });

  y += 22;
  doc.line(LEFT, y, RIGHT, y);

  // ================= BILL =================
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Bill to / Ship to:", LEFT + 2, y);
  doc.text("Service Provider", RIGHT - 85, y);

  doc.setFont("helvetica", "normal");
  doc.text(data.customer.address, LEFT + 2, y + 5);
    // NAME
    doc.setFont("helvetica", "bold");
    doc.text("Name:", LEFT + 2, y + 10);

    doc.setFont("helvetica", "normal");
    doc.text(data.customer.name, LEFT + 14, y + 10);

    // PHONE
    doc.setFont("helvetica", "bold");
    doc.text("Phone No:", LEFT + 2, y + 15);

    doc.setFont("helvetica", "normal");
    doc.text(data.customer.phone, LEFT + 20, y + 15);

    // EMAIL
    doc.setFont("helvetica", "bold");
    doc.text("Email:", LEFT + 2, y + 20);

    doc.setFont("helvetica", "normal");
    doc.text(data.customer.email, LEFT + 14, y + 20);


  doc.text(data.company.address, RIGHT - 85, y + 5, { maxWidth: 80 });
  doc.setFont("helvetica", "bold");
  doc.text("GSTIN Number:", RIGHT - 85, y + 20);
  doc.setFont("helvetica", "normal");
  doc.text(data.company.gstin, RIGHT - 60, y + 20);

  y += 30;
  doc.line(LEFT, y, RIGHT, y);

  // ================= TABLE =================
  autoTable(doc, {
    startY: y + 2,
    theme: "plain",
    margin: { left: LEFT, right: LEFT },
    styles: {
      fontSize: 7,
      lineWidth: 0.4,
      cellPadding: 2
    },
    headStyles: { fontStyle: "bold" },
    head: [[
      "Product Name",
      "Gross Amt.",
      "Discount",
      "Taxable Amt.",
      "CGST",
      "SGST",
      "Chargeable Amt.",
      "Qty",
      "Total Amount"
    ]],
    body: data.items.map(i => [
      `${i.name}\n${i.sku}`,
      `Rs. ${i.gross}`,
      `Rs. ${i.discount}`,
      `Rs. ${i.taxable}`,
      `Rs. ${i.cgst}`,
      `Rs. ${i.sgst}`,
      `Rs. ${i.total}`,
      i.qty,
      `Rs. ${i.total}`
    ]),
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "right" },
      8: { halign: "right" }
    }
  });

  y = doc.lastAutoTable.finalY + 3;
  doc.line(LEFT, y, RIGHT, y);

  // ================= SUMMARY =================
  y += 6;
  doc.setFontSize(9);

  const sx = RIGHT - 75;
  doc.text("Gross Amount:", sx, y);
  doc.text("Rs. 999.00", RIGHT - 5, y, { align: "right" });

  doc.text("Discount:", sx, y + 5);
  doc.text("-Rs. 500.00", RIGHT - 5, y + 5, { align: "right" });

  doc.text("Coupon Discount:", sx, y + 10);
  doc.text("-Rs. 0.00", RIGHT - 5, y + 10, { align: "right" });

  doc.text("Taxable Amount:", sx, y + 15);
  doc.text("Rs. 475.24", RIGHT - 5, y + 15, { align: "right" });

  doc.text("CGST(2.5%):", sx, y + 20);
  doc.text("Rs. 11.88", RIGHT - 5, y + 20, { align: "right" });

  doc.text("SGST(2.5%):", sx, y + 25);
  doc.text("Rs. 11.88", RIGHT - 5, y + 25, { align: "right" });

  // ================= TOTAL =================
  y += 32;
  doc.setLineWidth(0.5);
  doc.line(LEFT, y, RIGHT, y);

  doc.setFont("helvetica", "bold");
  doc.text(`In Words: ${data.amountInWords}`, LEFT + 2, y + 6);
  doc.text("Total Amount", sx, y + 6);
  doc.text("Rs. 499.00", RIGHT - 5, y + 6, { align: "right" });

  y += 9;
  doc.setLineWidth(0.5);
  doc.line(LEFT, y, RIGHT, y);
  // ================= FOOTER =================
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("KnightHunt Private Limited", LEFT + 2, y);
  doc.text("Signature", LEFT + 2, y + 5);
  doc.text("Mode Of Payment : Cash On Delivery", RIGHT - 5, y, { align: "right" });

  y += 8;
  doc.setLineWidth(0.4);
  doc.line(LEFT, y, RIGHT, y);

  y += 5;
  doc.setFontSize(8);
  doc.text(
    "Reg Address:\nKnightHunt Pvt. Ltd. #1403, 14th Floor, Tower 1, PS Srijan Corporate Park, Plot No G2, Block GP Sec - V, Salt Lake City, Kolkata-700091, West Bengal, India\nIf you have any questions, feel free to call customer care at +033 4804 7123 or use Contact Us section in our App, or log on to\nhttps://knighthunt.vercel.app.",
    LEFT + 2,
    y,
    { maxWidth: RIGHT - LEFT - 4 }
  );
  doc.save("Tax-Invoice.pdf");
}
