import { LegalDocument } from "../modules/legalDocument/legalDocument.model";

const seedLegalDocs = async () => {
    const legalDocs = [
        {
            type: "PRIVACY_POLICY",
            title: "Privacy Policy",
            description: "Privacy Policy",
        },
        {
            type: "TERMS_AND_CONDITIONS",
            title: "Terms and Conditions",
            description: "Terms and Conditions",
        },
        {
            type: "ABOUT_US",
            title: "About Us",
            description: "About Us",
        },
        {
            type: "REFUND_POLICY",
            title: "Refund Policy",
            description: "Refund Policy",
        },
    ]

    for (const legalDoc of legalDocs) {
        const existingLegalDoc = await LegalDocument.findOne({ type: legalDoc.type });
        if (!existingLegalDoc) {
            await LegalDocument.create(legalDoc);
        }
    }
}

export default seedLegalDocs;