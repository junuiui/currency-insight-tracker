# Currency Insight Tracker (v1 - serverless)
> **Automated Serverless Exchange Rate Monitoring and Visualization System**

This project is a fully automated, serverless web application designed to track, store, and visualize historical exchange rate data using an AWS cloud-native architecture.

---

## Architecture
The system utilizes an **Event-Driven Serverless Architecture** to ensure high scalability, cost-efficiency, and zero maintenance overhead.


### Data Flow
1. **Trigger**: **Amazon EventBridge** initiates the process based on a predefined daily schedule.
2. **Compute**: **AWS Lambda** fetches real-time exchange data from external APIs and processes it.
3. **Storage**: The processed data is persisted in **Amazon DynamoDB** as time-series records.
4. **Delivery**: Users access the interface via **Amazon CloudFront**, which serves static assets from **Amazon S3** and retrieves data from the backend to render interactive charts.

---

## Tech Stack

### Frontend and Deployment
- **Framework**: React (TypeScript), Chart.js
- **Content Delivery**: **AWS CloudFront** - Managed HTTPS (SSL) and low-latency edge caching.
- **Storage**: **AWS S3** - Static web hosting secured with Origin Access Control (OAC).

### Backend and Automation
- **Compute**: **AWS Lambda**
  - `GetRate`: Function to fetch real-time exchange data from external providers.
  - `WriteRate`: Function to handle business logic and persist data to the database.
- **Orchestration**: **AWS EventBridge**
  - Scheduled triggers for end-to-end data pipeline automation.

### Database
- **NoSQL Storage**: **AWS Amazon DynamoDB**
  - Fully managed Key-Value database optimized for high-performance retrieval of time-series currency data.

---

## Key Features
- **Data Pipeline Automation**: Daily updates are handled autonomously via EventBridge without manual intervention.
- **Serverless Efficiency**: Implements a "Pay-as-you-go" model, maintaining optimal cost-efficiency for various traffic levels.
- **Cloud Security Best Practices**: The S3 bucket remains private, with access strictly controlled via CloudFront OAC.
- **Data Visualization**: Interactive and responsive historical rate charts implemented with Chart.js.

---

## Infrastructure as Code (Planned)
- **Terraform**: The infrastructure is currently being transitioned from manual configuration to **Infrastructure as Code (IaC)** to ensure consistency, version control, and repeatable deployments.

---

## Contact
- **Author**: Software Systems Graduate, Simon Fraser University (SFU)
- **Specialization**: Cloud Engineering, DevOps, Infrastructure as Code, SWE

---

## Todos
1. Terraform Intergration (Migrate from Manual to Terraform automation)
2. Build CI/CD


---

## Notes
Check out [Currency Insight Tracker v2](https://github.com/junuiui/currency-insight-tracker-v2)