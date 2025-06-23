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
    visit_date: string;
    visit_time: string;
    doctor_name: string;
    patient_type: string;
    name: string;
    relative_relation: string;
    weight: string;
    height: string;
    bmi: string;
    neck_size: string;
    disease: boolean;
    disease_text: string;
    medicine: boolean;
    medicine_text: string;
    sleep_pill: boolean;
    sleep_pill_text: string;
    tobacco: boolean;
    alcohol: boolean;
    caffeine: boolean;
    informer_name: string;
    informer_position: string;
    sleep_problem_1: string;
    sleep_problem_2: string;
    sleep_problem_3: string;
    sleep_problem_4: string;
    sleep_problem_5: string;
    sleep_problem_6: string;
    sleep_problem_7: string;
    sleep_problem_8: string;
    sleep_problem_9: string;
    sleep_problem_10: string;
    sleep_problem_11: string;
    sleep_problem_12: string;
    sleep_problem_13: string;
    sleep_problem_14: string;
    sleep_situation_1: number;
    sleep_situation_2: number;
    sleep_situation_3: number;
    sleep_situation_4: number;
    sleep_situation_5: number;
    sleep_situation_6: number;
    sleep_situation_7: number;
    sleep_situation_8: number;
    weekday_sleep: string;
    weekday_awake: string;
    weekday_turnoff_light: string;
    weekday_night_awake: string;
    weekday_night_awake_until_sleep: string;
    weekday_alarm: string;
    weekend_sleep: string;
    weekend_awake: string;
    weekend_turnoff_light: string;
    weekend_night_awake: string;
    weekend_night_awake_until_sleep: string;
    weekend_alarm: string;
    total_situation: number;
}


export default function SleepnessConsent() {
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
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '42px', left: '365px', fontSize: '10px' }}>
                            {consent.patient.nameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '42px', left: '480px', fontSize: '10px' }}>
                            {consent.patient.surnameTH}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '42px', left: '690px', fontSize: '10px' }}>
                            {consent.patient.gender}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '68px', left: '345px', fontSize: '10px' }}>
                            {consent.patient.birthDate}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '68px', left: '490px', fontSize: '10px' }}>
                            {consent.patient.age}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '68px', left: '595px', fontSize: '10px' }}>
                            {consent.hn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '68px', left: '710px', fontSize: '10px' }}>
                            {consent.vn}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '93px', left: '343px', fontSize: '10px' }}>
                            {consent.visit_date}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '93px', left: '475px', fontSize: '10px' }}>
                            {consent.visit_time}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '93px', left: '610px', fontSize: '10px' }}>
                            {consent.doctor_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '118px', left: '365px', fontSize: '10px' }}>
                            {consent.patient.allergy_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '143px', left: '400px', fontSize: '10px' }}>
                            {consent.patient.blood_reaction}
                        </Typography>
                        {consent.patient_type == 'patient' && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '186px', left: '158px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.patient_type == 'relative' && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '186px', left: '218px', fontSize: '10px' }}>
                                    &#10003;
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '186px', left: '320px', fontSize: '10px' }}>
                                    {consent.name}
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '186px', left: '653px', fontSize: '10px' }}>
                                    {consent.relative_relation}
                                </Typography>
                            </>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '213px', left: '160px', fontSize: '10px' }}>
                            {consent.weight}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '213px', left: '325px', fontSize: '10px' }}>
                            {consent.height}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '213px', left: '480px', fontSize: '10px' }}>
                            {consent.bmi}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '213px', left: '680px', fontSize: '10px' }}>
                            {consent.neck_size}
                        </Typography>
                        {consent.disease == false && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '238px', left: '167px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.disease == true && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '238px', left: '220px', fontSize: '10px' }}>
                                    &#10003;
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '238px', left: '290px', fontSize: '10px' }}>
                                    {consent.disease_text}
                                </Typography>
                            </>
                        )}
                        {consent.medicine == false && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '264px', left: '169px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.medicine == true && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '264px', left: '222px', fontSize: '10px' }}>
                                    &#10003;
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '264px', left: '290px', fontSize: '10px' }}>
                                    {consent.medicine_text}
                                </Typography>
                            </>
                        )}
                        {consent.sleep_pill == false && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '290px', left: '170px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_pill == true && (
                            <>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '290px', left: '223px', fontSize: '10px' }}>
                                    &#10003;
                                </Typography>
                                <Typography sx={{ color: 'blue', position: 'absolute', top: '290px', left: '290px', fontSize: '10px' }}>
                                    {consent.sleep_pill_text}
                                </Typography>
                            </>
                        )}
                        {consent.tobacco == true && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '316px', left: '170px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.alcohol == true && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '316px', left: '245px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.caffeine == true && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '316px', left: '353px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_1 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '393px', left: '200px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_1 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '393px', left: '243px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_2 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '420px', left: '200px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_2 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '420px', left: '243px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_3 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '444px', left: '200px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_3 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '444px', left: '243px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_4 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '469px', left: '200px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_4 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '469px', left: '243px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_5 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '420px', left: '446px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_5 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '420px', left: '487px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_6 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '444px', left: '446px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_6 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '444px', left: '487px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_7 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '469px', left: '446px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_7 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '469px', left: '487px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_8 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '393px', left: '446px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_8 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '393px', left: '487px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_9 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '393px', left: '693px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_9 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '393px', left: '735px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_10 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '420px', left: '693px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_10 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '420px', left: '735px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_11 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '444px', left: '693px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_11 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '444px', left: '735px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_12 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '469px', left: '693px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_12 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '469px', left: '735px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_13 == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '495px', left: '199px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_problem_13 == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '495px', left: '243px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '523px', left: '140px', fontSize: '14px' }}>
                            {consent.sleep_problem_14}
                        </Typography>
                        {consent.sleep_situation_1 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '618px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_1 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '618px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_1 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '618px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_1 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '618px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_2 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '643px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_2 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '643px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_2 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '643px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_2 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '643px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_3 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '668px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_3 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '668px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_3 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '668px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_3 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '668px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_4 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '694px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_4 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '694px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_4 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '694px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_4 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '694px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_5 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '718px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_5 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '718px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_5 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '718px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_5 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '718px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_6 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '743px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_6 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '743px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_6 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '743px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_6 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '743px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_7 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '769px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_7 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '769px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_7 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '769px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_7 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '769px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_8 == 0 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '806px', left: '595px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_8 == 1 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '806px', left: '642px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_8 == 2 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '806px', left: '688px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.sleep_situation_8 == 3 && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '806px', left: '737px', fontSize: '18px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '846px', left: '660px', fontSize: '16px' }}>
                            {consent.total_situation}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '908px', left: '238px', fontSize: '10px' }}>
                            {consent.weekday_sleep}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '908px', left: '405px', fontSize: '10px' }}>
                            {consent.weekday_awake}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '908px', left: '680px', fontSize: '10px' }}>
                            {consent.weekday_turnoff_light}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '930px', left: '178px', fontSize: '10px' }}>
                            {consent.weekday_night_awake}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '930px', left: '528px', fontSize: '10px' }}>
                            {consent.weekday_night_awake_until_sleep}
                        </Typography>
                        {consent.weekday_alarm == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '930px', left: '672px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.weekday_alarm == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '930px', left: '718px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '954px', left: '238px', fontSize: '10px' }}>
                            {consent.weekend_sleep}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '954px', left: '405px', fontSize: '10px' }}>
                            {consent.weekend_awake}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '954px', left: '680px', fontSize: '10px' }}>
                            {consent.weekend_turnoff_light}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '978px', left: '238px', fontSize: '10px' }}>
                            {consent.weekend_night_awake}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '978px', left: '477px', fontSize: '10px' }}>
                            {consent.weekend_night_awake_until_sleep}
                        </Typography>
                        {consent.weekend_alarm == "true" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '978px', left: '633px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        {consent.weekend_alarm == "false" && (
                            <Typography sx={{ color: 'blue', position: 'absolute', top: '978px', left: '679px', fontSize: '10px' }}>
                                &#10003;
                            </Typography>
                        )}
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '1000px', left: '410px', fontSize: '10px' }}>
                            {consent.informer_name}
                        </Typography>
                        <Typography sx={{ color: 'blue', position: 'absolute', top: '1000px', left: '610px', fontSize: '10px' }}>
                            {consent.informer_position}
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
                <title>Sleepness PDF</title>
            </Head>
            <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', p: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ sm: 12, md: 10 }}>
                        <div className="print-content">
                            <Document
                                file={url + "/consent/Sleepness.pdf"}
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