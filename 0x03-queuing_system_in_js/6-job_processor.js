import { createQueue } from 'kue'

function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber} with message: ${message}`);
}

const que = createQueue();

que.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
})
