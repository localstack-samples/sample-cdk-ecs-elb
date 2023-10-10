import * as cdk from 'aws-cdk-lib'
import {DockerImageAsset, Platform} from 'aws-cdk-lib/aws-ecr-assets'
import {Construct} from 'constructs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from "aws-cdk-lib/aws-ec2"
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns"

const path = require('path')

export class RepoStack extends cdk.Stack {
    /**
     *
     * @param {Construct} scope
     * @param {string} id
     * @param {StackProps=} props
     */
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        // base infrastructure
        const vpc = new ec2.Vpc(this, 'VPC', {maxAzs: 2})
        const cluster = new ecs.Cluster(this, 'Cluster', {
            clusterName: 'Services',
            vpc: vpc
        })

        const asset = new DockerImageAsset(this, 'service1', {
            directory: path.join(__dirname, '../../../src'),
            platform: Platform.LINUX_AMD64,
        })

        // task definition
        // Create a load-balanced Fargate service and make it public
        const albfs = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
            cluster: cluster, // Required
            cpu: 512, // Default is 256
            desiredCount: 2, // Default is 1
            taskImageOptions: {
                image: ecs.ContainerImage.fromDockerImageAsset(asset),
                containerPort: 3000,
            },
            memoryLimitMiB: 2048, // Default is 512
            listenerPort: 80,
            publicLoadBalancer: true // Default is true
        })

        new cdk.CfnOutput(this, 'serviceslb', {
            value: albfs.loadBalancer.loadBalancerDnsName,
        })
        new cdk.CfnOutput(this, 'localstackserviceslb', {
            value: `${albfs.loadBalancer.loadBalancerDnsName}:4566`,
        })
    }
}

module.exports = {RepoStack}
