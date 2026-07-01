# MinIO storage profile

MinIO 전환 시 `FileStorageService` 구현을 교체하고 bucket, access policy, backup lifecycle은 환경변수와 운영 승인 절차로 관리한다. compose 기본 구성에는 운영 secret을 포함하지 않는다.
