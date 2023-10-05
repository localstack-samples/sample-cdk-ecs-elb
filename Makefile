CDIR = cd iac/awscdk

usage:			## Show this help in table format
	@echo "| Target                 | Description                                                       |"
	@echo "|------------------------|-------------------------------------------------------------------|"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/:.*##\s*/##/g' | awk -F'##' '{ printf "| %-22s | %-65s |\n", $$1, $$2 }'


deploy:			## Bootstrap and deploy the CDK app to AWS
	${CDIR}; cdk bootstrap; cdk deploy --outputs-file ./ouput.json --json 

destroy:		## Destroy the deployed CDK stack in AWS
	${CDIR}; cdk destroy

destroy-local:	## Destroy the deployed CDK stack locally
	${CDIR}; cdklocal destroy

deploy-local:	## Bootstrap and deploy the CDK app locally
	${CDIR}; cdklocal bootstrap && \
		cdklocal deploy --outputs-file ./ouput.json --json --require-approval never

test:			## Run integration tests
	npm run test

install:		## Install npm dependencies
	${CDIR}; npm install

.PHONY: usage install test deploy destroy deploy-local destroy-local bootstrap-local
