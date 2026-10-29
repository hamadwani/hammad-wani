import gradcamImage from '../assets/xray-gradcam-heatmap.png'

export const profile = {
  name: 'Hammad Wani',
  nickname: 'Hami',
  role: 'Final-year Computer Science student',
  focus: 'AI / ML · Computer Vision · Software Development',
  location: 'Srinagar, Jammu and Kashmir, India',
  email: 'hamadwani885@gmail.com',
  github: 'https://github.com/hamadwani',
  linkedin: 'https://www.linkedin.com/in/hamad-wani-6a7a7b335/',
}

export const researchProject = {
  title: 'MCI Progression Research',
  question: 'Can MRI, PET, and clinical information help classify whether patients with mild cognitive impairment progress to Alzheimer’s dementia within three years or remain stable?',
  modalities: ['MRI', 'PET', 'Clinical information'],
  outcomes: ['Progression to Alzheimer’s dementia within 3 years', 'Stable MCI'],
  disclaimer: 'Academic research only. This is not a validated clinical product or diagnostic tool.',
}

export const aboutCopy = [
  'I am a Computer Science and Engineering student at the University of Kashmir, interested in Artificial Intelligence, Machine Learning, Computer Vision, and software development. I enjoy building practical technology for real-world problems, especially in healthcare and data-driven applications.',
  'My work includes machine learning models, medical image datasets, web applications, and deep learning experiments. I am interested in AI research, useful software products, and collaborating on meaningful technology projects.',
]

export const skillGroups = [
  { title: 'Development', note: '01', skills: ['Python', 'Java', 'C', 'HTML', 'CSS', 'JavaScript'] },
  { title: 'AI & Data', note: '02', skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Transfer Learning', 'Dataset Analysis', 'Model Evaluation'] },
  { title: 'Frameworks & Libraries', note: '03', skills: ['TensorFlow', 'Keras', 'Scikit-learn', 'Pandas', 'Flask', 'FastAPI', 'OpenCV'] },
  { title: 'Web & Data Systems', note: '04', skills: ['Web Development', 'SQLite', 'SQLAlchemy', 'REST APIs', 'Model Integration'] },
  { title: 'Tools & Workflow', note: '05', skills: ['Python Scripting', 'Git', 'GitHub', 'Testing', 'Debugging'] },
  { title: 'Areas of Interest', note: '06', skills: ['Healthcare AI', 'Medical Image Analysis', 'Applied AI Research', 'Data-Driven Applications', 'AI Product Development'] },
]

export type Project = {
  number: string; title: string; category: string; description: string; contribution: string
  technologies: string[]; repository?: string; stage: string; stageKind: 'built' | 'progress' | 'research' | 'unknown'
  visual: string; visualLabel: string; image?: string; imageAlt?: string; featured?: boolean; disclaimer?: string
}

export const projects: Project[] = [
  { number: '01', title: 'MCI Progression Research', category: 'Final-year project · Healthcare AI', description: 'Studies whether MRI, PET, and clinical information can classify progression from mild cognitive impairment (MCI) to Alzheimer’s dementia within three years versus stable outcomes.', contribution: 'Final-year academic research project', technologies: ['MRI', 'PET', 'Clinical information', 'Three-year horizon'], stage: 'Final-year project', stageKind: 'research', visual: 'research', visualLabel: 'Research question · not model output', featured: true, disclaimer: 'Academic research only. Not a validated clinical product or diagnostic tool.' },
  { number: '02', title: 'Law Mitra AI', category: 'AI · Legal technology', description: 'An AI-focused legal technology project intended to make legal information and assistance more accessible.', contribution: 'Project development', technologies: ['JavaScript', 'Legal technology'], repository: 'https://github.com/hamadwani/Law_mitra.AI', stage: 'In development', stageKind: 'progress', visual: 'legal', visualLabel: 'Guidance · Cases · Help', featured: true },
  { number: '03', title: 'X-Ray Diagnosis AI', category: 'Healthcare AI · Computer vision', description: 'A chest X-ray classification research app using DenseNet121 transfer learning, Grad-CAM explanations, a Flask REST API, and a web interface.', contribution: 'AI application development', technologies: ['Python', 'DenseNet121', 'Grad-CAM', 'Flask'], repository: 'https://github.com/hamadwani/X-Ray-Diagnosis-AI', stage: 'Research prototype', stageKind: 'research', visual: 'medical', visualLabel: 'DenseNet121 · Grad-CAM · Flask', featured: true, disclaimer: 'For academic and research use only. Not for clinical diagnosis.' },
  { number: '04', title: 'Spendly', category: 'Web development · Personal finance', description: 'An expense-tracking application for recording and managing spending. The repository still marks database setup and several expense workflows as unfinished.', contribution: 'Application development', technologies: ['Python', 'Flask', 'HTML templates'], repository: 'https://github.com/hamadwani/Spendly', stage: 'In development', stageKind: 'progress', visual: 'finance', visualLabel: 'Track · Review · Manage', featured: true },
  { number: '05', title: 'Claude Code Clone', category: 'Python · AI development tools', description: 'A local coding-assistant prototype with a FastAPI backend, file-reading tools, and an Ollama connection to Qwen2.5-Coder.', contribution: 'Project implementation', technologies: ['Python', 'FastAPI', 'Ollama', 'Qwen2.5-Coder'], repository: 'https://github.com/hamadwani/claude-code-clone', stage: 'Prototype', stageKind: 'research', visual: 'assistant', visualLabel: 'Local model · File tools', featured: true },
  { number: '06', title: 'Face Recognizer Using OpenCV', category: 'Computer vision', description: 'A real-time face detection and recognition system using OpenCV and LBPH, with custom datasets, multiple users, and webcam recognition.', contribution: 'Face recognition system development', technologies: ['Python', 'OpenCV', 'LBPH'], repository: 'https://github.com/hamadwani/face_recognizer_using_openCV', stage: 'Built', stageKind: 'built', visual: 'vision', visualLabel: 'OpenCV · LBPH · Webcam', featured: true },
  { number: '07', title: 'X-Ray Diagnosis AI — Deep Learning Model', category: 'Machine learning · Medical imaging', description: 'A deep learning project for X-ray classification with DenseNet121 and Grad-CAM explainability. The repository includes generated heatmap outputs.', contribution: 'Model development and experimentation', technologies: ['Python', 'Deep Learning', 'DenseNet121', 'Grad-CAM'], repository: 'https://github.com/hamadwani/xray-diagnosis-ai', stage: 'Research prototype', stageKind: 'research', visual: 'medical', visualLabel: 'Actual project output · Grad-CAM', image: gradcamImage, imageAlt: 'Grad-CAM heatmap output over a chest X-ray from the project repository' },
  { number: '08', title: 'University Management Information System', category: 'Web development · Education technology', description: 'A web-based university management system covering student and enrollment records, staff, hostels, placements, scholarships, and exam results.', contribution: 'Web application development', technologies: ['Flask', 'Python', 'SQLite', 'SQLAlchemy', 'Bootstrap'], repository: 'https://github.com/hamadwani/university_mis', stage: 'Built', stageKind: 'built', visual: 'campus', visualLabel: 'Students · Programs · Results' },
  { number: '09', title: 'Personal Book Library', category: 'Web development', description: 'A front-end book-library project with title search, a responsive layout, and a sample collection of books.', contribution: 'Application development', technologies: ['HTML', 'CSS', 'JavaScript'], repository: 'https://github.com/hamadwani/Personal-Book-Library', stage: 'Built', stageKind: 'built', visual: 'library', visualLabel: 'Collection · Search · Read' },
  { number: '10', title: 'Web-Based Music Player', category: 'Web development', description: 'A browser-based music-player project focused on a web interface for playing music.', contribution: 'Front-end development', technologies: ['JavaScript', 'Web development'], repository: 'https://github.com/hamadwani/web-based-music-player', stage: 'Stage to confirm', stageKind: 'unknown', visual: 'music', visualLabel: 'Web audio experience' },
  { number: '11', title: 'Amazon Clone', category: 'Front-end web development', description: 'An HTML and CSS learning project recreating familiar e-commerce page structures and product sections.', contribution: 'Website development', technologies: ['HTML', 'CSS'], repository: 'https://github.com/hamadwani/side-project-an-Amazon-clone-', stage: 'Built', stageKind: 'built', visual: 'commerce', visualLabel: 'Storefront · Product grid' },
  { number: '12', title: 'Web-Based Age Calculator', category: 'Web development', description: 'A small web application that calculates a person’s age from their date of birth.', contribution: 'Web application development', technologies: ['HTML', 'Web development'], repository: 'https://github.com/hamadwani/Web-Based-Age-Calculator', stage: 'Stage to confirm', stageKind: 'unknown', visual: 'calendar', visualLabel: 'Date of birth · Age' },
]

export const experience = { role: 'Web Development Intern', organization: 'Code Alpha', duration: 'Three-month internship', description: 'Worked on web development projects using HTML, CSS, and JavaScript.', technologies: ['HTML', 'CSS', 'JavaScript'] }
export const education = { program: 'Computer Science and Engineering', institution: 'University of Kashmir', level: 'Undergraduate student', location: 'Srinagar, Jammu and Kashmir, India' }
