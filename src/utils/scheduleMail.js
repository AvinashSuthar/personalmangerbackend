
// scheduler.js
const cron = require('node-cron');
const sendEmail = require('./mailer');

// Sample function to calculate the time difference and schedule the email
const scheduleEmail = (email, subject, text, scheduleTime) => {
  const now = new Date();
  const timeUntilSchedule = new Date(scheduleTime) - now;
 
  let taskTime = new Date(scheduleTime); // Assuming task.time is the time in milliseconds from the schema
  let formattedTaskTime = taskTime.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true });

  const mail = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Reminder</title>
  </head>
  <body>
      <p>Dear User,</p>
      <p>This is a friendly reminder that your task is scheduled to start in 4 minutes:</p>
      <p><strong>Task Title:</strong> ${subject}</p>
      <p><strong>Description:</strong> ${text}</p>
      <p><strong>Time:</strong> ${formattedTaskTime}</p>
      <p>We hope this reminder helps you prepare for your task.</p>
      <p>Best regards,</p>
      <p>Personal Manager<br>Avinash Suthar</p>
  </body>
  </html>`;
  const sub =  `Task Reminder: Starting in few minutes`;
  if (timeUntilSchedule <= 0) {
    console.log('Scheduled time is in the past. Cannot schedule email.');
    return;
  }
  sendEmail(email, "Task Scheduled: We'll Notify You 5 Minutes Before It Starts!", `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Scheduled Notification</title>
  </head>
  <body>
      <p>Dear User,</p>
      <p>We're pleased to inform you that your task has been successfully scheduled. We'll send you a reminder 5 minutes before the task starts to help you stay on track.</p>
      <p>Thank you for using our service to manage your tasks. If you have any questions or need to make changes to your schedule, please don't hesitate to contact us.</p>
      <p>Best regards,</p>
      <p>Personal Manager<br>Avinash Suthar</p>
  </body>
  </html>
  `);
  const cronTime = new Date(now.getTime() + timeUntilSchedule - 4*60000); 

  const cronExpression = `${cronTime.getSeconds()} ${cronTime.getMinutes()} ${cronTime.getHours()} ${cronTime.getDate()} ${cronTime.getMonth() + 1} *`;

  cron.schedule(
    cronExpression,
    () => {
      sendEmail(email, sub, mail);
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata', // Indian Standard Time (IST)
    }
  );

  console.log('Email scheduled for:', cronTime);
};

module.exports = scheduleEmail;
