import { createFileRoute } from '@tanstack/react-router';
import { FaFacebook, FaUserCircle, FaWhatsapp } from 'react-icons/fa'; // Social & Contact Icons

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <section className='text-lg py-10 px-4 md:px-10 mx-auto rounded-lg mb-10'>
        {/* Logo + Title */}
        <div className='max-w-5xl mx-auto flex flex-col items-center mb-4'>
          <img
            src='/logo_wutdarn.png'
            alt='ວັດປ່າດານພຣະ logo'
            className='w-40 h-auto rounded-xl' // Increased width from w-24 to w-40
          />
          <h1 className='mt-3 text-2xl md:text-3xl font-bold text-center text-[#4b2e23]'>
            ວັດປ່າດານພຣະ
          </h1>
        </div>
        {/* About Section */}
        <div className='max-w-5xl mx-auto text-center mb-7'>
          {/* <h1 className={`font-bold mb-5 text-2xl md:text-3xl`}>ກ່ຽວກັບ</h1> */}
          <p className='leading-relaxed md:leading-loose max-w-5xl mx-auto px-0 3xl-extra md:text-2xl'>
            ເເອັບຄຳສອນພຣະພຸດທະເຈົ້າ,
            ສ້າງຂື້ນເພື່ອເຜີຍແຜ່ໃຫ້ພວກເຮົາທັງຫຼາຍໄດ້ສຶກສາ ແລະ ປະຕິບັດຕາມ,
            ດັ່ງທີ່ພຣະຕະຖາຄົດກ່າວວ່າ "ທຳມະຍິ່ງເປີດເຜີຍຍິ່ງຮຸ່ງເຮືອງ".
            ເມື່ອໄດ້ສຶກສາ ແລະ ປະຕິບັດຕາມ ຈົນເຫັນທຳມະຊາດຕາມຄວາມເປັນຈິງ
            ກໍຈະຫຼຸດພົ້ນຈາກຄວາມທຸກທັງປວງ.
          </p>
        </div>

        {/* Facebook Pages (Logo Grid) */}
        <div className='max-w-5xl mx-auto mb-6'>
          <h2 className='text-2xl font-semibold text-center mb-4'>
            Facebook Pages
          </h2>
          <div className='grid grid-cols-4 sm:grid-cols-4 gap-4 items-center justify-items-center'>
            {[
              {
                src: '/logo_wutdarn.png',
                alt: 'ວັດປ່າດານພຣະ',
                href: 'https://web.facebook.com/watdanpra',
              },
              {
                src: '/dhammakonnon.png',
                alt: 'ທັມມະກ່ອນນອນ',
                href: 'https://web.facebook.com/dhammakonnon',
              },
              {
                src: '/ຮຸ່ງເເສງເເຫ່ງທັມ.png',
                alt: 'ຮຸ່ງແສງແຫ່ງທັມ',
                href: 'https://www.facebook.com/Sumittosumittabounsong',
              },
              {
                src: '/ຕະຖາຄົຕພາສິຕ.png',
                alt: 'ຕະຖາຄົດພາສິດ',
                href: 'https://web.facebook.com/watpavimokkhavanaram.la',
              },
              {
                src: '/ພຸທທະວົງສ໌.png',
                alt: 'ພຸທທະວົງສ໌',
                href: 'https://www.facebook.com/dhammalife.laos',
              },
              {
                src: '/ວິນັຍສຸຄົຕ.png',
                alt: 'ວິນັຍສຸຄົຕ',
                href: 'https://www.facebook.com/profile.php?id=100091798479187',
              },
              {
                src: '/ວັດບ້ານນາຈິກ.png',
                alt: 'ວັດບ້ານນາຈິກ',
                href: 'https://www.facebook.com/phouhuck.phousamnieng.7',
              },
              {
                src: '/buddhaword.png',
                alt: 'ຄຳສອນພຣະພຸດທະເຈົ້າ',
                href: 'https://web.facebook.com/profile.php?id=100077638042542',
              },
            ].map((img) => (
              <a
                key={img.src}
                href={img.href}
                target='_blank'
                rel='noopener noreferrer'
                className='block'
                aria-label={img.alt}
                title={img.alt}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className='w-20 h-20 object-contain'
                  loading='lazy'
                />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className='text-2xl font-semibold text-center mb-5'>ຕິດຕໍ່</h2>
          <div className='flex flex-col items-center space-y-6'>
            {/* Phone Numbers */}
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center space-x-4'>
                <FaWhatsapp className='text-green-500 text-lg' />
                <a
                  href='https://wa.me/8562056118850'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-green-900 hover:underline'
                >
                  +8562056118850
                </a>
              </div>
              <div className='flex items-center space-x-4'>
                <FaWhatsapp className='text-green-500 text-lg' />
                <a
                  href='https://wa.me/8562078287509'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-green-900 hover:underline'
                >
                  +8562078287509
                </a>
              </div>
              <div className='flex items-center space-x-4'>
                <FaWhatsapp className='text-green-500 text-lg' />
                <a
                  href='https://wa.me/8562077801610'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-green-900 hover:underline'
                >
                  +8562077801610
                </a>
              </div>
              {/* ຕິດຕໍ່ Admin */}
              <div className='flex items-center space-x-4'>
                <FaUserCircle className='text-green-500 text-lg' />
                <a
                  href='https://tawk.to/chat/61763b9bf7c0440a591fc969/1fiqthn3u'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-green-900 hover:underline'
                >
                  ຕິດຕໍ່ Admin
                </a>
              </div>
              {/* WhatsApp Group */}
              <div className='flex items-center space-x-4'>
                <FaWhatsapp className='text-green-500 text-lg' />
                <a
                  href='https://chat.whatsapp.com/CZ7j5fhSatK37v76zmmVCK'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-green-900 hover:underline'
                >
                  Join WhatsApp Group
                </a>
              </div>
            </div>

            {/* Emails */}
            {/* <div className='flex items-center space-x-4'>
              <FaEnvelope className='text-brown-600 text-lg' />
              <a
                href='mailto:souliyappsdev@gmail.com'
                className='font-medium text-blue-600 hover:underline'
              >
                souliyappsdev@gmail.com
              </a>
            </div>
            <div className='flex items-center space-x-4'>
              <FaEnvelope className='text-brown-600 text-lg' />
              <a
                href='mailto:Katiya921@gmail.com'
                className='font-medium text-blue-600 hover:underline'
              >
                Katiya921@gmail.com
              </a>
            </div> */}

            {/* Social Links */}
            <div className='mt-6 text-center'>
              <h3 className='text-lg font-medium mb-2'>Follow Us</h3>
              <div className='flex flex-col items-center gap-3'>
                <a
                  href='https://web.facebook.com/watdanpra'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ວັດປ່າດານພຣະ</span>
                </a>
                <a
                  href='https://web.facebook.com/dhammakonnon'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ທັມມະກ່ອນນອນ</span>
                </a>

                <a
                  href='https://www.facebook.com/Sumittosumittabounsong'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ຮຸ່ງແສງແຫ່ງທັມ</span>
                </a>
                <a
                  href='https://web.facebook.com/watpavimokkhavanaram.la'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ຕະຖາຄົຕພາສິຕ</span>
                </a>

                <a
                  href='https://www.facebook.com/dhammalife.laos'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ພຸທທະວົງສ໌</span>
                </a>
                <a
                  href='https://www.facebook.com/profile.php?id=100091798479187'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ວິນັຍສຸຄົຕ</span>
                </a>
                <a
                  href='https://www.facebook.com/phouhuck.phousamnieng.7'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ວັດບ້ານນາຈິກ</span>
                </a>
                <a
                  href='https://www.facebook.com/profile.php?id=100077638042542'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 text-xl hover:underline flex items-center gap-2'
                >
                  <FaFacebook />
                  <span>ຄຳສອນພຣະພຸດທະເຈົ້າ</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
