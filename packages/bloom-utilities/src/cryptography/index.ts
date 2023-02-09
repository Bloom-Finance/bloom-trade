import crypto from 'crypto';

/**
 * It generates a random 256-bit key and returns it as a hex string
 * @returns An object with two properties: key and ivLength.
 */
const getKeyAndIV = () => {
  return {
    key: crypto.randomBytes(256 / 8).toString('hex'),
    ivLength: 16,
  };
};

/**
 * It takes a string, encrypts it, and returns a string
 * @param {string} content - The content to be encrypted.
 * @param {string} key - The key used to encrypt the content.
 * @param {number} iv_length - 16
 * @returns The encrypted content iv:encryptedContent
 */
const aes256Encrypt = (content: string, key: string, iv_length: number) => {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(iv_length);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(content);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * It takes a string, splits it into two parts, converts each part to a buffer, creates a decipher,
 * updates the decipher with the encrypted text, concatenates the decrypted text with the decipher, and
 * returns the decrypted text as a string
 * @param content - The encrypted content
 * @param {string} key - The key used to encrypt the data.
 * @returns The decrypted text.
 */
const aes256Decrypt = (content, key: string) => {
  const algorithm = 'aes-256-cbc';
  const [iv, encryptedText] = content
    .split(':')
    .map((part) => Buffer.from(part, 'hex'));

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, 'hex'),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export { aes256Encrypt, getKeyAndIV, aes256Decrypt };
