import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SignaturePad from "react-signature-canvas";
import { useRef } from "react";

type PageProps = {
    env: {
        url: string;
    };
};

export default function ConsentTelemedicine() {
    const { env } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        signature: "",
        consent1: false,
        consent2: false,
        consent3: false,
    });

    const sigPadRef = useRef<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

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
        if (!data.signature) {
            Swal.fire({
                icon: "warning",
                title: "Signature Required",
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
            post(env.url + "/telemedicine", {
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
                <Typography variant="h6" align="center" >
                    &emsp;ข้อกำหนดและการให้ความยินยอมรับบริการ การแพทย์ทางไกลหรือโทรเวช (telemedicine) และคลินิกออนไลน์
                </Typography>
                <Typography variant="subtitle2" align="center" className="mb-4">
                    Praram 9 Hospital Public Company Limited
                </Typography>
                <Typography variant="body1" className="mb-4">
                    &emsp;บริการ การแพทย์ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์ นี้ เป็นการให้บริการทางการแพทย์ โดยการส่งผ่านหรือการสื่อสาร
                    เนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้ประกอบวิชาชีพเวชกรรมด้วยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา คำแนะนำ แก่ผู้รับบริการหรือผู้รับบริบาล ซึ่งอยู่
                    ต่างสถานที่กัน เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรม ตามภาวะ วิสัย และพฤติการณ์ที่เป็นอยู่ขณะที่ให้บริการ การแพทย์
                    ทางไกลหรือโทรเวช (Telemedicine) และคลินิกออนไลน์
                </Typography>
                <Typography variant="body1" className="mb-4">
                    &emsp;<b>“โทรเวช”</b> หรือ <b>“การแพทย์ทางไกล” (telemedicine)</b> หมายความว่า เป็นการส่งผ่านหรือการสื่อสารเนื้อหาทางการแพทย์แผนปัจจุบันโดยผู้
                    ประกอบวิชาชีพเวชกรรมทั้งจากสถานพยาบาลภาครัฐและ/หรือเอกชนจากสถานที่หนึ่งไปยังอีกสถานที่หนึ่งโดยอาศัยวิธีการทางอิเล็กทรอนิกส์เพื่อให้การปรึกษา
                    คำแนะนำ แก่ผู้ประกอบวิชาชีพเวชกรรม หรือบุคคลอื่นใด เพื่อการดำเนินการทางการแพทย์ในกรอบแห่งความรู้ทางวิชาชีพเวชกรรม ตามภาวะวิสัย และ
                    พฤติการณ์ที่เป็นอยู่ โดยความยินยอมร่วมกันของผู้ให้บริบาลและผู้รับบริบาลในขณะนั้น ทั้งนี้โดยความรับผิดชอบของผู้ส่งผ่านหรือการสื่อสารเนื้อหาทางการ
                    แพทย์นั้นๆ
                </Typography>
                <Typography variant="body1" className="mb-4">
                    &emsp;<b>“สถานพยาบาล”</b> หมายความว่า สถานพยาบาลที่เป็นของภาครัฐและ/หรือเอกชน ที่จัดตั้งขึ้นตามกฎหมายที่เกี่ยวข้อง
                </Typography>
                <Typography variant="body1" className="mb-4">
                    &emsp;<b>“การให้บริบาลผ่านระบบบริบาลโทรเวช หรือ บริบาลการแพทย์ทางไกล”</b> หมายความว่า การดำเนินการโดย “โทรเวช” หรือ “การแพทย์ทางไกล”
                </Typography>
                <div className="mb-4">
                    <Typography variant="subtitle1" className="mb-2">Signature</Typography>
                    <div style={{ border: "1px solid #ccc", borderRadius: 4, background: "#fff" }}>
                        <SignaturePad
                            ref={sigPadRef}
                            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
                            onEnd={handleEnd}
                        />
                    </div>
                    <Button variant="outlined" color="secondary" onClick={handleClear} className="mt-2">
                        Clear Signature
                    </Button>
                </div>

                {/* <TextField
                    value={data.name}
                    name="name"
                    onChange={handleChange}
                    label="Name"
                    variant="standard"
                    className="w-full"
                />
                <FormControlLabel
                    label=" I agree to participate in telemedicine consultations."
                    required
                    control={<Checkbox checked={data.consent1} onChange={handleChange} name="consent1" />}
                /> */}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={processing}
                    children={<span>Submit</span>}
                />
            </form>
        </AppLayout>
    );
}
