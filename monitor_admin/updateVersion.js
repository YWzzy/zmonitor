import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';

const packageJsonPath = path.resolve('package.json');
const envFiles = [
  path.resolve('.env.production'),
  path.resolve('.env.development'),
];

async function updateVersion() {
  try {
    // 读取 package.json
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // 提示用户选择要更新的版本部分
    const { versionChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'versionChoice',
        message: 'Which part of the version would you like to increment?',
        choices: [
          { name: `Major (${packageJson.version.split('.')[0]}.0.0)`, value: 'major' },
          { name: `Minor (0.${packageJson.version.split('.')[1]}.0)`, value: 'minor' },
          { name: `Patch (0.0.${packageJson.version.split('.')[2]})`, value: 'patch' },
        ],
      },
    ]);

    // 更新版本号
    const versionParts = packageJson.version.split('.');

    switch (versionChoice) {
      case 'major':
        versionParts[0] = (parseInt(versionParts[0], 10) + 1).toString();
        versionParts[1] = '0';
        versionParts[2] = '0';
        break;
      case 'minor':
        versionParts[1] = (parseInt(versionParts[1], 10) + 1).toString();
        versionParts[2] = '0';
        break;
      case 'patch':
        versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString();
        break;
      default:
        console.log('Invalid choice. No changes made.');
        return;
    }

    packageJson.version = versionParts.join('.');
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
    console.log(`Version updated to ${packageJson.version}`);

    // 更新 .env 文件中的 VITE_VERSION 字段
    for (const envFile of envFiles) {
      let content = await fs.readFile(envFile, 'utf-8');

      // 使用正则表达式查找并替换 VITE_VERSION 字段
      const versionRegex = /VITE_VERSION=.*/;
      if (versionRegex.test(content)) {
        content = content.replace(versionRegex, `VITE_VERSION=${packageJson.version}`);
      } else {
        content += `\nVITE_VERSION=${packageJson.version}`;
      }

      await fs.writeFile(envFile, content, 'utf-8');
      console.log(`Updated VITE_VERSION in ${envFile}`);
    }

  } catch (error) {
    console.error('Error updating version:', error);
  }
}

updateVersion();
