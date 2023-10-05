const { Stack, Duration, CfnOutput } = require('aws-cdk-lib');
const path = require('path');
const { DockerImageAsset, Platform } = require('aws-cdk-lib/aws-ecr-assets');
const ec2 = require('aws-cdk-lib/aws-ec2')
const ecs = require('aws-cdk-lib/aws-ecs')
const elbv2 = require('aws-cdk-lib/aws-elasticloadbalancingv2')
const ecr = require('aws-cdk-lib/aws-ecr')

class RepoStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // base infrastucture
		const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 })
		const cluster = new ecs.Cluster(this, 'Cluster', {
			clusterName: 'Services',
			vpc: vpc
		})
		const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
			vpc: vpc,
			internetFacing: true,
			loadBalancerName: 'serviceslb'
		})

    const asset = new DockerImageAsset(this, 'service1', {
      directory: path.join(__dirname, '../../../src'),
	  platform: Platform.LINUX_AMD64,
    });
    
    // task definition
		const taskDef = new ecs.FargateTaskDefinition(
			this,
			'taskDef',
			{
				compatibility: ecs.Compatibility.EC2_AND_FARGATE,
				cpu: '256',
				memoryMiB: '512',
				networkMode: ecs.NetworkMode.AWS_VPC
			}
		)
		const container = taskDef.addContainer('Container', {
			image: ecs.ContainerImage.fromDockerImageAsset(asset),
			memoryLimitMiB: 512,
			logging: new ecs.AwsLogDriver({
				streamPrefix: 'service1'
			}), 
			portMappings: [
				{
					containerPort: 3000,
					protocol: ecs.Protocol.TCP,
					hostPort: 3000
				}
			],
			essential: true
		})

    // create service
		const service = new ecs.FargateService(
			this,
			'service',
			{
				cluster: cluster,
				taskDefinition: taskDef,
				serviceName: 'service1', 
				desiredCount: 1,
				circuitBreaker: {
					rollback: true
				},
			}
		)

    // network the service with the load balancer
		const listener = alb.addListener('listener', {
				open: true,
				port: 80,
				protocol: elbv2.ApplicationProtocol.HTTP,
			}
		)

		// add target group to container
		listener.addTargets('service1', {
			targetGroupName: 'Service1Target',
			port: 80,
			targets: [service],
			deregistrationDelay: Duration.seconds(30),
			protocol: elbv2.ApplicationProtocol.HTTP,
			healthCheck: {
				enabled: true,
				path: '/',
				healthyThresholdCount: 2,
				unhealthyThresholdCount: 5,
				interval: Duration.seconds(5),
				timeout: Duration.seconds(4),
			}
		})

		new CfnOutput(this, 'serviceslb', {
			value: alb.loadBalancerDnsName,
		})
  }
}

module.exports = { RepoStack }
