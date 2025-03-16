Environment=prod
DEPLOY_BUCKET=$MY_DEPLOY_BUCKET

APP_NAME=tbs-sre-errorhandler
STACK_NAME=$APP_NAME-$Environment

sam build --cached

sam deploy --stack-name $stackName \
--s3-bucket $samDeployBucket --s3-prefix sam/$appName \
--capabilities CAPABILITY_NAMED_IAM --region $region \
--parameter-overrides Environment=$environment \
LoginCFStackName=tbs-devops-toolkit-login-$environment \
Route53AppDomainName=$route53AppDomainName \
AppLoggingLevel='DEBUG' \
AllowedCorsDomains=$allowedCorsDomains \
--no-fail-on-empty-changeset \
--tags StackName=$stackName Environment=$environment Product=$appName \
--profile thebetterstore
