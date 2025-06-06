import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function ConsentTelemedicine() {
    const { data, setData, post, processing, errors } = useForm({
        consent1: false,
        consent2: false,
        consent3: false,
        name: "",
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/consent/telemedicine", {
            onSuccess: () => {
                // Handle success, e.g., show a success message or redirect
            },
            onError: () => {
                // Handle error, e.g., show an error message
            },
        });
    };

    return (
        <AppLayout>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="consent1"
                            checked={data.consent1}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        I agree to participate in telemedicine consultations.
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="consent2"
                            checked={data.consent2}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        I understand the risks and limitations of telemedicine.
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="consent3"
                            checked={data.consent3}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        I consent to the electronic storage of my medical information.
                    </label>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={!(data.consent1 && data.consent2 && data.consent3 && data.name && data.email)}
                >
                    Submit
                </button>
            </form>
        </AppLayout>
    );
}
