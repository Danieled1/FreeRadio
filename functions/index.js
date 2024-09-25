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

// Example function to get radio stations
exports.getStations = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log("Function getStations called");
    try {
      console.log("Making request to Radio Browser API...");
      const response = await axios.get("https://de1.api.radio-browser.info/json/stations/bycountry/Israel");
      console.log("API response received:", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching radio stations:", error);
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
