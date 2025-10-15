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
        name: string;
        treatment_consent: string;
        insurance_consent: string;
        marketing_consent: string;
        lang?: string;
    }
}

export default function ConsentTelemedicine({ patient }: ConsentTelemedicineProps) {
    const page = usePage();
    const url = page.props.url as string;
    const params = new URLSearchParams(window.location.search);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        type: "Telemedicine",
        data: params.get('data'),
        hn: patient.hn,
        signature: "",
        signature_name: patient.name,
        signature_type: "patient",
        signature_relation: "",
        telemedicine_consent: "",
        treatment_consent: patient.treatment_consent,
        insurance_consent: patient.insurance_consent,
        marketing_consent: patient.marketing_consent,
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

        if (data.telemedicine_consent === "" || data.treatment_consent === "" || data.insurance_consent === "" || data.marketing_consent === "") {
            Swal.fire({
                icon: "warning",
                title: t.alert_missing_consent_title,
            });
            return;
        }

        if (data.telemedicine_consent === "no" || data.treatment_consent === "no") {
            Swal.fire({
                icon: "warning",
                title: t.alert_consent_required_title,
                html: t.alert_consent_required_html,
            });
            return;
        }

        if (!data.signature || data.signature_name === "") {
            Swal.fire({
                icon: "warning",
                title: t.alert_signature_title,
                text: t.alert_signature_text,
            });
            return;
        }

        const result = await Swal.fire({
            title: t.confirm_sign_title,
            text: t.confirm_sign_text,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: t.confirm_button_text,
            cancelButtonText: t.cancel_button_text,
        });

        if (result.isConfirmed) {
            post(`${url}/telemedicine`);
        }
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const lang = patient.lang || 'th';
    const translations = {
        th: {
            title: "ข้อกำหนดและการให้ความยินยอมรับบริการ",
            sub_title: "การแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์",
            read_consent: "กรุณาอ่านข้อกำหนดทั้งหมดและให้ความยินยอมตามที่ระบุ",
            definitions: [
                "บริการ การแพทย์ทางไกลหรือโทรเวช (<b>Telemedicine</b>) และคลินิกออนไลน์ นี้ เป็นการให้บริการทางการแพทย์โดยการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมด้วยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา คำแนะนำ แก่ผู้รับบริการหรือผู้รับบริบาล ซึ่งอยู่ต่างสถานที่กัน เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรมตามภาวะ วิสัย และพฤติการณ์ที่เป็นอยู่ขณะที่ให้บริการ การแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์",
                "<b>“โทรเวช”</b> หรือ <b >“การแพทย์ทางไกล” (telemedicine)</b> หมายความว่าเป็นการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมทั้งจากสถานพยาบาลภาครัฐและ/หรือเอกชนจากสถานที่หนึ่งไปยังอีกสถานที่หนึ่งโดยอาศัยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา คำแนะนำ แก่ผู้ประกอบวิชาชีพเวชกรรมหรือบุคคลอื่นใด เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรม ตามภาวะวิสัย และพฤติการณ์ที่เป็นอยู่โดยความยินยอมร่วมกันของผู้ให้บริบาลและผู้รับบริบาลในขณะนั้น ทั้งนี้โดยความรับผิดชอบของผู้ส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์นั้นๆ",
                "<b>“สถานพยาบาล”</b> หมายความว่า สถานพยาบาลที่เป็นของภาครัฐและ/หรือเอกชน ที่จัดตั้งขึ้นตามกฎหมายที่เกี่ยวข้อง",
                "<b>“การให้บริบาลผ่านระบบบริบาลโทรเวช หรือ บริบาลการแพทย์ทางไกล”</b> หมายความว่า",
                "การดำเนินการโดย “โทรเวช” หรือ “การแพทย์ทางไกล”",
                "<b>“ผู้ให้บริบาล”</b> หมายความว่า ผู้ประกอบวิชาชีพเวชกรรมที่ให้บริบาลโดยโทรเวช หรือ การแพทย์ทางไกล (telemedicine)",
                "<b>“ผู้รับบริบาล”</b> หมายความว่า บุคคลที่ได้รับ “โทรเวช” หรือ “การแพทย์ทางไกล” (telemedicine)",
                "<b>“คลินิกออนไลน์”</b> หมายถึง สถานพยาบาลตามที่กฎหมายกำหนด",
                "<b>“การบริบาล”</b> หมายความว่า กระบวนการเพื่อผลแห่ง “โทรเวช” หรือ การแพทย์ทางไกล\" (telemedicine)",
                "การตกลงใช้บริการ ทางการแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์นี้ ถือว่าผู้รับบริบาลได้อ่านข้อกำหนดเข้าใจดีแล้ว และยินยอมปฏิบัติตามข้อกำหนด รวมถึงข้อควรปฏิบัติต่างๆที่เกี่ยวข้องกับข้อกำหนดนี้",
            ],
            sections: [
                {
                    id: '1',
                    title: 'บริการ',
                    content: [
                        '1.1 บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ ให้บริการผ่านเว็บไซต์ (Website) หรือแอพลิเคชัน (Application) ซึ่งประกอบด้วยบริการต่างๆ และข้อพึงระวังดังต่อไปนี้',
                        '(ก) บริการทางการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ นี้ไม่เหมาะ ต่อผู้รับบริบาลที่มีอาการ เจ็บป่วยรุนแรงเฉียบพลัน อาการสาหัส หรืออยู่ในอาการที่ต้องได้รับการรักษาพยาบาลโดยเร่งด่วน ซึ่งกรณีดังกล่าว ควรรีบขอความ ช่วยเหลือจากโรงพยาบาล หน่วยรถพยาบาลฉุกเฉิน รวมถึงไม่เหมาะกับผู้ที่ไม่สามารถช่วยเหลือตนเองได้ และผู้ที่ยังไม่บรรลุนิติภาวะ',
                        '(ข) บริการจัดส่งยาตามคำสั่งของแพทย์ ไปยังภูมิลำเนาของท่าน',
                        '(ค) บริการ จัดส่งทีมงานทางการแพทย์ เพื่อเก็บตัวอย่าง ณ ภูมิลำเนาของท่าน เพื่อนำกลับมาตรวจวิเคราะห์ทาง ห้องปฏิบัติการทางการแพทย์เกี่ยวกับโรคทั่วไป หรือเพื่อการตรวจวินิจฉัยอาการเบื้องต้น',
                        '(ง) บริการอื่นๆ',
                        '1.2 การออกใบรับรองแพทย์ขึ้นอยู่กับดุลยพินิจของแพทย์ผู้ให้บริบาลแต่เพียงผู้เดียว หรือจากการพิจารณาการยืนยันตัวตน ของผู้รับบริบาล จากระบบการให้บริบาลผ่านระบบบริบาลโทรเวช หรือบริบาลการแพทย์ทางไกล (Telemedicine) ภายใต้มาตรฐานด้านสารสนเทศ ที่หน่วยงานรับผิดชอบที่กำกับดูแลเรื่องการยืนยันตัวบุคคลของรัฐเป็นผู้กำหนด',
                    ]
                },
                {
                    id: '2',
                    title: 'หน้าที่ของผู้รับบริบาล',
                    content: [
                        '2.1 ต้องให้ข้อมูลต่างๆ ของผู้รับบริบาล รวมถึงข้อมูลส่วนบุคคล เช่น เลขบัตรประชาชน สถานที่ติดต่อ ผู้ที่สามารถ ติดต่อได้ในกรณีฉุกเฉิน เบอร์ติดต่อของผู้รับบริบาลและผู้เกี่ยวข้อง และ/หรือ ข้อมูลสุขภาพทั่วไปและที่จำเป็น',
                        '2.2 ผู้รับบริบาลรับรองว่าข้อมูลต่างๆ ที่ได้ให้ไว้สำหรับการรับบริบาลนี้เป็นความจริงทั้งสิ้น',
                        '2.3 ผู้รับบริบาลจะไม่ใช้บริการนี้เพื่อวัตถุประสงค์ที่ขัดต่อกฎหมาย และจะปฏิบัติตามกฎหมายหรือกฎระเบียบต่างๆ',
                        '2.4 การชำระเงินการเข้ารับบริการนี้ ให้เป็นไปตามข้อตกลงที่กำหนดไว้',
                    ]
                },
                {
                    id: '3',
                    title: 'ผู้รับบริบาลรับทราบข้อเท็จจริงและเคารพในดุลพินิจของผู้ให้บริบาลและยอมรับผลทางการแพทย์ ดังต่อไปนี้',
                    content: [
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
                    id: '4',
                    title: 'ทรัพย์สินทางปัญญา',
                    content: [
                        '4.1 การใช้บริการนี้ ไม่ก่อให้ผู้รับบริบาลเกิดความเป็นเจ้าของในทรัพย์สินทางปัญญาใดที่เกิดขึ้น แต่อย่างใด',
                        '4.2 บริษัท โรงพยาบาลพระรามเก้า จำกัด (มหาชน) เป็นเจ้าของในกรรมสิทธิ์ของทรัพย์สินทางปัญญาทั้งหมดที่เกิดจากการให้บริการนี้แต่ผู้เดียว',
                        '4.3 การทำวิศวกรรมย้อนกลับ ถอดรหัส หรือปลดล็อก ส่วนต่างๆ ในเว็บไซต์ หรือกระทำการใดๆเพื่อให้ได้มาซึ่งแหล่งที่มา (Source code) ของบริการหรือเนื้อหาในบริการนี้ ถือเป็นความผิดกฎหมายและผิดสัญญา',
                    ]
                },
                {
                    id: '5',
                    title: 'การปฏิเสธความรับผิด',
                    content: 'เป็นที่เข้าใจตรงกันว่า "โทรเวช" หรือ "การแพทย์ทางไกล" (Telemedicine) เป็นการให้บริบาลเพื่ออำนวยความสะดวกแก่ ผู้รับบริบาลที่มีอาการเจ็บป่วยเล็กน้อย ที่ไม่จำเป็นต้องได้รับการตรวจวินิจฉัยอย่างใกล้ชิดจากแพทย์หรือจำเป็นต้องใช้ เวชภัณฑ์หรือเครื่องมือทางการแพทย์ในการตรวจและบริบาล ผู้รับบริบาลทราบดีว่าการรับบริการนี้ สัญญาณเชื่อมต่อทาง ภาพ เสียง หรือข้อมูลที่ให้คำปรึกษานั้นอาจเกิดความล่าช้า ความไม่เหมาะสมหรือไม่สมบูรณ์ หรือล้มเหลวในการส่งผ่าน หรือการสื่อสารเนื้อหาทางการแพทย์ และอาจส่งผลต่อความสำเร็จของการบริบาล จึงไม่มีการรับผิดชอบต่อผลของการ บริบาลแต่อย่างใด รวมถึงไม่มีการรับประกันการสูญหายการโจรกรรมการส่งข้อมูลผ่านทางอินเตอร์เน็ตแต่อย่างใด'
                },
                {
                    id: '6',
                    title: 'การชดใช้ค่าเสียหาย',
                    content: 'ผู้รับบริบาลจะปกป้องการเข้าถึงข้อมูลต่างๆจากการเข้าใช้เว็บไซต์ หรือแอพลิเคชัน (Application)ที่ใช้ในการเข้ารับบริการนี้ การละเมิดความลับหรือสิทธิของบุคคล ไม่ว่าจะเกิดขึ้นด้วยความจงใจหรือประมาทเลินเล่อ หรือจากการทำผิดข้อกำหนดนี้ ผู้ให้บริบาลและสถานพยาบาลสามารถเรียกร้องค่าเสียหายได้'
                },
                {
                    id: '7',
                    title: 'เหตุสุดวิสัย',
                    content: '“เหตุสุดวิสัย" หมายถึง เหตุการณ์ซึ่งเกิดขึ้นนอกเหนือจากการควบคุมที่เหมาะสม ของฝ่ายที่ประสบเหตุสุดวิสัยดังกล่าว ซึ่ง ส่งผลให้ฝ่ายนั้นไม่สามารถที่จะป้องกันหรือดำเนินการใดๆ ตามข้อกำหนดและเงื่อนไขนี้ได้ เหตุการณ์ดังกล่าวรวมถึงการ ใดๆ ที่ส่งผลให้ไม่สามารถดำเนินอุตสาหกรรมต่อได้ หรือข้อพิพาทแรงงาน เหตุการณ์ไม่สงบ สงคราม หรือภัยคุกคามจาก สงคราม หรือการก่อการร้าย การเปลี่ยนแปลงแนวปฏิบัติหรือกฎเกณฑ์ของหน่วยงานราชการ การเชื่อมต่อทางโทรคมนาคม หรือสาธารณูปโภคล้มเหลว พลังงานขาดแคลน ไฟไหม้ การระเบิด ภัยธรรมชาติ และโรคระบาด และฝ่ายที่ประสบเหตุ สุดวิสัยไม่ต้องรับผิดชอบต่อหน้าที่ที่ต้องปฏิบัติแต่อย่างใด ทั้งนี้ต้องปฏิบัติหน้าที่นั้นเมื่อเหตุสุดวิสัยได้สิ้นสุดลง'
                },
                {
                    id: '8',
                    title: 'การเปลี่ยนแปลงข้อกำหนดและเงื่อนไข',
                    content: 'ข้อกำหนดนี้ อาจเปลี่ยนแปลงแก้ไขโดยผู้ให้บริบาลและสถานพยาบาลโดยไม่ต้องมีการแจ้งล่วงหน้า การแก้ไขเปลี่ยนแปลง ข้อกำหนดดังกล่าวมีผลใช้บังคับในวันที่ได้มีการแสดงบนเว็บไซต์ฯ เว้นแต่จะระบุไว้เป็นอย่างอื่น การเข้ารับบริการนี้ ถือเป็น การตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่เปลี่ยนแปลงดังกล่าว และการแก้ไขหรือเปลี่ยนแปลงใดๆ เป็นการลบล้าง ข้อกำหนดและเงื่อนไขก่อนหน้านี้ทั้งหมดแต่ไม่มีผลย้อนหลังต่อข้อกำหนดเดิมที่ได้ปฏิบัติต่อกันมาแล้วแต่อย่างใด'
                },
                {
                    id: '9',
                    title: 'ความสมบูรณ์ของข้อกำหนด',
                    content: [
                        'หากข้อความใดในข้อกำหนดนี้ขัดต่อ ศีลธรรมอันดีหรือขัดต่อกฎหมาย และตกเป็นโมฆะ หรือใช้บังคับไม่ได้ ให้ถือว่าเฉพาะข้อความดังกล่าวนั้นเสียไปและให้ข้อกำหนดส่วนที่เหลือยังมีผลใช้บังคับต่อไปภายใต้กฎหมายไทย',
                        'การสละสิทธิใดๆ ทางกฎหมายของผู้ให้บริบาลหรือสถานพยาบาล ภายใต้ข้อกำหนดนี้ จะมีผลสมบูรณ์เมื่อ ได้กระทำเป็นลายลักษณ์อักษรแล้วเท่านั้นซึ่งไม่รวมถึงทางเว็บไซต์หรือทางแอพพลิเคชั่นหรือทางอินเทอร์เน็ตแต่อย่างใด',
                    ]
                },
            ],
            consent_10_title: '10. การคุ้มครองข้อมูลส่วนบุคคล',
            consent_101_html: '&emsp; 10.1 การให้ความยินยอมรับการรักษาข้าพเจ้าได้รับทราบคำประกาศสิทธิและข้อพึงปฏิบัติของผู้ป่วย และทราบว่าข้าพเจ้า มีสิทธิที่ซักถามข้อสงสัยเกี่ยวกับการรักษาและสิทธิที่จะรับรู้วิธีการตรวจการรักษาทางเลือกอื่นๆรวมทั้งอาการไม่พึง ประสงค์หรือภาวะแทรกซ้อนซึ่งอาจเกิดขึ้นได้ ข้าพเจ้า ...... ให้คณะแพทย์ ทันตแพทย์ และบุคลากรทางการแพทย์ของโรงพยาบาลพระรามเก้า ทำการตรวจวินิจฉัยและให้การรักษาแบบผู้ป่วยนอก ตามหลักวิชาการแพทย์ที่เหมาะสม',
            consent_102_html: '&emsp; 10.2 การเก็บรวมรวมข้อมูลส่วนบุคคลเมื่อข้าพเจ้าลงนามในเอกสารฉบับนี้ ข้าพเจ้ายืนยันว่าได้อ่านและรับทราบนโยบายคุ้มครองข้อมูลส่วนบุคคลของ โรงพยาบาลพระรามเก้า รายละเอียดปรากฏตามเอกสารแนบครบถ้วนแล้ว ซึ่งนโยบายคุ้มครองข้อมูลส่วนบุคคล ดังกล่าว อธิบายถึงวิธีการที่โรงพยาบาลพระรามเก้าจะทำการเก็บ รวบรวม ใช้ เปิดเผย และส่งหรือโอนข้อมูลส่วน บุคคลใด ๆ ของข้าพเจ้า ข้าพเจ้ารับทราบและยืนยันว่าโรงพยาบาลพระรามเก้าสามารถอาศัยฐานทางกฎหมายอื่นใน การทำการเก็บ รวบรวม ใช้ เปิดเผย และส่งหรือโอนข้อมูลส่วนบุคคลใด ๆ ของข้าพเจ้าได้ โดยไม่ต้องอาศัยความ ยินยอมอย่างชัดแจ้ง ทั้งนี้ เป็นไปตามที่กฎหมายกำหนด เพื่อ',
            consent_102_1_html: '&emsp; (1) วัตถุประสงค์ใดซึ่งระบุไว้ในนโยบายคุ้มครองข้อมูลส่วนบุคคลของโรงพยาบาลพระรามเก้า และ/หรือเพื่อ ประโยชน์ของข้าพเจ้า ',
            consent_102_2_html: '&emsp; (2) ปฏิบัติให้เป็นไปตามบทบัญญัติของกฎหมายที่เกี่ยวข้อง รวมถึงเพื่อเวชศาสตร์ป้องกันหรืออาชีวเวชศาสตร์ การประเมินความสามารถในการทำงาน ของลูกจ้าง การวินิจฉัยโรคทางการแพทย์ การให้บริการด้านสุขภาพ หรือด้านสังคม การรักษาทางการแพทย์การจัดการด้านสุขภาพ หรือระบบและการให้บริการด้านสังคม สงเคราะห์ ประโยชน์สาธารณะด้านการสาธารณสุข เช่น การป้องกันด้านสุขภาพจากโรคติดต่ออันตรายหรือ การควบคุมมาตรฐานหรือคุณภาพของยา เวชภัณฑ์ หรือเครื่องมือแพทย์ การคุ้มครองแรงงาน การ ประกันสังคม หลักประกันสุขภาพแห่งชาติ สวัสดิการเกี่ยวกับการรักษาพยาบาลของผู้มีสิทธิตามกฎหมาย การคุ้มครองผู้ประสบภัยจากรถ หรือการคุ้มครองทางสังคม การศึกษาวิจัยทางวิทยาศาสตร์ประวัติศาสตร์ หรือสถิติ ประโยชน์สาธารณะที่สำคัญอื่น ๆ',
            consent_103_html: '&emsp; 10.3 การเก็บรวมรวมข้อมูลส่วนบุคคลเพื่อนำส่งบริษัทประกันภัย บริษัทคู่สัญญา หรือบริษัทต้นสังกัดเพื่อประโยชน์ผู้ป่วย(หากมี) ข้าพเจ้า ...... ให้โรงพยาบาลพระรามเก้ารวบรวม ใช้ เปิดเผยข้อมูลส่วน บุคคล ในการเข้ารับการตรวจ การวินิจฉัย การรักษาพยาบาลหรือการให้บริการสุขภาพ รวมถึงรายละเอียดค่า รักษาพยาบาล ค่าใช้จ่ายที่เกิดขึ้น ของข้าพเจ้าทั้งหมดได้ตามความเป็นจริง เพื่อการพิจารณาการจ่ายค่าสินไหม ทดแทน ค่าชดเชย ค่าตรวจวินิจฉัยและรักษาพยาบาล ค่าใช้จ่ายใด ๆ ที่เกิดขึ้นจากการเข้ารับการรักษาพยาบาลของ ข้าพเจ้าทั้งหมด (รวมเรียกว่า "ค่ารักษาพยาบาล") ให้แก่ บริษัทประกันภัย/บริษัทคู่สัญญา/บริษัทต้นสังกัด/บุคคลหรือ นิติบุคคลที่ต้องชำระค่ารักษาพยาบาลของข้าพเจ้า และในกรณีที่บริษัทประกันภัย/บริษัทคู่สัญญา/บริษัทต้นสังกัด/ บุคคลหรือนิติบุคคลที่ต้องชำระค่ารักษาพยาบาลฯ ปฏิเสธการจ่ายชดเชยค่ารักษาพยาบาลของข้าพเจ้า ข้าพเจ้าเป็น ผู้รับผิดชอบชำระค่าใช้จ่ายที่เกิดขึ้นให้กับโรงพยาบาลพระรามเก้า โดยไม่มีเงื่อนไข',
            consent_104_html: '&emsp; 10.4 การเก็บรวมรวมข้อมูลส่วนบุคคลเพื่อการแจ้งสิทธิประโยชน์ทางการแพทย์ ข้าพเจ้า ...... ให้โรงพยาบาลพระรามเก้าใช้ข้อมูลส่วนบุคคล เพื่อแจ้งสิทธิ ประโยชน์ทางการแพทย์และส่งเสริม การขายการตลาด รายการผลิตภัณฑ์และบริการ รวมถึงสามารถส่งข้อมูล ข่าวสารดังกล่าว หรือส่งแบบสอบถามเพื่อการประเมินผลการให้บริการของบริษัท ให้กับข้าพเจ้าได้ ซึ่งข้าพเจ้า สามารถยกเลิกความยินยอมในการรับแจ้งข้อมูลข่าวสารได้ตามช่องทางที่โรงพยาบาลพระรามเก้ากำหนด',
            yes_voluntary_label: 'ยินยอมโดยสมัครใจ',
            yes_label: 'ยินยอม',
            no_label: 'ไม่ยินยอม',
            telemedicine_consent_label: 'ข้าพเจ้าได้อ่านข้อกำหนดและเข้าใจดีแล้ว รวมถึงข้อควรปฏิบัติต่างๆที่เกี่ยวข้องกับข้อกำหนดนี้ ข้าพเจ้ายินยอมให้การรักษาทางโทรเวชหรือการแพทย์ทางไกล (telemedicine)',
            signer_title: 'ผู้ลงนามความยินยอม',
            signature_name_label: 'ชื่อ-นามสกุล',
            signature_type_title: 'ประเภทผู้ลงนาม',
            signature_type_legend: 'กรุณาระบุประเภทผู้ลงนาม',
            signature_type_patient_label: 'ผู้ป่วย',
            signature_type_representative_label: 'ผู้แทนผู้ป่วย',
            signature_relation_label: 'ความสัมพันธ์กับผู้ป่วย',
            signature_draw_title: 'ลายมือชื่อผู้ลงนาม',
            signature_clear_button: 'ล้างลายมือชื่อ',
            submit_processing_label: 'กำลังส่ง...',
            submit_confirm_label: 'ยืนยันการให้ความยินยอม',
            alert_missing_consent_title: 'โปรดระบุความยินยอมให้ครบ',
            alert_consent_required_title: 'โปรดให้ความยินยอม',
            alert_consent_required_html: 'ข้อ 10.1 โปรดระบุความยินยอมรับการรักษาก่อนดำเนินการต่อ',
            alert_signature_title: 'โปรดลงลายมือชื่อ',
            alert_signature_text: 'โปรดลงลายมือชื่อก่อนให้ความยินยอม.',
            confirm_sign_title: 'ยืนยันการลงนาม',
            confirm_sign_text: 'คุณต้องการลงนามหรือไม่?',
            confirm_button_text: 'ยืนยัน',
            cancel_button_text: 'ยกเลิก',
        },
        en: {
            title: 'Terms and Consent for Telemedicine',
            sub_title: 'And Online Clinic Services',
            read_consent: 'Please read the following terms and consent carefully before you give your consent.',
            definitions: [
                '“<b>Telemedicine</b>” refers to the transmission or communication of medical knowledge and content by licensed medical practitioners, via electronic means, from one location to another, for the purpose of providing consultation, advice, or medical care, under the responsibility of the transmitting practitioner, and with the mutual consent of both the care provider and care recipient.',
                '“<b>Healthcare facility</b>” means a public and/or private healthcare establishment legally constituted in accordance with applicable laws.',
                '“<b>Telemedicine service</b>” or “<b>Remote medical care</b>” refers to the practice of medicine conducted through telemedicine.',
                '“<b>Care provider</b>” means a licensed medical practitioner delivering services through telemedicine',
                '“<b>Care recipient</b>” means the patient or individual receiving telemedicine services',
                '“<b>Online clinic</b>” means a healthcare facility providing telemedicine services in compliance with applicable regulations. ',
            ],
            sections: [
                {
                    id: '1',
                    title: 'Scope of Services',
                    content: [
                        '1.1Telemedicine and online clinic services are provided via the hospital\'s official website or application and shall include, but are not limited to, the following: ',
                        '&emsp;a. General medical consultation and advice via telecommunication platforms.',
                        '&emsp;b. Delivery of prescribed medication to the designated address of the recipient.',
                        '&emsp;c. Dispatch of medical personnel for the collection of specimens at the recipient\'s location for laboratory analysis',
                        '&emsp;d. Other healthcare-related services as may be determined by the hospital',
                        '1.2. Exclusions: ',
                        'Telemedicine is not suitable for patients requiring urgent or emergency medical attention, patients unable to care for themselves, or minors below the age of legal consent. Such individuals should seek immediate care at a hospital or emergency facility. ',
                        '1.3. Issuance of medical certificates is subject solely to the discretion of the physician, or verification of the recipient’s identity via the telemedicine service system, in accordance with information technology standards stipulated by relevant state authorities.',
                    ]
                },
                {
                    id: '2',
                    title: 'Obligations of the Care Recipient',
                    content: [
                        'The care recipient agrees to:',
                        '2.1. Provide complete and accurate personal and health-related information, including national identification number, contact details, emergency contacts, and relevant medical history',
                        '2.2. Warrant the accuracy and truthfulness of all information provided.',
                        '2.3. Use the service solely for lawful purposes and in compliance with all applicable laws and regulations. Make timely payment for all services in accordance with the hospital’s terms and conditions',
                    ]
                },
                {
                    id: '3',
                    title: 'Acknowledgement of Facts and Medical Decisions',
                    content: [
                        '3.1. Licensed healthcare professionals, in performing their duties in accordance with medical standards and ethics, shall be legally protected against unfair allegations. ',
                        '3.2. The practice of medicine is based on the best available medical science at the time but cannot guarantee the prevention, cure, or diagnosis of all illnesses. ',
                        '3.3. All medical treatments inherently involve risks and potential complications. ',
                        '3.4. Limitations of technology may result in incomplete, inaccurate, or delayed diagnostic information. ',
                        '3.5. Healthcare professionals shall retain the right to determine the most appropriate medical procedures, including referrals, in the best interests of the patient. ',
                        '3.6. Any withholding of material medical information by the patient may negatively impact the quality and safety of treatment. ',
                    ]
                },
                {
                    id: '4',
                    title: 'Intellectual Property',
                    content: [
                        'All intellectual property arising from or related to this service shall remain the exclusive property of Praram 9 Hospital Public Company Limited. ',
                        'Any reverse engineering, decompiling, decoding, or unlawful use of the system shall constitute a breach of contract and may result in legal action. ',
                    ]
                },
                {
                    id: '5',
                    title: 'Disclaimer of Liability',
                    content: [
                        'All intellectual property arising from or related to this service shall remain the exclusive property of Praram 9 Hospital Public Company Limited. ',
                        'Any reverse engineering, decompiling, decoding, or unlawful use of the system shall constitute a breach of contract and may result in legal action. ',
                    ]
                },
                {
                    id: '6',
                    title: 'Indemnification',
                    content: 'The care recipient agrees to protect the confidentiality of access credentials and shall indemnify the hospital and its staff against any damages arising from unauthorized access, misuse, or breach of these terms, whether by negligence or intentional misconduct. ',
                },
                {
                    id: '7',
                    title: 'Force Majeure',
                    content: 'Neither party shall be held liable for failure to perform obligations arising from causes beyond reasonable control, including but not limited to natural disasters, war, terrorism, pandemics, regulatory changes, utility outages, or labor disputes. ',
                },
                {
                    id: '8',
                    title: 'Amendments to Terms',
                    content: 'The hospital reserves the right to amend these terms and conditions at any time. Amendments shall become effective upon publication on the hospital’s official communication channels, unless otherwise specified. Continued use of the service shall be deemed acceptance of such amendments. ',
                },
                {
                    id: '9',
                    title: 'Severability',
                    content: 'If any provision of this document is deemed invalid, unlawful, or unenforceable, the remaining provisions shall remain valid and enforceable under Thai law. ',
                }
            ],
            consent_10_title: 'Personal Data Protection',
            consent_101_html: '&emsp;10.1. Consent to Medical Examination and Treatment',
            consent_102_html: '&emsp;10.2. <b>Consent to Collection and Processing of Personal Data</b><br> By signing this document, I confirm that I have read and understood the hospital\'s Personal Data Protection Policy and hereby consent to the collection, use, disclosure, transfer, and processing of my personal data for: ',
            consent_102_1_html: '&emsp;(1) Purposes outlined in the hospital\'s Privacy Policy and/or purposes beneficial to the patient. ',
            consent_102_2_html: '&emsp;(2) Compliance with applicable laws, including but not limited to preventive medicine, occupational health, healthcare provision, medical diagnosis, communicable disease control, drug and device regulation, social security, public health, and matters of public interest. ',
            consent_103_html: '&emsp;10.3 <b>Consent for Insurance and Contractual Processing</b><br> ... To Praram 9 Hospital using and disclosing my personal data (including medical records, diagnosis, treatment, and expenses) to insurance providers, contractual partners, or employers for the purposes of claims, reimbursements, or settlement of medical expenses. I acknowledge that, should such parties deny payment, I shall remain personally responsible for all expenses incurred. ',
            consent_104_html: '&emsp;10.4. <b>Consent for Marketing and Communications</b><br> ... To Praram 9 Hospital contacting me regarding medical benefits, promotions, product or service offerings, or surveys related to hospital services. I understand that I may withdraw this consent at any time via the hospital\'s designated communication channels. ',
            yes_voluntary_label: 'I voluntarily consent.',
            yes_label: 'I consent.',
            no_label: ' I do not consent ',
            telemedicine_consent_label: '&emsp;<b>11. Final Declaration</b> <br> I have read, fully understood, and agree to the above Terms and Conditions for Telemedicine and Online Clinic Services',
            signer_title: 'Signer',
            signature_name_label: 'Signature Name',
            signature_type_title: 'Signature Type',
            signature_type_legend: 'Please select the type of signature:',
            signature_type_patient_label: 'Patient',
            signature_type_representative_label: 'Representative',
            signature_relation_label: 'Relation to Patient',
            signature_draw_title: 'Draw your signature below:',
            signature_clear_button: 'Clear Signature',
            submit_processing_label: 'Submitting...',
            submit_confirm_label: 'Submit',
            alert_missing_consent_title: 'Please consent to the terms and conditions.',
            alert_consent_required_title: 'Consent Required',
            alert_consent_required_html: 'Please read and consent to the terms and conditions.',
            alert_signature_title: 'Signature Required',
            alert_signature_text: 'Please sign the document to confirm your consent.',
            confirm_sign_title: 'Confirm Signature',
            confirm_sign_text: 'Are you sure you want to confirm the signature?',
            confirm_button_text: 'Confirm',
            cancel_button_text: 'Cancel',
        },
    };
    const t = translations[lang as keyof typeof translations] || translations.th;

    return (
        <AppLayout>
            <Head>
                <title>{t.title}</title>
                <meta name="description" content={t.title} />
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
                            <Box >
                                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {t.title}
                                </Typography>
                                <Typography variant="h5" gutterBottom sx={{ color: 'text.secondary' }}>
                                    {t.sub_title}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
                                    Praram 9 Hospital Public Company Limited
                                </Typography>
                            </Box>
                        </Box>
                        <Alert severity="info" sx={{ mb: 4 }}>
                            {t.read_consent}
                        </Alert>
                        {t.definitions.map((definition, index) => (
                            <Typography
                                key={index}
                                variant="body1"
                                gutterBottom
                                sx={{ color: 'text.secondary', mb: 2 }}
                                dangerouslySetInnerHTML={{ __html: `&emsp;${definition}` }}
                            />
                        ))}
                        {t.sections.map((section, index) => (
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
                                            <div className="mb-3" key={content} dangerouslySetInnerHTML={{ __html: `&emsp;${content}` }}></div>
                                        ))
                                    ) : (
                                        <div>&emsp;{section.content}</div>
                                    )}
                                </Typography>
                            </Paper>
                        ))}
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
                                    {t.consent_10_title}
                                </Typography>

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">
                                        <span dangerouslySetInnerHTML={{ __html: t.consent_101_html }} />
                                    </FormLabel>
                                    <RadioGroup
                                        value={data.treatment_consent}
                                        onChange={(e) => setData('treatment_consent', e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label={t.yes_voluntary_label} disabled={!!patient.treatment_consent} />
                                        <FormControlLabel value="no" control={<Radio />} label={t.no_label} disabled={!!patient.treatment_consent} />
                                    </RadioGroup>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">
                                        <div dangerouslySetInnerHTML={{ __html: t.consent_102_html }} />
                                        <div dangerouslySetInnerHTML={{ __html: t.consent_102_1_html }} />
                                        <div dangerouslySetInnerHTML={{ __html: t.consent_102_2_html }} />
                                    </FormLabel>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">
                                        <span dangerouslySetInnerHTML={{ __html: t.consent_103_html }} />
                                    </FormLabel>
                                    <RadioGroup
                                        value={data.insurance_consent}
                                        onChange={(e) => setData('insurance_consent', e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label={t.yes_voluntary_label} disabled={!!patient.insurance_consent} />
                                        <FormControlLabel value="no" control={<Radio />} label={t.no_label} disabled={!!patient.insurance_consent} />
                                    </RadioGroup>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormLabel component="legend">
                                        <span dangerouslySetInnerHTML={{ __html: t.consent_104_html }} />
                                    </FormLabel>
                                    <RadioGroup
                                        value={data.marketing_consent}
                                        onChange={(e) => setData('marketing_consent', e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label={t.yes_voluntary_label} disabled={!!patient.marketing_consent} />
                                        <FormControlLabel value="no" control={<Radio />} label={t.no_label} disabled={!!patient.marketing_consent} />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Paper>
                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <FormLabel component="legend">
                                <div dangerouslySetInnerHTML={{ __html: t.telemedicine_consent_label }} />
                            </FormLabel>
                            <RadioGroup
                                value={data.telemedicine_consent}
                                onChange={(e) => setData('telemedicine_consent', e.target.value)}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label={t.yes_label} />
                                <FormControlLabel value="no" control={<Radio />} label={t.no_label} />
                            </RadioGroup>
                        </FormControl>
                        {/* Signature Section */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.signer_title}
                            </Typography>
                            <TextField
                                fullWidth
                                label={t.signature_name_label}
                                value={data.signature_name}
                                onChange={(e) => setData('signature_name', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.signature_type_title}
                            </Typography>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend">{t.signature_type_legend}</FormLabel>
                                <RadioGroup
                                    value={data.signature_type}
                                    onChange={(e) => setData('signature_type', e.target.value)}
                                >
                                    <FormControlLabel value="patient" control={<Radio />} label={t.signature_type_patient_label} />
                                    <FormControlLabel value="representative" control={<Radio />} label={t.signature_type_representative_label} />
                                </RadioGroup>
                            </FormControl>
                            {data.signature_type == "representative" && (
                                <TextField
                                    required={data.signature_type == "representative"}
                                    fullWidth
                                    label={t.signature_relation_label}
                                    value={data.signature_relation}
                                    onChange={(e) => setData('signature_relation', e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {t.signature_draw_title}
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
                                        {t.signature_clear_button}
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
                                {processing ? t.submit_processing_label : t.submit_confirm_label}
                            </Button>
                        </Box>
                    </Paper>
                </form>
            </motion.div>
        </AppLayout>
    );
}
