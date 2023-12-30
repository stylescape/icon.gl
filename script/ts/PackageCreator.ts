import fs from 'fs';
import path from 'path';

interface PackageJson {
  name: string;
  version: string;
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  // ... other properties as needed
}

class PackageCreator {
  private packageJson: PackageJson;

  constructor(packageJson: PackageJson) {
    this.packageJson = packageJson;
  }

  async createPackageJson(outputDir: string): Promise<void> {
    const filePath = path.join(outputDir, 'package.json');
    const data = JSON.stringify(this.packageJson, null, 2);

    fs.writeFileSync(filePath, data, 'utf-8');
    console.log(`package.json created at ${filePath}`);
  }
}

export default PackageCreator;