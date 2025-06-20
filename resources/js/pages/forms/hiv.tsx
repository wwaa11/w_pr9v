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

interface ConsentHivProps {
    patient: {
        hn: string;
        name: string;
    }
}

export default function ConsentHiv({ patient }: ConsentHivProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);

    const { data, setData, post, processing, errors } = useForm({
        type: "HIV",
        hn: patient.hn,
        data: params.get('data'),
        patient_name: patient.name,
        patient_type: "patient",
        patient_relation: "",
        patient_phone: "",
        patient_address: "",
        hiv_consent: "self",
        hiv_name: "",
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
            post(`${url}/hiv`);
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
                {errors.hiv_consent && (
                    <div className="alert alert-danger">
                        {errors.hiv_consent}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
                    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2 }}>
                            <img src={url + "/images/logo.png"} alt="logo" width={100} />
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                หนังสือแสดงความยินยอม รับการตรวจการติดเชื้อเอชไอวี
                            </Typography>
                        </Box>
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
                                    <FormControlLabel value="patient" control={<Radio />} label="ตัวผู้ป่วย" />
                                    <FormControlLabel value="representative" control={<Radio />} label="ผู้แทนผู้ป่วย" />
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
                                ได้รับคำอธิบายจากแพทย์ / ทันตแพทย์ เกี่ยวกับการตรวจการติดเชื้อ เอชไอวี และได้ซักถามข้อสงสัยเกี่ยวกับการตรวจการติดเชื้อเอชไอวี มีรายละเอียดดังต่อไปนี้
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;1. เอชไอวี เป็นไวรัสที่เป็นสาเหตุของโรคเอดส์
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;2. วิธีที่จะทราบว่ามีเชื้อ เอชไอวี ต้องตรวจหาเท่านั้น
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;3. การตรวจการติดเชื้อ เอชไอวี มีความสำคัญต่อการดูแลสุขภาพ
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;4. การตรวจการติดเชื้อ เอชไอวี จะกระทำโดยความสมัครใจของผู้ตรวจ
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;5. ผลการตรวจจัดเก็บเป็นความลับ
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }} >
                                ข้าพเจ้าขอให้แจ้งผลการตรวจแก่
                            </Typography>
                            <RadioGroup
                                value={data.hiv_consent}
                                onChange={(e) => setData('hiv_consent', e.target.value)}
                            >
                                <FormControlLabel value="self" control={<Radio />} label="ข้าพเจ้าเองเท่านั้น" />
                                <FormControlLabel value="other" control={<Radio />} label="ข้าพเจ้าและ/หรือผู้อื่น" />
                                <FormControlLabel value="none" control={<Radio />} label="ไม่ต้องการให้แจ้งผลแก่ข้าพเจ้าและ/หรือผู้อื่น" />
                            </RadioGroup>
                            {data.hiv_consent === "other" && (
                                <TextField
                                    sx={{ mb: 2 }}
                                    required
                                    fullWidth
                                    label="ชื่อผู้ที่ข้าพเจ้าให้แจ้งผลแก่ ( ชื่อ นามสกุล / บริษัท )"
                                    value={data.hiv_name}
                                    onChange={(e) => setData('hiv_name', e.target.value)}
                                />
                            )}

                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;ข้าพเจ้ายืนยันที่จะให้โรงพยาบาลทำตามความประสงค์ของข้าพเจ้า และรับทราบถึงผลกระทบอันอาจจะเกิดขึ้นเนื่องจากการตรวจ หรือไม่ยินยอมให้ตรวจในครั้งนี้ รวมถึงการแจ้งผล อนึ่ง กรณีที่ข้าพเจ้าให้บุคคลอื่นเป็นผู้รับทราบผลการตรวจแทนข้าพเจ้านั้น ให้ถือว่าหนังสือ ฉบับนี้เป็นหนังสือยินยอมของข้าพเจ้า เพื่อให้ผู้ที่ข้าพเจ้าระบุชื่อไว้ข้างต้นเป็นผู้รับทราบผลแทนข้าพเจ้าได้
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