interface StudentResponse {
  content: string;
  studentName: string;
  avatar: string;
  voiceType: string;
}

interface JEECurriculum {
  [subject: string]: {
    [chapter: string]: {
      topics: string[];
      concepts: string[];
    };
  };
}

export class StudentSimulator {
  private curriculum: JEECurriculum;
  private students: Array<{ name: string; personality: string; learningStyle: string; avatar: string; voiceType: string; subject_preference: string }>;

  constructor() {
    this.curriculum = {
      physics: {
        mechanics: {
          topics: ['Motion in One Dimension', 'Motion in Two Dimensions', 'Laws of Motion', 'Work Energy Power', 'Circular Motion', 'Rotational Motion', 'Gravitation', 'Simple Harmonic Motion'],
          concepts: ['displacement', 'velocity', 'acceleration', 'force', 'momentum', 'energy', 'angular velocity', 'torque', 'gravity']
        },
        thermodynamics: {
          topics: ['Kinetic Theory of Gases', 'First Law of Thermodynamics', 'Second Law of Thermodynamics', 'Heat Engines', 'Entropy'],
          concepts: ['temperature', 'heat', 'internal energy', 'efficiency', 'entropy', 'ideal gas', 'PV diagrams']
        },
        electromagnetism: {
          topics: ['Electric Charges and Fields', 'Electric Potential', 'Capacitance', 'Current Electricity', 'Magnetic Fields', 'Electromagnetic Induction', 'AC Circuits'],
          concepts: ['electric field', 'potential', 'current', 'resistance', 'magnetic field', 'flux', 'impedance']
        },
        waves_and_optics: {
          topics: ['Wave Motion', 'Sound Waves', 'Light Waves', 'Interference', 'Diffraction', 'Polarization'],
          concepts: ['wavelength', 'frequency', 'amplitude', 'interference', 'diffraction', 'polarization']
        },
        modern_physics: {
          topics: ['Dual Nature of Matter', 'Atoms and Nuclei', 'Electronic Devices'],
          concepts: ['photon', 'electron', 'nucleus', 'radioactivity', 'wave-particle duality', 'semiconductors']
        }
      },
      chemistry: {
        physical_chemistry: {
          topics: ['Atomic Structure', 'Chemical Bonding', 'Gaseous State', 'Thermodynamics', 'Chemical Equilibrium', 'Ionic Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry'],
          concepts: ['orbital', 'electron configuration', 'bond', 'enthalpy', 'entropy', 'equilibrium constant', 'pH', 'electrode potential']
        },
        organic_chemistry: {
          topics: ['Basic Principles', 'Hydrocarbons', 'Haloalkanes and Haloarenes', 'Alcohols Phenols Ethers', 'Aldehydes Ketones Carboxylic Acids', 'Nitrogen Compounds', 'Biomolecules', 'Polymers'],
          concepts: ['alkane', 'alkene', 'benzene', 'alcohol', 'carbonyl', 'chirality', 'isomerism', 'functional groups']
        },
        inorganic_chemistry: {
          topics: ['Classification of Elements', 'Hydrogen', 'S-Block Elements', 'P-Block Elements', 'D-Block and F-Block Elements', 'Coordination Compounds', 'Environmental Chemistry'],
          concepts: ['periodic trends', 'coordination number', 'ligand', 'oxidation state', 'extraction', 'crystal field theory']
        }
      },
      mathematics: {
        algebra: {
          topics: ['Sets Relations Functions', 'Complex Numbers', 'Quadratic Equations', 'Sequences and Series', 'Permutations and Combinations', 'Binomial Theorem', 'Mathematical Induction'],
          concepts: ['set theory', 'imaginary unit', 'discriminant', 'arithmetic progression', 'geometric progression', 'factorial', 'combinations']
        },
        calculus: {
          topics: ['Limits and Derivatives', 'Applications of Derivatives', 'Integrals', 'Applications of Integrals', 'Differential Equations'],
          concepts: ['limit', 'continuity', 'derivative', 'integration', 'area under curve', 'differential equation', 'maxima minima']
        },
        coordinate_geometry: {
          topics: ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola', 'Three Dimensional Geometry'],
          concepts: ['slope', 'equation of line', 'radius', 'focus', 'directrix', 'eccentricity', 'direction cosines']
        },
        trigonometry: {
          topics: ['Trigonometric Functions', 'Inverse Trigonometric Functions', 'Trigonometric Equations', 'Properties of Triangles'],
          concepts: ['sine', 'cosine', 'tangent', 'radian', 'identity', 'period', 'amplitude', 'law of sines']
        },
        probability_and_statistics: {
          topics: ['Probability', 'Random Variables', 'Distributions', 'Statistics'],
          concepts: ['sample space', 'probability', 'expectation', 'variance', 'normal distribution', 'mean', 'median']
        }
      }
    };

    this.students = [
      {
        name: 'Priya',
        personality: 'curious and detail-oriented',
        learningStyle: 'asks for examples and real-world applications',
        avatar: '👩‍🎓',
        voiceType: 'female-high',
        subject_preference: 'mathematics'
      },
      {
        name: 'Arjun',
        personality: 'analytical and sometimes skeptical',
        learningStyle: 'questions concepts and asks for proofs',
        avatar: '👨‍🎓',
        voiceType: 'male-deep',
        subject_preference: 'physics'
      },
      {
        name: 'Sneha',
        personality: 'enthusiastic and collaborative',
        learningStyle: 'relates concepts to daily life',
        avatar: '👩‍💻',
        voiceType: 'female-medium',
        subject_preference: 'chemistry'
      },
      {
        name: 'Rohit',
        personality: 'methodical and precise',
        learningStyle: 'focuses on problem-solving techniques',
        avatar: '👨‍💻',
        voiceType: 'male-medium',
        subject_preference: 'mathematics'
      },
      {
        name: 'Ananya',
        personality: 'creative and imaginative',
        learningStyle: 'visualizes concepts through diagrams',
        avatar: '👩‍🔬',
        voiceType: 'female-soft',
        subject_preference: 'physics'
      },
      {
        name: 'Karthik',
        personality: 'competitive and goal-oriented',
        learningStyle: 'compares with previous year questions',
        avatar: '👨‍🔬',
        voiceType: 'male-energetic',
        subject_preference: 'chemistry'
      },
      {
        name: 'Divya',
        personality: 'patient and thorough',
        learningStyle: 'breaks down complex problems step by step',
        avatar: '👩‍🏫',
        voiceType: 'female-calm',
        subject_preference: 'mathematics'
      },
      {
        name: 'Varun',
        personality: 'quick learner but sometimes overconfident',
        learningStyle: 'jumps to conclusions, needs corrections',
        avatar: '👨‍🎯',
        voiceType: 'male-quick',
        subject_preference: 'physics'
      }
    ];
  }

  public async generateResponses(teacherInput: string, subject: string): Promise<StudentResponse[]> {
    const responses: StudentResponse[] = [];
    
    // Analyze the input to find relevant topics
    const relevantTopics = this.findRelevantTopics(teacherInput, subject);
    
    // Generate 2-4 student responses from students who prefer this subject or are curious
    const interestedStudents = this.students.filter(student => 
      student.subject_preference === subject || Math.random() > 0.6
    );
    
    const numResponses = Math.min(Math.floor(Math.random() * 3) + 2, interestedStudents.length);
    const selectedStudents = interestedStudents.slice(0, numResponses);

    for (let i = 0; i < selectedStudents.length; i++) {
      const student = selectedStudents[i];
      const response = await this.generateStudentResponse(teacherInput, student, relevantTopics, subject);
      responses.push({
        content: response,
        studentName: student.name,
        avatar: student.avatar,
        voiceType: student.voiceType
      });
    }

    return responses;
  }

  private findRelevantTopics(input: string, subject: string): string[] {
    const subjectData = this.curriculum[subject];
    if (!subjectData) return [];

    const relevantTopics: string[] = [];
    const inputLower = input.toLowerCase();

    Object.values(subjectData).forEach(chapter => {
      chapter.concepts.forEach(concept => {
        if (inputLower.includes(concept.toLowerCase())) {
          relevantTopics.push(concept);
        }
      });
      chapter.topics.forEach(topic => {
        if (inputLower.includes(topic.toLowerCase())) {
          relevantTopics.push(topic);
        }
      });
    });

    return relevantTopics;
  }

  private async generateStudentResponse(
    teacherInput: string, 
    student: { name: string; personality: string; learningStyle: string; avatar: string; voiceType: string; subject_preference: string }, 
    relevantTopics: string[], 
    subject: string
  ): Promise<string> {
    // For now, use predefined response patterns based on student personality
    // In a real implementation, this would call an LLM API
    
    const responsePatterns = this.getResponsePatterns(student, subject, relevantTopics);
    const randomPattern = responsePatterns[Math.floor(Math.random() * responsePatterns.length)];
    
    return randomPattern;
  }

  private getResponsePatterns(
    student: { name: string; personality: string; learningStyle: string; avatar: string; voiceType: string; subject_preference: string },
    subject: string,
    relevantTopics: string[]
  ): string[] {
    const responses: string[] = [];

    if (student.name === 'Priya') {
      responses.push(
        "Sir, can you give us a practical example of this concept?",
        "I understand the theory, but how do we apply this in JEE problems?",
        "Could you explain this step by step? I want to make sure I understand completely.",
        "This is interesting! How does this relate to what we learned in the previous chapter?",
        "Sir, can you show us a numerical example to make this clearer?"
      );
      
      if (subject === 'physics') {
        responses.push(
          "How is this used in real-world engineering applications?",
          "Can we derive this formula from first principles?",
          "What are the units and dimensions here?"
        );
      }
    } else if (student.name === 'Arjun') {
      responses.push(
        "Sir, I have a doubt. Why does this work this way?",
        "Can you prove this mathematically?",
        "What if we change this condition? Would the result be different?",
        "I'm not convinced. Can you show us the derivation?",
        "This seems similar to another concept. What's the difference?"
      );
      
      if (subject === 'mathematics') {
        responses.push(
          "What are the boundary conditions for this formula?",
          "Can this theorem be generalized?",
          "What's the intuitive reasoning behind this approach?"
        );
      }
    } else if (student.name === 'Sneha') {
      responses.push(
        "Sir, how do we use this in our daily life?",
        "This reminds me of something I saw at home! Is it related?",
        "Can we do a simple experiment to see this?",
        "My elder sister told me something similar. Are they the same?",
        "This is so interesting! I want to tell my friends about this."
      );
    } else if (student.name === 'Rohit') {
      responses.push(
        "Sir, what's the fastest way to solve this type of problem?",
        "Can you show us the standard method for such questions?",
        "I've seen this in previous year papers. What's the trick?",
        "How should I approach this in the exam?",
        "Are there any shortcuts for this calculation?"
      );
    } else if (student.name === 'Ananya') {
      responses.push(
        "Sir, can you draw a diagram to explain this?",
        "I'm trying to visualize this concept. Can you help?",
        "What would this look like if we could see it?",
        "Can we make a flowchart for this process?",
        "I learn better with pictures. Do you have any visual aids?"
      );
    } else if (student.name === 'Karthik') {
      responses.push(
        "Sir, is this type of question asked frequently in JEE?",
        "How many marks does this topic carry in the exam?",
        "Can you give us a JEE level problem on this?",
        "What's the difficulty level of this concept for JEE Advanced?",
        "Sir, I want to master this topic completely!"
      );
    } else if (student.name === 'Divya') {
      responses.push(
        "Sir, can you explain this more slowly? I want to understand each step.",
        "Let me repeat what you said to make sure I understood correctly...",
        "Sir, what should be our approach when we encounter such problems?",
        "Can you break this down into smaller parts?",
        "I think I understand, but can you give one more example?"
      );
    } else if (student.name === 'Varun') {
      responses.push(
        "Oh, I know this! The answer is... wait, let me think again.",
        "Sir, I solved a similar problem yesterday, but got a different answer.",
        "This seems easy! But why am I getting confused?",
        "I thought I understood this, but now I'm not sure.",
        "Can you check if my approach is correct?"
      );
    }

    // Add topic-specific responses if relevant topics are found
    if (relevantTopics.length > 0) {
      const topic = relevantTopics[0];
      responses.push(
        `Sir, how does ${topic} connect to what you just explained?`,
        `I remember ${topic} from last class. Is this related?`,
        `Can you clarify the difference between ${topic} and this concept?`
      );
    }

    return responses;
  }
}