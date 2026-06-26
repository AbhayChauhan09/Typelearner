# TypeLearner - Automated CI/CD Infrastructure

## Project Overview
TypeLearner is a full-stack application (Frontend, Backend, and PostgreSQL) deployed on AWS Fargate. This project focuses on complete **Infrastructure as Code (IaC)** and **Automated CI/CD** workflows, ensuring that no manual intervention is required once the pipeline is configured.

## Infrastructure Automation
* **Provisioning:** The entire infrastructure, including VPC, subnets, ECS Cluster, and ECR repositories, is created via Terraform (Infrastructure as Code).
* **Networking:** Custom VPC with dual public subnets, Internet Gateway, and isolated Security Groups for traffic isolation.
* **Load Balancing:** AWS Application Load Balancer (ALB) with path-based routing:
    * `/` -> Frontend (Port 5757)
    * `/api/*` -> Backend (Port 3000)

## CI/CD Pipeline
* **Workflow:** Automated using GitHub Actions.
* **Trigger:** Any merge into the `main` branch automatically triggers the deployment pipeline.
* **Process:** 
    * Build: Application images are built.
    * Push: Images are pushed to Amazon ECR.
    * Deploy: The ECS service is updated to deploy the new containers without manual intervention.
* **Health Monitoring:** ALB performs proactive health checks on the root (`/`) path to ensure high availability after deployment.

## Security and Best Practices
* **Credential Management:** Sensitive database credentials are handled using Terraform variables, avoiding hardcoded secrets in the repository.
* **Resource Hygiene:** Infrastructure lifecycle is optimized for clean teardowns using `terraform destroy`.
* **Clean Repository:** Maintained with a structured, root-level `.gitignore` to prevent sensitive files (such as `.tfstate`) from entering version control.

## How to Deploy
1. Infrastructure is provisioned automatically via the CI/CD pipeline.
2. To create the environment manually (if needed): `terraform init`, `terraform plan`, and `terraform apply`.
3. To remove all resources and clean the environment: `terraform destroy`.
