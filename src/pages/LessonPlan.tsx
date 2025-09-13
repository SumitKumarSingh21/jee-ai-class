import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target, Users, ArrowRight, Play } from 'lucide-react';
import { DurationSelector } from '@/components/DurationSelector';
import { UserProgress } from '@/components/UserProgress';

const subjectData = {
  physics: {
    name: 'Physics',
    icon: '⚡',
    chapters: {
      general: {
        name: 'General Physics',
        topics: ['Units and Dimensions', 'Physical Quantities', 'SI Units', 'Measurement of error', 'Significant figures', 'Error analysis', 'Experiments'],
        difficulty: 'Easy',
        examWeight: '5%'
      },
      mechanics: {
        name: 'Mechanics',
        topics: ['Kinematics (1D and 2D motion, projectiles)', 'Laws of Motion (Newton\'s laws, friction, circular motion)', 'Work, Energy and Power', 'System of Particles and Rotational Motion', 'Centre of mass, motion of COM', 'Torque, Angular momentum', 'Rigid body dynamics, Moment of inertia, Rolling motion', 'Gravitation (Newton\'s law, satellites, escape velocity, orbital velocity, Kepler\'s laws)'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      properties_matter_thermodynamics: {
        name: 'Properties of Matter and Thermodynamics',
        topics: ['Mechanical Properties of Solids (stress, strain, elastic modulus, Hooke\'s law)', 'Mechanical Properties of Fluids (pressure, Pascal\'s law, Archimedes\' principle, viscosity, surface tension)', 'Thermal Properties of Matter (heat transfer, calorimetry, expansion of solids/liquids/gases)', 'Thermodynamics (first law, second law, entropy, heat engines)', 'Kinetic Theory of Gases (equipartition, RMS velocity, mean free path)'],
        difficulty: 'Hard',
        examWeight: '20%'
      },
      oscillations_waves: {
        name: 'Oscillations and Waves',
        topics: ['Simple Harmonic Motion (equations, energy, superposition)', 'Damped and Forced oscillations, Resonance', 'Waves (sound waves, Doppler effect, beats, standing waves, organ pipes)'],
        difficulty: 'Medium',
        examWeight: '15%'
      },
      electrostatics_current: {
        name: 'Electrostatics & Current Electricity',
        topics: ['Electrostatics (Coulomb\'s law, electric field, potential, Gauss law, capacitors)', 'Current Electricity (Ohm\'s law, Kirchhoff\'s laws, cells, resistivity, Wheatstone bridge, potentiometer)'],
        difficulty: 'Hard',
        examWeight: '20%'
      },
      magnetism_induction: {
        name: 'Magnetism & Electromagnetic Induction',
        topics: ['Magnetic Effects of Current (Biot–Savart law, Ampere\'s law)', 'Earth\'s magnetism, Magnetic materials', 'Moving charges in magnetic fields (Lorentz force, cyclotron)', 'Electromagnetic Induction (Faraday\'s law, Lenz\'s law, self and mutual inductance)', 'Alternating Current (LCR circuits, resonance, transformers)'],
        difficulty: 'Hard',
        examWeight: '25%'
      },
      electromagnetic_waves: {
        name: 'Electromagnetic Waves',
        topics: ['Displacement current, Maxwell\'s equations (qualitative)', 'EM spectrum'],
        difficulty: 'Medium',
        examWeight: '5%'
      },
      optics: {
        name: 'Optics',
        topics: ['Ray Optics (reflection, refraction, lenses, mirrors, optical instruments, total internal reflection)', 'Wave Optics (interference, diffraction, polarisation, Young\'s double-slit experiment)'],
        difficulty: 'Medium',
        examWeight: '15%'
      },
      modern_physics: {
        name: 'Modern Physics',
        topics: ['Dual Nature of Matter and Radiation (photoelectric effect, de Broglie wavelength)', 'Atoms (Bohr model, hydrogen spectrum)', 'Nuclei (radioactivity, nuclear reactions, mass defect, binding energy)', 'Semiconductor Electronics (diodes, transistors, logic gates)', 'Communication Systems (JEE Main only, not in Advanced)'],
        difficulty: 'Hard',
        examWeight: '10%'
      }
    }
  },
  chemistry: {
    name: 'Chemistry',
    icon: '🧪',
    chapters: {
      physical_chemistry: {
        name: 'Physical Chemistry',
        topics: ['Some Basic Concepts of Chemistry (mole concept, stoichiometry, empirical formula)', 'Atomic Structure (Bohr model, quantum numbers, electronic configuration)', 'Chemical Bonding and Molecular Structure (VSEPR, hybridisation, MOT, bond energy)', 'States of Matter (ideal gas, real gas, liquefaction, kinetic theory of gases)', 'Chemical Thermodynamics (first, second laws, Gibbs free energy, spontaneity)', 'Solutions (Raoult\'s law, colligative properties, Henry\'s law)', 'Equilibrium (chemical equilibrium, ionic equilibrium, solubility product, buffer)', 'Redox Reactions and Electrochemistry (Nernst equation, galvanic cells, electrolytic cells)', 'Chemical Kinetics (order, molecularity, Arrhenius equation, rate laws)', 'Surface Chemistry (adsorption, catalysis, colloids)'],
        difficulty: 'Hard',
        examWeight: '35%'
      },
      inorganic_chemistry: {
        name: 'Inorganic Chemistry',
        topics: ['Periodic Table & Periodicity in Properties', 'Hydrogen and its Compounds', 's-Block Element (alkali and alkaline earth metals)', 'p-Block Elements (Groups 13–18, including oxides, halides, allotropes)', 'd-Block Elements (transition metals, their compounds, color, catalytic properties)', 'f-Block Elements (lanthanides, actinides)', 'Coordination Compounds (VBT, CFT, isomerism, stability)', 'Environmental Chemistry', 'General Principles & Processes of Isolation of Metals'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      organic_chemistry: {
        name: 'Organic Chemistry',
        topics: ['General Organic Chemistry (GOC) — nomenclature, hybridisation, resonance, inductive effect, mesomeric effect, hyperconjugation', 'Isomerism (structural, geometrical, optical, conformational)', 'Hydrocarbons: Alkanes, Alkenes, Alkynes (preparation, properties, reactions)', 'Aromatic Compounds (benzene, electrophilic substitution, Huckel\'s rule)', 'Organic Compounds with Functional Groups: Alcohols, Phenols, Ethers', 'Aldehydes, Ketones, Carboxylic Acids and Derivatives', 'Amines and Diazonium salts', 'Haloalkanes and Haloarenes', 'Polymers (addition, condensation, copolymers, natural & synthetic polymers)', 'Biomolecules (proteins, carbohydrates, nucleic acids, vitamins)', 'Chemistry in Everyday Life (drugs, soaps, detergents, dyes)'],
        difficulty: 'Medium',
        examWeight: '40%'
      }
    }
  },
  mathematics: {
    name: 'Mathematics',
    icon: '📊',
    chapters: {
      algebra: {
        name: 'Algebra',
        topics: ['Sets, Relations, Functions', 'Complex Numbers (properties, De Moivre\'s theorem, quadratic equations)', 'Matrices and Determinants', 'Permutations and Combinations', 'Binomial Theorem and Applications', 'Sequences and Series (AP, GP, HP, special series, sums of squares/cubes)', 'Mathematical Induction', 'Logarithms'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      trigonometry: {
        name: 'Trigonometry',
        topics: ['Trigonometric Ratios and Identities', 'Trigonometric Equations', 'Inverse Trigonometric Functions', 'Properties of Triangles', 'Heights and Distances'],
        difficulty: 'Easy',
        examWeight: '10%'
      },
      calculus: {
        name: 'Calculus',
        topics: ['Limits, Continuity, Differentiability', 'Differentiation and Applications (tangents, normals, maxima/minima, monotonicity, Rolle\'s theorem, Mean Value Theorem)', 'Indefinite Integrals (methods of integration)', 'Definite Integrals (properties, applications, area under curves)', 'Differential Equations (formation, first order and first degree, linear DE, separation of variables)'],
        difficulty: 'Hard',
        examWeight: '35%'
      },
      coordinate_geometry: {
        name: 'Coordinate Geometry',
        topics: ['Straight Lines, Circles, Parabola, Ellipse, Hyperbola', 'Conic Sections in general', '3D Geometry: direction cosines, equations of line and plane, distance formula, angle between lines/planes'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      vector_algebra: {
        name: 'Vector Algebra',
        topics: ['Addition, scalar product, vector product, scalar triple product'],
        difficulty: 'Medium',
        examWeight: '5%'
      },
      probability_statistics: {
        name: 'Probability & Statistics',
        topics: ['Probability (conditional probability, Bayes\' theorem, binomial distribution)', 'Statistics (mean, median, mode, variance, standard deviation)'],
        difficulty: 'Medium',
        examWeight: '8%'
      },
      mathematical_reasoning: {
        name: 'Mathematical Reasoning',
        topics: ['Statements, logical connectives, truth tables, implications, validity'],
        difficulty: 'Easy',
        examWeight: '2%'
      }
    }
  }
};

const LessonPlan: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedSubChapter, setSelectedSubChapter] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const navigate = useNavigate();

  const currentSubject = subjectData[selectedSubject as keyof typeof subjectData];
  const currentChapter = currentSubject?.chapters[selectedChapter as keyof typeof currentSubject.chapters] as any;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTeaching = () => {
    if (!selectedChapter) {
      alert('Please select a chapter before starting to teach');
      return;
    }
    
    if (!selectedSubChapter) {
      alert('Please select a specific topic before starting to teach');
      return;
    }
    
    // Navigate to teaching interface with selected subject and chapter
    navigate('/teaching', { 
      state: { 
        selectedSubject, 
        selectedChapter,
        selectedSubChapter,
        selectedDuration,
        subjectName: currentSubject.name,
        chapterName: currentChapter.name
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-lg">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">JEE Daily Lesson Planner</h1>
              <p className="text-lg text-muted-foreground">Choose your subject and chapter to begin teaching</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Progress */}
          <div className="lg:col-span-1">
            <UserProgress />
          </div>

          {/* Subject and Chapter Selection */}
          <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
            {/* Subject Selection Card */}
            <Card className="p-6 shadow-medium">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Select Subject</h3>
                </div>

                <div className="space-y-3">
                  {Object.entries(subjectData).map(([key, subject]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedSubject === key 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedSubject(key);
                        setSelectedChapter(''); // Reset chapter when subject changes
                        setSelectedSubChapter(''); // Reset sub-chapter when subject changes
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{subject.icon}</span>
                        <div>
                          <h4 className="font-semibold text-foreground">{subject.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {Object.keys(subject.chapters).length} chapters available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Chapter Selection Card */}
            <Card className="p-6 shadow-medium">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Select Chapter</h3>
                </div>

                {currentSubject ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(currentSubject.chapters).map(([key, chapter]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          selectedChapter === key 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setSelectedChapter(key);
                          setSelectedSubChapter(''); // Reset sub-chapter when chapter changes
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{chapter.name}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className={getDifficultyColor(chapter.difficulty)}>
                              {chapter.difficulty}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {chapter.examWeight}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Please select a subject first</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Duration and Sub-chapter Selection */}
        {selectedChapter && (
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <DurationSelector
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
            />
            
            {/* Sub-chapter Selection */}
            <Card className="p-6 shadow-medium">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Select Topic</h3>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {currentChapter.topics.map((topic: string, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                        selectedSubChapter === topic 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedSubChapter(topic)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground flex-1">{topic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Chapter Details - Summary View */}
        {currentChapter && selectedSubChapter && (
          <Card className="mt-6 p-6 shadow-medium">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-foreground">
                  Ready to Teach: {selectedSubChapter}
                </h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getDifficultyColor(currentChapter.difficulty)}>
                    <Target className="h-3 w-3 mr-1" />
                    {currentChapter.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedDuration} min session
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">Selected Topic:</p>
                <p className="text-foreground">{selectedSubChapter}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  From {currentSubject.name} → {currentChapter.name}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Start Teaching Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleStartTeaching}
            disabled={!selectedChapter || !selectedSubChapter}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-elegant hover:shadow-glow transition-all"
          >
            <Play className="h-6 w-6 mr-3" />
            Start Teaching Session ({selectedDuration} min)
            <ArrowRight className="h-6 w-6 ml-3" />
          </Button>
          
          {(!selectedChapter || !selectedSubChapter) && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select subject, chapter, and specific topic to begin teaching
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlan;