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
        general: {
          topics: ['Units and Dimensions', 'Physical Quantities', 'SI Units', 'Measurement of error', 'Significant figures', 'Error analysis', 'Experiments'],
          concepts: ['unit', 'dimension', 'error', 'significant figures', 'measurement', 'precision', 'accuracy']
        },
        mechanics: {
          topics: ['Kinematics (1D and 2D motion, projectiles)', 'Laws of Motion (Newton\'s laws, friction, circular motion)', 'Work, Energy and Power', 'System of Particles and Rotational Motion', 'Centre of mass, motion of COM', 'Torque, Angular momentum', 'Rigid body dynamics, Moment of inertia, Rolling motion', 'Gravitation (Newton\'s law, satellites, escape velocity, orbital velocity, Kepler\'s laws)'],
          concepts: ['displacement', 'velocity', 'acceleration', 'force', 'momentum', 'energy', 'angular velocity', 'torque', 'gravity', 'friction', 'projectile', 'circular motion', 'work', 'power', 'moment of inertia', 'centre of mass', 'escape velocity', 'orbital velocity']
        },
        properties_matter_thermodynamics: {
          topics: ['Mechanical Properties of Solids (stress, strain, elastic modulus, Hooke\'s law)', 'Mechanical Properties of Fluids (pressure, Pascal\'s law, Archimedes\' principle, viscosity, surface tension)', 'Thermal Properties of Matter (heat transfer, calorimetry, expansion of solids/liquids/gases)', 'Thermodynamics (first law, second law, entropy, heat engines)', 'Kinetic Theory of Gases (equipartition, RMS velocity, mean free path)'],
          concepts: ['stress', 'strain', 'elasticity', 'pressure', 'buoyancy', 'viscosity', 'surface tension', 'heat', 'temperature', 'thermal expansion', 'entropy', 'heat engine', 'kinetic theory', 'ideal gas', 'PV diagram']
        },
        oscillations_waves: {
          topics: ['Simple Harmonic Motion (equations, energy, superposition)', 'Damped and Forced oscillations, Resonance', 'Waves (sound waves, Doppler effect, beats, standing waves, organ pipes)'],
          concepts: ['oscillation', 'frequency', 'amplitude', 'phase', 'resonance', 'wave', 'wavelength', 'doppler effect', 'interference', 'beats', 'standing wave']
        },
        electrostatics_current: {
          topics: ['Electrostatics (Coulomb\'s law, electric field, potential, Gauss law, capacitors)', 'Current Electricity (Ohm\'s law, Kirchhoff\'s laws, cells, resistivity, Wheatstone bridge, potentiometer)'],
          concepts: ['electric charge', 'electric field', 'electric potential', 'capacitance', 'current', 'resistance', 'voltage', 'power', 'circuit', 'ohm law', 'kirchhoff law']
        },
        magnetism_induction: {
          topics: ['Magnetic Effects of Current (Biot–Savart law, Ampere\'s law)', 'Earth\'s magnetism, Magnetic materials', 'Moving charges in magnetic fields (Lorentz force, cyclotron)', 'Electromagnetic Induction (Faraday\'s law, Lenz\'s law, self and mutual inductance)', 'Alternating Current (LCR circuits, resonance, transformers)'],
          concepts: ['magnetic field', 'magnetic force', 'electromagnetic induction', 'flux', 'inductance', 'AC', 'transformer', 'resonance', 'impedance', 'lorentz force']
        },
        electromagnetic_waves: {
          topics: ['Displacement current, Maxwell\'s equations (qualitative)', 'EM spectrum'],
          concepts: ['electromagnetic wave', 'maxwell equations', 'electromagnetic spectrum', 'radio waves', 'microwaves', 'infrared', 'visible light', 'ultraviolet', 'x-rays', 'gamma rays']
        },
        optics: {
          topics: ['Ray Optics (reflection, refraction, lenses, mirrors, optical instruments, total internal reflection)', 'Wave Optics (interference, diffraction, polarisation, Young\'s double-slit experiment)'],
          concepts: ['reflection', 'refraction', 'lens', 'mirror', 'focal length', 'magnification', 'interference', 'diffraction', 'polarization', 'coherence']
        },
        modern_physics: {
          topics: ['Dual Nature of Matter and Radiation (photoelectric effect, de Broglie wavelength)', 'Atoms (Bohr model, hydrogen spectrum)', 'Nuclei (radioactivity, nuclear reactions, mass defect, binding energy)', 'Semiconductor Electronics (diodes, transistors, logic gates)', 'Communication Systems (JEE Main only, not in Advanced)'],
          concepts: ['photon', 'electron', 'photoelectric effect', 'de broglie wavelength', 'bohr model', 'hydrogen spectrum', 'nucleus', 'radioactivity', 'nuclear reaction', 'semiconductor', 'diode', 'transistor']
        }
      },
      chemistry: {
        physical_chemistry: {
          topics: ['Some Basic Concepts of Chemistry (mole concept, stoichiometry, empirical formula)', 'Atomic Structure (Bohr model, quantum numbers, electronic configuration)', 'Chemical Bonding and Molecular Structure (VSEPR, hybridisation, MOT, bond energy)', 'States of Matter (ideal gas, real gas, liquefaction, kinetic theory of gases)', 'Chemical Thermodynamics (first, second laws, Gibbs free energy, spontaneity)', 'Solutions (Raoult\'s law, colligative properties, Henry\'s law)', 'Equilibrium (chemical equilibrium, ionic equilibrium, solubility product, buffer)', 'Redox Reactions and Electrochemistry (Nernst equation, galvanic cells, electrolytic cells)', 'Chemical Kinetics (order, molecularity, Arrhenius equation, rate laws)', 'Surface Chemistry (adsorption, catalysis, colloids)'],
          concepts: ['mole', 'stoichiometry', 'atomic structure', 'quantum numbers', 'orbital', 'bond', 'hybridization', 'gas laws', 'enthalpy', 'entropy', 'gibbs energy', 'equilibrium', 'pH', 'buffer', 'redox', 'electrochemistry', 'kinetics', 'catalyst', 'adsorption']
        },
        inorganic_chemistry: {
          topics: ['Periodic Table & Periodicity in Properties', 'Hydrogen and its Compounds', 's-Block Element (alkali and alkaline earth metals)', 'p-Block Elements (Groups 13–18, including oxides, halides, allotropes)', 'd-Block Elements (transition metals, their compounds, color, catalytic properties)', 'f-Block Elements (lanthanides, actinides)', 'Coordination Compounds (VBT, CFT, isomerism, stability)', 'Environmental Chemistry', 'General Principles & Processes of Isolation of Metals'],
          concepts: ['periodic table', 'periodicity', 'alkali metals', 'alkaline earth metals', 'halogens', 'noble gases', 'transition metals', 'lanthanides', 'actinides', 'coordination compound', 'ligand', 'crystal field theory', 'metallurgy']
        },
        organic_chemistry: {
          topics: ['General Organic Chemistry (GOC) — nomenclature, hybridisation, resonance, inductive effect, mesomeric effect, hyperconjugation', 'Isomerism (structural, geometrical, optical, conformational)', 'Hydrocarbons: Alkanes, Alkenes, Alkynes (preparation, properties, reactions)', 'Aromatic Compounds (benzene, electrophilic substitution, Huckel\'s rule)', 'Organic Compounds with Functional Groups: Alcohols, Phenols, Ethers', 'Aldehydes, Ketones, Carboxylic Acids and Derivatives', 'Amines and Diazonium salts', 'Haloalkanes and Haloarenes', 'Polymers (addition, condensation, copolymers, natural & synthetic polymers)', 'Biomolecules (proteins, carbohydrates, nucleic acids, vitamins)', 'Chemistry in Everyday Life (drugs, soaps, detergents, dyes)'],
          concepts: ['organic chemistry', 'nomenclature', 'isomerism', 'alkane', 'alkene', 'alkyne', 'aromatic', 'benzene', 'functional group', 'alcohol', 'aldehyde', 'ketone', 'carboxylic acid', 'amine', 'polymer', 'protein', 'carbohydrate', 'DNA', 'RNA']
        }
      },
      mathematics: {
        algebra: {
          topics: ['Sets, Relations, Functions', 'Complex Numbers (properties, De Moivre\'s theorem, quadratic equations)', 'Matrices and Determinants', 'Permutations and Combinations', 'Binomial Theorem and Applications', 'Sequences and Series (AP, GP, HP, special series, sums of squares/cubes)', 'Mathematical Induction', 'Logarithms'],
          concepts: ['set', 'relation', 'function', 'complex number', 'matrix', 'determinant', 'permutation', 'combination', 'binomial theorem', 'sequence', 'series', 'arithmetic progression', 'geometric progression', 'induction', 'logarithm']
        },
        trigonometry: {
          topics: ['Trigonometric Ratios and Identities', 'Trigonometric Equations', 'Inverse Trigonometric Functions', 'Properties of Triangles', 'Heights and Distances'],
          concepts: ['sine', 'cosine', 'tangent', 'trigonometric identity', 'trigonometric equation', 'inverse trigonometric function', 'triangle', 'height', 'distance', 'angle of elevation', 'angle of depression']
        },
        calculus: {
          topics: ['Limits, Continuity, Differentiability', 'Differentiation and Applications (tangents, normals, maxima/minima, monotonicity, Rolle\'s theorem, Mean Value Theorem)', 'Indefinite Integrals (methods of integration)', 'Definite Integrals (properties, applications, area under curves)', 'Differential Equations (formation, first order and first degree, linear DE, separation of variables)'],
          concepts: ['limit', 'continuity', 'derivative', 'differentiation', 'integration', 'maxima', 'minima', 'tangent', 'normal', 'area under curve', 'differential equation']
        },
        coordinate_geometry: {
          topics: ['Straight Lines, Circles, Parabola, Ellipse, Hyperbola', 'Conic Sections in general', '3D Geometry: direction cosines, equations of line and plane, distance formula, angle between lines/planes'],
          concepts: ['coordinate', 'straight line', 'circle', 'parabola', 'ellipse', 'hyperbola', 'conic section', 'distance formula', 'direction cosine', 'equation of plane']
        },
        vector_algebra: {
          topics: ['Addition, scalar product, vector product, scalar triple product'],
          concepts: ['vector', 'scalar product', 'dot product', 'vector product', 'cross product', 'scalar triple product']
        },
        probability_statistics: {
          topics: ['Probability (conditional probability, Bayes\' theorem, binomial distribution)', 'Statistics (mean, median, mode, variance, standard deviation)'],
          concepts: ['probability', 'conditional probability', 'bayes theorem', 'binomial distribution', 'mean', 'median', 'mode', 'variance', 'standard deviation']
        },
        mathematical_reasoning: {
          topics: ['Statements, logical connectives, truth tables, implications, validity'],
          concepts: ['statement', 'logical connective', 'truth table', 'implication', 'validity', 'negation', 'conjunction', 'disjunction']
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
    
    // Filter out simple greetings and basic acknowledgments to avoid unnecessary questions
    const inputLower = teacherInput.toLowerCase().trim();
    const basicGreetings = ['hello', 'hi', 'good morning', 'good afternoon', 'good evening', 'welcome', 'let me', 'las', 'okay', 'ok', 'yes', 'no', 'right', 'correct'];
    const isBasicInteraction = basicGreetings.some(greeting => 
      inputLower === greeting || inputLower.includes(greeting) && inputLower.length < 20
    );
    
    // Don't generate responses for basic greetings or very short interactions
    if (isBasicInteraction || inputLower.length < 10) {
      return responses;
    }
    
    // Analyze the input to find relevant topics
    const relevantTopics = this.findRelevantTopics(teacherInput, subject);
    
    // Only generate responses if the input contains actual teaching content
    if (relevantTopics.length === 0 && inputLower.length < 30) {
      return responses;
    }
    
    // Generate 2-3 student responses from students who prefer this subject or are curious
    const interestedStudents = this.students.filter(student => 
      student.subject_preference === subject || Math.random() > 0.7
    );
    
    const numResponses = Math.min(Math.floor(Math.random() * 2) + 2, interestedStudents.length, 3);
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

    // Add subject-specific JEE-level questions based on relevant topics
    if (relevantTopics.length > 0) {
      const topic = relevantTopics[0];
      
      if (subject === 'physics') {
        responses.push(
          `Sir, in JEE questions on ${topic}, what are the most common mistakes students make?`,
          `Can you explain the relationship between ${topic} and the other physics concepts we've studied?`,
          `Sir, how do we approach problems where ${topic} is combined with other topics?`,
          `What are the typical numerical ranges for ${topic} in JEE Advanced questions?`
        );
      } else if (subject === 'chemistry') {
        responses.push(
          `Sir, what are the exceptions to the rule in ${topic} that often appear in JEE?`,
          `How does ${topic} connect to organic reactions we studied earlier?`,
          `Sir, can you give us a mechanism-based question on ${topic}?`,
          `What industrial applications of ${topic} are frequently asked in JEE?`
        );
      } else if (subject === 'mathematics') {
        responses.push(
          `Sir, what's the most elegant way to solve ${topic} problems in JEE?`,
          `Can ${topic} be solved using multiple methods? Which is fastest?`,
          `Sir, how do we identify when to use ${topic} in coordinate geometry problems?`,
          `What are the common integration tricks for ${topic}?`
        );
      }
    }

    // Student-specific JEE-focused responses
    if (student.name === 'Priya') {
      responses.push(
        "Sir, can you show us the JEE-level application of this concept?",
        "How does this appear in JEE Main vs JEE Advanced questions?",
        "Sir, what's the step-by-step approach for solving such problems in exams?",
        "Can you give us a previous year JEE question on this topic?"
      );
      
      if (subject === 'physics') {
        responses.push(
          "Sir, what are the dimensional analysis tricks for this concept?",
          "How do we handle approximations in numerical problems?",
          "What graph-based questions can come from this topic?"
        );
      }
    } else if (student.name === 'Arjun') {
      responses.push(
        "Sir, I want to understand the deeper physics/mathematics behind this.",
        "Can you prove why this formula works?",
        "What are the assumptions we're making here?",
        "Sir, what happens at the boundary conditions?"
      );
      
      if (subject === 'mathematics') {
        responses.push(
          "Can this be generalized to higher dimensions?",
          "What's the geometric interpretation of this result?",
          "Sir, how does this connect to advanced topics?"
        );
      }
    } else if (student.name === 'Sneha') {
      responses.push(
        "Sir, where do we see this concept in real life?",
        "Can we design an experiment to verify this?",
        "How is this used in modern technology?",
        "Sir, which industries use this principle the most?"
      );
      
      if (subject === 'chemistry') {
        responses.push(
          "What happens if we change the reaction conditions?",
          "Sir, can you show us the molecular-level picture?",
          "How does this reaction compare to similar ones?"
        );
      }
    } else if (student.name === 'Rohit') {
      responses.push(
        "Sir, what's the fastest method to solve this in JEE?",
        "Are there any shortcut formulas for this topic?",
        "How do we recognize this pattern in complex problems?",
        "Sir, what's the time management strategy for such questions?"
      );
      
      if (subject === 'physics') {
        responses.push(
          "Can we use energy methods instead of force analysis?",
          "Sir, what's the dimensional reasoning approach here?",
          "Which approximations save time in calculations?"
        );
      }
    } else if (student.name === 'Ananya') {
      responses.push(
        "Sir, can you draw the physical situation?",
        "How do we visualize this mathematically?",
        "Can you show us the graphical representation?",
        "Sir, what does this look like in 3D space?"
      );
      
      if (subject === 'mathematics') {
        responses.push(
          "Can we plot this function to understand better?",
          "Sir, what's the geometric meaning of this equation?",
          "How does this transformation affect the graph?"
        );
      }
    } else if (student.name === 'Karthik') {
      responses.push(
        "Sir, how frequently does this topic appear in JEE Advanced?",
        "What's the difficulty level of questions from this chapter?",
        "Can you give us the toughest possible question on this?",
        "Sir, what makes a good student excel in this topic?"
      );
      
      if (subject === 'chemistry') {
        responses.push(
          "Which coaching centers emphasize this topic the most?",
          "Sir, what are the common misconceptions here?",
          "How do top rankers approach such problems?"
        );
      }
    } else if (student.name === 'Divya') {
      responses.push(
        "Sir, can you break this into smaller logical steps?",
        "Let me make sure I understand each part correctly.",
        "What should be our systematic approach to such problems?",
        "Sir, can you give us a checklist for solving these questions?"
      );
      
      if (subject === 'mathematics') {
        responses.push(
          "What are the prerequisites for understanding this?",
          "Sir, how do we avoid calculation errors here?",
          "Can you explain the logic behind each step?"
        );
      }
    } else if (student.name === 'Varun') {
      responses.push(
        "Sir, I think I know this but I'm getting confused with the details.",
        "Wait, this looks similar to what we did last week, right?",
        "I remember solving something like this, but my method was different.",
        "Sir, can you check if this alternative approach works?",
        "This concept seems straightforward, but the problems are tricky!"
      );
      
      if (subject === 'physics') {
        responses.push(
          "Sir, I used conservation of energy, but got a different answer.",
          "Can we solve this using Newton's laws instead?",
          "I think there's a sign error in my calculation."
        );
      }
    }

    return responses;
  }
}