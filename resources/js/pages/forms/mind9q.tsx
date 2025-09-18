import React from 'react';
import AppLayout from "@/layouts/patient";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    FormLabel,
    TextField,
    Typography,
    Grid,
    Paper,
    Alert,
    RadioGroup,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import QuizIcon from '@mui/icons-material/Quiz';
import Swal from 'sweetalert2';

interface Mind9QProps {
    patient: {
        hn: string;
        name: string;
        lang?: string;
    }
}

export default function Mind9Q({ patient }: Mind9QProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);

    const lang = params.get('lang') || patient.lang || 'th';

    const translations = {
        th: {
            title: "แบบทดสอบด้านสุขภาพจิต เพื่อประเมินอาการเบื้องต้น ก่อนนัดหมายปรึกษาจิตแพทย์แบบ VDO CALL",
            pageTitle: "แบบทดสอบคำถามเกี่ยวกับสุขภาพจิต",
            patientInfo: "ข้อมูลผู้ป่วย",
            patientName: "ชื่อ-นามสกุล",
            questionnaire: "แบบประเมินโรคซึมเศร้าออนไลน์ (9Q)",
            instruction: "ในช่วง 2 สัปดาห์ที่ผ่านมารวมทั้งวันนี้ คุณมีอาการเหล่านี้บ่อยแค่ไหน",
            questions: [
                "เบื่อ ไม่สนใจอยากทำอะไร",
                "ไม่สบายใจ ซึมเศร้า ท้อแท้",
                "หลับยาก หรือหลับๆ ตื่นๆ หรือ หลับมากไป",
                "เหนื่อยง่ายหรือไม่ค่อยมีแรง ",
                "เบื่ออาหารหรือกินมากเกินไป",
                "รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลวหรือครอบครัวผิดหวัง",
                "สมาธิไม่ดี เวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ",
                "พูดช้า ทำอะไรช้าลงจนคนอื่นสังเกตเห็นได้หรือกระสับกระส่ายไม่สามารถ อยู่นิ่งได้เหมือนที่เคยเป็น",
                "คิดทำร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี"
            ],
            options: {
                never: "ไม่เลย",
                sometimes: "เป็นบางวัน 1-7 วัน",
                often: "เป็นบ่อย > 7 วัน",
                everyday: "เป็นทุกวัน"
            },
            submitButton: "ยืนยันการส่งข้อมูล",
            submitting: "กำลังส่ง...",
            pleaseEnterName: "กรุณาระบุชื่อ-นามสกุล",
            pleaseAnswerAll: "กรุณาตอบคำถามให้ครบทุกข้อ",
            confirmSubmit: "ยืนยันการส่งข้อมูล",
            confirmSubmitText: "คุณต้องการส่งข้อมูลหรือไม่?",
            confirm: "ยืนยัน",
            cancel: "ยกเลิก",
            infoText: "กรุณาตอบคำถามให้ครบถ้วนและถูกต้อง เพื่อการประเมินที่แม่นยำ"
        },
        en: {
            title: "Mental Health Assessment Questionnaire for Initial Evaluation Before Seeing a Doctor",
            pageTitle: "Mental Health Assessment Questionnaire",
            patientInfo: "Patient Information",
            patientName: "Full Name",
            questionnaire: "Depression Assessment for Children and Adolescents (9Q)",
            instruction: "Over the last 2 weeks, including today, how often have you been bothered by any of the following problems?",
            questions: [
                "Little interest or pleasure in doing things",
                "Feeling down, depressed, or hopeless",
                "Trouble falling or staying asleep, or sleeping too much",
                "Feeling tired or having little energy",
                "Poor appetite or overeating",
                "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
                "Trouble concentrating on things, such as reading the newspaper or watching television",
                "Moving or speaking so slowly that other people could have noticed or being so fidgety or restless that you have been moving around a lot more than usual",
                "Thoughts that you would be better off dead, or thoughts of hurting yourself"
            ],
            options: {
                never: "Not at all",
                sometimes: "Several days (1-7 days)",
                often: "Often (> 7 days)",
                everyday: "Every day"
            },
            submitButton: "Submit Assessment",
            submitting: "Submitting...",
            pleaseEnterName: "Please enter full name",
            pleaseAnswerAll: "Please answer all questions",
            confirmSubmit: "Confirm Submission",
            confirmSubmitText: "Do you want to submit the assessment?",
            confirm: "Confirm",
            cancel: "Cancel",
            infoText: "Please answer all questions completely and accurately for precise assessment"
        }
    };

    const t = translations[lang as keyof typeof translations] || translations.th;

    const { data, setData, post, processing, errors } = useForm({
        type: "Mind9Q",
        lang: lang,
        hn: patient.hn,
        data: params.get('data'),
        patient_name: patient.name || "",
        patient_type: "patient",
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        q9: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.patient_name === "") {
            Swal.fire({
                title: t.pleaseEnterName,
                icon: "warning",
            });
            return;
        }

        if (data.q1 === "" || data.q2 === "" || data.q3 === "" || data.q4 === "" || data.q5 === "" || data.q6 === "" || data.q7 === "" || data.q8 === "" || data.q9 === "") {
            Swal.fire({
                title: t.pleaseAnswerAll,
                icon: "warning",
            });
            return;
        }

        const result = await Swal.fire({
            title: t.confirmSubmit,
            text: t.confirmSubmitText,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: t.confirm,
            cancelButtonText: t.cancel,
        });

        if (result.isConfirmed) {
            post(`${url}/mind9q`);
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>{t.pageTitle}</title>
                <meta name="description" content={t.pageTitle} />
            </Head>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ maxWidth: '900px', mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
                    {/* Header */}
                    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <img src={url + "/images/logo.png"} alt="logo" width={60} height={60} style={{ flexShrink: 0 }} />
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Typography variant="h5" component="h1" sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 0.5,
                                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                                    textAlign: { xs: 'center', sm: 'center' }
                                }}>
                                    {t.title}
                                </Typography>
                            </Box>
                        </Box>
                        <Alert severity="info" icon={<InfoIcon />}>
                            {t.infoText}
                        </Alert>
                    </Paper>

                    <form onSubmit={handleSubmit}>
                        {/* Patient Information */}
                        <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
                            <CardHeader
                                title={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="primary" />
                                        <Typography variant="h6" component="h2">
                                            {t.patientInfo}
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '& .MuiCardHeader-title': { color: 'white' }
                                }}
                            />
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <TextField
                                    required
                                    fullWidth
                                    label={t.patientName}
                                    value={data.patient_name}
                                    onChange={(e) => setData('patient_name', e.target.value)}
                                    sx={{ mb: 3 }}
                                    size="medium"
                                    InputProps={{
                                        sx: { fontSize: { xs: '1rem', sm: '1rem' } }
                                    }}
                                    InputLabelProps={{
                                        sx: { fontSize: { xs: '1rem', sm: '1rem' } }
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Questionnaire */}
                        <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
                            <CardHeader
                                title={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <QuizIcon color="primary" />
                                        <Typography variant="h6" component="h2">
                                            {t.questionnaire}
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '& .MuiCardHeader-title': { color: 'white' }
                                }}
                            />
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Typography variant="body1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                                    {t.instruction}
                                </Typography>

                                {/* Desktop Table View */}
                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                                                        {lang === 'en' ? 'Questions' : 'แบบประเมินโรคซึมเศร้าสำหรับเด็กและวัยรุ่น (9Q)'}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                        {t.options.never}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                        {t.options.sometimes}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                        {t.options.often}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                        {t.options.everyday}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {t.questions.map((question, index) => {
                                                    const questionKey = `q${index + 1}` as keyof typeof data;
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ fontWeight: 'medium' }}>
                                                                {index + 1}. {question}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Radio
                                                                    checked={data[questionKey] === '0'}
                                                                    onChange={() => setData(questionKey, '0')}
                                                                    value="0"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Radio
                                                                    checked={data[questionKey] === '1'}
                                                                    onChange={() => setData(questionKey, '1')}
                                                                    value="1"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Radio
                                                                    checked={data[questionKey] === '2'}
                                                                    onChange={() => setData(questionKey, '2')}
                                                                    value="2"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Radio
                                                                    checked={data[questionKey] === '3'}
                                                                    onChange={() => setData(questionKey, '3')}
                                                                    value="3"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                {/* Mobile Card View */}
                                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                    {t.questions.map((question, index) => {
                                        const questionKey = `q${index + 1}` as keyof typeof data;
                                        return (
                                            <Card key={index} sx={{ mb: 2, p: 2 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                                                    {index + 1}. {question}
                                                </Typography>
                                                <RadioGroup
                                                    value={data[questionKey] || ''}
                                                    onChange={(e) => setData(questionKey, e.target.value)}
                                                    sx={{ gap: 1 }}
                                                >
                                                    <FormControlLabel
                                                        value="0"
                                                        control={<Radio size="medium" />}
                                                        label={t.options.never}
                                                        sx={{
                                                            m: 0,
                                                            p: 1.5,
                                                            border: '1px solid',
                                                            borderColor: data[questionKey] === '0' ? 'primary.main' : 'grey.300',
                                                            borderRadius: 1,
                                                            backgroundColor: data[questionKey] === '0' ? 'primary.50' : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: 'grey.50'
                                                            }
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="1"
                                                        control={<Radio size="medium" />}
                                                        label={t.options.sometimes}
                                                        sx={{
                                                            m: 0,
                                                            p: 1.5,
                                                            border: '1px solid',
                                                            borderColor: data[questionKey] === '1' ? 'primary.main' : 'grey.300',
                                                            borderRadius: 1,
                                                            backgroundColor: data[questionKey] === '1' ? 'primary.50' : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: 'grey.50'
                                                            }
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="2"
                                                        control={<Radio size="medium" />}
                                                        label={t.options.often}
                                                        sx={{
                                                            m: 0,
                                                            p: 1.5,
                                                            border: '1px solid',
                                                            borderColor: data[questionKey] === '2' ? 'primary.main' : 'grey.300',
                                                            borderRadius: 1,
                                                            backgroundColor: data[questionKey] === '2' ? 'primary.50' : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: 'grey.50'
                                                            }
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="3"
                                                        control={<Radio size="medium" />}
                                                        label={t.options.everyday}
                                                        sx={{
                                                            m: 0,
                                                            p: 1.5,
                                                            border: '1px solid',
                                                            borderColor: data[questionKey] === '3' ? 'primary.main' : 'grey.300',
                                                            borderRadius: 1,
                                                            backgroundColor: data[questionKey] === '3' ? 'primary.50' : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: 'grey.50'
                                                            }
                                                        }}
                                                    />
                                                </RadioGroup>
                                            </Card>
                                        );
                                    })}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 0 } }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={processing}
                                fullWidth
                                sx={{
                                    px: { xs: 4, sm: 6 },
                                    py: { xs: 1.5, sm: 1.5 },
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    minWidth: { xs: 'auto', sm: '200px' },
                                    maxWidth: { xs: '100%', sm: '300px' }
                                }}
                            >
                                {processing ? t.submitting : t.submitButton}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </motion.div>
        </AppLayout>
    );
}