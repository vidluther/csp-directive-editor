/**
 * Imports the node-fetch module to make HTTP requests.
 * Imports the readline module to get input from stdin.
 *
 * Creates an interface to get input from stdin and output to stdout.
 */
import fetch from "node-fetch";
import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Fetches the CSP from a given URL.
 *
 * @param {string} url - The URL to fetch the CSP from.
 * @returns {Object} The deserialized CSP directives object.
 */
async function getCSP(url) {
  try {
    const response = await fetch(url);
    const csp = response.headers.get("content-security-policy");

    if (csp) {
      return deserializeCSP(csp);
    } else {
      console.log("No Content Security Policy found for", url);
      return {};
    }
  } catch (error) {
    console.error("Error fetching the URL:", error.message);
    return {};
  }
}

/**
 * Deserializes a CSP string into a directives object.
 *
 * @param {string} cspString - The raw CSP string from the HTTP header
 * @returns {Object} The deserialized directives object
 */
function deserializeCSP(cspString) {
  const directives = {};
  const pairs = cspString
    .split(";")
    .map((d) => d.trim())
    .filter((d) => d);

  pairs.forEach((pair) => {
    const [directive, ...values] = pair.split(" ").map((v) => v.trim());
    directives[directive] = values;
  });

  return directives;
}

/**
 * Serializes a CSP directives object into a CSP header string.
 *
 * @param {Object} directives - The CSP directives object
 * @returns {string} The serialized CSP header string
 */
function serializeCSP(directives) {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}
/**
 * Interactively edits a Content Security Policy directives object.
 * Displays the current directives, prompts the user to select one to edit,
 * add a new one, print the full CSP string, or quit. Recursively calls itself
 * after each edit to continue editing.
 *
 * @param {Object} directives - The CSP directives object to edit
 */

function editCSP(directives) {
  console.log(
    "\x1b[36m%s\x1b[0m", // Cyan color for headings
    `Your CSP has ${Object.keys(directives).length} directives.`
  );
  Object.entries(directives).forEach(([directive, values], index) => {
    console.log(
      `${index + 1}: \x1b[33m${directive}\x1b[0m - ${values.join(" ")}`
    ); // Yellow for directive names
  });
  console.log("\x1b[32m%s\x1b[0m", "A: Add a new directive");
  console.log("\x1b[32m%s\x1b[0m", "P: Print the full CSP string and exit");
  console.log("\x1b[31m%s\x1b[0m", "Q: Quit the application");

  rl.question(
    "Select a directive number to edit, A to add, P to print, or Q to quit: ",
    (answer) => {
      if (answer.toUpperCase() === "P") {
        const finalCSP = serializeCSP(directives);
        console.log("\nFinal CSP String (also saved to 'generated_csp.txt'):");

        console.log("\nFinal CSP String (copy and paste this line):");
        console.log("\x1b[32m%s\x1b[0m", finalCSP); // Print in green for visibility
        fs.writeFileSync("generated_csp.txt", finalCSP); // Save to file
        console.log(
          "\nTo copy the CSP to your clipboard, run: 'cat ./generated_csp.txt | pbcopy'"
        );
        rl.close();
        process.exit();
      } else if (answer.toUpperCase() === "A") {
        addDirective(directives);
        return;
      } else if (answer.toUpperCase() === "Q") {
        console.log("Exiting the application.");
        rl.close();
        process.exit();
      }

      const directiveIndex = parseInt(answer) - 1;
      const directiveKeys = Object.keys(directives);
      if (directiveIndex >= 0 && directiveIndex < directiveKeys.length) {
        const directive = directiveKeys[directiveIndex];
        rl.question(
          `Edit the value for \x1b[33m${directive}\x1b[0m (current: ${directives[
            directive
          ].join(" ")}): `,
          (newValue) => {
            directives[directive] = newValue.split(" ").filter((v) => v);
            editCSP(directives);
          }
        );
      } else {
        console.log("Invalid selection. Please try again.");
        editCSP(directives);
      }
    }
  );
}

/**
 * Prompts the user to enter a new CSP directive and value(s)
 * and adds it to the directives object.
 * Validates input and recursively prompts again on invalid input.
 */
function addDirective(directives) {
  rl.question(
    "Enter the new directive name and values (e.g., 'script-src https://example.com'): ",
    (newDirective) => {
      const [directive, ...values] = newDirective.split(" ").filter((v) => v);
      if (directive) {
        directives[directive] = values;
        editCSP(directives);
      } else {
        console.log("Invalid directive. Please try again.");
        addDirective(directives);
      }
    }
  );
}

const url = process.argv[2];
if (!url) {
  console.log("Please provide a URL as an argument");
  rl.close();
} else {
  getCSP(url).then((directives) => editCSP(directives));
}
