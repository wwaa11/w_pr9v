import AppLayout from "@/layouts/patient";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import SignaturePad from "react-signature-canvas";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";

interface ConsentTelemedicineProps {
    patient: {
        hn: string;
    }
}

export default function ConsentTelemedicine({ patient }: ConsentTelemedicineProps) {
    const page = usePage();
    const url = page.props.url as string;
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        type: "telemed",
        hn: patient.hn,
        signature: "",
        signature_name: "",
        consent_1: "",
        consent_2: "",
        consent_3: "",
        consent_4: "",
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

        if (data.consent_1 === "" || data.consent_2 === "" || data.consent_3 === "" || data.consent_4 === "") {
            Swal.fire({
                icon: "warning",
                title: "โปรดระบุความยินยอมให้ครบ",
            });
            return;
        }

        if (data.consent_1 === "no" || data.consent_4 === "no") {
            Swal.fire({
                icon: "warning",
                title: "โปรดให้ความยินยอม",
                html: "ข้อ 10.1 ให้คณะแพทย์ ทันตแพทย์ และบุคลากรทางการแพทย์ของโรงพยาบาลพระรามเก้า ทำการตรวจวินิจฉัยและให้การรักษาแบบผู้ป่วยนอก ตามหลักวิชาการแพทย์ที่เหมาะสม <br/>และ<br/> ข้อกำหนด การให้บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ "
            });
            return;
        }

        if (!data.signature || data.signature_name === "") {
            Swal.fire({
                icon: "warning",
                title: "โปรดลงลายมือชื่อ",
                text: "โปรดลงลายมือชื่อก่อนให้ความยินยอม.",
            });
            return;
        }

        const result = await Swal.fire({
            title: "ยืนยันการลงนาม",
            text: "คุณต้องการลงนามหรือไม่?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
            post(`${url}/telemedicine`);
        }
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <AppLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
                    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ข้อกำหนดและการให้ความยินยอมรับบริการ
                        </Typography>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: 'text.secondary' }}>
                            การแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์
                        </Typography>
                        <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                            Praram 9 Hospital Public Company Limited
                        </Typography>
                        <Alert severity="info" sx={{ mb: 4 }}>
                            กรุณาอ่านข้อกำหนดทั้งหมดและให้ความยินยอมตามที่ระบุ
                        </Alert>
                        {/* Consent Sections */}
                        <Box sx={{ mb: 4 }}>
                            {[
                                {
                                    id: '1', title: 'บริการ', content: [
                                        '1.1 บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ ให้บริการผ่านเว็บไซต์ (Website) หรือแอพลิเคชัน (Application) ซึ่งประกอบด้วยบริการต่างๆ และข้อพึงระวังดังต่อไปนี้',
                                        '(ก) บริการทางการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ นี้ไม่เหมาะ ต่อผู้รับบริบาลที่มีอาการ เจ็บป่วยรุนแรงเฉียบพลัน อาการสาหัส หรืออยู่ในอาการที่ต้องได้รับการรักษาพยาบาลโดยเร่งด่วน ซึ่งกรณีดังกล่าว ควรรีบขอความ ช่วยเหลือจากโรงพยาบาล หน่วยรถพยาบาลฉุกเฉิน รวมถึงไม่เหมาะกับผู้ที่ไม่สามารถช่วยเหลือตนเองได้ และผู้ที่ยังไม่บรรลุนิติภาวะ',
                                        '(ข) บริการจัดส่งยาตามคำสั่งของแพทย์ ไปยังภูมิลำเนาของท่าน',
                                        '(ค) บริการ จัดส่งทีมงานทางการแพทย์ เพื่อเก็บตัวอย่าง ณ ภูมิลำเนาของท่าน เพื่อนำกลับมาตรวจวิเคราะห์ทาง ห้องปฏิบัติการทางการแพทย์เกี่ยวกับโรคทั่วไป หรือเพื่อการตรวจวินิจฉัยอาการเบื้องต้น',
                                        '(ง) บริการอื่นๆ',
                                        '1.2 การออกใบรับรองแพทย์ขึ้นอยู่กับดุลยพินิจของแพทย์ผู้ให้บริบาลแต่เพียงผู้เดียว หรือจากการพิจารณาการยืนยันตัวตน ของผู้รับบริบาล จากระบบการให้บริบาลผ่านระบบบริบาลโทรเวช หรือบริบาลการแพทย์ทางไกล (Telemedicine) ภายใต้มาตรฐานด้านสารสนเทศ ที่หน่วยงานรับผิดชอบที่กำกับดูแลเรื่องการยืนยันตัวบุคคลของรัฐเป็นผู้กำหนด',
                                    ]
                                },
                                {
                                    id: '2', title: 'หน้าที่ของผู้รับบริบาล', content: [
                                        '2.1 ต้องให้ข้อมูลต่างๆ ของผู้รับบริบาล รวมถึงข้อมูลส่วนบุคคล เช่น เลขบัตรประชาชน สถานที่ติดต่อ ผู้ที่สามารถ ติดต่อได้ในกรณีฉุกเฉิน เบอร์ติดต่อของผู้รับบริบาลและผู้เกี่ยวข้อง และ/หรือ ข้อมูลสุขภาพทั่วไปและที่จำเป็น',
                                        '2.2 ผู้รับบริบาลรับรองว่าข้อมูลต่างๆ ที่ได้ให้ไว้สำหรับการรับบริบาลนี้เป็นความจริงทั้งสิ้น',
                                        '2.3 ผู้รับบริบาลจะไม่ใช้บริการนี้เพื่อวัตถุประสงค์ที่ขัดต่อกฎหมาย และจะปฏิบัติตามกฎหมายหรือกฎระเบียบต่างๆ',
                                        '2.4 การชำระเงินการเข้ารับบริการนี้ ให้เป็นไปตามข้อตกลงที่กำหนดไว้',
                                    ]
                                },
                                {
                                    id: '3', title: 'ผู้รับบริบาลรับทราบข้อเท็จจริงและเคารพในดุลพินิจของผู้ให้บริบาลและยอมรับผลทางการแพทย์ ดังต่อไปนี้', content: [
                                        '3.1 ผู้ให้บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพที่ได้ปฏิบัติหน้าที่ตามมาตรฐานและ จริยธรรม ย่อมได้รับความคุ้มครอง ตามที่กฎหมายกำหนดและมีสิทธิได้รับความคุ้มครองจากการถูกกล่าวหาโดยไม่เป็นธรรม',
                                        '3.2 การแพทย์ในที่นี้หมายถึงการแพทย์แผนปัจจุบันซึ่งได้รับการพิสูจน์ทางวิทยาศาสตร์ โดยองค์ความรู้ในขณะนั้นว่ามี ประโยชน์มากกว่าโทษสำหรับผู้ป่วย',
                                        '3.3 การแพทย์ไม่สามารถให้การวินิจฉัย ป้องกัน หรือรักษาให้หายได้ทุกโรคหรือทุกสภาวะ',
                                        '3.4 การรักษาพยาบาลทุกชนิดมีความเสี่ยงที่จะเกิดผลอันไม่พึงประสงค์ได้ นอกจากนี้เหตุสุดวิสัยอาจเกิดขึ้นได้แม้ผู้ให้ บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพจะใช้ความระมัดระวังอย่างเพียงพอตามภาวะวิสัยและพฤติการณ์ในการ รักษาพยาบาลนั้นๆ แล้ว',
                                        '3.5 การตรวจเพื่อการคัดกรอง วินิจฉัย และติดตามการรักษาโรค อาจให้ผลที่คลาดเคลื่อนได้ด้วยข้อจำกัดของเทคโนโลยีที่ ใช้และปัจจัยแวดล้อมอื่นๆ ที่ไม่สามารถควบคุมได้ตามมาตรฐานการปฏิบัติงาน',
                                        '3.6 ผู้ให้บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพมีสิทธิใช้ดุลพินิจในการเลือกกระบวนการรักษาพยาบาลตามหลัก วิชาการทางการแพทย์ตามความสามารถและข้อจำกัด ตามภาวะวิสัยและพฤติการณ์ที่มีอยู่รวมทั้งการปรึกษาหรือส่ง ต่อโดยคำนึงถึงสิทธิและประโยชน์โดยรวมของผู้ป่วยหรือผู้รับบริบาล',
                                        '3.7. เพื่อประโยชน์ต่อตัวผู้ป่วยหรือผู้รับบริบาลผู้ให้บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพอาจให้ คำแนะนำ หรือส่งต่อ ผู้ป่วยหรือผู้รับบริบาลให้ได้รับการรักษาตามความเหมาะสม ทั้งนี้ผู้ป่วยต้องไม่อยู่ในสภาวะฉุกเฉินอันจำเป็นเร่งด่วน และเป็นอันตรายต่อชีวิต',
                                        '3.8 การปกปิดข้อมูลด้านสุขภาพ และข้อเท็จจริงต่างๆ ทางการแพทย์ของผู้ป่วยหรือผู้รับบริบาลต่อผู้ให้บริบาลหรือผู้ ประกอบวิชาชีพด้านสุขภาพอาจส่งผลเสียต่อกระบวนการรักษาพยาบาล',
                                    ]
                                },
                                {
                                    id: '4', title: 'ทรัพย์สินทางปัญญา', content: [
                                        '4.1 การใช้บริการนี้ ไม่ก่อให้ผู้รับบริบาลเกิดความเป็นเจ้าของในทรัพย์สินทางปัญญาใดที่เกิดขึ้น แต่อย่างใด',
                                        '4.2 บริษัท โรงพยาบาลพระรามเก้า จำกัด (มหาชน) เป็นเจ้าของในกรรมสิทธิ์ของทรัพย์สินทางปัญญาทั้งหมดที่เกิดจากการให้บริการนี้แต่ผู้เดียว',
                                        '4.3 การทำวิศวกรรมย้อนกลับ ถอดรหัส หรือปลดล็อก ส่วนต่างๆ ในเว็บไซต์ หรือกระทำการใดๆเพื่อให้ได้มาซึ่งแหล่งที่มา (Source code) ของบริการหรือเนื้อหาในบริการนี้ ถือเป็นความผิดกฎหมายและผิดสัญญา',
                                    ]
                                },
                                { id: '5', title: 'การปฏิเสธความรับผิด', content: 'เป็นที่เข้าใจตรงกันว่า "โทรเวช” หรือ “การแพทย์ทางไกล" (Telemedicine) เป็นการให้บริบาลเพื่ออำนวยความสะดวกแก่ ผู้รับบริบาลที่มีอาการเจ็บป่วยเล็กน้อย ที่ไม่จำเป็นต้องได้รับการตรวจวินิจฉัยอย่างใกล้ชิดจากแพทย์หรือจำเป็นต้องใช้ เวชภัณฑ์หรือเครื่องมือทางการแพทย์ในการตรวจและบริบาล ผู้รับบริบาลทราบดีว่าการรับบริการนี้ สัญญาณเชื่อมต่อทาง ภาพ เสียง หรือข้อมูลที่ให้คำปรึกษานั้นอาจเกิดความล่าช้า ความไม่เหมาะสมหรือไม่สมบูรณ์ หรือล้มเหลวในการส่งผ่าน หรือการสื่อสารเนื้อหาทางการแพทย์ และอาจส่งผลต่อความสำเร็จของการบริบาล จึงไม่มีการรับผิดชอบต่อผลของการ บริบาลแต่อย่างใด รวมถึงไม่มีการรับประกันการสูญหายการโจรกรรมการส่งข้อมูลผ่านทางอินเตอร์เน็ตแต่อย่างใด' },
                                { id: '6', title: 'การชดใช้ค่าเสียหาย', content: 'ผู้รับบริบาลจะปกป้องการเข้าถึงข้อมูลต่างๆจากการเข้าใช้เว็บไซต์ หรือแอพลิเคชัน (Application)ที่ใช้ในการเข้ารับบริการนี้ การละเมิดความลับหรือสิทธิของบุคคล ไม่ว่าจะเกิดขึ้นด้วยความจงใจหรือประมาทเลินเล่อ หรือจากการทำผิดข้อกำหนดนี้ ผู้ให้บริบาลและสถานพยาบาลสามารถเรียกร้องค่าเสียหายได้' },
                                { id: '7', title: 'เหตุสุดวิสัย', content: '“เหตุสุดวิสัย” หมายถึง เหตุการณ์ซึ่งเกิดขึ้นนอกเหนือจากการควบคุมที่เหมาะสม ของฝ่ายที่ประสบเหตุสุดวิสัยดังกล่าว ซึ่ง ส่งผลให้ฝ่ายนั้นไม่สามารถที่จะป้องกันหรือดำเนินการใดๆ ตามข้อกำหนดและเงื่อนไขนี้ได้ เหตุการณ์ดังกล่าวรวมถึงการ ใดๆ ที่ส่งผลให้ไม่สามารถดำเนินอุตสาหกรรมต่อได้ หรือข้อพิพาทแรงงาน เหตุการณ์ไม่สงบ สงคราม หรือภัยคุกคามจาก สงคราม หรือการก่อการร้าย การเปลี่ยนแปลงแนวปฏิบัติหรือกฎเกณฑ์ของหน่วยงานราชการ การเชื่อมต่อทางโทรคมนาคม หรือสาธารณูปโภคล้มเหลว พลังงานขาดแคลน ไฟไหม้ การระเบิด ภัยธรรมชาติ และโรคระบาด และฝ่ายที่ประสบเหตุ สุดวิสัยไม่ต้องรับผิดชอบต่อหน้าที่ที่ต้องปฏิบัติแต่อย่างใด ทั้งนี้ต้องปฏิบัติหน้าที่นั้นเมื่อเหตุสุดวิสัยได้สิ้นสุดลง' },
                                { id: '8', title: 'การเปลี่ยนแปลงข้อกำหนดและเงื่อนไข', content: 'ข้อกำหนดนี้ อาจเปลี่ยนแปลงแก้ไขโดยผู้ให้บริบาลและสถานพยาบาลโดยไม่ต้องมีการแจ้งล่วงหน้า การแก้ไขเปลี่ยนแปลง ข้อกำหนดดังกล่าวมีผลใช้บังคับในวันที่ได้มีการแสดงบนเว็บไซต์ฯ เว้นแต่จะระบุไว้เป็นอย่างอื่น การเข้ารับบริการนี้ ถือเป็น การตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่เปลี่ยนแปลงดังกล่าว และการแก้ไขหรือเปลี่ยนแปลงใดๆ เป็นการลบล้าง ข้อกำหนดและเงื่อนไขก่อนหน้านี้ทั้งหมดแต่ไม่มีผลย้อนหลังต่อข้อกำหนดเดิมที่ได้ปฏิบัติต่อกันมาแล้วแต่อย่างใด' },
                                {
                                    id: '9', title: 'ความสมบูรณ์ของข้อกำหนด', content: [
                                        'หากข้อความใดในข้อกำหนดนี้ขัดต่อ ศีลธรรมอันดีหรือขัดต่อกฎหมาย และตกเป็นโมฆะ หรือใช้บังคับไม่ได้ ให้ถือว่าเฉพาะข้อความดังกล่าวนั้นเสียไปและให้ข้อกำหนดส่วนที่เหลือยังมีผลใช้บังคับต่อไปภายใต้กฎหมายไทย',
                                        'การสละสิทธิใดๆ ทางกฎหมายของผู้ให้บริบาลหรือสถานพยาบาล ภายใต้ข้อกำหนดนี้ จะมีผลสมบูรณ์เมื่อ ได้กระทำเป็นลายลักษณ์อักษรแล้วเท่านั้นซึ่งไม่รวมถึงทางเว็บไซต์หรือทางแอพพลิเคชั่นหรือทางอินเทอร์เน็ตแต่อย่างใด',
                                    ]
                                },

                            ].map((section) => (
                                <Paper
                                    key={section.id}
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {section.id}. {section.title}
                                    </Typography>
                                    {activeSection === section.id && (
                                        <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                                            {Array.isArray(section.content) ? (
                                                section.content.map((content: string) => (
                                                    <p key={content}>&emsp;{content}</p>
                                                ))
                                            ) : (
                                                <p>&emsp;{section.content}</p>
                                            )}
                                        </Typography>
                                    )}
                                </Paper>
                            ))}
                        </Box>
                        {/* Consent Checkboxes */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                10. การคุ้มครองข้อมูลส่วนบุคคล
                            </Typography>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend">10.1 การให้ความยินยอมรับการรักษาข้าพเจ้าได้รับทราบคำประกาศสิทธิและข้อพึงปฏิบัติของผู้ป่วย และทราบว่าข้าพเจ้า มีสิทธิที่ซักถามข้อสงสัยเกี่ยวกับการรักษาและสิทธิที่จะรับรู้วิธีการตรวจการรักษาทางเลือกอื่นๆรวมทั้งอาการไม่พึง ประสงค์หรือภาวะแทรกซ้อนซึ่งอาจเกิดขึ้นได้ ข้าพเจ้า ...... ให้คณะแพทย์ ทันตแพทย์ และบุคลากรทางการแพทย์ของโรงพยาบาลพระรามเก้า ทำการตรวจวินิจฉัยและให้การรักษาแบบผู้ป่วยนอก ตามหลักวิชาการแพทย์ที่เหมาะสม</FormLabel>
                                <RadioGroup
                                    value={data.consent_1}
                                    onChange={(e) => setData('consent_1', e.target.value)}
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="ยินยอม" />
                                    <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" />
                                </RadioGroup>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend">10.2 การเก็บรวมรวมข้อมูลส่วนบุคคล</FormLabel>
                                <RadioGroup
                                    value={data.consent_2}
                                    onChange={(e) => setData('consent_2', e.target.value)}
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="ยินยอม" />
                                    <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" />
                                </RadioGroup>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend">10.3 ข้าพเจ้ายินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลของข้าพเจ้า</FormLabel>
                                <RadioGroup
                                    value={data.consent_3}
                                    onChange={(e) => setData('consent_3', e.target.value)}
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="ยินยอม" />
                                    <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" />
                                </RadioGroup>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend">10.4 ข้าพเจ้ายินยอมให้ดำเนินการตามข้อกำหนด การให้บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์</FormLabel>
                                <RadioGroup
                                    value={data.consent_4}
                                    onChange={(e) => setData('consent_4', e.target.value)}
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="ยินยอม" />
                                    <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* Signature Section */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ลายมือชื่อ
                            </Typography>
                            <TextField
                                fullWidth
                                label="ชื่อ-นามสกุล"
                                value={data.signature_name}
                                onChange={(e) => setData('signature_name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Paper
                                sx={
                                    {
                                        p: 2,
                                    }
                                }>
                                <SignaturePad
                                    ref={sigPadRef}
                                    canvasProps={{
                                        className: "sigCanvas rounded border border-2",
                                        width: 400,
                                        height: 150,
                                    }}
                                    onEnd={handleEnd}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleClear}
                                    sx={{ mr: 2 }}
                                >
                                    ล้างลายมือชื่อ
                                </Button>
                            </Paper>
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                                {processing ? 'กำลังส่ง...' : 'ยืนยันการให้ความยินยอม'}
                            </Button>
                        </Box>
                    </Paper>
                </form>
            </motion.div>
        </AppLayout>
    );
}
