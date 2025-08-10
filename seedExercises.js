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
const EXERCISE_REGEX = /<(?:Harjoitus)\s+([^>]*?)>/g;

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

function validateExercise(exercise, filePath) {
  const required = ["name", "points", "answer", "level"];
  const missing = required.filter((field) => !exercise[field]);

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

    const exercise = {
      name: props.name,
      category: category,
      points: props.points,
      answer: props.answer,
      level: props.level,
    };

    if (validateExercise(exercise, filePath)) {
      exercises.push(exercise);

      if (isVerbose) {
        console.log(
          `   ✓ Found: "${exercise.name}" (${exercise.points}pts, Level ${exercise.level})`
        );
      }
    }
  }

  return exercises;
}

function displayExercisesSummary(exercises) {
  const totalPoints = exercises.reduce((sum, ex) => sum + ex.points, 0);
  const avgPoints = Math.round(totalPoints / exercises.length);
  const levelCounts = exercises.reduce((acc, ex) => {
    acc[ex.level] = (acc[ex.level] || 0) + 1;
    return acc;
  }, {});

  console.log("\n📊 Statistics:");
  console.log(`   Total exercises: ${exercises.length}`);
  console.log(`   Total points: ${totalPoints}`);
  console.log(`   Average points: ${avgPoints}`);
  console.log(`   Level distribution:`, levelCounts);
}

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
        console.log(
          `   ${i + 1}. ${ex.name} (${ex.category}, ${ex.points}pts, Level ${
            ex.level
          })`
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
        console.log(
          `   ${i + 1}. ${ex.name} (${ex.category}, ${ex.points}pts, Level ${
            ex.level
          })`
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
