import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { dbStore, UserRole } from './src/server/owner-store';

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

let communityProjects: CommunityProject[] = [];

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
const activeChallenges: any[] = [];

// Academy Courses with in-depth curriculum modules
const academyCourses = [
  {
    id: 'prog-1',
    title: 'Python for Hardware & AI Innovators',
    category: 'Programming',
    level: 'Beginner to Intermediate',
    modulesCount: 5,
    duration: '6 Hours',
    rating: 4.9,
    xpReward: 350,
    enrolledCount: 1240,
    icon: 'Terminal',
    summary: 'Master Python syntax, MicroPython for microcontrollers, sensor integration, and foundational machine learning algorithms.',
    lessons: [
      {
        id: 'l1',
        title: 'Python Fundamentals & Data Structures',
        duration: '25 min',
        completed: false,
        content: 'Python syntax is designed for readability and rapid technical iteration. In engineering applications, list comprehensions, dictionaries for key-value telemetry, and tuple immutability form the backbone of memory-efficient data pipelines.',
        codeSnippet: `# Telemetry dictionary data structure
readings = [
    {"sensor": "soil_temp", "value": 24.5, "unit": "C"},
    {"sensor": "irradiance", "value": 850.0, "unit": "W/m^2"}
]
# Filter readings above threshold using list comprehension
high_readings = [r for r in readings if r["value"] > 50.0]
print("Alert Telemetry:", high_readings)`,
        codeLanguage: 'python',
        takeaways: [
          'Use dictionaries for structured sensor readings with metadata.',
          'List comprehensions process telemetry batches faster than traditional loops.',
          'Memory efficiency is paramount when targeting embedded Python microcontrollers.'
        ],
        challenge: 'Create a list of 5 temperature readings and calculate the rolling average using Python.'
      },
      {
        id: 'l2',
        title: 'MicroPython on Raspberry Pi Pico W',
        duration: '35 min',
        completed: false,
        content: 'MicroPython is a full implementation of Python 3 optimized to run on bare-metal microcontrollers with as little as 256KB of RAM. Learn how to interface with the RP2040 dual-core ARM Cortex-M0+ chip.',
        codeSnippet: `from machine import Pin, Timer
import time

# Built-in LED on Raspberry Pi Pico W
led = Pin("LED", Pin.OUT)

# Hardware heartbeat timer
def heartbeat(t):
    led.toggle()

timer = Timer()
timer.init(freq=2.5, mode=Timer.PERIODIC, callback=heartbeat)
print("FREEDREAM Pico W Heartbeat Active.")`,
        codeLanguage: 'python',
        takeaways: [
          'Hardware timers run non-blocking callbacks in the background.',
          'GPIO pins are configured as Pin.IN or Pin.OUT via the machine module.',
          'Never use blocking time.sleep() inside hardware interrupt callbacks.'
        ],
        challenge: 'Configure a Pin.IN with Pin.PULL_DOWN to read an external push-button.'
      },
      {
        id: 'l3',
        title: 'Reading Analog & Digital Sensors',
        duration: '30 min',
        completed: false,
        content: 'Analog sensors output varying voltage (e.g. 0-3.3V) mapped to 16-bit integer ADC values (0-65535). Learn how to calibrate raw analog readings into meaningful physical units like Lux, Celsius, or soil moisture percentage.',
        codeSnippet: `from machine import ADC, Pin

adc = ADC(Pin(26)) # ADC0 channel

def read_capacitive_moisture():
    raw = adc.read_u16() # 0 to 65535
    # Calibration: 65535 = bone dry (0%), 20000 = submerged (100%)
    percentage = (65535 - raw) / (65535 - 20000) * 100.0
    return max(0.0, min(100.0, round(percentage, 1)))

print("Moisture Level:", read_capacitive_moisture(), "%")`,
        codeLanguage: 'python',
        takeaways: [
          'Calibrate ADC sensors against known physical baselines (dry air vs pure water).',
          'Use multi-sample averaging (e.g., 10 samples) to filter electrical noise.',
          'Capacitive sensors prevent corrosion compared to cheap resistive probes.'
        ],
        challenge: 'Implement an oversampling loop that averages 10 ADC readings to stabilize noisy signals.'
      },
      {
        id: 'l4',
        title: 'NumPy & Scientific Data Arrays',
        duration: '40 min',
        completed: false,
        content: 'NumPy introduces contiguous C-level memory arrays and vectorized operations. Vectorization eliminates Python interpreter overhead, enabling millisecond fast-fourier transforms (FFT) and vibration analysis on edge systems.',
        codeSnippet: `import numpy as np

# Vibration sensor accelerometry (X, Y, Z axes in G-force)
telemetry = np.array([
    [0.02, -0.01, 0.98],
    [0.04, 0.03, 1.02],
    [0.15, 0.22, 1.45] # Shock impulse
])

# Vector magnitude computation in one line
magnitudes = np.linalg.norm(telemetry, axis=1)
print("Peak G-Force Detected:", np.max(magnitudes))`,
        codeLanguage: 'python',
        takeaways: [
          'Vectorized array operations are up to 50x faster than standard Python loops.',
          'Linear algebra functions allow calculating 3D physical dynamics cleanly.',
          'Export processed array telemetry to compact binary formats like Feather or Parquet.'
        ],
        challenge: 'Calculate the standard deviation of an array of 50 solar voltage measurements.'
      },
      {
        id: 'l5',
        title: 'Building a Telemetry Web Server',
        duration: '45 min',
        completed: false,
        content: 'Connect your Pico W or ESP32 to local Wi-Fi and host an ultra-lightweight HTTP web server. Anyone on the local network can view real-time live sensor gauges without needing third-party cloud brokers.',
        codeSnippet: `import network
import socket

# Connect to Wi-Fi station
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect('FREEDREAM_LAB', 'Invention2026')

# Simple socket HTTP listener
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)
print("Local Server online on port 80")`,
        codeLanguage: 'python',
        takeaways: [
          'Sockets allow direct HTTP or WebSocket communication with zero cloud dependencies.',
          'Implement lightweight JSON payloads for mobile and dashboard ingestion.',
          'Set socket timeout so the microcontroller loop remains responsive.'
        ],
        challenge: 'Format an HTTP response header returning application/json content type.'
      }
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
    modulesCount: 5,
    duration: '8 Hours',
    rating: 4.95,
    xpReward: 500,
    enrolledCount: 1890,
    icon: 'Cpu',
    summary: 'From basic LED circuits to multi-axis robotic arms, servo kinematics, ultrasonic obstacle avoidance, and PID motor tuning.',
    lessons: [
      {
        id: 'rl1',
        title: 'Ohm’s Law, Breadboards & Circuit Safety',
        duration: '30 min',
        completed: false,
        content: 'Ohm’s law (V = I * R) is the foundation of all electrical engineering. When powering LEDs, sensors, and microcontrollers, current limiting resistors protect sensitive silicon from catastrophic thermal overload.',
        codeSnippet: `// LED Current Limiting Formula:
// R = (V_supply - V_forward) / I_forward
// For 5V Arduino pin, red LED (2.0V forward, 15mA):
// R = (5.0 - 2.0) / 0.015 = 200 Ohms -> Use standard 220 Ohm resistor.

void setup() {
  pinMode(13, OUTPUT);
}
void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
        codeLanguage: 'cpp',
        takeaways: [
          'Always verify resistor values before connecting components to breadboard rails.',
          'Common ground (GND) must be tied across different power supplies.',
          'Use decoupling capacitors near power input pins to suppress voltage dips.'
        ],
        challenge: 'Calculate the required resistor for an ultra-bright blue LED (3.3V forward) running on 5V at 20mA.'
      },
      {
        id: 'rl2',
        title: 'Arduino C++ Syntax & Interrupt Timers',
        duration: '40 min',
        completed: false,
        content: 'Hardware interrupts (attachInterrupt) respond instantly to physical events like encoder ticks or emergency stops within microseconds, without polling in the main loop.',
        codeSnippet: `const byte interruptPin = 2;
volatile unsigned long pulseCount = 0;

void IRAM_ATTR countPulse() {
  pulseCount++; // Fast atomic increment in ISR
}

void setup() {
  Serial.begin(115200);
  pinMode(interruptPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(interruptPin), countPulse, RISING);
}

void loop() {
  Serial.print("RPM Encoder Pulses: ");
  Serial.println(pulseCount);
  delay(500);
}`,
        codeLanguage: 'cpp',
        takeaways: [
          'Variables modified inside an Interrupt Service Routine (ISR) MUST be marked volatile.',
          'Keep ISR routines minimal: no Serial.print or delay inside interrupts.',
          'Use INPUT_PULLUP to eliminate floating pin electrical noise.'
        ],
        challenge: 'Write an ISR that toggles a boolean state flag whenever a push-button is pressed.'
      },
      {
        id: 'rl3',
        title: 'Pulse Width Modulation (PWM) & DC Motors',
        duration: '35 min',
        completed: false,
        content: 'DC motors cannot be directly speed-controlled by varying pure voltage without losing torque. PWM switches full voltage on and off thousands of times per second, controlling effective average power.',
        codeSnippet: `const int ENA = 9;  // Speed PWM pin
const int IN1 = 8;  // Direction pin A
const int IN2 = 7;  // Direction pin B

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void setMotorSpeed(int speedDuty) {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW); // Forward rotation
  analogWrite(ENA, speedDuty); // 0 (stop) to 255 (full speed)
}`,
        codeLanguage: 'cpp',
        takeaways: [
          'Never connect DC motor leads directly to Arduino pins (max ~40mA).',
          'Use an H-Bridge like L298N or TB6612FNG for bidirectional motor control.',
          'Inductive flyback diodes prevent reverse voltage spikes from frying control logic.'
        ],
        challenge: 'Implement a soft-start acceleration ramp that steps PWM from 0 to 255 over 2 seconds.'
      },
      {
        id: 'rl4',
        title: 'Servo Motors & Multi-Joint Inverse Kinematics',
        duration: '50 min',
        completed: false,
        content: 'Servo motors contain internal DC motors, reduction gears, and closed-loop potentiometer feedback. By feeding 50Hz PWM pulses (1.0ms to 2.0ms width), the shaft turns to precise angular positions from 0 to 180 degrees.',
        codeSnippet: `#include <Servo.h>

Servo shoulder;
Servo elbow;

void setup() {
  shoulder.attach(9);
  elbow.attach(10);
}

void setArmPosition(int angleA, int angleB) {
  shoulder.write(constrain(angleA, 0, 180));
  elbow.write(constrain(angleB, 0, 180));
}`,
        codeLanguage: 'cpp',
        takeaways: [
          'Servos draw high peak current when moving; use a dedicated 5V/6V power rail.',
          'Constrain target angles in code to prevent mechanical binding of joints.',
          'Inverse kinematics calculates servo joint angles from target (X, Y, Z) coordinates.'
        ],
        challenge: 'Write a smooth sweep function that moves a servo between 30° and 150° in 1° increments with small delays.'
      },
      {
        id: 'rl5',
        title: 'Autonomous Obstacle Navigation Rover',
        duration: '60 min',
        completed: false,
        content: 'Combine HC-SR04 ultrasonic sonar with dual DC motor differential steering. The rover measures distance, detects obstacles within 25cm, halts, sweeps a servo scanner, and turns towards the clearest corridor.',
        codeSnippet: `#define TRIG 4
#define ECHO 3

long measureDistanceCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long duration = pulseIn(ECHO, HIGH, 25000);
  if (duration == 0) return 999; // Clear path
  return duration * 0.034 / 2; // Speed of sound calibration
}`,
        codeLanguage: 'cpp',
        takeaways: [
          'Add timeout parameters to pulseIn to prevent rover loop lockup if echo is lost.',
          'Filter spurious sonar outliers by running median filter of 3 measurements.',
          'Differential steering turns the rover in place by rotating tracks/wheels in opposite directions.'
        ],
        challenge: 'Incorporate a bumper microswitch as a physical collision failsafe backup.'
      }
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
    modulesCount: 5,
    duration: '5.5 Hours',
    rating: 4.88,
    xpReward: 420,
    enrolledCount: 1530,
    icon: 'Sparkles',
    summary: 'Understand backpropagation, weights, activation functions, convolutional vision models, and transformer architecture intuitively.',
    lessons: [
      {
        id: 'ail1',
        title: 'Perceptrons, Dot Products & Activation Curves',
        duration: '30 min',
        completed: false,
        content: 'An artificial neuron computes the dot product of input vectors and weight vectors, adds a bias term, and applies a non-linear activation function (such as ReLU or Sigmoid).',
        codeSnippet: `import numpy as np

def neuron(inputs, weights, bias):
    z = np.dot(inputs, weights) + bias
    return max(0, z) # ReLU activation

inputs = np.array([0.5, 0.8, -0.2])
weights = np.array([0.4, 0.7, 0.1])
bias = 0.15

output = neuron(inputs, weights, bias)
print("Neuron Output (ReLU):", round(output, 4))`,
        codeLanguage: 'python',
        takeaways: [
          'Dot products measure alignment between feature vectors and learned patterns.',
          'Bias shifts the activation threshold independently of the inputs.',
          'ReLU (Rectified Linear Unit) avoids vanishing gradients in deep networks.'
        ],
        challenge: 'Implement the mathematical Sigmoid activation function: 1 / (1 + exp(-z)).'
      },
      {
        id: 'ail2',
        title: 'Gradient Descent & Cost Functions',
        duration: '45 min',
        completed: false,
        content: 'Gradient descent navigates high-dimensional loss landscapes by computing partial derivatives with respect to each parameter and updating weights in the opposite direction of the gradient.',
        codeSnippet: `# 1D Gradient Descent on Mean Squared Error
weights = 0.0
learning_rate = 0.05

for step in range(20):
    error = (weights * 2.0) - 10.0 # Target is 5.0 (since 5 * 2 = 10)
    gradient = 2.0 * error * 2.0   # Derivative dLoss/dWeight
    weights -= learning_rate * gradient

print("Optimized Weight:", round(weights, 2))`,
        codeLanguage: 'python',
        takeaways: [
          'Learning rates too large cause divergence; too small cause slow convergence.',
          'Momentum and Adam optimizers adapt learning rates per parameter dynamically.',
          'Mean Squared Error penalizes large outliers quadratically.'
        ],
        challenge: 'Plot or track how error decreases monotonically across training iterations.'
      },
      {
        id: 'ail3',
        title: 'Building a 2-Layer Neural Network in Pure Code',
        duration: '50 min',
        completed: false,
        content: 'By chaining forward propagation matrix multiplication with backward propagation via the chain rule, a 2-layer network can solve non-linearly separable problems like XOR.',
        codeSnippet: `import numpy as np

# XOR inputs and expected targets
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

# Weights initialization
W1 = np.random.randn(2, 4)
W2 = np.random.randn(4, 1)

print("Network Architecture initialized with 4 hidden neurons.")`,
        codeLanguage: 'python',
        takeaways: [
          'The XOR problem proved that single-layer perceptrons cannot learn non-linear boundaries.',
          'Hidden layers project input data into higher-dimensional spaces where it becomes linearly separable.',
          'Matrix operations enable training thousands of samples simultaneously in parallel batches.'
        ],
        challenge: 'Write forward pass matrix multiplication: H = np.maximum(0, np.dot(X, W1)).'
      },
      {
        id: 'ail4',
        title: 'Computer Vision for Robotics Object Detection',
        duration: '45 min',
        completed: false,
        content: 'Convolutional neural networks (CNNs) slide mathematical kernels across image matrices to detect edges, corners, and object silhouettes invariant to spatial translation.',
        codeSnippet: `import cv2
# Example OpenCV edge detection on robotics camera frame
# gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
# edges = cv2.Canny(gray, threshold1=50, threshold2=150)
print("Sobel & Canny Filter Pipeline for Edge-AI Vision")`,
        codeLanguage: 'python',
        takeaways: [
          'Color space conversion (RGB to HSV or Grayscale) simplifies feature extraction.',
          'Edge filters isolate physical contours while discarding irrelevant lighting variations.',
          'Quantized models (INT8) run real-time inference on low-power edge microcontrollers.'
        ],
        challenge: 'Identify the HSV color range needed to detect a bright green plant leaf.'
      },
      {
        id: 'ail5',
        title: 'Prompt Engineering & LLM APIs for Developers',
        duration: '40 min',
        completed: false,
        content: 'Modern software engineering incorporates Large Language Models as semantic reasoning engines. Learn how to structure system instructions, multi-turn contexts, and strict JSON output schemas.',
        codeSnippet: `// Calling Gemini API with Structured Output Schema
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI();
// responseMimeType: 'application/json' guarantees machine-readable outputs
console.log("Structured schema prompt configured for autonomous pipeline.");`,
        codeLanguage: 'typescript',
        takeaways: [
          'Specify explicit output schemas with responseMimeType: application/json.',
          'Provide few-shot examples inside system instructions to constrain tone and format.',
          'Always implement automatic retry and fallback cascades across model variants.'
        ],
        challenge: 'Design a system instruction for an automated IoT device troubleshooting agent.'
      }
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
    modulesCount: 4,
    duration: '5 Hours',
    rating: 4.85,
    xpReward: 380,
    enrolledCount: 960,
    icon: 'Atom',
    summary: 'Vector calculus, rotational dynamics, electromagnetism, and renewable solar thermodynamics explained through real inventions.',
    lessons: [
      {
        id: 'sc1',
        title: 'Vectors, Forces & Free-Body Statics',
        duration: '35 min',
        completed: false,
        content: 'Static equilibrium requires that the sum of all forces and the sum of all torques equal zero (ΣF = 0, Στ = 0). When designing drone frames or robotic arms, balance reduces motor power draw by over 60%.',
        codeSnippet: `// Torque equilibrium calculation:
// Torque (tau) = Force * Distance * sin(theta)
// For a 0.5m robotic arm carrying 2.0kg (19.6N):
// Required holding torque = 19.6N * 0.5m = 9.8 N*m`,
        codeLanguage: 'text',
        takeaways: [
          'Counterweights reduce the continuous holding torque needed by joint servos.',
          'Resolve 2D and 3D forces into orthogonal X, Y, Z vector components.',
          'Consider safety margins of at least 2.5x for mechanical structural loads.'
        ],
        challenge: 'Calculate the required motor stall torque for a 4-wheel rover climbing a 20° incline.'
      },
      {
        id: 'sc2',
        title: 'Electromagnetic Induction & Faraday’s Law',
        duration: '40 min',
        completed: false,
        content: 'Faraday’s law of induction explains how mechanical rotational motion is converted into electrical energy in generators, wind turbines, and regenerative braking circuits.',
        codeSnippet: `// Induced EMF: epsilon = -N * (dPhi / dt)
// Where N is coil turns and dPhi/dt is rate of magnetic flux change.`,
        codeLanguage: 'text',
        takeaways: [
          'Back-EMF generated by spinning DC motors opposes the applied voltage.',
          'Brushless motors use electronic commutation to trigger electromagnetic fields.',
          'Shield high-frequency inductive coils to prevent radio interference on microcontroller lines.'
        ],
        challenge: 'Explain why spinning a DC motor by hand produces an measurable voltage on a multimeter.'
      },
      {
        id: 'sc3',
        title: 'Photovoltaic Physics & Solar Cell Efficiency',
        duration: '45 min',
        completed: false,
        content: 'Photons with energy greater than the silicon bandgap (1.1 eV) knock valence electrons into the conduction band, generating electron-hole pairs and direct electrical current.',
        codeSnippet: `// MPPT (Maximum Power Point Tracking) Logic
// Power = Voltage * Current
// Perturb and Observe (P&O) algorithm constantly hunts for peak power curve.`,
        codeLanguage: 'text',
        takeaways: [
          'Monocrystalline silicon achieves 20-24% laboratory efficiency; polycrystalline ~16-18%.',
          'Solar cell voltage drops slightly as ambient surface temperature increases.',
          'MPPT charge controllers recover up to 30% more energy than basic PWM controllers.'
        ],
        challenge: 'Calculate the expected daily Watt-hours from a 50W panel receiving 5.2 peak sun hours.'
      },
      {
        id: 'sc4',
        title: 'Fluid Dynamics for Propellers & Aerodynamics',
        duration: '40 min',
        completed: false,
        content: 'Bernoulli’s principle and Newton’s third law explain aerodynamic lift. Air travels faster over curved aerofoils, creating a pressure differential that lifts drones and aircraft.',
        codeSnippet: `// Thrust formula: Thrust ~ Propeller Diameter^4 * Pitch * RPM^2
// Doubling RPM quadruples thrust while octupling power consumption!`,
        codeLanguage: 'text',
        takeaways: [
          'Larger, slower-spinning propellers are significantly more energy-efficient than small high-RPM props.',
          'Drone hover requires thrust-to-weight ratio of at least 2:1 for stable flight dynamics in windy conditions.',
          'Propeller pitch affects top speed, while diameter determines static lifting thrust.'
        ],
        challenge: 'Determine the total motor thrust needed for a 1.2kg autonomous quadcopter to achieve a 2:1 ratio.'
      }
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
    modulesCount: 4,
    duration: '4 Hours',
    rating: 4.92,
    xpReward: 300,
    enrolledCount: 1110,
    icon: 'Rocket',
    summary: 'How young inventors validate hardware prototypes, secure African and global venture capital, patent tech, and scale manufacturing.',
    lessons: [
      {
        id: 'en1',
        title: 'Problem Discovery vs Solution Bias',
        duration: '25 min',
        completed: false,
        content: 'Engineers frequently fall in love with complex technologies before verifying that end users experience a painful, urgent problem they are willing to pay to solve.',
        codeSnippet: `// Customer Discovery Checklist:
// 1. Have you interviewed 30+ real stakeholders without pitching your product?
// 2. What workaround are they currently spending time or money on?
// 3. What is the measurable cost of the problem remaining unsolved?`,
        codeLanguage: 'text',
        takeaways: [
          'Conduct open-ended customer interviews before soldering a single circuit.',
          'Build the Minimum Viable Prototype (MVP) that tests the core risky assumption.',
          'Customer enthusiasm and pre-orders are the strongest proof of product-market fit.'
        ],
        challenge: 'Write down the three biggest assumptions in your invention and how you will test each.'
      },
      {
        id: 'en2',
        title: 'Hardware Bill of Materials (BOM) & Unit Economics',
        duration: '35 min',
        completed: false,
        content: 'Unit economics dictate whether a hardware startup can scale. Gross margin must account for Bill of Materials, assembly labor, shipping, customs tariffs, packaging, and distributor margins.',
        codeSnippet: `// Unit Economics Formula:
// Cost of Goods Sold (COGS) = BOM + Assembly + Packaging + Freight
// Target Retail Price = COGS * 3.5 to 4.0 (to allow distributor & retail margins)`,
        codeLanguage: 'text',
        takeaways: [
          'Track BOM costs in both local currency (NGN) and international supply currency (USD).',
          'Component costs drop dramatically at volume tiers (1x vs 1,000x vs 10,000x units).',
          'Design for Manufacturing (DFM) minimizes assembly steps and specialized screws.'
        ],
        challenge: 'Calculate the total landed cost of an invention with $45 BOM, $8 assembly, and $6 shipping.'
      },
      {
        id: 'en3',
        title: 'Patents, Open Source Hardware & IP Strategy',
        duration: '30 min',
        completed: false,
        content: 'Hardware patents can be costly to prosecute and enforce. Strategically combining defensive patent filings, trademark protection (FREEDREAM), and proprietary firmware delivers superior defensibility.',
        codeSnippet: `// IP Strategy Matrix:
// - Hardware CAD: Open source for community trust or provisional patent
// - Firmware: Compiled proprietary binaries with cryptographic bootloader
// - Brand: Trademarked brand identity and verified cloud telemetry API`,
        codeLanguage: 'text',
        takeaways: [
          'File a provisional patent before any public disclosure if planning to patent.',
          'Speed of execution and community distribution often outperform patent moats.',
          'Protect firmware code with read-out protection fuses on microcontrollers.'
        ],
        challenge: 'Draft a one-page summary of your invention’s unique, patentable novelty.'
      },
      {
        id: 'en4',
        title: 'Pitching to Investors in Lagos, Silicon Valley & London',
        duration: '45 min',
        completed: false,
        content: 'A world-class hardware pitch focuses on team capability, market size, traction, and unit margins. Bring a working, physical prototype to every investor meeting.',
        codeSnippet: `// 10-Slide DeepTech Pitch Deck:
// 1. Problem & Pain Point
// 2. Solution & Live Demo
// 3. Market Size ($ TAM, SAM, SOM)
// 4. Business Model & Pricing
// 5. Traction & Pilot Deployments
// 6. Technology Moat & IP
// 7. Unit Economics (BOM vs Price)
// 8. Go-To-Market Strategy
// 9. World-Class Team
// 10. The Ask & Milestones`,
        codeLanguage: 'text',
        takeaways: [
          'Always demonstrate a live, physical prototype in the first 2 minutes.',
          'Know your BOM numbers, gross margin %, and cash burn rate cold.',
          'Emphasize local execution advantages and global export potential.'
        ],
        challenge: 'Record a 60-second elevator pitch for your FREEDREAM invention project.'
      }
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
    status: 'AI Studio Development Sandbox Environment',
    authRequiredForPublic: false,
    customDomainConfig: {
      suggestedDomain: 'freedream.com',
      recordType: 'CNAME',
      targetHost: 'ghs.googlehosted.com'
    }
  });
});

// Resilient multi-model Gemini generator with automatic fallback
async function generateGeminiContentWithFallback(params: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}) {
  if (!ai) {
    throw new Error('Gemini API client not initialized (GEMINI_API_KEY missing)');
  }

  // Model sequence: prioritized for high-speed sub-second inference with resilient failover
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {
        temperature: params.temperature ?? 0.7,
      };
      if (params.systemInstruction) {
        config.systemInstruction = params.systemInstruction;
      }
      if (params.responseMimeType) {
        config.responseMimeType = params.responseMimeType;
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      return {
        text: response.text || '',
        modelUsed: model,
      };
    } catch (err: any) {
      console.warn(`[Gemini Fallback] Model ${model} encountered issue (${err?.message || err}). Trying next model...`);
      lastError = err;
    }
  }

  throw lastError;
}

// 2. AI Assistant Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory = [], topic = 'General Innovation' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
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

      const { text: reply, modelUsed } = await generateGeminiContentWithFallback({
        contents,
        systemInstruction,
        temperature: 0.7,
      });

      return res.json({
        reply: reply || 'FREEDREAM AI synthesized your query with zero anomalies.',
        model: modelUsed,
        source: `FREEDREAM Neural Network (${modelUsed})`,
        status: 'online'
      });
    } catch (err: any) {
      console.error('Gemini API Error in /api/ai/chat after fallback chain:', err);
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
      reply: `[FREEDREAM Studio Mode] You requested: "${message}".\n\nFREEDREAM TECHNOLOGIES Core Principles:\n1. Deconstruct complex problems into first principles.\n2. Leverage edge microcontrollers (ESP32 / Arduino / MicroPython) for real-world telemetry.\n3. Integrate renewable solar power and robust fail-safes.\n\nConfigure your GEMINI_API_KEY in Settings to activate the full live Gemini Neural Engine for instant code synthesis and technical discovery!`,
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
      const { text, modelUsed } = await generateGeminiContentWithFallback({
        contents: prompt,
        responseMimeType: 'application/json',
        temperature: 0.8,
      });

      const parsed = JSON.parse(text.trim() || '{}');
      return res.json({
        success: true,
        project: parsed,
        engine: modelUsed
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

// =========================================================================
// FREEDREAM OWNER CONTROL CENTER & RBAC SECURITY MIDDLEWARES
// =========================================================================

function extractBearerToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return '';
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token required.' });
  }
  const verification = dbStore.verifyToken(token);
  if (!verification.valid || !verification.user) {
    return res.status(401).json({ error: verification.error || 'Unauthorized: Invalid or expired session token.' });
  }
  if (!['owner', 'admin'].includes(verification.user.role)) {
    return res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
  }
  (req as any).user = verification.user;
  next();
}

function requireOwnerAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Owner token required.' });
  }
  const verification = dbStore.verifyToken(token);
  if (!verification.valid || !verification.user) {
    return res.status(401).json({ error: verification.error || 'Unauthorized: Invalid or expired session token.' });
  }
  if (verification.user.role !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Primary Owner privileges strictly required.' });
  }
  (req as any).user = verification.user;
  next();
}

// Public Features & Announcement Endpoints
app.get('/api/features', (req: Request, res: Response) => {
  res.json({ features: dbStore.getFeatureSettings() });
});

app.get('/api/announcements', (req: Request, res: Response) => {
  const activeAnnouncements = dbStore.getAnnouncements().filter(a => a.active);
  res.json({ announcements: activeAnnouncements });
});

// 4. Public Tech News API (Synchronized with Owner Control Center)
app.get('/api/news', (req: Request, res: Response) => {
  const { category, search } = req.query;
  const articles = dbStore.getPublicNews(
    category ? String(category) : undefined,
    search ? String(search) : undefined
  );
  res.json({ articles, total: articles.length });
});

// Public News Categories
app.get('/api/news/categories', (req: Request, res: Response) => {
  res.json({ categories: dbStore.getCategories() });
});

// =========================================================================
// OWNER AUTHENTICATION & RECOVERY ROUTES
// =========================================================================

// Check whether owner account is registered or needs setup
app.get('/api/owner/status', (req: Request, res: Response) => {
  const status = dbStore.getOwnerStatus();
  res.json(status);
});

// Initial Owner Setup (First-Time Secure Initialization)
app.post('/api/owner/setup', (req: Request, res: Response) => {
  const { name, email, password, recoveryAnswer } = req.body;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!name || !email || !password || !recoveryAnswer) {
    return res.status(400).json({ error: 'All fields (name, email, password, and security answer) are required.' });
  }

  const result = dbStore.setupInitialOwner({
    name,
    email,
    password,
    recoveryAnswer,
    ipAddress
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({
    success: true,
    message: 'FREEDREAM Owner Account successfully created. Save your Recovery Key securely.',
    user: result.user,
    token: result.token,
    recoveryKey: result.recoveryKey
  });
});

// Owner & Administrator Login
app.post('/api/owner/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const result = dbStore.authenticateUser(email, password, ipAddress);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.json({
    success: true,
    user: result.user,
    token: result.token,
    message: `Welcome back, ${result.user?.name} [${result.user?.role.toUpperCase()}]`
  });
});

// Current User Session Check
app.get('/api/owner/me', (req: Request, res: Response) => {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'No active session token.' });
  }

  const verification = dbStore.verifyToken(token);
  if (!verification.valid || !verification.user) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  res.json({ success: true, user: verification.user });
});

// Owner Logout
app.post('/api/owner/logout', (req: Request, res: Response) => {
  const token = extractBearerToken(req);
  if (token) {
    dbStore.invalidateToken(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Password Recovery with Emergency Key or Security Answer
app.post('/api/owner/recovery', (req: Request, res: Response) => {
  const { email, recoveryKeyOrAnswer, newPassword } = req.body;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!email || !recoveryKeyOrAnswer || !newPassword) {
    return res.status(400).json({ error: 'Email, recovery credential, and new password are required.' });
  }

  const result = dbStore.recoverPassword({
    email,
    recoveryKeyOrAnswer,
    newPassword,
    ipAddress
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
});

// =========================================================================
// OWNER DASHBOARD METRICS & HEALTH
// =========================================================================

app.get('/api/owner/stats', requireAdminAuth, (req: Request, res: Response) => {
  const stats = dbStore.getDashboardStats(communityProjects.length);
  res.json({ success: true, stats });
});

// =========================================================================
// OWNER NEWS MANAGEMENT (CRUD)
// =========================================================================

// Get all articles (including drafts & scheduled)
app.get('/api/owner/news', requireOwnerAuth, (req: Request, res: Response) => {
  const articles = dbStore.getAllNews();
  res.json({ success: true, articles });
});

// Create news article (Manual entry by Owner)
app.post('/api/owner/news', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, source, category, date, readTime, imageUrl, summary, fullText, url, featured, isPublished, scheduledAt } = req.body;

  if (!title || !summary || !source) {
    return res.status(400).json({ error: 'Headline, summary, and original source are required.' });
  }

  const created = dbStore.createNews({
    title: String(title).slice(0, 200),
    source: String(source).slice(0, 100),
    category: category || 'Global Technology',
    date: date || new Date().toISOString().split('T')[0],
    readTime: readTime || '3 min read',
    imageUrl: imageUrl || '',
    summary: String(summary).slice(0, 1000),
    fullText: fullText ? String(fullText) : undefined,
    url: url || '',
    featured: Boolean(featured),
    isPublished: isPublished !== false,
    scheduledAt: scheduledAt || undefined,
    authorEmail: user.email
  }, user.email, user.role);

  res.status(201).json({ success: true, article: created });
});

// =========================================================================
// OWNER NEWS CATEGORIES MANAGEMENT (Declared before /:id parameterized routes)
// =========================================================================

// Add news category
app.post('/api/owner/news/categories', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }
  const result = dbStore.addCategory(name, user.email, user.role);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json({ success: true, categories: result.categories });
});

// Rename news category
app.put('/api/owner/news/categories', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { oldName, newName } = req.body;
  if (!oldName || !newName) {
    return res.status(400).json({ error: 'Both current category and new category name are required.' });
  }
  const result = dbStore.renameCategory(oldName, newName, user.email, user.role);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ success: true, categories: result.categories });
});

// Delete news category
app.delete('/api/owner/news/categories/:name', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name } = req.params;
  const result = dbStore.deleteCategory(decodeURIComponent(name), user.email, user.role);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ success: true, categories: result.categories });
});

// Update news article
app.put('/api/owner/news/:id', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const updates = req.body;

  const updated = dbStore.updateNews(id, updates, user.email, user.role);
  if (!updated) {
    return res.status(404).json({ error: 'Article not found.' });
  }

  res.json({ success: true, article: updated });
});

// Delete news article
app.delete('/api/owner/news/:id', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  const deleted = dbStore.deleteNews(id, user.email, user.role);
  if (!deleted) {
    return res.status(404).json({ error: 'Article not found.' });
  }

  res.json({ success: true, message: 'Article deleted successfully.' });
});

// =========================================================================
// FEATURE CONTROL CENTER
// =========================================================================

app.get('/api/owner/features', requireAdminAuth, (req: Request, res: Response) => {
  const features = dbStore.getFeatureSettings();
  res.json({ success: true, features });
});

app.post('/api/owner/features', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const updates = req.body;

  const updated = dbStore.updateFeatureSettings(updates, user.email, user.role);
  res.json({ success: true, features: updated });
});

// =========================================================================
// ANNOUNCEMENTS & NOTIFICATIONS
// =========================================================================

app.get('/api/owner/announcements', requireAdminAuth, (req: Request, res: Response) => {
  const announcements = dbStore.getAnnouncements();
  res.json({ success: true, announcements });
});

app.post('/api/owner/announcements', requireAdminAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, message, category } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required.' });
  }

  const item = dbStore.createAnnouncement({
    title: String(title).slice(0, 140),
    message: String(message).slice(0, 800),
    category: category || 'Update',
    active: true,
    authorEmail: user.email
  }, user.email, user.role);

  res.status(201).json({ success: true, announcement: item });
});

app.patch('/api/owner/announcements/:id/toggle', requireAdminAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { active } = req.body;

  const success = dbStore.toggleAnnouncement(id, Boolean(active), user.email, user.role);
  if (!success) {
    return res.status(404).json({ error: 'Announcement not found.' });
  }

  res.json({ success: true });
});

// =========================================================================
// USER DIRECTORY & ROLE MANAGEMENT
// =========================================================================

app.get('/api/owner/users', requireAdminAuth, (req: Request, res: Response) => {
  const users = dbStore.getUsers();
  res.json({ success: true, users });
});

app.post('/api/owner/users/:id/role', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { role } = req.body;

  if (!['owner', 'admin', 'moderator', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  const result = dbStore.updateUserRole(id, role as UserRole, user.email, user.role);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, message: `User role changed to ${role}.` });
});

app.post('/api/owner/users/:id/suspend', requireOwnerAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { suspend } = req.body;

  const result = dbStore.toggleUserSuspension(id, Boolean(suspend), user.email, user.role);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, message: `User account ${suspend ? 'suspended' : 'restored'}.` });
});

// =========================================================================
// SECURITY AUDIT LOGS & USER REPORTS
// =========================================================================

app.get('/api/owner/audit-logs', requireAdminAuth, (req: Request, res: Response) => {
  const logs = dbStore.getAuditLogs();
  res.json({ success: true, logs });
});

app.get('/api/owner/feedback', requireAdminAuth, (req: Request, res: Response) => {
  const reports = dbStore.getFeedbackReports();
  res.json({ success: true, reports });
});

app.post('/api/owner/feedback/:id/resolve', requireAdminAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  const success = dbStore.resolveFeedbackReport(id, user.email, user.role);
  if (!success) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  res.json({ success: true });
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

// Serve frontend in dev / production (disabled on Vercel serverless where Vercel Edge serves static assets)
if (!process.env.VERCEL) {
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
}

export default app;

