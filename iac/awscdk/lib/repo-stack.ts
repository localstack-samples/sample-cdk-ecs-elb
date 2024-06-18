import * as cdk from 'aws-cdk-lib';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

const path = require('path');

export class RepoStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'VPC', {maxAzs: 2});
        const cluster = new ecs.Cluster(this, 'Cluster', {
            clusterName: 'Services',
            vpc: vpc
        });

        const asset = new DockerImageAsset(this, 'service1', {
            directory: path.join(__dirname, '../../../src'),
            platform: Platform.LINUX_AMD64,
        });

        // task definition
        const taskDefinition = new ecs.FargateTaskDefinition(this, "MyFargateTask", {
            cpu: 512,
            memoryLimitMiB: 2048,
        });

        taskDefinition.addVolume({
            name: 'local-src',
            host: {
                sourcePath: path.join(__dirname, '../../../src')
            }
        });

        const container = taskDefinition.addContainer("MyFargateContainer", {
            image: ecs.ContainerImage.fromDockerImageAsset(asset),
            logging: new ecs.AwsLogDriver({streamPrefix: "MyApp"}),
            memoryLimitMiB: 2048,
            cpu: 512
        });

        container.addPortMappings({
            containerPort: 3000,
            hostPort: 3000
        });

        container.addMountPoints({
            containerPath: '/app',
            sourceVolume: 'local-src',
            readOnly: false
        });

        const albfs = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
            cluster: cluster,
            desiredCount: 1,
            taskDefinition: taskDefinition,
            listenerPort: 80,
            publicLoadBalancer: true
        });

        new cdk.CfnOutput(this, 'serviceslb', {
            value: albfs.loadBalancer.loadBalancerDnsName,
        });
        new cdk.CfnOutput(this, 'localstackserviceslb', {
            value: `${albfs.loadBalancer.loadBalancerDnsName}:4566`,
        });
    }
}

module.exports = {RepoStack};
