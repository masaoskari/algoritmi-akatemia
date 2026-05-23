/**
 * Test specification types and code generator
 * Declarative test specs that are converted to Python code
 */

export type TestSpec =
  | FunctionCallTest
  | OutputTest
  | CodeAnalysisTest
  | AssertionTest;

export interface FunctionCallTest {
  tyyppi: "funktio";
  nimi: string;
  parametrit: (string | number | boolean)[];
  paluuarvo: string | number;
  viesti?: string;
}

export interface OutputTest {
  tyyppi: "tuloste";
  parametrit: string[];
  tulostus: string;
  viesti?: string;
}

export interface CodeAnalysisTest {
  tyyppi: "koodianalyysi";
  testi: "sisältää" | "pattern";
  arvo: string;
  viesti?: string;
}

export interface AssertionTest {
  tyyppi: "assert";
  koodi: string;
  viesti?: string;
}

/**
 * Generate Python test code from test specs
 */
export const generateTestCode = (
  specs: TestSpec[],
  userCode: string,
): string => {
  if (!specs || specs.length === 0) {
    return userCode;
  }

  let pythonCode = `
import re
import sys
import io

# Suppress user code output
old_stdout = sys.stdout
sys.stdout = io.StringIO()

# User code
try:
${userCode
  .split("\n")
  .map((line) => "    " + line)
  .join("\n")}
except Exception as e:
    sys.stdout = old_stdout
    print(f"Virhe: {type(e).__name__}: {e}")
    sys.exit(1)

# Restore stdout for test results only
sys.stdout = old_stdout

# Test runner
passed = 0
failed = 0

`;

  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const testNum = i + 1;
    const message = (spec.viesti || `Testi ${testNum}`).replace(/'/g, "\\'");

    if (spec.tyyppi === "funktio") {
      const args = (spec as FunctionCallTest).parametrit
        .map((arg) => (typeof arg === "string" ? `"${arg}"` : arg))
        .join(", ");
      const expected =
        typeof spec.paluuarvo === "string"
          ? `"${spec.paluuarvo}"`
          : spec.paluuarvo;

      pythonCode += `
# ${message}
try:
    result = ${(spec as FunctionCallTest).nimi}(${args})
    if str(result).strip() == str(${expected}).strip():
        print(f"✅ ${message}")
        passed += 1
    else:
        print(f"❌ ${message}")
        print(f"      Odotettu: {expected}")
        print(f"      Saatiin: {result}")
        failed += 1
except Exception as e:
    print(f"❌ ${message}")
    print(f"      Virhe: {type(e).__name__}: {e}")
    failed += 1

`;
    } else if (spec.tyyppi === "tuloste") {
      const outputSpec = spec as OutputTest;
      pythonCode += `
# ${message}
try:
    input_data = ${JSON.stringify(outputSpec.parametrit)}
    input_index = 0
    
    def mock_input_func(prompt=None):
        global input_index
        if input_index < len(input_data):
            response = input_data[input_index]
            input_index += 1
            return response
        raise EOFError()
    
    __builtins__.input = mock_input_func
    
    # Capture output
    old_stdout_inner = sys.stdout
    sys.stdout = io.StringIO()
    exec("""${userCode.replace(/"/g, '\\"').replace(/"""/g, '\\"""')}""", globals())
    output = sys.stdout.getvalue()
    sys.stdout = old_stdout_inner
    
    expected = """${outputSpec.tulostus}"""
    if expected.strip() in output.strip():
        print(f"✅ ${message}")
        passed += 1
    else:
        print(f"❌ ${message}")
        print(f"      Odotettu: {expected}")
        print(f"      Sinun: {output}")
        failed += 1
except Exception as e:
    sys.stdout = old_stdout
    print(f"❌ ${message}:")
    print(f"      Virhe: {type(e).__name__}: {e}")
    failed += 1

`;
    } else if (spec.tyyppi === "koodianalyysi") {
      const codeSpec = spec as CodeAnalysisTest;
      let condition = "";

      if (codeSpec.testi === "sisältää") {
        condition = `"${codeSpec.arvo}" in user_code`;
      } else if (codeSpec.testi === "pattern") {
        condition = `re.search(r"${codeSpec.arvo}", user_code)`;
      }

      pythonCode += `
# ${message}
user_code = """${userCode.replace(/"""/g, '\\"""')}"""
if ${condition}:
    print(f"✅ ${message}")
    passed += 1
else:
    print(f"❌ ${message}")
    print(f"      Odotettiin: ${codeSpec.testi} '${codeSpec.arvo}'")
    print(f"      Sinun koodissasi: ${codeSpec.testi} '${codeSpec.arvo}' ei löytynyt")
    failed += 1

`;
    } else if (spec.tyyppi === "assert") {
      const assertSpec = spec as AssertionTest;
      pythonCode += `
# ${message}
try:
    ${assertSpec.koodi}
    print(f"✅ ${message}")
    passed += 1
except AssertionError as e:
    print(f"❌ ${message}")
    print(f"      Ei toteutunut: ${assertSpec.koodi}")
    failed += 1
except Exception as e:
    print(f"❌ ${message}")
    print(f"      Virhe: {type(e).__name__}: {e}")
    failed += 1

`;
    }
  }

  pythonCode += `
print(f"{'-'*50}")
print(f"Läpäisty: {passed}/${specs.length}")
if failed > 0:
  print(f"Epäonnistui: {failed}/${specs.length}")
`;

  return pythonCode;
};

/**
 * Validate test specs structure
 */
export const validateTestSpecs = (specs: TestSpec[]): string[] => {
  const errors: string[] = [];

  specs.forEach((spec, i) => {
    if (spec.tyyppi === "funktio") {
      if (!spec.nimi) errors.push(`Test ${i}: functionCall requires 'nimi'`);
      if (!Array.isArray(spec.parametrit))
        errors.push(`Test ${i}: functionCall 'parametrit' must be array`);
      if (spec.paluuarvo === undefined)
        errors.push(`Test ${i}: functionCall requires 'paluuarvo'`);
    } else if (spec.tyyppi === "tuloste") {
      if (!spec.tulostus) errors.push(`Test ${i}: output requires 'tulostus'`);
    } else if (spec.tyyppi === "koodianalyysi") {
      if (!["sisältää", "pattern"].includes(spec.testi)) {
        errors.push(
          `Test ${i}: codeAnalysis 'test' must be 'sisältää' or 'pattern'`,
        );
      }
      if (!spec.arvo) errors.push(`Test ${i}: codeAnalysis requires 'arvo'`);
    } else if (spec.tyyppi === "assert") {
      if (!spec.koodi) errors.push(`Test ${i}: assert requires 'koodi'`);
    }
  });

  return errors;
};
