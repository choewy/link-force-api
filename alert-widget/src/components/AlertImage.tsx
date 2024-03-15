import { PlayTargetStoreProps } from '@stores';

type AlertImageProps = Readonly<{ playTarget: PlayTargetStoreProps | null }>;

export default function AlertImage({ playTarget }: AlertImageProps) {
  if (playTarget?.target?.imageUrl == null) {
    return null;
  }

  return <img alt="alert" src={playTarget.target.imageUrl} />;
}
