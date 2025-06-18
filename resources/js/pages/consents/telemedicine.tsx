import AppLayout from "@/layouts/patient";
import { Head, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import SignaturePad from "react-signature-canvas";
import { useRef, useState, useEffect } from "react";
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
        treatment_consent: string;
        insurance_consent: string;
        benefit_consent: string;
    }
}

export default function ConsentTelemedicine({ patient }: ConsentTelemedicineProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        type: "Telemedicine",
        witness_user_id1: params.get('witness1_user_id'),
        witness_user_id2: params.get('witness2_user_id'),
        informer_user_id: params.get('informer_user_id'),
        hn: patient.hn,
        signature: "",
        signature_name: "",
        signature_type: "patient",
        telemedicine_consent: "",
        treatment_consent: patient.treatment_consent,
        insurance_consent: patient.insurance_consent,
        benefit_consent: patient.benefit_consent,
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

        if (data.telemedicine_consent === "" || data.treatment_consent === "" || data.insurance_consent === "" || data.benefit_consent === "") {
            Swal.fire({
                icon: "warning",
                title: "โปรดระบุความยินยอมให้ครบ",
            });
            return;
        }

        if (data.telemedicine_consent === "no" || data.treatment_consent === "no") {
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
                            <img src="/images/logo.png" alt="logo" width={100} />
                            <Box >
                                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    ข้อกำหนดและการให้ความยินยอมรับบริการ
                                </Typography>
                                <Typography variant="h5" gutterBottom sx={{ color: 'text.secondary' }}>
                                    การแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
                                    Praram 9 Hospital Public Company Limited
                                </Typography>
                            </Box>
                        </Box>
                        <Alert severity="info" sx={{ mb: 4 }}>
                            กรุณาอ่านข้อกำหนดทั้งหมดและให้ความยินยอมตามที่ระบุ
                        </Alert>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
                            &emsp;บริการ การแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ นี้ เป็นการให้บริการทางการแพทย์โดยการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมด้วยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา คำแนะนำ แก่ผู้รับบริการหรือผู้รับบริบาล ซึ่งอยู่ต่างสถานที่กัน เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรมตามภาวะ วิสัย และพฤติการณ์ที่เป็นอยู่ขณะที่ให้บริการ การแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“โทรเวช”</b> หรือ <b className="font-bold">“การแพทย์ทางไกล” (telemedicine)</b> หมายความว่า
                            เป็นการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมทั้งจากสถานพยาบาลภาครัฐและ/หรือเอกชน
                            จากสถานที่หนึ่งไปยังอีกสถานที่หนึ่งโดยอาศัยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา คำแนะนำ แก่ผู้ประกอบวิชาชีพเวชกรรม
                            หรือบุคคลอื่นใด เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรม ตามภาวะวิสัย และพฤติการณ์ที่เป็นอยู่
                            โดยความยินยอมร่วมกันของผู้ให้บริบาลและผู้รับบริบาลในขณะนั้น ทั้งนี้โดยความรับผิดชอบของผู้ส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์นั้นๆ
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“สถานพยาบาล”</b> หมายความว่า สถานพยาบาลที่เป็นของภาครัฐและ/หรือเอกชน ที่จัดตั้งขึ้นตามกฎหมายที่เกี่ยวข้อง
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“การให้บริบาลผ่านระบบบริบาลโทรเวช หรือ บริบาลการแพทย์ทางไกล”</b> หมายความว่า
                            การดำเนินการโดย “โทรเวช” หรือ “การแพทย์ทางไกล”
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“ผู้ให้บริบาล”</b> หมายความว่า ผู้ประกอบวิชาชีพเวชกรรมที่ให้บริบาลโดยโทรเวช หรือ การแพทย์ทางไกล (telemedicine)
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“ผู้รับบริบาล”</b> หมายความว่า บุคคลที่ได้รับ “โทรเวช” หรือ “การแพทย์ทางไกล” (telemedicine)
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“คลินิกออนไลน์”</b> หมายถึง สถานพยาบาลตามที่กฎหมายกำหนด
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;<b className="font-bold">“การบริบาล”</b> หมายความว่า กระบวนการเพื่อผลแห่ง “โทรเวช” หรือ การแพทย์ทางไกล" (telemedicine)
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }} >
                            &emsp;การตกลงใช้บริการ ทางการแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์นี้ ถือว่าผู้รับบริบาลได้อ่านข้อกำหนดเข้าใจดีแล้ว
                            และยินยอมปฏิบัติตามข้อกำหนด รวมถึงข้อควรปฏิบัติต่างๆที่เกี่ยวข้องกับข้อกำหนดนี้
                        </Typography>
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
                                { id: '5', title: 'การปฏิเสธความรับผิด', content: 'เป็นที่เข้าใจตรงกันว่า "โทรเวช" หรือ "การแพทย์ทางไกล" (Telemedicine) เป็นการให้บริบาลเพื่ออำนวยความสะดวกแก่ ผู้รับบริบาลที่มีอาการเจ็บป่วยเล็กน้อย ที่ไม่จำเป็นต้องได้รับการตรวจวินิจฉัยอย่างใกล้ชิดจากแพทย์หรือจำเป็นต้องใช้ เวชภัณฑ์หรือเครื่องมือทางการแพทย์ในการตรวจและบริบาล ผู้รับบริบาลทราบดีว่าการรับบริการนี้ สัญญาณเชื่อมต่อทาง ภาพ เสียง หรือข้อมูลที่ให้คำปรึกษานั้นอาจเกิดความล่าช้า ความไม่เหมาะสมหรือไม่สมบูรณ์ หรือล้มเหลวในการส่งผ่าน หรือการสื่อสารเนื้อหาทางการแพทย์ และอาจส่งผลต่อความสำเร็จของการบริบาล จึงไม่มีการรับผิดชอบต่อผลของการ บริบาลแต่อย่างใด รวมถึงไม่มีการรับประกันการสูญหายการโจรกรรมการส่งข้อมูลผ่านทางอินเตอร์เน็ตแต่อย่างใด' },
                                { id: '6', title: 'การชดใช้ค่าเสียหาย', content: 'ผู้รับบริบาลจะปกป้องการเข้าถึงข้อมูลต่างๆจากการเข้าใช้เว็บไซต์ หรือแอพลิเคชัน (Application)ที่ใช้ในการเข้ารับบริการนี้ การละเมิดความลับหรือสิทธิของบุคคล ไม่ว่าจะเกิดขึ้นด้วยความจงใจหรือประมาทเลินเล่อ หรือจากการทำผิดข้อกำหนดนี้ ผู้ให้บริบาลและสถานพยาบาลสามารถเรียกร้องค่าเสียหายได้' },
                                { id: '7', title: 'เหตุสุดวิสัย', content: '“เหตุสุดวิสัย" หมายถึง เหตุการณ์ซึ่งเกิดขึ้นนอกเหนือจากการควบคุมที่เหมาะสม ของฝ่ายที่ประสบเหตุสุดวิสัยดังกล่าว ซึ่ง ส่งผลให้ฝ่ายนั้นไม่สามารถที่จะป้องกันหรือดำเนินการใดๆ ตามข้อกำหนดและเงื่อนไขนี้ได้ เหตุการณ์ดังกล่าวรวมถึงการ ใดๆ ที่ส่งผลให้ไม่สามารถดำเนินอุตสาหกรรมต่อได้ หรือข้อพิพาทแรงงาน เหตุการณ์ไม่สงบ สงคราม หรือภัยคุกคามจาก สงคราม หรือการก่อการร้าย การเปลี่ยนแปลงแนวปฏิบัติหรือกฎเกณฑ์ของหน่วยงานราชการ การเชื่อมต่อทางโทรคมนาคม หรือสาธารณูปโภคล้มเหลว พลังงานขาดแคลน ไฟไหม้ การระเบิด ภัยธรรมชาติ และโรคระบาด และฝ่ายที่ประสบเหตุ สุดวิสัยไม่ต้องรับผิดชอบต่อหน้าที่ที่ต้องปฏิบัติแต่อย่างใด ทั้งนี้ต้องปฏิบัติหน้าที่นั้นเมื่อเหตุสุดวิสัยได้สิ้นสุดลง' },
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
                                    <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                                        {Array.isArray(section.content) ? (
                                            section.content.map((content: string) => (
                                                <span key={content}>&emsp;{content}</span>
                                            ))
                                        ) : (
                                            <span>&emsp;{section.content}</span>
                                        )}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                        {/* Consent Checkboxes */}
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                mb: 2,
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    10. การคุ้มครองข้อมูลส่วนบุคคล
                                </Typography>
                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">&emsp;10.1 การให้ความยินยอมรับการรักษาข้าพเจ้าได้รับทราบคำประกาศสิทธิและข้อพึงปฏิบัติของผู้ป่วย และทราบว่าข้าพเจ้า มีสิทธิที่ซักถามข้อสงสัยเกี่ยวกับการรักษาและสิทธิที่จะรับรู้วิธีการตรวจการรักษาทางเลือกอื่นๆรวมทั้งอาการไม่พึง ประสงค์หรือภาวะแทรกซ้อนซึ่งอาจเกิดขึ้นได้ ข้าพเจ้า ...... ให้คณะแพทย์ ทันตแพทย์ และบุคลากรทางการแพทย์ของโรงพยาบาลพระรามเก้า ทำการตรวจวินิจฉัยและให้การรักษาแบบผู้ป่วยนอก ตามหลักวิชาการแพทย์ที่เหมาะสม</FormLabel>
                                    <RadioGroup
                                        value={data.treatment_consent}
                                        onChange={(e) => setData('treatment_consent', e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="ยินยอมโดยสมัครใจ" disabled={!!patient.treatment_consent} />
                                        <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" disabled={!!patient.treatment_consent} />
                                    </RadioGroup>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">
                                        <p>&emsp;10.2 การเก็บรวมรวมข้อมูลส่วนบุคคลเมื่อข้าพเจ้าลงนามในเอกสารฉบับนี้ ข้าพเจ้ายืนยันว่าได้อ่านและรับทราบนโยบายคุ้มครองข้อมูลส่วนบุคคลของ โรงพยาบาลพระรามเก้า รายละเอียดปรากฏตามเอกสารแนบครบถ้วนแล้ว ซึ่งนโยบายคุ้มครองข้อมูลส่วนบุคคล ดังกล่าว อธิบายถึงวิธีการที่โรงพยาบาลพระรามเก้าจะทำการเก็บ รวบรวม ใช้ เปิดเผย และส่งหรือโอนข้อมูลส่วน บุคคลใด ๆ ของข้าพเจ้า ข้าพเจ้ารับทราบและยืนยันว่าโรงพยาบาลพระรามเก้าสามารถอาศัยฐานทางกฎหมายอื่นใน การทำการเก็บ รวบรวม ใช้ เปิดเผย และส่งหรือโอนข้อมูลส่วนบุคคลใด ๆ ของข้าพเจ้าได้ โดยไม่ต้องอาศัยความ ยินยอมอย่างชัดแจ้ง ทั้งนี้ เป็นไปตามที่กฎหมายกำหนด เพื่อ</p>
                                        <p>&emsp;&emsp;(1) วัตถุประสงค์ใดซึ่งระบุไว้ในนโยบายคุ้มครองข้อมูลส่วนบุคคลของโรงพยาบาลพระรามเก้า และ/หรือเพื่อ ประโยชน์ของข้าพเจ้า</p>
                                        <p>&emsp;&emsp;(2) ปฏิบัติให้เป็นไปตามบทบัญญัติของกฎหมายที่เกี่ยวข้อง รวมถึงเพื่อเวชศาสตร์ป้องกันหรืออาชีวเวชศาสตร์ การประเมินความสามารถในการทำงาน ของลูกจ้าง การวินิจฉัยโรคทางการแพทย์ การให้บริการด้านสุขภาพ หรือด้านสังคม การรักษาทางการแพทย์การจัดการด้านสุขภาพ หรือระบบและการให้บริการด้านสังคม สงเคราะห์ ประโยชน์สาธารณะด้านการสาธารณสุข เช่น การป้องกันด้านสุขภาพจากโรคติดต่ออันตรายหรือ การควบคุมมาตรฐานหรือคุณภาพของยา เวชภัณฑ์ หรือเครื่องมือแพทย์ การคุ้มครองแรงงาน การ ประกันสังคม หลักประกันสุขภาพแห่งชาติ สวัสดิการเกี่ยวกับการรักษาพยาบาลของผู้มีสิทธิตามกฎหมาย การคุ้มครองผู้ประสบภัยจากรถ หรือการคุ้มครองทางสังคม การศึกษาวิจัยทางวิทยาศาสตร์ประวัติศาสตร์ หรือสถิติ ประโยชน์สาธารณะที่สำคัญอื่น ๆ</p>
                                    </FormLabel>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">&emsp;10.3 การเก็บรวมรวมข้อมูลส่วนบุคคลเพื่อนำส่งบริษัทประกันภัย บริษัทคู่สัญญา หรือบริษัทต้นสังกัดเพื่อประโยชน์ผู้ป่วย(หากมี) ข้าพเจ้า ...... ให้โรงพยาบาลพระรามเก้ารวบรวม ใช้ เปิดเผยข้อมูลส่วน บุคคล ในการเข้ารับการตรวจ การวินิจฉัย การรักษาพยาบาลหรือการให้บริการสุขภาพ รวมถึงรายละเอียดค่า รักษาพยาบาล ค่าใช้จ่ายที่เกิดขึ้น ของข้าพเจ้าทั้งหมดได้ตามความเป็นจริง เพื่อการพิจารณาการจ่ายค่าสินไหม ทดแทน ค่าชดเชย ค่าตรวจวินิจฉัยและรักษาพยาบาล ค่าใช้จ่ายใด ๆ ที่เกิดขึ้นจากการเข้ารับการรักษาพยาบาลของ ข้าพเจ้าทั้งหมด (รวมเรียกว่า "ค่ารักษาพยาบาล") ให้แก่ บริษัทประกันภัย/บริษัทคู่สัญญา/บริษัทต้นสังกัด/บุคคลหรือ นิติบุคคลที่ต้องชำระค่ารักษาพยาบาลของข้าพเจ้า และในกรณีที่บริษัทประกันภัย/บริษัทคู่สัญญา/บริษัทต้นสังกัด/ บุคคลหรือนิติบุคคลที่ต้องชำระค่ารักษาพยาบาลฯ ปฏิเสธการจ่ายชดเชยค่ารักษาพยาบาลของข้าพเจ้า ข้าพเจ้าเป็น ผู้รับผิดชอบชำระค่าใช้จ่ายที่เกิดขึ้นให้กับโรงพยาบาลพระรามเก้า โดยไม่มีเงื่อนไข</FormLabel>
                                    <RadioGroup
                                        value={data.insurance_consent}
                                        onChange={(e) => setData('insurance_consent', e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="ยินยอมโดยสมัครใจ" disabled={!!patient.insurance_consent} />
                                        <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" disabled={!!patient.insurance_consent} />
                                    </RadioGroup>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">&emsp;10.4 การเก็บรวมรวมข้อมูลส่วนบุคคลเพื่อการแจ้งสิทธิประโยชน์ทางการแพทย์ ข้าพเจ้า ...... ให้โรงพยาบาลพระรามเก้าใช้ข้อมูลส่วนบุคคล เพื่อแจ้งสิทธิ ประโยชน์ทางการแพทย์และส่งเสริม การขายการตลาด รายการผลิตภัณฑ์และบริการ รวมถึงสามารถส่งข้อมูล ข่าวสารดังกล่าว หรือส่งแบบสอบถามเพื่อการประเมินผลการให้บริการของบริษัท ให้กับข้าพเจ้าได้ ซึ่งข้าพเจ้า สามารถยกเลิกความยินยอมในการรับแจ้งข้อมูลข่าวสารได้ตามช่องทางที่โรงพยาบาลพระรามเก้ากำหนด</FormLabel>
                                    <RadioGroup
                                        value={data.benefit_consent}
                                        onChange={(e) => setData('benefit_consent', e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="ยินยอมโดยสมัครใจ" disabled={!!patient.benefit_consent} />
                                        <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" disabled={!!patient.benefit_consent} />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Paper>
                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <FormLabel component="legend" sx={{ fontWeight: 600, color: 'black' }}>ข้าพเจ้าได้อ่านข้อกำหนด การให้บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ เข้าใจและยอมรับเงื่อนไขตาม ข้อกำหนดนี้</FormLabel>
                            <RadioGroup
                                value={data.telemedicine_consent}
                                onChange={(e) => setData('telemedicine_consent', e.target.value)}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="ยินยอม" />
                                <FormControlLabel value="no" control={<Radio />} label="ไม่ยินยอม" />
                            </RadioGroup>
                        </FormControl>
                        {/* Signature Section */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ผู้ลงนามความยินยอม
                            </Typography>
                            <TextField
                                fullWidth
                                label="ชื่อ-นามสกุล"
                                value={data.signature_name}
                                onChange={(e) => setData('signature_name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ประเภทผู้ลงนาม
                            </Typography>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend">กรุณาระบุประเภทผู้ลงนาม</FormLabel>
                                <RadioGroup
                                    value={data.signature_type}
                                    onChange={(e) => setData('signature_type', e.target.value)}
                                >
                                    <FormControlLabel value="patient" control={<Radio />} label="ผู้ป่วย" />
                                    <FormControlLabel value="representative" control={<Radio />} label="ผู้แทนผู้ป่วย" />
                                </RadioGroup>
                            </FormControl>
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
                        </Box>
                        {/* Submit Button */}
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
                                {processing ? 'กำลังส่ง...' : 'ยืนยันการให้ความยินยอม'}
                            </Button>
                        </Box>
                    </Paper>
                </form>
            </motion.div>
        </AppLayout>
    );
}
