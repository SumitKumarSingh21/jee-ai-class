interface StudentResponse {
  content: string;
  studentName: string;
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
  private students: Array<{ name: string; personality: string; learningStyle: string }>;

  constructor() {
    this.curriculum = {
      physics: {
        mechanics: {
          topics: ['Kinematics', 'Newton\'s Laws', 'Work Energy Power', 'Rotational Motion', 'Gravitation'],
          concepts: ['displacement', 'velocity', 'acceleration', 'force', 'momentum', 'energy', 'angular velocity']
        },
        thermodynamics: {
          topics: ['Laws of Thermodynamics', 'Heat Engines', 'Entropy', 'Kinetic Theory'],
          concepts: ['temperature', 'heat', 'internal energy', 'efficiency', 'entropy', 'ideal gas']
        },
        electromagnetism: {
          topics: ['Electric Field', 'Magnetic Field', 'Electromagnetic Induction', 'AC Circuits'],
          concepts: ['electric field', 'potential', 'current', 'resistance', 'magnetic field', 'flux']
        },
        optics: {
          topics: ['Ray Optics', 'Wave Optics', 'Interference', 'Diffraction'],
          concepts: ['reflection', 'refraction', 'lens', 'mirror', 'interference', 'diffraction']
        },
        modern_physics: {
          topics: ['Atomic Structure', 'Nuclear Physics', 'Photoelectric Effect', 'De Broglie Waves'],
          concepts: ['photon', 'electron', 'nucleus', 'radioactivity', 'wave-particle duality']
        }
      },
      chemistry: {
        physical_chemistry: {
          topics: ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Electrochemistry'],
          concepts: ['orbital', 'electron configuration', 'bond', 'enthalpy', 'entropy', 'equilibrium constant']
        },
        organic_chemistry: {
          topics: ['Hydrocarbons', 'Functional Groups', 'Reaction Mechanisms', 'Stereochemistry'],
          concepts: ['alkane', 'alkene', 'benzene', 'alcohol', 'carbonyl', 'chirality', 'isomerism']
        },
        inorganic_chemistry: {
          topics: ['Periodic Table', 'Coordination Compounds', 'Metallurgy', 'Qualitative Analysis'],
          concepts: ['periodic trends', 'coordination number', 'ligand', 'oxidation state', 'extraction']
        }
      },
      mathematics: {
        algebra: {
          topics: ['Complex Numbers', 'Quadratic Equations', 'Sequences and Series', 'Permutations and Combinations'],
          concepts: ['imaginary unit', 'discriminant', 'arithmetic progression', 'geometric progression', 'factorial']
        },
        calculus: {
          topics: ['Limits', 'Derivatives', 'Integrals', 'Differential Equations'],
          concepts: ['limit', 'continuity', 'derivative', 'integration', 'area under curve', 'differential equation']
        },
        coordinate_geometry: {
          topics: ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola'],
          concepts: ['slope', 'equation of line', 'radius', 'focus', 'directrix', 'eccentricity']
        },
        trigonometry: {
          topics: ['Trigonometric Functions', 'Inverse Trigonometric Functions', 'Trigonometric Equations'],
          concepts: ['sine', 'cosine', 'tangent', 'radian', 'identity', 'period', 'amplitude']
        }
      }
    };

    this.students = [
      {
        name: 'Priya',
        personality: 'curious and detail-oriented',
        learningStyle: 'asks for examples and real-world applications'
      },
      {
        name: 'Arjun',
        personality: 'analytical and sometimes skeptical',
        learningStyle: 'questions concepts and asks for proofs'
      }
    ];
  }

  public async generateResponses(teacherInput: string, subject: string): Promise<StudentResponse[]> {
    const responses: StudentResponse[] = [];
    
    // Analyze the input to find relevant topics
    const relevantTopics = this.findRelevantTopics(teacherInput, subject);
    
    // Generate 1-2 student responses
    const numResponses = Math.random() > 0.7 ? 2 : 1;
    const selectedStudents = this.students.slice(0, numResponses);

    for (let i = 0; i < selectedStudents.length; i++) {
      const student = selectedStudents[i];
      const response = await this.generateStudentResponse(teacherInput, student, relevantTopics, subject);
      responses.push({
        content: response,
        studentName: student.name
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
    student: { name: string; personality: string; learningStyle: string }, 
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
    student: { name: string; personality: string; learningStyle: string },
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