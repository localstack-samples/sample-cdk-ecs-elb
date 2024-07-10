SHELL := /bin/bash

-include .env-gdc-local

CDIR = cd iac/awscdk

export APP_NAME?=ecslb
export ENFORCE_IAM?=0

usage:			## Show this help in table format
	@echo "| Target                 | Description                                                       |"
	@echo "|------------------------|-------------------------------------------------------------------|"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/:.*##\s*/##/g' | awk -F'##' '{ printf "| %-22s | %-65s |\n", $$1, $$2 }'


deploy:			## Bootstrap and deploy the CDK app to AWS
	${CDIR}; cdk bootstrap; cdk deploy --outputs-file ./output.json --json

destroy:		## Destroy the deployed CDK stack in AWS
	${CDIR}; cdk destroy

destroy-local:	## Destroy the deployed CDK stack locally
	${CDIR}; cdklocal destroy

deploy-local:	## Bootstrap and deploy the CDK app locally
	${CDIR}; cdklocal bootstrap && \
		cdklocal deploy --outputs-file ./output.json --json --require-approval never

test:			## Run integration tests
	cd tests && npm run test

test-local:			## Run integration tests
	cd tests && LOCALSTACK=1 npm run test

curl-local:
	curl $(shell cat iac/awscdk/output.json | jq '.RepoStack.localstackserviceslb')

curl-aws:
	curl $(shell cat iac/awscdk/output.json | jq '.RepoStack.serviceslb')

install:		## Install npm dependencies
	${CDIR}; npm install


start-localstack:
	cd devops-tooling && docker compose -p $(APP_NAME) up

stop-localstack:
	cd devops-tooling && docker compose -p $(APP_NAME) down


PKG_SUB_DIRS := $(dir $(shell find . -type d -name node_modules -prune -o -type d -name "venv*" -prune -o -type f -name package.json -print))

update-deps: $(PKG_SUB_DIRS)
	for i in $(PKG_SUB_DIRS); do \
        pushd $$i && ncu -u && npm install && popd; \
    done

.PHONY: usage install test test-local deploy destroy deploy-local destroy-local bootstrap-local update-deps start-localstack stop-localstack curl-local curl-aws
