const express = require('express');
const admin = require('firebase-admin');
const cron = require('node-cron');

const serviceAccount = require('./path/to/serviceAccountKey.json'); // Replace with your service account file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const app = express();

const axios = require('axios');

// Schedule task to send messages at 10:00 AM
cron.schedule('0 10 * * *', async () => {
  try {
    // Retrieve data from an API
    const response = await axios.get('https://example.com/api/users'); // Replace with your API endpoint

    // Process the API response and retrieve the users in the desired group
    const users = response.data.filter(user => user.group === 'desiredGroup');

    // Send FCM messages to the users
    users.forEach(user => {
      const message = {
        token: user.fcmToken,
        notification: {
          title: 'Your notification title',
          body: 'Your notification message',
        },
      };

      admin.messaging().send(message)
        .then((response) => {
          console.log('Notification sent successfully:', response);
        })
        .catch((error) => {
          console.log('Error sending notification:', error);
        });
    });
  } catch (error) {
    console.error('Error retrieving data from API:', error);
  }
});

// Repeat the above logic for the remaining scheduled tasks at 11:00 AM and 12:00 PM

// Add your Firebase Cloud Messaging logic here

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
