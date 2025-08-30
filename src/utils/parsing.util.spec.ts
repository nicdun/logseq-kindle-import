import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { parseKindleData } from "./parsing.util";

const readFixture = (name: string): string =>
  readFileSync(join("./test-files", name), "utf-8");

describe("parseKindleData", () => {
  it("parses french highlights and metadata", () => {
    const html = readFixture("french.html");
    const book = parseKindleData(html);
    expect(book).not.toBeNull();
    expect(book?.title).toBe(
      "Influence et manipulation : L'art de la persuasion"
    );
    expect(book?.authors).toEqual(["Cialdini, Robert B."]);
    expect(book?.highlights.length).toBeGreaterThan(10);

    // Test first 5 highlights
    const firstFive = book!.highlights.slice(0, 5);

    // First highlight
    expect(firstFive[0].text).toContain("Excusez-moi, j'ai cinq pages");
    expect(firstFive[0].color).toBe("yellow");
    expect(firstFive[0].page).toBe("20");
    expect(firstFive[0].location).toBe("252");
    expect(firstFive[0].chapter).toContain(
      "Chapitre 1 - Leviers d'influence - Les armes du métier"
    );

    // Second highlight
    expect(firstFive[1].text).toContain("Il semble à la fois ironique");
    expect(firstFive[1].color).toBe("yellow");
    expect(firstFive[1].page).toBe("58");
    expect(firstFive[1].location).toBe("824");
    expect(firstFive[1].chapter).toContain("Chapitre 2");

    // Third highlight
    expect(firstFive[2].text).toContain(
      "De fait, des enquêtes de consommation"
    );
    expect(firstFive[2].color).toBe("yellow");
    expect(firstFive[2].page).toBe("104");
    expect(firstFive[2].location).toBe("1502");
    expect(firstFive[2].chapter).toContain("Chapitre 3");

    // Fourth highlight
    expect(firstFive[3].text).toContain("Ce qui est intéressant, dans tout ça");
    expect(firstFive[3].color).toBe("yellow");
    expect(firstFive[3].page).toBe("104");
    expect(firstFive[3].location).toBe("1508");
    expect(firstFive[3].chapter).toContain("Chapitre 3");

    // Fifth highlight
    expect(firstFive[4].text).toContain("Le manuel de ventes Shaklee");
    expect(firstFive[4].color).toBe("yellow");
    expect(firstFive[4].page).toBe("106");
    expect(firstFive[4].location).toBe("1531");
    expect(firstFive[4].chapter).toContain("Chapitre 3");
  });

  it("parses english highlights and metadata", () => {
    const html = readFixture("english.html");
    const book = parseKindleData(html);
    expect(book).not.toBeNull();
    expect(book?.title).toBe(
      "Fundamentals of Software Architecture: An Engineering Approach"
    );
    expect(book?.authors).toEqual(["Richards, Mark", "Ford, Neal"]);
    expect(book?.highlights.length).toBeGreaterThan(5);

    // Test first 5 highlights
    const firstFive = book!.highlights.slice(0, 5);

    // First highlight
    expect(firstFive[0].text).toContain(
      "tongue-in-cheek definition of software architecture"
    );
    expect(firstFive[0].color).toBe("yellow");
    expect(firstFive[0].page).toBe("4");
    expect(firstFive[0].location).toBe("52");
    expect(firstFive[0].chapter).toContain("Preface");

    // Second highlight
    expect(firstFive[1].text).toContain("As a software developer");
    expect(firstFive[1].color).toBe("yellow");
    expect(firstFive[1].page).toBe("5");
    expect(firstFive[1].location).toBe("61");
    expect(firstFive[1].chapter).toContain("Preface");

    // Third highlight
    expect(firstFive[2].text).toContain("Readers should keep in mind");
    expect(firstFive[2].color).toBe("yellow");
    expect(firstFive[2].page).toBe("11");
    expect(firstFive[2].location).toBe("163");
    expect(firstFive[2].chapter).toContain("1. Introduction");

    // Fourth highlight
    expect(firstFive[3].text).toContain(
      "In this definition, software architecture"
    );
    expect(firstFive[3].color).toBe("yellow");
    expect(firstFive[3].page).toBe("12");
    expect(firstFive[3].location).toBe("170");
    expect(firstFive[3].chapter).toContain("1. Introduction");

    // Fifth highlight
    expect(firstFive[4].text).toContain("The structure of the system");
    expect(firstFive[4].color).toBe("yellow");
    expect(firstFive[4].page).toBe("12");
    expect(firstFive[4].location).toBe("175");
    expect(firstFive[4].chapter).toContain("1. Introduction");
  });
});
