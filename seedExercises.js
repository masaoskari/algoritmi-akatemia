const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const isDryRun =
  process.argv.includes("--dry-run") || process.argv.includes("-d");
const isVerbose =
  process.argv.includes("--verbose") || process.argv.includes("-v");

let supabase = null;
if (!isDryRun) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Regular expressions to extract exercise data from MDX
const EXERCISE_REGEX = /<(?:Harjoitus|MonivalintaHarjoitus)\s+([^>]*?)>/g;

function parseExerciseProps(propsString) {
  const props = {};

  const patterns = [
    /(\w+)=\{([^}]+)\}/g, // {value}
    /(\w+)="([^"]*)"/g, // "value"
    /(\w+)='([^']*)'/g, // 'value'
    /(\w+)=([^\s>]+)/g, // value (no quotes)
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(propsString)) !== null) {
      const [, key, value] = match;
      if (!props[key]) {
        // Convert specific props to correct types
        if (key === "points" || key === "level") {
          props[key] = parseInt(value);
        } else {
          props[key] = value;
        }
      }
    }
    pattern.lastIndex = 0;
  });
  return props;
}
// Replace the extractQuestionsFromContent function with this more robust version:
function extractQuestionsFromContent(content, exerciseName) {
  // Find the start of the MonivalintaHarjoitus with this name
  const namePattern = new RegExp(
    `<MonivalintaHarjoitus[\\s\\S]*?name="${exerciseName}"`,
    "g"
  );
  const nameMatch = namePattern.exec(content);

  if (!nameMatch) {
    console.warn(
      `   ⚠️  Could not find MonivalintaHarjoitus with name "${exerciseName}"`
    );
    return null;
  }

  // Find questions={ after the name
  const questionsStartPattern = /questions=\{/g;
  questionsStartPattern.lastIndex = nameMatch.index;
  const questionsStart = questionsStartPattern.exec(content);

  if (!questionsStart) {
    console.warn(`   ⚠️  Could not find questions prop for "${exerciseName}"`);
    return null;
  }

  // Find the matching closing brace by counting braces
  let braceCount = 1;
  let index = questionsStart.index + questionsStart[0].length;
  const startIndex = index;

  while (index < content.length && braceCount > 0) {
    const char = content[index];
    if (char === "{") braceCount++;
    if (char === "}") braceCount--;
    index++;
  }

  if (braceCount !== 0) {
    console.warn(
      `   ⚠️  Could not find matching closing brace for questions in "${exerciseName}"`
    );
    return null;
  }

  const questionsContent = content.substring(startIndex, index - 1);

  try {
    const questions = eval(`(${questionsContent})`);

    if (isVerbose) {
      console.log(
        `   📝 Successfully parsed ${questions.length} questions from "${exerciseName}"`
      );
      questions.forEach((q, i) => {
        console.log(
          `      ${i + 1}. "${q.question}" → "${q.answer}" (${q.points}pts)`
        );
      });
    }

    return questions;
  } catch (error) {
    console.warn(
      `   ⚠️  Failed to parse questions for "${exerciseName}": ${error.message}`
    );

    if (isVerbose) {
      console.log(`   🔍 Problematic content: ${questionsContent}`);
    }

    return null;
  }
}

function validateExercise(exercise, filePath) {
  const required = ["name", "points", "level"];
  // Answer can be empty string for some exercises
  const missing = required.filter(
    (field) => exercise[field] === undefined || exercise[field] === null
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️  Invalid exercise in ${filePath}: missing ${missing.join(", ")}`
    );
    return false;
  }

  if (exercise.points <= 0) {
    console.warn(`⚠️  Invalid points in ${filePath}: ${exercise.points}`);
    return false;
  }

  if (exercise.level <= 0) {
    console.warn(`⚠️  Invalid level in ${filePath}: ${exercise.level}`);
    return false;
  }

  return true;
}

function extractExercisesFromMDX(filePath, category) {
  const content = fs.readFileSync(filePath, "utf-8");
  const exercises = [];
  let match;

  while ((match = EXERCISE_REGEX.exec(content)) !== null) {
    const propsString = match[1];
    const props = parseExerciseProps(propsString);
    // Check if this is a MonivalintaHarjoitus
    const isMonivalinta = match[0].includes("MonivalintaHarjoitus");

    let exercise = {
      name: props.name,
      category: category,
      points: props.points || 0,
      answer: props.answer || "",
      level: props.level,
    };

    // Handle MonivalintaHarjoitus differently
    if (isMonivalinta && props.name) {
      const questions = extractQuestionsFromContent(content, props.name);
      if (questions && questions.length > 0) {
        // Calculate total points from questions
        const totalPoints = questions.reduce(
          (sum, q) => sum + (q.points || 0),
          0
        );
        // Extract all correct answers
        const answers = questions.map((q) => q.answer);
        // Update exercise with calculated data
        exercise.points = totalPoints > 0 ? totalPoints : props.points || 0;
        exercise.answer = JSON.stringify(answers); // Store as JSON array
      } else {
        console.warn(
          `   ⚠️  MonivalintaHarjoitus "${props.name}" has no parseable questions`
        );
      }
    }

    if (validateExercise(exercise, filePath)) {
      exercises.push(exercise);

      if (isVerbose) {
        const type = isMonivalinta ? "MonivalintaHarjoitus" : "Harjoitus";
        console.log(
          `   ✓ Found ${type}: "${exercise.name}" (${exercise.points}pts, Level ${exercise.level})`
        );
      }
    }
  }

  return exercises;
}

function displayExercisesSummary(exercises) {
  const totalPoints = exercises.reduce((sum, ex) => sum + ex.points, 0);
  const avgPoints =
    exercises.length > 0 ? Math.round(totalPoints / exercises.length) : 0;
  const levelCounts = exercises.reduce((acc, ex) => {
    acc[ex.level] = (acc[ex.level] || 0) + 1;
    return acc;
  }, {});

  // Count exercise types
  const typeCount = exercises.reduce((acc, ex) => {
    try {
      // Check if answer is a JSON array (MonivalintaHarjoitus)
      JSON.parse(ex.answer);
      acc.monivalinta = (acc.monivalinta || 0) + 1;
    } catch {
      acc.regular = (acc.regular || 0) + 1;
    }
    return acc;
  }, {});

  console.log("\n📊 Statistics:");
  console.log(`   Total exercises: ${exercises.length}`);
  console.log(`   Regular exercises: ${typeCount.regular || 0}`);
  console.log(`   Multiple choice exercises: ${typeCount.monivalinta || 0}`);
  console.log(`   Total points: ${totalPoints}`);
  console.log(`   Average points: ${avgPoints}`);
  console.log(`   Level distribution:`, levelCounts);
}

// Rest of your existing seedExercises function stays the same...
async function seedExercises() {
  try {
    console.log(
      isDryRun
        ? "🧪 Starting DRY RUN exercise seeding..."
        : "🌱 Starting exercise seeding..."
    );

    if (isDryRun) {
      console.log("📝 No data will be written to the database");
    }

    const contentDir = path.join(__dirname, "src/content");

    // Check if content directory exists
    if (!fs.existsSync(contentDir)) {
      console.error(`❌ Content directory not found: ${contentDir}`);
      process.exit(1);
    }

    const allExercises = [];
    let fileCount = 0;
    let skipCount = 0;

    function readMDXFiles(dir, category = "") {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Recursively read subdirectories
          readMDXFiles(filePath, file);
        } else if (file.endsWith(".mdx")) {
          fileCount++;
          console.log(`📖 Processing: ${filePath}`);

          try {
            const exercises = extractExercisesFromMDX(
              filePath,
              category || "general"
            );
            allExercises.push(...exercises);
          } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
            skipCount++;
          }
        }
      });
    }

    readMDXFiles(contentDir);

    console.log(`\n📊 Processing Summary:`);
    console.log(`   Files processed: ${fileCount}`);
    console.log(`   Files skipped: ${skipCount}`);
    console.log(`   Exercises found: ${allExercises.length}`);

    if (allExercises.length === 0) {
      console.log("⚠️  No exercises found to seed");
      return;
    }

    // Display detailed summary
    if (isVerbose || isDryRun) {
      displayExercisesSummary(allExercises);
    }

    // Insert exercises into Supabase (unless dry run)
    if (isDryRun) {
      console.log("\n🧪 DRY RUN: Would upsert the following exercises:");
      allExercises.forEach((ex, i) => {
        const type = ex.answer.startsWith("[")
          ? "MonivalintaHarjoitus"
          : "Harjoitus";
        console.log(
          `   ${i + 1}. ${ex.name} (${type}, ${ex.category}, ${
            ex.points
          }pts, Level ${ex.level})`
        );
      });
      console.log("\n✅ Dry run completed successfully!");
      console.log("💡 Run without --dry-run to actually seed the database");
    } else {
      console.log("\n💾 Inserting exercises into Supabase...");

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        console.error("❌ Missing required environment variables:");
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
          console.error("   - NEXT_PUBLIC_SUPABASE_URL");
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
          console.error("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
        process.exit(1);
      }

      const { data, error } = await supabase
        .from("exercises")
        .upsert(allExercises, {
          onConflict: "name",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("❌ Error inserting exercises:", error);
        throw error;
      }

      console.log("✅ Successfully seeded exercises!");
      console.log("📈 Processed exercises:");
      allExercises.forEach((ex, i) => {
        const type = ex.answer.startsWith("[")
          ? "MonivalintaHarjoitus"
          : "Harjoitus";
        console.log(
          `   ${i + 1}. ${ex.name} (${type}, ${ex.category}, ${
            ex.points
          }pts, Level ${ex.level})`
        );
      });
    }
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🌱 Exercise Seeding Script

Usage: node seedExercises.js [options]

Options:
  --dry-run, -d    Run without actually inserting data to database
  --verbose, -v    Show detailed output and exercise information
  --help, -h       Show this help message

Examples:
  node seedExercises.js --dry-run              # Preview what would be seeded
  node seedExercises.js --dry-run --verbose    # Detailed preview
  node seedExercises.js                        # Actually seed the database
  node seedExercises.js --verbose              # Seed with detailed output
`);
  process.exit(0);
}

seedExercises();
