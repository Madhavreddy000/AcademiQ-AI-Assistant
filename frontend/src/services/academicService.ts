import { apiFetch } from './api';
import { Department, Course, Subject, AcademicDocument, DocumentCategory, AccessLevel, DepartmentCode } from '../types';

const INITIAL_DOCUMENTS: AcademicDocument[] = [
  {
    id: 1,
    title: 'Academic Regulations & Examination Handbook 2025-2026',
    fileName: 'academic_regulations_2025_2026.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2450000,
    category: 'REGULATION',
    departmentCode: 'ALL',
    targetYear: 0,
    targetSemester: 0,
    departmentId: 1,
    academicYear: '2025-2026',
    accessLevel: 'PUBLIC',
    status: 'INDEXED',
    chunkCount: 142,
    totalPages: 68,
    uploaderName: 'Office of Academic Affairs',
    version: 1,
    extractedText: `Section 4.1 Mandatory Attendance Requirement: Every registered student must maintain a minimum of 75% overall attendance across theory lectures, tutorials, and practical laboratory sessions in each registered subject to be eligible to appear for the End-Semester Examination.
Section 4.2 Condonation of Attendance Shortage on Medical Grounds: The Dean of Academic Affairs may condone attendance shortages between 65% and 74% strictly upon submission of verified medical documentation from an accredited hospital within 7 calendar days of absence. A condonation fee applies.
Section 4.3 Detention: Any student with overall attendance strictly below 65% is detained in that subject and disqualified from sitting for the end-semester examination without exception. Detained students must re-register and re-attend the course in a subsequent semester.
Section 7.1 10-Point Absolute Grading Scale: The university follows a 10-point letter grading system: O (Outstanding, 90-100%, GP 10), A+ (Excellent, 80-89%, GP 9), A (Very Good, 70-79%, GP 8), B+ (Good, 60-69%, GP 7), B (Above Average, 55-59%, GP 6), C (Average, 50-54%, GP 5), P (Pass, 40-49%, GP 4), F (Fail, below 40%, GP 0). Minimum CGPA required for degree award is 5.0.`,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'CSE: CS201 Data Structures & Algorithms Syllabus & Scheme',
    fileName: 'cs201_data_structures_syllabus.txt',
    fileType: 'TXT',
    fileSizeBytes: 4120000,
    category: 'SYLLABUS',
    departmentCode: 'CSE',
    targetYear: 2,
    targetSemester: 4,
    departmentId: 1,
    courseId: 1,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 220,
    totalPages: 4,
    uploaderName: 'Prof. David Chen (CSE Faculty)',
    version: 1,
    extractedText: `Department: Computer Science & Engineering (CSE) | Semester 4 (2nd Year)
Course Title: Data Structures and Algorithms (CS201). Credits: 4.
Unit 1: Linear Data Structures: Stacks, Queues, Circular Queues, Linked Lists, Expression Evaluation and Infix-to-Postfix conversion.
Unit 2: Non-Linear Hierarchical Structures: Binary Trees, Binary Search Trees (BST), AVL Tree balancing, Heaps and Heap Sort.
Unit 3: Graph Algorithms: Representations (Adjacency Matrix and List), Graph Traversals (Breadth-First Search BFS and Depth-First Search DFS), Minimum Spanning Trees (Prim's Algorithm and Kruskal's Algorithm with DSU), Shortest Paths (Dijkstra's Single Source Shortest Path and Bellman-Ford algorithm).
Unit 4: Algorithm Design Techniques: Dynamic Programming (0/1 Knapsack, Longest Common Subsequence), Greedy Algorithms (Huffman coding), and Hashing with collision resolution.
Continuous Internal Evaluation (CIE): 40 Marks (Two mid-term exams 15+15 marks, Lab assignments 10 marks).
End-Semester Examination (ESE): 60 Marks (3-hour comprehensive written exam). Passing criteria: 40% in ESE and 40% aggregate.`,
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 3,
    title: 'CSE: CS202 Operating Systems Curriculum & Lab Guidelines',
    fileName: 'cs202_operating_systems_syllabus.txt',
    fileType: 'TXT',
    fileSizeBytes: 1850000,
    category: 'SYLLABUS',
    departmentCode: 'CSE',
    targetYear: 2,
    targetSemester: 4,
    departmentId: 1,
    courseId: 1,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 85,
    totalPages: 3,
    uploaderName: 'Prof. David Chen (CSE Faculty)',
    version: 1,
    extractedText: `Department: Computer Science & Engineering (CSE) | Semester 4 (2nd Year)
Course Title: Operating Systems (CS202). Credits: 4.
Unit 1: Process Management & Threads: Process Control Block (PCB), context switching, CPU scheduling algorithms (FCFS, SJF, Round Robin, Multi-level queues).
Unit 2: Process Synchronization & Deadlocks: Critical section problem, Peterson's algorithm, Semaphores, Mutex locks, Deadlock detection, prevention, and Bankers algorithm.
Unit 3: Memory Management: Paging, Segmentation, Virtual Memory, Demand paging, Page replacement algorithms (FIFO, LRU, Optimal).
Unit 4: Storage & File Systems: Disk scheduling (SCAN, C-SCAN, LOOK), File allocation methods (Contiguous, Linked, Indexed), directory structures.
Evaluation Scheme: 40 Marks Internal Assessment, 60 Marks Final Exam.`,
    createdAt: '2026-08-18T09:00:00Z',
    updatedAt: '2026-08-18T09:00:00Z',
  },
  {
    id: 4,
    title: 'AIML: AI401 Deep Neural Networks & Computer Vision Syllabus',
    fileName: 'ai401_deep_learning_syllabus.pdf',
    fileType: 'PDF',
    fileSizeBytes: 3200000,
    category: 'COURSE_MATERIAL',
    departmentCode: 'AIML',
    targetYear: 3,
    targetSemester: 5,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 110,
    totalPages: 12,
    uploaderName: 'Dr. Anita Roy (AIML Faculty)',
    version: 1,
    extractedText: `Department: Artificial Intelligence & Machine Learning (AIML) | Semester 5 (3rd Year)
Course Title: Deep Neural Networks & Computer Vision (AI401). Credits: 4.
Unit 1: Foundations of Deep Learning: Multilayer Perceptrons (MLP), Activation functions (ReLU, GELU, Sigmoid), Backpropagation, Gradient Descent optimizers (Adam, RMSprop, AdaGrad), Regularization (Dropout, L2, Batch Normalization).
Unit 2: Convolutional Neural Networks (CNNs): Convolution, Pooling, ResNet residual connections, Inception modules, YOLO real-time object detection, Image segmentation using U-Net.
Unit 3: Sequence Modeling & Transformers: Recurrent Neural Networks (RNN), LSTMs, GRUs, Attention mechanism, Transformer encoder-decoder architectures, Vision Transformers (ViT).
Unit 4: Generative AI & Foundation Models: Autoencoders, Variational Autoencoders (VAEs), Generative Adversarial Networks (GANs), Diffusion Models, Large Language Model fine-tuning (LoRA, PEFT).
Lab Practicals: PyTorch implementation of CNNs, Transfer learning on CIFAR-100, Fine-tuning HuggingFace vision models.
Evaluation: Midterm 30%, Lab Viva 20%, Project 20%, Final Exam 30%.`,
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 5,
    title: 'DS: DS301 Big Data Analytics & Apache Spark Handbook',
    fileName: 'ds301_big_data_handbook.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2800000,
    category: 'COURSE_MATERIAL',
    departmentCode: 'DS',
    targetYear: 3,
    targetSemester: 5,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 95,
    totalPages: 10,
    uploaderName: 'Prof. Vikram Sen (DS Faculty)',
    version: 1,
    extractedText: `Department: Data Science (DS) | Semester 5 (3rd Year)
Course Title: Big Data Analytics & Distributed Systems (DS301). Credits: 4.
Unit 1: Big Data Ecosystem: 5 V's of Big Data, Hadoop Distributed File System (HDFS) architecture, NameNode & DataNode failover, MapReduce programming paradigm.
Unit 2: Apache Spark Framework: Resilient Distributed Datasets (RDDs), Transformations & Actions, Spark SQL, DataFrames, Catalyst Optimizer, In-memory computing advantages.
Unit 3: Stream Processing & Message Queues: Apache Kafka distributed pub-sub, Producer-Consumer architecture, Spark Streaming with Structured Streaming, Windowing operations.
Unit 4: NoSQL Databases & Data Warehousing: MongoDB document store, Cassandra wide-column store, CAP Theorem, Snowflake & Apache Hive query optimization.
Exam Weightage: Continuous Internal Evaluation 40 Marks, End Semester Exam 60 Marks.`,
    createdAt: '2026-09-05T14:00:00Z',
    updatedAt: '2026-09-05T14:00:00Z',
  },
  {
    id: 6,
    title: 'ECE: EC301 Digital Signal Processing & Filter Design',
    fileName: 'ec301_dsp_curriculum.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2100000,
    category: 'SYLLABUS',
    departmentCode: 'ECE',
    targetYear: 2,
    targetSemester: 4,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 88,
    totalPages: 8,
    uploaderName: 'Dr. Suresh Kumar (ECE Faculty)',
    version: 1,
    extractedText: `Department: Electronics & Communication Engineering (ECE) | Semester 4 (2nd Year)
Course Title: Digital Signal Processing (EC301). Credits: 4.
Unit 1: Discrete-Time Signals & Systems: Linear Time-Invariant (LTI) systems, Convolution sum, Z-Transform, Region of Convergence (ROC), Inverse Z-Transform.
Unit 2: Discrete Fourier Transform (DFT) & FFT: Properties of DFT, Circular convolution, Fast Fourier Transform (FFT) Decimation-in-Time (DIT) and Decimation-in-Frequency (DIF) radix-2 algorithms.
Unit 3: IIR Filter Design: Butterworth and Chebyshev filter approximations, Bilinear Transformation method, Impulse Invariance method, Frequency warping compensation.
Unit 4: FIR Filter Design: Linear phase FIR filters, Windowing techniques (Rectangular, Hamming, Hanning, Blackman), Frequency sampling design.
Laboratory: MATLAB filter realization, DSP processor TMS320C6713 programming.`,
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 7,
    title: 'EEE: EE301 Power Electronics & Inverter Control Manual',
    fileName: 'ee301_power_electronics.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2600000,
    category: 'COURSE_MATERIAL',
    departmentCode: 'EEE',
    targetYear: 3,
    targetSemester: 5,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 92,
    totalPages: 9,
    uploaderName: 'Prof. Ramesh Rao (EEE Faculty)',
    version: 1,
    extractedText: `Department: Electrical & Electronics Engineering (EEE) | Semester 5 (3rd Year)
Course Title: Power Electronics (EE301). Credits: 4.
Unit 1: Power Semiconductor Switches: SCR, MOSFET, IGBT characteristics, gate triggering circuits, snubbers, thermal management and heat sink sizing.
Unit 2: Controlled Rectifiers: Single-phase and three-phase fully controlled bridge rectifiers, R and R-L loads, effect of source inductance, power factor improvement.
Unit 3: DC-DC Choppers: Buck, Boost, and Buck-Boost converters in Continuous & Discontinuous Conduction Modes (CCM/DCM), duty cycle control, Flyback converters.
Unit 4: Inverters & Motor Drives: Voltage Source Inverters (VSI), Pulse Width Modulation (SPWM, SVPWM), Harmonic reduction, Induction motor Variable Frequency Drives (VFD).`,
    createdAt: '2026-09-12T08:30:00Z',
    updatedAt: '2026-09-12T08:30:00Z',
  },
  {
    id: 8,
    title: 'MECH: ME201 Applied Thermodynamics & Gas Power Cycles',
    fileName: 'me201_thermodynamics.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2900000,
    category: 'SYLLABUS',
    departmentCode: 'MECH',
    targetYear: 2,
    targetSemester: 3,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 104,
    totalPages: 11,
    uploaderName: 'Dr. Arjun Nair (MECH Faculty)',
    version: 1,
    extractedText: `Department: Mechanical Engineering (MECH) | Semester 3 (2nd Year)
Course Title: Applied Thermodynamics (ME201). Credits: 4.
Unit 1: First and Second Laws of Thermodynamics: Steady Flow Energy Equation (SFEE), Clausius statement, Kelvin-Planck statement, Carnot theorem, Entropy generation.
Unit 2: Gas Power Cycles: Air standard Otto, Diesel, and Dual combustion cycles, Mean Effective Pressure (MEP), thermal efficiency comparisons, Brayton gas turbine cycle with regeneration.
Unit 3: Vapor Power Cycles: Rankine cycle with superheat and reheat, regenerative feed water heating, Boiler calculations, Steam turbine nozzle expansion.
Unit 4: Refrigeration & Psychrometry: Vapor Compression Refrigeration System (VCRS), COP calculation, Psychrometric charts, Summer and Winter air conditioning principles.`,
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-09-14T09:00:00Z',
  },
  {
    id: 9,
    title: 'CIVIL: CE201 Structural Analysis & Concrete Design Handbook',
    fileName: 'ce201_structural_analysis.pdf',
    fileType: 'PDF',
    fileSizeBytes: 3100000,
    category: 'COURSE_MATERIAL',
    departmentCode: 'CIVIL',
    targetYear: 2,
    targetSemester: 4,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 115,
    totalPages: 14,
    uploaderName: 'Prof. Sandeep Patil (CIVIL Faculty)',
    version: 1,
    extractedText: `Department: Civil Engineering (CIVIL) | Semester 4 (2nd Year)
Course Title: Structural Analysis & Concrete Structures (CE201). Credits: 4.
Unit 1: Determinate and Indeterminate Structures: Degree of static and kinematic indeterminacy, Strain energy method, Castigliano theorems, Deflection of beams and frames.
Unit 2: Slope Deflection & Moment Distribution Methods: Analysis of continuous beams with support settlements, portal frames with sway and non-sway conditions.
Unit 3: Limit State Design of Reinforced Concrete: IS 456-2000 specifications, Singly and Doubly reinforced rectangular beams, Flanged beams (T and L beams), Shear and torsion design.
Unit 4: Design of Slabs & Columns: One-way and Two-way slabs, Short and Slender columns subjected to axial load and biaxial bending, Isolated footings.`,
    createdAt: '2026-09-16T10:00:00Z',
    updatedAt: '2026-09-16T10:00:00Z',
  },
  {
    id: 10,
    title: 'Examination Rules & Hall Ticket Guidelines 2026',
    fileName: 'examination_code_2026.docx',
    fileType: 'DOCX',
    fileSizeBytes: 980000,
    category: 'EXAM',
    departmentCode: 'ALL',
    targetYear: 0,
    targetSemester: 0,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 48,
    totalPages: 24,
    uploaderName: 'Controller of Examinations',
    version: 1,
    extractedText: `Rule 5.1 Hall Ticket Prerequisites: Hall tickets are released digitally 72 hours prior to the commencement of exams on the student academic portal. Students must have cleared all library dues and verified minimum 75% attendance.
Rule 5.2 Entry Requirements: Candidates must produce the physical printed Hall Ticket along with the original University Student ID Card. Entry after 15 minutes from exam start is strictly prohibited.
Rule 5.3 Malpractice & Smart Devices: Possession of programmable calculators, smartwatches, or mobile phones inside examination halls results in immediate confiscation and disciplinary committee suspension.`,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 11,
    title: 'Student Life, Hostel Curfew & Library Borrowing Code',
    fileName: 'student_hostel_code.pdf',
    fileType: 'PDF',
    fileSizeBytes: 1250000,
    category: 'HANDBOOK',
    departmentCode: 'ALL',
    targetYear: 0,
    targetSemester: 0,
    academicYear: '2025-2026',
    accessLevel: 'STUDENT',
    status: 'INDEXED',
    chunkCount: 65,
    totalPages: 32,
    uploaderName: 'Dean Student Affairs',
    version: 1,
    extractedText: `Hostel Curfew: Residence hall gates close at 10:00 PM on weekdays and 10:30 PM on weekends. Late arrivals are logged through biometric sensors and report to the warden. Quiet hours: 11:00 PM to 6:00 AM.
Library Privileges: Students can borrow up to 4 books for 14 calendar days with up to 2 online renewals. Overdue fine is $0.50 per book per day.
Anti-Harassment Hotline: Strict zero-tolerance for ragging or discrimination. 24/7 student counseling helpline is available at 1-800-UNIV-AID.`,
    createdAt: '2026-09-15T11:00:00Z',
    updatedAt: '2026-09-15T11:00:00Z',
  },
];

const MOCK_DEPARTMENTS: Department[] = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering', description: 'Artificial Intelligence, Software Systems, Algorithms & Cloud' },
  { id: 2, code: 'ECE', name: 'Electronics & Communication Engineering', description: 'Embedded Systems, VLSI, IoT & Signal Processing' },
  { id: 3, code: 'EEE', name: 'Electrical & Electronics Engineering', description: 'Power Systems, Control Engineering & Renewable Energy' },
  { id: 4, code: 'AIML', name: 'Artificial Intelligence & Machine Learning', description: 'Deep Learning, NLP, Computer Vision & Robotics' },
  { id: 5, code: 'DS', name: 'Data Science', description: 'Big Data, Statistics, Predictive Modeling & Visualization' },
  { id: 6, code: 'MECH', name: 'Mechanical Engineering', description: 'Thermodynamics, Robotics, Materials Science & Manufacturing' },
  { id: 7, code: 'CIVIL', name: 'Civil Engineering', description: 'Structural Engineering, Geotechnics, Environmental & Surveying' },
];

const MOCK_COURSES: Course[] = [
  { id: 1, departmentId: 1, code: 'BTECH-CSE', name: 'B.Tech in Computer Science & Engineering', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
  { id: 2, departmentId: 4, code: 'BTECH-AIML', name: 'B.Tech in Artificial Intelligence & Machine Learning', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
  { id: 3, departmentId: 5, code: 'BTECH-DS', name: 'B.Tech in Data Science', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
  { id: 4, departmentId: 2, code: 'BTECH-ECE', name: 'B.Tech in Electronics & Communication', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
  { id: 5, departmentId: 3, code: 'BTECH-EEE', name: 'B.Tech in Electrical & Electronics Engineering', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
  { id: 6, departmentId: 6, code: 'BTECH-MECH', name: 'B.Tech in Mechanical Engineering', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
  { id: 7, departmentId: 7, code: 'BTECH-CIVIL', name: 'B.Tech in Civil Engineering', degreeLevel: 'Undergraduate', totalSemesters: 8, credits: 160 },
];

const MOCK_SUBJECTS: Subject[] = [
  { id: 1, courseId: 1, code: 'CS201', title: 'Data Structures & Algorithms', semester: 4, credits: 4, syllabusSummary: 'Stacks, Queues, Binary Trees, AVL, Heaps, Graphs (BFS/DFS), Dijkstra, Kruskal, Dynamic Programming' },
  { id: 2, courseId: 1, code: 'CS202', title: 'Operating Systems', semester: 4, credits: 4, syllabusSummary: 'Process synchronization, Semaphores, Deadlocks, CPU Scheduling, Virtual Memory, Paging, Page Replacement' },
  { id: 3, courseId: 2, code: 'AI401', title: 'Deep Neural Networks & Computer Vision', semester: 5, credits: 4, syllabusSummary: 'Backpropagation, CNN architectures, ResNet, YOLO, Vision Transformers, Generative AI' },
  { id: 4, courseId: 3, code: 'DS301', title: 'Big Data Analytics & Spark', semester: 5, credits: 4, syllabusSummary: 'Hadoop HDFS, Spark RDDs, DataFrames, Kafka Streaming, NoSQL MongoDB & Cassandra' },
  { id: 5, courseId: 4, code: 'EC301', title: 'Digital Signal Processing', semester: 4, credits: 4, syllabusSummary: 'LTI systems, Z-Transform, DFT, FFT Radix-2, IIR Butterworth/Chebyshev, FIR Windowing' },
  { id: 6, courseId: 5, code: 'EE301', title: 'Power Electronics', semester: 5, credits: 4, syllabusSummary: 'SCR, MOSFET, IGBT, Controlled Bridge Rectifiers, Buck-Boost Choppers, SPWM Inverters' },
  { id: 7, courseId: 6, code: 'ME201', title: 'Applied Thermodynamics', semester: 3, credits: 4, syllabusSummary: 'SFEE, Second Law, Otto/Diesel/Dual Cycles, Rankine Cycle, VCRS Refrigeration' },
  { id: 8, courseId: 7, code: 'CE201', title: 'Structural Analysis & Concrete Design', semester: 4, credits: 4, syllabusSummary: 'Indeterminate Structures, Slope Deflection, Moment Distribution, IS 456 Beams & Columns' },
];

function getStoredDocuments(): AcademicDocument[] {
  const saved = localStorage.getItem('academiq_faculty_docs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure initial documents exist if list was smaller
      if (Array.isArray(parsed) && parsed.length >= INITIAL_DOCUMENTS.length) {
        return parsed;
      }
    } catch (_) {}
  }
  localStorage.setItem('academiq_faculty_docs', JSON.stringify(INITIAL_DOCUMENTS));
  return INITIAL_DOCUMENTS;
}

function saveStoredDocuments(docs: AcademicDocument[]) {
  localStorage.setItem('academiq_faculty_docs', JSON.stringify(docs));
}

export const academicService = {
  async getDepartments(): Promise<Department[]> {
    try {
      return await apiFetch<Department[]>('/api/academic/departments');
    } catch {
      return MOCK_DEPARTMENTS;
    }
  },

  async getCourses(deptId?: number): Promise<Course[]> {
    try {
      const url = deptId ? `/api/academic/courses?departmentId=${deptId}` : '/api/academic/courses';
      return await apiFetch<Course[]>(url);
    } catch {
      return deptId ? MOCK_COURSES.filter((c) => c.departmentId === deptId) : MOCK_COURSES;
    }
  },

  async getSubjects(courseId?: number, semester?: number): Promise<Subject[]> {
    try {
      let url = '/api/academic/subjects';
      const params = new URLSearchParams();
      if (courseId) params.append('courseId', courseId.toString());
      if (semester) params.append('semester', semester.toString());
      if (params.toString()) url += `?${params.toString()}`;
      return await apiFetch<Subject[]>(url);
    } catch {
      let filtered = MOCK_SUBJECTS;
      if (courseId) filtered = filtered.filter((s) => s.courseId === courseId);
      if (semester) filtered = filtered.filter((s) => s.semester === semester);
      return filtered;
    }
  },

  async getDocuments(params?: {
    category?: string;
    departmentId?: number;
    departmentCode?: DepartmentCode | 'ALL';
    targetYear?: number;
    semester?: number;
    courseId?: number;
    search?: string;
  }): Promise<AcademicDocument[]> {
    let docs = getStoredDocuments();
    if (params?.category && params.category !== 'ALL') {
      docs = docs.filter((d) => d.category === params.category);
    }
    if (params?.departmentCode && params.departmentCode !== 'ALL') {
      docs = docs.filter(
        (d) => d.departmentCode === params.departmentCode || d.departmentCode === 'ALL' || !d.departmentCode
      );
    }
    if (params?.targetYear && params.targetYear > 0) {
      docs = docs.filter(
        (d) => d.targetYear === params.targetYear || d.targetYear === 0 || !d.targetYear
      );
    }
    if (params?.semester && params.semester > 0) {
      docs = docs.filter(
        (d) => d.targetSemester === params.semester || d.semester === params.semester || !d.targetSemester || d.targetSemester === 0
      );
    }
    if (params?.departmentId) {
      docs = docs.filter((d) => d.departmentId === params.departmentId || d.departmentCode === 'ALL');
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(s) ||
          d.fileName.toLowerCase().includes(s) ||
          (d.departmentCode && d.departmentCode.toLowerCase().includes(s)) ||
          (d.extractedText && d.extractedText.toLowerCase().includes(s))
      );
    }
    return docs;
  },

  async getDocument(id: number): Promise<AcademicDocument> {
    const docs = getStoredDocuments();
    const doc = docs.find((d) => d.id === id);
    if (doc) return doc;
    throw new Error('Document not found');
  },

  // Faculty Upload Method: immediately saves and indexes document into knowledge base
  async uploadFacultyDocument(data: {
    title: string;
    category: DocumentCategory;
    departmentCode?: DepartmentCode | 'ALL';
    targetYear?: number;
    targetSemester?: number;
    departmentId?: number;
    courseId?: number;
    file: File;
    textPreview?: string;
    uploaderName?: string;
  }): Promise<AcademicDocument> {
    const docs = getStoredDocuments();
    const extension = (data.file.name.split('.').pop() || 'PDF').toUpperCase() as 'PDF' | 'DOCX' | 'TXT';

    const newDoc: AcademicDocument = {
      id: Date.now(),
      title: data.title,
      fileName: data.file.name,
      fileType: extension,
      fileSizeBytes: data.file.size || 1024 * 128,
      category: data.category,
      departmentCode: data.departmentCode || 'ALL',
      targetYear: data.targetYear !== undefined ? data.targetYear : 0,
      targetSemester: data.targetSemester !== undefined ? data.targetSemester : 0,
      departmentId: data.departmentId || 1,
      courseId: data.courseId || 1,
      academicYear: '2025-2026',
      accessLevel: 'STUDENT',
      status: 'INDEXED',
      chunkCount: Math.max(1, Math.ceil((data.textPreview?.length || data.file.size || 1000) / 400)),
      totalPages: Math.max(1, Math.ceil((data.textPreview?.length || data.file.size || 3000) / 2500)),
      uploaderName: data.uploaderName || 'Prof. David Chen (Faculty)',
      version: 1,
      extractedText: data.textPreview || `Course material for ${data.title}: Contains verified concepts, syllabus guidelines, and lecture references for students.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newDoc, ...docs];
    saveStoredDocuments(updated);
    return newDoc;
  },

  async deleteFacultyDocument(id: number): Promise<void> {
    const docs = getStoredDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    saveStoredDocuments(filtered);
  },
};
