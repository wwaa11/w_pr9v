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
}

interface Consent {
    hn: string;
    patient: Patient;
    answer1: number;
    answer2: number;
    answer3: number;
    answer4: number;
    answer5: number;
    answer6: number;
    answer7: number;
    answer8: number;
    answer9: number;
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
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '122px', left: '175px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '122px', left: '310px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '122px', left: '585px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        {consent.answer1 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '267px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer1 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '267px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer1 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '267px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer1 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '267px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer2 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '293px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer2 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '293px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer2 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '293px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer2 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '293px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer3 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '319px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer3 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '319px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer3 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '319px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer3 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '319px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer4 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '344px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer4 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '344px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer4 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '344px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer4 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '344px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer5 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '371px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer5 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '371px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer5 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '371px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer5 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '371px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer6 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '408px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer6 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '408px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer6 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '408px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer6 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '408px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer7 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '459px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer7 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '459px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer7 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '459px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer7 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '459px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer8 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '508px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer8 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '508px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer8 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '508px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer8 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '508px', left: '658px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer9 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '442px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer9 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '515px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer9 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '589px', fontSize: '21px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.answer9 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '548px', left: '658px', fontSize: '21px' }}>
                                &#10003;
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
                                file={url + "/consent/Mind9Q.pdf"}
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