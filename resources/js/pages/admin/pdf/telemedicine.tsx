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
    video_consent: boolean;
    informer_name: string;
    informer_sign: string;
    witness_name: string;
    witness_sign: string;
    signature: string;
    signature_type: string;
    signature_name: string;
    signature_relation: string;
    translate_lang: string;
    translate_name: string;
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
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '120px', left: '266px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '120px', left: '500px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '141px', left: '289px', fontSize: '10px' }}>
                            {consent.patient.nameEN}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '141px', left: '500px', fontSize: '10px' }}>
                            {consent.patient.surnameEN}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '164px', left: '144px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '163px', left: '260px', fontSize: '10px' }}>
                            {consent.patient.age}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '163px', left: '353px', fontSize: '10px' }}>
                            {consent.patient.race}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '163px', left: '478px', fontSize: '10px' }}>
                            {consent.patient.national}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '163px', left: '630px', fontSize: '10px' }}>
                            {consent.patient.religion}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '187px', left: '127px', fontSize: '10px' }}>
                            {consent.patient.martial}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '187px', left: '270px', fontSize: '10px' }}>
                            {consent.patient.occupation}
                        </Typography>
                        {consent.patient.education_code == '004' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '185px', left: '436px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education_code == '005' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '185px', left: '534px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education_code == '006' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '185px', left: '602px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.education_code == '007' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '185px', left: '602px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '209px', left: '175px', fontSize: '10px' }}>
                            {consent.patient.address}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '230px', left: '140px', fontSize: '10px' }}>
                            {consent.patient.phone}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '230px', left: '370px', fontSize: '10px' }}>
                            {consent.patient.mobile}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '230px', left: '576px', fontSize: '10px' }}>
                            {consent.patient.email}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '253px', left: '180px', fontSize: '10px' }}>
                            {consent.patient.address_contact}
                        </Typography>
                        {!consent.patient.allergy && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '272px', left: '189px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.allergy && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '272px', left: '274px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '274px', left: '408px', fontSize: '10px' }}>
                            {consent.patient.allergy_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '274px', left: '588px', fontSize: '10px' }}>
                            {consent.patient.allergy_symptom}
                        </Typography>
                        {consent.patient.photo && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '295px', left: '398px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.patient.photo && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '295px', left: '462px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.patient.represent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '340px', left: '79px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient.represent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '340px', left: '117px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '342px', left: '160px', fontSize: '10px' }}>
                            {consent.patient.represent_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '342px', left: '289px', fontSize: '10px' }}>
                            {consent.patient.represent_surname}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '342px', left: '510px', fontSize: '10px' }}>
                            {consent.patient.represent_relation}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '342px', left: '650px', fontSize: '10px' }}>
                            {consent.patient.represent_phone}
                        </Typography>
                    </>
                );
            case 2:
                return (
                    <>
                        {/* Data for Page 2 */}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '79px', fontSize: '10px' }}>
                            {consent.patient.nameTH} {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '15px', left: '299px', fontSize: '8px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '390px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '15px', left: '531px', fontSize: '8px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '630px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                    </>
                );
            case 3:
                return (
                    <>
                        {/* Data for Page 3 */}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '79px', fontSize: '10px' }}>
                            {consent.patient.nameTH} {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '16px', left: '304px', fontSize: '8px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '390px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '16px', left: '536px', fontSize: '8px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '635px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.treatment_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '810px', left: '386px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.treatment_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '810px', left: '498px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                    </>
                );
            case 4:
                return (
                    <>
                        {/* Data for Page 4 */}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '83px', fontSize: '10px' }}>
                            {consent.patient.nameTH} {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '16px', left: '297px', fontSize: '8px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '390px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '16px', left: '532px', fontSize: '8px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '14px', left: '627px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.insurance_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '215px', left: '266px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.insurance_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '215px', left: '372px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.marketing_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '406px', left: '228px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.marketing_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '406px', left: '332px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.video_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '512px', left: '232px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.video_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '512px', left: '344px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.telemedicine_consent && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '656px', left: '190px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {!consent.telemedicine_consent && (
                            <Typography sx={{ color: 'red', position: 'absolute', top: '656px', left: '270px', fontSize: '12px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <img src={consent.informer_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '704px', left: '103px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '755px', left: '107px', fontSize: '12px' }}>
                            {consent.informer_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '782px', left: '100px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '782px', left: '224px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.signature} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '704px', left: '307px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '755px', left: '324px', fontSize: '12px' }}>
                            {consent.signature_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '782px', left: '314px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '782px', left: '433px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <img src={consent.witness_sign} alt="signature" style={{ aspectRatio: 0, height: '55px', position: 'absolute', top: '704px', left: '524px' }} />
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '755px', left: '530px', fontSize: '12px' }}>
                            {consent.witness_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '782px', left: '517px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '782px', left: '650px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        {consent.translate_lang !== null && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '847px', left: '183px', fontSize: '10px' }}>
                                    {consent.translate_lang}
                                </Typography>\
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '847px', left: '379px', fontSize: '10px' }}>
                                    {consent.translate_name}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '847px', left: '571px', fontSize: '10px' }}>
                                    {consent.visit_date}
                                </Typography>
                            </>
                        )}
                        {consent.signature_type !== 'patient' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '909px', left: '90px', fontSize: '10px' }}>
                                {consent.signature_name}
                            </Typography>
                        )}
                    </>
                );
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
                                file={url + "/consent/Telemedicine-new-2.pdf"}
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