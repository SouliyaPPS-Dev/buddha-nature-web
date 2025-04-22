import ios_addToHomeScreen from '@/assets/images/ios_addToHomeScreen.jpg';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NavbarItem } from '@heroui/navbar';
import { Button, Image, Modal } from 'antd';
import { useEffect, useState } from 'react';

function IOSInstaller() {
  const [isIOS, setIsIOS] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone;

    if (isSafari && !isStandalone) {
      setIsIOS(true);
    }
  }, []);

  const showModal = () => {
    setModalVisible(true);

    // Auto-close modal after 5 seconds
    setTimeout(() => {
      setModalVisible(false);
    }, 15000); // 15000ms = 15 seconds
  };

  if (!isIOS) return null;

  return (
    <NavbarItem className='sm:flex gap-2'>
      <Button
        type='primary'
        shape='round'
        icon={<PlusCircleOutlined />}
        onClick={showModal}
        style={{
          backgroundColor: '#795548',
          borderColor: '#795548',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Add to Home Screen
      </Button>

      <Modal
        title='Install App on iOS'
        visible={modalVisible}
        centered
        footer={[
          <Button key='close' onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        onCancel={() => setModalVisible(false)}
      >
        <p style={{ fontSize: '16px', textAlign: 'center' }}>
          📤 Tap the <strong>Share</strong> button in Safari, then select
          <strong> "Add to Home Screen"</strong>.
        </p>
        <Image
          src={ios_addToHomeScreen}
          alt='Add to Home Screen'
          preview={true}
          style={{
            marginTop: 10,
            width: '100%',
            height: 'auto',
            zIndex: 999,
          }}
        />
      </Modal>
    </NavbarItem>
  );
}

export default IOSInstaller;
