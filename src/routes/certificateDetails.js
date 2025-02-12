const express = require('express');
const router = express.Router();
const forge = require('node-forge');

router.post('/', (req, res) => {
    const { certificate } = req.body;

    if (!certificate) {
        return res.status(400).json({
            success: false,
            message: 'Certificate is required.',
        });
    }

    try {
        const sanitizedCertificate = certificate
            .replace(/\\n/g, '\n')
            .replace(/\r/g, '')
            .trim();

        const decodedCertificate = forge.pki.certificateFromPem(sanitizedCertificate);

        res.status(200).json({
            success: true,
            details: {
                issuer: decodedCertificate.issuer.attributes,
                subject: decodedCertificate.subject.attributes,
                validity: {
                    notBefore: decodedCertificate.validity.notBefore,
                    notAfter: decodedCertificate.validity.notAfter,
                },
                serialNumber: decodedCertificate.serialNumber,
            },
        });
    } catch (error) {
        console.error('Error parsing certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Invalid certificate format.',
        });
    }
});

module.exports = router;
