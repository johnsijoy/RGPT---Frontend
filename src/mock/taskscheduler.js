const taskScheduler = [
  {
    id: 1,
    recurringSchedule: 'Every Monday at 9 AM',
    active: 'Active',
    task: 'Weekly Report',
    scriptTagName: 'weekly-report-script',
    scheduleType: 'Recurring',
    fixedSchedule: '',
    emailCampaign: 'Weekly Summary Email',
    smsCampaign: 'Weekly Reminder SMS',
  },
  {
    id: 2,
    recurringSchedule: '',
    active: 'Inactive',
    task: 'Monthly Backup',
    scriptTagName: 'monthly-backup-script',
    scheduleType: 'Fixed',
    fixedSchedule: '1st of every month at 2 AM',
    emailCampaign: 'Monthly Backup Report',
    smsCampaign: '',
  },
  {
    id: 3,
    recurringSchedule: 'Every Friday at 5 PM',
    active: 'Active',
    task: 'Database Cleanup',
    scriptTagName: 'db-cleanup-script',
    scheduleType: 'Recurring',
    fixedSchedule: '',
    emailCampaign: '',
    smsCampaign: 'Cleanup Reminder SMS',
  },
  {
    id: 4,
    recurringSchedule: '',
    active: 'Inactive',
    task: 'Quarterly Review',
    scriptTagName: 'quarter-review-script',
    scheduleType: 'Fixed',
    fixedSchedule: 'March 31st at 6 PM',
    emailCampaign: 'Quarterly Summary',
    smsCampaign: 'Review Alert',
  }
];

export default taskScheduler;
