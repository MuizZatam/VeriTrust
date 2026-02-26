const { generateRSAKeyPair } = require('./utils/keygen');
const fs = require('fs/promises');
const path = require('path');

const authController = {
  onRegister: async (req, res) => {
    try {
      const { publicKey, privateKey } = await generateRSAKeyPair();

      await fs.appendFile(path.join(__dirname, '../db/keys'), `${publicKey}\n`);

      res.status(200).json({
        success: true,
        data: { publicKey, privateKey },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to generate key pair",
        error: error.message,
      });
    }
  }
};

module.exports = authController;