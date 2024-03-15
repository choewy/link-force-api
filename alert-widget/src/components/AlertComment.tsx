import { PlayTargetStoreProps } from '@stores';

type AlertCommentProps = Readonly<{ playTarget: PlayTargetStoreProps | null }>;

export default function AlertComment({ playTarget }: AlertCommentProps) {
  if (playTarget?.target == null) {
    return null;
  }

  return (
    <h1>
      ({playTarget.target.id}){playTarget.target.nickname}님 {playTarget.target.amount} 후원
    </h1>
  );
}
