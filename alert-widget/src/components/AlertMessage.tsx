import { PlayTargetStoreProps } from '@stores';

type AlertMessageProps = Readonly<{ playTarget: PlayTargetStoreProps | null }>;

export default function AlertMessage({ playTarget }: AlertMessageProps) {
  if (playTarget?.target?.message == null) {
    return null;
  }

  return <h1>{playTarget.target.message}</h1>;
}
