import { createFileRoute } from '@tanstack/react-router';
import { FaEnvelope, FaFacebook, FaPhoneAlt } from 'react-icons/fa'; // Social & Contact Icons

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <section className='text-lg py-10 px-4 md:px-10 mx-auto rounded-lg mb-20'>
        {/* About Section */}
        <div className='max-w-5xl mx-auto text-center mb-10'>
          <h1 className={`font-bold mb-6 text-2xl md:text-3xl`}>
            ກ່ຽວກັບແອັບຂອງເຮົາ
          </h1>
          <p className='leading-relaxed md:leading-loose max-w-5xl mx-auto px-0 3xl-extra md:text-2xl'>
            ແອັບນີ້ແມ່ນແອັບຄຳສອນພຣະພຸດທະເຈົ້າ,
            ສ້າງຂື້ນເພື່ອເຜີຍແຜ່ໃຫ້ພວກເຮົາທັງຫຼາຍໄດ້ສຶກສາ ແລະ ປະຕິບັດຕາມ,
            ດັ່ງທີ່ພຣະຕະຖາຄົດກ່າວວ່າ "ທຳມະຍິ່ງເປີດເຜີຍຍິ່ງຮຸ່ງເຮືອງ".
            ເມື່ອໄດ້ສຶກສາ ແລະ ປະຕິບັດຕາມ ຈົນເຫັນທຳມະຊາດຕາມຄວາມເປັນຈິງ
            ກໍຈະຫຼຸດພົ້ນຈາກຄວາມທຸກທັງປວງ.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className='text-2xl font-semibold text-center mb-8'>
            ຕິດຕໍ່ພວກເຮົາ
          </h2>
          <div className='flex flex-col items-center space-y-6'>
            {/* Phone Numbers */}
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center space-x-4'>
                <FaPhoneAlt className='text-brown-600 text-lg' />
                <a
                  href='https://wa.me/8562078287509'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-blue-600 hover:underline'
                >
                  +8562078287509
                </a>
              </div>
              <div className='flex items-center space-x-4'>
                <FaPhoneAlt className='text-brown-600 text-lg' />
                <a
                  href='https://wa.me/8562077801610'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-blue-600 hover:underline'
                >
                  +8562077801610
                </a>
              </div>
            </div>

            {/* Emails */}
            <div className='flex items-center space-x-4'>
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
            </div>

            {/* Social Links */}
            <div className='mt-6 text-center'>
              <h3 className='text-lg font-medium mb-2'>Follow Us</h3>
              <a
                href='https://www.facebook.com/profile.php?id=100077638042542'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 text-xl hover:underline flex items-center justify-center space-x-2'
              >
                <FaFacebook />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
