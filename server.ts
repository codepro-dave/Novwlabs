import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database for Community Hub & Projects
interface CommunityProject {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  location: string;
  category: 'Robotics' | 'AI & Software' | 'Agritech' | 'Clean Energy' | 'Healthcare' | 'Space';
  summary: string;
  problem: string;
  solution: string;
  materials: { name: string; costUsd: number; costNgn: number }[];
  votes: number;
  votedUserIds: string[];
  commentsCount: number;
  stage: 'Concept' | 'Prototype' | 'Testing' | 'Deployed';
  createdAt: string;
  codeSnippet?: string;
}

let communityProjects: CommunityProject[] = [
  {
    id: 'proj-1',
    title: 'Solar-Powered Autonomous Crop Health Drone',
    author: 'Tunde Adebayo',
    authorAvatar: '👨🏾‍🔬',
    location: 'Ibadan, Nigeria',
    category: 'Agritech',
    summary: 'Multispectral drone scanning cassava and maize farms for early blight detection using edge AI running on Raspberry Pi Pico W.',
    problem: 'Smallholder farmers lose up to 40% of yield to pest infestations and nutrient deficiency that are detected too late.',
    solution: 'Autonomous lightweight quadcopter equipped with a modified NIR sensor and edge-classification model that maps stress zones and sends SMS alerts via GSM.',
    materials: [
      { name: 'Carbon Fiber Quadcopter Frame 450mm', costUsd: 45, costNgn: 67500 },
      { name: 'Brushless DC Motors (4x) & 30A ESCs', costUsd: 55, costNgn: 82500 },
      { name: 'Raspberry Pi Pico W Microcontroller', costUsd: 8, costNgn: 12000 },
      { name: 'Multispectral NDVI Sensor Module', costUsd: 65, costNgn: 97500 },
      { name: '3S 4500mAh LiPo Battery & Solar Charger', costUsd: 38, costNgn: 57000 },
    ],
    votes: 84,
    votedUserIds: [],
    commentsCount: 19,
    stage: 'Testing',
    createdAt: '2026-08-14',
    codeSnippet: `# MicroPython NDVI Edge Sampler
from machine import Pin, ADC
import time

sensor = ADC(Pin(26))
def calculate_ndvi():
    nir = sensor.read_u16() / 65535.0
    # calibrated index
    ndvi_index = (nir - 0.28) / (nir + 0.28 + 1e-5)
    return round(ndvi_index, 3)

while True:
    ndvi = calculate_ndvi()
    print("Telemetry NDVI Index:", ndvi)
    time.sleep(2)`
  },
  {
    id: 'proj-2',
    title: 'Low-Cost Bionic Prosthetic Arm with EMG Control',
    author: 'Amina Bello',
    authorAvatar: '👩🏾‍💻',
    location: 'Abuja, Nigeria',
    category: 'Healthcare',
    summary: '3D-printed modular robotic prosthetic hand operated through surface EMG sensors and Arduino Nano with haptic feedback.',
    problem: 'Commercial myoelectric prosthetics cost between $15,000 and $50,000, making them inaccessible to 95% of amputees across emerging markets.',
    solution: 'Open-hardware 3D printable tendon-driven mechanical hand powered by 5 high-torque metal gear servos and an EMG sensor armband costing under $130.',
    materials: [
      { name: 'PETG 3D Printing Filament (1kg)', costUsd: 22, costNgn: 33000 },
      { name: 'MG996R High Torque Metal Servos (5x)', costUsd: 32, costNgn: 48000 },
      { name: 'Arduino Nano V3 & Breakout Shield', costUsd: 12, costNgn: 18000 },
      { name: 'MyoWare 2.0 Muscle EMG Sensor', costUsd: 40, costNgn: 60000 },
      { name: '7.4V 2200mAh Dual-Cell Li-ion Pack', costUsd: 18, costNgn: 27000 },
    ],
    votes: 112,
    votedUserIds: [],
    commentsCount: 34,
    stage: 'Prototype',
    createdAt: '2026-09-02',
    codeSnippet: `// Arduino EMG Servo Hand Controller
#include <Servo.h>

Servo thumbServo;
const int emgPin = A0;
const int threshold = 480;

void setup() {
  thumbServo.attach(9);
  thumbServo.write(10); // open
  Serial.begin(9600);
}

void loop() {
  int emgVal = analogRead(emgPin);
  if (emgVal > threshold) {
    thumbServo.write(90); // grip closed
  } else {
    thumbServo.write(10); // relaxed open
  }
  delay(20);
}`
  },
  {
    id: 'proj-3',
    title: 'Decentralized Microgrid Smart Meter with LoRa',
    author: 'Chinedu Eze',
    authorAvatar: '⚡',
    location: 'Enugu, Nigeria',
    category: 'Clean Energy',
    summary: 'Mesh-networked solar microgrid energy distributor with automatic load balancing and peer-to-peer solar energy trading.',
    problem: 'Off-grid communities face severe energy wastage and blackout spikes due to lack of automated peer load-sharing.',
    solution: 'ESP32-based bidirectional current monitoring system communicating over a 5km LoRa mesh with automatic prepaid metering.',
    materials: [
      { name: 'ESP32 NodeMCU Development Board', costUsd: 7, costNgn: 10500 },
      { name: 'SX1278 433MHz LoRa Transceiver', costUsd: 9, costNgn: 13500 },
      { name: 'ACS712 30A Current Sensor IC', costUsd: 5, costNgn: 7500 },
      { name: 'Solid State Relay 40A DC', costUsd: 14, costNgn: 21000 },
      { name: 'OLED 0.96 inch I2C Display', costUsd: 4, costNgn: 6000 },
    ],
    votes: 95,
    votedUserIds: [],
    commentsCount: 22,
    stage: 'Deployed',
    createdAt: '2026-09-18',
    codeSnippet: `// ESP32 LoRa Energy Telemetry
#include <SPI.h>
#include <LoRa.h>

void setup() {
  Serial.begin(115200);
  LoRa.begin(433E6);
}

void loop() {
  float currentAmps = analogRead(34) * (30.0 / 4095.0);
  float powerWatts = currentAmps * 24.0; // 24V solar bus
  
  LoRa.beginPacket();
  LoRa.print("NODE_04:PWR:");
  LoRa.print(powerWatts);
  LoRa.endPacket();
  
  delay(1000);
}`
  },
  {
    id: 'proj-4',
    title: 'AI Automated Clean Water Filtration Monitor',
    author: 'Farida Yakubu',
    authorAvatar: '💧',
    location: 'Kano, Nigeria',
    category: 'Robotics',
    summary: 'Solar-powered multi-stage water filtration station with turbidity, pH, and bacterial luminescence spectroscopy.',
    problem: 'Rural groundwater boreholes frequently encounter undetected heavy metal or bacterial spikes resulting in preventable waterborne illnesses.',
    solution: 'Automated reverse-osmosis test station with solenoid valve fail-safe and cellular telemetry reporting to district health registries.',
    materials: [
      { name: 'Arduino Mega 2560 R3', costUsd: 19, costNgn: 28500 },
      { name: 'Analog Turbidity Sensor Module', costUsd: 11, costNgn: 16500 },
      { name: 'Industrial pH Probe with BNC Adapter', costUsd: 28, costNgn: 42000 },
      { name: '12V 1/2-inch Solenoid Water Valve', costUsd: 15, costNgn: 22500 },
      { name: 'SIM800L GPRS Cellular Shield', costUsd: 9, costNgn: 13500 },
    ],
    votes: 73,
    votedUserIds: [],
    commentsCount: 14,
    stage: 'Testing',
    createdAt: '2026-10-05',
    codeSnippet: `// Water Safety Automatic Shutoff
int turbidityPin = A1;
int valvePin = 8;

void setup() {
  pinMode(valvePin, OUTPUT);
  digitalWrite(valvePin, HIGH); // default open
}

void loop() {
  int sensorValue = analogRead(turbidityPin);
  float voltage = sensorValue * (5.0 / 1024.0);
  
  // If voltage drops below 2.5V, turbidity is dangerous
  if (voltage < 2.5) {
    digitalWrite(valvePin, LOW); // cutoff supply
    Serial.println("ALERT: Water purity below safe threshold! Valve Closed.");
  }
  delay(500);
}`
  }
];

// Tech News Data
const newsArticles = [
  {
    id: 'news-1',
    title: 'James Webb Space Telescope Identifies Atmospheric Water & Methane in Exo-System K2-18b',
    source: 'NASA & Astrophysical Journal',
    category: 'Space & Astronomy',
    date: '2026-10-21',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    summary: 'Spectroscopic observations confirm organic carbon-bearing molecules in the habitable zone of star K2-18, marking a monumental step in interstellar biosignature mapping.',
    url: 'https://nasa.gov',
    featured: true
  },
  {
    id: 'news-2',
    title: 'Lagos Tech Hub Unveils West Africa’s First Sub-3nm Silicon Design Lab for Edge Robotics',
    source: 'Techpoint Africa',
    category: 'Nigerian & African Tech',
    date: '2026-10-20',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    summary: 'Nigerian chip engineers and universities partner with pan-African tech consortia to fabricate open-RISC-V architecture chips optimized for solar grid sensors and drone flight controllers.',
    url: 'https://techpoint.africa',
    featured: true
  },
  {
    id: 'news-3',
    title: 'DeepMind & MIT Announce Quantum-Assisted Catalyst for Room-Temperature Green Hydrogen',
    source: 'Nature Chemistry',
    category: 'Scientific Breakthroughs',
    date: '2026-10-18',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    summary: 'AI neural networks modeled millions of molecular crystal lattices in 48 hours to discover a nickel-iron alloy capable of splitting seawater without corrosion.',
    url: 'https://nature.com',
    featured: false
  },
  {
    id: 'news-4',
    title: 'Next-Generation Autonomous Quadruped Robots Deployed in Disaster Recovery Drills',
    source: 'IEEE Spectrum',
    category: 'Robotics & AI',
    date: '2026-10-15',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    summary: 'Equipped with real-time LIDAR SLAM and multimodal vision-language models, the new generation of robotic searchers can parse human audio requests and navigate subterranean tunnels.',
    url: 'https://spectrum.ieee.org',
    featured: false
  },
  {
    id: 'news-5',
    title: 'African Space Agencies Collaborate on Pan-African Weather Satellite Constellation (AfriSat-1)',
    source: 'Space in Africa',
    category: 'Space & Astronomy',
    date: '2026-10-12',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    summary: 'Nigeria’s NASRDA, South Africa’s SANSA, and Egypt’s EgSA initiate joint telemetry tests for low-earth orbit satellites forecasting monsoons and desert locust migrations.',
    url: 'https://spaceinafrica.com',
    featured: false
  },
  {
    id: 'news-6',
    title: 'Transformers 4.0: Zero-Shot Multi-Modal Synthesis Redefines Scientific Discovery',
    source: 'MIT Technology Review',
    category: 'Artificial Intelligence',
    date: '2026-10-09',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    summary: 'Researchers demonstrate that combining symbolic theorem solvers with generative foundation models enables automated peer-review discovery of mathematical lemmas.',
    url: 'https://technologyreview.com',
    featured: false
  }
];

// Active Tech Challenges
const activeChallenges = [
  {
    id: 'chal-1',
    title: 'Clean Water Autonomous IoT Network Challenge 2026',
    sponsor: 'FREEDREAM Global Innovation Fund',
    prizePool: '$10,000 / ₦15,000,000',
    deadline: '2026-12-15',
    participants: 142,
    badge: 'Flagship',
    description: 'Design a self-sustaining solar water quality probe with real-time alerting for underserved communities.',
    focusAreas: ['Arduino / ESP32', 'Water Chemistry', 'LoRaWAN Telemetry']
  },
  {
    id: 'chal-2',
    title: 'African Agritech Crop Drone AI Hackathon',
    sponsor: 'AfriRobotics Consortium',
    prizePool: '$7,500 / ₦11,250,000',
    deadline: '2026-11-30',
    participants: 98,
    badge: 'Trending',
    description: 'Create an edge-AI model running under 15 watts that detects armyworm infestation from aerial multispectral imagery.',
    focusAreas: ['Computer Vision', 'MicroPython', 'UAV Avionics']
  },
  {
    id: 'chal-3',
    title: 'Low-Cost Bionic Mechanical Innovation Sprint',
    sponsor: 'Biomech Frontiers',
    prizePool: '$5,000 / ₦7,500,000',
    deadline: '2027-01-10',
    participants: 64,
    badge: 'Open',
    description: 'Develop an open-source 3D printable mechanical prosthetic with responsive grip patterns and tactile feedback.',
    focusAreas: ['3D CAD', 'Servo Motors', 'Biomedical Sensors']
  }
];

// Academy Courses
const academyCourses = [
  {
    id: 'prog-1',
    title: 'Python for Hardware & AI Innovators',
    category: 'Programming',
    level: 'Beginner to Intermediate',
    modulesCount: 8,
    duration: '6 Hours',
    rating: 4.9,
    xpReward: 350,
    enrolledCount: 1240,
    icon: 'Terminal',
    summary: 'Master Python syntax, MicroPython for microcontrollers, sensor integration, and foundational machine learning algorithms.',
    lessons: [
      { id: 'l1', title: 'Python Fundamentals & Data Structures', duration: '25 min' },
      { id: 'l2', title: 'MicroPython on Raspberry Pi Pico W', duration: '35 min' },
      { id: 'l3', title: 'Reading Analog & Digital Sensors', duration: '30 min' },
      { id: 'l4', title: 'NumPy & Scientific Data Arrays', duration: '40 min' },
      { id: 'l5', title: 'Building a Telemetry Web Server', duration: '45 min' }
    ],
    quiz: {
      question: 'Which MicroPython module is universally used to control hardware GPIO pins and PWM?',
      options: ['sys', 'machine', 'hardware_core', 'os.gpio'],
      answer: 1,
      explanation: 'In MicroPython, the "machine" module contains specific classes for controlling I/O pins, ADC, PWM, I2C, and SPI.'
    }
  },
  {
    id: 'rob-1',
    title: 'Arduino & Robotics System Architecture',
    category: 'Robotics & Electronics',
    level: 'Beginner to Advanced',
    modulesCount: 10,
    duration: '8 Hours',
    rating: 4.95,
    xpReward: 500,
    enrolledCount: 1890,
    icon: 'Cpu',
    summary: 'From basic LED circuits to multi-axis robotic arms, servo kinematics, ultrasonic obstacle avoidance, and PID motor tuning.',
    lessons: [
      { id: 'rl1', title: 'Ohm’s Law, Breadboards & Circuit Safety', duration: '30 min' },
      { id: 'rl2', title: 'Arduino C++ Syntax & Interrupt Timers', duration: '40 min' },
      { id: 'rl3', title: 'Pulse Width Modulation (PWM) & DC Motors', duration: '35 min' },
      { id: 'rl4', title: 'Servo Motors & Multi-Joint Inverse Kinematics', duration: '50 min' },
      { id: 'rl5', title: 'Autonomous Obstacle Navigation Rover', duration: '60 min' }
    ],
    quiz: {
      question: 'Why do DC motors require an H-bridge driver (such as L298N) instead of connecting directly to Arduino pins?',
      options: [
        'Because Arduino pins cannot output direct current',
        'Because Arduino pins provide insufficient current (max ~20-40mA) and inductive back-EMF could destroy the microcontroller',
        'Because H-bridge converts digital signals into radio waves',
        'Because motors only understand alternating current'
      ],
      answer: 1,
      explanation: 'Arduino GPIO pins can only safely supply up to 40mA. Motors draw hundreds of milliamps or amps and generate reverse voltage spikes (flyback) that would fry the chip.'
    }
  },
  {
    id: 'ai-1',
    title: 'Applied AI & Neural Networks from Scratch',
    category: 'Artificial Intelligence',
    level: 'Intermediate to Advanced',
    modulesCount: 7,
    duration: '5.5 Hours',
    rating: 4.88,
    xpReward: 420,
    enrolledCount: 1530,
    icon: 'Sparkles',
    summary: 'Understand backpropagation, weights, activation functions, convolutional vision models, and transformer architecture intuitively.',
    lessons: [
      { id: 'ail1', title: 'Perceptrons, Dot Products & Activation Curves', duration: '30 min' },
      { id: 'ail2', title: 'Gradient Descent & Cost Functions', duration: '45 min' },
      { id: 'ail3', title: 'Building a 2-Layer Neural Network in Pure Code', duration: '50 min' },
      { id: 'ail4', title: 'Computer Vision for Robotics Object Detection', duration: '45 min' },
      { id: 'ail5', title: 'Prompt Engineering & LLM APIs for Developers', duration: '40 min' }
    ],
    quiz: {
      question: 'What is the primary role of an activation function (like ReLU or Sigmoid) in a neural network?',
      options: [
        'To decrease the clock speed of the processor',
        'To introduce non-linearity, allowing the network to learn complex non-linear patterns',
        'To convert binary bits into decimal floating numbers',
        'To reset the weights to zero after each epoch'
      ],
      answer: 1,
      explanation: 'Without non-linear activation functions, no matter how many layers a neural network has, it would merely behave as a single linear regression model.'
    }
  },
  {
    id: 'sci-1',
    title: 'Physics & Applied Mathematics for Engineers',
    category: 'Mathematics & Physics',
    level: 'Beginner to Intermediate',
    modulesCount: 6,
    duration: '5 Hours',
    rating: 4.85,
    xpReward: 380,
    enrolledCount: 960,
    icon: 'Atom',
    summary: 'Vector calculus, rotational dynamics, electromagnetism, and renewable solar thermodynamics explained through real inventions.',
    lessons: [
      { id: 'sc1', title: 'Vectors, Forces & Free-Body Statics', duration: '35 min' },
      { id: 'sc2', title: 'Electromagnetic Induction & Faraday’s Law', duration: '40 min' },
      { id: 'sc3', title: 'Photovoltaic Physics & Solar Cell Efficiency', duration: '45 min' },
      { id: 'sc4', title: 'Fluid Dynamics for Propellers & Aerodynamics', duration: '40 min' }
    ],
    quiz: {
      question: 'What phenomenon causes a changing magnetic field inside a wire coil to produce an electric current?',
      options: ['Coulomb Repulsion', 'Electromagnetic Induction (Faraday’s Law)', 'Thermal Convection', 'Photoelectric Scattering'],
      answer: 1,
      explanation: 'Faraday’s Law of Induction states that a varying magnetic flux through a circuit induces an electromotive force (EMF).'
    }
  },
  {
    id: 'ent-1',
    title: 'DeepTech Startup: From Lab to Market',
    category: 'Entrepreneurship',
    level: 'All Levels',
    modulesCount: 5,
    duration: '4 Hours',
    rating: 4.92,
    xpReward: 300,
    enrolledCount: 1110,
    icon: 'Rocket',
    summary: 'How young inventors validate hardware prototypes, secure African and global venture capital, patent tech, and scale manufacturing.',
    lessons: [
      { id: 'en1', title: 'Problem Discovery vs Solution Bias', duration: '25 min' },
      { id: 'en2', title: 'Hardware Bill of Materials (BOM) & Unit Economics', duration: '35 min' },
      { id: 'en3', title: 'Patents, Open Source Hardware & IP Strategy', duration: '30 min' },
      { id: 'en4', title: 'Pitching to Investors in Lagos, Silicon Valley & London', duration: '45 min' }
    ],
    quiz: {
      question: 'When pitching a hardware invention to seed investors, what is the most critical metric for proving viability?',
      options: [
        'Having a 100-page theoretical patent application',
        'A working proof-of-concept prototype with clear unit economics and early user demand / pilot feedback',
        'A massive social media follower count',
        'Renting a high-end office space in advance'
      ],
      answer: 1,
      explanation: 'Hardware investors look for derisked technology: a functional working prototype, realistic Bill of Materials (BOM), and evidence of real customers willing to test or purchase.'
    }
  }
];

// ======================== API ROUTES ========================

// 1. Health check & status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    appName: 'FREEDREAM TECHNOLOGIES',
    slogan: 'Dream Without Limit',
    version: '2.5.0-NEURAL',
    aiEnabled: Boolean(geminiApiKey && ai),
    timestamp: new Date().toISOString()
  });
});

// Publishing & Public Sharing Telemetry
app.get('/api/publishing-info', (req: Request, res: Response) => {
  const defaultSharedUrl = 'https://ais-pre-hrinjvogm37rm4nu4bx2vq-288753434783.europe-west2.run.app';
  const resolvedPublicUrl = process.env.APP_URL || defaultSharedUrl;
  
  res.json({
    appName: 'FREEDREAM TECHNOLOGIES',
    slogan: 'Dream Without Limit.',
    publicUrl: resolvedPublicUrl,
    sharedUrl: defaultSharedUrl,
    devUrl: 'https://ais-dev-hrinjvogm37rm4nu4bx2vq-288753434783.europe-west2.run.app',
    isOnline: true,
    status: 'Live & Accessible to Everyone',
    authRequiredForPublic: false,
    customDomainConfig: {
      suggestedDomain: 'freedream.com',
      recordType: 'CNAME',
      targetHost: 'ghs.googlehosted.com'
    }
  });
});

// 2. FREEDREAM AI Assistant Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, topic = 'general', conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // System instruction for FREEDREAM AI
  const systemInstruction = `You are FREEDREAM AI, the advanced intelligence engine of FREEDREAM TECHNOLOGIES.
Brand Slogan: "Dream Without Limit."
Mission: Empower inventors, scientists, engineers, and curious minds to build the future of artificial intelligence, robotics, agriculture, healthcare, renewable energy, and scientific discovery.
Key traits:
- Rigorous, practical, and deeply encouraging.
- When asked for code, provide clean, well-commented code (Arduino C++, Python, MicroPython, or modern Web tech).
- When asked for scientific concepts, explain with intuitive analogies and physical principles.
- Understand both global deep-tech advancements and practical regional needs (e.g. solar energy, African precision agriculture, rural health tech, affordable robotics).
- Always include actionable advice or experiment recommendations when suitable.`;

  if (ai) {
    try {
      // Build conversation context
      const contents: any[] = [];
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        for (const item of conversationHistory.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: `[Topic Context: ${topic}] ${message}` }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || 'FREEDREAM AI synthesized your query with zero anomalies.';
      return res.json({
        reply,
        model: 'gemini-3.8-flash',
        source: 'FREEDREAM Neural Network (Live Gemini 3.8 Engine)',
        status: 'online'
      });
    } catch (err: any) {
      console.error('Gemini API Error in /api/ai/chat:', err);
      // Fallback with transparent notice
      return res.json({
        reply: `[FREEDREAM Offline Matrix Active] Here is an engineering synthesis for "${message}":\n\nTo innovate in this domain, break down the core components: identify the physical or computational constraints, assemble a rapid modular prototype (e.g., ESP32 or Raspberry Pi Pico), and record telemetry systematically.\n\nTip: You can ask FREEDREAM AI about Arduino pinouts, Python sensor pipelines, solar power sizing, or drone PID controllers!`,
        model: 'fallback-matrix',
        source: 'FREEDREAM Local Knowledge Base',
        status: 'fallback',
        details: err?.message || 'Upstream connection error'
      });
    }
  } else {
    // Graceful transparent response when key is not provided
    return res.json({
      reply: `[FREEDREAM Studio Mode] You requested: "${message}".\n\nFREEDREAM TECHNOLOGIES Core Principles:\n1. Deconstruct complex problems into first principles.\n2. Leverage edge microcontrollers (ESP32 / Arduino / MicroPython) for real-world telemetry.\n3. Integrate renewable solar power and robust fail-safes.\n\nConfigure your GEMINI_API_KEY in Settings to activate the full live Gemini 3.8 Flash Neural Engine for instant code synthesis and technical discovery!`,
      model: 'freedream-knowledge-engine',
      source: 'FREEDREAM Built-in Expert Engine',
      status: 'offline_ready'
    });
  }
});

// 3. AI Invention Generator
app.post('/api/ai/generate-invention', async (req: Request, res: Response) => {
  const { category = 'Robotics', focus = 'Agriculture', complexity = 'Intermediate' } = req.body;

  const prompt = `Generate a complete, viable, innovative invention project for FREEDREAM NOVALAB.
Category: ${category}
Focus area: ${focus}
Complexity Level: ${complexity}

Respond strictly in valid JSON format matching this structure:
{
  "title": "A short, catchy futuristic project title",
  "category": "${category}",
  "abstract": "A compelling 2-sentence executive summary of the invention",
  "problemStatement": "Clear explanation of the real-world problem being tackled",
  "solution": "Technical explanation of how the system works",
  "materials": [
    {"name": "Item name with specs", "costUsd": 25, "costNgn": 37500}
  ],
  "estimatedTotalUsd": 120,
  "estimatedTotalNgn": 180000,
  "codeSnippet": "Realistic Arduino C++ or Python code snippet with comments",
  "codeLanguage": "cpp or python",
  "circuitSteps": [
    "Step 1...",
    "Step 2...",
    "Step 3...",
    "Step 4..."
  ],
  "experimentProtocols": [
    "Measurement 1: Voltage efficiency under sunlight",
    "Measurement 2: Latency between sensor trigger and actuator actuation"
  ]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        }
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        project: parsed,
        engine: 'Gemini 3.8 Flash'
      });
    } catch (err: any) {
      console.error('Error generating invention with Gemini:', err);
      // Fallback curated invention
    }
  }

  // Fallback curated blueprint
  const fallbackProject = {
    title: `Autonomous ${focus} Smart Sentinel with ESP32`,
    category,
    abstract: `An automated edge-telemetry station utilizing low-power microcontrollers to analyze ${focus.toLowerCase()} metrics in real time.`,
    problemStatement: `Lack of continuous affordable telemetry leads to preventable failures in ${focus.toLowerCase()} applications.`,
    solution: `Combines optical and electrochemical sensors with automated threshold relay triggers and cellular/LoRa telemetry.`,
    materials: [
      { name: 'ESP32 Dual-Core Microcontroller', costUsd: 8, costNgn: 12000 },
      { name: 'Industrial Multisensor Array Module', costUsd: 24, costNgn: 36000 },
      { name: '10W Polycrystalline Solar Panel & BMS', costUsd: 22, costNgn: 33000 },
      { name: 'Solid State Relay Switch 10A', costUsd: 12, costNgn: 18000 },
      { name: 'Weatherproof IP66 Enclosure Box', costUsd: 14, costNgn: 21000 }
    ],
    estimatedTotalUsd: 80,
    estimatedTotalNgn: 120000,
    codeSnippet: `// FREEDREAM NOVALAB: ESP32 Automated Telemetry Sentinel
#include <WiFi.h>

const int SENSOR_PIN = 34;
const int RELAY_PIN = 23;
const float THRESHOLD = 650.0;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  Serial.println("FREEDREAM Sentinel Activated. 'Dream Without Limit'");
}

void loop() {
  int rawValue = analogRead(SENSOR_PIN);
  float voltage = rawValue * (3.3 / 4095.0);
  
  Serial.printf("Telemetry Raw: %d | Voltage: %.2fV\\n", rawValue, voltage);
  
  if (rawValue > THRESHOLD) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Actuator triggered: Purity/Moisture threshold exceeded.");
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
  delay(1500);
}`,
    codeLanguage: 'cpp',
    circuitSteps: [
      'Connect ESP32 3V3 and GND to the power rails of your breadboard or PCB shield.',
      'Wire the Analog Sensor Signal pin to ESP32 GPIO 34 (ADC1 channel).',
      'Connect the Relay trigger input to GPIO 23 with a flyback diode for reverse EMF protection.',
      'Bridge the solar charge controller 5V regulated output to the ESP32 VIN pin.',
      'Power on the unit and observe serial monitor telemetry at 115200 baud.'
    ],
    experimentProtocols: [
      'Record voltage drop over 24-hour battery test cycle.',
      'Measure response latency from threshold trigger to relay latch.'
    ]
  };

  return res.json({
    success: true,
    project: fallbackProject,
    engine: 'FREEDREAM Curated Blueprints'
  });
});

// 4. Tech News API
app.get('/api/news', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let filtered = [...newsArticles];

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category.toLowerCase().includes(String(category).toLowerCase()));
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
  }

  res.json({ articles: filtered, total: filtered.length });
});

// 5. Community Innovation Hub Projects
app.get('/api/hub/projects', (req: Request, res: Response) => {
  const { category } = req.query;
  let list = [...communityProjects];
  if (category && category !== 'All') {
    list = list.filter(p => p.category === category);
  }
  res.json({ projects: list });
});

// Submit a new project to Community Hub
app.post('/api/hub/projects', (req: Request, res: Response) => {
  const { title, author, authorAvatar, location, category, summary, problem, solution, materials, codeSnippet } = req.body;

  if (!title || !summary || !solution) {
    return res.status(400).json({ error: 'Title, summary, and solution are required.' });
  }

  const newProject: CommunityProject = {
    id: `proj-${Date.now()}`,
    title: String(title).slice(0, 120),
    author: author ? String(author).slice(0, 50) : 'Anonymous Innovator',
    authorAvatar: authorAvatar || '🚀',
    location: location ? String(location).slice(0, 50) : 'Global',
    category: category || 'Robotics',
    summary: String(summary).slice(0, 300),
    problem: problem ? String(problem).slice(0, 500) : 'Identified technological challenge.',
    solution: String(solution).slice(0, 600),
    materials: Array.isArray(materials) ? materials : [],
    votes: 1,
    votedUserIds: ['author'],
    commentsCount: 0,
    stage: 'Concept',
    createdAt: new Date().toISOString().split('T')[0],
    codeSnippet: codeSnippet || undefined
  };

  communityProjects.unshift(newProject);
  res.status(201).json({ success: true, project: newProject });
});

// Upvote a project
app.post('/api/hub/projects/:id/vote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId = 'user_guest' } = req.body;

  const proj = communityProjects.find(p => p.id === id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const hasVoted = proj.votedUserIds.includes(userId);
  if (hasVoted) {
    proj.votes = Math.max(0, proj.votes - 1);
    proj.votedUserIds = proj.votedUserIds.filter(uid => uid !== userId);
  } else {
    proj.votes += 1;
    proj.votedUserIds.push(userId);
  }

  res.json({ success: true, votes: proj.votes, hasVoted: !hasVoted });
});

// 6. Academy Courses API
app.get('/api/academy/courses', (req: Request, res: Response) => {
  res.json({ courses: academyCourses });
});

// 7. Tech Challenges API
app.get('/api/challenges', (req: Request, res: Response) => {
  res.json({ challenges: activeChallenges });
});

// Serve frontend in dev / production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`FREEDREAM Server running on http://localhost:${PORT}`);
  console.log(`Brand: FREEDREAM TECHNOLOGIES | "Dream Without Limit"`);
  console.log(`AI Engine: ${geminiApiKey ? 'Gemini 3.8 Flash Active' : 'Offline Knowledge Engine'}`);
});
