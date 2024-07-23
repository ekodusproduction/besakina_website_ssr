import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export function formatINR(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount);
  }

  return amount
    .toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR',
    })
    .replace('₹', '₹ ');
}

export function formatAadhaarNumber(value) {
  const cleaned = value.replace(/\D/g, '');

  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';

  return formatted;
}

dayjs.extend(relativeTime);

export function formatDate(createdAt) {
  const date = dayjs(createdAt);
  const now = dayjs();
  const diffInDays = now.diff(date, 'day');

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays === 2) {
    return '2 days ago';
  } else {
    return date.format('DD/MM/YYYY');
  }
}

export function convertString(str) {
  // Replace underscores with spaces
  return str.replace(/_/g, ' ');
}
