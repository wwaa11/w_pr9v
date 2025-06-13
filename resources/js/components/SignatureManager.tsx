import { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Box, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

interface SignatureManagerProps {
    initialSignature?: string;
    onSignatureUpdate?: (signature: string) => void;
}

export default function SignatureManager({ initialSignature, onSignatureUpdate }: SignatureManagerProps) {
    const [signature, setSignature] = useState<string | null>(initialSignature || null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const signaturePadRef = useRef<SignaturePad>(null);

    useEffect(() => {
        if (initialSignature) {
            setSignature(initialSignature);
        }
    }, [initialSignature]);

    const handleClear = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
        setSignature(null);
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        if (!signaturePadRef.current) return;

        const isEmpty = signaturePadRef.current.isEmpty();
        if (isEmpty) {
            setError('Please draw your signature before saving');
            return;
        }

        const signatureData = signaturePadRef.current.toDataURL();
        setSignature(signatureData);

        try {
            const response = await axios.post('/api/update-signature', {
                signature: signatureData
            });

            if (response.status === 200) {
                setSuccess('Signature saved successfully');
                setError(null);
                if (onSignatureUpdate) {
                    onSignatureUpdate(signatureData);
                }
            }
        } catch (err) {
            setError('Failed to save signature');
            setSuccess(null);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Draw Your Signature
                </Typography>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        mb: 2,
                        backgroundColor: '#fff'
                    }}
                >
                    <SignaturePad
                        ref={signaturePadRef}
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: 'signature-canvas'
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button variant="outlined" onClick={handleClear}>
                        Clear
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save Signature
                    </Button>
                </Box>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                {success && (
                    <Typography color="success.main" sx={{ mb: 2 }}>
                        {success}
                    </Typography>
                )}
            </Paper>

            {signature && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Current Signature
                    </Typography>
                    <Box
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            p: 2,
                            backgroundColor: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200
                        }}
                    >
                        <img
                            src={signature}
                            alt="Current Signature"
                            style={{ maxWidth: '100%', maxHeight: 200 }}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
} 