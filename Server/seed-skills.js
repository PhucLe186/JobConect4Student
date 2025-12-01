const { MongoClient } = require('mongodb');

const skills = [
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Node.js' },
  { name: 'Python' },
  { name: 'Java' },
  { name: 'C#' },
  { name: 'PHP' },
  { name: 'HTML/CSS' },
  { name: 'MongoDB' },
  { name: 'MySQL' },
  { name: 'PostgreSQL' },
  { name: 'Git' },
  { name: 'Docker' },
  { name: 'AWS' },
  { name: 'Azure' },
  { name: 'Figma' },
  { name: 'Photoshop' },
  { name: 'Marketing' },
  { name: 'SEO' },
  { name: 'Content Writing' },
  { name: 'Project Management' },
  { name: 'Agile/Scrum' },
  { name: 'Communication' },
  { name: 'Leadership' }
];

async function seedSkills() {
  const client = new MongoClient('mongodb+srv://hoangphuc1806:Phucle%401806@connect4student.dbrrwmk.mongodb.net/connect4Student?retryWrites=true&w=majority');
  
  try {
    await client.connect();
    const db = client.db('connect4Student');
    const collection = db.collection('skills');
    
    await collection.deleteMany({});
    const result = await collection.insertMany(skills);
    console.log(`Đã thêm ${result.insertedCount} skills`);
    
  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await client.close();
  }
}

seedSkills();