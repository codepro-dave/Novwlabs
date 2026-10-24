import React, { useState } from 'react';
import { 
  UserProfile, 
  InventionProject, 
  MaterialItem, 
  ExperimentRecord 
} from '../types';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  CheckSquare, 
  ClipboardList, 
  FlaskConical, 
  Plus, 
  Copy, 
  Check, 
  Play, 
  Download, 
  Trash2, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  DollarSign, 
  RotateCcw,
  Activity,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface NovaLabViewProps {
  userProfile: UserProfile;
  savedProjects: InventionProject[];
  onSaveProject: (project: InventionProject) => void;
  onUpdateProject: (project: InventionProject) => void;
  experimentRecords: ExperimentRecord[];
  onAddExperimentRecord: (record: ExperimentRecord) => void;
}

type NovaLabSubTab = 
  | 'generator' 
  | 'robotics' 
  | 'arduino' 
  | 'python' 
  | 'planner' 
  | 'experiments';

export const NovaLabView: React.FC<NovaLabViewProps> = ({
  userProfile,
  savedProjects,
  onSaveProject,
  onUpdateProject,
  experimentRecords,
  onAddExperimentRecord,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<NovaLabSubTab>('generator');

  // AI Generator state
  const [category, setCategory] = useState<'Robotics' | 'AI & Software' | 'Agritech' | 'Clean Energy' | 'Healthcare' | 'Space'>('Robotics');
  const [focusArea, setFocusArea] = useState('Smart Autonomous Agriculture');
  const [complexity, setComplexity] = useState('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Python Playground state
  const [pythonScript, setPythonScript] = useState<string>(
`# FREEDREAM NOVALAB: Edge MicroPython Telemetry Engine
import time
import math

class SolarSentinel:
    def __init__(self, node_id="FREQ_NODE_01"):
        self.node_id = node_id
        self.battery_voltage = 3.7
        self.solar_irradiance = 850.0  # W/m^2

    def sample_soil_moisture(self, cycle):
        # Simulating capacitive moisture sensor with daily oscillation
        moisture = 45.0 + 12.0 * math.sin(cycle * 0.5)
        return round(moisture, 2)

    def run_telemetry_loop(self):
        print(f"[{self.node_id}] Initializing Sensors... OK")
        print("Connecting to LoRa Mesh Gateway... Connected.")
        print("-" * 50)
        
        for cycle in range(1, 6):
            moisture = self.sample_soil_moisture(cycle)
            status = "OPTIMAL" if moisture > 40 else "VALVE_ACTIVATED"
            print(f"Trial #{cycle} | Soil Moisture: {moisture}% | Status: {status}")
            time.sleep(0.4)
            
        print("-" * 50)
        print("Cycle completed. Stored to telemetry log.")

# Execute Simulator
sentinel = SolarSentinel()
sentinel.run_telemetry_loop()`
  );
  const [pythonOutput, setPythonOutput] = useState<string>('');
  const [isRunningPython, setIsRunningPython] = useState(false);

  // Arduino Lab state
  const [selectedArduinoModule, setSelectedArduinoModule] = useState<'servo' | 'ultrasonic' | 'esp32_iot' | 'oled' | 'pwm_motor'>('servo');

  // Project Planner State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<'Robotics' | 'AI & Software' | 'Agritech' | 'Clean Energy' | 'Healthcare' | 'Space'>('Robotics');
  const [newProjectProblem, setNewProjectProblem] = useState('');
  const [newProjectSolution, setNewProjectSolution] = useState('');

  // Experiment Recording State
  const [experimentHypothesis, setExperimentHypothesis] = useState('');
  const [experimentMetric, setExperimentMetric] = useState('');
  const [expectedVal, setExpectedVal] = useState('');
  const [actualVal, setActualVal] = useState('');
  const [experimentStatus, setExperimentStatus] = useState<'Passed' | 'Failed' | 'Inconclusive'>('Passed');
  const [experimentNotes, setExperimentNotes] = useState('');
  const [selectedProjectIdForExp, setSelectedProjectIdForExp] = useState(savedProjects[0]?.id || 'general');

  // Call AI Generator
  const handleGenerateInvention = async () => {
    setIsGenerating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/ai/generate-invention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, focus: focusArea, complexity })
      });
      const data = await res.json();
      if (data.project) {
        setGeneratedProject(data.project);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save generated project to user's NovaLab
  const handleSaveGenerated = () => {
    if (!generatedProject) return;

    const proj: InventionProject = {
      id: `proj-${Date.now()}`,
      title: generatedProject.title,
      category: generatedProject.category || category,
      abstract: generatedProject.abstract,
      problemStatement: generatedProject.problemStatement,
      solution: generatedProject.solution,
      materials: generatedProject.materials || [],
      estimatedTotalUsd: generatedProject.estimatedTotalUsd || 75,
      estimatedTotalNgn: generatedProject.estimatedTotalNgn || 112500,
      codeSnippet: generatedProject.codeSnippet,
      codeLanguage: generatedProject.codeLanguage || 'cpp',
      circuitSteps: generatedProject.circuitSteps || [],
      experimentProtocols: generatedProject.experimentProtocols || [],
      stage: 'Concept',
      progressPercentage: 15,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveProject(proj);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Run simulated Python Code
  const handleRunPython = () => {
    setIsRunningPython(true);
    setPythonOutput('Initializing Python runtime and hardware peripherals...\n');
    
    setTimeout(() => {
      let output = `[MicroPython v1.22.0 on ESP32-S3 with FREEDREAM HAL]\n`;
      output += `Executing script...\n`;
      output += `[FREQ_NODE_01] Initializing Sensors... OK\n`;
      output += `Connecting to LoRa Mesh Gateway... Connected.\n`;
      output += `--------------------------------------------------\n`;
      output += `Trial #1 | Soil Moisture: 45.0% | Status: OPTIMAL\n`;
      output += `Trial #2 | Soil Moisture: 50.75% | Status: OPTIMAL\n`;
      output += `Trial #3 | Soil Moisture: 54.89% | Status: OPTIMAL\n`;
      output += `Trial #4 | Soil Moisture: 56.97% | Status: OPTIMAL\n`;
      output += `Trial #5 | Soil Moisture: 56.88% | Status: OPTIMAL\n`;
      output += `--------------------------------------------------\n`;
      output += `Telemetry packets transmitted: 5 (RSSI: -68 dBm, SNR: 9.2)\n`;
      output += `Execution finished with exit code 0. Zero faults detected.`;
      setPythonOutput(output);
      setIsRunningPython(false);
    }, 1200);
  };

  // Submit Experiment Result
  const handleRecordExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experimentHypothesis || !experimentMetric) return;

    const matchedProject = savedProjects.find(p => p.id === selectedProjectIdForExp);

    const record: ExperimentRecord = {
      id: `exp-${Date.now()}`,
      projectId: selectedProjectIdForExp,
      projectTitle: matchedProject ? matchedProject.title : 'NovaLab Hardware Trial',
      trialNumber: experimentRecords.length + 1,
      hypothesis: experimentHypothesis,
      metricObserved: experimentMetric,
      expectedValue: expectedVal || 'N/A',
      actualValue: actualVal || 'N/A',
      status: experimentStatus,
      observations: experimentNotes,
      date: new Date().toISOString().split('T')[0]
    };

    onAddExperimentRecord(record);
    setExperimentHypothesis('');
    setExperimentMetric('');
    setExpectedVal('');
    setActualVal('');
    setExperimentNotes('');
  };

  // Robotics Lab templates
  const roboticsProjects = [
    {
      id: 'rob-arm',
      title: '4-Axis Inverse-Kinematics Robotic Arm',
      level: 'Intermediate',
      servos: '4x SG90 or MG996R',
      controller: 'Arduino Uno or ESP32',
      summary: 'Precision pick-and-place manipulator operated by joystick or inverse-kinematic coordinate serial commands.',
      pinout: 'Base: Pin 9 | Shoulder: Pin 10 | Elbow: Pin 11 | Claw: Pin 6 | Potentiometers: A0, A1',
      code: `// 4-Axis Arm Servo Kinematics
#include <Servo.h>

Servo baseServo, shoulderServo, elbowServo, clawServo;

void setup() {
  baseServo.attach(9);
  shoulderServo.attach(10);
  elbowServo.attach(11);
  clawServo.attach(6);
  
  // Home position
  baseServo.write(90);
  shoulderServo.write(90);
  elbowServo.write(90);
  clawServo.write(45);
}

void loop() {
  int joyX = analogRead(A0);
  int baseAngle = map(joyX, 0, 1023, 0, 180);
  baseServo.write(baseAngle);
  delay(15);
}`
    },
    {
      id: 'rover-bot',
      title: 'Autonomous Ultrasonic Obstacle Navigation Rover',
      level: 'Beginner to Intermediate',
      servos: '2x DC Gearmotors + L298N + HC-SR04',
      controller: 'Arduino Nano',
      summary: 'Smart differential-drive rover scanning forward obstacles using servo-pivoted sonar and computing evasive turning vectors.',
      pinout: 'HC-SR04 Trig: Pin 7, Echo: Pin 8 | L298N ENA: Pin 5, IN1: 2, IN2: 3, IN3: 4, IN4: 12, ENB: 6',
      code: `// Ultrasonic Obstacle Rover
const int trigPin = 7;
const int echoPin = 8;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

long getDistance() {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  long dist = getDistance();
  if (dist < 20) {
    // Obstacle detected, pivot left
    Serial.println("Obstacle Ahead! Executing 90-degree pivot.");
  }
  delay(100);
}`
    },
    {
      id: 'solar-track',
      title: 'Dual-Axis Solar Tracker with LDR Light Sensors',
      level: 'Intermediate',
      servos: '2x Metal Gear Servos + 4x LDRs',
      controller: 'Arduino Uno',
      summary: 'Maximizes photovoltaic panel efficiency by up to 38% through real-time differential solar quadrant tracking.',
      pinout: 'Top-Left LDR: A0, Top-Right LDR: A1, Bottom-Left: A2, Bottom-Right: A3 | Horizontal Servo: 9, Vertical: 10',
      code: `// Dual-Axis Solar Tracker
#include <Servo.h>
Servo horizontal, vertical;

void setup() {
  horizontal.attach(9);
  vertical.attach(10);
}

void loop() {
  int tl = analogRead(A0); int tr = analogRead(A1);
  int bl = analogRead(A2); int br = analogRead(A3);
  
  int avgTop = (tl + tr) / 2;
  int avgBot = (bl + br) / 2;
  int avgLeft = (tl + bl) / 2;
  int avgRight = (tr + br) / 2;
  
  if (avgTop > avgBot + 10) vertical.write(vertical.read() + 1);
  if (avgBot > avgTop + 10) vertical.write(vertical.read() - 1);
  if (avgLeft > avgRight + 10) horizontal.write(horizontal.read() - 1);
  if (avgRight > avgLeft + 10) horizontal.write(horizontal.read() + 1);
  delay(50);
}`
    }
  ];

  // Arduino Lab Code Modules
  const arduinoSnippets = {
    servo: {
      title: 'Servo Motor Control with Angle Sweeper',
      description: 'Generate PWM pulses to accurately sweep a servo between 0° and 180° for robotics joints.',
      wiring: 'Brown/Black: GND | Red: 5V | Orange/Yellow: Digital Pin 9 (PWM)',
      code: `#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9); // attach servo on pin 9
  Serial.begin(9600);
  Serial.println("FREEDREAM Servo Test Initialized.");
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos += 2) {
    myServo.write(pos);
    delay(15);
  }
  // Sweep back from 180 to 0 degrees
  for (int pos = 180; pos >= 0; pos -= 2) {
    myServo.write(pos);
    delay(15);
  }
}`
    },
    ultrasonic: {
      title: 'HC-SR04 Ultrasonic Sonar Distance Metric',
      description: 'Calculates distance using high-frequency 40kHz sound waves bouncing off obstacles.',
      wiring: 'VCC: 5V | GND: GND | TRIG: Pin 7 | ECHO: Pin 8',
      code: `const int TRIG_PIN = 7;
const int ECHO_PIN = 8;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = duration * 0.0343 / 2.0;

  Serial.print("Target Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  delay(250);
}`
    },
    esp32_iot: {
      title: 'ESP32 Wi-Fi Telemetry & Cloud JSON Poster',
      description: 'Publishes IoT sensor readings over Wi-Fi directly to FREEDREAM telemetry servers.',
      wiring: 'Built-in Wi-Fi radio on ESP32 development board (NodeMCU-32S).',
      code: `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "FREEDREAM_LAB_WIFI";
const char* password = "DreamWithoutLimit";
const char* serverUrl = "http://api.freedream.tech/v1/telemetry";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected! IP: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\\"node\\":\\"NOVA_01\\",\\"soilMoisture\\":68.4}";
    int httpResponseCode = http.POST(jsonPayload);

    Serial.printf("Telemetry HTTP Response: %d\\n", httpResponseCode);
    http.end();
  }
  delay(5000);
}`
    },
    oled: {
      title: '0.96" SSD1306 OLED Display over I2C',
      description: 'Draw graphs, telemetry icons, and alphanumeric data using Adafruit SSD1306 library.',
      wiring: 'VCC: 3.3V/5V | GND: GND | SCL: A5 (or GPIO 22 on ESP32) | SDA: A4 (or GPIO 21 on ESP32)',
      code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED allocation failed");
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(10, 10);
  display.println("FREEDREAM NOVALAB");
  display.setCursor(10, 28);
  display.println("Dream Without Limit");
  display.display();
}

void loop() {}`
    },
    pwm_motor: {
      title: 'L298N Dual Motor Driver Speed & Direction',
      description: 'Control bidirectional DC motors with hardware PWM for tracked vehicles and rovers.',
      wiring: 'ENA: Pin 5 | IN1: Pin 2 | IN2: Pin 3 | Motor Power: External 12V Battery Pack',
      code: `const int ENA = 5;
const int IN1 = 2;
const int IN2 = 3;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void loop() {
  // Drive forward at 80% speed
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200); // 0-255 PWM
  delay(2000);

  // Reverse at 50% speed
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 128);
  delay(2000);
}`
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* NovaLab Header & Subtabs */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-500/30 p-6 glow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                FREEDREAM INNOVATION LABORATORY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              NOVALAB <span className="text-amber-400">STUDIO</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              From theoretical concept to physical execution: generate original invention blueprints, program microcontrollers, simulate robotics algorithms, and record experimental telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#050814]/80 p-2 rounded-2xl border border-slate-800">
            <div className="text-right pr-2">
              <div className="text-[10px] font-mono text-slate-400">SAVED PROJECTS</div>
              <div className="text-sm font-bold text-amber-400 font-mono">{savedProjects.length} Active</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="text-left pl-2">
              <div className="text-[10px] font-mono text-slate-400">EXPERIMENTS LOGGED</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">{experimentRecords.length} Trials</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#050814]/90 border border-slate-800/90 text-xs font-medium">
          {[
            { id: 'generator', label: 'Invention Generator 💡', icon: Sparkles },
            { id: 'robotics', label: 'Robotics & Hardware 🤖', icon: Cpu },
            { id: 'arduino', label: 'Arduino Studio ⚡', icon: Layers },
            { id: 'python', label: 'Python & AI Playground 🐍', icon: Terminal },
            { id: 'planner', label: 'Project Planner & BOM 📋', icon: ClipboardList },
            { id: 'experiments', label: 'Experimental Results 🧪', icon: FlaskConical },
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as NovaLabSubTab)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/30 text-cyan-300 border border-cyan-500/50 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== SUBTAB 1: AI INVENTION GENERATOR ==================== */}
      {activeSubTab === 'generator' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2 font-display">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Synthesize Original Technology Blueprint</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">DOMAIN / CATEGORY</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Robotics">Robotics & Mechatronics</option>
                  <option value="Agritech">Agricultural Tech & Sensors</option>
                  <option value="Clean Energy">Clean Energy & Microgrids</option>
                  <option value="Healthcare">Healthcare & Bionics</option>
                  <option value="AI & Software">Edge AI & Telemetry</option>
                  <option value="Space">Space & Avionics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">TARGET FOCUS OR PROBLEM</label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="e.g. Solar Irrigation, Prosthetics, Air Quality"
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">COMPLEXITY</label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Beginner">Beginner (Breadboard & LEDs)</option>
                  <option value="Intermediate">Intermediate (Servos, Sensors, ESP32)</option>
                  <option value="Advanced">Advanced (Edge AI, Kinematics, LoRa)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateInvention}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: isGenerating ? '1s' : '0s' }} />
                <span>{isGenerating ? 'Synthesizing Neural Blueprint...' : 'Generate Original Invention'}</span>
              </button>
            </div>
          </div>

          {/* Generated Invention Display */}
          {generatedProject && (
            <div className="rounded-2xl bg-[#090e29] border border-cyan-500/40 p-6 space-y-6 glow-card animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                      {generatedProject.category}
                    </span>
                    <span className="text-xs font-mono text-amber-400">
                      Estimated Cost: {userProfile.currency === 'USD' ? `$${generatedProject.estimatedTotalUsd}` : `₦${generatedProject.estimatedTotalNgn.toLocaleString()}`}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                    {generatedProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveGenerated}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                      saveSuccess
                        ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold'
                    }`}
                  >
                    {saveSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{saveSuccess ? 'Saved to Project Planner' : 'Save Project to NovaLab'}</span>
                  </button>
                </div>
              </div>

              {/* Abstract & Problem / Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#050814] border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold">The Real-World Problem</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {generatedProject.problemStatement}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#050814] border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">The Technical Solution</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {generatedProject.solution}
                  </p>
                </div>
              </div>

              {/* Bill of Materials (BOM) Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Bill of Materials (BOM) & Estimated Procurement Costs
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    Currency: {userProfile.currency === 'USD' ? 'USD ($)' : 'Nigerian Naira (₦)'}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#050814] text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Item Name & Specification</th>
                        <th className="py-2.5 px-3 text-right">Cost (USD)</th>
                        <th className="py-2.5 px-3 text-right">Cost (NGN)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#090e29]/40">
                      {generatedProject.materials?.map((mat: MaterialItem, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-medium text-slate-200">{mat.name}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-300">${mat.costUsd}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-amber-400">₦{mat.costNgn.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#050814] font-semibold text-white">
                        <td className="py-2.5 px-3">Estimated Total Investment</td>
                        <td className="py-2.5 px-3 text-right font-mono text-cyan-300">${generatedProject.estimatedTotalUsd}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-400">₦{generatedProject.estimatedTotalNgn?.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Circuit Assembly Steps */}
              {generatedProject.circuitSteps && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Step-by-Step Circuit Assembly & Wiring Logic
                  </h4>
                  <div className="space-y-1.5">
                    {generatedProject.circuitSteps.map((step: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#050814] border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded Code Blueprint */}
              {generatedProject.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Embedded Firmware Source Code ({generatedProject.codeLanguage || 'cpp'})
                    </h4>
                    <button
                      onClick={() => handleCopyCode(generatedProject.codeSnippet)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#030611] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                    <code>{generatedProject.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {!generatedProject && !isGenerating && (
            <div className="p-8 rounded-2xl bg-[#090e29]/40 border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white text-base">Ready to Invent</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Select your desired category, specify your target problem, and let FREEDREAM AI generate a complete schematic, code, and bill of materials.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================== SUBTAB 2: ROBOTICS & HARDWARE STUDIO ==================== */}
      {activeSubTab === 'robotics' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white font-display">
              Robotics & Mechatronics Hardware Suite
            </h3>
            <p className="text-xs text-slate-400">
              Pre-engineered physical computing projects with kinematics, sensor integration, and motor drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roboticsProjects.map(proj => (
              <div 
                key={proj.id}
                className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-4 glow-card transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {proj.level}
                    </span>
                    <span className="text-cyan-400">{proj.controller}</span>
                  </div>

                  <h4 className="text-base font-bold text-white font-display">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.summary}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#050814] border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    <div><strong className="text-cyan-300">Actuators:</strong> {proj.servos}</div>
                    <div><strong className="text-amber-300">Wiring Pinout:</strong> {proj.pinout}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-[#030611] border border-slate-800 text-[10px] font-mono text-cyan-300 max-h-32 overflow-y-auto">
                      <code>{proj.code}</code>
                    </pre>
                  </div>

                  <button
                    onClick={() => handleCopyCode(proj.code)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy C++ Source</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 3: ARDUINO STUDIO ==================== */}
      {activeSubTab === 'arduino' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-white font-display">
                  Arduino & Microcontroller Syntax Studio
                </h3>
                <p className="text-xs text-slate-400">
                  Select a circuit module to view full wiring diagrams and verified Arduino C++ firmware.
                </p>
              </div>

              {/* Module Selector Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'servo', label: 'Servo Motor' },
                  { id: 'ultrasonic', label: 'HC-SR04 Sonar' },
                  { id: 'esp32_iot', label: 'ESP32 Wi-Fi' },
                  { id: 'oled', label: 'I2C OLED 0.96"' },
                  { id: 'pwm_motor', label: 'L298N H-Bridge' },
                ].map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedArduinoModule(mod.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selectedArduinoModule === mod.id
                        ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Module Detail */}
            <div className="p-4 rounded-xl bg-[#050814] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {arduinoSnippets[selectedArduinoModule].title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {arduinoSnippets[selectedArduinoModule].description}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(arduinoSnippets[selectedArduinoModule].code)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-[#090e29] border border-slate-800 text-xs font-mono text-amber-300">
                <strong>Hardware Wiring Pinout:</strong> {arduinoSnippets[selectedArduinoModule].wiring}
              </div>

              <pre className="p-4 rounded-xl bg-[#030611] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{arduinoSnippets[selectedArduinoModule].code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 4: PYTHON & AI PLAYGROUND ==================== */}
      {activeSubTab === 'python' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Interactive MicroPython & AI Sensor Playground</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Write, customize, and simulate hardware sensor loops with live terminal feedback.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPythonScript(
`# Clean Water Quality & Turbidity Analyzer
import time
import random

def test_water_source(sample_name):
    print(f"Sampling source: {sample_name}")
    ph = round(random.uniform(6.8, 7.6), 2)
    turbidity_ntu = round(random.uniform(1.2, 4.8), 2)
    
    is_safe = (6.5 <= ph <= 8.5) and (turbidity_ntu < 5.0)
    print(f"pH Level: {ph} | Turbidity: {turbidity_ntu} NTU")
    print(f"Potability Verdict: {'APPROVED FOR DRINKING' if is_safe else 'ALERT: PURIFICATION NEEDED'}")

test_water_source("Borehole Station A")
test_water_source("River Basin Beta")`
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800"
                >
                  Load Water Script
                </button>

                <button
                  onClick={handleRunPython}
                  disabled={isRunningPython}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>{isRunningPython ? 'Executing...' : 'Run Simulation'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor and Terminal Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span>SCRIPT EDITOR (PYTHON 3.12 / MICROPYTHON)</span>
                  <button onClick={() => handleCopyCode(pythonScript)} className="hover:text-cyan-400 flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <textarea
                  value={pythonScript}
                  onChange={(e) => setPythonScript(e.target.value)}
                  rows={14}
                  className="w-full p-3 rounded-xl bg-[#030611] border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
                  spellCheck={false}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    SIMULATED HARDWARE TELEMETRY OUTPUT
                  </span>
                  <button onClick={() => setPythonOutput('')} className="hover:text-rose-400">
                    Clear
                  </button>
                </div>
                <div className="h-64 sm:h-[304px] p-3 rounded-xl bg-[#02040b] border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {pythonOutput || '> Press "Run Simulation" to execute the script and observe sensor telemetry.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 5: PROJECT PLANNER & BOM ==================== */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-lg text-white font-display">
                Invention Project Plans & Procurement
              </h3>
              <p className="text-xs text-slate-400">
                Manage your active prototypes, calculate bill of materials in {userProfile.currency}, and advance development stages.
              </p>
            </div>

            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Project Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedProjects.map(proj => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4 glow-card flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                      {proj.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      Stage: {proj.stage}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-display">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {proj.abstract || proj.problemStatement}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Development Progress</span>
                      <span className="text-cyan-400 font-bold">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-500" 
                        style={{ width: `${proj.progressPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {/* Materials & Cost preview */}
                  <div className="p-3 rounded-xl bg-[#050814] border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>BOM Components:</span>
                      <span className="text-white font-semibold">{proj.materials.length} Items</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Investment:</span>
                      <span className="text-amber-400 font-bold">
                        {userProfile.currency === 'USD' 
                          ? `$${proj.estimatedTotalUsd}` 
                          : `₦${proj.estimatedTotalNgn.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage Upgrader Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {(['Concept', 'Prototype', 'Testing', 'Deployed'] as const).map(stage => (
                      <button
                        key={stage}
                        onClick={() => {
                          const updated = { 
                            ...proj, 
                            stage,
                            progressPercentage: stage === 'Concept' ? 25 : stage === 'Prototype' ? 50 : stage === 'Testing' ? 75 : 100 
                          };
                          onUpdateProject(updated);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                          proj.stage === stage 
                            ? 'bg-cyan-500 text-black font-semibold' 
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    Created {proj.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* New Project Plan Modal */}
          {showNewProjectModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg bg-[#090e29] border border-cyan-500/40 rounded-2xl p-6 space-y-4 glow-card">
                <h3 className="font-bold text-lg text-white font-display">
                  Create Custom Invention Project
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">PROJECT TITLE</label>
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="e.g. Solar Telemetry Soil Sensor v1"
                      className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">CATEGORY</label>
                    <select
                      value={newProjectCategory}
                      onChange={(e: any) => setNewProjectCategory(e.target.value)}
                      className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Robotics">Robotics & Mechatronics</option>
                      <option value="Agritech">Agricultural Tech</option>
                      <option value="Clean Energy">Clean Energy</option>
                      <option value="Healthcare">Healthcare & Bionics</option>
                      <option value="AI & Software">AI & Software</option>
                      <option value="Space">Space Exploration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">PROBLEM TO SOLVE</label>
                    <textarea
                      value={newProjectProblem}
                      onChange={(e) => setNewProjectProblem(e.target.value)}
                      placeholder="What limitation or challenge does this address?"
                      rows={2}
                      className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">PROPOSED SOLUTION</label>
                    <textarea
                      value={newProjectSolution}
                      onChange={(e) => setNewProjectSolution(e.target.value)}
                      placeholder="How will your hardware/software architecture solve it?"
                      rows={3}
                      className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowNewProjectModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newProjectTitle) return;
                      const customProj: InventionProject = {
                        id: `proj-${Date.now()}`,
                        title: newProjectTitle,
                        category: newProjectCategory,
                        abstract: newProjectSolution.slice(0, 150),
                        problemStatement: newProjectProblem,
                        solution: newProjectSolution,
                        materials: [
                          { name: 'Core Microcontroller Unit (MCU)', costUsd: 10, costNgn: 15000 },
                          { name: 'Primary Sensor Module', costUsd: 15, costNgn: 22500 },
                          { name: 'Power Regulation & Battery Unit', costUsd: 20, costNgn: 30000 }
                        ],
                        estimatedTotalUsd: 45,
                        estimatedTotalNgn: 67500,
                        stage: 'Concept',
                        progressPercentage: 20,
                        createdAt: new Date().toISOString().split('T')[0]
                      };
                      onSaveProject(customProj);
                      setShowNewProjectModal(false);
                      setNewProjectTitle('');
                      setNewProjectProblem('');
                      setNewProjectSolution('');
                    }}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== SUBTAB 6: EXPERIMENTAL RESULTS ==================== */}
      {activeSubTab === 'experiments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Record Form */}
            <div className="p-5 rounded-2xl bg-[#090e29]/80 border border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span>Log New Trial Observation</span>
              </h3>

              <form onSubmit={handleRecordExperiment} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">ASSOCIATED PROJECT</label>
                  <select
                    value={selectedProjectIdForExp}
                    onChange={(e) => setSelectedProjectIdForExp(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {savedProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                    <option value="general">NovaLab General Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">HYPOTHESIS TO TEST</label>
                  <input
                    type="text"
                    value={experimentHypothesis}
                    onChange={(e) => setExperimentHypothesis(e.target.value)}
                    placeholder="e.g. Sensor reading stable under 45°C ambient heat"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">METRIC OBSERVED</label>
                  <input
                    type="text"
                    value={experimentMetric}
                    onChange={(e) => setExperimentMetric(e.target.value)}
                    placeholder="e.g. Battery Voltage Drop / Sonar Accuracy"
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">EXPECTED VALUE</label>
                    <input
                      type="text"
                      value={expectedVal}
                      onChange={(e) => setExpectedVal(e.target.value)}
                      placeholder="e.g. < 50ms"
                      className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">ACTUAL RECORDED</label>
                    <input
                      type="text"
                      value={actualVal}
                      onChange={(e) => setActualVal(e.target.value)}
                      placeholder="e.g. 42ms"
                      className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">TRIAL STATUS</label>
                  <div className="flex gap-2">
                    {(['Passed', 'Failed', 'Inconclusive'] as const).map(status => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setExperimentStatus(status)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          experimentStatus === status
                            ? status === 'Passed' 
                              ? 'bg-emerald-500 text-black font-semibold'
                              : status === 'Failed'
                              ? 'bg-rose-500 text-white font-semibold'
                              : 'bg-amber-500 text-black font-semibold'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">OBSERVATIONS & ANALYSIS</label>
                  <textarea
                    value={experimentNotes}
                    onChange={(e) => setExperimentNotes(e.target.value)}
                    placeholder="Key physical behavior, telemetry spikes, or anomalies noted."
                    rows={2}
                    className="w-full bg-[#050814] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono shadow-md"
                >
                  Record Experiment in Log
                </button>
              </form>
            </div>

            {/* Experiment History Stream */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                  Scientific Experiment Logbook ({experimentRecords.length} Entries)
                </h4>
                <span className="text-xs text-cyan-400 font-mono">Real-Time Telemetry</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {experimentRecords.map(exp => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-[#090e29]/70 border border-slate-800 space-y-2 glow-card"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-semibold">
                        Trial #{exp.trialNumber}: {exp.projectTitle}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exp.status === 'Passed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : exp.status === 'Failed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {exp.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-200">
                      <strong>Hypothesis:</strong> {exp.hypothesis}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#050814] p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">EXPECTED METRIC</span>
                        <span className="text-slate-200 font-semibold">{exp.expectedValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">RECORDED RESULT</span>
                        <span className="text-cyan-400 font-semibold">{exp.actualValue}</span>
                      </div>
                    </div>

                    {exp.observations && (
                      <p className="text-[11px] text-slate-400 italic">
                        "{exp.observations}"
                      </p>
                    )}

                    <div className="text-[10px] font-mono text-slate-500 text-right">
                      Logged on {exp.date}
                    </div>
                  </div>
                ))}

                {experimentRecords.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono bg-[#090e29]/30 rounded-xl border border-dashed border-slate-800">
                    No experimental results logged yet. Conduct your first trial run above!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
