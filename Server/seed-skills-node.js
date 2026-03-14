const { MongoClient } = require('mongodb');

// Sử dụng cùng connection string với server
const uri = 'mongodb+srv://hoangphuc1806:Phucle%401806@connect4student.dbrrwmk.mongodb.net/connect4Student?retryWrites=true&w=majority';

const skills = [
  { name: "JavaScript" },
  { name: "React" },
  { name: "Node.js" },
  { name: "Python" },
  { name: "Java" },
  { name: "C/C++" },
  { name: "SQL" },
  { name: "UI/UX" },
  { name: "Git" },
  { name: "Communication" },
  { name: "Teamwork" },
  { name: "Problem Solving" },
  { name: "HTML/CSS" },
  { name: "TypeScript" },
  { name: "Vue.js" },
  { name: "Angular" },
  { name: "PHP" },
  { name: "C#" },
  { name: "MongoDB" },
  { name: "MySQL" },
  { name: "PostgreSQL" },
  { name: "Docker" },
  { name: "AWS" },
  { name: "Azure" },
  { name: "Google Cloud" },
  { name: "Machine Learning" },
  { name: "Data Analysis" },
  { name: "Project Management" },
  { name: "Agile/Scrum" },
  { name: "DevOps" }
];

async function seedSkills() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('connect4Student'); // Đảm bảo dùng đúng database name
    const skillsCollection = db.collection('skills');
    
    // Xóa tất cả skills cũ (nếu có)
    await skillsCollection.deleteMany({});
    console.log('Cleared existing skills');
    
    // Thêm skills mới
    const result = await skillsCollection.insertMany(skills);
    console.log(`Inserted ${result.insertedCount} skills`);
    
    // Hiển thị danh sách skills đã thêm
    const insertedSkills = await skillsCollection.find({}).toArray();
    console.log('Skills added:');
    insertedSkills.forEach(skill => {
      console.log(`- ${skill.name} (ID: ${skill._id})`);
    });
    
  } catch (error) {
    console.error('Error seeding skills:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedSkills();