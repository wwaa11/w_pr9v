import { useState } from 'react';
import AppLayout from '@/layouts/admin-dashboard';
import { usePage } from '@inertiajs/react';
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
    address: string;
    mobile: string;
    email: string;
    religion: string;
    race: string;
    national: string;
    martial: string;
    occupation: string;
    education: string;
    allergy: string;
    allergy_name: string;
    allergy_symptom: string;
    represent: string;
    represent_name: string;
    represent_relation: string;
    represent_phone: string;
}

interface Consent {
    hn: string;
    patient: Patient;
    created_at: string;
    status: string;
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
        // These positions are highly sensitive to PDF rendering and zoom level.
        // You'll need to meticulously adjust them for each page and potentially for different screen sizes.
        // The values are relative to the *top-left corner of the rendered page*.
        // It's often better to make positions percentage-based if the PDF viewer supports scaling,
        // or calculate them dynamically based on the page's rendered size.
        switch (page) {
            case 1:
                return (
                    <>
                        <Typography sx={{ position: 'absolute', top: '103px', left: '250px', fontSize: '12px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'red', position: 'absolute', top: '105px', left: '520px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '136px', left: '120px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '136px', left: '280px', fontSize: '10px' }}>
                            {consent.patient.age}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '136px', left: '350px', fontSize: '10px' }}>
                            {consent.patient.race}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '136px', left: '460px', fontSize: '10px' }}>
                            {consent.patient.national}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '136px', left: '560px', fontSize: '10px' }}>
                            {consent.patient.religion}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '162px', left: '120px', fontSize: '10px' }}>
                            {consent.patient.martial}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '162px', left: '350px', fontSize: '10px' }}>
                            {consent.patient.occupation}
                        </Typography>
                        {consent.patient.education === 'ต่ำกว่าปริญญาตรี' && (
                            <Typography sx={{ position: 'absolute', top: '188px', left: '110px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education === 'ปริญญาตรี' && (
                            <Typography sx={{ position: 'absolute', top: '188px', left: '230px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education === 'ตั้งแต่ปริญญาโทขึ้นไป' && (
                            <Typography sx={{ position: 'absolute', top: '188px', left: '335px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ position: 'absolute', top: '215px', left: '180px', fontSize: '10px' }}>
                            {consent.patient.address}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '241px', left: '180px', fontSize: '10px' }}>
                            {consent.patient.mobile}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '267px', left: '180px', fontSize: '10px' }}>
                            {consent.patient.email}
                        </Typography>
                        {consent.patient.allergy === 'ปฏิเสธการแพ้' && (
                            <Typography sx={{ position: 'absolute', top: '293px', left: '205px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.allergy === 'แพ้' && (
                            <Typography sx={{ position: 'absolute', top: '293px', left: '245px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ position: 'absolute', top: '293px', left: '320px', fontSize: '10px' }}>
                            {consent.patient.allergy_name}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '320px', left: '120px', fontSize: '10px' }}>
                            {consent.patient.allergy_symptom}
                        </Typography>
                        {consent.patient.represent === 'ไม่มี' && (
                            <Typography sx={{ position: 'absolute', top: '372px', left: '205px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.represent === 'มี' && (
                            <Typography sx={{ position: 'absolute', top: '372px', left: '245px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ position: 'absolute', top: '372px', left: '300px', fontSize: '10px' }}>
                            {consent.patient.represent_name}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '398px', left: '120px', fontSize: '10px' }}>
                            {consent.patient.represent_relation}
                        </Typography>
                        <Typography sx={{ position: 'absolute', top: '398px', left: '400px', fontSize: '10px' }}>
                            {consent.patient.represent_phone}
                        </Typography>
                    </>
                );
            case 2:
                return (
                    <>
                        {/* Data for Page 2 */}

                    </>
                );
            case 4:
                return (
                    <>
                        {/* Data for Page 4 */}

                    </>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', p: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ sm: 12, md: 10 }}>
                        <div className="print-content">
                            <Document
                                file={url + "/consent/Telemedicine.pdf"}
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