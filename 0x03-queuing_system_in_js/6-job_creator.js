import { createQueue } from 'kue'

const que = createQueue({name: 'push_notification_code'});

const job = que.createJob('push_notification_code', {
  phoneNumber: '12345',
  message: 'successful'
})

job.on('enqueue', () => {
  console.log('Notification job created', job.id)
}).on('complete',() => {
  console.log('Notification job completed')
}).on('failed', () => console.log('Notification job failed'))

job.save();
