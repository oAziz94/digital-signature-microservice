const express = require('express');
const router = express.Router();
const forge = require('node-forge');
const crypto = require('crypto');
const logger = require('../logger'); // Import the logger


// POST /verifySignature
router.post('/', (req, res) => {
    try {
        const { data, signature, certificate } = req.body;

        // Validate input
        if (!data || !signature || !certificate) {
            return res.status(400).json({
                valid: false,
                message: 'Missing required fields: data, signature, or certificate',
            });
        }

        // Sanitize certificate to ensure correct formatting
        const sanitizedCertificate = certificate
            .replace(/\\n/g, '\n') // Replace escaped `\n` with actual newlines
            .replace(/\r/g, '')    // Remove carriage returns (if any)
            .trim();               // Remove leading/trailing spaces

        console.log('Sanitized Certificate:', sanitizedCertificate);

        // Decode base64 inputs
        const decodedData = Buffer.from(data, 'base64');
        const decodedSignature = Buffer.from(signature, 'base64');

        // Parse the sanitized certificate directly
        const decodedCertificate = forge.pki.certificateFromPem(sanitizedCertificate);

        // Extract the public key from the certificate and convert it to PEM format
        const publicKeyPem = forge.pki.publicKeyToPem(decodedCertificate.publicKey);

        // Verify the signature using Node.js crypto
        const isValid = crypto.verify(
            'sha256',
            decodedData,
            {
                key: publicKeyPem,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            decodedSignature
        );

        if (isValid) {
            logger.info('Signature verified successfully.');
            return res.status(200).json({
                valid: true,
                message: 'The signature is valid.',
            });
        } else {
            logger.warn('Signature verification failed.');
            return res.status(400).json({
                valid: false,
                message: 'Invalid signature or data.',
            });
        }
    } catch (error) {
        logger.error(`Error verifying signature: ${error.message}`);
        return res.status(500).json({
            valid: false,
            message: 'An error occurred while verifying the signature.',
        });
    }
});

module.exports = router;
