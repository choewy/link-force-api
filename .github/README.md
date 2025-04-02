# GitHub Actions

## Secrets

### `deploy.yaml`

- `ENV_DEV`: 개발 환경의 .env 파일 전체 내용
- `ENV_PROD`: 운영 환경의 .env 파일 전체 내용
- `AWS_REGION`: AWS 리전
- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키
- `AWS_ECR_REPOSITORY_PREFIX`: ECR 저장소 접두사
- `AWS_ECS_TASK_DEFINITION`: ECS 태스크 정의 파일 경로
- `AWS_ECS_CONTAINER_NAME`: ECS 컨테이너 이름
- `AWS_ECS_SERVICE`: ECS 서비스 이름
- `AWS_ECS_CLUSTER`: ECS 클러스터 이름

### `send-secrets-to-slack.yaml`

- `SLACK_SECRET_WEBHOOK_URL`: Slack 환경변수 웹훅 URL