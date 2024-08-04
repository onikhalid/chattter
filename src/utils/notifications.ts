import toast from 'react-hot-toast';

export type ToastNotification = 'success' | 'error' | 'neutral';

const getNotificationColor = (notificationType: ToastNotification) => {
  switch (notificationType) {
    case 'success': {
      return '#065f46';
    }

    case 'error': {
      return '#b91c1c';
    }

    case 'neutral': {
      return '#032282';
    }

    default: {
      throw new Error(`Unsupported notification type: ${notificationType}`);
    }
  }
};
export const launchNotification = (type: ToastNotification, text: string) => {
  toast(text, {
    style: {
      padding: '8px 20px',
      backgroundColor: getNotificationColor(type),
      color: '#ffffff',
      textAlign: 'center',
      overflowWrap: 'break-word',
      overflow: 'auto',
      bottom: '32px',
      fontSize: '14px',
    },
  });
};
