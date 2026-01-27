require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Company = require("../models/company");
const Resume = require("../models/resume");
const JobApp = require("../models/jobApp");

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Company.deleteMany({});
    await Resume.deleteMany({});
    await JobApp.deleteMany({});
    console.log("Cleared existing data");

    // Find demo user
    const demoUser = await User.findOne({
      username: process.env.DEMO_USER,
    });
    console.log("Found demo user");

    // Create companies
    const companies = await Company.insertMany([
      {
        user: demoUser._id,
        name: "TechCorp Solutions",
        website: "https://techcorp.example.com",
        description: "Leading enterprise software company",
        notes: "Met recruiter at job fair",
      },
      {
        user: demoUser._id,
        name: "DataFlow Inc",
        website: "https://dataflow.example.com",
        description: "Data analytics and visualization platform",
        notes: "Employee referral from John",
      },
      {
        user: demoUser._id,
        name: "CloudNine Systems",
        website: "https://cloudnine.example.com",
        description: "Cloud infrastructure services",
      },
      {
        user: demoUser._id,
        name: "StartupXYZ",
        website: "https://startupxyz.example.com",
        description: "Fast-growing fintech startup",
        notes: "Y Combinator backed",
      },
      {
        user: demoUser._id,
        name: "Global Enterprises",
        website: "https://globalent.example.com",
        description: "Fortune 500 consulting firm",
      },
    ]);
    console.log(`Created ${companies.length} companies`);

    // Create resumes
    const resumes = await Resume.insertMany([
      {
        user: demoUser._id,
        name: "Software Engineer - Full Stack",
        summary:
          "Experienced full-stack developer with 5+ years in web development",
        experience: [
          {
            company: companies[0]._id,
            title: "Senior Software Engineer",
            startDate: new Date("2022-01-15"),
            endDate: new Date("2025-12-31"),
            description:
              "Led development of microservices architecture. Built RESTful APIs using Node.js and Express. Implemented CI/CD pipelines.",
          },
          {
            company: companies[1]._id,
            title: "Software Engineer",
            startDate: new Date("2020-06-01"),
            endDate: new Date("2021-12-31"),
            description:
              "Developed data visualization dashboards using React and D3.js. Optimized database queries resulting in 40% performance improvement.",
          },
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            school: "State University",
            year: 2020,
          },
        ],
        projects: [
          {
            title: "E-commerce Platform",
            year: 2024,
            link: "https://github.com/demo/ecommerce",
            description:
              "Built full-stack e-commerce platform with payment integration",
          },
          {
            company: companies[0]._id,
            title: "Internal Tool Automation",
            year: 2023,
            description: "Automated deployment processes saving 10 hours/week",
          },
        ],
        certifications: [
          {
            title: "AWS Certified Developer",
            company: companies[2]._id,
            year: 2024,
          },
        ],
        skills: [
          "JavaScript",
          "Node.js",
          "React",
          "MongoDB",
          "PostgreSQL",
          "Docker",
          "AWS",
          "Git",
        ],
      },
      {
        user: demoUser._id,
        name: "Frontend Developer Specialist",
        summary:
          "Frontend specialist focused on React and modern web technologies",
        experience: [
          {
            company: companies[1]._id,
            title: "Frontend Developer",
            startDate: new Date("2021-03-01"),
            endDate: new Date("2025-11-30"),
            description:
              "Built responsive UI components. Improved page load times by 60%. Mentored junior developers.",
          },
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            school: "State University",
            year: 2020,
          },
        ],
        projects: [
          {
            title: "Portfolio Website Builder",
            year: 2025,
            link: "https://github.com/demo/portfolio-builder",
            description: "React-based drag-and-drop portfolio builder",
          },
        ],
        skills: ["React", "TypeScript", "CSS/SCSS", "Webpack", "Jest", "Figma"],
      },
      {
        user: demoUser._id,
        name: "Backend Engineer - API Focused",
        summary: "Backend engineer specializing in scalable API development",
        experience: [
          {
            company: companies[2]._id,
            title: "Backend Engineer",
            startDate: new Date("2021-08-01"),
            description:
              "Design and implement RESTful and GraphQL APIs. Work with microservices architecture. Optimize database performance.",
          },
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            school: "State University",
            year: 2020,
          },
          {
            degree: "M.S. Software Engineering",
            school: "Tech Institute",
            year: 2021,
          },
        ],
        certifications: [
          {
            title: "MongoDB Certified Developer",
            year: 2023,
          },
        ],
        skills: [
          "Node.js",
          "Express",
          "GraphQL",
          "MongoDB",
          "Redis",
          "Docker",
          "Kubernetes",
        ],
      },
    ]);
    console.log(`Created ${resumes.length} resumes`);

    // Create job applications
    const jobApps = await JobApp.insertMany([
      {
        user: demoUser._id,
        company: companies[0]._id,
        resume: resumes[0]._id,
        title: "Senior Full Stack Developer",
        status: "Interviewing",
        priority: "High",
        source: "LinkedIn",
        appliedAt: new Date("2026-01-10"),
        url: "https://techcorp.example.com/careers/senior-fullstack",
      },
      {
        user: demoUser._id,
        company: companies[1]._id,
        resume: resumes[0]._id,
        title: "Software Engineer III",
        status: "Applied",
        priority: "Medium",
        source: "Company Site",
        appliedAt: new Date("2026-01-15"),
        url: "https://dataflow.example.com/jobs/se3",
      },
      {
        user: demoUser._id,
        company: companies[2]._id,
        resume: resumes[2]._id,
        title: "Backend Engineer",
        status: "Offer",
        priority: "High",
        source: "Networking",
        appliedAt: new Date("2025-12-20"),
        url: "https://cloudnine.example.com/careers/backend-eng",
      },
      {
        user: demoUser._id,
        company: companies[3]._id,
        resume: resumes[1]._id,
        title: "Frontend Developer",
        status: "Rejected",
        priority: "Low",
        source: "Indeed",
        appliedAt: new Date("2025-12-05"),
        archived: true,
      },
      {
        user: demoUser._id,
        company: companies[4]._id,
        resume: resumes[0]._id,
        title: "Technology Consultant",
        status: "Applied",
        priority: "Medium",
        source: "LinkedIn",
        appliedAt: new Date("2026-01-18"),
        url: "https://globalent.example.com/careers/tech-consultant",
      },
      {
        user: demoUser._id,
        company: companies[0]._id,
        resume: resumes[2]._id,
        title: "API Platform Engineer",
        status: "Interviewing",
        priority: "High",
        source: "Company Site",
        appliedAt: new Date("2026-01-12"),
      },
    ]);
    console.log(`Created ${jobApps.length} job applications`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`- Users: 1`);
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Resumes: ${resumes.length}`);
    console.log(`- Job Applications: ${jobApps.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
};

seedDatabase();
