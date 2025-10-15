import { useState } from 'react';
import AppLayout from '@/layouts/admin-dashboard';
import { Head, usePage } from '@inertiajs/react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Patient {
    nameTH: string;
    surnameTH: string;
    nameEN: string;
    surnameEN: string;
    birthDate: string;
    gender: string;
    age: number;
    address: string;
    address_contact: string;
    phone: string;
    mobile: string;
    email: string;
    religion: string;
    race: string;
    national: string;
    martial: string;
    occupation: string;
    education: string;
    allergy: boolean;
    allergy_name: string;
    allergy_symptom: string;
    photo: boolean;
    represent: boolean;
    represent_name: string;
    represent_surname: string;
    represent_relation: string;
    represent_phone: string;
    blood_reaction: string;
}

interface Consent {
    patient: Patient;
    hn: string;
    vn: string;
    name: string;
    name_type: string;
    name_relation: string;
    name_phone: string;
    name_address: string;
    visit_date: string;
    visit_time: string;
    doctor_name: string;
    hiv_consent: string;
    hiv_name: string;
    signature: string;
    informer_name: string;
    informer_sign: string;
    witness1_name: string;
    witness1_sign: string;
    witness2_name: string;
    witness2_sign: string;
}


export default function HivConsent() {
    const pageProps = usePage();
    const consent = pageProps.props.consent as Consent;
    const url = pageProps.props.url as string;

    const [numPages, setNumPages] = useState<number | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handlePrint = () => {
        // Add print-specific styles
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                @page {
                    size: A4;
                    margin: 0;
                }
                body * {
                    visibility: hidden;
                }
                .print-content, .print-content * {
                    visibility: visible;
                }
                .print-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .no-print {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
    };

    // Function to render content for each page based on its number
    const renderPageContent = (page: number) => {
        switch (page) {
            case 1:
                return (
                    <>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '28px', left: '365px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '28px', left: '450px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '28px', left: '680px', fontSize: '10px' }}>
                            {consent.patient.gender}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '50px', left: '345px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '50px', left: '480px', fontSize: '10px' }}>
                            {consent.patient.age}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '50px', left: '580px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '50px', left: '710px', fontSize: '10px' }}>
                            {consent.vn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '73px', left: '340px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '73px', left: '480px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '73px', left: '625px', fontSize: '10px' }}>
                            {consent.doctor_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '95px', left: '360px', fontSize: '10px' }}>
                            {consent.patient.allergy_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '117px', left: '400px', fontSize: '10px' }}>
                            {consent.patient.blood_reaction}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '156px', left: '175px', fontSize: '10px' }}>
                            {consent.name}
                        </Typography>
                        {consent.name_type == 'patient' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '154px', left: '395px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.name_type == 'representative' && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '154px', left: '460px', fontSize: '12px' }}>
                                    &#10003;
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '154px', left: '615px', fontSize: '12px' }}>
                                    {consent.name_relation}
                                </Typography>
                            </>
                        )}
                        {consent.hiv_consent == 'self' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '406px', left: '127px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.hiv_consent == 'other' && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '431px', left: '127px', fontSize: '12px' }}>
                                    &#10003;
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '431px', left: '400px', fontSize: '12px' }}>
                                    {consent.hiv_name}
                                </Typography>
                            </>
                        )}
                        {consent.hiv_consent == 'none' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '456px', left: '127px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <img src={consent.informer_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '646px', left: '104px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '700px', left: '110px', fontSize: '12px' }}>
                            {consent.informer_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '115px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '215px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.signature} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '646px', left: '287px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '700px', left: '290px', fontSize: '12px' }}>
                            {consent.name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '289px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '387px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.witness1_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '646px', left: '457px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '700px', left: '470px', fontSize: '12px' }}>
                            {consent.witness1_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '468px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '563px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.witness2_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '646px', left: '626px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '700px', left: '635px', fontSize: '12px' }}>
                            {consent.witness2_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '635px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '726px', left: '730px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.name_type == 'representative' && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '873px', left: '175px', fontSize: '10px' }}>
                                    {consent.name}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '873px', left: '480px', fontSize: '10px' }}>
                                    {consent.name_relation}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '873px', left: '650px', fontSize: '10px' }}>
                                    {consent.name_phone}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '898px', left: '165px', fontSize: '10px' }}>
                                    {consent.name_address}
                                </Typography>
                            </>
                        )}
                    </>
                );
            case 2:
                return (
                    <>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '17px', left: '70px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '17px', left: '150px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '17px', left: '290px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '17px', left: '430px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '17px', left: '545px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '17px', left: '680px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>HIV PDF</title>
            </Head>
            <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', p: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ sm: 12, md: 10 }}>
                        <div className="print-content">
                            <Document
                                file={url + "/consent/HIV.pdf"}
                                onLoadSuccess={onDocumentLoadSuccess}
                                renderMode="canvas"
                            >
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Box key={`page_${index + 1}`} sx={{ position: 'relative' }}>
                                        <Page
                                            scale={1}
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                            width={794}
                                        />
                                        {renderPageContent(index + 1)}
                                    </Box>
                                ))}
                            </Document>
                        </div>
                    </Grid>
                    <Grid size={{ sm: 12, md: 2 }} className="no-print">
                        <Button variant="contained" color="primary" sx={{ width: '100%' }} onClick={handlePrint}>
                            Print PDF
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}