import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
} from "@react-pdf/renderer";
import { FaDownload } from "react-icons/fa6";
import { convertToWords } from "../../services/company/wallet/numToWords";

interface InvoiceProps {
    billTo: { name: string; address: string };
    invoiceNumber: string;
    date: string;
    gstNumber?: string;
    ourGstNumber?: string;
    placeOfSupply: string;
    description: string;
    sacCode: string;
    amount: number;
    discount: number;
    taxRate: number;
}

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica' },
    section: { marginBottom: 15 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        textTransform: 'uppercase'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: '#444'
    },
    address: {
        fontSize: 10,
        textAlign: "center",
        marginBottom: 15,
        color: '#666'
    },
    text: {
        fontSize: 10,
        color: '#333'
    },
    textLeft: { fontSize: 10, textAlign: "left" },
    textRight: { fontSize: 10, textAlign: "right" },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },
    table: {
        marginTop: 15,
        marginBottom: 15,
        borderTop: "1 solid #888"
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1 solid #888",
        padding: 8,
        minHeight: 30,
        alignItems: 'center'
    },
    tableRownoborder: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
        minHeight: 25,
        alignItems: 'center'
    },
    tableHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#444'
    },
    totalsSection: {
        marginTop: 20
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
        fontWeight: 'bold'
    },
    footer: {
        marginTop: 30,
        borderTop: "1 solid #888",
        paddingTop: 15
    }
});

const InvoicePDF: React.FC<InvoiceProps> = ({ billTo, invoiceNumber, date, ourGstNumber, gstNumber, placeOfSupply, description, sacCode, amount, discount, taxRate }) => {
    const taxableValue = (amount / 1.18);
    const taxAmount = amount - (amount / 1.18);
    const total = +amount;

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>Tax Invoice</Text>
                <Text style={styles.subtitle}>INDSLAV JOOG PRIVATE LIMITED</Text>
                <Text style={styles.address}>D 73 OAKWOOD ESTATE, DLF PHASE 2, DLF QE, Gurgaon, Haryana, India, 122002</Text>
                {ourGstNumber && <Text style={[styles.text, { textAlign: 'center' }]}>GSTIN: {ourGstNumber}</Text>}

                <View style={styles.table}>
                    <View style={styles.tableRownoborder}>
                        <Text style={styles.tableHeader}>Bill to</Text>
                        <Text style={styles.tableHeader}>Place of Supply</Text>
                        <Text style={styles.tableHeader}>INVOICE No</Text>
                        <Text style={styles.tableHeader}>Dated</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View>
                            <Text style={styles.text}>{billTo.name}</Text>
                            <Text style={styles.text}>{billTo.address}</Text>
                            {gstNumber && <Text style={styles.text}>GSTIN: {gstNumber}</Text>}
                        </View>
                        <Text style={styles.text}>{placeOfSupply}</Text>
                        <Text style={styles.text}>{invoiceNumber}</Text>
                        <Text style={styles.text}>{date}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Description of Services</Text>
                        <Text style={styles.tableHeader}>SAC CODE</Text>
                        <Text style={styles.tableHeader}>Amount</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.text}>{description}</Text>
                        <Text style={[styles.text, { textAlign: 'center' }]}>{sacCode}</Text>
                        <Text style={styles.text}>{amount}</Text>
                    </View>
                </View>

                <View style={styles.totalsSection}>
                    <View style={styles.tableRownoborder}>
                        <Text style={styles.text}>Discount:</Text>
                        <Text style={styles.text}>{discount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.tableRownoborder}>
                        <Text style={styles.text}>Taxable Value:</Text>
                        <Text style={styles.text}>{taxableValue.toFixed(2)}</Text>
                    </View>
                    <View style={styles.tableRownoborder}>
                        <Text style={styles.text}>ADD IGST {taxRate}%:</Text>
                        <Text style={styles.text}>{taxAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.tableHeader}>Total:</Text>
                        <Text style={styles.tableHeader}>{total.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.textLeft}>Amount Chargeable (in words):</Text>
                            <Text style={[styles.textLeft, { fontWeight: 'bold' }]}>Rupees {convertToWords(Math.round(total))} Only</Text>
                            <Text style={styles.textLeft}>Company's PAN: AAKFD6723D</Text>
                        </View>
                        <View style={styles.textRight}>
                            <Text style={styles.textRight}>For INDSLAV JOOG PRIVATE LIMITED</Text>
                            <Text style={[styles.textRight, { marginTop: 20, fontWeight: 'bold' }]}>Authorised Signatory</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const InvoiceDownload: React.FC<InvoiceProps> = (props) => {
    return (
        <PDFDownloadLink document={<InvoicePDF {...props} />} fileName={`invoice-${props.invoiceNumber}.pdf`}>
            {({ loading }) => (loading ? "Generating PDF..." : <FaDownload />)}
        </PDFDownloadLink>
    );
};

export default InvoiceDownload;

