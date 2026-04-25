import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawData = [
  {"questionText": "Elements of ______ data structure are not connected sequentially", "optionA": "Array", "optionB": "Graph", "optionC": "Queue", "optionD": "Stack", "correctOption": "B", "stream": "computer"},
  {"questionText": "High-level languages have syntax that is", "optionA": "Easily readable by humans", "optionB": "Easily readable by machines", "optionC": "None of the above", "optionD": "", "correctOption": "A", "stream": "computer"},
  {"questionText": "Which of the following needs pressing Enter Key from the keyboard", "optionA": "getch", "optionB": "getche", "optionC": "getchar", "optionD": "getc", "correctOption": "C", "stream": "computer"},
  {"questionText": "for Loop expression has ______ parts", "optionA": "one", "optionB": "two", "optionC": "three", "optionD": "four", "correctOption": "C", "stream": "computer"},
  {"questionText": "The word prototype means", "optionA": "Declaration", "optionB": "Calling", "optionC": "Definition", "optionD": "Both a and b", "correctOption": "A", "stream": "computer"},
  {"questionText": "Which operator is used for logical AND operation", "optionA": "&", "optionB": "&&", "optionC": "||", "optionD": "!", "correctOption": "B", "stream": "computer"},
  {"questionText": "______ stores data in hierarchical manner", "optionA": "Stack", "optionB": "Queue", "optionC": "Array", "optionD": "Tree", "correctOption": "D", "stream": "computer"},
  {"questionText": "Which operator is used for input stream", "optionA": "<<", "optionB": ">>", "optionC": "<", "optionD": ">", "correctOption": "B", "stream": "computer"},
  {"questionText": "When the data is Pushed in stack it means that data is", "optionA": "inserted", "optionB": "deleted", "optionC": "sorted", "optionD": "edited", "correctOption": "A", "stream": "computer"},
  {"questionText": "A computer program is a collection of", "optionA": "Tasks", "optionB": "Instructions", "optionC": "Computers", "optionD": "Programmers", "correctOption": "B", "stream": "computer"},
  {"questionText": "Rate of change of displacement is called", "optionA": "Acceleration", "optionB": "Speed", "optionC": "Velocity", "optionD": "Deceleration", "correctOption": "C", "stream": "physics"},
  {"questionText": "An object appears lighter in water because of", "optionA": "Buoyancy", "optionB": "Surface tension", "optionC": "Specific gravity", "optionD": "Density", "correctOption": "A", "stream": "physics"},
  {"questionText": "The SI unit of luminous intensity is", "optionA": "Candela", "optionB": "Newton", "optionC": "Joule", "optionD": "Coulomb", "correctOption": "A", "stream": "physics"},
  {"questionText": "The least count of micrometer screw gauge is", "optionA": "0.1 cm", "optionB": "0.01 cm", "optionC": "0.01 mm", "optionD": "0.01 m", "correctOption": "C", "stream": "physics"},
  {"questionText": "If a force of 15 N acting along y-axis its x-component is", "optionA": "0N", "optionB": "15N", "optionC": "-15N", "optionD": "none of these", "correctOption": "A", "stream": "physics"},
  {"questionText": "Heat is a form of", "optionA": "energy", "optionB": "power", "optionC": "force", "optionD": "momentum", "correctOption": "A", "stream": "physics"},
  {"questionText": "Kilo watt hour is the unit of", "optionA": "distance", "optionB": "energy", "optionC": "time", "optionD": "power", "correctOption": "B", "stream": "physics"},
  {"questionText": "Spring balance is used to measure", "optionA": "Mass", "optionB": "Weight", "optionC": "Elasticity", "optionD": "Density", "correctOption": "B", "stream": "physics"},
  {"questionText": "Evaporation occurs at", "optionA": "Freezing point", "optionB": "Melting point", "optionC": "Boiling point", "optionD": "All temperatures", "correctOption": "D", "stream": "physics"},
  {"questionText": "Natural satellite of Earth is", "optionA": "Neptune", "optionB": "Jupiter", "optionC": "Moon", "optionD": "Mars", "correctOption": "C", "stream": "physics"},
  {"questionText": "Solution of known concentration is called", "optionA": "Aqueous solution", "optionB": "Standard solution", "optionC": "Saturated solution", "optionD": "Unsaturated solution", "correctOption": "B", "stream": "chemistry"},
  {"questionText": "It is an endothermic reaction", "optionA": "Respiration", "optionB": "Combustion", "optionC": "Thermal decomposition", "optionD": "Neutralization", "correctOption": "C", "stream": "chemistry"},
  {"questionText": "PVC stands for", "optionA": "Poly Phenol Chloride", "optionB": "Poly Vinyl Chloride", "optionC": "Poly Vinyl Cellulose", "optionD": "Poly Vinyl Chlorate", "correctOption": "B", "stream": "chemistry"},
  {"questionText": "It is the lightest particle of an atom", "optionA": "Proton", "optionB": "Photon", "optionC": "Electron", "optionD": "Neutron", "correctOption": "C", "stream": "chemistry"},
  {"questionText": "The empirical formula of Benzene is", "optionA": "C6H6", "optionB": "CH2", "optionC": "CH3", "optionD": "CH2O", "correctOption": "A", "stream": "chemistry"},
  {"questionText": "The pH value of neutral solution is", "optionA": "6.5", "optionB": "7", "optionC": "7.8", "optionD": "4.2", "correctOption": "B", "stream": "chemistry"},
  {"questionText": "Natural gas mainly consists of", "optionA": "Ethane", "optionB": "Methane", "optionC": "Propane", "optionD": "Butane", "correctOption": "B", "stream": "chemistry"},
  {"questionText": "Which of the following is saturated hydrocarbon", "optionA": "CH3CH=CH2", "optionB": "CH3CH2CH2CH3", "optionC": "CH3CCH", "optionD": "CH2=CH-CCH", "correctOption": "B", "stream": "chemistry"},
  {"questionText": "The bond in MgO is", "optionA": "Ionic bond", "optionB": "Chemical bond", "optionC": "Covalent bond", "optionD": "Coordinate covalent bond", "correctOption": "A", "stream": "chemistry"},
  {"questionText": "Definite shape and definite volume is the property of", "optionA": "Gas", "optionB": "Plasma", "optionC": "Liquid", "optionD": "Solid", "correctOption": "D", "stream": "chemistry"},
  {"questionText": "A scientist is studying features of genes nucleolus and chromosomes inside the nucleus He is working in", "optionA": "Genetics", "optionB": "Cytology", "optionC": "Microbiology", "optionD": "Biochemistry", "correctOption": "B", "stream": "biology"},
  {"questionText": "A scientist is identifying different species of rose plants in different regions He is working in", "optionA": "Taxonomy", "optionB": "Morphology", "optionC": "Anatomy", "optionD": "Botany", "correctOption": "A", "stream": "biology"},
  {"questionText": "Detection of defects in baby before birth is made possible by studying", "optionA": "Embryology", "optionB": "Genetics", "optionC": "Physiology", "optionD": "Both a and b", "correctOption": "D", "stream": "biology"},
  {"questionText": "The process of fermentation and its industrial applications are related to", "optionA": "Mycology", "optionB": "Bacteriology", "optionC": "Genetic engineering", "optionD": "None of these", "correctOption": "B", "stream": "biology"},
  {"questionText": "Sound waves and laser technology show relationship of biology with", "optionA": "Physics", "optionB": "Histology", "optionC": "Anatomy", "optionD": "Genetic engineering", "correctOption": "A", "stream": "biology"},
  {"questionText": "Study of external form and structure of organism is called", "optionA": "Morphology", "optionB": "Histology", "optionC": "Anatomy", "optionD": "Genetic engineering", "correctOption": "A", "stream": "biology"},
  {"questionText": "Study of internal form and structure of organism is called", "optionA": "Morphology", "optionB": "Anatomy", "optionC": "Histology", "optionD": "Genetic engineering", "correctOption": "B", "stream": "biology"},
  {"questionText": "Study of functions of living organisms is called", "optionA": "Morphology", "optionB": "Histology", "optionC": "Physiology", "optionD": "Genetic engineering", "correctOption": "C", "stream": "biology"},
  {"questionText": "The basic unit of biological classification is", "optionA": "Taxonomy", "optionB": "Species", "optionC": "Kingdom", "optionD": "None of these", "correctOption": "B", "stream": "biology"},
  {"questionText": "The term biodiversity means", "optionA": "Variety of life forms", "optionB": "Differences in life forms", "optionC": "Similarities in life forms", "optionD": "Both a and b", "correctOption": "D", "stream": "biology"},
  {"questionText": "If log4 x equals 3 over 2 then x is", "optionA": "4", "optionB": "6", "optionC": "8", "optionD": "10", "correctOption": "C", "stream": "mathematics"},
  {"questionText": "HCF of x squared minus y squared and x minus y squared is", "optionA": "x plus y", "optionB": "x plus y squared", "optionC": "x minus y", "optionD": "x minus y squared", "correctOption": "C", "stream": "mathematics"},
  {"questionText": "The solution set of absolute 5y over 3 equals 5 is", "optionA": "3", "optionB": "negative 3 negative 3", "optionC": "negative 5 5", "optionD": "negative 3", "correctOption": "C", "stream": "mathematics"},
  {"questionText": "The characteristic of log 0.01706 is", "optionA": "4", "optionB": "negative 4", "optionC": "2", "optionD": "negative 2", "correctOption": "D", "stream": "mathematics"},
  {"questionText": "If opposite angles of quadrilateral are equal and none is a right angle the quadrilateral is", "optionA": "Square", "optionB": "Trapezium", "optionC": "Rectangle", "optionD": "Parallelogram", "correctOption": "D", "stream": "mathematics"},
  {"questionText": "The point negative 2 negative 5 is located in", "optionA": "First quadrant", "optionB": "Second quadrant", "optionC": "Third quadrant", "optionD": "Fourth quadrant", "correctOption": "C", "stream": "mathematics"},
  {"questionText": "Conjugate of 2 minus square root 3 is", "optionA": "2 plus square root 3", "optionB": "3 square root 2", "optionC": "2 square root 3", "optionD": "3 minus square root 2", "correctOption": "A", "stream": "mathematics"},
  {"questionText": "Degree of the polynomial 4a5b2 plus 6b4 minus 12 is", "optionA": "8", "optionB": "6", "optionC": "4", "optionD": "12", "correctOption": "B", "stream": "mathematics"},
  {"questionText": "The two coordinate axes intersect at an angle of", "optionA": "90", "optionB": "45", "optionC": "270", "optionD": "180", "correctOption": "A", "stream": "mathematics"},
  {"questionText": "If x squared minus 4x plus k is a complete square then k is", "optionA": "8", "optionB": "negative 8", "optionC": "4", "optionD": "negative 4", "correctOption": "C", "stream": "mathematics"},
  {"questionText": "Hazrat Muhammad the Prophet of Islam was born in AD", "optionA": "570", "optionB": "571", "optionC": "572", "optionD": "671", "correctOption": "A", "stream": "english"},
  {"questionText": "Hazrat Muhammad was born at", "optionA": "Hijaz", "optionB": "Riyadh", "optionC": "Madina", "optionD": "Makkah", "correctOption": "D", "stream": "english"},
  {"questionText": "Due to opposition of Quraish the Holy Prophet asked believers to migrate to", "optionA": "Madina", "optionB": "Jeddah", "optionC": "Riyadh", "optionD": "Makkah", "correctOption": "A", "stream": "english"},
  {"questionText": "The migration to Madina took place in", "optionA": "610 AD", "optionB": "622 AD", "optionC": "620 AD", "optionD": "624 AD", "correctOption": "B", "stream": "english"},
  {"questionText": "The Holy Prophet performed Hajj in the year of Hijra", "optionA": "10th", "optionB": "11th", "optionC": "9th", "optionD": "12th", "correctOption": "A", "stream": "english"},
  {"questionText": "The Holy Prophet gave his last sermon on", "optionA": "Mount Hira", "optionB": "Mount Arafat", "optionC": "Mount Rehamt", "optionD": "Mount Toor", "correctOption": "B", "stream": "english"},
  {"questionText": "A person can be superior by his", "optionA": "Goodness", "optionB": "Whiteness", "optionC": "Blood", "optionD": "Wealth", "correctOption": "A", "stream": "english"},
  {"questionText": "The whole of humanity is the offspring of", "optionA": "Adam", "optionB": "Allah", "optionC": "Satan", "optionD": "Angels", "correctOption": "A", "stream": "english"},
  {"questionText": "Adam was created from", "optionA": "Dust", "optionB": "Water", "optionC": "Gold", "optionD": "Wheat", "correctOption": "A", "stream": "english"},
  {"questionText": "Mount Arafat is near", "optionA": "Madina", "optionB": "Makkah", "optionC": "Syria", "optionD": "Arab", "correctOption": "B", "stream": "english"},
  {"questionText": "The book on life and teachings of Hazrat Muhammad Rashid Roza Dehni is", "optionA": "Sindhi Kalam", "optionB": "Taufifa fus Salikeen", "optionC": "Malfuzat Sharif", "optionD": "None of these", "correctOption": "C", "stream": "islamiyat"},
  {"questionText": "To extract essence Jabir Bin Hayan invented", "optionA": "Bottle", "optionB": "Qura Anabiq", "optionC": "Pitcher", "optionD": "None of these", "correctOption": "B", "stream": "islamiyat"},
  {"questionText": "The name of Hazrat Abu Ubaldah Bin Jarrah was", "optionA": "Amir", "optionB": "Umar", "optionC": "Abdullah", "optionD": "Imran", "correctOption": "A", "stream": "islamiyat"},
  {"questionText": "The last resting place of Hazrat Imam Hussain is in", "optionA": "Kufa", "optionB": "Karbala", "optionC": "Basra", "optionD": "Madinah", "correctOption": "B", "stream": "islamiyat"},
  {"questionText": "Two objectives of dressing in Islam are", "optionA": "Simplicity and cleanliness", "optionB": "Covering and beautification", "optionC": "Neatness and quality", "optionD": "Neatness and cleanliness", "correctOption": "B", "stream": "islamiyat"},
  {"questionText": "The meaning of Ashra Mubashrah is", "optionA": "The ten friends", "optionB": "The ten acts", "optionC": "The ten companions", "optionD": "The ten given glad tidings", "correctOption": "D", "stream": "islamiyat"},
  {"questionText": "The literal meaning of Ahl e Bait is", "optionA": "Bait writer", "optionB": "Family members", "optionC": "Poets", "optionD": "Believers", "correctOption": "B", "stream": "islamiyat"},
  {"questionText": "The name of second Ghazwa is", "optionA": "Tabook", "optionB": "Uhud", "optionC": "Khyber", "optionD": "Badr", "correctOption": "B", "stream": "islamiyat"},
  {"questionText": "The meaning of Hijrat is", "optionA": "Migration for religion", "optionB": "Being Muslim", "optionC": "Staying", "optionD": "Traveling for knowledge", "correctOption": "A", "stream": "islamiyat"},
  {"questionText": "The consultative council of Makkah was called", "optionA": "Dar ul Hijra", "optionB": "The Holy Kaaba", "optionC": "Dar ul Nadwah", "optionD": "Sufah", "correctOption": "C", "stream": "islamiyat"}
];

async function main() {
  const formattedData = rawData.map(q => ({
    class: "9",
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctOption: q.correctOption,
    stream: (q.stream === "biology" || q.stream === "computer") ? q.stream : "all"
  }));

  const result = await prisma.question.createMany({
    data: formattedData
  });

  console.log(`Successfully inserted ${result.count} questions for Class 9.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
