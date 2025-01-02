import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

// Lao Locale
export const lao = {
  code: 'lao',
  week: {
    dow: 1, // Monday as the first day of the week.
    doy: 4, // First week of the year contains Jan 4th.
  },
  localize: {
    month: (n: number) =>
      [
        '1 ມັງກອນ',
        '2 ກຸມພາ',
        '3 ມີນາ',
        '4 ເມສາ',
        '5 ພຶດສະພາ',
        '6 ມິຖຸນາ',
        '7 ກໍລະກົດ',
        '8 ສິງຫາ',
        '9 ກັນຍາ',
        '10 ຕຸລາ',
        '11 ພະຈິກ',
        '12 ທັນວາ',
      ][n],
    day: (n: number) =>
      ['ອາທິດ', 'ຈັນ', 'ອັງຄານ', 'ພຸດ', 'ພະຫັດ', 'ສຸກ', 'ເສົາ'][n],
    dayPeriod: (n: string) => (n === 'am' ? 'ກ່ອນເທົາ' : 'ຫຼັງເທົາ'),
  },
  formatLong: {
    date: () => 'dd/MM/yyyy',
    time: () => 'HH:mm',
    dateTime: () => 'dd/MM/yyyy HH:mm',
  },
};

// Function to extract phone number and create links
export const extractPhoneNumber = (text: string) => {
  // Regular expression for Laos phone numbers starting with 020
  const phoneRegex = /(0\d{8,9})/g;
  const match = text.match(phoneRegex);

  if (match) {
    const phoneNumber = match[0].replace(/\D/g, ''); // Removing non-numeric characters
    return (
      <>
        <a href={`tel:+856${phoneNumber.slice(1)}`} className='text-blue-500'>
          <span className='flex items-center'>
            <span>Call {phoneNumber} </span>
            <FaPhoneAlt className='ml-1 w-4 h-4' />
          </span>
        </a>
        &nbsp;{' | '} &nbsp;
        <a
          href={`https://wa.me/+856${phoneNumber.slice(1)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-green-500' // WhatsApp green color
        >
          <span className='flex items-center'>
            <span>WhatsApp </span>
            <FaWhatsapp className='ml-1 w-4 h-4 text-green-500' />{' '}
            {/* Green color for the WhatsApp icon */}
          </span>
        </a>
      </>
    );
  }
  return null;
};
