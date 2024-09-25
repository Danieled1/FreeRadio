/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({origin: true});

exports.getStations = functions.https.onRequest((req, res) => {
  cors(req, res, async () => { // Use CORS middleware
    try {
      const response = await axios.get("https://de1.api.radio-browser.info/json/stations/bycountry/Israel");
      res.set("Access-Control-Allow-Origin", "*"); // Allow all origins
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.json(response.data);
    } catch (error) {
      res.status(500).send("Error fetching radio stations");
    }
  });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
