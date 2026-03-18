import { Pinecone } from '@pinecone-database/pinecone';

async function main() {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) throw new Error("PINECONE_API_KEY is missing");

  const pc = new Pinecone({ apiKey });

  console.log("Checking for existing 'opensch' index...");
  const { indexes } = await pc.listIndexes();
  const exists = indexes?.some((index) => index.name === 'opensch');

  if (!exists) {
    console.log("Creating Pinecone index 'opensch'...");
    await pc.createIndex({
      name: 'opensch',
      dimension: 1536,
      metric: 'cosine',
      spec: { 
        serverless: { 
          cloud: 'aws', 
          region: 'us-east-1' 
        }
      } 
    });
    console.log("Index created successfully. Waiting a moment for it to initialize...");
    await new Promise(resolve => setTimeout(resolve, 5000));
  } else {
    console.log("Index 'opensch' already exists.");
  }
  
  // Describe index to get the host URL
  const indexModel = await pc.describeIndex('opensch');
  console.log(`PINECONE_INDEX_HOST=${indexModel.host}`);
}

main().catch(console.error);
