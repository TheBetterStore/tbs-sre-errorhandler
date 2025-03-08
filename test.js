
import {GetSecretValueCommand, SecretsManagerClient} from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient();

async function getDbParams() {

  const secretId = 'arn:aws:secretsmanager:ap-southeast-2:048116471576:secret:rds!cluster-f758d888-09b3-4bc1-b0b0-e408ac824554-ElvlWP';
  console.info('Entered SecretsClient.getDbParams(), retrieving secret for:', secretId);

  const params = {
    SecretId: secretId
  };

  const command = new GetSecretValueCommand(params);
  const response = await secretsClient.send(command);
  console.debug('Secret is:', response);
  const dbSecret = JSON.parse(response.SecretString || '{}');

  const dbParams = {
    hostname: 'test',
    username: dbSecret.username,
    password: dbSecret.password,
    dbName: 'test',
    connectionLimit: 'test',
  }
  console.log(dbParams);
  return dbParams;
}

(async () => {await getDbParams()})();