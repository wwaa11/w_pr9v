import React, { useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import SignaturePad from "react-signature-canvas";
import AppLayout from "@/layouts/patient";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import Swal from 'sweetalert2';

interface ConsentTelehealthProps {
    patient: {
        hn: string;
    }
}

export default function ConsentTelehealth({ patient }: ConsentTelehealthProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);

    const { data, setData, post, processing, errors } = useForm({
        type: "Telehealth",
        hn: patient.hn,
        data: params.get('data'),
        doctor_name: params.get('doctor_name') || "",
        patient_name: "",
        patient_type: "patient",
        patient_relation: "",
        patient_phone: "",
        patient_address: "",
        document_information: "yes",
        signature: "",
    });

    const sigPadRef = useRef<any>(null);

    const handleClear = () => {
        sigPadRef.current.clear();
        setData((prev) => ({
            ...prev,
            signature: "",
        }));
    };

    const handleEnd = () => {
        if (sigPadRef.current) {
            setData((prev) => ({
                ...prev,
                signature: sigPadRef.current.getCanvas().toDataURL("image/png"),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (data.patient_name === "") {
            Swal.fire({
                title: "กรุณาระบุชื่อ-นามสกุล",
                icon: "warning",
            });
            return;
        }

        if (data.patient_type === "representative" && data.patient_relation === "" && data.patient_phone === "" && data.patient_address === "") {
            Swal.fire({
                title: "กรุณาระบุข้อมูลตัวแทนผู้ป่วย",
                icon: "warning",
            });
            return;
        }

        if (sigPadRef.current.isEmpty()) {
            Swal.fire({
                title: "กรุณาลงนาม",
                icon: "warning",
            });
            return;
        }

        const result = await Swal.fire({
            title: "ยืนยันการแสดงความยินยอม",
            text: "คุณต้องการลงนามหรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
            post(`${url}/telehealth`);
        }

    };

    return (
        <AppLayout>
            <Head>
                <title>ข้อกำหนดและการให้ความยินยอมรับบริการ</title>
                <meta name="description" content="ข้อกำหนดและการให้ความยินยอมรับบริการ" />
            </Head>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
                    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2 }}>
                            <img src={url + "/images/logo.png"} alt="logo" width={100} />
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                หนังสือแสดงเจตจำนง ปฏิเสธกํารบันทึกภาพ วีดีโอ และเสียงในกํารรับบริการการแพทย์ทางไกล (Telehealth Service)
                            </Typography>
                        </Box>
                        {/* Signature Section */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ข้าพเจ้า
                            </Typography>
                            <TextField
                                required
                                fullWidth
                                label="ชื่อ-นามสกุล"
                                value={data.patient_name}
                                onChange={(e) => setData('patient_name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ผู้ซึ่งเป็น
                            </Typography>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <RadioGroup
                                    value={data.patient_type}
                                    onChange={(e) => setData('patient_type', e.target.value)}
                                >
                                    <FormControlLabel value="patient" control={<Radio />} label="ผู้ป่วย" />
                                    <FormControlLabel value="representative" control={<Radio />} label="ตัวแทนผู้ป่วย" />
                                </RadioGroup>
                            </FormControl>
                            {data.patient_type === 'representative' && (
                                <Grid size={12}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        ข้อมูลตัวแทนผู้ป่วย
                                    </Typography>
                                    <TextField
                                        sx={{ mb: 2 }}
                                        required
                                        fullWidth
                                        label="โปรดระบุตวามสัมพันธ์กับผู้ป่วย"
                                        value={data.patient_relation}
                                        onChange={(e) => setData('patient_relation', e.target.value)}
                                        error={!!errors.patient_relation}
                                        helperText={errors.patient_relation}
                                    />
                                    <TextField
                                        sx={{ mb: 2 }}
                                        required
                                        fullWidth
                                        label="โปรดระบุเบอร์โทรศัพท์ตัวแทนผู้ป่วย"
                                        value={data.patient_phone}
                                        onChange={(e) => setData('patient_phone', e.target.value)}
                                        error={!!errors.patient_phone}
                                        helperText={errors.patient_phone}
                                    />
                                    <TextField
                                        sx={{ mb: 2 }}
                                        required
                                        fullWidth
                                        label="โปรดระบุที่อยู่ตัวแทนผู้ป่วย"
                                        value={data.patient_address}
                                        onChange={(e) => setData('patient_address', e.target.value)}
                                        error={!!errors.patient_address}
                                        helperText={errors.patient_address}
                                    />
                                </Grid>
                            )}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ได้รับการอธิบายอย่างละเอียดโดย แพทย์ผู้ดูแลรักษา คือ
                            </Typography>
                            <TextField
                                fullWidth
                                disabled
                                label="แพทย์ผู้ดูแลรักษา"
                                value={data.doctor_name}
                                onChange={(e) => setData('doctor_name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                รายละเอียด
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;1. เหตุผลและวัตถุประสงค์ของการบันทึกภาพ วีดีโอ และเสียง ในการรับบริการการแพทย์ทางไกล (Telehealth service)
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;2. ทางเลือกอื่นๆ ของการตรวจรักษา คือ แนะนำให้พบแพทย์ที่โรงพยาบาล
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;3. ประโยชน์ของการบันทึกภาพ วีดีโอ และเสียง เมื่อรับบริการการแพทย์ทางไกล (Telehealth Service)
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;4. ความเสี่ยงที่อาจเกิดจากการปฏิเสธการบันทึกภาพ วีดีโอ และเสียงในการบริการแพทย์ทางไกล (Telehealth Service)
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;5. เอกสารประกอบการให้ข้อมูล นโยบายบริการการแพทย์ทางไกล (Telehealth Service) (HP-HCT-03)
                            </Typography>
                            <RadioGroup
                                value={data.document_information}
                                onChange={(e) => setData('document_information', e.target.value)}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="มี" disabled />
                                <FormControlLabel value="no" control={<Radio />} label="ไม่มี" disabled />
                            </RadioGroup>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;ข้าพเจ้าได้รับโอกาสจากแพทย์ผู้รักษาอย่างเต็มที่ในการถามคำถาม และคำถามทั้งหมดได้รับคำตอบอย่างเต็มที่เป็นที่พอใจของข้าพเจ้า
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;ข้าพเจ้าตัดสินใจเลือกที่จะปฏิเสธการบันทึกภาพ วีดีโอและเสียง ในการรับบริการแพทย์ทางไกล โดยที่ข้าพเจ้ายอมรับความเสี่ยง และผลที่อาจจะเกิดขึ้นจากการตัดสินใจของข้าพเจ้า
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;ข้าพเจ้าขอรับรองว่าโรงพยาบาล, เจ้าหน้าที่ของโรงพยาบาล และแพทย์ผู้รักษา ไม่มีความรับผิดชอบใดๆ ต่อผลที่อาจเกิดจากการตัดสินใจของข้าพเจ้าในการปฏิเสธการรักษา หรือการผ่าตัด หรือหัตถการ หรือการตรวจที่แพทย์แนะนำ
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ลายมือชื่อผู้ลงนาม
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '200px',
                                        position: 'relative',
                                        '& .sigCanvas': {
                                            width: '100% !important',
                                            height: '100% !important',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        },
                                    }}
                                >
                                    <SignaturePad
                                        ref={sigPadRef}
                                        canvasProps={{
                                            className: "sigCanvas",
                                        }}
                                        onEnd={handleEnd}
                                    />
                                </Box>
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleClear}
                                        sx={{ mr: 2 }}
                                    >
                                        ล้างลายมือชื่อ
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={processing}
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {processing ? 'กำลังส่ง...' : 'ยืนยันการแสดงความยินยอม'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </form>
            </motion.div>
        </AppLayout>
    );
} 