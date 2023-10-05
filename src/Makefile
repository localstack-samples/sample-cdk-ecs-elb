IMAGE_NAME = "nodejs-localstack"

build:			## Build the docker image
	docker build -t $(IMAGE_NAME) .

run:			## Run the docker image
	docker run -it --rm -p 3000:3000 -v $(PWD):/app $(IMAGE_NAME)

usage:			## Show this help in table format
	@echo "| Target                 | Description                                                       |"
	@echo "|------------------------|-------------------------------------------------------------------|"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/:.*##\s*/##/g' | awk -F'##' '{ printf "| %-22s | %-65s |\n", $$1, $$2 }' 
