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
    age: number;
    gender: string;
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
    document_information: string;
    signature: string;
    informer_name: string;
    informer_sign: string;
    witness1_name: string;
    witness1_sign: string;
    witness2_name: string;
    witness2_sign: string;
}


export default function TelemedicineConsent() {
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
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '40px', left: '385px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '40px', left: '450px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '40px', left: '665px', fontSize: '10px' }}>
                            {consent.patient.gender}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '62px', left: '370px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '62px', left: '500px', fontSize: '10px' }}>
                            {consent.patient.age}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '62px', left: '620px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '62px', left: '720px', fontSize: '10px' }}>
                            {consent.vn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '83px', left: '389px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '83px', left: '500px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '83px', left: '655px', fontSize: '10px' }}>
                            {consent.doctor_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '106px', left: '385px', fontSize: '10px' }}>
                            {consent.patient.allergy_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '127px', left: '420px', fontSize: '10px' }}>
                            {consent.patient.blood_reaction}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '165px', left: '130px', fontSize: '10px' }}>
                            {consent.name}
                        </Typography>
                        {consent.name_type == 'patient' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '163px', left: '435px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.name_type == 'representative' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '163px', left: '492px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '189px', left: '95px', fontSize: '10px' }}>
                            {consent.name_relation}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '189px', left: '585px', fontSize: '10px' }}>
                            {consent.doctor_name}
                        </Typography>
                        <img src={consent.informer_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '590px', left: '90px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '646px', left: '110px', fontSize: '12px' }}>
                            {consent.informer_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '110px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '200px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.signature} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '590px', left: '280px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '646px', left: '290px', fontSize: '12px' }}>
                            {consent.name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '292px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '385px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.witness1_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '590px', left: '450px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '646px', left: '470px', fontSize: '12px' }}>
                            {consent.witness1_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '470px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '560px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.witness2_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '590px', left: '620px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '646px', left: '630px', fontSize: '12px' }}>
                            {consent.witness2_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '635px', fontSize: '9px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '676px', left: '720px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.name_type == 'representative' && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '780px', left: '170px', fontSize: '10px' }}>
                                    {consent.name}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '780px', left: '500px', fontSize: '10px' }}>
                                    {consent.name_relation}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '780px', left: '680px', fontSize: '10px' }}>
                                    {consent.name_phone}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '806px', left: '160px', fontSize: '10px' }}>
                                    {consent.name_address}
                                </Typography>
                            </>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>Telehealth PDF</title>
            </Head>
            <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', p: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ sm: 12, md: 10 }}>
                        <div className="print-content">
                            <Document
                                file={url + "/consent/Telehealth.pdf"}
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