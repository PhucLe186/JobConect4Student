require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI in Server/.env');
}

const skills = [
  { name: 'JavaScript' },
  { name: 'React' },
  { name: 'Node.js' },
  { name: 'Python' },
  { name: 'Java' },
  { name: 'C/C++' },
  { name: 'SQL' },
  { name: 'UI/UX' },
  { name: 'Git' },
  { name: 'Communication' },
  { name: 'Teamwork' },
  { name: 'Problem Solving' },
  { name: 'HTML/CSS' },
  { name: 'TypeScript' },
  { name: 'Vue.js' },
  { name: 'Angular' },
  { name: 'PHP' },
  { name: 'C#' },
  { name: 'MongoDB' },
  { name: 'MySQL' },
  { name: 'PostgreSQL' },
  { name: 'Docker' },
  { name: 'AWS' },
  { name: 'Azure' },
  { name: 'Google Cloud' },
  { name: 'Machine Learning' },
  { name: 'Data Analysis' },
  { name: 'Project Management' },
  { name: 'Agile/Scrum' },
  { name: 'DevOps' },
];

async function seedSkills() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const skillsCollection = db.collection('skills');

    await skillsCollection.deleteMany({});
    console.log('Cleared existing skills');

    const result = await skillsCollection.insertMany(skills);
    console.log(`Inserted ${result.insertedCount} skills`);
  } catch (error) {
    console.error('Error seeding skills:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedSkills();
