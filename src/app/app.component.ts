import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product {
  name: string;
  price: number;
  qty: number;
}
class Invoice {
  customerName: string;
  address: string;
  contactNo: string;
  email: string;

  products: Product[] = [];
  additionalDetails: string;

  // constructor() {
  //   // Initially one empty product row we will show
  //   this.products.push(new Product());
  // }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PDF-Make Demo';
  invoice: Invoice;
  products: Product[] = [];

  constructor(private datePipe: DatePipe) {}
  generatePdf() {
    this.products = [
      { name: 'Product-001', price: 10.5, qty: 10 },
      { name: 'Product-002', price: 20.5, qty: 20 },
      { name: 'Product-003', price: 30.5, qty: 30 },
    ];

    this.invoice = {
      customerName: 'Ahmer Najam',
      contactNo: '+92-30400008757',
      email: 'ahmer.najam@gmail.com',
      address: 'Main Road Karachi',
      products: this.products,
      additionalDetails: 'All items are non-refundable',
    };

    let docDefinition = {
      content: [
        {
          text: 'GOHAR RESIDENCY',
          fontSize: 16,
          color: '#047886',
          alignment: 'center',
        },
        {
          text: 'INVOICE',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue',
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold: true,
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo },
            ],
            [
              {
                text: `Date: ${this.datePipe.transform(
                  new Date(),
                  'dd-MMM-yyyy'
                )}`,
                alignment: 'right',
              },
              {
                text: `Bill No : ${(Math.random() * 1000).toFixed(0)}`,
                alignment: 'right',
              },
            ],
          ],
        },

        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoice.products.map((p) => [
                p.name,
                p.price,
                p.qty,
                (p.price * p.qty).toFixed(2),
              ]),
              [
                { text: 'Total Amount', colSpan: 3 },
                {},
                {},
                this.invoice.products
                  .reduce((sum, p) => sum + p.qty * p.price, 0)
                  .toFixed(2),
              ],
            ],
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
        normalText: {
          fontSize: 11,
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
