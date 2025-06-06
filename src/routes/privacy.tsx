import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy')({
  component: RouteComponent,
});

function RouteComponent() {
  const lastUpdated = 'January 1, 2025';
  const appName = 'Buddhaword';
  const companyName = 'Buddha Nature';
  const contactEmail = 'souliyappsdev@gmail.com';

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow-lg rounded-lg p-8'>
          <header className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Privacy Policy
            </h1>
            <p className='text-gray-600'>Last updated: {lastUpdated}</p>
          </header>

          <div className='prose prose-lg max-w-none text-gray-700 space-y-8'>
            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                1. Introduction
              </h2>
              <p>
                Welcome to {appName} ("we," "our," or "us"), a Dharma learning
                and education information center dedicated to sharing the sacred
                words and teachings of Buddha. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you use our mobile application and related services
                (collectively, the "Service").
              </p>
              <p>
                {appName} serves as a comprehensive platform for Buddhist
                education, providing access to authentic Buddhist teachings,
                sutras, meditation guidance, and spiritual wisdom. Our mission
                is to make the profound teachings of Buddha accessible to
                learners worldwide, fostering understanding, compassion, and
                spiritual growth.
              </p>
              <p>
                By using our Service, you agree to the collection and use of
                information in accordance with this Privacy Policy. If you do
                not agree with our policies and practices, do not download,
                register with, or use this Service.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                2. Information We Collect
              </h2>

              <h3 className='text-xl font-medium text-gray-800 mb-3'>
                2.1 Personal Information
              </h3>
              <p>
                We may collect the following types of personal information to
                enhance your Dharma learning experience:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>
                  Name and contact information (email address, phone number)
                </li>
                <li>Account credentials (username, password)</li>
                <li>
                  Profile information and user preferences for personalized
                  Buddhist content
                </li>
                <li>Learning progress and meditation session data</li>
                <li>Favorite teachings, bookmarked sutras, and study notes</li>
                <li>
                  Communication data when you contact us for spiritual guidance
                  or support
                </li>
              </ul>

              <h3 className='text-xl font-medium text-gray-800 mb-3 mt-6'>
                2.2 Automatically Collected Information
              </h3>
              <ul className='list-disc pl-6 space-y-2'>
                <li>
                  Device information (device type, operating system, unique
                  device identifiers)
                </li>
                <li>
                  Usage data (Buddhist teachings accessed, meditation time,
                  study sessions, app features used)
                </li>
                <li>
                  Location data (with your permission, for localized Buddhist
                  community features)
                </li>
                <li>
                  Log data (IP address, access times, pages viewed, content
                  interactions)
                </li>
                <li>
                  Analytics data to improve our Dharma education content and
                  user experience
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                3. How We Use Your Information
              </h2>
              <p>
                We use the collected information for the following purposes to
                support your spiritual journey and Buddhist education:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>
                  To provide, maintain, and improve our Buddhist learning
                  platform and educational content
                </li>
                <li>
                  To personalize your Dharma learning experience and recommend
                  relevant teachings
                </li>
                <li>
                  To track your meditation progress and study achievements
                </li>
                <li>
                  To communicate with you about new Buddhist content, updates,
                  and spiritual guidance
                </li>
                <li>
                  To analyze usage patterns and optimize our educational
                  materials and app performance
                </li>
                <li>
                  To provide customer support and respond to your spiritual
                  inquiries
                </li>
                <li>
                  To comply with legal obligations and protect our rights while
                  maintaining the sacred nature of Buddhist teachings
                </li>
                <li>
                  To prevent fraud and ensure the security and authenticity of
                  our Buddhist content
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                4. Information Sharing and Disclosure
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                circumstances:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  service providers who assist us in operating our Service
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with
                  mergers, acquisitions, or asset sales
                </li>
                <li>
                  <strong>Consent:</strong> With your explicit consent for
                  specific purposes
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                5. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet or
                electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                6. Data Retention
              </h2>
              <p>
                We retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                7. Your Rights and Choices
              </h2>
              <p>
                Depending on your location, you may have the following rights:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p className='mt-4'>
                To exercise these rights, please contact us at {contactEmail}.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                8. Sacred Content and Buddhist Teachings
              </h2>
              <p>
                {appName} is committed to preserving and sharing authentic
                Buddhist teachings with the utmost respect and reverence. We
                ensure that all Dharma content, including sutras, meditation
                instructions, and spiritual guidance, is presented accurately
                and in accordance with traditional Buddhist principles.
              </p>
              <p>
                We may collect data about your interaction with Buddhist content
                (such as which teachings you study, meditation session
                durations, and bookmark preferences) solely to enhance your
                spiritual learning experience and provide personalized
                recommendations that support your path toward enlightenment.
              </p>
              <p>
                All sacred content within our app is treated with the highest
                level of respect and is protected by appropriate security
                measures to maintain its integrity and accessibility for future
                generations of practitioners.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                9. Third-Party Services
              </h2>
              <p>
                Our Service may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to review their privacy
                policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                10. Children's Privacy
              </h2>
              <p>
                Our Service is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                11. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                12. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. We encourage you
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                13. Contact Information
              </h2>
              <p>
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
              </p>
              <div className='bg-gray-100 p-4 rounded-lg mt-4'>
                <p>
                  <strong>{companyName}</strong>
                </p>
                <p>Email: {contactEmail}</p>
                <p>Address: Laos</p>
                <p>Phone: +856 2078287509</p>
              </div>
            </section>
          </div>

          <footer className='mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500'>
            <p>© 2025 {companyName}. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
