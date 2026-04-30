# Currency Insight Tracker
> **Automated Serverless Exchange Rate Monitoring System with IaC & CI/CD**

This project is a high-availability, serverless web application that automates the lifecycle of exchange rate data—from ingestion and storage to visualization. The entire infrastructure is managed as code (IaC) for 100% reproducibility.

---

## Architecture
The system follows an **Event-Driven Serverless Architecture**, designed for high scalability, security, and cost-efficiency.

### **Core Infrastructure Flow**
1.  **Automation**: **Amazon EventBridge** triggers a **Lambda** function daily to fetch and process exchange rate data.
2.  **Persistence**: Data is stored in **Amazon DynamoDB** using a time-series optimized schema.
3.  **Delivery**: **Amazon CloudFront** (CDN) serves the React frontend from **Amazon S3** (OAC-secured) with global low-latency.
4.  **API**: **AWS API Gateway (HTTP API)** acts as the entry point for the frontend to fetch historical data from Lambda.

---

## 🛠 Tech Stack & DevOps Integration

### **Infrastructure as Code (IaC)**
- **Terraform**: 100% of the AWS infrastructure is defined and managed via Terraform.
  - Managed resources: S3 (OAC), CloudFront, Lambda, API Gateway, DynamoDB, IAM Roles/Policies.
  - Used **Variables & Outputs** for modular and reusable configuration.

### **CI/CD Pipeline**
- **GitHub Actions**: Fully automated deployment pipeline.
  - **CI**: Automated build process (Vite/Node.js 20) to ensure code integrity.
  - **CD**: Automatic deployment to **S3** and **CloudFront Invalidation** upon pushing to the `main` branch.
  - **Security**: Managed sensitive credentials (AWS Access Keys, API URLs) using **GitHub Actions Environment Secrets**.

### **Frontend & Backend**
- **Frontend**: React (TypeScript), Chart.js, Vite.
- **Backend**: AWS Lambda (Node.js), Amazon API Gateway.
- **Database**: Amazon DynamoDB (NoSQL).

---

## Key Engineering Features
- **Zero-Maintenance Automation**: Daily data pipelines run autonomously without server management.
- **Security-First Design**: 
  - **Origin Access Control (OAC)**: S3 buckets are strictly private; access is only granted via CloudFront.
  - **Least Privilege (IAM)**: Fine-grained IAM policies for Lambda and CI/CD execution.
- **Cost-Effective Scalability**: Leveraging a **Pay-as-you-go** model, achieving near-zero idle costs.
- **Optimized CDN**: Implemented automated **Cache Invalidation** in the CI/CD pipeline to ensure immediate delivery of new updates.

---

## 📈 Infrastructure Management
The project has evolved from manual AWS console configuration to a mature **DevOps workflow**:
1.  **Code** (React/Node.js) -> **Git Push**
2.  **GitHub Actions** (Build & Test) -> **Auto-Deploy to AWS**
3.  **Terraform** (IaC) -> **Infrastructure Version Control**

---

## Notes
Check out [Currency Insight Tracker v2](https://github.com/junuiui/currency-insight-tracker-v2)