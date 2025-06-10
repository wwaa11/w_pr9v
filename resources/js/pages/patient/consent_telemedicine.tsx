import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import SignaturePad from "react-signature-canvas";
import { useRef } from "react";
import Box from "@mui/material/Box";

interface ConsentTelemedicineProps {
    patient: {
        hn: string;
    }
}

export default function ConsentTelemedicine({ patient }: ConsentTelemedicineProps) {
    const page = usePage();
    const url = page.props.url as string;

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

        if (!data.signature) {
            Swal.fire({
                icon: "warning",
                title: "โปรดลงลายมือชื่อ",
                text: "Please provide your signature before submitting.",
            });
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to submit your telemedicine consent?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, submit",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            post(`${url}/telemedicine`, {
                onSuccess: () => {
                    // Handle success, e.g., show a success message or redirect
                },
                onError: () => {
                    // Handle error, e.g., show an error message
                },
            });
        }
    };

    return (
        <AppLayout>
            <form onSubmit={handleSubmit} className="max-w-2lg mx-auto">
                <input type="hidden" name="hn" value={data.hn} />
                <input type="hidden" name="type" value={data.type} />
                <h2 className="text-xl sm:text-2xl font-semibold text-center pt-6 leading-relaxed">
                    &emsp;ข้อกำหนดและการให้ความยินยอมรับบริการ การแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์
                </h2>
                <h3 className="text-sm sm:text-base text-center mb-4 text-gray-600">
                    Praram 9 Hospital Public Company Limited
                </h3>
                <p className="text-base sm:text-lg mb-4 pt-6 leading-relaxed">
                    &emsp;บริการ การแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ นี้ เป็นการให้บริการทางการแพทย์
                    โดยการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมด้วยวิธีการทางอิเล็กทรอนิกส์
                    เพื่อให้การปรึกษา คำแนะนำ แก่ผู้รับบริการหรือผู้รับบริบาล ซึ่งอยู่ต่างสถานที่กัน เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรม
                    ตามภาวะ วิสัย และพฤติการณ์ที่เป็นอยู่ขณะที่ให้บริการ การแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“โทรเวช”</b> หรือ <b className="font-bold">“การแพทย์ทางไกล” (telemedicine)</b> หมายความว่า
                    เป็นการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมทั้งจากสถานพยาบาลภาครัฐและ/หรือเอกชน
                    จากสถานที่หนึ่งไปยังอีกสถานที่หนึ่งโดยอาศัยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา คำแนะนำ แก่ผู้ประกอบวิชาชีพเวชกรรม
                    หรือบุคคลอื่นใด เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรม ตามภาวะวิสัย และพฤติการณ์ที่เป็นอยู่
                    โดยความยินยอมร่วมกันของผู้ให้บริบาลและผู้รับบริบาลในขณะนั้น ทั้งนี้โดยความรับผิดชอบของผู้ส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์นั้นๆ
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“สถานพยาบาล”</b> หมายความว่า สถานพยาบาลที่เป็นของภาครัฐและ/หรือเอกชน ที่จัดตั้งขึ้นตามกฎหมายที่เกี่ยวข้อง
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“การให้บริบาลผ่านระบบบริบาลโทรเวช หรือ บริบาลการแพทย์ทางไกล”</b> หมายความว่า
                    การดำเนินการโดย “โทรเวช” หรือ “การแพทย์ทางไกล”
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“ผู้ให้บริบาล”</b> หมายความว่า ผู้ประกอบวิชาชีพเวชกรรมที่ให้บริบาลโดยโทรเวช หรือ การแพทย์ทางไกล (telemedicine)
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“ผู้รับบริบาล”</b> หมายความว่า บุคคลที่ได้รับ “โทรเวช” หรือ “การแพทย์ทางไกล” (telemedicine)
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“คลินิกออนไลน์”</b> หมายถึง สถานพยาบาลตามที่กฎหมายกำหนด
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;<b className="font-bold">“การบริบาล”</b> หมายความว่า กระบวนการเพื่อผลแห่ง “โทรเวช” หรือ การแพทย์ทางไกล" (telemedicine)
                </p>
                <p className="text-base sm:text-lg mb-4 leading-relaxed">
                    &emsp;การตกลงใช้บริการ ทางการแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์นี้ ถือว่าผู้รับบริบาลได้อ่านข้อกำหนดเข้าใจดีแล้ว
                    และยินยอมปฏิบัติตามข้อกำหนด รวมถึงข้อควรปฏิบัติต่างๆที่เกี่ยวข้องกับข้อกำหนดนี้
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">1. บริการ</h3>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    1.1 บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ ให้บริการผ่านเว็บไซต์ (Website) หรือแอพลิเคชัน
                    (Application) ซึ่งประกอบด้วยบริการต่างๆ และข้อพึงระวังดังต่อไปนี้
                </p>
                <p className="text-base sm:text-lg mb-2 pl-8 leading-relaxed">
                    (ก) บริการทางการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ นี้ไม่เหมาะ ต่อผู้รับบริบาลที่มีอาการ
                    เจ็บป่วยรุนแรงเฉียบพลัน อาการสาหัส หรืออยู่ในอาการที่ต้องได้รับการรักษาพยาบาลโดยเร่งด่วน ซึ่งกรณีดังกล่าว ควรรีบขอความ
                    ช่วยเหลือจากโรงพยาบาล หน่วยรถพยาบาลฉุกเฉิน รวมถึงไม่เหมาะกับผู้ที่ไม่สามารถช่วยเหลือตนเองได้ และผู้ที่ยังไม่บรรลุนิติภาวะ
                </p>
                <p className="text-base sm:text-lg mb-2 pl-8 leading-relaxed">
                    (ข) บริการจัดส่งยาตามคำสั่งของแพทย์ ไปยังภูมิลำเนาของท่าน
                </p>
                <p className="text-base sm:text-lg mb-2 pl-8 leading-relaxed">
                    (ค) บริการ จัดส่งทีมงานทางการแพทย์ เพื่อเก็บตัวอย่าง ณ ภูมิลำเนาของท่าน เพื่อนำกลับมาตรวจวิเคราะห์ทาง
                    ห้องปฏิบัติการทางการแพทย์เกี่ยวกับโรคทั่วไป หรือเพื่อการตรวจวินิจฉัยอาการเบื้องต้น
                </p>
                <p className="text-base sm:text-lg mb-4 pl-8 leading-relaxed">
                    (ง) บริการอื่นๆ
                </p>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    1.2 การออกใบรับรองแพทย์ขึ้นอยู่กับดุลยพินิจของแพทย์ผู้ให้บริบาลแต่เพียงผู้เดียว หรือจากการพิจารณาการยืนยันตัวตน
                    ของผู้รับบริบาล จากระบบการให้บริบาลผ่านระบบบริบาลโทรเวช หรือบริบาลการแพทย์ทางไกล (Telemedicine)
                    ภายใต้มาตรฐานด้านสารสนเทศ ที่หน่วยงานรับผิดชอบที่กำกับดูแลเรื่องการยืนยันตัวบุคคลของรัฐเป็นผู้กำหนด
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">2. หน้าที่ของผู้รับบริบาล</h3>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    2.1 ต้องให้ข้อมูลต่างๆ ของผู้รับบริบาล รวมถึงข้อมูลส่วนบุคคล เช่น เลขบัตรประชาชน สถานที่ติดต่อ ผู้ที่สามารถ
                    ติดต่อได้ในกรณีฉุกเฉิน เบอร์ติดต่อของผู้รับบริบาลและผู้เกี่ยวข้อง และ/หรือ ข้อมูลสุขภาพทั่วไปและที่จำเป็น
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    2.2 ผู้รับบริบาลรับรองว่าข้อมูลต่างๆ ที่ได้ให้ไว้สำหรับการรับบริบาลนี้เป็นความจริงทั้งสิ้น
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    2.3 ผู้รับบริบาลจะไม่ใช้บริการนี้เพื่อวัตถุประสงค์ที่ขัดต่อกฎหมาย และจะปฏิบัติตามกฎหมายหรือกฎระเบียบต่างๆ
                </p>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    2.4 การชำระเงินการเข้ารับบริการนี้ ให้เป็นไปตามข้อตกลงที่กำหนดไว้
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">3. ผู้รับบริบาลรับทราบข้อเท็จจริงและเคารพในดุลพินิจของผู้ให้บริบาลและยอมรับผลทางการแพทย์ ดังต่อไปนี้</h3>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.1 ผู้ให้บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพที่ได้ปฏิบัติหน้าที่ตามมาตรฐานและ จริยธรรม ย่อมได้รับความคุ้มครอง
                    ตามที่กฎหมายกำหนดและมีสิทธิได้รับความคุ้มครองจากการถูกกล่าวหาโดยไม่เป็นธรรม
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.2 การแพทย์ในที่นี้หมายถึงการแพทย์แผนปัจจุบันซึ่งได้รับการพิสูจน์ทางวิทยาศาสตร์ โดยองค์ความรู้ในขณะนั้นว่ามี
                    ประโยชน์มากกว่าโทษสำหรับผู้ป่วย
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.3 การแพทย์ไม่สามารถให้การวินิจฉัย ป้องกัน หรือรักษาให้หายได้ทุกโรคหรือทุกสภาวะ
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.4 การรักษาพยาบาลทุกชนิดมีความเสี่ยงที่จะเกิดผลอันไม่พึงประสงค์ได้ นอกจากนี้เหตุสุดวิสัยอาจเกิดขึ้นได้แม้ผู้ให้
                    บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพจะใช้ความระมัดระวังอย่างเพียงพอตามภาวะวิสัยและพฤติการณ์ในการ
                    รักษาพยาบาลนั้นๆ แล้ว
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.5 การตรวจเพื่อการคัดกรอง วินิจฉัย และติดตามการรักษาโรค อาจให้ผลที่คลาดเคลื่อนได้ด้วยข้อจำกัดของเทคโนโลยีที่
                    ใช้และปัจจัยแวดล้อมอื่นๆ ที่ไม่สามารถควบคุมได้ตามมาตรฐานการปฏิบัติงาน
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.6 ผู้ให้บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพมีสิทธิใช้ดุลพินิจในการเลือกกระบวนการรักษาพยาบาลตามหลัก
                    วิชาการทางการแพทย์ตามความสามารถและข้อจำกัด ตามภาวะวิสัยและพฤติการณ์ที่มีอยู่รวมทั้งการปรึกษาหรือส่ง
                    ต่อโดยคำนึงถึงสิทธิและประโยชน์โดยรวมของผู้ป่วยหรือผู้รับบริบาล
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    3.7. เพื่อประโยชน์ต่อตัวผู้ป่วยหรือผู้รับบริบาลผู้ให้บริบาลหรือผู้ประกอบวิชาชีพด้านสุขภาพอาจให้ คำแนะนำ หรือส่งต่อ
                    ผู้ป่วยหรือผู้รับบริบาลให้ได้รับการรักษาตามความเหมาะสม ทั้งนี้ผู้ป่วยต้องไม่อยู่ในสภาวะฉุกเฉินอันจำเป็นเร่งด่วน
                    และเป็นอันตรายต่อชีวิต
                </p>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    3.8 การปกปิดข้อมูลด้านสุขภาพ และข้อเท็จจริงต่างๆ ทางการแพทย์ของผู้ป่วยหรือผู้รับบริบาลต่อผู้ให้บริบาลหรือผู้
                    ประกอบวิชาชีพด้านสุขภาพอาจส่งผลเสียต่อกระบวนการรักษาพยาบาล
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">4. ทรัพย์สินทางปัญญา</h3>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    4.1 การใช้บริการนี้ ไม่ก่อให้ผู้รับบริบาลเกิดความเป็นเจ้าของในทรัพย์สินทางปัญญาใดที่เกิดขึ้น แต่อย่างใด
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    4.2 บริษัท โรงพยาบาลพระรามเก้า จำกัด (มหาชน) เป็นเจ้าของในกรรมสิทธิ์ของทรัพย์สินทางปัญญาทั้งหมดที่เกิดจาก
                    การให้บริการนี้แต่ผู้เดียว
                </p>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    4.3 การทำวิศวกรรมย้อนกลับ ถอดรหัส หรือปลดล็อก ส่วนต่างๆ ในเว็บไซต์ หรือกระทำการใดๆเพื่อให้ได้มาซึ่งแหล่งที่มา
                    (Source code) ของบริการหรือเนื้อหาในบริการนี้ ถือเป็นความผิดกฎหมายและผิดสัญญา
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">5. การปฏิเสธความรับผิด</h3>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    เป็นที่เข้าใจตรงกันว่า "โทรเวช” หรือ “การแพทย์ทางไกล" (Telemedicine) เป็นการให้บริบาลเพื่ออำนวยความสะดวกแก่
                    ผู้รับบริบาลที่มีอาการเจ็บป่วยเล็กน้อย ที่ไม่จำเป็นต้องได้รับการตรวจวินิจฉัยอย่างใกล้ชิดจากแพทย์หรือจำเป็นต้องใช้
                    เวชภัณฑ์หรือเครื่องมือทางการแพทย์ในการตรวจและบริบาล ผู้รับบริบาลทราบดีว่าการรับบริการนี้ สัญญาณเชื่อมต่อทาง
                    ภาพ เสียง หรือข้อมูลที่ให้คำปรึกษานั้นอาจเกิดความล่าช้า ความไม่เหมาะสมหรือไม่สมบูรณ์ หรือล้มเหลวในการส่งผ่าน
                    หรือการสื่อสารเนื้อหาทางการแพทย์ และอาจส่งผลต่อความสำเร็จของการบริบาล จึงไม่มีการรับผิดชอบต่อผลของการ
                    บริบาลแต่อย่างใด รวมถึงไม่มีการรับประกันการสูญหายการโจรกรรมการส่งข้อมูลผ่านทางอินเตอร์เน็ตแต่อย่างใด
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">6. การชดใช้ค่าเสียหาย</h3>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    ผู้รับบริบาลจะปกป้องการเข้าถึงข้อมูลต่างๆจากการเข้าใช้เว็บไซต์ หรือแอพลิเคชัน (Application)ที่ใช้ในการเข้ารับบริการนี้
                    การละเมิดความลับหรือสิทธิของบุคคล ไม่ว่าจะเกิดขึ้นด้วยความจงใจหรือประมาทเลินเล่อ หรือจากการทำผิดข้อกำหนดนี้
                    ผู้ให้บริบาลและสถานพยาบาลสามารถเรียกร้องค่าเสียหายได้
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">7. เหตุสุดวิสัย</h3>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    “เหตุสุดวิสัย” หมายถึง เหตุการณ์ซึ่งเกิดขึ้นนอกเหนือจากการควบคุมที่เหมาะสม ของฝ่ายที่ประสบเหตุสุดวิสัยดังกล่าว ซึ่ง
                    ส่งผลให้ฝ่ายนั้นไม่สามารถที่จะป้องกันหรือดำเนินการใดๆ ตามข้อกำหนดและเงื่อนไขนี้ได้ เหตุการณ์ดังกล่าวรวมถึงการ
                    ใดๆ ที่ส่งผลให้ไม่สามารถดำเนินอุตสาหกรรมต่อได้ หรือข้อพิพาทแรงงาน เหตุการณ์ไม่สงบ สงคราม หรือภัยคุกคามจาก
                    สงคราม หรือการก่อการร้าย การเปลี่ยนแปลงแนวปฏิบัติหรือกฎเกณฑ์ของหน่วยงานราชการ การเชื่อมต่อทางโทรคมนาคม
                    หรือสาธารณูปโภคล้มเหลว พลังงานขาดแคลน ไฟไหม้ การระเบิด ภัยธรรมชาติ และโรคระบาด และฝ่ายที่ประสบเหตุ
                    สุดวิสัยไม่ต้องรับผิดชอบต่อหน้าที่ที่ต้องปฏิบัติแต่อย่างใด ทั้งนี้ต้องปฏิบัติหน้าที่นั้นเมื่อเหตุสุดวิสัยได้สิ้นสุดลง
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">8. การเปลี่ยนแปลงข้อกำหนดและเงื่อนไข</h3>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    ข้อกำหนดนี้ อาจเปลี่ยนแปลงแก้ไขโดยผู้ให้บริบาลและสถานพยาบาลโดยไม่ต้องมีการแจ้งล่วงหน้า การแก้ไขเปลี่ยนแปลง
                    ข้อกำหนดดังกล่าวมีผลใช้บังคับในวันที่ได้มีการแสดงบนเว็บไซต์ฯ เว้นแต่จะระบุไว้เป็นอย่างอื่น การเข้ารับบริการนี้ ถือเป็น
                    การตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่เปลี่ยนแปลงดังกล่าว และการแก้ไขหรือเปลี่ยนแปลงใดๆ เป็นการลบล้าง
                    ข้อกำหนดและเงื่อนไขก่อนหน้านี้ทั้งหมดแต่ไม่มีผลย้อนหลังต่อข้อกำหนดเดิมที่ได้ปฏิบัติต่อกันมาแล้วแต่อย่างใด
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">9. ความสมบูรณ์ของข้อกำหนด</h3>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    หากข้อความใดในข้อกำหนดนี้ขัดต่อ ศีลธรรมอันดีหรือขัดต่อกฎหมาย และตกเป็นโมฆะ หรือใช้บังคับไม่ได้
                    ให้ถือว่าเฉพาะข้อความดังกล่าวนั้นเสียไปและให้ข้อกำหนดส่วนที่เหลือยังมีผลใช้บังคับต่อไปภายใต้กฎหมายไทย
                </p>
                <p className="text-base sm:text-lg mb-4 pl-4 leading-relaxed">
                    การสละสิทธิใดๆ ทางกฎหมายของผู้ให้บริบาลหรือสถานพยาบาล ภายใต้ข้อกำหนดนี้ จะมีผลสมบูรณ์เมื่อ
                    ได้กระทำเป็นลายลักษณ์อักษรแล้วเท่านั้นซึ่งไม่รวมถึงทางเว็บไซต์หรือทางแอพพลิเคชั่นหรือทางอินเทอร์เน็ตแต่อย่างใด
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">10. การคุ้มครองข้อมูลส่วนบุคคล</h3>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    10.1 การให้ความยินยอมรับการรักษาข้าพเจ้าได้รับทราบคำประกาศสิทธิและข้อพึงปฏิบัติของผู้ป่วย และทราบว่าข้าพเจ้า
                    มีสิทธิที่ซักถามข้อสงสัยเกี่ยวกับการรักษาและสิทธิที่จะรับรู้วิธีการตรวจการรักษาทางเลือกอื่นๆรวมทั้งอาการไม่พึง
                    ประสงค์หรือภาวะแทรกซ้อนซึ่งอาจเกิดขึ้นได้ <br />
                    &emsp;ข้าพเจ้า&nbsp;
                    <FormControlLabel control={<Checkbox checked={data.consent_1 === "yes"} onChange={() => setData((prev) => ({ ...prev, consent_1: "yes" }))} />} label="ยินยอมโดยสมัครใจ" />
                    <FormControlLabel control={<Checkbox checked={data.consent_1 === "no"} onChange={() => setData((prev) => ({ ...prev, consent_1: "no" }))} />} label="ไม่ยินยอม" />
                    ให้คณะแพทย์ ทันตแพทย์ และบุคลากรทางการแพทย์ของโรงพยาบาลพระรามเก้า ทำการตรวจวินิจฉัยและให้การรักษาแบบผู้ป่วยนอก
                    ตามหลักวิชาการแพทย์ที่เหมาะสม
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    10.2 การเก็บรวมรวมข้อมูลส่วนบุคคล
                </p>
                <p className="text-base sm:text-lg mb-2 pl-8 leading-relaxed">
                    เมื่อข้าพเจ้าลงนามในเอกสารฉบับนี้ ข้าพเจ้ายืนยันว่าได้อ่านและรับทราบนโยบายคุ้มครองข้อมูลส่วนบุคคลของ
                    โรงพยาบาลพระรามเก้า รายละเอียดปรากฏตามเอกสารแนบครบถ้วนแล้ว ซึ่งนโยบายคุ้มครองข้อมูลส่วนบุคคล
                    ดังกล่าว อธิบายถึงวิธีการที่โรงพยาบาลพระรามเก้าจะทำการเก็บ รวบรวม ใช้ เปิดเผย และส่งหรือโอนข้อมูลส่วน
                    บุคคลใด ๆ ของข้าพเจ้า ข้าพเจ้ารับทราบและยืนยันว่าโรงพยาบาลพระรามเก้าสามารถอาศัยฐานทางกฎหมายอื่นใน
                    การทำการเก็บ รวบรวม ใช้ เปิดเผย และส่งหรือโอนข้อมูลส่วนบุคคลใด ๆ ของข้าพเจ้าได้ โดยไม่ต้องอาศัยความ
                    ยินยอมอย่างชัดแจ้ง ทั้งนี้ เป็นไปตามที่กฎหมายกำหนด เพื่อ
                </p>
                <p className="text-base sm:text-lg mb-2 pl-12 leading-relaxed">
                    (1) วัตถุประสงค์ใดซึ่งระบุไว้ในนโยบายคุ้มครองข้อมูลส่วนบุคคลของโรงพยาบาลพระรามเก้า และ/หรือเพื่อ
                    ประโยชน์ของข้าพเจ้า
                </p>
                <p className="text-base sm:text-lg mb-4 pl-12 leading-relaxed">
                    (2) ปฏิบัติให้เป็นไปตามบทบัญญัติของกฎหมายที่เกี่ยวข้อง รวมถึงเพื่อเวชศาสตร์ป้องกันหรืออาชีวเวชศาสตร์
                    การประเมินความสามารถในการทำงาน ของลูกจ้าง การวินิจฉัยโรคทางการแพทย์ การให้บริการด้านสุขภาพ
                    หรือด้านสังคม การรักษาทางการแพทย์การจัดการด้านสุขภาพ หรือระบบและการให้บริการด้านสังคม
                    สงเคราะห์ ประโยชน์สาธารณะด้านการสาธารณสุข เช่น การป้องกันด้านสุขภาพจากโรคติดต่ออันตรายหรือ
                    การควบคุมมาตรฐานหรือคุณภาพของยา เวชภัณฑ์ หรือเครื่องมือแพทย์ การคุ้มครองแรงงาน การ
                    ประกันสังคม หลักประกันสุขภาพแห่งชาติ สวัสดิการเกี่ยวกับการรักษาพยาบาลของผู้มีสิทธิตามกฎหมาย
                    การคุ้มครองผู้ประสบภัยจากรถ หรือการคุ้มครองทางสังคม การศึกษาวิจัยทางวิทยาศาสตร์ประวัติศาสตร์
                    หรือสถิติ ประโยชน์สาธารณะที่สำคัญอื่น ๆ
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    10.3 การเก็บรวมรวมข้อมูลส่วนบุคคลเพื่อนำส่งบริษัทประกันภัย บริษัทคู่สัญญา หรือบริษัทต้นสังกัดเพื่อประโยชน์ผู้ป่วย(หากมี) <br />
                    &emsp;ข้าพเจ้า&nbsp;
                    <FormControlLabel control={<Checkbox checked={data.consent_2 === "yes"} onChange={() => setData((prev) => ({ ...prev, consent_2: "yes" }))} />} label="ยินยอมโดยสมัครใจ" />
                    <FormControlLabel control={<Checkbox checked={data.consent_2 === "no"} onChange={() => setData((prev) => ({ ...prev, consent_2: "no" }))} />} label="ไม่ยินยอม" />
                    ให้โรงพยาบาลพระรามเก้ารวบรวม ใช้ เปิดเผยข้อมูลส่วน
                    บุคคล ในการเข้ารับการตรวจ การวินิจฉัย การรักษาพยาบาลหรือการให้บริการสุขภาพ รวมถึงรายละเอียดค่า
                    รักษาพยาบาล ค่าใช้จ่ายที่เกิดขึ้น ของข้าพเจ้าทั้งหมดได้ตามความเป็นจริง เพื่อการพิจารณาการจ่ายค่าสินไหม
                    ทดแทน ค่าชดเชย ค่าตรวจวินิจฉัยและรักษาพยาบาล ค่าใช้จ่ายใด ๆ ที่เกิดขึ้นจากการเข้ารับการรักษาพยาบาลของ
                    ข้าพเจ้าทั้งหมด (รวมเรียกว่า “ค่ารักษาพยาบาล”) ให้แก่ บริษัทประกันภัย/บริษัทคู่สัญญา/บริษัทต้นสังกัด/บุคคลหรือ
                    นิติบุคคลที่ต้องชำระค่ารักษาพยาบาลของข้าพเจ้า และในกรณีที่บริษัทประกันภัย/บริษัทคู่สัญญา/บริษัทต้นสังกัด/
                    บุคคลหรือนิติบุคคลที่ต้องชำระค่ารักษาพยาบาลฯ ปฏิเสธการจ่ายชดเชยค่ารักษาพยาบาลของข้าพเจ้า ข้าพเจ้าเป็น
                    ผู้รับผิดชอบชำระค่าใช้จ่ายที่เกิดขึ้นให้กับโรงพยาบาลพระรามเก้า โดยไม่มีเงื่อนไข
                </p>
                <p className="text-base sm:text-lg mb-2 pl-4 leading-relaxed">
                    10.4 การเก็บรวมรวมข้อมูลส่วนบุคคลเพื่อการแจ้งสิทธิประโยชน์ทางการแพทย์<br />
                    &emsp;ข้าพเจ้า&nbsp;
                    <FormControlLabel control={<Checkbox checked={data.consent_3 === "yes"} onChange={() => setData((prev) => ({ ...prev, consent_3: "yes" }))} />} label="ยินยอมโดยสมัครใจ" />
                    <FormControlLabel control={<Checkbox checked={data.consent_3 === "no"} onChange={() => setData((prev) => ({ ...prev, consent_3: "no" }))} />} label="ไม่ยินยอม" />
                    ให้โรงพยาบาลพระรามเก้าใช้ข้อมูลส่วนบุคคล เพื่อแจ้งสิทธิ
                    ประโยชน์ทางการแพทย์และส่งเสริม การขายการตลาด รายการผลิตภัณฑ์และบริการ รวมถึงสามารถส่งข้อมูล
                    ข่าวสารดังกล่าว หรือส่งแบบสอบถามเพื่อการประเมินผลการให้บริการของบริษัท ให้กับข้าพเจ้าได้ ซึ่งข้าพเจ้า
                    สามารถยกเลิกความยินยอมในการรับแจ้งข้อมูลข่าวสารได้ตามช่องทางที่โรงพยาบาลพระรามเก้ากำหนด
                </p>
                <p className="text-base sm:text-lg font-semibold mb-4 pt-6 leading-relaxed">
                    ข้าพเจ้าได้อ่านข้อกำหนด การให้บริการการแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ เข้าใจและยอมรับเงื่อนไขตาม
                    ข้อกำหนดนี้
                </p>
                <div className="flex items-center mb-4 pl-4">
                    <FormControlLabel control={<Checkbox checked={data.consent_4 === "yes"} onChange={() => setData((prev) => ({ ...prev, consent_4: "yes" }))} />} label="ยินยอม" />
                    <FormControlLabel control={<Checkbox checked={data.consent_4 === "no"} onChange={() => setData((prev) => ({ ...prev, consent_4: "no" }))} />} label="ไม่ยินยอม" />
                </div>
                <Box sx={{
                    margin: 2,
                }}>
                    <Button variant="text" color="error" onClick={handleClear} className="mt-2 w-full">
                        Clear Signature
                    </Button>
                    <SignaturePad
                        ref={sigPadRef}
                        canvasProps={{
                            width: 400,
                            height: 150,
                            className: "sigCanvas border border-2 m-auto rounded"
                        }}
                        onEnd={handleEnd}
                    />
                </Box>
                <TextField
                    label="ชื่อผู้ป่วย หรือ ผู้ลงนามแทนผู้ป่วย"
                    variant="standard"
                    value={data.signature_name}
                    className="w-full"
                    name="signature_name"
                    onChange={e => setData((prev) => ({ ...prev, signature_name: e.target.value }))}
                    error={Boolean(errors.signature_name)}
                    helperText={errors.signature_name}
                />
                {errors.signature && (
                    <div className="text-red-500 text-sm mt-1">{errors.signature}</div>
                )}
                {errors.hn && (
                    <div className="text-red-500 text-sm mt-1">{errors.hn}</div>
                )}
                {errors.consent_1 && (
                    <div className="text-red-500 text-sm mt-1">{errors.consent_1}</div>
                )}
                {errors.consent_2 && (
                    <div className="text-red-500 text-sm mt-1">{errors.consent_2}</div>
                )}
                {errors.consent_3 && (
                    <div className="text-red-500 text-sm mt-1">{errors.consent_3}</div>
                )}
                {errors.consent_4 && (
                    <div className="text-red-500 text-sm mt-1">{errors.consent_4}</div>
                )}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={processing}
                    children={<span>Submit</span>}
                />
                <div className="pb-6"></div>
            </form>
        </AppLayout>
    );
}
