import { APP_URL } from '@common';
import { useParams } from 'react-router-dom';

export default function AlertIFrame() {
  const params = useParams();

  return (
    <iframe
      title="Ensemble AlertWidget"
      width="100%"
      src={[APP_URL, 'alert', params.id].join('/')}
      style={{
        border: 0,
        display: 'block',
        height: '100vh',
        backgroundColor: 'transparent',
      }}
    />
  );
}
