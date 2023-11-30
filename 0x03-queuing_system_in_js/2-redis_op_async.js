import { createClient, print } from 'redis'
import { promisify} from 'util'

const client = createClient();
client.on('error', error => console.log("Redis client not connected to the server: ", error));
client.on('connect', async () => {
  console.log("Redis client connected to the server")
  await redisAsync();
})

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
  console.log(await promisify(client.GET).bind(client)(schoolName));
}

async function redisAsync() {
    await displaySchoolValue('Holberton');
    setNewSchool('HolbertonSanFrancisco', '100');
    await displaySchoolValue('HolbertonSanFrancisco');
}
