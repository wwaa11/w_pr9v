import React from 'react';
import AppLayout from "@/layouts/patient";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    TextField,
    Typography,
    Grid,
    Paper,
    Divider,
    Alert,
    IconButton,
    Tooltip,
    RadioGroup
} from '@mui/material';
import { motion } from 'framer-motion';
import Radio from '@mui/material/Radio';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HeightIcon from '@mui/icons-material/Height';
import CalculateIcon from '@mui/icons-material/Calculate';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import QuizIcon from '@mui/icons-material/Quiz';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Swal from 'sweetalert2';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface SleepCheckProps {
    patient: {
        hn: string;
    }
}

function formatTimeTo24Hr(value: string, isBlur = false) {
    // Accept dot or comma as separator and convert to colon
    let cleaned = value.replace(/,/g, ':').replace(/\./g, ':');
    // Remove non-digits and colon
    cleaned = cleaned.replace(/[^0-9:]/g, '');

    // If user types 4 digits, auto-insert colon (e.g., 2259 -> 22:59)
    if (/^\d{3,4}$/.test(cleaned)) {
        cleaned = cleaned.padStart(4, '0');
        cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    // If user types 2 digits and then colon, allow (e.g., 22:)
    if (/^\d{2}(:\d{0,2})?$/.test(cleaned)) {
        // valid partial
    } else if (/^\d{1,2}$/.test(cleaned)) {
        // valid partial
    } else if (/^\d{2}:\d{2}$/.test(cleaned)) {
        // valid
    } else {
        // fallback: try to extract HH:mm
        const match = cleaned.match(/(\d{1,2}):(\d{1,2})/);
        if (match) {
            cleaned = match[1].padStart(2, '0') + ':' + match[2].padStart(2, '0');
        } else {
            cleaned = '';
        }
    }

    // On blur, auto-complete and validate
    if (isBlur) {
        // If only hour (e.g., '22'), make '22:00'
        if (/^\d{1,2}$/.test(cleaned)) {
            cleaned = cleaned.padStart(2, '0') + ':00';
        }
        // If hour:minute with 1 digit minute (e.g., '9:1'), pad minute
        if (/^\d{1,2}:\d{1}$/.test(cleaned)) {
            const [h, m] = cleaned.split(':');
            cleaned = h.padStart(2, '0') + ':' + m.padStart(2, '0');
        }
        // If hour:minute with 2 digit hour and minute, keep as is
        if (/^\d{2}:\d{2}$/.test(cleaned)) {
            // already formatted
        }
        // Validate range
        const [h, m] = cleaned.split(':');
        if (!h || !m || Number(h) > 23 || Number(m) > 59) {
            return '';
        }
    }
    return cleaned;
}

export default function SleepCheck({ patient }: SleepCheckProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);

    const { data, setData, post, processing, errors } = useForm({
        type: "Sleep Check",
        hn: patient.hn,
        data: params.get('data'),
        // Patient Information
        patient_type: "patient",
        relative_name: "",
        relative_relation: "",
        weight: "",
        height: "",
        bmi: "",
        neck_size: "",
        disease: "", // true or false
        disease_text: "", // if true, text field
        medicine: "", // true or false
        medicine_text: "", // if true, text field
        sleep_pill: "", // true or false
        sleep_pill_text: "", // if true, text field
        alcohol: "", // true or false
        tobacco: "", // true or false
        caffeine: "", // true or false
        // ปัญหาเกี่ยวกันการนอน true or false
        sleep_problem_1: "",
        sleep_problem_2: "",
        sleep_problem_3: "",
        sleep_problem_4: "",
        sleep_problem_5: "",
        sleep_problem_6: "",
        sleep_problem_7: "",
        sleep_problem_8: "",
        sleep_problem_9: "",
        sleep_problem_10: "",
        sleep_problem_11: "",
        sleep_problem_12: "",
        sleep_problem_13: "",
        sleep_problem_14: "", // text field
        // Sleep Situation
        sleep_situation_1: "", // score 1-5
        sleep_situation_2: "", // score 1-5
        sleep_situation_3: "", // score 1-5
        sleep_situation_4: "", // score 1-5
        sleep_situation_5: "", // score 1-5
        sleep_situation_6: "", // score 1-5
        sleep_situation_7: "", // score 1-5
        sleep_situation_8: "", // score 1-5
        // Sleep Schedule
        weekday_sleep: "", // time
        weekday_awake: "", // time
        weekday_turnoff_light: "", // number
        weekday_night_awake: "", // number
        weekday_night_awake_until_sleep: "", // number
        weekday_alarm: "", // true or false
        weekend_sleep: "", // time
        weekend_awake: "", // time
        weekend_turnoff_light: "", // number
        weekend_night_awake: "", // number
        weekend_night_awake_until_sleep: "", // number
        weekend_alarm: "", // true or false
    });

    const calculateBMI = () => {
        const weight = parseFloat(data.weight || '0');
        const height = parseFloat(data.height || '0') / 100;
        if (weight > 0 && height > 0) {
            const bmi = weight / (height * height);
            setData('bmi', bmi.toFixed(2));
        }
    };

    const getBMICategory = (bmi: string) => {
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return { category: 'น้ำหนักต่ำกว่าเกณฑ์', color: 'warning' };
        if (bmiValue < 25) return { category: 'น้ำหนักปกติ', color: 'success' };
        if (bmiValue < 30) return { category: 'น้ำหนักเกิน', color: 'warning' };
        return { category: 'อ้วน', color: 'error' };
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.disease == '' || data.medicine == '' || data.sleep_pill == '' || data.alcohol == '' || data.tobacco == '' || data.caffeine == '' || data.neck_size == '') {
            Swal.fire({
                title: 'กรุณากรอกข้อมูล',
                text: 'ประวัติทางการแพทย์ ทั้งหมด',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        if (data.sleep_problem_1 == '' || data.sleep_problem_2 == '' || data.sleep_problem_3 == '' || data.sleep_problem_4 == '' || data.sleep_problem_5 == '' || data.sleep_problem_6 == '' || data.sleep_problem_7 == '' || data.sleep_problem_8 == '' || data.sleep_problem_9 == '' || data.sleep_problem_10 == '' || data.sleep_problem_11 == '' || data.sleep_problem_12 == '' || data.sleep_problem_13 == '') {
            Swal.fire({
                title: 'กรุณากรอกข้อมูล',
                text: 'ปัญหาเกี่ยวกับการนอน ทั้งหมด',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        if (data.sleep_situation_1 == '' || data.sleep_situation_2 == '' || data.sleep_situation_3 == '' || data.sleep_situation_4 == '' || data.sleep_situation_5 == '' || data.sleep_situation_6 == '' || data.sleep_situation_7 == '' || data.sleep_situation_8 == '') {
            Swal.fire({
                title: 'กรุณากรอกข้อมูล',
                text: 'แบบทดสอบระดับความง่วงนอน ทั้งหมด',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        if (data.weekday_sleep == '' || data.weekday_awake == '' || data.weekday_turnoff_light == '' || data.weekday_night_awake == '' || data.weekday_night_awake_until_sleep == '' || data.weekday_alarm == '' || data.weekend_sleep == '' || data.weekend_awake == '' || data.weekend_turnoff_light == '' || data.weekend_night_awake == '' || data.weekend_night_awake_until_sleep == '' || data.weekend_alarm == '') {
            Swal.fire({
                title: 'กรุณากรอกข้อมูล',
                text: 'ตารางเวลาการนอน ทั้งหมด',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        const result = await Swal.fire({
            title: "ยืนยันการส่งข้อมูล",
            text: "คุณต้องการส่งข้อมูลหรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
            post(`${url}/sleep-check`);
        }
    };

    const sleep_problem_list = [
        'นอนกรน',
        'นอนไม่หลับ',
        'นอนละเมอ',
        'นอนกัดฟัน',
        'นอนขากระตุก',
        'นอนฝันร้าย',
        'สะดุ้งตื่นบ่อยตอนกลางคืน',
        'ตื่นมาปากแห้งคอแห้ง',
        'ตื่นตอนเช้าไม่สดชื่น',
        'ง่วงนอนตอนกลางวัน',
        'สำลักน้ำลาย',
        'ปัสสวะบ่อยตอนกลางคืน',
        'ผีอำ'
    ];

    const sleep_situation_list = [
        'ง่วงนอนขณะอ่านหนังสือ',
        'ง่วงนอนขณะดูโทรทัศน์',
        'ง่วงนอนขณะนั้งเฉยๆ นอกบ้านในที่สาธารณะ เช่น ห้องสมุด หรือโรงภาพยนตร์',
        'ง่วงนอนขณะเป็นผู้โดยสารในรถ เรือ รถไฟ เครื่องบิน ติดต่อกันเป็นเวลานาน',
        'ง่วงนอนขณะนั้งเงียบๆ หลังรับประทานอาหารกลางวัน โดยไม่ได้ดื่มเครื่องดื่มแอลกอฮอล์',
        'ง่วงนอนขณะนั้งและพูดคุยกับผู้อื่น',
        'ง่วงนอนขณะนั้งเอนหลังพักผ่อนช่วงบ่ายตามโอกาส',
        'ง่วงนอนขณะขับรถ (ยานพาหนะอื่น) แล้วรถ (ยานพาหนะอื่น) ต้องหยุดนื่ง 2-3 นาที ตามจังหวะการจราจร',
    ]

    return (
        <AppLayout>
            <Head>
                <title>แบบฟอร์มการตรวจความผิดปกติขณะหลับ</title>
            </Head>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
                    {/* Header */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <img src={url + "/images/logo.png"} alt="logo" width={60} height={60} />
                            <Box>
                                <Typography variant="h4" component="h1" sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 0.5
                                }}>
                                    แบบฟอร์มการตรวจความผิดปกติขณะหลับ
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sleep Disorder Assessment Form
                                </Typography>
                            </Box>
                        </Box>
                        <Alert severity="info" icon={<InfoIcon />}>
                            กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง เพื่อการประเมินที่แม่นยำ
                        </Alert>
                    </Paper>

                    <form onSubmit={handleSubmit}>
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardHeader
                                title={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="primary" />
                                        <Typography variant="h6" component="h2">
                                            ข้อมูลผู้ให้ข้อมูล
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '& .MuiCardHeader-title': { color: 'white' }
                                }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <FormControl sx={{ width: '100%', mb: 3 }}>
                                    <FormLabel sx={{ mb: 2, fontWeight: 'bold' }}>
                                        ผู้ให้ข้อมูล
                                    </FormLabel>
                                    <RadioGroup
                                        value={data.patient_type}
                                        onChange={(e) => setData('patient_type', e.target.value)}
                                        sx={{ flexDirection: 'row', gap: 2 }}
                                    >
                                        <FormControlLabel
                                            value="patient"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon />
                                                    <Typography>ผู้ป่วย</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                border: data.patient_type === 'patient' ? '2px solid' : '1px solid',
                                                borderColor: data.patient_type === 'patient' ? 'primary.main' : 'grey.300',
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                flex: 1,
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: 'primary.50'
                                                }
                                            }}
                                        />
                                        <FormControlLabel
                                            value="relative"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <FamilyRestroomIcon />
                                                    <Typography>ญาติ</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                border: data.patient_type === 'relative' ? '2px solid' : '1px solid',
                                                borderColor: data.patient_type === 'relative' ? 'primary.main' : 'grey.300',
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                flex: 1,
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: 'primary.50'
                                                }
                                            }}
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {data.patient_type === "relative" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Divider sx={{ my: 2 }} />
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    required
                                                    label="ชื่อ - สกุล"
                                                    value={data.relative_name}
                                                    onChange={(e) => setData('relative_name', e.target.value)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <TextField
                                                    required
                                                    label="เกี่ยวข้องเป็น"
                                                    value={data.relative_relation}
                                                    onChange={(e) => setData('relative_relation', e.target.value)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            </Grid>
                                        </Grid>
                                    </motion.div>
                                )}

                                <Divider sx={{ my: 3 }} />

                                {/* BMI Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalculateIcon color="primary" />
                                        ข้อมูลร่างกาย (BMI)
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            <TextField
                                                type="number"
                                                required
                                                label="น้ำหนัก (กิโลกรัม)"
                                                value={data.weight}
                                                onChange={(e) => setData('weight', e.target.value)}
                                                onBlur={calculateBMI}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { startAdornment: <MonitorWeightIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            <TextField
                                                type="number"
                                                required
                                                label="ส่วนสูง (เซนติเมตร)"
                                                value={data.height}
                                                onChange={(e) => setData('height', e.target.value)}
                                                onBlur={calculateBMI}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { startAdornment: <HeightIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            <TextField
                                                disabled
                                                label="BMI"
                                                value={data.bmi}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { startAdornment: <CalculateIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
                                            />
                                            {data.bmi && (
                                                <Typography
                                                    variant="caption"
                                                    color={`${getBMICategory(data.bmi).color}.main`}
                                                    sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}
                                                >
                                                    {getBMICategory(data.bmi).category}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            <TextField
                                                type="number"
                                                required
                                                label="รอบคอ (นิ้ว)"
                                                value={data.neck_size}
                                                onChange={(e) => setData('neck_size', e.target.value)}
                                                onBlur={calculateBMI}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                slotProps={{ input: { startAdornment: <PersonRemoveIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Medical History Section */}
                                <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            ประวัติทางการแพทย์
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        {/* Disease */}
                                        <Grid size={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>มีโรคประจำตัวหรือไม่?</FormLabel>
                                                <RadioGroup row value={data.disease} onChange={e => setData('disease', e.target.value)}>
                                                    <FormControlLabel value="true" control={<Radio />} label="มี" />
                                                    <FormControlLabel value="false" control={<Radio />} label="ไม่มี" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        {data.disease === 'true' && (
                                            <Grid size={12}>
                                                <TextField
                                                    required
                                                    label="โปรดระบุโรคประจำตัว"
                                                    value={data.disease_text}
                                                    onChange={e => setData('disease_text', e.target.value)}
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                />
                                            </Grid>
                                        )}
                                        {/* Medicine */}
                                        <Grid size={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>รับประทานยาเป็นประจำหรือไม่?</FormLabel>
                                                <RadioGroup row value={data.medicine} onChange={e => setData('medicine', e.target.value)}>
                                                    <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                    <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        {data.medicine === 'true' && (
                                            <Grid size={12}>
                                                <TextField
                                                    required
                                                    label="โปรดระบุชื่อยา"
                                                    value={data.medicine_text}
                                                    onChange={e => setData('medicine_text', e.target.value)}
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                />
                                            </Grid>
                                        )}
                                        {/* Sleep Pill */}
                                        <Grid size={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>รับประทานยานอนหลับหรือไม่?</FormLabel>
                                                <RadioGroup row value={data.sleep_pill} onChange={e => setData('sleep_pill', e.target.value)}>
                                                    <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                    <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        {data.sleep_pill === 'true' && (
                                            <Grid size={12}>
                                                <TextField
                                                    required
                                                    label="โปรดระบุชื่อยานอนหลับ"
                                                    value={data.sleep_pill_text}
                                                    onChange={e => setData('sleep_pill_text', e.target.value)}
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                />
                                            </Grid>
                                        )}
                                        {/* Alcohol */}
                                        <Grid size={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>ดื่มแอลกอฮอล์หรือไม่?</FormLabel>
                                                <RadioGroup row value={data.alcohol} onChange={e => setData('alcohol', e.target.value)}>
                                                    <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                    <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        {/* Tobacco */}
                                        <Grid size={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>สูบบุหรี่หรือไม่?</FormLabel>
                                                <RadioGroup row value={data.tobacco} onChange={e => setData('tobacco', e.target.value)}>
                                                    <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                    <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        {/* Caffeine */}
                                        <Grid size={12}>
                                            <FormControl fullWidth required>
                                                <FormLabel>ดื่มคาเฟอีน (เช่น กาแฟ ชา) หรือไม่?</FormLabel>
                                                <RadioGroup row value={data.caffeine} onChange={e => setData('caffeine', e.target.value)}>
                                                    <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                    <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Sleep Problems Section */}
                                <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BedtimeIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            ปัญหาเกี่ยวกับการนอน
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {sleep_problem_list.map((label, i) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={label}>
                                                <FormControl fullWidth required>
                                                    <FormLabel>{label}</FormLabel>
                                                    <RadioGroup row value={data[`sleep_problem_${i + 1}` as keyof typeof data]} onChange={e => setData(`sleep_problem_${i + 1}` as keyof typeof data, e.target.value)}>
                                                        <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                        <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        ))}
                                        {/* Problem 14: Text Field */}
                                        <Grid size={12}>
                                            <TextField
                                                label="ปัญหาอื่น ๆ (โปรดระบุ)"
                                                value={data.sleep_problem_14}
                                                onChange={e => setData('sleep_problem_14', e.target.value)}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                helperText="ถ้ามีปัญหาอื่น ๆ เกี่ยวกับการนอน โปรดระบุที่นี่"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Divider sx={{ my: 3 }} />

                                {/* Epworth Sleepiness Scale Section */}
                                <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <QuizIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            แบบทดสอบระดับความง่วงนอน (Epworth Sleepiness Scale)
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                        0 = ไม่เคยเลย &nbsp; 1 = มีโอกาสเล็กน้อย &nbsp; 2 = มีโอกาสปานกลาง &nbsp; 3 = มีโอกาสสูงมาก
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                        อาการภายใน 1 เดือนที่ผ่านมา ถ้าข้อไหนไม่ได้ทำให้นึกว่าได้ทำจะเป็นอย่างไร เช่น ไม่เคยขับรถเลย ก็ต้องนึกว่าถ้าขับจะเป็นอย่างไร <b>ต้องตอบทุกข้อ</b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {sleep_situation_list.map((label, idx) => (
                                            <React.Fragment key={label}>
                                                <Grid size={{ xs: 12, sm: 12 }}>
                                                    <FormControl fullWidth required>
                                                        <FormLabel sx={{ fontWeight: 500 }}>{label}</FormLabel>
                                                        <RadioGroup
                                                            row
                                                            value={data[`sleep_situation_${idx + 1}` as keyof typeof data]}
                                                            onChange={e => setData(`sleep_situation_${idx + 1}` as keyof typeof data, e.target.value)}
                                                            sx={{ gap: 2, mt: 1 }}
                                                        >
                                                            {[0, 1, 2, 3].map(val => (
                                                                <FormControlLabel
                                                                    key={val}
                                                                    value={val.toString()}
                                                                    control={<Radio />}
                                                                    label={<Box sx={{ minWidth: 24, textAlign: 'center' }}>{val}</Box>}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                {idx < sleep_situation_list.length - 1 && (
                                                    <Grid size={12}>
                                                        <Divider sx={{ my: 1 }} />
                                                    </Grid>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </Paper>

                                {/* Sleep Schedule Section */}
                                <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            ตารางเวลาการนอน
                                        </Typography>
                                    </Box>
                                    {/* Weekday */}
                                    <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'info.main' }}>
                                            วันธรรมดา
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="text"
                                                    label="เวลาเข้านอน"
                                                    value={data.weekday_sleep}
                                                    onChange={e => setData('weekday_sleep', formatTimeTo24Hr(e.target.value, false))}
                                                    onBlur={e => setData('weekday_sleep', formatTimeTo24Hr(e.target.value, true))}
                                                    fullWidth
                                                    required
                                                    helperText="เช่น 22:00 น. (24 ชั่วโมง)"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="text"
                                                    label="เวลาตื่นนอน"
                                                    value={data.weekday_awake}
                                                    onChange={e => setData('weekday_awake', formatTimeTo24Hr(e.target.value, false))}
                                                    onBlur={e => setData('weekday_awake', formatTimeTo24Hr(e.target.value, true))}
                                                    fullWidth
                                                    required
                                                    helperText="เช่น 06:00 น. (24 ชั่วโมง)"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="number"
                                                    label="ตั้งแต่ปิดไฟ-หลับ ใช้เวลาประมาณ กี่นาที"
                                                    value={data.weekday_turnoff_light}
                                                    onChange={e => setData('weekday_turnoff_light', e.target.value)}
                                                    fullWidth
                                                    required
                                                    helperText="กรอกเป็นตัวเลขนาที เช่น 15"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="number"
                                                    label="ตื่นกลางดึก (จำนวนครั้ง)"
                                                    value={data.weekday_night_awake}
                                                    onChange={e => setData('weekday_night_awake', e.target.value)}
                                                    fullWidth
                                                    required
                                                    helperText="กรอกจำนวนครั้งที่ตื่นกลางดึก"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="number"
                                                    label="ตื่นกลางดึกแล้วกลับมานอนต่อแต่ละครั้งใช้เวลา"
                                                    value={data.weekday_night_awake_until_sleep}
                                                    onChange={e => setData('weekday_night_awake_until_sleep', e.target.value)}
                                                    fullWidth
                                                    required
                                                    helperText="กรอกเป็นตัวเลขนาที เช่น 10"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth required>
                                                    <FormLabel>ใช้นาฬิกาปลุก</FormLabel>
                                                    <RadioGroup row value={data.weekday_alarm} onChange={e => setData('weekday_alarm', e.target.value)}>
                                                        <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                        <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {/* Weekend */}
                                    <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'info.main' }}>
                                            วันหยุด
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="text"
                                                    label="เวลาเข้านอน"
                                                    value={data.weekend_sleep}
                                                    onChange={e => setData('weekend_sleep', formatTimeTo24Hr(e.target.value, false))}
                                                    onBlur={e => setData('weekend_sleep', formatTimeTo24Hr(e.target.value, true))}
                                                    fullWidth
                                                    required
                                                    helperText="เช่น 23:00 น. (24 ชั่วโมง)"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="text"
                                                    label="เวลาตื่นนอน"
                                                    value={data.weekend_awake}
                                                    onChange={e => setData('weekend_awake', formatTimeTo24Hr(e.target.value, false))}
                                                    onBlur={e => setData('weekend_awake', formatTimeTo24Hr(e.target.value, true))}
                                                    fullWidth
                                                    required
                                                    helperText="เช่น 08:00 น. (24 ชั่วโมง)"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="number"
                                                    label="ตั้งแต่ปิดไฟ-หลับ ใช้เวลาประมาณ กี่นาที"
                                                    value={data.weekend_turnoff_light}
                                                    onChange={e => setData('weekend_turnoff_light', e.target.value)}
                                                    fullWidth
                                                    required
                                                    helperText="กรอกเป็นตัวเลขนาที เช่น 20"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="number"
                                                    label="ตื่นกลางดึก (จำนวนครั้ง)"
                                                    value={data.weekend_night_awake}
                                                    onChange={e => setData('weekend_night_awake', e.target.value)}
                                                    fullWidth
                                                    required
                                                    helperText="กรอกจำนวนครั้งที่ตื่นกลางดึก"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    type="number"
                                                    label="ตื่นกลางดึกแล้วกลับมานอนต่อแต่ละครั้งใช้เวลา"
                                                    value={data.weekend_night_awake_until_sleep}
                                                    onChange={e => setData('weekend_night_awake_until_sleep', e.target.value)}
                                                    fullWidth
                                                    required
                                                    helperText="กรอกเป็นตัวเลขนาที เช่น 12"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth required>
                                                    <FormLabel>ใช้นาฬิกาปลุก</FormLabel>
                                                    <RadioGroup row value={data.weekend_alarm} onChange={e => setData('weekend_alarm', e.target.value)}>
                                                        <FormControlLabel value="true" control={<Radio />} label="ใช่" />
                                                        <FormControlLabel value="false" control={<Radio />} label="ไม่ใช่" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>

                            </CardContent>
                            <CardActions sx={{ p: 3, pt: 0 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={processing}
                                    fullWidth
                                    size="large"
                                    startIcon={processing ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 2
                                    }}
                                >
                                    {processing ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </Box>
            </motion.div>
        </AppLayout>
    );
}