import { useState } from 'react';
import AppLayout from '@/layouts/admin-dashboard';
import { Head, usePage } from '@inertiajs/react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
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
    education_code: string;
    allergy: boolean;
    allergy_name: string;
    allergy_symptom: string;
    photo: boolean;
    represent: boolean;
    represent_name: string;
    represent_surname: string;
    represent_relation: string;
    represent_phone: string;
}

interface Consent {
    hn: string;
    patient: Patient;
    visit_date: string;
    visit_time: string;
    telemedicine_consent: boolean;
    treatment_consent: boolean;
    insurance_consent: boolean;
    marketing_consent: boolean;
    informer_name: string;
    informer_sign: string;
    witness_name: string;
    witness_sign: string;
    signature: string;
    signature_type: string;
    signature_name: string;
    signature_relation: string;
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
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '105px', left: '250px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '105px', left: '520px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '126px', left: '285px', fontSize: '10px' }}>
                            {consent.patient.nameEN}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '126px', left: '520px', fontSize: '10px' }}>
                            {consent.patient.surnameEN}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '148px', left: '142px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '148px', left: '280px', fontSize: '10px' }}>
                            {consent.patient.age}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '148px', left: '385px', fontSize: '10px' }}>
                            {consent.patient.race}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '148px', left: '495px', fontSize: '10px' }}>
                            {consent.patient.national}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '148px', left: '650px', fontSize: '10px' }}>
                            {consent.patient.religion}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '170px', left: '123px', fontSize: '10px' }}>
                            {consent.patient.martial}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '170px', left: '270px', fontSize: '10px' }}>
                            {consent.patient.occupation}
                        </Typography>
                        {consent.patient.education_code == '004' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '170px', left: '483px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education_code == '005' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '170px', left: '581px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education_code == '006' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '170px', left: '650px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education_code == '007' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '170px', left: '650px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '192px', left: '175px', fontSize: '10px' }}>
                            {consent.patient.address}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '215px', left: '140px', fontSize: '10px' }}>
                            {consent.patient.phone}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '215px', left: '380px', fontSize: '10px' }}>
                            {consent.patient.mobile}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '215px', left: '590px', fontSize: '10px' }}>
                            {consent.patient.email}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '237px', left: '180px', fontSize: '10px' }}>
                            {consent.patient.address_contact}
                        </Typography>
                        {!consent.patient.allergy && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '258px', left: '186px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.allergy && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '258px', left: '273px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '258px', left: '410px', fontSize: '10px' }}>
                            {consent.patient.allergy_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '258px', left: '580px', fontSize: '10px' }}>
                            {consent.patient.allergy_symptom}
                        </Typography>
                        {consent.patient.photo && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '280px', left: '380px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.patient.photo && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '280px', left: '444px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.patient.represent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '324px', left: '77px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.represent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '324px', left: '115px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '325px', left: '160px', fontSize: '10px' }}>
                            {consent.patient.represent_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '325px', left: '298px', fontSize: '10px' }}>
                            {consent.patient.represent_surname}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '325px', left: '510px', fontSize: '10px' }}>
                            {consent.patient.represent_relation}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '325px', left: '650px', fontSize: '10px' }}>
                            {consent.patient.represent_phone}
                        </Typography>
                    </>
                );
            case 2:
                return (
                    <>
                        {/* Data for Page 2 */}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '26px', left: '65px', fontSize: '10px' }}>
                            {consent.patient.nameTH} {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '27px', left: '278px', fontSize: '8px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '26px', left: '390px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '27px', left: '517px', fontSize: '8px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '26px', left: '620px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                    </>
                );
            case 3:
                return (
                    <>
                        {/* Data for Page 3 */}
                        {consent.treatment_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '571px', left: '450px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.treatment_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '571px', left: '556px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                    </>
                );
            case 4:
                return (
                    <>
                        {/* Data for Page 4 */}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '26px', left: '65px', fontSize: '10px' }}>
                            {consent.patient.nameTH} {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '27px', left: '278px', fontSize: '8px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '26px', left: '390px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '27px', left: '517px', fontSize: '8px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '26px', left: '620px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.insurance_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '99px', left: '287px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.insurance_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '99px', left: '398px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.marketing_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '288px', left: '256px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.marketing_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '288px', left: '374px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.telemedicine_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '450px', left: '126px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.telemedicine_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '450px', left: '229px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <img src={consent.informer_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '498px', left: '105px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '120px', fontSize: '12px' }}>
                            {consent.informer_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '573px', left: '120px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '573px', left: '225px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.signature} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '498px', left: '315px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '330px', fontSize: '12px' }}>
                            {consent.signature_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '573px', left: '333px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '573px', left: '433px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.witness_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '498px', left: '528px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '540px', fontSize: '12px' }}>
                            {consent.witness_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '573px', left: '550px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '573px', left: '650px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.signature_type !== 'patient' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '630px', left: '600px', fontSize: '10px' }}>
                                {consent.signature_name}
                            </Typography>
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
                <title>Telemedicine PDF</title>
            </Head>
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
                        {consent.signature_type == 'representative' && (
                            <>
                                <Card sx={{ p: 2, mb: 2 }}>
                                    <Typography variant='h6' sx={{ mb: 2 }}>
                                        ความสัมพันธ์กับผู้ป่วย
                                    </Typography>
                                    <Typography color="primary" sx={{ width: '100%' }}>
                                        {consent.signature_relation}
                                    </Typography>
                                </Card>
                            </>
                        )}
                        <Button variant="contained" color="primary" sx={{ width: '100%' }} onClick={handlePrint}>
                            Print PDF
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}