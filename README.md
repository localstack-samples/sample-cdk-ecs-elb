### 🌐 Overview

The sample application, utilizing the AWS Cloud Development Kit (AWS CDK) 🛠️, orchestrates the deployment of a containerized application 📦 on AWS Fargate within an Amazon ECS (Elastic Container Service) cluster. The CDK infrastructure-as-code model allows developers to define cloud resources using familiar programming languages 🖥️.

### 🔑 Key Components

- **🌍 VPC and Cluster:** 
  The script initiates a new Virtual Private Cloud (VPC) and an ECS Cluster, ensuring a secure 🔐 and isolated network environment and a logical grouping of ECS tasks and services, respectively.

- **🐳 Docker Image Asset:** 
  The `DockerImageAsset` class is used to build a Docker image from a local directory (specified path) and push it to Amazon Elastic Container Registry (ECR). The built image is then used in the ECS task definition.

- **🚀 Task Definition and Container Definition:** 
  An ECS task definition is created, specifying the Docker image to use, CPU 🖥️, and memory requirements, network mode, and logging configuration. A container within this task is defined, specifying port mappings and essential status.

- **🛳️ ECS Fargate Service:** 
  The ECS service is configured to run on Fargate, which allows running containers without managing the underlying instances. The service is configured with the above task definition, desired count of tasks, and a circuit breaker for handling failures.

- **⚖️ Application Load Balancer (ALB):** 
  An ALB is provisioned to distribute incoming HTTP/S traffic across multiple targets, such as ECS tasks, in multiple Availability Zones. A listener is added to the load balancer to check for connection requests from clients, using the HTTP protocol and listening on port 80.

- **🎯 Target Group and Health Checks:** 
  Targets (in this case, the ECS service) are registered with a target group, which the ALB uses to route traffic to. Health check settings ensure that traffic is routed only to healthy targets.

  ## Getting Started 🏁

This guide assumes that you have cloned the repository and are in the project root directory. The following steps will guide you through the process of building, deploying, and running the sample application both locally and on AWS.

### Prerequisites 🧰

- [Localstack Pro](https://localstack.cloud/pricing/)
- [Docker](https://docs.docker.com/get-docker/)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install)
- [Node.js](https://nodejs.org/en/download/)
- [cdklocal](https://docs.localstack.cloud/user-guide/integrations/aws-cdk/)


### Install Dependencies 📦

Install the project dependencies using the following command:

```bash
make install
```

## Deploying the Application on Localstack ☁️

### Step 1: Start LocalStack 🚦

Start the LocalStack server using the following command:

```bash
export LOCALSTACK_API_KEY=<YOUR_API_KEY>
DEBUG=1 localstack start
```

We specified `DEBUG=1` to get the printed LocalStack logs directly in the terminal to help us visualize the background tasks in action. If you prefer running LocalStack in detached mode, you can add the `-d` flag to the `localstack start` command, and use Docker Desktop to view the logs.

### Step 2: Deploy the Application 🚢

Deploy your application locally using the following command:

```bash
make deploy-local
```

This command will deploy your application to the LocalStack. Ensure that there are no errors.

### Step 3: Run Test Cases 🧪

Run the application test cases using the following command:

```bash
make test
```

Ensure that all test cases pass and pay attention to any output that is displayed. This step should validate that the application is functioning as expected.

## Deploying the Application on AWS ☁️

### Step 1: Deploy the Application 🚢

Deploy your application to AWS using the following command:

```bash
make deploy
```

This command will deploy your application to AWS. Ensure that there are no errors.

### Step 2: Run Test Cases 🧪

Run the application test cases using the following command:

```bash
make test
```

## 🚀 Configuring Visual Studio Code for Efficient Remote Node.js Debugging

Setting up Visual Studio Code for remote Node.js debugging enables smoother and more intuitive development workflows. This guide will walk you through the essential steps to configure your VSCode efficiently for remote debugging of your Node.js applications. 🛠️🔍

1️⃣ **Adding a Task to Wait for Remote Debugger Server** 🕰️

   First, let's ensure that VSCode waits for the remote debugger server to be available. Add a new task by creating or modifying the `.vscode/tasks.json` file in your project directory.

   ```json
   {
       "version": "2.0.0",
       "tasks": [
           {
               "label": "Wait Remote Debugger Server",
               "type": "shell",
               "command": "while [[ -z $(docker ps | grep :9229) ]]; do sleep 1; done; sleep 1;"
           }
       ]
   }
   ```

2️⃣ **Setting up Debugging Configuration** 🎛️

   Next, define how VSCode should connect to the remote Node.js application. Create a new `launch.json` file or modify an existing one from the *Run and Debug* tab, then add the following configuration.

   ```json
   {
       "version": "0.2.0",
       "configurations": [
           {
               "address": "127.0.0.1",
               "localRoot": "${workspaceFolder}",
               "name": "Attach to Remote Node.js",
               "port": 9229,
               "remoteRoot": "/var/task/",
               "request": "attach",
               "type": "node",
               "preLaunchTask": "Wait Remote Debugger Server"
           },
       ]
   }
   ```

3️⃣ **Running the Debugger** 🏃

   Finally, run the debugger by selecting the *Attach to Remote Node.js* configuration from the *Run and Debug* tab. You can now set breakpoints and debug your Node.js application running in a Docker container. 🐳

## 📚 Resources 📚

- [LocalStack CLI Documentation](https://docs.localstack.cloud/getting-started/installation/)
- [LocalStack API Documentation](https://docs.localstack.cloud/user-guide/aws/feature-coverage/)
- [Localstack CDK Documentation](https://docs.localstack.cloud/user-guide/integrations/aws-cdk/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)