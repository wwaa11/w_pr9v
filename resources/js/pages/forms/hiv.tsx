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
        lang: string;
    }
}

export default function ConsentHiv({ patient }: ConsentHivProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);

    const lang = patient.lang || 'th';

    const translations = {
        th: {
            title: "หนังสือแสดงความยินยอม รับการตรวจการติดเชื้อเอชไอวี",
            pageTitle: "ข้อกำหนดและการให้ความยินยอมรับบริการ",
            iAm: "ข้าพเจ้า",
            nameLabel: "ชื่อ-นามสกุล",
            whoIs: "ผู้ซึ่งเป็น",
            patient: "ตัวผู้ป่วย",
            representative: "ผู้แทนผู้ป่วย",
            representativeInfo: "ข้อมูลตัวแทนผู้ป่วย",
            relationLabel: "โปรดระบุตวามสัมพันธ์กับผู้ป่วย",
            phoneLabel: "โปรดระบุเบอร์โทรศัพท์ตัวแทนผู้ป่วย",
            addressLabel: "โปรดระบุที่อยู่ตัวแทนผู้ป่วย",
            explanation: "ได้รับคำอธิบายจากแพทย์ / ทันตแพทย์ เกี่ยวกับการตรวจการติดเชื้อ เอชไอวี และได้ซักถามข้อสงสัยเกี่ยวกับการตรวจการติดเชื้อเอชไอวี มีรายละเอียดดังต่อไปนี้",
            point1: "1. เอชไอวี เป็นไวรัสที่เป็นสาเหตุของโรคเอดส์",
            point2: "2. วิธีที่จะทราบว่ามีเชื้อ เอชไอวี ต้องตรวจหาเท่านั้น",
            point3: "3. การตรวจการติดเชื้อ เอชไอวี มีความสำคัญต่อการดูแลสุขภาพ",
            point4: "4. การตรวจการติดเชื้อ เอชไอวี จะกระทำโดยความสมัครใจของผู้ตรวจ",
            point5: "5. ผลการตรวจจัดเก็บเป็นความลับ",
            notifyResults: "ข้าพเจ้าขอให้แจ้งผลการตรวจแก่",
            selfOnly: "ข้าพเจ้าเองเท่านั้น",
            selfAndOthers: "ข้าพเจ้าและ/หรือผู้อื่น",
            noNotification: "ไม่ต้องการให้แจ้งผลแก่ข้าพเจ้าและ/หรือผู้อื่น",
            otherPersonLabel: "ชื่อผู้ที่ข้าพเจ้าให้แจ้งผลแก่ ( ชื่อ นามสกุล / บริษัท )",
            confirmation: "ข้าพเจ้ายืนยันที่จะให้โรงพยาบาลทำตามความประสงค์ของข้าพเจ้า และรับทราบถึงผลกระทบอันอาจจะเกิดขึ้นเนื่องจากการตรวจ หรือไม่ยินยอมให้ตรวจในครั้งนี้ รวมถึงการแจ้งผล อนึ่ง กรณีที่ข้าพเจ้าให้บุคคลอื่นเป็นผู้รับทราบผลการตรวจแทนข้าพเจ้านั้น ให้ถือว่าหนังสือ ฉบับนี้เป็นหนังสือยินยอมของข้าพเจ้า เพื่อให้ผู้ที่ข้าพเจ้าระบุชื่อไว้ข้างต้นเป็นผู้รับทราบผลแทนข้าพเจ้าได้",
            signature: "ลายมือชื่อผู้ลงนาม",
            clearSignature: "ล้างลายมือชื่อ",
            submitButton: "ยืนยันการแสดงความยินยอม",
            submitting: "กำลังส่ง...",
            pleaseEnterName: "กรุณาระบุชื่อ-นามสกุล",
            pleaseEnterRepInfo: "กรุณาระบุข้อมูลตัวแทนผู้ป่วย",
            pleaseSign: "กรุณาลงนาม",
            confirmConsent: "ยืนยันการแสดงความยินยอม",
            confirmSignText: "คุณต้องการลงนามหรือไม่?",
            confirm: "ยืนยัน",
            cancel: "ยกเลิก"
        },
        en: {
            title: "HIV Testing Consent Form",
            pageTitle: "Terms and Conditions for Service Consent",
            iAm: "I am",
            nameLabel: "Full Name",
            whoIs: "Who is",
            patient: "The patient",
            representative: "Patient representative",
            representativeInfo: "Representative Information",
            relationLabel: "Please specify relationship with patient",
            phoneLabel: "Please specify representative's phone number",
            addressLabel: "Please specify representative's address",
            explanation: "I have been informed about H.I.V. screening test from physician/dentist as detailed:",
            point1: "1. HIV is a virus that causes AIDS",
            point2: "2. Screening test is required to indicate the infection",
            point3: "3. HIV screening test is essential for a proper health care",
            point4: "4. HIV screening test is a voluntary test",
            point5: "5. The result of the test will be kept confidential",
            notifyResults: "I would like to have the result of the test informed to",
            selfOnly: "Me only",
            selfAndOthers: "Me and other",
            noNotification: "No one",
            otherPersonLabel: "Name of person I authorize to receive results (Full Name / Company)",
            confirmation: "I insist to have the hospital acted as I wish. I fully realise the consequence of accepting or refusing to take the test including result notification. If I have a representative, this form is regarded as consent for my representative to have the result of the test informed",
            signature: "Signature",
            clearSignature: "Clear Signature",
            submitButton: "Confirm Consent",
            submitting: "Submitting...",
            pleaseEnterName: "Please enter full name",
            pleaseEnterRepInfo: "Please enter representative information",
            pleaseSign: "Please sign",
            confirmConsent: "Confirm Consent",
            confirmSignText: "Do you want to sign?",
            confirm: "Confirm",
            cancel: "Cancel"
        }
    };

    const t = translations[lang as keyof typeof translations] || translations.th;

    const { data, setData, post, processing, errors } = useForm({
        type: "HIV",
        lang: lang,
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
                title: t.pleaseEnterName,
                icon: "warning",
            });
            return;
        }

        if (data.patient_type === "representative" && data.patient_relation === "" && data.patient_phone === "" && data.patient_address === "") {
            Swal.fire({
                title: t.pleaseEnterRepInfo,
                icon: "warning",
            });
            return;
        }

        if (sigPadRef.current.isEmpty()) {
            Swal.fire({
                title: t.pleaseSign,
                icon: "warning",
            });
            return;
        }

        const result = await Swal.fire({
            title: t.confirmConsent,
            text: t.confirmSignText,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: t.confirm,
            cancelButtonText: t.cancel,
        });

        if (result.isConfirmed) {
            post(`${url}/hiv`);
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
                                {t.title}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.iAm}
                            </Typography>
                            <TextField
                                required
                                fullWidth
                                label={t.nameLabel}
                                value={data.patient_name}
                                onChange={(e) => setData('patient_name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.whoIs}
                            </Typography>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <RadioGroup
                                    value={data.patient_type}
                                    onChange={(e) => setData('patient_type', e.target.value)}
                                >
                                    <FormControlLabel value="patient" control={<Radio />} label={t.patient} />
                                    <FormControlLabel value="representative" control={<Radio />} label={t.representative} />
                                </RadioGroup>
                            </FormControl>
                            {data.patient_type === 'representative' && (
                                <Grid size={12}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {t.representativeInfo}
                                    </Typography>
                                    <TextField
                                        sx={{ mb: 2 }}
                                        required
                                        fullWidth
                                        label={t.relationLabel}
                                        value={data.patient_relation}
                                        onChange={(e) => setData('patient_relation', e.target.value)}
                                        error={!!errors.patient_relation}
                                        helperText={errors.patient_relation}
                                    />
                                    <TextField
                                        sx={{ mb: 2 }}
                                        required
                                        fullWidth
                                        label={t.phoneLabel}
                                        value={data.patient_phone}
                                        onChange={(e) => setData('patient_phone', e.target.value)}
                                        error={!!errors.patient_phone}
                                        helperText={errors.patient_phone}
                                    />
                                    <TextField
                                        sx={{ mb: 2 }}
                                        required
                                        fullWidth
                                        label={t.addressLabel}
                                        value={data.patient_address}
                                        onChange={(e) => setData('patient_address', e.target.value)}
                                        error={!!errors.patient_address}
                                        helperText={errors.patient_address}
                                    />
                                </Grid>
                            )}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.explanation}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;{t.point1}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;{t.point2}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;{t.point3}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;{t.point4}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;{t.point5}
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }} >
                                {t.notifyResults}
                            </Typography>
                            <RadioGroup
                                value={data.hiv_consent}
                                onChange={(e) => setData('hiv_consent', e.target.value)}
                            >
                                <FormControlLabel value="self" control={<Radio />} label={t.selfOnly} />
                                <FormControlLabel value="other" control={<Radio />} label={t.selfAndOthers} />
                                <FormControlLabel value="none" control={<Radio />} label={t.noNotification} />
                            </RadioGroup>
                            {data.hiv_consent === "other" && (
                                <TextField
                                    sx={{ mb: 2 }}
                                    required
                                    fullWidth
                                    label={t.otherPersonLabel}
                                    value={data.hiv_name}
                                    onChange={(e) => setData('hiv_name', e.target.value)}
                                />
                            )}

                            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                                &emsp;{t.confirmation}
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.signature}
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
                                        {t.clearSignature}
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
                                    {processing ? t.submitting : t.submitButton}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </form>
            </motion.div>
        </AppLayout>
    );
}