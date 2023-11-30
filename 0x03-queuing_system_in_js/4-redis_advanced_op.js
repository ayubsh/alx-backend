import { createClient, print } from "redis";

const client = createClient();

client.on('error', (error) => {
  console.log('Redis client not connected to the server: ',error);
})

client.on('connect', () => {
  console.log('Redis client connected to the server')
  main();
})

function createHash(hname, fname, fvalue) {
  client.hset(hname, fname, fvalue);
}

function printhash(hname) {
  client.hgetall(hname, (_, val) => console.log(val));
}

function main() {
  const values = {
    
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,

  }

  for (let [f, v] of Object.entries(values)) {
    createHash('HolbertonSchools', f, v)
  }
  printhash('HolbertonSchools');
}
